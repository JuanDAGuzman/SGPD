const { Op, fn, col } = require('sequelize');
const Appointment = require('../models/Appointment');

exports.citasPorEstado = async (req, res) => {
  try {
    const { start, end } = req.query; 
    const where = {};
    if (start && end) {
      where.date = { [Op.between]: [start, end] };
    }

    const resultado = await Appointment.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'cantidad']
      ],
      where,
      group: ['status']
    });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const PatientTreatment = require('../models/PatientTreatment');
const Treatment = require('../models/Treatment');

exports.tratamientosMasUsados = async (req, res) => {
  try {
    const resultado = await PatientTreatment.findAll({
      attributes: [
        'treatmentId',
        [fn('COUNT', col('treatmentId')), 'veces_usado']
      ],
      include: [{ model: Treatment, attributes: ['name'] }],
      group: ['treatmentId', 'Treatment.id'],
      order: [[fn('COUNT', col('treatmentId')), 'DESC']]
    });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const User = require('../models/User');

exports.pacientesPorMes = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = { role: 'patient' };
    if (start && end) {
      where.createdAt = { [Op.between]: [start, end] };
    }

    const resultado = await User.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'mes'],
        [fn('COUNT', col('id')), 'cantidad']
      ],
      where,
      group: ['mes'],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']]
    });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
