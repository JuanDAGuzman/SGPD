'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('MedicalCenters', [
      {
        name: 'Clínica Universitaria',
        type: 'clinica',
        address: 'Calle 45 #13-50',
        city: 'Bogotá',
        department: 'Cundinamarca',
        phone: '+57 1 234 5678',
        email: 'contacto@clinicauniversitaria.com',
        regime: 'mixto',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hospital Central',
        type: 'hospital',
        address: 'Carrera 7 #32-16',
        city: 'Medellín',
        department: 'Antioquia',
        phone: '+57 4 567 8901',
        email: 'info@hospitalcentral.com',
        regime: 'contributivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'IPS Salud Total',
        type: 'ips',
        address: 'Avenida 6 #25-40',
        city: 'Cali',
        department: 'Valle del Cauca',
        phone: '+57 2 345 6789',
        email: 'atencion@ipssaludtotal.com',
        regime: 'subsidiado',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Centro de Salud del Norte',
        type: 'centro_salud',
        address: 'Calle 80 #45-23',
        city: 'Barranquilla',
        department: 'Atlántico',
        phone: '+57 5 123 4567',
        email: 'centro@saluddelnorte.com',
        regime: 'mixto',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Clínica del Caribe',
        type: 'clinica',
        address: 'Carrera 3 #8-56',
        city: 'Cartagena',
        department: 'Bolívar',
        phone: '+57 5 987 6543',
        email: 'info@clinicadelcaribe.com',
        regime: 'contributivo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MedicalCenters', null, {});
  }
};
