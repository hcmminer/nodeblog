var multer = require("multer");
const { validationResult } = require("express-validator");
var upload = multer({ dest: "./public/images" });
const db = require("monk")("localhost/nodeblog");

var express = require("express");
const { body } = require("express-validator");
var router = express.Router();

/* GET users listing. */
router.get("/show/:id", function (req, res, next) {
	var posts = db.get("posts");
	posts.findOne({ _id: req.params.id }).then((post, reject) => {
		res.render("show", {
			post: post,
		});
	});
});
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
	console.log("file", req.file);
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
					req.flash("success", "Post added");
					res.redirect("/");
				}
			});
	}
});

router.post("/addcomment", function (req, res, next) {
	const postId = req.body.postId;
	console.log(postId,"postid....")
	const name = req.body.name;
	const commentbody = req.body.body;
	const email = req.body.email;
	const commentDate = new Date();

	// form validation
	body("name").notEmpty();
	body("commentbody").notEmpty();
	body("email").isEmail();
	// check errors and save to databases
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const posts = db.get("posts");
		posts.findOne({ _id: postId }).then((post, reject) => {
			res.render("show", {
				errors: errors,
				post: post,
			});
		});
	} else {
		const comment = {
			name: name,
			commentbody: commentbody,
			email: email,
			commentDate: commentDate,
		};
		const posts = db.get("posts");
		posts
			.update(
				{ _id: postId },
				{
					$push: { comments: comment },
				}
			)
			.then((resolve, reject) => {
				if (reject) {
					res.send(reject);
				} else {
					req.flash("success", "comment added");
					res.redirect("/posts/show/" + postId);
				}
			});
	}
});

module.exports = router;
