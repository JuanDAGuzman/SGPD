import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import styles from './Data_Table.module.css';

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  createdAt: string;
}

const RoleTable: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filtroID, setFiltroID] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filtrarUsuarios = (): Usuario[] => {
    return usuarios.filter((usuario) => {
      const coincideID = usuario.id.toString().includes(filtroID);
      const coincideRol = filtroRol === '' || usuario.role === filtroRol;
      return coincideID && coincideRol;
    });
  };

  const handleEdit = (row: Usuario) => {
    console.log('Editando rol del usuario:', row);
    // TODO: Implementar edición de rol
  };

  const handleDelete = (row: Usuario) => {
    console.log('Eliminando usuario:', row);
    // TODO: Implementar eliminación
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold';
      case 'doctor':
        return 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold';
      case 'patient':
        return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold';
      default:
        return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Administrador',
      doctor: 'Doctor',
      patient: 'Paciente',
    };
    return labels[role] || role;
  };

  const columns: TableColumn<Usuario>[] = [
    {
      name: 'ID',
      selector: (row: Usuario) => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nombre',
      selector: (row: Usuario) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row: Usuario) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Rol',
      selector: (row: Usuario) => row.role,
      cell: (row) => (
        <span className={getRoleBadgeClass(row.role)}>
          {getRoleLabel(row.role)}
        </span>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Fecha Registro',
      selector: (row: Usuario) => row.createdAt,
      cell: (row) => new Date(row.createdAt).toLocaleDateString('es-ES'),
      sortable: true,
      width: '130px',
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className={styles.buttonsContainer}>
          <button
            onClick={() => handleEdit(row)}
            className={styles.button}
            title="Editar rol"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className={styles.button}
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

      <h2 className={styles.title}>Gestión de Roles ({usuarios.length} usuarios)</h2>

      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Filtrar por ID"
          value={filtroID}
          onChange={(e) => setFiltroID(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className={styles.searchInput}
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Paciente</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-[#B71C1C] mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 text-sm font-medium">Cargando usuarios...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtrarUsuarios()}
          fixedHeader
          pagination
          customStyles={customStyles}
          noDataComponent={<div className="py-8 text-gray-500">No hay usuarios registrados</div>}
        />
      )}
    </div>
  );
};

export default RoleTable;
