1. Requisitos previos
Node.js v16 o superior

npm (o yarn)

PostgreSQL (recomendado usar PgAdmin para administración visual)

Git (opcional, para clonar el repositorio)

2. Clonar el proyecto
bash
Copiar
Editar
git clone https://tu-repo.git
cd nombre-del-proyecto

3. Instalar dependencias
bash
Copiar
Editar
npm install

4. Configuración de variables de entorno
Crea un archivo .env en la raíz del proyecto y coloca tus variables.
Ejemplo básico:

ini
Copiar
Editar
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tuusuario
DB_PASS=tuclave
DB_NAME=sgpd
JWT_SECRET=un_secreto_fuerte
SECRET_ADMIN_KEY=midiosupersecreto123
Para pruebas de email con Ethereal no necesitas variables, pero si usas Gmail real pon:

ini
Copiar
Editar
EMAIL_USER=micorreo@gmail.com
EMAIL_PASS=miclaveapp

5. Crear la base de datos
Abre PgAdmin.

Crea una base de datos llamada sgpd (o el nombre que pusiste en .env).

El sistema creará las tablas automáticamente la primera vez que lo ejecutes.

6. Arrancar el backend
bash
Copiar
Editar
npm run dev
O directamente:

bash
Copiar
Editar
node src/server.js
El backend corre en http://localhost:4000 (o el puerto que definas en .env).

7. Probar el backend
Usa Postman o Swagger (http://localhost:4000/api/docs) para probar todos los endpoints.

Para pruebas de email, al crear una cita verás en consola un link de Ethereal donde puedes ver el correo simulado.

8. Primeros pasos en la API
Crear usuario admin:
POST /api/auth/create-admin
Body (usa tu SECRET_ADMIN_KEY):

json
Copiar
Editar
{
  "name": "Admin",
  "email": "admin@sgpd.com",
  "password": "admin123",
  "secret": "midiosupersecreto123"
}
Registrar pacientes:
POST /api/auth/register

Login:
POST /api/auth/login
Obtén el token para las rutas protegidas.

Gestionar pacientes, doctores, citas, reportes, etc:
Usa los endpoints documentados en Swagger o Postman.

9. Documentación y pruebas
Swagger:
Toda la documentación y ejemplos de uso están en:
http://localhost:4000/api/docs

Variables importantes:

JWT_SECRET: clave para tokens de autenticación.

SECRET_ADMIN_KEY: clave secreta para crear el primer admin.

10. Buenas prácticas y tips
No compartas tu .env ni claves secretas.

Antes de pasar a producción, configura CORS, logs, backups y SMTP real si lo necesitas.

Actualiza tus dependencias regularmente (npm outdated y npm update).

11. Mantenimiento
Para migraciones o cambios de estructura, actualiza los modelos y vuelve a iniciar el backend.

Haz respaldos frecuentes de la base de datos, especialmente en producción.

12. Contacto y soporte
Si agregas nuevos desarrolladores, explícales:

Cómo crear su usuario admin.

Cómo registrar pacientes y doctores.

Cómo usar los reportes y la documentación Swagger.

Cualquier duda técnica o nueva funcionalidad, ¡pregúntame!