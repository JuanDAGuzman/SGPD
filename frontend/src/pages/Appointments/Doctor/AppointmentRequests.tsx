import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
    ClipboardList, Clock, User, Calendar, MapPin, Video,
    Check, X, AlertTriangle, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    getAppointmentRequests,
    updateAppointmentRequestStatus,
    createAppointment,
    AppointmentRequest
} from '../../../services/appointmentService';

const AppointmentRequests: React.FC = () => {
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [filter, setFilter] = useState<'pendiente' | 'aceptada' | 'rechazada' | 'todas'>('pendiente');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAppointmentRequests(
                filter === 'todas' ? {} : { status: filter }
            );
            setRequests(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar las solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Sin especificar';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pendiente':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pendiente</span>;
            case 'aceptada':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Aceptada</span>;
            case 'rechazada':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rechazada</span>;
            default:
                return null;
        }
    };

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
                                    <ClipboardList className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">Solicitudes de Cita</h1>
                                    <p className="text-red-100">Revisa y gestiona las solicitudes de los pacientes</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold">{requests.filter(r => r.status === 'pendiente').length}</p>
                                <p className="text-red-100 text-sm">Pendientes</p>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['pendiente', 'aceptada', 'rechazada', 'todas'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${filter === f
                                    ? 'bg-[#B71C1C] text-white shadow-lg'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Lista de solicitudes */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchRequests}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No hay solicitudes</h3>
                            <p className="text-gray-400">
                                {filter === 'pendiente'
                                    ? 'No tienes solicitudes pendientes por atender'
                                    : `No hay solicitudes con estado "${filter}"`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    onAccept={() => {
                                        setSelectedRequest(request);
                                        setShowAssignModal(true);
                                    }}
                                    onReject={() => {
                                        setSelectedRequest(request);
                                        setShowRejectModal(true);
                                    }}
                                    formatDate={formatDate}
                                    getStatusBadge={getStatusBadge}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />

            {/* Modal para asignar cita */}
            {showAssignModal && selectedRequest && (
                <AssignAppointmentModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedRequest(null);
                    }}
                    onSuccess={() => {
                        setShowAssignModal(false);
                        setSelectedRequest(null);
                        fetchRequests();
                    }}
                />
            )}

            {/* Modal para rechazar */}
            {showRejectModal && selectedRequest && (
                <RejectRequestModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowRejectModal(false);
                        setSelectedRequest(null);
                    }}
                    onSuccess={() => {
                        setShowRejectModal(false);
                        setSelectedRequest(null);
                        fetchRequests();
                    }}
                />
            )}
        </div>
    );
};

// Componente de tarjeta de solicitud
const RequestCard: React.FC<{
    request: AppointmentRequest;
    onAccept: () => void;
    onReject: () => void;
    formatDate: (date: string | null) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}> = ({ request, onAccept, onReject, formatDate, getStatusBadge }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-[#B71C1C]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {request.Patient?.User?.name || 'Paciente'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {request.Patient?.User?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {getStatusBadge(request.status)}
                            {request.specialty && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {request.specialty}
                                </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${request.type === 'virtual'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {request.type === 'virtual' ? (
                                    <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3" /> Virtual
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Presencial
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {request.status === 'pendiente' && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccept();
                                    }}
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                    title="Aceptar y asignar cita"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReject();
                                    }}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Rechazar solicitud"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </>
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
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Motivo de la consulta</h4>
                            <p className="text-gray-800">{request.message}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Fecha preferida:</span>
                                <span className="font-medium text-gray-800">{formatDate(request.preferredDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Solicitado:</span>
                                <span className="font-medium text-gray-800">{formatDate(request.createdAt)}</span>
                            </div>
                        </div>

                        {request.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-red-700 mb-1">Motivo de rechazo</h4>
                                <p className="text-sm text-red-600">{request.rejectionReason}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Modal para asignar cita
const AssignAppointmentModal: React.FC<{
    request: AppointmentRequest;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ request, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        date: request.preferredDate ? new Date(request.preferredDate).toISOString().slice(0, 16) : '',
        type: request.type || 'presencial',
        location: '',
        room: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date) {
            setError('La fecha y hora son obligatorias');
            return;
        }

        if (formData.type === 'presencial' && (!formData.location || !formData.room)) {
            setError('El lugar y consultorio son obligatorios para citas presenciales');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Obtener el doctorId del usuario actual
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user?.doctorId) {
                setError('No se pudo identificar al doctor');
                return;
            }

            // Crear la cita
            await createAppointment({
                patientId: request.patientId,
                doctorId: user.doctorId,
                date: new Date(formData.date).toISOString(),
                type: formData.type as 'presencial' | 'virtual',
                location: formData.type === 'presencial' ? formData.location : undefined,
                address: formData.type === 'presencial' ? (formData as any).address : undefined,
                room: formData.type === 'presencial' ? formData.room : undefined,
                notes: formData.notes || undefined,
                requestId: request.id
            });

            // El endpoint createAppointment ya actualiza el estado de la solicitud a 'aceptada' automáticamente.

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear la cita');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Asignar Cita</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Info del paciente */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-[#B71C1C]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    {request.Patient?.User?.name || 'Paciente'}
                                </h4>
                                <p className="text-sm text-gray-500">{request.message}</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha y hora de la cita *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de consulta
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'presencial' })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${formData.type === 'presencial'
                                        ? 'border-[#B71C1C] bg-red-50 text-[#B71C1C]'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4" />
                                    Presencial
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'virtual' })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${formData.type === 'virtual'
                                        ? 'border-[#B71C1C] bg-red-50 text-[#B71C1C]'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Video className="w-4 h-4" />
                                    Virtual
                                </button>
                            </div>
                        </div>

                        {formData.type === 'presencial' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ubicación / Centro médico *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
                                        placeholder="Ej: Clínica Santa María"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={(formData as any).address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value } as any)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
                                        placeholder="Ej: Av. Caracas #12-34"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Consultorio *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.room}
                                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
                                        placeholder="Ej: Consultorio 201"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas adicionales (opcional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none resize-none"
                                rows={3}
                                placeholder="Requisitos, preparación, etc."
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Asignando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Confirmar Cita
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Modal para rechazar solicitud
const RejectRequestModal: React.FC<{
    request: AppointmentRequest;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ request, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reason, setReason] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError('Por favor indica el motivo del rechazo');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await updateAppointmentRequestStatus(request.id, {
                status: 'rechazada',
                rejectionReason: reason
            });

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al rechazar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Rechazar Solicitud</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-700">
                            Estás a punto de rechazar la solicitud de <strong>{request.Patient?.User?.name || 'Paciente'}</strong>.
                            El paciente será notificado del rechazo.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motivo del rechazo *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none resize-none"
                                rows={3}
                                placeholder="Explica brevemente el motivo..."
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Rechazando...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        Rechazar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentRequests;
