require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de conexión directa para evitar problemas de imports
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
    }
);

const User = sequelize.define(
    "User",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: {
            type: DataTypes.ENUM("admin", "doctor", "patient"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "pending", "rejected"),
            defaultValue: "pending",
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a la base de datos.');

        // Actualizar TODOS los usuarios a 'active'
        const [updatedCount] = await User.update(
            { status: 'active' },
            { where: {} }
        );

        console.log(`¡Éxito! Se han activado ${updatedCount} usuarios.`);

        // Verificar específicamente el admin
        const admin = await User.findOne({ where: { email: 'admin@sgpd.com' } });
        if (admin) {
            console.log(`Admin status: ${admin.status}`);
        }

    } catch (error) {
        console.error('Error al actualizar usuarios:', error);
    } finally {
        await sequelize.close();
    }
})();
