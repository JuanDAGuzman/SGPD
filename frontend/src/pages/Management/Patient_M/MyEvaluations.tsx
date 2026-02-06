import React, { useState, useEffect } from 'react';
import { Footprints, Calendar, AlertCircle, CheckCircle, Activity, TrendingUp, Clock } from 'lucide-react';
import { getAllDiabeticFootRecords } from '../../../services/diabeticFootService';
import PatientNavbar from '../../../components/NavBar/PatientNavbar';
import Footer from '../../../components/Footer/Footer';

const MyEvaluations: React.FC = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.patientId) {
                    const data = await getAllDiabeticFootRecords(user.patientId);
                    setRecords(Array.isArray(data) ? data.reverse() : []);
                }
            }
        } catch (error) {
            console.error("Error loading records", error);
        } finally {
            setLoading(false);
        }
    };

    const parseDescription = (desc: string) => {
        try {
            return JSON.parse(desc);
        } catch {
            return { inspection: desc };
        }
    };

    const getRiskColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'bajo': return 'bg-green-100 text-green-800 border-green-200';
            case 'moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'alto': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'critico': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Calcular estadísticas
    const now = new Date();
    const thisMonth = records.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }).length;

    const highRisk = records.filter(r => {
        const details = parseDescription(r.description);
        return details.riskLevel?.toLowerCase() === 'alto' || details.riskLevel?.toLowerCase() === 'critico';
    }).length;

    const recentRecords = records.filter(r => {
        const recordDate = new Date(r.date);
        const diffDays = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    }).length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PatientNavbar />

            <div className="flex-1 pt-24">
            <main className="container mx-auto px-4 py-8">
                {/* Red Gradient Header with Stats */}
                <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Footprints className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Evaluaciones de Pie Diabético</h1>
                            <p className="text-white/90">Seguimiento y control podológico</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{records.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Footprints className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-emerald-600 rounded-full"></div>
                        </div>

                        {/* Este Mes */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Este Mes</p>
                                    <p className="text-2xl font-bold text-gray-800">{thisMonth}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-blue-600 rounded-full"></div>
                        </div>

                        {/* Alto Riesgo */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Alto Riesgo</p>
                                    <p className="text-2xl font-bold text-gray-800">{highRisk}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-red-600 rounded-full"></div>
                        </div>

                        {/* Recientes */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Últimos 30 días</p>
                                    <p className="text-2xl font-bold text-gray-800">{recentRecords}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Cargando historial...</div>
                    ) : records.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Footprints className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Sin evaluaciones registradas</h3>
                            <p className="text-gray-500">Aún no tienes registros de evaluación de pie diabético.</p>
                        </div>
                    ) : (
                        records.map((record) => {
                            const details = parseDescription(record.description);
                            const riskColor = getRiskColor(details.riskLevel);

                            return (
                                <div key={record.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Calendar className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">Evaluación del {new Date(record.date).toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-500">Realizada en consulta médica</p>
                                            </div>
                                        </div>

                                        {details.riskLevel && (
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${riskColor} flex items-center gap-2 capitalize`}>
                                                <Activity className="w-4 h-4" />
                                                Riesgo {details.riskLevel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Inspección
                                            </h4>
                                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                                                {details.inspection || 'Sin observaciones'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <Activity className="w-4 h-4" /> Sensibilidad
                                            </h4>
                                            <p className="text-gray-800 font-medium">
                                                {details.sensitivity || 'No registrada'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Vascular (Pulsos)
                                            </h4>
                                            <p className="text-gray-800 font-medium">
                                                {details.vascular || 'No registrado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
            </div>

            <Footer />
        </div>
    );
};

export default MyEvaluations;
