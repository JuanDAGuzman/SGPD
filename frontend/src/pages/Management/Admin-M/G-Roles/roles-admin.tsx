import React from "react";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import Table from "../../../../components/Data_tables/Data_table_Rol_List";
import { Shield } from "lucide-react";

const Manage_roles: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <div className="pt-24">
                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-[#B71C1C]" />
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <Table />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Manage_roles;
