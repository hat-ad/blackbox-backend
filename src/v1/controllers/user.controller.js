const Bcryptjs = require("bcryptjs");
const { OK, ERROR } = require("../../../utils/responseHelper");
const { sendMail, GenerateOTP, GenerateToken } = require("../functions/function");
const UserService = require("../services/user.service");

exports.getUsers = async (req, res) => {
  try {
    const user = await UserService.getUsers();

    if (user) return OK(res, user, "Fetched Successfully");

    return ERROR(res, [], "No user found");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.checkEmail(email);
    if (user) {
      return ERROR(res, user, "email already Exists!");
    }
    const hashPassword = await Bcryptjs.hash(password, 12);
    const otp = GenerateOTP();
    const currDate = new Date();
    const expTime = new Date(currDate.getTime() + 30 * 60000);
    const username = email.split("@")[0];
    const body = {
      email,
      password: hashPassword,
      forgetPasswordOtp: otp,
      expTime,
      userName: username,
      userCode: username,
    };
    if (email) {
      body.email = email;
    }
    const newUser = await UserService.creatUser(body);
    sendMail(email, "Hello from ethereal-email", `User created! Your OTP Pin is ${otp}, It is valid till one hour`);

    return OK(res, newUser, "User Created SuccessFully, Please check your email!");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserService.checkEmail(email);

    if (user) return OK(res, user, "Email Found!");

    return ERROR(res, user, "No such email found");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};
exports.getUserByUserCode = async (req, res) => {
  try {
    const user = await UserService.getUserByUserCode(req.params.userCode);

    if (user) return OK(res, user, "USER Fetched Successfully!");

    return ERROR(res, [], "No user found");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.login(email);

    if (!user) {
      return ERROR(res, user, "This User is not Registered or Disabled");
    }

    const hashedPassword = await Bcryptjs.compare(password, user.password);
    if (!hashedPassword) return ERROR(res, user, "Invalid Password!");
    const token = GenerateToken(user);
    return OK(res, { user, token }, "USER Logged in Successfully!");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fName, lName, email, dob, gender, phoneNo, professionId, url, categoryInterest } = req.body;

    const body = {};

    if (fName) body.fName = fName;
    if (lName) body.lName = lName;
    if (email) body.email = email;
    if (dob) body.dob = dob;
    if (gender) body.gender = gender;
    if (phoneNo) body.phoneNo = phoneNo;
    if (professionId) body.profession_id = professionId;
    if (url) body.url = url;
    if (categoryInterest) body.categoryInterest = categoryInterest; // []

    const updateUser = await UserService.updateUser(req.params.userCode, body);

    if (updateUser) return OK(res, updateUser, "User Updated Successfully");

    return ERROR(res, [], "User Not Updated");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const body = {};

    if (email) body.email = email;

    const existedEmail = await UserService.checkEmail(email);

    if (existedEmail) return ERROR(res, existedEmail, "Email already Exists!");

    const updateUser = await UserService.updateEmail(req.params.userCode, body);

    if (updateUser) return OK(res, updateUser, "User Email Updated Successfully");

    return ERROR(res, [], "User Not Updated");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.postUserForgetPassword = async (req, res) => {
  try {
    const user = await UserService.getUserByEmail(req.body.email);

    if (!user) return OK(res, user, "User not found");

    const { email } = user;
    const otp = GenerateOTP();
    const currDate = new Date();
    const expTime = new Date(currDate.getTime() + 30 * 60000);
    user.forgetPasswordOtp = otp;
    user.expTime = expTime;
    await user.save();

    sendMail(email, "Forget Password", `Your OTP Pin is ${otp}, It is valid till one hour`);
    return OK(res, [], "Please check your email");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserService.getUserByEmail(email);

    if (!user) return ERROR(res, user, "User not found");

    const currDate = new Date();
    const userTime = user.expTime;
    if (userTime < currDate) {
      return ERROR(res, [], "OTP Expired!");
    }
    const actualOtp = user.forgetPasswordOtp;
    if (actualOtp !== otp) {
      return ERROR(res, [], "OTP does not matched!");
    }
    user.forgetPasswordOtp = null;
    user.expTime = null;
    await user.save();
    return OK(res, user, "Successfully login pls change your password!");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};
exports.verifyOtpForCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserService.getUserByEmail(email);

    if (!user) return ERROR(res, user, "User not found");

    const currDate = new Date();
    const userTime = user.expTime;
    if (userTime < currDate) {
      return ERROR(res, [], "OTP Expired!");
    }
    const actualOtp = user.forgetPasswordOtp;
    if (actualOtp !== otp) {
      return ERROR(res, [], "OTP does not matched!");
    }
    user.forgetPasswordOtp = null;
    user.expTime = null;
    const token = GenerateToken(user);
    user.token = token;
    await user.save();
    return OK(res, { token: user.token, user }, "Successfully Verified pls Update your profile!");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};
exports.forgetPasswordChange = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await UserService.checkEmail({ email });

    if (!user) return ERROR(res, user, "User not found");

    const hashPassword = await Bcryptjs.hash(newPassword, 12);

    user.password = hashPassword;
    await user.save();

    return OK(res, [], "Password Changed SuccessFully!");
  } catch (error) {
    return ERROR(res, error, "Something went Wrong");
  }
};
