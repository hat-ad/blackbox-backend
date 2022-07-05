/* eslint-disable consistent-return */
const { check, param, oneOf } = require("express-validator");
const { validationResult } = require("express-validator");
const { BAD, ERROR } = require("../../../utils/responseHelper");

// eslint-disable-next-line consistent-return
exports.validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return BAD(
        res,
        errors.array().map((e) => ({
          msg: e.msg,
          param: e.param,
        })),
        validationResult(req)
          .array()
          .map((e) => e.msg)
          .join()
      );
    }
    next();
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.forgetPasswordValidation = (req, res, next) => {
  try {
    const { userName } = req.body;
    if (!validationResult(req).isEmpty(userName)) return ERROR(res, [], "Please give userName");
    next();
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.verifyOtpValidation = async (req, res, next) => {
  try {
    const { userName, otp } = req.body;
    if (!validationResult(req).isEmpty(userName)) return ERROR(res, [], "Please give userName");
    if (!validationResult(req).isEmpty(otp)) return ERROR(res, [], "otp is mandetory");
    next();
  } catch (error) {
    console.log(error);
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.forgetPasswordChangeValidation = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { confirmPassword } = req.body;
    const { userName } = req.body;

    if (!validationResult(req).isEmpty(userName)) {
      ERROR(res, [], "Please provide a valid userName");
    }

    if (!validationResult(req).isEmpty(newPassword) || !validationResult(req).isEmpty(confirmPassword)) {
      ERROR(res, [], "Invalid Password");
    }

    if (newPassword !== confirmPassword) {
      ERROR(res, [], "Password does not matched ");
    }

    next();
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.ParamIsNumber = [param("id").isNumeric().withMessage("params has to be numeric")];

exports.Login = [
  oneOf(
    [
      check("email")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("valid Email is required"),
      check("mobile")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("mobile is required")
        .bail()
        .isLength({ min: 10, max: 10 })
        .withMessage("mobile should be 10 character long")
        .isNumeric()
        .withMessage("mobile should be numbers"),
    ],
    "either email or mobile is required"
  ),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 character long"),
];

exports.Email = [
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("valid Email is required"),
];

exports.Create = [
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("valid Email is required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 character long"),
];
