import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import styles from './Data_Table.module.css';

interface Paciente {
  id: number;
  userId: number;
  contactInfo: string;
  clinicalInfo: string;
  createdAt: string;
  User: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const Table: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar pacientes');
      }

      const data = await response.json();
      setPacientes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPacientes = (): Paciente[] => {
    return pacientes.filter((paciente) => {
      const coincideNombre = paciente.User?.name.toLowerCase().includes(filtroNombre.toLowerCase());
      const coincideEmail = paciente.User?.email.toLowerCase().includes(filtroEmail.toLowerCase());
      return coincideNombre && coincideEmail;
    });
  };

  const handleEdit = (row: Paciente) => {
    console.log('Editando paciente:', row);
    // TODO: Implementar edición
  };

  const handleDelete = async (row: Paciente) => {
    if (!window.confirm(`¿Estás seguro de eliminar al paciente ${row.User?.name}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/patients/${row.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el paciente');
      }

      setSuccess('Paciente eliminado exitosamente');
      fetchPacientes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el paciente');
      setTimeout(() => setError(''), 3000);
    }
  };

  const columns: TableColumn<Paciente>[] = [
    {
      name: 'ID',
      selector: (row: Paciente) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nombre',
      selector: (row: Paciente) => row.User?.name || 'N/A',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row: Paciente) => row.User?.email || 'N/A',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Contacto',
      selector: (row: Paciente) => row.contactInfo || 'N/A',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Info Clínica',
      selector: (row: Paciente) => row.clinicalInfo || 'N/A',
      cell: (row) => (
        <span className="line-clamp-1" title={row.clinicalInfo || 'N/A'}>
          {row.clinicalInfo || 'N/A'}
        </span>
      ),
      grow: 2,
    },
    {
      name: 'Fecha Registro',
      selector: (row: Paciente) => row.createdAt,
      cell: (row) => new Date(row.createdAt).toLocaleDateString('es-ES'),
      sortable: true,
      width: '130px',
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className={styles.rowActions}>
          <button
            onClick={() => handleEdit(row)}
            className={`${styles.iconButton} ${styles.editBtn}`}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className={`${styles.iconButton} ${styles.deleteBtn}`}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: '120px',
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        color: '#B71C1C',
        fontSize: '15px',
        backgroundColor: '#f1f1f1',
      },
    },
  };

  return (
    <div className={styles.tableContainer}>
      {/* Alert Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className={styles.tableHeader}>
        <h2 className={styles.title}>Lista de Pacientes ({pacientes.length})</h2>
      </div>

      <div className={styles.filtersBar}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Buscar por email..."
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-[#B71C1C] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 text-sm font-medium">Cargando pacientes...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtrarPacientes()}
          fixedHeader
          pagination
          customStyles={customStyles}
          noDataComponent={<div className="py-8 text-gray-500">No hay pacientes registrados</div>}
        />
      )}
    </div>
  );
};

export default Table;
