const API_BASE = 'http://localhost:4000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

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

export interface DoctorProfile {
    id: number;
    userId: number;
    specialty: string;
    medicalCenterId: number;
    User: {
        id: number;
        name: string;
        email: string;
        role: string;
        phone?: string;
        city?: string;
    };
    MedicalCenter?: {
        name: string;
        address: string;
    };
}

export const getDoctorProfile = async (): Promise<DoctorProfile> => {
    const response = await safeFetch(`${API_BASE}/doctors/profile`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export interface UpdateDoctorProfileData {
    name?: string;
    specialty?: string;
    phone?: string;
    city?: string;
}

export const updateDoctorProfile = async (data: UpdateDoctorProfileData) => {
    const response = await safeFetch(`${API_BASE}/doctors/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};
