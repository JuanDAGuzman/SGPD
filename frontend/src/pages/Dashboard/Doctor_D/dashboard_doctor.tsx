import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
  Users, Calendar, Video, Bell, ClipboardList,
  TrendingUp, Clock, AlertTriangle, Loader2,
  ChevronRight, User, FlaskConical
} from 'lucide-react';
import { getAppointments, getAppointmentRequests, Appointment, AppointmentRequest } from '../../../services/appointmentService';
import { getDoctorDashboardStats, DoctorStats } from '../../../services/statsService';

const DashDoctor: React.FC = () => {
  const [userName, setUserName] = useState("Doctor");
  const [pendingRequests, setPendingRequests] = useState<AppointmentRequest[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener nombre del usuario
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.name) setUserName(user.name);
        }

        // Obtener solicitudes pendientes (retorna [] si hay error)
        const requests = await getAppointmentRequests({ status: 'pendiente' });
        setPendingRequests(Array.isArray(requests) ? requests : []);

        // Obtener citas de hoy (retorna [] si hay error)
        const appointments = await getAppointments();
        const appointmentsArray = Array.isArray(appointments) ? appointments : [];
        const today = new Date().toDateString();
        const todayAppts = appointmentsArray.filter(
          (apt: Appointment) => new Date(apt.date).toDateString() === today && apt.status === 'programada'
        );
        setTodayAppointments(todayAppts);

        // Obtener estadísticas del doctor
        const doctorStats = await getDoctorDashboardStats();
        setStats(doctorStats);
      } catch (error) {
        console.warn("Aviso al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DoctorNavbar />

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido, Dr. {userName}!</h1>
            <p className="text-red-100">Gestiona tus citas y pacientes desde aquí.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Solicitudes Pendientes</p>
                  <p className="text-3xl font-bold text-gray-800">{pendingRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Citas Hoy</p>
                  <p className="text-3xl font-bold text-gray-800">{todayAppointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pacientes Atendidos</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-800">{stats?.patientsAttended || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Consultas Virtuales</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-800">{stats?.virtualConsultations || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Acciones rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Link to="/list_patients_doctor" className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-[#B71C1C]" />
                  </div>
                  <p className="font-medium text-gray-800">Pacientes</p>
                </Link>

                <Link to="/appointment_requests" className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center relative">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ClipboardList className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="font-medium text-gray-800">Solicitudes</p>
                  {pendingRequests.length > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{pendingRequests.length}</span>
                    </span>
                  )}
                </Link>

                <Link to="/videoconsulta" className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-800">VideoConsulta</p>
                </Link>

                <Link to="/notifications_doctor" className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-800">Notificaciones</p>
                </Link>

                <Link to="/results_management" className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FlaskConical className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-gray-800">Resultados</p>
                </Link>
              </div>

              {/* Solicitudes Pendientes */}
              {pendingRequests.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Solicitudes Pendientes
                    </h2>
                    <Link to="/appointment_requests" className="text-[#B71C1C] text-sm font-medium hover:underline flex items-center gap-1">
                      Ver todas <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {pendingRequests.slice(0, 3).map((req) => (
                      <div key={req.id} className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{req.Patient?.User?.name || 'Paciente'}</p>
                          <p className="text-sm text-gray-500 truncate">{req.message}</p>
                        </div>
                        <Link
                          to="/appointment_requests"
                          className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600"
                        >
                          Atender
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citas de Hoy */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Citas de Hoy
                  </h2>
                  <Link to="/my_appointments_doctor" className="text-[#B71C1C] text-sm font-medium hover:underline flex items-center gap-1">
                    Ver agenda <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No tienes citas programadas para hoy</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-sm">{formatTime(apt.date)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{apt.Patient?.User?.name || 'Paciente'}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            {apt.type === 'virtual' ? (
                              <><Video className="w-3 h-3" /> Virtual</>
                            ) : (
                              <><Clock className="w-3 h-3" /> {apt.location}</>
                            )}
                          </p>
                        </div>
                        {apt.type === 'virtual' && apt.meetingLink && apt.status !== 'finalizada' && (
                          <a
                            href={apt.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 flex items-center gap-1"
                          >
                            <Video className="w-4 h-4" />
                            Iniciar
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendario mini */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#B71C1C]" />
                  Próximas Citas
                </h2>
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  ) : stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                    <>
                      {stats.upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-500">
                              {new Date(apt.date).toLocaleDateString('es-CO', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{apt.patientName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {apt.type === 'virtual' ? (
                              <>
                                <Video className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-600">Virtual</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">{apt.location}</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <Link
                        to="/my_appointments_doctor"
                        className="block text-center py-2 text-[#B71C1C] text-sm font-medium hover:underline"
                      >
                        Ver agenda completa →
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      <p>No hay citas próximas</p>
                      <Link to="/my_appointments_doctor" className="text-[#B71C1C] font-medium hover:underline">
                        Ver agenda →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Consejos rápidos */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recordatorio</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tienes <strong>{pendingRequests.length}</strong> solicitudes de cita pendientes por revisar.
                </p>
                <Link
                  to="/appointment_requests"
                  className="block w-full py-2 text-center bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000] transition-colors"
                >
                  Revisar Solicitudes
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashDoctor;
