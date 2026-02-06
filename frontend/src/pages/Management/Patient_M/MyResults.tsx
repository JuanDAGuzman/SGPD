import React, { useState, useEffect } from 'react';
import { FileText, FlaskConical, Download, Calendar, Loader2, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { getAllLabResults } from '../../../services/labResultService';
import PatientNavbar from '../../../components/NavBar/PatientNavbar';
import Footer from '../../../components/Footer/Footer';

const MyResults: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            setError(null);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.patientId) {
                    const data = await getAllLabResults(user.patientId);
                    setResults(Array.isArray(data) ? data.reverse() : []);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar los resultados');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calcular estadísticas
    const now = new Date();
    const thisMonth = results.filter(r => {
        const resultDate = new Date(r.date);
        return resultDate.getMonth() === now.getMonth() && resultDate.getFullYear() === now.getFullYear();
    }).length;

    const withFiles = results.filter(r => r.resultFile).length;
    const recentResults = results.filter(r => {
        const resultDate = new Date(r.date);
        const diffDays = Math.floor((now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));
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
                            <FlaskConical className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Mis Resultados</h1>
                            <p className="text-white/90">Laboratorios y exámenes médicos</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{results.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-blue-600 rounded-full"></div>
                        </div>

                        {/* Este Mes */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Este Mes</p>
                                    <p className="text-2xl font-bold text-gray-800">{thisMonth}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-green-600 rounded-full"></div>
                        </div>

                        {/* Disponibles */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Disponibles</p>
                                    <p className="text-2xl font-bold text-gray-800">{withFiles}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Download className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-purple-600 rounded-full"></div>
                        </div>

                        {/* Recientes */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Últimos 30 días</p>
                                    <p className="text-2xl font-bold text-gray-800">{recentResults}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={loadResults}
                            className="mt-4 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#900000] transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : results.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes resultados disponibles</h3>
                        <p className="text-gray-400 mb-4">Los resultados de tus exámenes aparecerán aquí cuando estén listos.</p>
                        <a
                            href="/dashboard_patient"
                            className="inline-block px-6 py-2 bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000] transition-colors"
                        >
                            Ir al Dashboard
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-50 p-3 rounded-lg text-[#B71C1C]">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">{result.description}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(result.date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {result.resultFile ? (
                                        <a
                                            href={result.resultFile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#B71C1C] hover:bg-[#900000] text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto"
                                        >
                                            <Download className="w-4 h-4" />
                                            Descargar Resultado
                                        </a>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                                            Archivo no disponible
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            </div>

            <Footer />
        </div>
    );
};

export default MyResults;
