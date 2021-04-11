var multer = require("multer");
const { validationResult } = require("express-validator");
var upload = multer({ dest: "uploads/" });
var mongodb = require("mongodb");
const db = require("monk")("localhost/nodeblog");

var express = require("express");
const { body } = require("express-validator");
var router = express.Router();

/* GET users listing. */
router.get("/add", function (req, res, next) {
	const categories = db.get("categories");
	categories.find({}).then((resolve, reject) => {
		res.render("addposts", {
			title: "add new post",
			categories: resolve,
		});
	});
});
router.post("/add", upload.single("mainimage"), function (req, res, next) {
	const title = req.body.title;
	const postbody = req.body.postbody;
	const author = req.body.author;
	const category = req.body.category;
	const date = new Date();
	let mainimage = "noimage.jpg";
	console.log("file",req.file);
	if (req.file) {
		 mainimage = req.file.filename;
	}

	// form validation
	body("title").notEmpty();
	body("postbody").notEmpty();
	// check errors and save to databases
	let posts = db.get("posts");
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render("addposts", {
			errors: errors,
		});
	} else {
		posts
			.insert({
				title: title,
				body: postbody,
				author: author,
				mainimage: mainimage,
				category: category,
				date: date,
			})
			.then((resolve, reject) => {
				if (reject) {
					res.send(reject);
				} else {
					console.log(resolve,"resolve");
					
					res.redirect('/');
				}
			});
	}
});

module.exports = router;
