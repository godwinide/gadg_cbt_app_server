const express = require("express");
const dotenv = require("dotenv");
const expressLayout = require("express-ejs-layouts");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const fileUpload = require("express-fileupload");

const app = express();


// configs
dotenv.config()
// mongodb
require("./config/db")();
// passport
require('./config/passport')(passport);
// ejs
app.set("view engine", "ejs");

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressLayout);
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 5 * 1024 * 1024 * 1024 },
}));
app.use(flash());
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// routes
require("./urls.js")(app);

const PORT = process.env.PORT || 2021;
app.listen(PORT, ()=> console.log(`server started on port ${PORT}`));