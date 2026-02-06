import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorNavbar from '../../../../components/NavBar/DoctorNavbar';
import {
    Clipboard, Activity, Save, ArrowLeft, CheckCircle,
    Stethoscope, FileText, AlertCircle, Video, Footprints, FlaskConical
} from 'lucide-react';
import { getAppointmentById, updateAppointment, Appointment } from '../../../../services/appointmentService';
import { createMedicalHistory } from '../../../../services/medicalHistoryService'; // Asegurar ruta correcta
import { createDiabeticFootRecord } from '../../../../services/diabeticFootService';
import { getAllLabResults } from '../../../../services/labResultService';
import PrescriptionBuilder from '../../../../components/MedicalConsultation/PrescriptionBuilder';

// Interfaces
interface ConsultationData {
    reason: string;
    currentIllness: string;
    background: string;
    physicalExam: string;
    diagnosis: string;
    treatment: string; // Legacy
    notes: string;
    prescriptions?: any[];
}

const MedicalConsultation: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [appointment, setAppointment] = useState<any>(null);
    const [step, setStep] = useState(1); // 1: Anamnesis, 2: Examen, 3: Pie Diabético, 4: Diagnostico/Plan
    const [showLabResults, setShowLabResults] = useState(false);
    const [labResults, setLabResults] = useState<any[]>([]);

    // Estado para evaluación de pie diabético
    const [footEval, setFootEval] = useState({
        inspection: '',
        sensitivity: '', // Monofilamento/Diapasón
        vascular: '',    // Pulsos
        riskLevel: 'bajo'
    });

    const [formData, setFormData] = useState<ConsultationData>({
        reason: '',
        currentIllness: '',
        background: '',
        physicalExam: '',
        diagnosis: '',
        treatment: '',
        notes: ''
    });

    useEffect(() => {
        if (appointmentId) {
            loadAppointment(appointmentId);
        }
    }, [appointmentId]);

    const loadAppointment = async (id: string) => {
        try {
            const data = await getAppointmentById(parseInt(id));
            setAppointment(data);
            // Actualizar estado a 'en_atencion' si no lo está
            if (data.status === 'programada') {
                updateAppointment(parseInt(id), { status: 'en_atencion' }).catch(console.warn);
            }

            // Cargar resultados de laboratorio del paciente
            if (data.patientId) {
                getAllLabResults(data.patientId).then(results => {
                    if (Array.isArray(results)) setLabResults(results);
                }).catch(err => console.error("Error loading labs", err));
            }
        } catch (error) {
            console.error("Error loading appointment", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFinish = async () => {
        if (!appointment) return;

        // Validación: Solo Diagnóstico obligatorio (y motivo, implícito en paso 1)
        if (!formData.diagnosis) {
            alert("Por favor, ingresa un diagnóstico principal antes de finalizar."); // Mejorar con UI en futuro
            return;
        }

        // Confirmación visual simple en lugar de window.alert blocking excesivo
        const confirmFinish = window.confirm("¿Estás seguro de finalizar la consulta? Esta acción no se puede deshacer.");
        if (!confirmFinish) return;

        try {
            setSaving(true);

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};

            // 1. Guardar Historia Clínica
            await createMedicalHistory({
                patientId: appointment.patientId,
                doctorId: appointment.doctorId || user.doctorId, // Fallback
                appointmentId: appointment.id,
                ...formData
            });

            // 2. Guardar Evaluación de Pie Diabético (si se llenó algo)
            if (footEval.inspection || footEval.sensitivity || footEval.vascular) {
                const description = JSON.stringify({
                    inspection: footEval.inspection,
                    sensitivity: footEval.sensitivity,
                    vascular: footEval.vascular,
                    riskLevel: footEval.riskLevel
                });

                await createDiabeticFootRecord({
                    patientId: appointment.patientId,
                    date: new Date().toISOString(),
                    description: description
                });
            }

            // 3. Finalizar Cita
            await updateAppointment(appointment.id, { status: 'finalizada' });

            // Navegación
            navigate('/dashboard_doctor');

        } catch (error: any) {
            console.error("Error saving consultation", error);
            alert("Error al guardar consulta: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center flex justify-center"><Activity className="animate-spin text-[#B71C1C]" /></div>;
    if (!appointment) return <div className="p-10 text-center text-red-600">Cita no encontrada</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DoctorNavbar />

            <div className="flex-1 container mx-auto px-4 py-8 pt-24">
                {/* Header Consulta Style Professional */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-t-4 border-[#B71C1C]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <button onClick={() => navigate(-1)} className="p-2 hover:bg-red-50 text-gray-500 hover:text-[#B71C1C] rounded-full transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Atención Médica</h1>
                                <span className="px-3 py-1 bg-red-100 text-[#B71C1C] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> En Curso
                                </span>
                            </div>
                            <div className="ml-10">
                                <h2 className="text-lg font-medium text-gray-600">
                                    Paciente: <span className="text-gray-900 font-bold text-xl">{appointment.Patient?.User?.name}</span>
                                </h2>
                                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Clipboard className="w-4 h-4" /> ID: {appointment.Patient?.id}</span>
                                    <span>•</span>
                                    <span>{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    {appointment.type === 'virtual' && (
                                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                                            <Video className="w-4 h-4" /> Cita Virtual
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLabResults(true)}
                                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <FlaskConical className="w-5 h-5 text-blue-600" />
                                <span className="hidden md:inline">Ver Resultados</span>
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Activity className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                Finalizar Consulta
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel de Videollamada (Solo si es virtual y activa) */}
                {appointment.type === 'virtual' && appointment.meetingLink && appointment.status !== 'finalizada' && (
                    <div className="mb-8 bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
                        <div className="bg-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-800">
                            <div className="flex items-center gap-2 text-white">
                                <Video className="w-4 h-4 text-green-400" />
                                <span className="font-medium text-sm">Sala de Teleconsulta</span>
                            </div>
                            <a
                                href={appointment.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                Abrir en nueva ventana
                            </a>
                        </div>
                        <div className="aspect-video w-full bg-gray-900 flex items-center justify-center">
                            {/* Iframe de Jitis */}
                            <iframe
                                src={appointment.meetingLink}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                className="w-full h-full border-0"
                                style={{ minHeight: '400px' }}
                            ></iframe>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar de Pasos */}
                    <div className="lg:col-span-1 space-y-4">
                        <StepButton
                            active={step === 1}
                            completed={step > 1}
                            icon={<Clipboard />}
                            title="1. Anamnesis"
                            desc="Motivo y Antecedentes"
                            onClick={() => setStep(1)}
                        />
                        <StepButton
                            active={step === 2}
                            completed={step > 2}
                            icon={<Stethoscope />}
                            title="2. Examen Físico"
                            desc="Hallazgos clínicos"
                            onClick={() => setStep(2)}
                        />
                        <StepButton
                            active={step === 3}
                            completed={step > 3}
                            icon={<Footprints />}
                            title="3. Pie Diabético"
                            desc="Evaluación de riesgo"
                            onClick={() => setStep(3)}
                        />
                        <StepButton
                            active={step === 4}
                            completed={step > 4}
                            icon={<FileText />}
                            title="4. Diagnóstico y Plan"
                            desc="Conclusiones y Receta"
                            onClick={() => setStep(4)}
                        />
                    </div>

                    {/* Formulario Principal */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-8 min-h-[600px] border border-gray-100">

                        {step === 1 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Anamnesis</h3>
                                    <p className="text-gray-500 text-sm mt-1">Recopilación de información clínica inicial.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Motivo de Consulta <span className="text-red-500">*</span></label>
                                            <textarea
                                                name="reason"
                                                value={formData.reason}
                                                onChange={handleChange}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                                rows={3}
                                                placeholder="Describe brevemente la razón principal de la visita..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Enfermedad Actual</label>
                                            <textarea
                                                name="currentIllness"
                                                value={formData.currentIllness}
                                                onChange={handleChange}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none transition-all bg-gray-50 focus:bg-white"
                                                rows={4}
                                                placeholder="Detalles cronológicos y sintomáticos del padecimiento..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Antecedentes</label>
                                            <textarea
                                                name="background"
                                                value={formData.background}
                                                onChange={handleChange}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none transition-all bg-gray-50 focus:bg-white"
                                                rows={3}
                                                placeholder="Alergias, patologías previas, quirúrgicos, farmacológicos..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                                    >
                                        Siguiente: Examen Físico
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Examen Físico</h3>
                                    <p className="text-gray-500 text-sm mt-1">Registro de hallazgos objetivos.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hallazgos Clínicos</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                                        <textarea
                                            name="physicalExam"
                                            value={formData.physicalExam}
                                            onChange={handleChange}
                                            className="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none transition-all bg-gray-50 focus:bg-white font-mono text-sm"
                                            rows={12}
                                            placeholder="Signos vitales: TA, FC, FR, Temp...
Inspección general...
Auscultación..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-100">
                                    <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Atrás</button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                                    >
                                        Siguiente: Pie Diabético
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Evaluación Pie Diabético</h3>
                                    <p className="text-gray-500 text-sm mt-1">Valoración específica de riesgo y deformidades.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Inspección General</label>
                                        <textarea
                                            value={footEval.inspection}
                                            onChange={(e) => setFootEval({ ...footEval, inspection: e.target.value })}
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none transition-all bg-gray-50 focus:bg-white"
                                            rows={3}
                                            placeholder="Color, temperatura, hidratación, callosidades, deformidades..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sensibilidad (Monofilamento)</label>
                                        <select
                                            value={footEval.sensitivity}
                                            onChange={(e) => setFootEval({ ...footEval, sensitivity: e.target.value })}
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none bg-white"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Conservada">Conservada (Normal)</option>
                                            <option value="Disminuida">Disminuida</option>
                                            <option value="Ausente">Ausente (Riesgo Alto)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Estado Vascular (Pulsos)</label>
                                        <select
                                            value={footEval.vascular}
                                            onChange={(e) => setFootEval({ ...footEval, vascular: e.target.value })}
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none bg-white"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Palpables">Palpables (Normal)</option>
                                            <option value="Debiles">Débiles</option>
                                            <option value="Ausentes">Ausentes (Riesgo Alto)</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 bg-red-50 p-4 rounded-lg border border-red-100">
                                        <label className="block text-sm font-bold text-red-800 mb-2">Nivel de Riesgo Estimado</label>
                                        <div className="flex gap-4">
                                            {['Bajo', 'Moderado', 'Alto', 'Critico'].map((level) => (
                                                <label key={level} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="riskLevel"
                                                        value={level.toLowerCase()}
                                                        checked={footEval.riskLevel === level.toLowerCase()}
                                                        onChange={(e) => setFootEval({ ...footEval, riskLevel: e.target.value })}
                                                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{level}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-100">
                                    <button onClick={() => setStep(2)} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Atrás</button>
                                    <button
                                        onClick={() => setStep(4)}
                                        className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                                    >
                                        Siguiente: Diagnóstico
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Diagnóstico y Plan</h3>
                                    <p className="text-gray-500 text-sm mt-1">Conclusión clínica y conducta a seguir.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Diagnóstico Principal <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none bg-white font-bold text-lg text-gray-800 shadow-sm"
                                            placeholder="Ej: Rinofaringitis Aguda J00"
                                        />
                                    </div>

                                    <div>
                                        <PrescriptionBuilder
                                            prescriptions={formData.prescriptions || []}
                                            setPrescriptions={(newPrescriptions: any) => setFormData({ ...formData, prescriptions: newPrescriptions })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Notas / Recomendaciones</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] outline-none bg-gray-50 focus:bg-white"
                                            rows={3}
                                            placeholder="Signos de alarma, control, incapacidad..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <p className="text-sm text-blue-800 leading-relaxed">
                                            Verifica que toda la información sea correcta. Al finalizar, se generará la historia clínica oficial y la cita se marcará como completada.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-100">
                                    <button onClick={() => setStep(3)} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Atrás</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal de Resultados de Laboratorio */}
            {showLabResults && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn" onClick={() => setShowLabResults(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Resultados de Laboratorio</h3>
                                <p className="text-sm text-gray-500">Historial de exámenes del paciente</p>
                            </div>
                            <button onClick={() => setShowLabResults(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <span className="text-gray-500 font-bold text-xl">×</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {labResults.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <FlaskConical className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No hay resultados registrados para este paciente.</p>
                                </div>
                            ) : (
                                labResults.map((lab: any) => (
                                    <div key={lab.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{lab.description || 'Sin descripción'}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(lab.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {lab.resultFile && (
                                            <a
                                                href={lab.resultFile}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white border border-gray-200 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 hover:text-blue-800 transition-colors"
                                            >
                                                Ver Archivo
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente StepButton mejorado visualmente
const StepButton = ({ active, completed, icon, title, desc, onClick }: any) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${active
                ? 'border-[#B71C1C] bg-white ring-1 ring-[#B71C1C] shadow-lg transform scale-[1.02]'
                : completed
                    ? 'border-gray-200 bg-gray-50 opacity-75 hover:opacity-100 hover:bg-white'
                    : 'border-transparent hover:bg-white hover:shadow-sm text-gray-400'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg transition-colors ${active ? 'bg-red-50 text-[#B71C1C]' :
                    completed ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {completed && !active ? <CheckCircle className="w-6 h-6" /> : icon}
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${active ? 'text-[#B71C1C]' : 'text-gray-700'}`}>{title}</h4>
                    <p className={`text-xs ${active ? 'text-red-800/60' : 'text-gray-500'}`}>{desc}</p>
                </div>
            </div>
        </button>
    );
};

export default MedicalConsultation;
