const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const connectFlash = require("connect-flash");
const ejs = require("ejs");
require("dotenv").config();

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", require("./routes/auth.index"));

app.use("/auth", require("./routes/auth.route"));

app.use("/admin", require("./routes/admin.user"));

app.use("/user", require("./routes/auth.profile"));

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("📥DB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("error in connecting DB");
  });
