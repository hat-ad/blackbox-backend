const express = require("express");
const { auth } = require("../../../middleware/checkAuth");
const UserController = require("../../controllers/user.controller");
const v = require("../../../middleware/validators/validator");

const router = express.Router();

router.get("/", UserController.getUsers);
router.get("/check-email", auth, v.Email, v.validateRequest, UserController.checkEmail);
router.get("/:userCode", UserController.getUserByUserCode);

router.post("/login", v.Login, UserController.login);
router.post("/createUser", v.Create, v.validateRequest, UserController.createUser);
router.put("/update-user/:userCode", auth, v.validateRequest, UserController.updateUser);
router.put("/update-email/:userCode", auth, v.Email, v.validateRequest, UserController.updateEmail);

router.post(
  "/forget-password",
  v.Email,
  v.forgetPasswordValidation,
  v.validateRequest,
  UserController.postUserForgetPassword
);
router.post("/verify_otp", v.verifyOtpValidation, UserController.verifyOtp);
router.post("/create_user_verify_otp", v.verifyOtpValidation, UserController.verifyOtpForCreateUser);
router.post("/change_forget_password", v.forgetPasswordChangeValidation, UserController.forgetPasswordChange);

module.exports = router;
