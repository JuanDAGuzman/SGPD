import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './Data_Table.module.css';
import { useNavigate } from 'react-router-dom';

type CentroSalud = {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  serviciosDisponibles: string;
  estadoOperacion: string;
};

const HealthTable: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register_healthcenter'); 
  };

  const originalData: CentroSalud[] = [
    { nombre: 'Centro Salud 1', ciudad: 'Bogotá', direccion: 'Calle 123', telefono: '3001234567', serviciosDisponibles: 'Consultas, Curación de heridas', estadoOperacion: 'Activo' },
    { nombre: 'Centro Salud 2', ciudad: 'Medellín', direccion: 'Carrera 456', telefono: '3012345678', serviciosDisponibles: 'Consultas, Rehabilitación', estadoOperacion: 'Activo' },
    { nombre: 'Centro Salud 3', ciudad: 'Cali', direccion: 'Avenida 789', telefono: '3023456789', serviciosDisponibles: 'Consultas, Cirugía, Medicina interna, Exámenes de laboratorio, Terapia respiratoria, Vacunación', estadoOperacion: 'Inactivo' },
  ];

  const [records, setRecords] = useState<CentroSalud[]>(originalData);
  const [expandedRows, setExpandedRows] = useState<CentroSalud[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = originalData.filter(row =>
      row.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setRecords(newData);
  };

  const handleEdit = (row: CentroSalud) => {
    console.log("Editando centro:", row);
  };

  const handleDelete = (row: CentroSalud) => {
    console.log("Eliminando centro:", row);
  };

  const toggleExpand = (row: CentroSalud) => {
    setExpandedRows(prev =>
      prev.includes(row)
        ? prev.filter(r => r !== row)
        : [...prev, row]
    );
  };

  const columns: TableColumn<CentroSalud>[] = [
    { name: "Nombre del Centro", selector: row => row.nombre, sortable: true, width: '200px' },
    { name: "Ciudad", selector: row => row.ciudad, width: '130px' },
    { name: "Dirección", selector: row => row.direccion, width: '200px' },
    { name: "Teléfono", selector: row => row.telefono, width: '150px' },
    { name: "Servicios Disponibles", selector: row => row.serviciosDisponibles, width: '300px' },
    {
      name: "Estado de Operación",
      selector: row => row.estadoOperacion,
      cell: row => row.estadoOperacion === 'Activo' ? 'Activo' : 'Inactivo',
      width: '170px',
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className={styles.buttonsContainer}>
          <button onClick={() => handleEdit(row)} className={styles.button} title="Editar">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row)} className={styles.button} title="Eliminar">
            <FaTrash />
          </button>
          <button onClick={() => toggleExpand(row)} className={styles.button} title="Detalles">
            📋
          </button>
        </div>
      ),
      width: '150px',
    },
  ];

  const ExpandedComponent: React.FC<{ data: CentroSalud }> = ({ data }) => (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderTop: '1px solid #ccc' }}>
      <p><strong>Servicios:</strong> {data.serviciosDisponibles}</p>
      <p><strong>Dirección:</strong> {data.direccion}</p>
      <p><strong>Teléfono:</strong> {data.telefono}</p>
      <p><strong>Estado:</strong> {data.estadoOperacion}</p>
    </div>
  );

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        color: 'rgba(128, 0, 0, 0.9)',
        fontSize: '15px',
        backgroundColor: '#f1f1f1',
      },
    },
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Gestión de Centros de Salud</h2>

      <div className={styles.topBar}>
        <button 
          className={styles.registerButton} 
          onClick={handleRegisterClick}
        >
          Registrar Centro de Salud
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre"
          onChange={handleChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <DataTable
          columns={columns}
          data={records}
          fixedHeader
          pagination
          customStyles={customStyles}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          expandableRowExpanded={row => expandedRows.includes(row)}
          responsive
        />
      </div>
    </div>
  );
};

export default HealthTable;
