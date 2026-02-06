// API Service para pacientes
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

const safeFetch = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        throw new Error('No se pudo conectar con el servidor.');
    }
};

export interface PatientBackend {
    id: number;
    userId: number;
    contactInfo: string;
    clinicalInfo: string;
    createdAt: string;
    updatedAt: string;
    User: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

// Obtener todos los pacientes
export const getPatients = async () => {
    try {
        const response = await safeFetch(`${API_BASE}/patients`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.warn('Error fetching patients:', error);
        return [];
    }
};

// Crear paciente
export const createPatient = async (data: {
    userId: number; // El ID de un usuario existente que será paciente
    contactInfo: string;
    clinicalInfo: string;
}) => {
    const response = await safeFetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};
