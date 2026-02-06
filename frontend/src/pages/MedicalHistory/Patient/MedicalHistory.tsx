import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PatientNavbar from '../../../components/NavBar/PatientNavbar';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
    FileText, User, Calendar, Clock, Activity,
    Pill, AlertCircle, ChevronDown, ChevronUp, Stethoscope
} from 'lucide-react';
import { getMedicalHistoryByPatient } from '../../../services/medicalHistoryService';

// Interfaces
interface DoctorInfo {
    User: {
        name: string;
        email: string;
    }
}
interface AppointmentInfo {
    date: string;
    type: string;
}

interface MedicalRecord {
    id: number;
    createdAt: string;
    diagnosis: string;
    treatment?: string;
    notes?: string;
    reason?: string;
    currentIllness?: string;
    background?: string;
    physicalExam?: string;
    Doctor?: DoctorInfo;
    Appointment?: AppointmentInfo;
    prescriptions?: any[]; // Estructura de recetas
}

const PatientMedicalHistory: React.FC = () => {
    const { patientId: urlPatientId } = useParams<{ patientId?: string }>();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDoctor, setIsDoctor] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [urlPatientId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) throw new Error("No hay sesión activa");

            const user = JSON.parse(userStr);

            // Determinar si es doctor viendo el historial de un paciente
            const isViewingAsDoctor = user.role === 'doctor' && urlPatientId;
            setIsDoctor(isViewingAsDoctor);

            // Usar patientId de la URL si existe, sino usar el del usuario
            let targetPatientId: number;
            if (urlPatientId) {
                targetPatientId = parseInt(urlPatientId);
            } else {
                if (!user.patientId) throw new Error("Identificación de paciente no encontrada");
                targetPatientId = user.patientId;
            }

            const data = await getMedicalHistoryByPatient(targetPatientId);
            setRecords(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {isDoctor ? <DoctorNavbar /> : <PatientNavbar />}

            <main className="flex-1 container mx-auto px-4 py-8 pt-32">
                <div className="bg-gradient-to-r from-[#B71C1C] to-[#800000] rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Mi Historia Clínica</h1>
                        <p className="text-red-100 max-w-2xl">
                            Consulta tu historial médico completo, diagnósticos y tratamientos recetados por tus doctores.
                            Tu información está protegida y disponible para ti.
                        </p>
                    </div>
                    <FileText className="absolute right-0 bottom-0 text-white/10 w-64 h-64 -mr-10 -mb-10 transform rotate-12" />
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Activity className="w-10 h-10 text-[#B71C1C] animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Cargando tu historial...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                        {error}
                        <button onClick={fetchHistory} className="block mx-auto mt-4 text-blue-600 underline">Reintentar</button>
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800">Aún no tienes registros médicos</h3>
                        <p className="text-gray-500 mt-2">Los detalles de tus consultas aparecerán aquí una vez finalizadas.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {records.map((record) => (
                            <MedicalRecordCard key={record.id} record={record} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

const MedicalRecordCard: React.FC<{ record: MedicalRecord }> = ({ record }) => {
    const [expanded, setExpanded] = useState(false);

    // Formatear fechas
    const dateObj = record.Appointment?.date ? new Date(record.Appointment.date) : new Date(record.createdAt);
    const dateStr = dateObj.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${expanded ? 'shadow-md border-red-200' : 'border-gray-100 hover:shadow-md'}`}>
            <div
                className="p-6 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${expanded ? 'bg-[#B71C1C] text-white shadow-lg' : 'bg-red-50 text-[#B71C1C]'}`}>
                            <Calendar className="w-7 h-7" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dateStr} - {timeStr}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="uppercase tracking-wide font-bold text-xs">{record.Appointment?.type || 'Consulta'}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{record.diagnosis || 'Diagnóstico Reservado'}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <User className="w-4 h-4" />
                                <span>Dr. {record.Doctor?.User?.name || 'Médico Tratante'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                        {(record.treatment || (record.prescriptions && record.prescriptions.length > 0)) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                                <Pill className="w-3 h-3" /> Con Receta
                            </span>
                        )}
                        {expanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </div>
                </div>
            </div>

            {/* Detalle Expandido */}
            {expanded && (
                <div className="border-t border-gray-100 px-6 py-8 bg-gray-50/50 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda: Clínico */}
                        <div className="space-y-6">
                            <SectionContent title="Motivo de Consulta" content={record.reason} icon={<Activity className="w-4 h-4" />} />
                            <SectionContent title="Historia / Comentarios" content={record.currentIllness || record.notes} />
                            <SectionContent title="Antecedentes" content={record.background} />
                        </div>

                        {/* Columna Derecha: Plan y Tratamiento (Resaltado) */}
                        <div className="space-y-6">
                            {(record.prescriptions && record.prescriptions.length > 0) || record.treatment ? (
                                <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-lg mb-4 border-b border-green-100 pb-2">
                                        <Pill className="w-5 h-5" />
                                        <h4>Tratamiento y Receta</h4>
                                    </div>

                                    {/* Structured Prescriptions */}
                                    {record.prescriptions && record.prescriptions.length > 0 && (
                                        <div className="space-y-4 mb-4">
                                            {record.prescriptions.map((p, idx) => (
                                                <div key={idx} className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                                                    <div className="font-bold text-gray-800">{p.medicationName}</div>
                                                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                        {p.dosage && <span><span className="font-medium">Dosis:</span> {p.dosage}</span>}
                                                        {p.frequency && <span><span className="font-medium">Frec:</span> {p.frequency}</span>}
                                                        {p.durationDays && <span><span className="font-medium">Duración:</span> {p.durationDays} días</span>}
                                                    </div>
                                                    {p.notes && <div className="text-xs text-gray-500 mt-1 italic">{p.notes}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Legacy Text Treatment Fallback */}
                                    {record.treatment && !record.prescriptions?.length && (
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-green-50/30 p-4 rounded-lg leading-relaxed">
                                            {record.treatment}
                                        </pre>
                                    )}

                                    <p className="text-xs text-green-600 mt-3 flex items-start gap-1">
                                        <AlertCircle className="w-3 h-3 mt-0.5" />
                                        Sigue estrictamente las indicaciones de tu médico sobre dosis y duración.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-sm italic text-center">
                                    No se prescribieron medicamentos en esta consulta.
                                </div>
                            )}

                            {record.physicalExam && (
                                <SectionContent title="Hallazgos Físicos" content={record.physicalExam} icon={<Stethoscope className="w-4 h-4" />} />
                            )}

                            <SectionContent title="Recomendaciones / Notas" content={record.notes} isNote />
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-400">
                            Registro Médico Electrónico generado el {new Date(record.createdAt).toLocaleString()} <br />
                            ID Registro: #{record.id}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const SectionContent = ({ title, content, icon, isNote }: any) => {
    if (!content) return null;
    return (
        <div className={isNote ? "bg-yellow-50 p-4 rounded-lg border border-yellow-100" : ""}>
            <h4 className={`font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2 ${isNote ? "text-yellow-800" : "text-gray-500"}`}>
                {icon} {title}
            </h4>
            <p className={`text-sm leading-relaxed whitespace-pre-line ${isNote ? "text-yellow-900" : "text-gray-700"}`}>
                {content}
            </p>
        </div>
    );
};

export default PatientMedicalHistory;
