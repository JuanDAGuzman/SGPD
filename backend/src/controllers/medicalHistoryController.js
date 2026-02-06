const MedicalHistory = require('../models/MedicalHistory');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const PatientTreatment = require('../models/PatientTreatment');
const DiabeticFootRecord = require('../models/DiabeticFootRecord'); // Missing import
const LabResult = require('../models/LabResult'); // Potentially useful
const sequelize = require('../config/database');
const { Op } = require('sequelize'); // Missing Op import

exports.create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            patientId, doctorId, appointmentId,
            reason, currentIllness, background,
            physicalExam, diagnosis, notes,
            prescriptions // Array of { name, dosage, frequency, days, notes }
        } = req.body;

        // Validación básica
        if (!patientId || !doctorId || !diagnosis) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // 1. Crear Historial
        const record = await MedicalHistory.create({
            patientId,
            doctorId,
            appointmentId,
            reason,
            currentIllness,
            background,
            physicalExam,
            diagnosis,
            // treatment (text legacy) can be auto-generated from prescriptions if needed, or left empty
            notes
        }, { transaction: t });

        // 2. Crear Recetas (PatientTreatments)
        if (prescriptions && Array.isArray(prescriptions) && prescriptions.length > 0) {
            const treatmentsData = prescriptions.map(p => {
                // Calculate endDate
                const start = new Date();
                const end = new Date();
                end.setDate(start.getDate() + (parseInt(p.days) || 0));

                return {
                    patientId,
                    medicalHistoryId: record.id,
                    prescribedBy: doctorId,
                    medicationName: p.name,
                    dosage: p.dosage,
                    frequency: p.frequency,
                    durationDays: p.days,
                    startDate: start,
                    endDate: end,
                    notes: p.notes,
                    status: 'active'
                };
            });

            await PatientTreatment.bulkCreate(treatmentsData, { transaction: t });
        }

        await t.commit();
        res.status(201).json(record);

    } catch (err) {
        await t.rollback();
        console.error("Error creating medical history:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getByPatient = async (req, res) => {
    try {
        const { patientId } = req.query;

        // Fetch History
        const history = await MedicalHistory.findAll({
            where: { patientId },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name', 'email'] }]
                },
                {
                    model: Appointment,
                    attributes: ['date', 'type']
                },
                // Include Treatments linked to this history?
                // Need to define MedicalHistory.hasMany(PatientTreatment) in Model or Association setup
            ],
            order: [['createdAt', 'DESC']]
        });

        // Manual fetch of treatments 
        const historiesWithMeds = await Promise.all(history.map(async (h) => {
            const plain = h.toJSON();
            const meds = await PatientTreatment.findAll({ where: { medicalHistoryId: h.id } });
            plain.prescriptions = meds;
            return plain;
        }));

        res.json(historiesWithMeds);
    } catch (err) {
        console.error("Error fetching patient history:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getPatientStats = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) return res.status(400).json({ error: "Falta patientId" });

        const activeTreatments = await PatientTreatment.count({
            where: {
                patientId,
                status: 'active'
                // Removed date check to match widget logic for now, or ensure Op is working
            }
        });

        // Consultations: Count Medical History OR Finalized Appointments?
        // Let's count Medical History as it implies a clinical record.
        const consultations = await MedicalHistory.count({
            where: { patientId }
        });

        // Evaluaciones: Sum of Diabetic Foot Records + Lab Results
        const diabeticRecords = await DiabeticFootRecord.count({ where: { patientId } });
        const labResults = await LabResult.count({ where: { patientId } });
        const evaluations = diabeticRecords + labResults;

        res.json({
            treatments: activeTreatments,
            consultations,
            evaluations
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const record = await MedicalHistory.findByPk(req.params.id, {
            include: [Doctor, Appointment]
        });
        if (!record) return res.status(404).json({ message: 'No encontrado' });

        // Fetch prescriptions associated
        const treatments = await PatientTreatment.findAll({ where: { medicalHistoryId: record.id } });

        const response = record.toJSON();
        response.prescriptions = treatments;

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// New endpoint for Active Treatments Dashboard
exports.getActiveTreatments = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) return res.status(400).json({ error: 'Patient ID required' });

        const treatments = await PatientTreatment.findAll({
            where: {
                patientId,
                status: 'active'
            },
            include: [{
                model: Doctor,
                include: [{ model: User, attributes: ['name'] }]
            }],
            order: [['startDate', 'DESC']]
        });
        res.json(treatments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
