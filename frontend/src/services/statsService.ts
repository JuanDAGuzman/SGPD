const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface DoctorStats {
  patientsAttended: number;
  virtualConsultations: number;
  appointmentsThisMonth: number;
  upcomingAppointments: Array<{
    id: number;
    date: string;
    type: string;
    location?: string;
    patientName: string;
    meetingLink?: string;
  }>;
}

/**
 * Obtiene las estadísticas del dashboard del doctor
 */
export const getDoctorDashboardStats = async (): Promise<DoctorStats> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/stats/doctor-dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del doctor');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getDoctorDashboardStats:', error);
    throw error;
  }
};
