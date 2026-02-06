import React, { useState, useEffect } from "react";
import AdminNavbar from "../../../components/NavBar/AdminNavbar";
import Footer from "../../../components/Footer/Footer";
import { FaSearch } from "react-icons/fa";
import { Bell, Trash2, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  urgent: boolean;
  link: string | null;
  createdAt: string;
}

const Notifications_Admin: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar notificaciones");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la notificación");
      }

      setNotifications(notifications.filter((notif) => notif.id !== id));
      if (selectedNotification?.id === id) {
        setSelectedNotification(null);
      }
    } catch (err: any) {
      setError(err.message || "Error al eliminar la notificación");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/notifications/${id}/mark-as-read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al marcar como leída");
      }

      setNotifications(notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (err: any) {
      setError(err.message || "Error al marcar como leída");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications
    .filter(
      (notif) =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (searchDate === "" || notif.createdAt.includes(searchDate))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-24">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-[#B71C1C]" />
            <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
            <span className="px-2 py-1 bg-red-100 text-[#B71C1C] text-sm font-medium rounded-full">
              {notifications.filter(n => !n.read).length} sin leer
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Barra de búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button className="px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#900000] transition-colors flex items-center gap-2">
              <FaSearch />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-[#B71C1C] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 text-sm font-medium">Cargando notificaciones...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de notificaciones */}
              <div className="lg:col-span-2 space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay notificaciones que mostrar</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${getTypeBorderColor(notif.type)} ${!notif.read ? "ring-2 ring-red-100" : ""
                        } cursor-pointer hover:shadow-xl transition-all duration-300`}
                      onClick={() => handleViewDetails(notif)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getTypeIcon(notif.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                              {!notif.read && (
                                <span className="w-2 h-2 bg-[#B71C1C] rounded-full"></span>
                              )}
                              {notif.urgent && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                  Urgente
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">{formatDate(notif.createdAt)}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notif.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Panel de detalles */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Detalles</h2>
                  {selectedNotification ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {getTypeIcon(selectedNotification.type)}
                        <span className={`text-sm font-medium ${selectedNotification.type === "success" ? "text-green-600" :
                          selectedNotification.type === "warning" ? "text-yellow-600" :
                            selectedNotification.type === "error" ? "text-red-600" :
                              "text-blue-600"
                          }`}>
                          {selectedNotification.type === "success" ? "Éxito" :
                            selectedNotification.type === "warning" ? "Advertencia" :
                              selectedNotification.type === "error" ? "Error" :
                                "Información"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {selectedNotification.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedNotification.message}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400 border-t pt-4">
                        <span>{formatDate(selectedNotification.createdAt)}</span>
                        <button
                          onClick={() => handleDeleteNotification(selectedNotification.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecciona una notificación para ver los detalles
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Notifications_Admin;
