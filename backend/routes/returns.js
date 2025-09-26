const express = require("express");
const router = express.Router();
const { create, list, update, patchStatus, remove } = require("../controllers/returnsController");
const upload = require("../middlewares/uploadMiddleware");  // Import the multer middleware

// Route for creating a new return (with image upload)
router.post("/", upload.single("image_url"), create);  // 'image_url' is the form field name

// Route for listing all returns
router.get("/", list);

// Route for updating an existing return (with image upload)
router.put("/:id", upload.single("image_url"), update);  // 'image_url' is the form field name

// Route for updating the status of a return (accept/reject/pending)
router.patch("/:id/status", patchStatus);

// Route for deleting a return
router.delete("/:id", remove);

module.exports = router;
