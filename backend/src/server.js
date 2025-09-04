require('dotenv').config();         
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.set('trust proxy', true);

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
