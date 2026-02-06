import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Footprints } from 'lucide-react';
import PatientNavbar from "../../../components/NavBar/PatientNavbar";
import WelcomeSection from "../../../components/DashboardPatient/WelcomeSection";
import PatientHero from "../../../components/DashboardPatient/PatientHero";
import AutocareSection from "../../../components/DashboardPatient/AutocareSection";
import EventsCalendar from "../../../components/DashboardPatient/EventsCalendar";
import Footer from "../../../components/Footer/Footer";
import ActiveTreatmentsWidget from "../../../components/DashboardPatient/ActiveTreatmentsWidget";

const Patient_D: React.FC = () => {
  const [userName, setUserName] = useState<string>("Paciente");

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PatientNavbar />

      <div className="flex-1 pt-24">
        <main className="container mx-auto px-4 py-8">
          <WelcomeSection userName={userName} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PatientHero />
              <AutocareSection />
            </div>

            <div className="lg:col-span-1 space-y-8">

              {/* Widget de Registros */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Mi Historial</h3>
                <div className="space-y-3">
                  <Link to="/my_results" className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Laboratorios</p>
                      <p className="text-xs text-gray-500">Ver resultados</p>
                    </div>
                  </Link>

                  <Link to="/my_evaluations" className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                      <Footprints className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Pie Diabético</p>
                      <p className="text-xs text-gray-500">Mis evaluaciones</p>
                    </div>
                  </Link>
                </div>
              </div>

              <ActiveTreatmentsWidget />
              <EventsCalendar />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Patient_D;
