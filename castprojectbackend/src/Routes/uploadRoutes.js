// routes/uploadRoute.js
const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../Controller/UploadController");

// Define the POST route for file uploads
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
