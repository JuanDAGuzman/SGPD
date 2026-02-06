const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  urgent: boolean;
  createdAt: string;
}

/**
 * Obtiene todas las notificaciones del usuario autenticado
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getNotifications:', error);
    return [];
  }
};

/**
 * Marca una notificación como leída
 */
export const markAsRead = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar como leída');
    }
  } catch (error) {
    console.error('Error en markAsRead:', error);
    throw error;
  }
};

/**
 * Elimina una notificación
 */
export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar notificación');
    }
  } catch (error) {
    console.error('Error en deleteNotification:', error);
    throw error;
  }
};

/**
 * Crea una nueva notificación
 */
export const createNotification = async (notification: {
  userId: number;
  type: string;
  message: string;
  urgent?: boolean;
}): Promise<Notification> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Error al crear notificación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createNotification:', error);
    throw error;
  }
};
