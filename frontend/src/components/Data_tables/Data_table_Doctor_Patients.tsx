import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaUserPlus, FaFileMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Data_Table.module.css';
import { getPatients, PatientBackend } from '../../services/patientService';

type PacienteRow = {
    id: number;
    cedula: string;
    nombre: string;
    ciudad: string;
    centroMedico: string;
    estado: 'activo' | 'inactivo';
    diagnostico: string;
};

const Data_table_Doctor_Patients: React.FC = () => {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<PacienteRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroCedula, setFiltroCedula] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data: PatientBackend[] = await getPatients();

            // Mapear datos del backend al formato de la tabla
            const mappedPacientes: PacienteRow[] = data.map(p => ({
                id: p.id,
                cedula: p.userId.toString(), // Usamos userId como cédula provisional
                nombre: p.User?.name || 'Desconocido',
                ciudad: 'Bogotá', // Valor por defecto
                centroMedico: 'Centro UMB', // Valor por defecto
                estado: 'activo',
                diagnostico: p.clinicalInfo || 'Sin diagnóstico registrado'
            }));
            setPacientes(mappedPacientes);
        } catch (error) {
            console.error("Error cargando pacientes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filtrarPacientes = (): PacienteRow[] => {
        return pacientes.filter((paciente) => {
            const coincideCedula = paciente.cedula.includes(filtroCedula);
            const coincideNombre = paciente.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
            return coincideCedula && coincideNombre;
        });
    };

    const handleRegister = () => {
        navigate('/register_patients_doctor');
    };

    const handleMedicalHistory = (row: PacienteRow) => {
        console.log('Ver historia clínica:', row.id);
        // navigate(`/medical_history/${row.id}`);
    };

    const columns: TableColumn<PacienteRow>[] = [
        {
            name: 'ID/Cédula',
            selector: (row: PacienteRow) => row.cedula,
            sortable: true,
            style: { fontWeight: 'bold' },
        },
        {
            name: 'Nombre',
            selector: (row: PacienteRow) => row.nombre,
            sortable: true,
        },
        {
            name: 'Ciudad',
            selector: (row: PacienteRow) => row.ciudad,
            sortable: true,
            hide: 'sm',
        },
        {
            name: 'Diagnóstico/Info Clínica',
            selector: (row: PacienteRow) => row.diagnostico,
            wrap: true,
            grow: 2,
        },
        {
            name: 'Estado',
            selector: (row: PacienteRow) => row.estado,
            cell: (row: PacienteRow) => (
                <span className={`${styles.statusBadge} ${row.estado === 'activo' ? styles.statusActive : styles.statusInactive}`}>
                    {row.estado}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: (row: PacienteRow) => (
                <div className={styles.rowActions}>
                    <button
                        onClick={() => handleMedicalHistory(row)}
                        className={`${styles.iconButton} ${styles.editBtn}`}
                        title="Historia Clínica"
                        style={{ backgroundColor: '#0284c7' }}
                    >
                        <FaFileMedical />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                color: '#B71C1C',
                fontSize: '15px',
                backgroundColor: '#f8fafc',
            },
        },
    };

    return (
        <div className={styles.tableContainer} style={{ marginTop: '20px' }}>
            <div className={styles.tableHeader}>
                <h2 className={styles.title}>Mis Pacientes</h2>
                <div className={styles.actions}>
                    <button className={styles.primaryButton} onClick={handleRegister}>
                        <FaUserPlus /> Registrar Paciente
                    </button>
                </div>
            </div>

            <div className={styles.filtersBar}>
                <input
                    type="text"
                    placeholder="Buscar por ID..."
                    value={filtroCedula}
                    onChange={(e) => setFiltroCedula(e.target.value)}
                    className={styles.filterInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por Nombre..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className={styles.filterInput}
                />
            </div>

            <DataTable
                columns={columns}
                data={filtrarPacientes()}
                fixedHeader
                pagination
                progressPending={loading}
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
};

export default Data_table_Doctor_Patients;
