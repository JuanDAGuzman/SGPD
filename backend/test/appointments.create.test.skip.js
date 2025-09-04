const request = require('supertest');
const app = require('../src/app');


jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 3, role: 'doctor' };
    next();
  },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../src/services/mailer', () => ({
  sendAppointmentEmail: jest.fn().mockResolvedValue(true)
}));

describe('POST /api/appointments', () => {
  it('crea cita virtual', async () => {
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "2025-08-20T15:00:00",
      type: "virtual",
      notes: "Consulta virtual de seguimiento"
    };

    const res = await request(app)
      .post('/api/appointments')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.type).toBe('virtual');
  });
});
