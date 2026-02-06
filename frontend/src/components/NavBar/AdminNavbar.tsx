import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Bell, User, Settings, LogOut, Shield, Building, FileText } from 'lucide-react';

const navbarlinks = [
    {
        id: 1,
        title: "Dashboard",
        link: "/dashboard_admin",
    },
    {
        id: 2,
        title: "Usuarios",
        link: "/user_list_admin",
    },
    {
        id: 3,
        title: "Mi Perfil",
        link: "/profile_A",
    },
];

const AdminNavbar: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user?.name) {
                    setUserName(user.name);
                }
            }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#B71C1C] shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center sm:px-12 sm:py-6 px-4 py-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-bold text-2xl">UMB</h1>
                    <span className="hidden sm:inline-block px-3 py-1 bg-white rounded text-[#B71C1C] text-xs font-bold">
                        Admin
                    </span>
                </div>

                <button onClick={toggleMenu} className="md:hidden text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L16 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                <div className="hidden md:flex justify-center items-center">
                    <ul className="flex sm:space-x-8 space-x-4">
                        {navbarlinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    className="text-white text-sm sm:text-lg hover:text-sky-300 transition-transform hover:scale-110 transform inline-block duration-300"
                                    href={link.link}
                                >
                                    {link.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="hidden md:flex items-center space-x-2">
                    <div className="flex items-center space-x-1 mr-4">
                        <a
                            href="/user_list_admin"
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white hover:text-sky-300 rounded-lg transition-all duration-200 group"
                            title="Gestionar Usuarios"
                        >
                            <Users className="w-4 h-4" />
                            <span className="hidden lg:inline text-xs">Usuarios</span>
                        </a>

                        <a
                            href="/register_doctor_admin"
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white hover:text-sky-300 rounded-lg transition-all duration-200 group"
                            title="Registrar Doctor"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden lg:inline text-xs">Doctor</span>
                        </a>

                        <a
                            href="/health_center_list"
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white hover:text-sky-300 rounded-lg transition-all duration-200 group"
                            title="Centros de Salud"
                        >
                            <Building className="w-4 h-4" />
                            <span className="hidden lg:inline text-xs">Centros</span>
                        </a>

                        <a
                            href="/notifications_admin"
                            className="relative flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white hover:text-sky-300 rounded-lg transition-all duration-200 group"
                            title="Notificaciones"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="hidden lg:inline text-xs">Alertas</span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">5</span>
                            </span>
                        </a>
                    </div>

                    <div className="relative">
                        <button
                            onClick={toggleProfile}
                            className="flex items-center space-x-2 px-3 py-2 text-white hover:text-sky-300 rounded-lg transition-all duration-200"
                        >
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{getInitials(userName)}</span>
                            </div>
                            <span className="hidden lg:inline text-sm">{userName}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="font-medium text-gray-800">{userName}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Administrador
                                    </p>
                                </div>
                                <a href="/profile_A" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <User className="w-4 h-4 mr-3" />
                                    Mi Perfil
                                </a>
                                <a href="/manage_roles" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <Shield className="w-4 h-4 mr-3" />
                                    Gestionar Roles
                                </a>
                                <a href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <Settings className="w-4 h-4 mr-3" />
                                    Configuraciones
                                </a>
                                <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute w-full bg-[#B71C1C] transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <ul className="flex flex-col px-4 py-2">
                    {navbarlinks.map((link) => (
                        <li key={link.id} className="py-2 text-center">
                            <a
                                className="text-white hover:text-sky-300"
                                href={link.link}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="px-4 py-2 border-t border-white border-opacity-20">
                    <p className="text-white text-sm font-medium mb-2">Accesos Rápidos</p>
                    <div className="grid grid-cols-2 gap-2">
                        <a href="/user_list_admin" className="flex items-center justify-center space-x-2 px-3 py-2 text-white bg-red-600 rounded-lg text-sm">
                            <Users className="w-4 h-4" />
                            <span>Usuarios</span>
                        </a>
                        <a href="/register_doctor_admin" className="flex items-center justify-center space-x-2 px-3 py-2 text-white bg-red-600 rounded-lg text-sm">
                            <UserPlus className="w-4 h-4" />
                            <span>Doctor</span>
                        </a>
                        <a href="/health_center_list" className="flex items-center justify-center space-x-2 px-3 py-2 text-white bg-red-600 rounded-lg text-sm">
                            <Building className="w-4 h-4" />
                            <span>Centros</span>
                        </a>
                        <a href="/notifications_admin" className="flex items-center justify-center space-x-2 px-3 py-2 text-white bg-red-600 rounded-lg text-sm relative">
                            <Bell className="w-4 h-4" />
                            <span>Alertas</span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">5</span>
                            </span>
                        </a>
                    </div>
                </div>

                <div className="px-4 py-2 border-t border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{getInitials(userName)}</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">{userName}</p>
                            <p className="text-red-200 text-sm">Administrador</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <a href="/profile_A" className="block text-white hover:text-sky-300 text-sm py-1">Mi Perfil</a>
                        <a href="/manage_roles" className="block text-white hover:text-sky-300 text-sm py-1">Gestionar Roles</a>
                        <a href="/settings" className="block text-white hover:text-sky-300 text-sm py-1">Configuraciones</a>
                        <button
                            onClick={handleLogout}
                            className="block text-red-200 hover:text-white text-sm py-1"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
