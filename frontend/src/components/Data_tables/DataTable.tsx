import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importamos los íconos
import styles from './Data_Table.module.css'; // Importamos los estilos

type CentroSalud = {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  serviciosDisponibles: string;
  estadoOperacion: string;
}

const Table: React.FC = () => {
  // Datos de ejemplo
  const originalData: CentroSalud[] = [
    { nombre: 'Centro Salud 1', ciudad: 'Bogotá', direccion: 'Calle 123', telefono: '3001234567', serviciosDisponibles: 'Consultas, Curación de heridas', estadoOperacion: 'Activo' },
    { nombre: 'Centro Salud 2', ciudad: 'Medellín', direccion: 'Carrera 456', telefono: '3012345678', serviciosDisponibles: 'Consultas, Rehabilitación', estadoOperacion: 'Activo' },
    { nombre: 'Centro Salud 3', ciudad: 'Cali', direccion: 'Avenida 789', telefono: '3023456789', serviciosDisponibles: 'Consultas, Cirugía', estadoOperacion: 'Inactivo' },
  ];

  // Columnas de la tabla
  const columns: TableColumn<CentroSalud>[] = [
    {
      name: "Nombre del Centro",
      selector: (row: CentroSalud) => row.nombre,
      sortable: true
    },
    {
      name: "Ciudad",
      selector: (row: CentroSalud) => row.ciudad,
    },
    {
      name: "Dirección",
      selector: (row: CentroSalud) => row.direccion,
    },
    {
      name: "Teléfono",
      selector: (row: CentroSalud) => row.telefono,
    },
    {
      name: "Servicios Disponibles",
      selector: (row: CentroSalud) => row.serviciosDisponibles,
    },
    {
      name: "Estado de Operación",
      selector: (row: CentroSalud) => row.estadoOperacion,
      cell: (row) => row.estadoOperacion === 'Activo' ? 'Activo' : 'Inactivo',
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className={styles.buttonsContainer}>
          <button
            onClick={() => handleEdit(row)}
            className={styles.button}
            title="Editar"
          >
            <FaEdit /> {/* Ícono de editar */}
          </button>
          <button
            onClick={() => handleDelete(row)}
            className={styles.button}
            title="Eliminar"
          >
            <FaTrash /> {/* Ícono de eliminar */}
          </button>
        </div>
      ),
    },
  ];

  const [records, setRecords] = useState<CentroSalud[]>(originalData);

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

  return (
    <div className={styles.tableContainer}>

    <div>
      <input
        type="text"
        placeholder="Buscar por nombre"
        onChange={handleChange}
        style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
      />

      <DataTable
        title="Centros de Salud"
        columns={columns}
        data={records}
        fixedHeader
        pagination
      />
    </div>
    </div>
  );
};

export default Table;
