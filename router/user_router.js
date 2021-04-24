const router = require("express").Router();
const User = require("../models/userModel");
const createError = require('http-errors');

router.get("/", async (req, res) => {
  const allUser = await User.find({});
  res.json(allUser);
});

router.get("/:id",async (req, res, next) => {
  try {
    const findUser = await User.findOne({})
  } catch (e) {
    next(createError(400,e));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const addUser = new User(req.body);
    const result = await addUser.save();
    res.status(200).json(result);
  } catch (e) {
    next(createError(400,e));
  }
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (result) {
      return res.json(result);
    } else {
        throw createError(404,`${req.params.id} user not found`);

    }
  } catch (e) {
    next(createError(400,e));
  }
});

router.delete("/:id", async (req, res, next) => {
  const result = await User.findByIdAndDelete({ _id: req.params.id });
  try {
    if (result) {
      return res.json(`${req.params.id} users deleted successfully`);
    } else {
      throw createError(404,`${req.params.id} user not found`);
    }
  } catch (e) {
    next(createError(400,e));
  }
});

module.exports = router;
