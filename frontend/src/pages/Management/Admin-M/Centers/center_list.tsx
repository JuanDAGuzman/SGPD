import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import {
  Building2, Search, Plus, Edit2, Trash2, MapPin, Phone,
  Mail, AlertCircle, CheckCircle2, Hospital, X
} from "lucide-react";

interface MedicalCenter {
  id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  regime: string;
  createdAt: string;
  updatedAt: string;
}

const HealthCenterList: React.FC = () => {
  const navigate = useNavigate();
  const [centers, setCenters] = useState<MedicalCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<MedicalCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<MedicalCenter | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    const filtered = centers.filter(center =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCenters(filtered);
  }, [searchTerm, centers]);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/medical-centers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar centros de salud");
      }

      const data = await response.json();
      setCenters(data);
      setFilteredCenters(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los centros de salud");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCenter) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/medical-centers/${selectedCenter.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el centro de salud");
      }

      setSuccess("Centro de salud eliminado exitosamente");
      setShowDeleteModal(false);
      setSelectedCenter(null);
      fetchCenters();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error al eliminar el centro de salud");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      clinica: "Clínica",
      hospital: "Hospital",
      ips: "IPS",
      centro_salud: "Centro de Salud",
    };
    return types[type] || type;
  };

  const getRegimeLabel = (regime: string) => {
    const regimes: { [key: string]: string } = {
      contributivo: "Contributivo",
      subsidiado: "Subsidiado",
      mixto: "Mixto",
    };
    return regimes[regime] || regime;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <div className="flex-grow pt-24 pb-8">
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#B71C1C]" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Centros de Salud</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {centers.length} {centers.length === 1 ? "centro" : "centros"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/register_healthcenter")}
                className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nuevo Centro
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, ciudad o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:border-[#B71C1C] outline-none transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Centers Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-[#B71C1C] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 text-sm font-medium">Cargando...</p>
              </div>
            </div>
          ) : filteredCenters.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-200 text-center">
              <Hospital className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {searchTerm ? "No se encontraron resultados" : "No hay centros registrados"}
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando tu primer centro de salud"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/register_healthcenter")}
                  className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-lg transition-colors font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Registrar Centro
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white line-clamp-2 flex-1">
                        {center.name}
                      </h3>
                      <Building2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 bg-white/90 text-[#B71C1C] rounded text-xs font-semibold">
                        {getTypeLabel(center.type)}
                      </span>
                      {center.regime && (
                        <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs font-medium">
                          {getRegimeLabel(center.regime)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    {/* Address */}
                    {center.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 line-clamp-2">{center.address}</p>
                      </div>
                    )}

                    {/* City & Department */}
                    {(center.city || center.department) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600">
                          {[center.city, center.department].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Phone */}
                    {center.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <a
                          href={`tel:${center.phone}`}
                          className="text-xs text-[#B71C1C] hover:text-[#900000] transition-colors"
                        >
                          {center.phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {center.email && (
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${center.email}`}
                          className="text-xs text-[#B71C1C] hover:text-[#900000] transition-colors break-all"
                        >
                          {center.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="px-4 pb-4 pt-2 flex gap-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        // TODO: Implementar edición
                        console.log("Editar centro:", center.id);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCenter(center);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCenter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Confirmar Eliminación</h3>
                <p className="text-xs text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-5">
              <p className="text-sm text-gray-700 mb-1">
                ¿Estás seguro de que deseas eliminar el centro:
              </p>
              <p className="font-bold text-gray-900 text-sm">{selectedCenter.name}?</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCenter(null);
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HealthCenterList;
