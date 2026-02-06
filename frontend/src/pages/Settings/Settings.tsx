import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorNavbar from '../../components/NavBar/DoctorNavbar';
import PatientNavbar from '../../components/NavBar/PatientNavbar';
import AdminNavbar from '../../components/NavBar/AdminNavbar';
import Footer from '../../components/Footer/Footer';
import {
  Settings as SettingsIcon, Lock, Bell, User, Clock,
  Shield, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';

interface UserSettings {
  emailNotifications: boolean;
  appointmentReminders: boolean;
  urgentAlerts: boolean;
  weeklyReport: boolean;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Settings states
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    appointmentReminders: true,
    urgentAlerts: true,
    weeklyReport: false
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      // Cargar configuraciones guardadas del usuario si existen
      loadUserSettings(userData.id);
    }
    setLoading(false);
  }, []);

  const loadUserSettings = (userId: number) => {
    // Intentar cargar desde localStorage
    const savedSettings = localStorage.getItem(`settings_${userId}`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // Guardar en localStorage (en producción, esto iría al backend)
      if (user?.id) {
        localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      }

      setNotification({ type: 'success', message: 'Configuraciones guardadas correctamente' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al guardar configuraciones' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setNotification({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      setSaving(true);

      // Aquí iría la llamada al backend para cambiar la contraseña
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar contraseña');
      }

      setNotification({ type: 'success', message: 'Contraseña actualizada correctamente' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Error al cambiar contraseña' });
    } finally {
      setSaving(false);
    }
  };

  const getNavbar = () => {
    switch (user?.role) {
      case 'doctor':
        return <DoctorNavbar />;
      case 'patient':
        return <PatientNavbar />;
      case 'admin':
        return <AdminNavbar />;
      default:
        return <DoctorNavbar />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {getNavbar()}

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <SettingsIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Configuraciones</h1>
                <p className="text-red-100">Personaliza tu experiencia en el sistema</p>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 shadow-lg ${
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
              <p className={`font-semibold ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'general'
                    ? 'bg-[#B71C1C] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                General
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'security'
                    ? 'bg-[#B71C1C] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                Seguridad
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'notifications'
                    ? 'bg-[#B71C1C] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5" />
                Notificaciones
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#B71C1C]" />
                    Información General
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Nombre</p>
                      <p className="font-semibold text-gray-800">{user?.name || 'No disponible'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-800">{user?.email || 'No disponible'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Rol</p>
                      <p className="font-semibold text-gray-800 capitalize">{user?.role || 'No disponible'}</p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate(user?.role === 'doctor' ? '/profile_D' : user?.role === 'patient' ? '/profile_P' : '/profile_A')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                      >
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-[#B71C1C]" />
                    Cambiar Contraseña
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contraseña Actual *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nueva Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirmar Nueva Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Cambiar Contraseña
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-[#B71C1C]" />
                    Preferencias de Notificaciones
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Notificaciones por Email</p>
                        <p className="text-sm text-gray-600">Recibe notificaciones en tu correo electrónico</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B71C1C]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Recordatorios de Citas</p>
                        <p className="text-sm text-gray-600">Recibe recordatorios antes de tus citas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appointmentReminders}
                          onChange={(e) => setSettings({ ...settings, appointmentReminders: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B71C1C]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Alertas Urgentes</p>
                        <p className="text-sm text-gray-600">Notificaciones importantes del sistema</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.urgentAlerts}
                          onChange={(e) => setSettings({ ...settings, urgentAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B71C1C]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Reporte Semanal</p>
                        <p className="text-sm text-gray-600">Resumen de actividad semanal por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReport}
                          onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B71C1C]"></div>
                      </label>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="px-8 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Guardar Preferencias
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
