const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentRequestController");
const { authenticate, authorize } = require("../middleware/auth");
router.post("/", authenticate, authorize("patient"), ctrl.createRequest);
router.get(
  "/",
  authenticate,
  authorize("admin", "doctor", "patient"),
  ctrl.list
);

router.put(
  "/:id",
  authenticate,
  authorize("doctor", "admin"),
  ctrl.updateStatus
);

module.exports = router;
