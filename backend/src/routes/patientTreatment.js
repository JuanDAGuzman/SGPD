const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/patientTreatmentController");
const { authenticate, authorize } = require("../middleware/auth");
const authorizeSelfOrRoles = require("../middleware/authorize");

router.get(
  "/",
  authenticate,
  authorizeSelfOrRoles("admin", "doctor", "patient"),
  ctrl.getAll
);
router.post("/", authenticate, authorize("admin", "doctor"), ctrl.create);
router.put("/:id", authenticate, authorize("admin", "doctor"), ctrl.update);
router.delete("/:id", authenticate, authorize("admin", "doctor"), ctrl.delete);

module.exports = router;
