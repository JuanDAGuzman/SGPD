const sequelize = require('../config/database');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyAndFixDoctor = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Conectada');

        const email = 'doctor@umb.edu.co';
        const newPassword = 'password123';

        let user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('Usuario no encontrado. Creando...');
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user = await User.create({
                name: 'Dr. Prueba UMB',
                email,
                password: hashedPassword,
                role: 'doctor'
            });

            await Doctor.create({
                userId: user.id,
                specialty: 'General',
                licenseNumber: 'TP-TEST',
                phone: '1234567890'
            });
        } else {
            console.log('Usuario encontrado. Actualizando password...');
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.role = 'doctor'; // Asegurar rol
            await user.save();
        }

        // Verificar login inmediatamente
        const isMatch = await bcrypt.compare(newPassword, user.password);
        console.log(`Verificación de password: ${isMatch ? 'EXITOSA' : 'FALLIDA'}`);
        console.log(`Credenciales: ${email} / ${newPassword}`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sequelize.close();
    }
};

verifyAndFixDoctor();
