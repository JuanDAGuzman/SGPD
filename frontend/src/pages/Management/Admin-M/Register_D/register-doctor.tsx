import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import {
  UserPlus, Mail, Phone, Calendar, MapPin, Award, Building2,
  User, Camera, AlertCircle, CheckCircle2, Stethoscope,
  IdCard, Users, Briefcase, Upload, X
} from "lucide-react";

interface MedicalCenter {
  id: number;
  name: string;
}

const Register_Doctor: React.FC = () => {
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    gender: "",
    birthDate: "",
    userType: "doctor",
    specialty: "",
    professionalLicense: "",
    medicalCenterId: "",
    city: "",
  });

  useEffect(() => {
    fetchMedicalCenters();
  }, []);

  const fetchMedicalCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/medical-centers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar centros médicos");
      }

      const data = await response.json();
      setMedicalCenters(data);
    } catch (err) {
      console.error("Error fetching medical centers:", err);
      setError("No se pudieron cargar los centros médicos");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    inputFileRef.current?.click();
  };

  const removeImage = () => {
    setProfileImg("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-10) + "Aa1!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Por favor completa los campos obligatorios (nombre y email)");
      return;
    }

    if (!formData.medicalCenterId) {
      setError("Por favor selecciona un centro de salud");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const temporaryPassword = generateTemporaryPassword();

      const payload = {
        name: formData.name,
        email: formData.email,
        password: temporaryPassword,
        phone: formData.phone,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        gender: formData.gender,
        birthDate: formData.birthDate,
        specialty: formData.specialty,
        professionalLicense: formData.professionalLicense,
        medicalCenterId: parseInt(formData.medicalCenterId),
        city: formData.city,
      };

      const response = await fetch("http://localhost:4000/api/auth/register-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Error al registrar doctor");
      }

      setSuccess(
        `Doctor registrado exitosamente. Contraseña temporal: ${temporaryPassword}. Por favor, guárdala y envíala al doctor.`
      );

      setTimeout(() => {
        navigate("/dashboard_admin");
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Error al registrar el doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-red-50/30 flex flex-col">
      <AdminNavbar />

      <div className="flex-grow pt-24 pb-12">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/20">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Registrar Nuevo Doctor
                </h1>
                <p className="text-gray-500 mt-1">Complete la información del profesional médico</p>
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

          {/* Main Form Container */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Image Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-6">
                    <div className="w-40 h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl shadow-gray-300/50 ring-4 ring-white">
                      {profileImg ? (
                        <img
                          src={profileImg}
                          alt="Doctor Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {profileImg && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg shadow-red-500/30 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                    >
                      <Camera className="w-4 h-4" />
                      Cambiar foto
                    </button>

                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </div>

                  <div className="w-full mt-8 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500 text-xs">Rol del usuario</div>
                        <div className="font-semibold text-gray-700">Profesional Médico</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500 text-xs">Estado</div>
                        <div className="font-semibold text-gray-700">Activo al registrar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Información Importante</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Se generará automáticamente una contraseña temporal segura.
                      Asegúrate de compartirla con el doctor de forma segura.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre completo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Dr. Juan Pérez Rodríguez"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="doctor@ejemplo.com"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="+57 300 123 4567"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Fecha de nacimiento */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Fecha de nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800"
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
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                      >
                        <option value="">Selecciona una ciudad</option>
                        <option value="bogota">Bogotá</option>
                        <option value="medellin">Medellín</option>
                        <option value="cali">Cali</option>
                        <option value="barranquilla">Barranquilla</option>
                        <option value="cartagena">Cartagena</option>
                        <option value="cucuta">Cúcuta</option>
                        <option value="bucaramanga">Bucaramanga</option>
                      </select>
                    </div>
                  </div>

                  {/* Documento de Identificación */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Documento de Identificación
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="relative">
                        <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="documentType"
                          value={formData.documentType}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                        >
                          <option value="">Tipo</option>
                          <option value="CC">CC</option>
                          <option value="TI">TI</option>
                          <option value="CE">CE</option>
                          <option value="RC">RC</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleInputChange}
                        placeholder="Número de Documento"
                        className="sm:col-span-2 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Sexo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Sexo
                    </label>
                    <div className="flex gap-4">
                      <label className="flex-1 relative cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                          className="peer sr-only"
                        />
                        <div className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl peer-checked:bg-red-50 peer-checked:border-red-500 transition-all duration-200 text-center font-medium text-gray-700 peer-checked:text-red-700">
                          Masculino
                        </div>
                      </label>
                      <label className="flex-1 relative cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                          className="peer sr-only"
                        />
                        <div className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl peer-checked:bg-red-50 peer-checked:border-red-500 transition-all duration-200 text-center font-medium text-gray-700 peer-checked:text-red-700">
                          Femenino
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Información Profesional</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Especialidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Especialidad
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        placeholder="Ej: Endocrinología"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Matrícula profesional */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Matrícula profesional
                    </label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="professionalLicense"
                        value={formData.professionalLicense}
                        onChange={handleInputChange}
                        placeholder="Número de matrícula"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Centro de salud */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Centro de salud <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="medicalCenterId"
                        value={formData.medicalCenterId}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Selecciona un centro de salud</option>
                        {medicalCenters.map((center) => (
                          <option key={center.id} value={center.id}>
                            {center.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard_admin")}
                  disabled={loading}
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-2xl transition-all duration-200 font-semibold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                      <UserPlus className="w-5 h-5" />
                      Registrar Doctor
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Register_Doctor;
