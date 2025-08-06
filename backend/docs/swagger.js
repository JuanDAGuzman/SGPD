const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestión de Pacientes Pie Diabético',
      version: '1.0.0',
      description: 'Documentación automática del backend clínico',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./src/routes/*.js'], // Aquí toma los comentarios de tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
