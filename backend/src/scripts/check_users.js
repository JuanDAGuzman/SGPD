const sequelize = require('../config/database');
const User = require('../models/User');

const checkUsers = async () => {
    try {
        console.log('Intentando conectar a DB...');
        await sequelize.authenticate();
        console.log('DB Conectada Correctamente.');

        const users = await User.findAll();
        console.log(`Total usuarios encontrados: ${users.length}`);

        users.forEach(u => {
            console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role}`);
        });

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    } finally {
        await sequelize.close();
    }
};

checkUsers();
