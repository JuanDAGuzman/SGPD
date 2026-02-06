import React, { useState } from 'react';
import { Plus, Trash2, Pill, Clock, Calendar } from 'lucide-react';

interface Prescription {
    name: string;
    dosage: string;
    frequency: string;
    days: number;
    notes: string;
}

const PrescriptionBuilder = ({ prescriptions, setPrescriptions }: { prescriptions: Prescription[], setPrescriptions: any }) => {
    const [newMed, setNewMed] = useState<Prescription>({
        name: '',
        dosage: '',
        frequency: '',
        days: 0,
        notes: ''
    });

    // Mock Catalog (In real app, fetch from API)
    const commonMeds = [
        "Amoxicilina 500mg", "Ibuprofeno 400mg", "Acetaminofén 500mg",
        "Loratadina 10mg", "Omeprazol 20mg", "Salbutamol Inhalador",
        "Losartán 50mg", "Metformina 850mg"
    ];

    const addPrescription = () => {
        if (!newMed.name || !newMed.days) {
            alert("Completa al menos el nombre y la duración.");
            return;
        }
        setPrescriptions([...prescriptions, newMed]);
        setNewMed({ name: '', dosage: '', frequency: '', days: 0, notes: '' }); // Reset
    };

    const removePrescription = (index: number) => {
        const updated = [...prescriptions];
        updated.splice(index, 1);
        setPrescriptions(updated);
    };

    return (
        <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#B71C1C]" />
                Prescripción de Medicamentos
            </h4>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-4 rounded-lg shadow-sm">
                <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">Medicamento</label>
                    <input
                        list="meds-list"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B71C1C] outline-none"
                        placeholder="Buscar o escribir..."
                        value={newMed.name}
                        onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    />
                    <datalist id="meds-list">
                        {commonMeds.map(m => <option key={m} value={m} />)}
                    </datalist>
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Dosis</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ej: 1 tab"
                        value={newMed.dosage}
                        onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                    />
                </div>

                <div className="md:col-span-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">Frecuencia</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ej: Cada 8 horas"
                        value={newMed.frequency}
                        onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Duración (Días)</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ej: 7"
                        value={newMed.days || ''}
                        onChange={e => setNewMed({ ...newMed, days: parseInt(e.target.value) })}
                    />
                </div>

                <div className="md:col-span-1">
                    <button
                        onClick={addPrescription}
                        className="w-full p-2 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-md flex items-center justify-center transition-colors shadow-md"
                        title="Agregar"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="md:col-span-12">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Notas adicionales (opcional)..."
                        value={newMed.notes}
                        onChange={e => setNewMed({ ...newMed, notes: e.target.value })}
                    />
                </div>
            </div>

            {/* List */}
            {prescriptions.length > 0 ? (
                <div className="space-y-2">
                    {prescriptions.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border-l-4 border-[#B71C1C] rounded-r-md shadow-sm">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <span className="font-bold text-gray-800">{p.name}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1"><Pill className="w-3 h-3" /> {p.dosage}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.frequency}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.days} días</span>
                            </div>
                            <button
                                onClick={() => removePrescription(idx)}
                                className="ml-4 text-red-400 hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 text-sm py-4 italic">No has agregado medicamentos a la receta.</p>
            )}
        </div>
    );
};

export default PrescriptionBuilder;
