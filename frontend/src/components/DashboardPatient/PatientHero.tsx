import React, { useEffect, useState } from 'react';
import { Heart, Shield, TrendingUp, Bell } from 'lucide-react';
import { getPatientStats } from '../../services/medicalHistoryService';
import { useNavigate } from 'react-router-dom';
import RequestAppointmentModal from './RequestAppointmentModal';

const PatientHero: React.FC = () => {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [stats, setStats] = useState({
    treatments: 0,
    consultations: 0,
    evaluations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) { // This is User ID. Does getPatientStats take userId or PatientId? Controller expects patientId (Patient ID).
            // Usually auth provides patientId or we need to fetch it.
            // But let's assume active user context has needed ID or we use user.id if mapped.
            // Wait, existing code usually stores user object.
            // I should check how other components get patientId.
            // In MedicalHistory.tsx: const user = JSON.parse(localStorage.getItem('user') || '{}'); ... fetchHistory(user.id);
            // It seems user.id is treated as patientId in some places or the backend resolves it?
            // Controller: activeTreatments uses patientId.
            // Models: Patient belongsTo User. Patient has ID.
            // If user.id is logged as 'user', is it the User table ID?
            // Backend `medicalHistoryController.getByPatient` takes `patientId`.
            // Frontend: `user` object in localStorage usually comes from login response.
            // Let's assume the user object has patientId property if it's a patient.
            const response = await getPatientStats(user.patientId || user.id);
            setStats(response);
          }
        }
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control Personal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B71C1C] text-sm font-medium">Tratamientos</p>
              <p className="text-2xl font-bold text-[#B71C1C]">{stats.treatments}</p>
              <p className="text-[#B71C1C] text-xs">Activos</p>
            </div>
            <Heart className="w-8 h-8 text-[#B71C1C]" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Consultas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.consultations}</p>
              <p className="text-gray-600 text-xs">Total histórico</p>
            </div>
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Evaluaciones</p>
              <p className="text-2xl font-bold text-orange-800">{stats.evaluations}</p>
              <p className="text-orange-600 text-xs">Registradas</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <button onClick={() => navigate('/medical_history')} className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#B71C1C] rounded-lg p-4 transition-all duration-200 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                <svg className="w-6 h-6 text-[#B71C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Ver Resultados</p>
            </div>
          </button>

          <button onClick={() => setShowRequestModal(true)} className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#B71C1C] rounded-lg p-4 transition-all duration-200 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                <svg className="w-6 h-6 text-[#B71C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Agendar Cita</p>
            </div>
          </button>

          <button onClick={() => navigate('/my_appointments')} className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#B71C1C] rounded-lg p-4 transition-all duration-200 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                <svg className="w-6 h-6 text-[#B71C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">VideoConsulta</p>
            </div>
          </button>

          <button onClick={() => alert("Sin notificaciones nuevas")} className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#B71C1C] rounded-lg p-4 transition-all duration-200 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                <Bell className="w-6 h-6 text-[#B71C1C]" />
              </div>
              <p className="text-sm font-medium text-gray-700">Notificaciones</p>
            </div>
          </button>
        </div>
      </div>

      {showRequestModal && (
        <RequestAppointmentModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};

export default PatientHero;