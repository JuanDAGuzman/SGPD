import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Video, Plus, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { getAppointments, getAppointmentRequests, Appointment, AppointmentRequest } from '../../services/appointmentService';
import RequestAppointmentModal from './RequestAppointmentModal';

interface Props {
  patientId?: number;
}

const EventsCalendar: React.FC<Props> = ({ patientId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener citas confirmadas (retorna [] si hay error)
        const appointmentsData = await getAppointments();
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

        // Obtener solicitudes pendientes (retorna [] si hay error)
        const requestsData = await getAppointmentRequests({ status: 'pendiente' });
        setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (err: any) {
        // Solo mostrar error si es un error crítico, no por falta de datos
        console.warn('Aviso al cargar citas:', err);
        // No establecemos error ya que las funciones retornan arrays vacíos
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    // Filtrar citas para ese día
    const dayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === day &&
        aptDate.getMonth() === currentDate.getMonth() &&
        aptDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (dayAppointments.length > 0) {
      setSelectedDayAppointments(dayAppointments);
      setSelectedDateStr(clickedDate.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setShowDayModal(true);
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isCurrentMonth = currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear;

  // Filtrar citas del mes actual para visualización (puntos azules)
  const appointmentsThisMonth = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getMonth() === currentDate.getMonth() &&
      aptDate.getFullYear() === currentDate.getFullYear();
  });

  // Obtener días con citas
  const daysWithAppointments = appointmentsThisMonth.map(apt => new Date(apt.date).getDate());

  // Próximas citas (ordenadas por fecha)
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date() && apt.status === 'programada')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="w-6 h-6 text-red-600 mr-2" />
          Próximos Eventos
        </h2>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#B71C1C] text-white text-sm font-medium rounded-lg hover:bg-[#900000] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Solicitar Cita
        </button>
      </div>

      {/* Solicitud pendiente */}
      {pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Tienes una solicitud pendiente</p>
              <p className="text-sm text-yellow-700 mt-1">
                {pendingRequests[0].message}
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Fecha preferida: {pendingRequests[0].preferredDate ? formatDate(pendingRequests[0].preferredDate) : 'Sin especificar'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendario */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium py-2 text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`aspect-square flex items-center justify-center text-sm rounded transition-colors relative ${day === null
                ? ''
                : day === today && isCurrentMonth
                  ? 'bg-red-700 text-white font-bold shadow-sm cursor-pointer'
                  : daysWithAppointments.includes(day as number)
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 cursor-pointer hover:bg-blue-100'
                    : 'text-gray-700' // Dias sin citas no clickeables o clickeables vacios? Preferiblemente solo visual por ahora
                }`}
              style={{ cursor: day && daysWithAppointments.includes(day as number) ? 'pointer' : 'default' }}
            >
              {day}
              {day && daysWithAppointments.includes(day) && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Próximas citas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Próximas Citas</h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No tienes citas programadas</p>
          </div>
        ) : (
          upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800 text-sm">
                  Consulta {appointment.Doctor?.specialty || 'General'}
                </h4>
                <div className="flex items-center gap-2">
                  {appointment.type === 'virtual' && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Virtual
                    </span>
                  )}
                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                    {formatDate(appointment.date)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  {formatTime(appointment.date)}
                </div>
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-2" />
                  Dr. {appointment.Doctor?.User?.name || 'Por asignar'}
                </div>
                {appointment.type === 'presencial' && appointment.location && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    {appointment.location} - {appointment.room}
                  </div>
                )}
                {/* Ocultar link si finalizada */}
                {appointment.type === 'virtual' && appointment.meetingLink && appointment.status !== 'finalizada' && (
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Video className="w-3 h-3 mr-2" />
                    Unirse a videollamada
                  </a>
                )}
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => window.location.href = '/my_appointments'}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
          Ver todas las citas
        </button>
      </div>

      {/* Modal para solicitar cita */}
      {showRequestModal && (
        <RequestAppointmentModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            getAppointmentRequests({ status: 'pendiente' }).then(setPendingRequests);
          }}
        />
      )}

      {/* Modal de Detalles del Día */}
      {showDayModal && (
        <DayDetailsModal
          dateStr={selectedDateStr}
          appointments={selectedDayAppointments}
          onClose={() => setShowDayModal(false)}
        />
      )}
    </div>
  );
};

// Modal Detalle del Día
const DayDetailsModal: React.FC<{
  dateStr: string;
  appointments: Appointment[];
  onClose: () => void;
}> = ({ dateStr, appointments, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800 capitalize">{dateStr}</h3>
            <p className="text-sm text-gray-500">{appointments.length} citas programadas</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {appointments.map(apt => (
            <div key={apt.id} className={`border rounded-xl p-4 relative overflow-hidden ${apt.status === 'finalizada' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
              {/* Etiqueta de Estado */}
              <div className="absolute top-4 right-4">
                {apt.status === 'finalizada' ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Finalizada
                  </span>
                ) : apt.status === 'programada' ? (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-bold rounded-full">
                    Programada
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold rounded-full capitalize">
                    {apt.status.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${apt.type === 'virtual' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-[#B71C1C]'}`}>
                  {apt.type === 'virtual' ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Consulta {apt.Doctor?.specialty}</h4>
                  <p className="text-sm text-gray-600">Dr. {apt.Doctor?.User?.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(apt.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Detalles específicos */}
              <div className="space-y-3">
                {apt.type === 'presencial' && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#B71C1C] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">{apt.location}</p>
                        <p className="text-gray-600">{apt.room}</p>
                        {(apt as any).address && <p className="text-gray-500 text-xs mt-1">{(apt as any).address}</p>}
                      </div>
                    </div>
                    {/* Mapa embebido si hay dirección */}
                    {(apt as any).address && (
                      <iframe
                        width="100%"
                        height="150"
                        frameBorder="0"
                        style={{ border: 0, borderRadius: '8px' }}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(apt.location + ', ' + (apt as any).address)}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                )}

                {apt.type === 'virtual' && apt.meetingLink && apt.status !== 'finalizada' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Sala de Videollamada</p>
                        <p className="text-blue-600 text-xs mt-1">Ingresa a la hora programada</p>
                      </div>
                      <a href={apt.meetingLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Video className="w-4 h-4" /> Unirse
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;