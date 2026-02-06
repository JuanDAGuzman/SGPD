import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../../../components/NavBar/DoctorNavbar';
import Footer from '../../../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { Users, Search, UserPlus, FileText, Loader2, AlertCircle } from 'lucide-react';
import { getPatients, PatientBackend } from '../../../../services/patientService';

type PacienteRow = {
  id: number;
  cedula: string;
  nombre: string;
  email: string;
  ciudad: string;
  estado: 'activo' | 'inactivo';
  diagnostico: string;
};

const ListPatientsDoctor: React.FC = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data: PatientBackend[] = await getPatients();

        // Mapear datos del backend al formato de la tabla
        const mappedPacientes: PacienteRow[] = data.map(p => ({
          id: p.id,
          cedula: p.userId.toString(),
          nombre: p.User?.name || 'Desconocido',
          email: p.User?.email || '',
          ciudad: p.User?.city || 'N/A',
          estado: 'activo',
          diagnostico: p.clinicalInfo || 'Sin diagnóstico registrado'
        }));
        setPacientes(mappedPacientes);
      } catch (error) {
        console.error("Error cargando pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = pacientes.filter((paciente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(searchLower) ||
      paciente.cedula.includes(searchLower) ||
      paciente.email.toLowerCase().includes(searchLower)
    );
  });

  const handleRegister = () => {
    navigate('/register_patients_doctor');
  };

  const handleViewHistory = (patientId: number) => {
    navigate(`/medical_history/${patientId}`);
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
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Mis Pacientes</h1>
                  <p className="text-red-100">Gestiona y visualiza la información de tus pacientes</p>
                </div>
              </div>
              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-white text-[#B71C1C] font-semibold rounded-lg hover:bg-red-50 transition-all flex items-center gap-2 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Registrar Paciente
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, ID o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Pacientes</p>
                  <p className="text-3xl font-bold text-gray-800">{pacientes.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pacientes Activos</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {pacientes.filter(p => p.estado === 'activo').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Resultados Filtrados</p>
                  <p className="text-3xl font-bold text-gray-800">{filteredPatients.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-[#B71C1C]">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Cargando pacientes...</p>
                  </div>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-2">
                    {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Registra tu primer paciente para comenzar'}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Ciudad</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Info Clínica</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#B71C1C]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {patient.cedula}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {patient.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {patient.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {patient.ciudad}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {patient.diagnostico}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            patient.estado === 'activo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {patient.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleViewHistory(patient.id)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            title="Ver Historia Clínica"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Info */}
            {!loading && filteredPatients.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{filteredPatients.length}</span> pacientes
                </p>
                <p className="text-sm text-gray-500">
                  Total: {pacientes.length} pacientes registrados
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ListPatientsDoctor;
