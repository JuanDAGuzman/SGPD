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

export const createMedicalHistory = async (data: any) => {
    const response = await safeFetch(`${API_BASE}/medical-history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const getMedicalHistoryByPatient = async (patientId: number) => {
    const response = await safeFetch(`${API_BASE}/medical-history?patientId=${patientId}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const getActiveTreatments = async (patientId: number) => {
    const response = await safeFetch(`${API_BASE}/medical-history/active-treatments?patientId=${patientId}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const getPatientStats = async (patientId: number) => {
    const response = await safeFetch(`${API_BASE}/medical-history/stats?patientId=${patientId}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};
