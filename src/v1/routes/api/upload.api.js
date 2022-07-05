const express = require("express");

const router = express.Router();

const { upload } = require("../../functions/function");

const UploadController = require("../../controllers/upload.controller");

router.post("/single", upload.single("file"), UploadController.uploadSingleFile);

module.exports = router;
