import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import {
  Bell, CheckCircle, AlertCircle, Info, Calendar,
  Trash2, Check, Loader2, Filter
} from 'lucide-react';
import { getNotifications, markAsRead, deleteNotification } from '../../../services/notificationService';

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  urgent: boolean;
  createdAt: string;
}

const NotificationsDoctor: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => markAsRead(id)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error al marcar todas:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.urgent;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, urgent: boolean) => {
    if (urgent) return <AlertCircle className="w-5 h-5 text-red-500" />;

    switch (type) {
      case 'cita':
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DoctorNavbar />

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Bell className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Notificaciones</h1>
                  <p className="text-red-100">Mantente al día con las actualizaciones del sistema</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{unreadCount}</p>
                <p className="text-red-100 text-sm">Sin leer</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-[#B71C1C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  filter === 'unread'
                    ? 'bg-[#B71C1C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sin leer ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  filter === 'urgent'
                    ? 'bg-[#B71C1C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Urgentes
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#B71C1C] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Cargando notificaciones...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones'}
              </h3>
              <p className="text-gray-400">
                {filter === 'all'
                  ? 'Las notificaciones aparecerán aquí cuando las recibas'
                  : 'Cambia el filtro para ver otras notificaciones'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    !notification.read ? 'border-l-4 border-[#B71C1C]' : 'border-l-4 border-transparent'
                  } ${notification.urgent ? 'ring-2 ring-red-300' : ''}`}
                >
                  <div className="p-4 flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.urgent ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type, notification.urgent)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#B71C1C] rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como leída"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsDoctor;
