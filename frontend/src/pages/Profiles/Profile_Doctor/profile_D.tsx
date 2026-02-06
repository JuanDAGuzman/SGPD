import React, { useState, useRef, useEffect } from "react";
import DoctorNavbar from "../../../components/NavBar/DoctorNavbar";
import Footer from "../../../components/Footer/Footer";
import { getDoctorProfile, updateDoctorProfile, DoctorProfile } from "../../../services/doctorService";
import {
  User, Mail, Phone, MapPin, Stethoscope, Building2,
  Camera, Save, Loader2, CheckCircle, AlertCircle
} from "lucide-react";

const ProfileD: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImg, setProfileImg] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    city: "",
  });

  // Estados para mensajes
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getDoctorProfile();
        setProfile(data);
        setFormData({
          name: data.User.name || "",
          specialty: data.specialty || "",
          phone: data.User.phone || "",
          city: data.User.city || "",
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setNotification({
          type: 'error',
          message: "Error al cargar el perfil. Por favor, intente nuevamente."
        });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setNotification(null);

      // Validaciones básicas
      if (!formData.name.trim()) {
        setNotification({ type: 'error', message: "El nombre es obligatorio" });
        return;
      }

      if (!formData.specialty.trim()) {
        setNotification({ type: 'error', message: "La especialidad es obligatoria" });
        return;
      }

      // Actualizar perfil
      const response = await updateDoctorProfile(formData);

      // Actualizar el estado local con los nuevos datos
      if (response.doctor) {
        setProfile(response.doctor);
      }

      setNotification({ type: 'success', message: "Perfil actualizado correctamente" });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      setNotification({
        type: 'error',
        message: error.message || "Error al actualizar el perfil. Intente nuevamente."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DoctorNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DoctorNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl font-bold text-red-600 mb-2">No se pudo cargar el perfil.</p>
            <p className="text-gray-600">Verifique su conexión o inicie sesión nuevamente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DoctorNavbar />

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Mi Perfil</h1>
                <p className="text-red-100">Gestiona tu información personal y profesional</p>
              </div>
            </div>
          </div>

          {/* Notificación */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 shadow-lg animate-fade-in ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`${notification.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Avatar y Info Básica */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card de Avatar */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#B71C1C]">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img
                        src={profileImg || "/user.png"}
                        alt="Doctor Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Dr"; }}
                      />
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      title="Cambiar foto"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-1">{profile.User.name}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#B71C1C] rounded-full text-sm font-semibold">
                    <Stethoscope className="w-4 h-4" />
                    {profile.specialty || "Médico General"}
                  </div>
                </div>
              </div>

              {/* Card de Información del Centro */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Centro Médico
                </h3>
                <p className="text-gray-700 font-medium">
                  {profile.MedicalCenter?.name || "No asignado"}
                </p>
                {profile.MedicalCenter?.address && (
                  <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {profile.MedicalCenter.address}
                  </p>
                )}
              </div>
            </div>

            {/* Formulario Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-600" />
                  Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Ingrese su nombre completo"
                      />
                    </div>
                  </div>

                  {/* Email (disabled) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={profile.User.email}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Especialidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Especialidad *
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Ej: Cardiología, Pediatría, etc."
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Ej: 300 123 4567"
                      />
                    </div>
                  </div>

                  {/* Ciudad */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Ej: Bogotá D.C."
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setFormData({
                        name: profile.User.name || "",
                        specialty: profile.specialty || "",
                        phone: profile.User.phone || "",
                        city: profile.User.city || "",
                      });
                      setNotification(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="px-8 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileD;
