const router = require("express").Router();
const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const auth = require('../middleware/authtMiddleware');


router.get("/", async (req, res) => {
  const allUser = await User.find({});
  res.json(allUser);
});

router.get("/me", auth, (req, res, next) => {
  
});

router.post("/", async (req, res, next) => {
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
});

router.patch("/:id", async (req, res, next) => {
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
});

router.delete("/:id", async (req, res, next) => {
  const result = await User.findByIdAndDelete({ _id: req.params.id });
  try {
    if (result) {
      return res.json(`${req.params.id} users deleted successfully`);
    } else {
      throw createError(404, `${req.params.id} user not found`);
    }
  } catch (e) {
    next(createError(400, e));
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body.email, req.body.password);

    const token = await user.generateToken();


    res.json({
      user,
      token
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
