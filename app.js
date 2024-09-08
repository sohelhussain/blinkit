const express = require("express");
const app = express();
require("dotenv").config();
const indexRouter = require("./router/index");
const authRouter = require("./router/auth");
const expressSession = require("express-session");
const path = require("path");
require("./config/google_oauth_config");
const db = require("./config/mongoose");
const adminRouter = require("./router/admin");
const productRouter = require("./router/product");
const categoriesRouter = require("./router/category");
const usersRouter = require("./router/user");
const cookieParser = require('cookie-parser');
const passport = require('passport');





app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);

app.listen(3000, () =>
  console.log(`server are listening http://localhost:3000/`)
);
