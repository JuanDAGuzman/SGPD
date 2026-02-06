import React, { useEffect, useState } from 'react';
import { Pill, Clock, Calendar, AlertCircle } from 'lucide-react';
import { getActiveTreatments } from '../../services/medicalHistoryService';

const ActiveTreatmentsWidget = () => {
    const [treatments, setTreatments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTreatments = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.patientId) {
                        const data = await getActiveTreatments(user.patientId);
                        setTreatments(data);
                    }
                }
            } catch (error) {
                console.error("Error loading treatments", error);
            } finally {
                setLoading(false);
            }
        };
        loadTreatments();
    }, []);

    if (loading) return <div className="animate-pulse bg-gray-200 h-40 rounded-xl"></div>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Pill className="text-[#B71C1C] w-5 h-5" />
                    Tratamientos Activos
                </h3>
            </div>

            {treatments.length > 0 ? (
                <div className="space-y-4">
                    {treatments.map((t) => (
                        <div key={t.id} className="p-4 bg-red-50 rounded-lg border-l-4 border-[#B71C1C]">
                            <h4 className="font-bold text-gray-900">{t.medicationName}</h4>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-700">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#B71C1C]" />
                                    {t.frequency}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Pill className="w-3 h-3 text-[#B71C1C]" />
                                    {t.dosage}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                <span>Dr. {t.Doctor?.User?.name}</span>
                                <span>Hasta: {new Date(t.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Pill className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No tienes tratamientos activos.</p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <a href="/medical_history" className="text-sm text-[#B71C1C] font-medium hover:underline flex items-center justify-center gap-1">
                    Ver historial completo
                </a>
            </div>
        </div>
    );
};

export default ActiveTreatmentsWidget;
