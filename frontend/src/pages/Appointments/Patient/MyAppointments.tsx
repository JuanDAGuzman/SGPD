import React, { useState, useEffect } from 'react';
import PatientNavbar from '../../../components/NavBar/PatientNavbar';
import Footer from '../../../components/Footer/Footer';
import {
    Calendar, Clock, User, MapPin, Video,
    AlertTriangle, Loader2, ChevronDown, ChevronUp,
    Check, X, Filter, CheckCircle, FileText, Activity
} from 'lucide-react';
import { getAppointments, getAppointmentRequests, cancelAppointment, Appointment, AppointmentRequest } from '../../../services/appointmentService';

const MyAppointmentsPatient: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'programadas' | 'pasadas' | 'solicitudes'>('programadas');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [appointmentsData, requestsData] = await Promise.all([
                getAppointments(),
                getAppointmentRequests()
            ]);

            setAppointments(appointmentsData);
            setRequests(requestsData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id: number) => {
        try {
            await cancelAppointment(id);
            showToast('Cita cancelada exitosamente', 'success');
            fetchData();
        } catch (err: any) {
            showToast(err.message || 'Error al cancelar la cita', 'error');
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
    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.date) >= now && apt.status === 'programada'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pastAppointments = appointments.filter(apt =>
        new Date(apt.date) < now || apt.status !== 'programada'
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calcular estadísticas
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'finalizada').length;
    const pendingRequests = requests.filter(req => req.status === 'pendiente').length;
    const todayAppointments = upcomingAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === now.toDateString();
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            programada: 'bg-blue-100 text-blue-700',
            finalizada: 'bg-green-100 text-green-700',
            cancelada: 'bg-red-100 text-red-700',
            reprogramada: 'bg-yellow-100 text-yellow-700',
            no_asistio: 'bg-gray-100 text-gray-700',
            en_atencion: 'bg-purple-100 text-purple-700',
            pendiente: 'bg-yellow-100 text-yellow-700',
            aceptada: 'bg-green-100 text-green-700',
            rechazada: 'bg-red-100 text-red-700',
        };
        const labels: Record<string, string> = {
            programada: 'Programada',
            finalizada: 'Finalizada',
            cancelada: 'Cancelada',
            reprogramada: 'Reprogramada',
            no_asistio: 'No asistió',
            en_atencion: 'En atención',
            pendiente: 'Pendiente',
            aceptada: 'Aceptada',
            rechazada: 'Rechazada',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PatientNavbar />

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <X className="w-5 h-5" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="flex-1 pt-24">
                <main className="container mx-auto px-4 py-8">
                    {/* Red Gradient Header with Stats */}
                    <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Mis Citas Médicas</h1>
                                <p className="text-white/90">Gestiona tus consultas y solicitudes</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Próximas */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Próximas</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {upcomingAppointments.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-2 h-1 bg-blue-600 rounded-full"></div>
                            </div>

                            {/* Hoy */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Hoy</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {todayAppointments.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center relative">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                        {todayAppointments.length > 0 && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 h-1 bg-orange-600 rounded-full"></div>
                            </div>

                            {/* Completadas */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Completadas</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {completedAppointments}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-2 h-1 bg-green-600 rounded-full"></div>
                            </div>

                            {/* Solicitudes */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Solicitudes</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {pendingRequests}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-2 h-1 bg-purple-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('programadas')}
                            className={`px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${activeTab === 'programadas'
                                ? 'bg-[#B71C1C] text-white shadow-lg shadow-[#B71C1C]/30'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            Próximas ({upcomingAppointments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pasadas')}
                            className={`px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${activeTab === 'pasadas'
                                ? 'bg-[#B71C1C] text-white shadow-lg shadow-[#B71C1C]/30'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            Historial ({pastAppointments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('solicitudes')}
                            className={`px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${activeTab === 'solicitudes'
                                ? 'bg-[#B71C1C] text-white shadow-lg shadow-[#B71C1C]/30'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            Solicitudes ({requests.length})
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Próximas citas */}
                            {activeTab === 'programadas' && (
                                <div className="space-y-4">
                                    {upcomingAppointments.length === 0 ? (
                                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes citas programadas</h3>
                                            <p className="text-gray-400 mb-4">Solicita una cita desde tu dashboard</p>
                                            <a
                                                href="/dashboard_patient"
                                                className="inline-block px-6 py-2 bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000]"
                                            >
                                                Ir al Dashboard
                                            </a>
                                        </div>
                                    ) : (
                                        upcomingAppointments.map((apt) => (
                                            <AppointmentCard
                                                key={apt.id}
                                                appointment={apt}
                                                formatDate={formatDate}
                                                formatTime={formatTime}
                                                getStatusBadge={getStatusBadge}
                                                onCancel={() => handleCancelAppointment(apt.id)}
                                                canCancel={true}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Historial */}
                            {activeTab === 'pasadas' && (
                                <div className="space-y-4">
                                    {pastAppointments.length === 0 ? (
                                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-600">No tienes citas anteriores</h3>
                                        </div>
                                    ) : (
                                        pastAppointments.map((apt) => (
                                            <AppointmentCard
                                                key={apt.id}
                                                appointment={apt}
                                                formatDate={formatDate}
                                                formatTime={formatTime}
                                                getStatusBadge={getStatusBadge}
                                                canCancel={false}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Solicitudes */}
                            {activeTab === 'solicitudes' && (
                                <div className="space-y-4">
                                    {requests.length === 0 ? (
                                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-600">No tienes solicitudes</h3>
                                        </div>
                                    ) : (
                                        requests.map((req) => (
                                            <div key={req.id} className="bg-white rounded-xl shadow-lg p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {getStatusBadge(req.status)}
                                                            {req.specialty && (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                                    {req.specialty}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-800 font-medium mb-2">{req.message}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Fecha preferida: {req.preferredDate ? formatDate(req.preferredDate) : 'Sin especificar'}
                                                        </p>
                                                        {req.rejectionReason && (
                                                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                                                <p className="text-sm text-red-600">
                                                                    <strong>Motivo de rechazo:</strong> {req.rejectionReason}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

// Componente de tarjeta de cita
const AppointmentCard: React.FC<{
    appointment: Appointment;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    onCancel?: () => void;
    canCancel: boolean;
}> = ({ appointment, formatDate, formatTime, getStatusBadge, onCancel, canCancel }) => {
    const [expanded, setExpanded] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${appointment.type === 'virtual' ? 'bg-blue-100' : 'bg-red-100'
                                }`}>
                                {appointment.type === 'virtual' ? (
                                    <Video className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <MapPin className="w-6 h-6 text-[#B71C1C]" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Consulta {appointment.Doctor?.specialty || 'General'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Dr. {appointment.Doctor?.User?.name || 'Por asignar'}
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
                            {getStatusBadge(appointment.status)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
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
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Ubicación:</span>
                                    <span className="font-medium text-gray-800">
                                        {appointment.location} - {appointment.room}
                                    </span>
                                </div>
                                {(appointment as any).address && (
                                    <div className="w-full mt-2 rounded-lg overflow-hidden border border-gray-200">
                                        <div className="text-xs text-gray-500 p-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {appointment.location} - {(appointment as any).address}
                                        </div>
                                        <iframe
                                            width="100%"
                                            height="200"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps?q=${encodeURIComponent(appointment.location + ', ' + (appointment as any).address)}&output=embed`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
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
                                    Unirse a la videollamada
                                </a>
                            </div>
                        )}

                        {appointment.notes && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Notas</h4>
                                <p className="text-gray-800">{appointment.notes}</p>
                            </div>
                        )}

                        {canCancel && appointment.status === 'programada' && onCancel && (
                            <div className="pt-2">
                                {!showCancelConfirm ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCancelConfirm(true);
                                        }}
                                        className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar Cita
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <span className="text-sm text-red-600 flex-1">¿Seguro que deseas cancelar?</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCancel();
                                                setShowCancelConfirm(false);
                                            }}
                                            className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                                        >
                                            Sí, cancelar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCancelConfirm(false);
                                            }}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300"
                                        >
                                            No
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPatient;
