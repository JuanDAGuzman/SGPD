import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
  Video, Calendar, Clock, User, Play, ExternalLink,
  Loader2, AlertCircle, CheckCircle, Copy
} from 'lucide-react';
import { getAppointments, Appointment } from '../../../services/appointmentService';

const VideoConsultDoctor: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [copiedLink, setCopiedLink] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      const virtualAppts = Array.isArray(data)
        ? data.filter((apt: Appointment) => apt.type === 'virtual')
        : [];
      setAppointments(virtualAppts);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const now = new Date();
    const aptDate = new Date(apt.date);

    if (filter === 'upcoming') {
      return aptDate >= now && apt.status === 'programada';
    }
    if (filter === 'completed') {
      return apt.status === 'finalizada';
    }
    return true;
  });

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
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAppointmentNow = (dateStr: string) => {
    const now = new Date();
    const aptDate = new Date(dateStr);
    const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= -15 && diffMinutes <= 15; // 15 min antes y después
  };

  const getDefaultMeetingLink = () => {
    // Genera un link de ejemplo (puedes reemplazar con tu sistema de videollamadas)
    return `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;
  };

  const copyLink = (link: string, aptId: number) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(aptId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const upcomingCount = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    return aptDate >= now && apt.status === 'programada';
  }).length;

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
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Videoconsultas</h1>
                  <p className="text-red-100">Gestiona tus consultas virtuales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{upcomingCount}</p>
                <p className="text-red-100 text-sm">Próximas</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-semibold text-sm mb-1">Importante</p>
                <p className="text-blue-700 text-sm">
                  Puedes iniciar la videoconsulta hasta 15 minutos antes de la hora programada.
                  Asegúrate de tener una buena conexión a internet y un espacio tranquilo.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                filter === 'upcoming'
                  ? 'bg-[#B71C1C] text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Próximas ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                filter === 'completed'
                  ? 'bg-[#B71C1C] text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                filter === 'all'
                  ? 'bg-[#B71C1C] text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todas
            </button>
          </div>

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Cargando videoconsultas...</p>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay videoconsultas
              </h3>
              <p className="text-gray-400">
                {filter === 'upcoming'
                  ? 'No tienes videoconsultas programadas próximamente'
                  : 'No se encontraron videoconsultas con este filtro'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.map((apt) => {
                const meetingLink = apt.meetingLink || getDefaultMeetingLink();
                const isNow = isAppointmentNow(apt.date);
                const isPast = new Date(apt.date) < new Date();

                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                      isNow ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className={`h-2 ${
                      apt.status === 'finalizada' ? 'bg-gray-400' :
                      isNow ? 'bg-green-500' :
                      isPast ? 'bg-red-500' : 'bg-blue-500'
                    }`} />

                    <div className="p-6">
                      {/* Patient Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-[#B71C1C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {apt.Patient?.User?.name || 'Paciente'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {apt.Patient?.User?.email}
                          </p>
                        </div>
                        {isNow && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full animate-pulse">
                            Ahora
                          </span>
                        )}
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(apt.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{formatTime(apt.date)}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {apt.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{apt.notes}</p>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'finalizada' ? 'bg-gray-100 text-gray-700' :
                          apt.status === 'cancelada' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {apt.status === 'finalizada' && <CheckCircle className="w-3 h-3" />}
                          {apt.status === 'finalizada' ? 'Completada' :
                           apt.status === 'cancelada' ? 'Cancelada' : 'Programada'}
                        </span>
                      </div>

                      {/* Actions */}
                      {apt.status !== 'finalizada' && apt.status !== 'cancelada' && (
                        <div className="space-y-2">
                          {/* Join Button */}
                          <a
                            href={meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                              isNow
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isNow ? (
                              <>
                                <Play className="w-5 h-5" />
                                Iniciar Consulta
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-5 h-5" />
                                Abrir Enlace
                              </>
                            )}
                          </a>

                          {/* Copy Link */}
                          <button
                            onClick={() => copyLink(meetingLink, apt.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all text-sm"
                          >
                            {copiedLink === apt.id ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                ¡Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copiar enlace
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default VideoConsultDoctor;
