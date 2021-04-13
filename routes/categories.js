// var multer = require("multer");
const { validationResult } = require("express-validator");
// var upload = multer({ dest: "uploads/" });
var mongodb = require("mongodb");
const db = require("monk")("localhost/nodeblog");

var express = require("express");
const { body } = require("express-validator");
var router = express.Router();

/* GET users listing. */

router.get("/add", function (req, res, next) {
	const categories = db.get("categories");
	categories.find({}).then((resolve, reject) => {
		res.render("addcategory", {
			title: "Add category",
			// categories: resolve,
		});
	});
});
router.post("/add", function (req, res, next) {
	const name = req.body.name;
	// form validation
	body("name").notEmpty();
	// check errors and save to databases
	let categories = db.get("categories");
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render("addcategory", {
			errors: errors,
		});
	} else {
		categories
			.insert({
				name: name,
			})
			.then((resolve, reject) => {
				if (reject) {
					res.send(reject);
				} else {
					res.redirect("/");
				}
			});
	}
});

module.exports = router;
