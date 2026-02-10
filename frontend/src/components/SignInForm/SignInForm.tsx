import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, UserPlus, Phone, Building, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo2.png";

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: '',
    numero_identificacion: '',
    tipo_identificacion: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es requerido';
    }

    if (!formData.numero_identificacion.trim()) {
      newErrors.numero_identificacion = 'El número de identificación es requerido';
    }

    if (!formData.tipo_identificacion) {
      newErrors.tipo_identificacion = 'El tipo de identificación es requerido';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          name: `${formData.nombre} ${formData.apellido}`,
          email: formData.email,
          password: formData.password,
          contactInfo: `Tel: ${formData.telefono}, Dir: ${formData.direccion}`,
          clinicalInfo: JSON.stringify({
            fecha_nacimiento: formData.fecha_nacimiento,
            genero: formData.genero,
            tipo_identificacion: formData.tipo_identificacion,
            numero_identificacion: formData.numero_identificacion
          })
        };

        const response = await fetch('http://localhost:4000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          alert('¡Registro exitoso! Tu cuenta está en estado PENDIENTE. El administrador debe aprobar tu acceso antes de que puedas iniciar sesión.');
          navigate('/login');
        } else {
          alert(data.message || 'Error en el registro');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          <div className="flex flex-col gap-8">
            <div className="flex justify-center md:justify-start">
              <img src={Logo} alt="Logo UMB" className="object-contain" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-700">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Registro de Profesionales
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Solicita acceso al sistema especializado para el manejo de pacientes con pie diabético.
                Tu registro será revisado y aprobado por nuestro equipo administrativo.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">
                Requisitos para el registro
              </h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Ser profesional de la salud certificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Contar con documento de identidad válido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Proporcionar información personal verídica</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Experiencia en el manejo de diabetes</span>
                </div>
              </div>
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

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="mb-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                ← Volver al login
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Registro</h2>
              <p className="text-gray-600 mt-2">Solicita acceso como profesional</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Tu nombre"
                    />
                  </div>
                  {errors.nombre && (
                    <p className="text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.apellido ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Tu apellido"
                    />
                  </div>
                  {errors.apellido && (
                    <p className="text-sm text-red-600">{errors.apellido}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="tu.email@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="3001234567"
                    />
                  </div>
                  {errors.telefono && (
                    <p className="text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.direccion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  {errors.direccion && (
                    <p className="text-sm text-red-600">{errors.direccion}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.fecha_nacimiento ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                  </div>
                  {errors.fecha_nacimiento && (
                    <p className="text-sm text-red-600">{errors.fecha_nacimiento}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
                    Género
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.genero ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>
                  {errors.genero && (
                    <p className="text-sm text-red-600">{errors.genero}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tipo_identificacion" className="block text-sm font-medium text-gray-700">
                    Tipo de Identificación
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="tipo_identificacion"
                      name="tipo_identificacion"
                      value={formData.tipo_identificacion}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.tipo_identificacion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                      <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                      <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Registro Civil">Registro Civil</option>
                      <option value="Permiso Especial de Permanencia">Permiso Especial de Permanencia (PEP)</option>
                      <option value="Permiso por Protección Temporal">Permiso por Protección Temporal (PPT)</option>
                    </select>
                  </div>
                  {errors.tipo_identificacion && (
                    <p className="text-sm text-red-600">{errors.tipo_identificacion}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="numero_identificacion" className="block text-sm font-medium text-gray-700">
                    Número de Identificación
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="numero_identificacion"
                      name="numero_identificacion"
                      value={formData.numero_identificacion}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.numero_identificacion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="123456789"
                    />
                  </div>
                  {errors.numero_identificacion && (
                    <p className="text-sm text-red-600">{errors.numero_identificacion}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  Acepto los términos y condiciones del sistema y autorizo el procesamiento de mis datos
                  personales para la validación de mi perfil profesional.
                </label>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <UserPlus className="w-5 h-5" />
                <span>Enviar Solicitud</span>
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-red-600 hover:text-red-500 font-medium transition-colors cursor-pointer border-none bg-transparent p-0"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;