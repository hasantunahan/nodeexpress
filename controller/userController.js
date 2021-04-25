const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const allUserList = async (req, res) => {
  const allUser = await User.find({});
  res.json(allUser);
};

const loginUserInformation = (req, res, next) => {
  res.json(req.user);
};

const updateLoginUser = async (req, res, next) => {
  const { error, value } = User.joiValidationForUpdate(req.body);

  if (req.body.hasOwnProperty("password")) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  if (error) {
    next(createError(400, error));
  } else {
    try {
      const result = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      });
      if (result) {
        return res.json(result);
      } else {
        throw createError(404, `${req.user._id} user not found`);
      }
    } catch (e) {
      next(createError(400, e));
    }
  }
};

const addNewUser = async (req, res, next) => {
  try {
    const addUser = new User(req.body);
    addUser.password = await bcrypt.hash(addUser.password, 10);
    const { error, value } = addUser.joiValidation(req.body);

    if (error) {
      next(createError(400, error));
    } else {
      const result = await addUser.save();
      res.status(200).json(result);
    }
  } catch (e) {
    next(createError(400, e));
  }
};

const updateUserWithID = async (req, res, next) => {
  const { error, value } = User.joiValidationForUpdate(req.body);
  const id = req.params.id;

  if (req.body.hasOwnProperty("password")) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  if (error) {
    next(createError(400, error));
  } else {
    try {
      const result = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (result) {
        return res.json(result);
      } else {
        throw createError(404, `${req.params.id} user not found`);
      }
    } catch (e) {
      next(createError(400, e));
    }
  }
};

const deleteUserWithID = async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete({ _id: req.params.id });

    if (result) {
      return res.json(`${req.params.id} users deleted successfully`);
    } else {
      throw createError(404, `${req.params.id} user not found`);
    }
  } catch (e) {
    next(createError(400, e));
  }
};

const deleteAllUser = async (req, res, next) => {
  try {
    const result = await User.deleteMany({ isAdmin: false });

    if (result) {
      return res.json(`All users deleted successfully`);
    } else {
      throw createError(404, `Any user not found`);
    }
  } catch (e) {
    next(createError(400, e));
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.login(req.body.email, req.body.password);

    const token = await user.generateToken();

    res.json({
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  allUserList,
  loginUserInformation,
  updateLoginUser,
  addNewUser,
  updateUserWithID,
  deleteUserWithID,
  deleteAllUser,
  login
};
