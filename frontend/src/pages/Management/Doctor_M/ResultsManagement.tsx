import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../../components/NavBar/DoctorNavbar';
import Footer from '../../../components/Footer/Footer';
import { Search, Upload, FileText, AlertCircle, FlaskConical, Loader2, User } from 'lucide-react';
import { getPatients } from '../../../services/patientService';
import { getAllLabResults, createLabResult } from '../../../services/labResultService';

const ResultsManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [uploadHistory, setUploadHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Formulario de subida
    const [form, setForm] = useState({
        description: '',
        date: new Date().toISOString().split('T')[0],
        fileUrl: ''
    });

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            loadPatientResults(selectedPatient.id);
        }
    }, [selectedPatient]);

    const loadPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading patients", error);
        }
    };

    const loadPatientResults = async (patientId: number) => {
        setLoading(true);
        try {
            const results = await getAllLabResults(patientId);
            setUploadHistory(Array.isArray(results) ? results.reverse() : []);
        } catch (error) {
            console.error("Error loading results", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;

        try {
            setLoading(true);
            setNotification(null);
            await createLabResult({
                patientId: selectedPatient.id,
                date: form.date,
                description: form.description,
                resultFile: form.fileUrl
            });

            // Recargar lista y limpiar form
            await loadPatientResults(selectedPatient.id);
            setForm({ date: new Date().toISOString().split('T')[0], description: '', fileUrl: '' });
            setNotification({ type: 'success', message: 'Resultado registrado exitosamente' });

            // Auto-hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        } catch (error) {
            console.error("Error creating result", error);
            setNotification({ type: 'error', message: 'Error al registrar resultado. Por favor intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.User?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DoctorNavbar />

            <div className="flex-1 pt-24">
                <main className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#B71C1C] to-[#900000] rounded-xl p-6 text-white shadow-lg mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FlaskConical className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Gestión de Resultados</h1>
                            <p className="text-red-100">Sube y gestiona exámenes de laboratorio de tus pacientes</p>
                        </div>
                    </div>
                </div>

                {/* Notificación */}
                {notification && (
                    <div
                        className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 shadow-lg animate-fade-in ${
                            notification.type === 'success'
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50 border-red-500'
                        }`}
                    >
                        {notification.type === 'success' ? (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <p className={`font-semibold ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className={`${notification.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Panel Izquierdo: Buscador de Pacientes */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit border-l-4 border-[#B71C1C]">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-[#B71C1C]" /> Buscar Paciente
                        </h2>

                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre o email..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {filteredPatients.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No se encontraron pacientes</p>
                                </div>
                            ) : (
                                filteredPatients.map(patient => (
                                    <button
                                        key={patient.id}
                                        onClick={() => setSelectedPatient(patient)}
                                        className={`w-full text-left p-3 rounded-lg transition-all border ${selectedPatient?.id === patient.id
                                                ? 'bg-red-50 border-[#B71C1C] ring-2 ring-red-100'
                                                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="font-semibold text-gray-800">{patient.User?.name}</p>
                                        <p className="text-xs text-gray-500">{patient.User?.email}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Panel Derecho: Formulario y Lista */}
                    <div className="lg:col-span-2 space-y-6">
                        {!selectedPatient ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                                <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">Selecciona un paciente</h3>
                                <p className="text-gray-500 mt-2">Busca y selecciona un paciente para gestionar sus resultados.</p>
                            </div>
                        ) : (
                            <>
                                {/* Información del Paciente Seleccionado */}
                                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-[#B71C1C]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#B71C1C] rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedPatient.User?.name}</p>
                                            <p className="text-sm text-gray-600">{selectedPatient.User?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Subida */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-purple-600" /> Subir Nuevo Resultado
                                    </h2>

                                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción / Tipo de Examen</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                placeholder="Ej: Hemograma Completo"
                                                value={form.description}
                                                onChange={e => setForm({ ...form, description: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha del Examen</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                value={form.date}
                                                onChange={e => setForm({ ...form, date: e.target.value })}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Enlace al Archivo (PDF/Imagen)</label>
                                            <input
                                                type="url"
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                                placeholder="https://cloud-storage.com/resultado.pdf"
                                                value={form.fileUrl}
                                                onChange={e => setForm({ ...form, fileUrl: e.target.value })}
                                            />
                                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-blue-700">
                                                    Por el momento, ingresa el link directo al archivo alojado en la nube (Google Drive, Dropbox, etc.).
                                                </p>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, description: '', fileUrl: '' })}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Registrar Resultado
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Historial */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            Historial de Resultados
                                        </h3>
                                        {uploadHistory.length > 0 && (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                                {uploadHistory.length} {uploadHistory.length === 1 ? 'resultado' : 'resultados'}
                                            </span>
                                        )}
                                    </div>

                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                        </div>
                                    ) : uploadHistory.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-400 font-medium">No hay resultados registrados</p>
                                            <p className="text-gray-400 text-sm mt-1">Los resultados que subas aparecerán aquí</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {uploadHistory.map((result: any) => (
                                                <div
                                                    key={result.id}
                                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-green-100 p-3 rounded-lg">
                                                            <FlaskConical className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{result.description}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(result.date).toLocaleDateString('es-CO', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={result.resultFile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Ver Archivo
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ResultsManagement;
