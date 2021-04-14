var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const flash = require("connect-flash");
var session = require("express-session");
var moment = require("moment");
var expressValidator = require("express-Validator");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var db = require("monk")("localhost/nodeblog");

var index = require("./routes/index");
var posts = require("./routes/posts");
var categories = require("./routes/categories");

var app = express();

app.locals.moment = moment;
// app.locals.message();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// Express Session
app.use(
	session({
		secret: "secret",
		saveUninitialized: false,
		resave: false,
		cookie: { httpOnly: true },
	})
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.messages = req.flash();
	next();
});

app.use("/", index);
app.use("/posts", posts);
app.use("/categories", categories);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.listen(3000, () => {
	console.log(`Example app listening at http://localhost:3000`);
});

module.exports = app;
