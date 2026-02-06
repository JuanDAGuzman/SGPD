const sequelize = require('../config/database');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createDoctor = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a DB');

        const email = 'doctor@umb.edu.co';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ where: { email } });

        if (user) {
            user.password = hashedPassword;
            await user.save();
            console.log('Usuario doctor actualizado.');
        } else {
            user = await User.create({
                name: 'Dr. Prueba UMB',
                email,
                password: hashedPassword,
                role: 'doctor'
            });
            console.log('Usuario doctor creado.');
        }

        const doctor = await Doctor.findOne({ where: { userId: user.id } });
        if (!doctor) {
            await Doctor.create({
                userId: user.id,
                specialty: 'Medicina General',
                licenseNumber: 'TP-123456',
                phone: '3001234567'
            });
            console.log('Perfil de doctor creado.');
        } else {
            console.log('Perfil de doctor ya existía.');
        }

        console.log('-------------------------------------------');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('-------------------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

createDoctor();
