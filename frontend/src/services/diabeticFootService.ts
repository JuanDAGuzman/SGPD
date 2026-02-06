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

export const getAllDiabeticFootRecords = async (patientId?: number) => {
    const url = patientId
        ? `${API_BASE}/diabetic-foot-records?patientId=${patientId}`
        : `${API_BASE}/diabetic-foot-records`;

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createDiabeticFootRecord = async (data: {
    patientId: number;
    date: string;
    description: string;
}) => {
    const response = await fetch(`${API_BASE}/diabetic-foot-records`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};
