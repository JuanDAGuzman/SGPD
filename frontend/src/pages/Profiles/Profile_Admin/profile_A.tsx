import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/NavBar/AdminNavbar";
import Footer from "../../../components/Footer/Footer";
import { User, Mail, Phone, FileText, Shield, Save, X, Camera, Settings, Users, Bell } from "lucide-react";

const ProfileA: React.FC = () => {
    const navigate = useNavigate();
    const [profileImg, setProfileImg] = useState<string>("");
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        docType: "CC",
        docNumber: "",
        role: "Administrador",
        department: "",
    });

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                setFormData((prev) => ({
                    ...prev,
                    name: user.name || "",
                    email: user.email || "",
                    role: user.role || "Administrador",
                }));
            }
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        }
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        console.log("Guardando cambios:", formData);
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <div className="pt-24">
                <main className="container mx-auto px-4 py-8 max-w-5xl">
                    {/* Header del Perfil */}
                    <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Foto de Perfil */}
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden border-4 border-white border-opacity-30">
                                    {profileImg ? (
                                        <img
                                            src={profileImg}
                                            alt="Perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">
                                            {getInitials(formData.name || "A")}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={triggerFileInput}
                                    className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Camera className="w-5 h-5 text-[#B71C1C]" />
                                </button>
                                <input
                                    ref={inputFileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </div>

                            {/* Info del Usuario */}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl font-bold mb-1">{formData.name || "Administrador"}</h1>
                                <p className="text-red-100 mb-2">{formData.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                    <span className="px-3 py-1 bg-white rounded-full text-sm flex items-center gap-1 text-[#B71C1C] font-semibold">
                                        <Shield className="w-4 h-4" />
                                        {formData.role}
                                    </span>
                                </div>
                            </div>

                            {/* Botón Editar */}
                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-white text-[#B71C1C] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                                    >
                                        Editar Perfil
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-white text-[#B71C1C] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
                                        >
                                            <Save className="w-4 h-4" />
                                            Guardar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido del Perfil */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información Personal */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#B71C1C]" />
                                    Información Personal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Nombre Completo
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${isEditing
                                                        ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                        : "border-transparent bg-gray-50 text-gray-700"
                                                    }`}
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${isEditing
                                                        ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                        : "border-transparent bg-gray-50 text-gray-700"
                                                    }`}
                                                placeholder="admin@correo.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${isEditing
                                                        ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                        : "border-transparent bg-gray-50 text-gray-700"
                                                    }`}
                                                placeholder="300 123 4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Departamento
                                        </label>
                                        <div className="relative">
                                            <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${isEditing
                                                        ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                        : "border-transparent bg-gray-50 text-gray-700"
                                                    }`}
                                                placeholder="Ej: Sistemas"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documento de Identidad */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#B71C1C]" />
                                    Documento de Identidad
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Tipo de Documento
                                        </label>
                                        <select
                                            name="docType"
                                            value={formData.docType}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${isEditing
                                                    ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                    : "border-transparent bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                            <option value="PA">Pasaporte</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Número de Documento
                                        </label>
                                        <input
                                            type="text"
                                            name="docNumber"
                                            value={formData.docNumber}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${isEditing
                                                    ? "border-gray-300 focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100"
                                                    : "border-transparent bg-gray-50 text-gray-700"
                                                }`}
                                            placeholder="1234567890"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Lateral */}
                        <div className="space-y-6">
                            {/* Rol y Permisos */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[#B71C1C]" />
                                    Rol y Permisos
                                </h2>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                                        <p className="font-semibold text-gray-800">{formData.role}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Acceso completo al sistema
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">Permisos activos:</p>
                                        <ul className="space-y-1">
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Gestión de usuarios
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Gestión de roles
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Reportes del sistema
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Configuración general
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Panel de Control</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate("/dashboard_admin")}
                                        className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200 text-left flex items-center gap-2"
                                    >
                                        ← Volver al Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate("/user_list_admin")}
                                        className="w-full py-3 px-4 bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000] transition-colors shadow-sm text-left flex items-center gap-2"
                                    >
                                        <Users className="w-5 h-5" />
                                        Gestionar Usuarios
                                    </button>
                                    <button
                                        onClick={() => navigate("/notifications_admin")}
                                        className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200 text-left flex items-center gap-2"
                                    >
                                        <Bell className="w-5 h-5" />
                                        Ver Notificaciones
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

export default ProfileA;
