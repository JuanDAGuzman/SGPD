jest.mock('../src/models', () => ({
  Patient: { findOne: jest.fn() },
  AppointmentRequest: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const db = require('../src/models');
const ctrl = require('../src/controllers/appointmentRequestController'); 

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
}

describe('appointmentRequestController – cobertura completa', () => {
  beforeEach(() => jest.clearAllMocks());

  test('createRequest: éxito con preferredDate', async () => {
    const req = {
      body: { message: 'Necesito cita', preferredDate: '2025-08-20T15:00:00.000Z' },
      user: { id: 7 },
    };
    const res = mockRes();

    db.Patient.findOne.mockResolvedValue({ id: 5, userId: 7 });
    db.AppointmentRequest.create.mockResolvedValue({
      id: 123, patientId: 5, message: 'Necesito cita', preferredDate: '2025-08-20T15:00:00.000Z'
    });

    await ctrl.createRequest(req, res);

    expect(db.Patient.findOne).toHaveBeenCalledWith({ where: { userId: 7 } });
    expect(db.AppointmentRequest.create).toHaveBeenCalledWith({
      patientId: 5,
      message: 'Necesito cita',
      preferredDate: new Date('2025-08-20T15:00:00.000Z'),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }));
  });

  test('createRequest: éxito SIN preferredDate (guarda null)', async () => {
    const req = {
      body: { message: 'Sin fecha preferida' },
      user: { id: 9 },
    };
    const res = mockRes();

    db.Patient.findOne.mockResolvedValue({ id: 55, userId: 9 });
    db.AppointmentRequest.create.mockResolvedValue({
      id: 999, patientId: 55, message: 'Sin fecha preferida', preferredDate: null
    });

    await ctrl.createRequest(req, res);

    expect(db.AppointmentRequest.create).toHaveBeenCalledWith({
      patientId: 55,
      message: 'Sin fecha preferida',
      preferredDate: null,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createRequest: 400 si paciente no existe', async () => {
    const req = { body: { message: 'x' }, user: { id: 123 } };
    const res = mockRes();

    db.Patient.findOne.mockResolvedValue(null);

    await ctrl.createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Paciente no encontrado' });
  });

  test('createRequest: 500 si Patient.findOne lanza error', async () => {
    const req = { body: { message: 'x' }, user: { id: 123 } };
    const res = mockRes();

    db.Patient.findOne.mockRejectedValue(new Error('falló DB'));

    await ctrl.createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'falló DB' });
  });

  test('list: sin patientId → where = {}', async () => {
    const req = { query: {} };
    const res = mockRes();

    db.AppointmentRequest.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await ctrl.list(req, res);

    expect(db.AppointmentRequest.findAll).toHaveBeenCalledWith({ where: {} });
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('list: con patientId → where.patientId', async () => {
    const req = { query: { patientId: '5' } };
    const res = mockRes();

    db.AppointmentRequest.findAll.mockResolvedValue([{ id: 1, patientId: 5 }]);

    await ctrl.list(req, res);

    expect(db.AppointmentRequest.findAll).toHaveBeenCalledWith({ where: { patientId: '5' } });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, patientId: 5 }]);
  });

  test('list: 500 si findAll lanza error', async () => {
    const req = { query: {} };
    const res = mockRes();

    db.AppointmentRequest.findAll.mockRejectedValue(new Error('boom'));

    await ctrl.list(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
  });

  test('updateStatus: éxito actualizando status', async () => {
    const req = { params: { id: '10' }, body: { status: 'concluida' } };
    const res = mockRes();

    const fake = { id: 10, status: 'pendiente', save: jest.fn().mockResolvedValue(true) };
    db.AppointmentRequest.findByPk.mockResolvedValue(fake);

    await ctrl.updateStatus(req, res);

    expect(db.AppointmentRequest.findByPk).toHaveBeenCalledWith('10');
    expect(fake.status).toBe('concluida');
    expect(fake.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fake);
  });

  test('updateStatus: éxito sin status en body (conserva)', async () => {
    const req = { params: { id: '11' }, body: {} };
    const res = mockRes();

    const fake = { id: 11, status: 'pendiente', save: jest.fn().mockResolvedValue(true) };
    db.AppointmentRequest.findByPk.mockResolvedValue(fake);

    await ctrl.updateStatus(req, res);

    expect(fake.status).toBe('pendiente'); // se conserva
    expect(res.json).toHaveBeenCalledWith(fake);
  });

  test('updateStatus: 404 si no existe', async () => {
    const req = { params: { id: '999' }, body: { status: 'concluida' } };
    const res = mockRes();

    db.AppointmentRequest.findByPk.mockResolvedValue(null);

    await ctrl.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
  });

  test('updateStatus: 500 si findByPk lanza error', async () => {
    const req = { params: { id: '9' }, body: { status: 'concluida' } };
    const res = mockRes();

    db.AppointmentRequest.findByPk.mockRejectedValue(new Error('findByPk failed'));

    await ctrl.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'findByPk failed' });
  });

  test('updateStatus: 500 si save() lanza error', async () => {
    const req = { params: { id: '12' }, body: { status: 'concluida' } };
    const res = mockRes();

    const fake = { id: 12, status: 'pendiente', save: jest.fn().mockRejectedValue(new Error('save failed')) };
    db.AppointmentRequest.findByPk.mockResolvedValue(fake);

    await ctrl.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'save failed' });
  });
});
