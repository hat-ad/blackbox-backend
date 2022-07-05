const { db } = require("../../NOSQL/database/connection");

exports.getUsers = async () => {
  const getUsers = await db.User.find();
  return getUsers;
};

exports.checkEmail = async (email) => {
  const getUsers = await db.User.findOne({ email });
  return getUsers;
};

exports.creatUser = async (body) => {
  const newUser = await db.User.create(body);
  return newUser;
};

exports.createdUsers = async (body) => {
  const user = new db.User();
  const userPreset = await user.find(body);

  let userCreated;
  if (!userPreset) userCreated = await db.User.save(body);

  return userCreated;
};

exports.getUserByUserCode = async (userCode) => {
  const user = await db.User.findOne({ userCode });
  return user;
};
exports.getUserByUserName = async (userName) => {
  const user = await db.User.findOne(userName);
  return user;
};
exports.getUserByEmail = async (email) => {
  const user = await db.User.findOne({ email });
  return user;
};

exports.login = async (email) => {
  const user = await db.User.findOne({ email, isActive: true });
  return user;
};

exports.updateUser = async (userCode, body) => {
  const updatedUser = await db.User.findOneAndUpdate({ userCode }, { ...body }, { new: true });
  return updatedUser;
};

exports.updateEmail = async (userCode, body) => {
  const updatedUser = await db.User.findOneAndUpdate({ userCode }, { ...body }, { new: true });
  return updatedUser;
};

exports.userForgetPassword = async (email, userName) => {
  const user = await db.User.findOne({ email, userName });
  return user;
};
