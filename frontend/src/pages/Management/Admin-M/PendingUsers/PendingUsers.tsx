import React, { useState, useEffect } from "react";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import { UserCheck, Check, X, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PendingUser {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const PendingUsers: React.FC = () => {
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:4000/api/admin/pending-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener usuarios pendientes");
            }

            const data = await response.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId: number, status: "active" | "rejected") => {
        if (!window.confirm(`¿Estás seguro de ${status === "active" ? "aprobar" : "rechazar"} este usuario?`)) return;

        try {
            setActionLoading(userId);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar estado");
            }

            // Eliminar de la lista local
            setUsers(users.filter((user) => user.id !== userId));
            alert(`Usuario ${status === "active" ? "aprobado" : "rechazado"} exitosamente.`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />

            <div className="flex-1 pt-32 pb-12 mt-4">
                <main className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <UserCheck className="w-8 h-8 text-[#B71C1C]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Solicitudes de Registro</h1>
                            <p className="text-gray-500">Administra el acceso de nuevos usuarios al sistema</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center gap-3">
                            <AlertCircle className="text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-12 flex justify-center items-center flex-col gap-4 text-gray-500">
                                <Loader className="w-10 h-10 animate-spin text-[#B71C1C]" />
                                <p>Cargando solicitudes...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <UserCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No hay solicitudes pendientes</p>
                                <p className="text-sm">Los nuevos registros aparecerán aquí.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol Solicitado</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <div className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.role === 'patient' ? 'Paciente' : user.role === 'doctor' ? 'Médico' : user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleStatusChange(user.id, "active")}
                                                            disabled={actionLoading === user.id}
                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                                                            title="Aprobar acceso"
                                                        >
                                                            {actionLoading === user.id ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                            Aprobar
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(user.id, "rejected")}
                                                            disabled={actionLoading === user.id}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                                                            title="Rechazar acceso"
                                                        >
                                                            {actionLoading === user.id ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                            Rechazar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default PendingUsers;
