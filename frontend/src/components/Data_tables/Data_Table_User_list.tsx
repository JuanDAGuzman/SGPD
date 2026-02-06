import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaEdit, FaTrash, FaUserPlus, FaUsers, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import styles from './Data_Table.module.css';

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  createdAt: string;
  updatedAt: string;
}

const Table: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users?role=admin&role=doctor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      // Filtrar solo admins y doctores
      const filteredData = data.filter((u: Usuario) => u.role === 'admin' || u.role === 'doctor');
      setUsuarios(filteredData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      setSuccess('Usuario eliminado exitosamente');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsuarios();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el usuario');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtrarUsuarios = (): Usuario[] => {
    return usuarios.filter((usuario) => {
      const coincideNombre = usuario.name.toLowerCase().includes(filtroNombre.toLowerCase());
      const coincideEmail = usuario.email.toLowerCase().includes(filtroEmail.toLowerCase());
      const coincideRol = filtroRol === '' || usuario.role === filtroRol;
      return coincideNombre && coincideEmail && coincideRol;
    });
  };

  const handleRegistrarUsuario = () => {
    navigate('/register_doctor_admin');
  };

  const handleVerPacientes = () => {
    navigate('/patient_list_admin');
  };

  const handleEdit = (row: Usuario) => {
    console.log('Editando usuario:', row);
    // TODO: Implementar edición
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
        <span className={`${styles.roleBadge} ${row.role === 'admin' ? styles.roleAdmin : styles.roleDoctor}`}>
          {row.role}
        </span>
      ),
      sortable: true,
      width: '120px',
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
            onClick={() => {
              setSelectedUser(row);
              setShowDeleteModal(true);
            }}
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
        <h2 className={styles.title}>Lista de Usuarios ({usuarios.length})</h2>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={handleVerPacientes}>
            <FaUsers /> Ver Pacientes
          </button>
          <button className={styles.primaryButton} onClick={handleRegistrarUsuario}>
            <FaUserPlus /> Registrar Usuario
          </button>
        </div>
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
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Confirmar Eliminación</h3>
                <p className="text-xs text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-5">
              <p className="text-sm text-gray-700 mb-1">
                ¿Estás seguro de que deseas eliminar al usuario:
              </p>
              <p className="font-bold text-gray-900 text-sm">{selectedUser.name}?</p>
              <p className="text-xs text-gray-500 mt-1">{selectedUser.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
