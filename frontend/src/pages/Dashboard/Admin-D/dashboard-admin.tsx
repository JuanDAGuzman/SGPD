import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../../components/NavBar/AdminNavbar";
import Footer from "../../../components/Footer/Footer";
import { FaUsers, FaUserShield, FaBell, FaUserMd, FaHospital, FaClipboardList } from "react-icons/fa";
import { AlertTriangle, UserCheck } from "lucide-react";

interface DashboardStats {
  patients: {
    total: number;
    active: number;
  };
  doctors: {
    total: number;
  };
  centers: {
    total: number;
  };
  usersByRole: {
    admin?: number;
    doctor?: number;
    patient?: number;
  };
  alerts: {
    urgent: number;
    newRegistrationsToday: number;
    pendingAppointments: number;
  };
}

const DashAdmin: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/stats/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-red-100">Gestiona usuarios, roles y monitorea el sistema desde aquí.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/pending_users" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-yellow-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Solicitudes</h3>
                  <p className="text-sm text-gray-500">Revisar registros pendientes</p>
                </div>
              </div>
            </Link>
            <Link to="/user_list_admin" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-[#B71C1C]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-6 h-6 text-[#B71C1C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Gestionar Usuarios</h3>
                  <p className="text-sm text-gray-500">Ver y administrar usuarios</p>
                </div>
              </div>
            </Link>

            <Link to="/manage_roles" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-[#B71C1C]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaUserShield className="w-6 h-6 text-[#B71C1C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Gestionar Roles</h3>
                  <p className="text-sm text-gray-500">Configurar permisos</p>
                </div>
              </div>
            </Link>

            <Link to="/notifications_admin" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-[#B71C1C]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaBell className="w-6 h-6 text-[#B71C1C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                  <p className="text-sm text-gray-500">Ver alertas del sistema</p>
                </div>
              </div>
            </Link>

            <Link to="/register_doctor_admin" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUserMd className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Registrar Doctor</h3>
                  <p className="text-sm text-gray-500">Agregar nuevo médico</p>
                </div>
              </div>
            </Link>

            <Link to="/health_center_list" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaHospital className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Centros de Salud</h3>
                  <p className="text-sm text-gray-500">Administrar centros</p>
                </div>
              </div>
            </Link>

            <Link to="/patient_list_admin" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Lista de Pacientes</h3>
                  <p className="text-sm text-gray-500">Ver todos los pacientes</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-[#B71C1C] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 text-sm font-medium">Cargando estadísticas...</p>
              </div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Estadísticas del Sistema</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <p className="text-3xl font-bold text-[#B71C1C]">{stats.patients.total}</p>
                    <p className="text-sm text-gray-600">Pacientes Registrados</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-3xl font-bold text-green-600">{stats.patients.active}</p>
                    <p className="text-sm text-gray-600">Pacientes Activos</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">{stats.doctors.total}</p>
                    <p className="text-sm text-gray-600">Médicos Registrados</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">{stats.centers.total}</p>
                    <p className="text-sm text-gray-600">Centros de Salud</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Alertas Recientes</h2>
                <div className="space-y-3">
                  {stats.alerts.urgent > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.alerts.urgent} notificaciones urgentes</p>
                        <p className="text-xs text-gray-500">Requieren atención inmediata</p>
                      </div>
                    </div>
                  )}
                  {stats.alerts.pendingAppointments > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.alerts.pendingAppointments} citas pendientes</p>
                        <p className="text-xs text-gray-500">Requieren confirmación</p>
                      </div>
                    </div>
                  )}
                  {stats.alerts.newRegistrationsToday > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.alerts.newRegistrationsToday} nuevos registros</p>
                        <p className="text-xs text-gray-500">Hoy</p>
                      </div>
                    </div>
                  )}
                  {stats.alerts.urgent === 0 && stats.alerts.pendingAppointments === 0 && stats.alerts.newRegistrationsToday === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay alertas pendientes</p>
                    </div>
                  )}
                </div>
                <Link to="/notifications_admin" className="block mt-4 text-center py-2 text-[#B71C1C] hover:text-[#900000] font-medium">
                  Ver todas las alertas →
                </Link>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashAdmin;
