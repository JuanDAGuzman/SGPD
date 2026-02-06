import React, { useState } from 'react';
import { MapPin, Video, X, Check, Loader2 } from 'lucide-react';
import { createAppointmentRequest } from '../../services/appointmentService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const RequestAppointmentModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    preferredDate: '',
    specialty: '',
    type: 'presencial' as 'presencial' | 'virtual'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setError('Por favor describe el motivo de tu consulta');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createAppointmentRequest({
        message: formData.message,
        preferredDate: formData.preferredDate || undefined,
        specialty: formData.specialty || undefined,
        type: formData.type
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Solicitar Cita Médica</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la consulta *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none resize-none text-sm"
                rows={2}
                placeholder="Describe brevemente el motivo de tu consulta..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad (opcional)
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none text-sm"
              >
                <option value="">Cualquier especialidad</option>
                <option value="Medicina General">Medicina General</option>
                <option value="Endocrinología">Endocrinología</option>
                <option value="Podología">Podología</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Oftalmología">Oftalmología</option>
                <option value="Nefrología">Nefrología</option>
                <option value="Cardiología">Cardiología</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha preferida (opcional)
              </label>
              <input
                type="datetime-local"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#B71C1C] focus:ring-2 focus:ring-red-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de consulta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'presencial' })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${formData.type === 'presencial'
                    ? 'border-[#B71C1C] bg-red-50 text-[#B71C1C]'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <MapPin className="w-4 h-4" />
                  Presencial
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'virtual' })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${formData.type === 'virtual'
                    ? 'border-[#B71C1C] bg-red-50 text-[#B71C1C]'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Video className="w-4 h-4" />
                  Virtual
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#B71C1C] text-white font-medium rounded-lg hover:bg-[#900000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestAppointmentModal;
