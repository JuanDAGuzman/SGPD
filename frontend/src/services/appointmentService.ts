// API Service para el sistema de citas
const API_BASE = 'http://localhost:4000/api';

// Helper para obtener el token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Helper para manejar respuestas
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(error.message || error.error || 'Error en la solicitud');
    }
    return response.json();
};

// Helper para manejar errores de conexión graciosamente
const safeFetch = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        // Si es un error de conexión, lanzamos un error más amigable
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
};

// ==================== SOLICITUDES DE CITAS ====================

// Crear una solicitud de cita (paciente)
export const createAppointmentRequest = async (data: {
    message: string;
    preferredDate?: string;
    specialty?: string;
    type?: 'presencial' | 'virtual';
}) => {
    const response = await safeFetch(`${API_BASE}/appointment-requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Obtener todas las solicitudes de citas
export const getAppointmentRequests = async (params?: { patientId?: number; status?: string }) => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.patientId) queryParams.append('patientId', params.patientId.toString());
        if (params?.status) queryParams.append('status', params.status);

        const response = await safeFetch(`${API_BASE}/appointment-requests?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        // Si hay error de conexión, retornamos arreglo vacío en lugar de fallar
        console.warn('No se pudieron cargar las solicitudes:', error);
        return [];
    }
};

// Actualizar estado de solicitud (doctor/admin)
export const updateAppointmentRequestStatus = async (
    id: number,
    data: { status: string; rejectionReason?: string }
) => {
    const response = await safeFetch(`${API_BASE}/appointment-requests/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Cancelar solicitud de cita
export const cancelAppointmentRequest = async (id: number) => {
    const response = await safeFetch(`${API_BASE}/appointment-requests/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// ==================== CITAS CONFIRMADAS ====================

// Crear una cita confirmada (doctor/admin)
export const createAppointment = async (data: {
    patientId: number;
    doctorId: number;
    date: string;
    type: 'presencial' | 'virtual';
    location?: string;
    address?: string;
    room?: string;
    notes?: string;
    requestId?: number; // ID de la solicitud original
}) => {
    const response = await safeFetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Obtener todas las citas
export const getAppointments = async (params?: {
    patientId?: number;
    doctorId?: number;
    status?: string;
}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.patientId) queryParams.append('patientId', params.patientId.toString());
        if (params?.doctorId) queryParams.append('doctorId', params.doctorId.toString());
        if (params?.status) queryParams.append('status', params.status);

        const response = await safeFetch(`${API_BASE}/appointments?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        // Si hay error de conexión, retornamos arreglo vacío en lugar de fallar
        console.warn('No se pudieron cargar las citas:', error);
        return [];
    }
};

// Obtener una cita por ID
export const getAppointmentById = async (id: number) => {
    const response = await safeFetch(`${API_BASE}/appointments/${id}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// Actualizar una cita (doctor/admin)
export const updateAppointment = async (
    id: number,
    data: Partial<{
        date: string;
        status: string;
        notes: string;
        location: string;
        room: string;
    }>
) => {
    const response = await safeFetch(`${API_BASE}/appointments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Cancelar una cita
export const cancelAppointment = async (id: number) => {
    const response = await safeFetch(`${API_BASE}/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// ==================== DOCTORES ====================

// Obtener lista de doctores
export const getDoctors = async () => {
    try {
        const response = await safeFetch(`${API_BASE}/doctors`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.warn('No se pudieron cargar los doctores:', error);
        return [];
    }
};

// Obtener doctor por ID
export const getDoctorById = async (id: number) => {
    const response = await safeFetch(`${API_BASE}/doctors/${id}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// ==================== TIPOS ====================

export interface AppointmentRequest {
    id: number;
    patientId: number;
    message: string;
    preferredDate: string | null;
    specialty?: string;
    type?: 'presencial' | 'virtual';
    status: 'pendiente' | 'aceptada' | 'rechazada';
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    Patient?: {
        id: number;
        userId: number;
        User?: {
            name: string;
            email: string;
        };
    };
}

export interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    date: string;
    status: 'programada' | 'finalizada' | 'cancelada' | 'reprogramada' | 'no_asistio' | 'en_atencion';
    type: 'presencial' | 'virtual';
    location?: string;
    address?: string;
    room?: string;
    meetingLink?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    Patient?: {
        id: number;
        userId: number;
        User?: {
            name: string;
            email: string;
        };
    };
    Doctor?: {
        id: number;
        userId: number;
        specialty?: string;
        User?: {
            name: string;
            email: string;
        };
    };
}

export interface Doctor {
    id: number;
    userId: number;
    specialty?: string;
    medicalCenterId: number;
    User?: {
        name: string;
        email: string;
    };
    MedicalCenter?: {
        name: string;
        address: string;
    };
}
