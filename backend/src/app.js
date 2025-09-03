const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");

// Cargar modelos
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

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/reports", require("./routes/report"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patient"));
app.use("/api/doctors", require("./routes/doctor"));
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/medical-centers", require("./routes/medicalCenter"));
app.use("/api/treatments", require("./routes/treatment"));
app.use("/api/lab-results", require("./routes/labResult"));
app.use("/api/medical-history", require("./routes/medicalHistory"));
app.use("/api/diabetic-foot-records", require("./routes/diabeticFootRecord"));
app.use("/api/treatments", require("./routes/treatment"));
app.use("/api/patient-treatments", require("./routes/patientTreatment"));
app.use("/api/lab-results", require("./routes/labResult"));
app.use("/api/doctor-requests", require("./routes/doctorRequest"));
app.use("/api/appointment-requests", require("./routes/appointmentRequest"));
app.use("/api/health-tips", require("./routes/healthTip"));
app.use("/api/news", require("./routes/news"));


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("DB conectada y sincronizada"))
  .catch((err) => console.error("Error conectando DB:", err));

module.exports = app;
