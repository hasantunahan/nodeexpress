const mongoose = require("mongoose");
const createError = require("http-errors");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

const schema = Joi.object({
  name: Joi.string().min(3).max(50).trim(),
  username: Joi.string().min(3).max(50).trim(),
  email: Joi.string().trim().email(),
  password: Joi.string().trim(),
});

userSchema.methods.joiValidation = function (userObject) {
  schema.required();
  return schema.validate(userObject);
};

userSchema.statics.joiValidationForUpdate = function (userObject) {
  return schema.validate(userObject);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user._id;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  delete user.password;

  return user;
};

userSchema.statics.login = async function (email, password) {
  const { error, value } = schema.validate({ email, password });

  if (error) {
    throw createError(400, error);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(400, "login is failed : email or password incorrect");
  }
  const pass = await bcrypt.compare(password, user.password);

  if (!pass) {
    throw createError(400, "login is failed : email or password incorrect");
  }

  return user;
};

userSchema.methods.generateToken = function () {
  const loginUser = this;
  const token = jwt.sign({ _id: loginUser._id }, "secretkey", {
    expiresIn: "2h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
