const sequelize = require('../config/database');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const MedicalCenter = require('../models/MedicalCenter');
const bcrypt = require('bcryptjs');

const createNewTestDoctor = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Conectada');

        const email = 'medico@test.com';
        const password = 'password123';

        // 1. Asegurar Medical Center
        let center = await MedicalCenter.findOne();
        if (!center) {
            console.log('Creando Centro Médico dummy...');
            center = await MedicalCenter.create({
                name: 'Hospital Central UMB',
                address: 'Calle Falsa 123',
                phone: '123123123',
                email: 'contacto@hospital.com'
            });
        }
        console.log(`Usando Medical Center ID: ${center.id}`);

        // 2. Limpieza de User anterior
        await User.destroy({ where: { email }, force: true }); // Force delete to clear constraints if needed

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creando usuario médico...');
        const user = await User.create({
            name: 'Dr. Test Rápido',
            email,
            password: hashedPassword,
            role: 'doctor'
        });

        console.log('Creando perfil doctor...');
        await Doctor.create({
            userId: user.id,
            specialty: 'Medicina Interna',
            licenseNumber: 'TEST-999',
            phone: '5555555555',
            medicalCenterId: center.id
        });

        console.log('------------------------------------------------');
        console.log('MÉDICO CREADO EXITOSAMENTE');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('------------------------------------------------');

    } catch (e) {
        console.error('Error detallado:', e);
    } finally {
        await sequelize.close();
    }
};

createNewTestDoctor();
