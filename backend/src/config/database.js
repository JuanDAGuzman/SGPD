/*
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = sequelize;
*/

const { Sequelize } = require('sequelize');

const url = process.env.DATABASE_URL;

// Externa = requiere SSL; Interna (.internal) = sin SSL
const isExternal =
  url &&
  !url.includes('.internal') &&
  !url.includes('localhost') &&
  !url.includes('127.0.0.1');

const sequelize = url
  ? new Sequelize(url, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: isExternal
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

async function initDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('DB conectada y autenticada');
      return;
    } catch (e) {
      console.error(`Intento DB ${i}/${retries} ->`, e.code || e.name || e.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.error('DB: no fue posible conectar después de varios intentos');
}

module.exports = sequelize;
module.exports.initDb = initDb;