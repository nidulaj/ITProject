const express = require("express");
const router = express.Router();
const { create, list, update, patchStatus, remove } = require("../controllers/returnsController");

router.post("/", create);                 // Customer: create
router.get("/", list);                    // Both: list
router.put("/:id", update);               // Customer: update (no status)
router.patch("/:id/status", patchStatus); // PM: accept/reject/pending
router.delete("/:id", remove);            // Customer: delete

module.exports = router;
