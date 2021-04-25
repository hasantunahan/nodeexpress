const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: "Access denied,You must have the admin",
    });
  }
  next();
};

module.exports = admin;
