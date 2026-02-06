import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, LogIn, ScanFace } from "lucide-react";
import Logo from "../../assets/logo2.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/api"; // ⬅️ importa el helper

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    try {
      setSubmitting(true);
      setGlobalError(null);

      const { token, user } = await login(formData.email, formData.password);

      // Guarda sesión (ajústalo si usas otro store)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirige según rol
      switch (user.role) {
        case 'admin':
          navigate('/dashboard_admin');
          break;
        case 'doctor':
          navigate('/dashboard_doctor');
          break;
        case 'patient':
        default:
          navigate('/dashboard_patient');
          break;
      }

    } catch (err: any) {
      setGlobalError(err?.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex justify-center md:justify-start">
              <img src={Logo} alt="Logo UMB" className="object-contain" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-700">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Sistema de Gestión de Pacientes
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Accede al sistema especializado para el manejo y seguimiento de
                pacientes con pie diabético. Una herramienta integral para
                profesionales de la salud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span>Gestión de pacientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span>Seguimiento médico</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span>Reportes clínicos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span>Alertas tempranas</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-w-md mx-auto md:max-w-none">
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                ← Volver al Home
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <ScanFace className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
              <p className="text-gray-600 mt-1 text-sm">
                Accede a tu cuenta profesional
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {globalError && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded">
                  {globalError}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    placeholder="tu.email@umb.edu.co"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-9 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-sm text-red-600 hover:text-red-500 font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-6"
              >
                <LogIn className="w-4 h-4" />
                <span>{submitting ? "Ingresando..." : "Iniciar Sesión"}</span>
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/signin")}
                className="text-red-600 hover:text-red-500 font-medium text-sm transition-colors cursor-pointer border-none bg-transparent"
              >
                Solicitar acceso al sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
