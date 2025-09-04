const request = require('supertest');
const app = require('../src/app');

describe('app.js error handler', () => {
  it('captura SyntaxError de express.json() y responde con status del error (400)', async () => {
    const res = await request(app)
      .post('/health') 
      .set('Content-Type', 'application/json')
      .send('{"bad":'); 

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });
});
