// backend/routes/customizedOrders.js
const express = require("express");
const router = express.Router();
const { list, create, update, patchStatus, remove } = require("../controllers/customizedOrderController");

router.get("/", list);
router.post("/", create);
router.put("/:id", update);                 // customer edits
router.patch("/:id/status", patchStatus);   // PM changes status only
router.delete("/:id", remove);

module.exports = router;
