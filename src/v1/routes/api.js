const express = require("express");
const { auth } = require("../../middleware/checkAuth");

const router = express.Router();

const apiUser = require("./api/user.api");

router.use("/user", apiUser);

const apiUpload = require("./api/upload.api");
// FILE UPLOAD
router.use("/upload", auth, apiUpload);

module.exports = router;
