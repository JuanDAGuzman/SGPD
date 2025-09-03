const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/diabeticFootRecordController");
const { authenticate, authorize } = require("../middleware/auth");
const authorizeSelfOrRoles = require("../middleware/authorize"); // SIN llaves, correcto con tu exportación

router.get(
  "/",
  authenticate,
  authorizeSelfOrRoles("admin", "doctor"),
  ctrl.getAll
);
router.post("/", authenticate, authorize("admin", "doctor"), ctrl.create);
router.get("/:id", authenticate, authorize("admin", "doctor"), ctrl.getById);
router.put("/:id", authenticate, authorize("admin", "doctor"), ctrl.update);
router.delete("/:id", authenticate, authorize("admin"), ctrl.delete);

module.exports = router;
