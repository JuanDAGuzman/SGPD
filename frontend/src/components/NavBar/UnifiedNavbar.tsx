import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Users, Calendar, Video, Bell, User, Settings, LogOut,
    Stethoscope, ClipboardList, Building, Shield, FileText,
    Home, Upload
} from 'lucide-react';

// Configuración de navegación por rol
const getNavConfig = (role: string) => {
    const config: Record<string, { links: Array<{ id: number; title: string; link: string }>; quickActions: Array<{ icon: React.ReactNode; title: string; link: string; badge?: boolean }> }> = {
        patient: {
            links: [
                { id: 1, title: "Dashboard", link: "/dashboard_patient" },
                { id: 2, title: "Mi Perfil", link: "/profile_P" },
                { id: 3, title: "Soporte", link: "/Support" },
            ],
            quickActions: [
                { icon: <Calendar className="w-4 h-4" />, title: "Citas", link: "/my_appointments" },
                { icon: <Upload className="w-4 h-4" />, title: "Documentos", link: "/documents" },
                { icon: <Bell className="w-4 h-4" />, title: "Alertas", link: "/notifications" },
            ]
        },
        doctor: {
            links: [
                { id: 1, title: "Dashboard", link: "/dashboard_doctor" },
                { id: 2, title: "Pacientes", link: "/list_patients_doctor" },
                { id: 3, title: "Mi Perfil", link: "/profile_D" },
            ],
            quickActions: [
                { icon: <ClipboardList className="w-4 h-4" />, title: "Solicitudes", link: "/appointment_requests", badge: true },
                { icon: <Calendar className="w-4 h-4" />, title: "Citas", link: "/my_appointments_doctor" },
                { icon: <Video className="w-4 h-4" />, title: "Video", link: "/videoconsulta" },
                { icon: <Bell className="w-4 h-4" />, title: "Alertas", link: "/notifications_doctor" },
            ]
        },
        admin: {
            links: [
                { id: 1, title: "Dashboard", link: "/dashboard_admin" },
                { id: 2, title: "Usuarios", link: "/user_list_admin" },
                { id: 3, title: "Mi Perfil", link: "/profile_A" },
            ],
            quickActions: [
                { icon: <Users className="w-4 h-4" />, title: "Usuarios", link: "/user_list_admin" },
                { icon: <Stethoscope className="w-4 h-4" />, title: "Doctores", link: "/register_doctor_admin" },
                { icon: <Building className="w-4 h-4" />, title: "Centros", link: "/health_center_list" },
                { icon: <Bell className="w-4 h-4" />, title: "Alertas", link: "/notifications_admin" },
            ]
        }
    };

    return config[role] || config.patient;
};

const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
        patient: 'Paciente',
        doctor: 'Doctor',
        admin: 'Admin'
    };
    return badges[role] || 'Usuario';
};

const getProfileLinks = (role: string) => {
    const links: Record<string, Array<{ icon: React.ReactNode; title: string; link: string }>> = {
        patient: [
            { icon: <User className="w-4 h-4" />, title: "Mi Perfil", link: "/profile_P" },
            { icon: <Calendar className="w-4 h-4" />, title: "Mis Citas", link: "/my_appointments" },
            { icon: <Settings className="w-4 h-4" />, title: "Configuraciones", link: "/settings" },
        ],
        doctor: [
            { icon: <User className="w-4 h-4" />, title: "Mi Perfil", link: "/profile_D" },
            { icon: <Users className="w-4 h-4" />, title: "Mis Pacientes", link: "/list_patients_doctor" },
            { icon: <Calendar className="w-4 h-4" />, title: "Mi Agenda", link: "/my_appointments_doctor" },
            { icon: <Settings className="w-4 h-4" />, title: "Configuraciones", link: "/settings" },
        ],
        admin: [
            { icon: <User className="w-4 h-4" />, title: "Mi Perfil", link: "/profile_A" },
            { icon: <Shield className="w-4 h-4" />, title: "Gestión de Roles", link: "/manage_roles" },
            { icon: <Settings className="w-4 h-4" />, title: "Configuraciones", link: "/settings" },
        ]
    };
    return links[role] || links.patient;
};

