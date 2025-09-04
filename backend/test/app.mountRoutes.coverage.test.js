const express = require('express');
const request = require('supertest');

describe('Cobertura de montaje de rutas en app.js (NODE_ENV=production simulado)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: 'production' }; 
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('monta routers sin tocar DB ni swagger reales', async () => {
    const fakeModels = {};
    const makeFakeModel = (name) => {
      const model = {
        name,
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
        hasOne: jest.fn(),
        belongsToMany: jest.fn(),
      };
      fakeModels[name] = model;
      return model;
    };

    jest.mock('../src/config/database', () => ({
      define: jest.fn((name) => makeFakeModel(name)),
      sync: jest.fn().mockResolvedValue(true),
      models: fakeModels,
    }), { virtual: true });

    jest.mock('swagger-ui-express', () => ({
      serve: (req, res, next) => next(),
      setup: () => (req, res, next) => next(),
    }), { virtual: true });
    jest.mock('../docs/swagger', () => ({}), { virtual: true });

    const fakeRouter = () => {
      const r = express.Router();
      r.get('/__test', (req, res) => res.status(204).end());
      return r;
    };

    jest.mock('../src/routes/report', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/auth', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/patient', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/doctor', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/appointment', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/medicalCenter', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/treatment', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/labResult', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/medicalHistory', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/diabeticFootRecord', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/patientTreatment', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/doctorRequest', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/appointmentRequest', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/healthTip', () => fakeRouter(), { virtual: true });
    jest.mock('../src/routes/news', () => fakeRouter(), { virtual: true });

    let app;
    await jest.isolateModulesAsync(async () => {
      app = require('../src/app');
    });

    const paths = [
      '/api/reports/__test',
      '/api/auth/__test',
      '/api/patients/__test',
      '/api/doctors/__test',
      '/api/appointments/__test',
      '/api/medical-centers/__test',
      '/api/treatments/__test',
      '/api/lab-results/__test',
      '/api/medical-history/__test',
      '/api/diabetic-foot-records/__test',
      '/api/patient-treatments/__test',
      '/api/doctor-requests/__test',
      '/api/appointment-requests/__test',
      '/api/health-tips/__test',
      '/api/news/__test',
    ];

    for (const p of paths) {
      const res = await request(app).get(p);
      expect(res.status).toBe(204);
    }
  });
});
