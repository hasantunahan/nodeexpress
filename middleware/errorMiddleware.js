const catchError = (err, req, res, next) => {
  res.status(err.statusCode || 500);

  if (err.code == 11000) {
    res.json({
      status: err.statusCode || 500,
      message: Object.keys(err.keyValue)+":"+ Object.values(err.keyValue) + " must be unique",
    });
  }

  if(err.code  == 66){
     res.json({
        status: err.statusCode || 500,
        message: "Is unique (unchangeable field)",
     })
  }

  res.json({
    status: err.statusCode || 500,
    message: err.message,
  });
};

module.exports = catchError;