interface UnifiedNavbarProps {
    role?: 'patient' | 'doctor' | 'admin';
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ role: propRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("Usuario");
    const [userRole, setUserRole] = useState<string>(propRole || "patient");
    const [specialty, setSpecialty] = useState("");

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user?.name) setUserName(user.name);
                if (user?.role && !propRole) setUserRole(user.role);
                if (user?.specialty) setSpecialty(user.specialty);
            }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }
    }, [propRole]);

    // Cerrar menú de perfil al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isProfileOpen) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isProfileOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const toggleProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const navConfig = getNavConfig(userRole);
    const profileLinks = getProfileLinks(userRole);
    const roleBadge = getRoleBadge(userRole);

    const isActiveLink = (link: string) => {
        return location.pathname === link || location.pathname === `/${link}`;
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#B71C1C] shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center sm:px-12 sm:py-5 px-4 py-3">
                {/* Logo y Badge de Rol */}
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center gap-2">
                        <h1 className="text-white font-bold text-2xl">SGPD</h1>
                    </a>
                    <span className="hidden sm:inline-block px-2 py-1 bg-white bg-opacity-20 rounded text-white text-xs font-medium">
                        {roleBadge}
                    </span>
                </div>

                {/* Botón Menú Móvil */}
                <button onClick={toggleMenu} className="md:hidden text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Links de Navegación (Desktop) */}
                <div className="hidden md:flex justify-center items-center">
                    <ul className="flex sm:space-x-8 space-x-4">
                        {navConfig.links.map((link) => (
                            <li key={link.id}>
                                <a
                                    className={`text-sm sm:text-lg transition-all transform inline-block duration-300 ${isActiveLink(link.link)
                                            ? 'text-white font-bold scale-105'
                                            : 'text-white text-opacity-90 hover:text-white hover:scale-110'
                                        }`}
                                    href={link.link}
                                >
                                    {link.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Acciones Rápidas y Perfil (Desktop) */}
                <div className="hidden md:flex items-center space-x-2">
                    <div className="flex items-center space-x-1 mr-4">
                        {navConfig.quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.link}
                                className="relative flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white hover:text-sky-300 rounded-lg transition-all duration-200 group"
                                title={action.title}
                            >
                                {action.icon}
                                <span className="hidden lg:inline text-xs">{action.title}</span>
                                {action.badge && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">!</span>
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Menú de Perfil */}
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
                            <div
                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-4 py-3 border-b">
                                    <p className="font-medium text-gray-800">{userName}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        {userRole === 'doctor' && specialty ? (
                                            <><Stethoscope className="w-3 h-3" /> {specialty}</>
                                        ) : (
                                            <><Shield className="w-3 h-3" /> {roleBadge}</>
                                        )}
                                    </p>
                                </div>

                                {profileLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.link}
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        <span className="mr-3">{link.icon}</span>
                                        {link.title}
                                    </a>
                                ))}

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

            {/* Menú Móvil */}
            <div
                className={`md:hidden absolute w-full bg-[#B71C1C] transition-all duration-300 shadow-lg ${isOpen ? "opacity-100 visible" : "opacity-0 invisible h-0"
                    }`}
            >
                <ul className="flex flex-col px-4 py-2">
                    {navConfig.links.map((link) => (
                        <li key={link.id} className="py-2 text-center">
                            <a
                                className={`${isActiveLink(link.link) ? 'text-white font-bold' : 'text-white text-opacity-90'} hover:text-white`}
                                href={link.link}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="px-4 py-3 border-t border-white border-opacity-20">
                    <p className="text-white text-sm font-medium mb-2">Accesos Rápidos</p>
                    <div className="grid grid-cols-2 gap-2">
                        {navConfig.quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.link}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-white bg-red-600 rounded-lg text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                {action.icon}
                                <span>{action.title}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{getInitials(userName)}</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">{userName}</p>
                            <p className="text-red-200 text-sm">{specialty || roleBadge}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {profileLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.link}
                                className="block text-white hover:text-sky-300 text-sm py-1"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </a>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="block text-red-200 hover:text-white text-sm py-1 w-full text-left"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UnifiedNavbar;
