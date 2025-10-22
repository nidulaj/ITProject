const express = require("express");
const router = express.Router();
const controller = require("../controllers/icodeController");

// CRUD Routes
router.post("/", controller.addIcode);
router.get("/", controller.getIcodes);
router.put("/:id", controller.updateIcode);
router.delete("/:id", controller.deleteIcode);

module.exports = router;
