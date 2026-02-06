/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getAllLabResults = async (patientId?: number) => {
    const url = patientId
        ? `${API_BASE}/lab-results?patientId=${patientId}`
        : `${API_BASE}/lab-results`;

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createLabResult = async (data: {
    patientId: number;
    date: string;
    description: string;
    resultFile?: string; // URL o Base64
}) => {
    const response = await fetch(`${API_BASE}/lab-results`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};
