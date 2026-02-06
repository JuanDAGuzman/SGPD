const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");

require("./models/User");
require("./models/Patient");
require("./models/Doctor");
require("./models/MedicalCenter");
require("./models/Appointment");
require("./models/MedicalHistory");
require("./models/DiabeticFootRecord");
require("./models/LabResult");
require("./models/Treatment");
require("./models/PatientTreatment");
require("./models/HealthTip");
require("./models/Notification");

const isTest = process.env.NODE_ENV === "test";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// health sencillo
app.get("/health", (req, res) => res.json({ ok: true }));

// endpoint de prueba de DB
app.get("/db-ping", async (req, res) => {
  try {
    await sequelize.query("SELECT 1");
    res.json({ db: true });
  } catch (e) {
    res.status(500).json({ db: false, error: e.message });
  }
});

if (!isTest) {
  app.use("/api/reports", require("./routes/report"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/users", require("./routes/user"));
  app.use("/api/patients", require("./routes/patient"));
  app.use("/api/doctors", require("./routes/doctor"));
  app.use("/api/appointments", require("./routes/appointment"));
  app.use("/api/medical-centers", require("./routes/medicalCenter"));
  app.use("/api/treatments", require("./routes/treatment"));
  app.use("/api/lab-results", require("./routes/labResult"));
  app.use("/api/medical-history", require("./routes/medicalHistory"));
  app.use("/api/diabetic-foot-records", require("./routes/diabeticFootRecord"));
  app.use("/api/patient-treatments", require("./routes/patientTreatment"));
  app.use("/api/doctor-requests", require("./routes/doctorRequest"));
  app.use("/api/appointment-requests", require("./routes/appointmentRequest"));
  app.use("/api/health-tips", require("./routes/healthTip"));
  app.use("/api/news", require("./routes/news"));
  app.use("/api/notifications", require("./routes/notification"));
  app.use("/api/stats", require("./routes/stats"));

  // Conectar y luego sincronizar (sin romper el proceso si tarda)
  (async () => {
    try {
      if (sequelize.initDb) await sequelize.initDb();
      await sequelize.sync({ alter: true });
      console.log("DB conectada y sincronizada");
    } catch (err) {
      console.error("Error conectando/sincronizando DB:", err);
    }
  })();
}

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }
  const code = err.status || err.statusCode || 500;
  res.status(code).json({ error: err.message });
});

module.exports = app;
