import React from "react";
import AdminNavbar from "../../../../components/NavBar/AdminNavbar";
import Footer from "../../../../components/Footer/Footer";
import Table from "../../../../components/Data_tables/Data_table_User_list_patient";
import { Users } from "lucide-react";

const List_patients_admin: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <div className="pt-24">
                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-8 h-8 text-[#B71C1C]" />
                        <h1 className="text-2xl font-bold text-gray-800">Lista de Pacientes</h1>
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

export default List_patients_admin;
