const router = require("express").Router();
const auth = require("../middleware/authtMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const userController = require("../controller/userController");

router.get("/", [auth, adminMiddleware], userController.allUserList);

router.get("/me", auth, userController.loginUserInformation);

router.patch("/me", auth, userController.updateLoginUser);

router.post("/", userController.addNewUser);

router.patch("/:id", userController.updateUserWithID);

router.delete("/:id", userController.deleteUserWithID);

router.delete(
  "/deleteAll",
  [auth, adminMiddleware],
  userController.deleteAllUser
);

router.post("/login", userController.login);

module.exports = router;
