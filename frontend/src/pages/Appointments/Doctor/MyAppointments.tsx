import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
    Calendar, Clock, User, MapPin, Video,
    AlertTriangle, Loader2, ChevronDown, ChevronUp,
    Check, X, Play, FileText
} from 'lucide-react';
import { getAppointments, updateAppointment, Appointment } from '../../../services/appointmentService';

const MyAppointmentsDoctor: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'todas' | 'hoy' | 'programadas' | 'finalizadas'>('programadas');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAppointments();
            setAppointments(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateAppointment(id, { status });
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error al actualizar la cita');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    };

    const now = new Date();
    const today = now.toDateString();

    const filteredAppointments = appointments.filter(apt => {
        switch (filter) {
            case 'hoy':
                return new Date(apt.date).toDateString() === today;
            case 'programadas':
                return apt.status === 'programada';
            case 'finalizadas':
                return apt.status === 'finalizada';
            default:
                return true;
        }
    }).sort((a, b) => {
        if (filter === 'finalizadas') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            programada: 'bg-blue-100 text-blue-700',
            finalizada: 'bg-green-100 text-green-700',
            cancelada: 'bg-red-100 text-red-700',
            reprogramada: 'bg-yellow-100 text-yellow-700',
            no_asistio: 'bg-gray-100 text-gray-700',
            en_atencion: 'bg-purple-100 text-purple-700',
        };
        const labels: Record<string, string> = {
            programada: 'Programada',
            finalizada: 'Finalizada',
            cancelada: 'Cancelada',
            reprogramada: 'Reprogramada',
            no_asistio: 'No asistió',
            en_atencion: 'En atención',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const programadasCount = appointments.filter(a => a.status === 'programada').length;
    const hoyCount = appointments.filter(a => new Date(a.date).toDateString() === today).length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DoctorNavbar />

            <div className="flex-1 pt-24">
                <main className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">Mi Agenda</h1>
                                    <p className="text-red-100">Gestiona tus citas médicas</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold">{hoyCount}</p>
                                <p className="text-red-100 text-sm">Citas hoy</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Programadas</p>
                                    <p className="text-3xl font-bold text-gray-800">{programadasCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Hoy</p>
                                    <p className="text-3xl font-bold text-gray-800">{hoyCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Finalizadas</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {appointments.filter(a => a.status === 'finalizada').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-bold text-gray-800">{appointments.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-2 flex-wrap mb-6">
                        {(['programadas', 'hoy', 'finalizadas', 'todas'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${filter === f
                                    ? 'bg-[#B71C1C] text-white shadow-lg'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow'
                                    }`}
                            >
                                {f === 'hoy' ? 'Hoy' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">Cargando agenda...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
                            <div className="text-center">
                                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar</h3>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={fetchData}
                                    className="px-6 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-semibold rounded-lg transition-colors shadow-lg"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay citas</h3>
                            <p className="text-gray-400">
                                {filter === 'hoy'
                                    ? 'No tienes citas programadas para hoy'
                                    : filter === 'programadas'
                                    ? 'No tienes citas programadas'
                                    : filter === 'finalizadas'
                                    ? 'No hay citas finalizadas'
                                    : 'No tienes citas en tu agenda'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAppointments.map((apt) => (
                                <DoctorAppointmentCard
                                    key={apt.id}
                                    appointment={apt}
                                    formatDate={formatDate}
                                    formatTime={formatTime}
                                    getStatusBadge={getStatusBadge}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

// Componente de tarjeta de cita para doctor
const DoctorAppointmentCard: React.FC<{
    appointment: Appointment;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    onUpdateStatus: (id: number, status: string) => void;
}> = ({ appointment, formatDate, formatTime, getStatusBadge, onUpdateStatus }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
    const isPast = new Date(appointment.date) < new Date();

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
            isToday && appointment.status === 'programada' ? 'ring-2 ring-yellow-400' : ''
        }`}>
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-[#B71C1C]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {appointment.Patient?.User?.name || 'Paciente'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {appointment.Patient?.User?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.date)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(appointment.date)}
                            </span>
                            <span className={`flex items-center gap-1 ${appointment.type === 'virtual' ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                {appointment.type === 'virtual' ? (
                                    <><Video className="w-4 h-4" /> Virtual</>
                                ) : (
                                    <><MapPin className="w-4 h-4" /> Presencial</>
                                )}
                            </span>
                            {getStatusBadge(appointment.status)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {appointment.status === 'programada' && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/medical_consultation/${appointment.id}`);
                                    }}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Iniciar atención"
                                >
                                    <Play className="w-5 h-5" />
                                </button>
                                {appointment.type === 'virtual' && appointment.meetingLink && (
                                    <a
                                        href={appointment.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                        title="Iniciar videollamada"
                                    >
                                        <Video className="w-5 h-5" />
                                    </a>
                                )}
                            </>
                        )}
                        {appointment.status === 'en_atencion' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/medical_consultation/${appointment.id}`);
                                }}
                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors animate-pulse"
                                title="Continuar atención"
                            >
                                <Play className="w-5 h-5" />
                            </button>
                        )}
                        {expanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Detalles expandidos */}
            {expanded && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                    <div className="pt-4 space-y-4">
                        {appointment.type === 'presencial' && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Ubicación:</span>
                                <span className="font-medium text-gray-800">
                                    {appointment.location} - {appointment.room}
                                </span>
                            </div>
                        )}

                        {appointment.type === 'virtual' && appointment.meetingLink && appointment.status !== 'finalizada' && (
                            <div>
                                <a
                                    href={appointment.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                                >
                                    <Video className="w-4 h-4" />
                                    Iniciar videollamada
                                </a>
                            </div>
                        )}

                        {appointment.notes && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Notas</h4>
                                <p className="text-gray-800">{appointment.notes}</p>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {appointment.status === 'programada' && (
                                <>
                                    <button
                                        onClick={() => navigate(`/medical_consultation/${appointment.id}`)}
                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4" />
                                        Iniciar Atención
                                    </button>
                                    <button
                                        onClick={() => onUpdateStatus(appointment.id, 'no_asistio')}
                                        className="px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        No Asistió
                                    </button>
                                </>
                            )}
                            {appointment.status === 'en_atencion' && (
                                <button
                                    onClick={() => navigate(`/medical_consultation/${appointment.id}`)}
                                    className="px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Continuar Atención
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/medical_history/${appointment.patientId}`)}
                                className="px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Ver Historial
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsDoctor;
