const express = require("express");
const app = express();
const userRouter = require("./router/user_router");
const errorMiddleware = require("./middleware/errorMiddleware");
const jwt = require('jsonwebtoken');

require("./database/db_connection");

//Router
app.use(express.json());

app.use("/api/user", userRouter);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Listening 3000 port");
});
