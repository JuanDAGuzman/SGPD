jest.mock('../src/models', () => ({
  Patient: { findOne: jest.fn() },
  AppointmentRequest: {
    create: jest.fn(),
    findAll: jest.fn(),
  }
}));

const db = require('../src/models');
const ctrl = require('../src/controllers/appointmentRequestController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
}

describe('AppointmentRequest controller', () => {
  beforeEach(() => jest.clearAllMocks());

  test('createRequest crea solicitud cuando el paciente existe', async () => {
    const req = {
      body: { message: 'Necesito cita', preferredDate: '2025-08-20T15:00:00.000Z' },
      user: { id: 7 } 
    };
    const res = mockRes();

    db.Patient.findOne.mockResolvedValue({ id: 5, userId: 7 });
    db.AppointmentRequest.create.mockResolvedValue({
      id: 123, patientId: 5, message: 'Necesito cita',
      preferredDate: '2025-08-20T15:00:00.000Z'
    });

    await ctrl.createRequest(req, res);

    expect(db.Patient.findOne).toHaveBeenCalledWith({ where: { userId: 7 } });
    expect(db.AppointmentRequest.create).toHaveBeenCalledWith({
      patientId: 5,
      message: 'Necesito cita',
      preferredDate: new Date('2025-08-20T15:00:00.000Z')
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }));
  });

  test('createRequest devuelve 400 si paciente no existe', async () => {
    const req = { body: { message: 'x' }, user: { id: 999 } };
    const res = mockRes();

    db.Patient.findOne.mockResolvedValue(null);

    await ctrl.createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Paciente no encontrado' });
  });

  test('list sin filtros retorna arreglo', async () => {
    const req = { query: {} };
    const res = mockRes();

    db.AppointmentRequest.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await ctrl.list(req, res);

    expect(db.AppointmentRequest.findAll).toHaveBeenCalledWith({ where: {} });
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('list con patientId filtra', async () => {
    const req = { query: { patientId: '5' } };
    const res = mockRes();

    db.AppointmentRequest.findAll.mockResolvedValue([{ id: 1, patientId: 5 }]);

    await ctrl.list(req, res);

    expect(db.AppointmentRequest.findAll).toHaveBeenCalledWith({ where: { patientId: '5' } });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, patientId: 5 }]);
  });
});
