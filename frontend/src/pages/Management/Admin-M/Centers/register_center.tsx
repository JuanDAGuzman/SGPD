import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import {
  Building2, Mail, Phone, MapPin, AlertCircle, CheckCircle2,
  Hospital, Home, FileText, Map
} from "lucide-react";

const Register_HealthCenter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    department: "",
    phone: "",
    email: "",
    regime: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.type || !formData.address) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/medical-centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Error al registrar centro");
      }

      setSuccess("Centro de salud registrado exitosamente");

      setTimeout(() => {
        navigate("/health_center_list");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al registrar el centro de salud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 flex flex-col">
      <AdminNavbar />

      <div className="flex-grow pt-24 pb-12">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Hospital className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Registrar Centro de Salud
                </h1>
                <p className="text-gray-500 mt-1">Complete la información del establecimiento médico</p>
              </div>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-white border border-red-200 p-5 rounded-2xl shadow-sm flex items-start gap-4 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-white border border-green-200 p-5 rounded-2xl shadow-sm flex items-start gap-4 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">¡Registro Exitoso!</h4>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Información Básica</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del centro */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre del centro <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Clínica Santa María"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Tipo de institución */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de institución <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hospital className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="clinica">Clínica</option>
                      <option value="hospital">Hospital</option>
                      <option value="ips">IPS</option>
                      <option value="centro_salud">Centro de salud</option>
                    </select>
                  </div>
                </div>

                {/* Régimen */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Régimen
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="regime"
                      value={formData.regime}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Seleccione régimen</option>
                      <option value="contributivo">Contributivo</option>
                      <option value="subsidiado">Subsidiado</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Ubicación</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ej: Calle 123 #45-67"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ciudad
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Selecciona una ciudad</option>
                      <option value="Bogotá">Bogotá</option>
                      <option value="Medellín">Medellín</option>
                      <option value="Cali">Cali</option>
                      <option value="Barranquilla">Barranquilla</option>
                      <option value="Cartagena">Cartagena</option>
                      <option value="Cúcuta">Cúcuta</option>
                      <option value="Bucaramanga">Bucaramanga</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Departamento
                  </label>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Ej: Cundinamarca"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Información de Contacto</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+57 320 123 4567"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contacto@clinica.com"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/health_center_list")}
                disabled={loading}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-200 font-semibold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5" />
                    Registrar Centro
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Información Importante</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  El centro de salud estará disponible inmediatamente para asignar a los doctores del sistema.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Register_HealthCenter;
