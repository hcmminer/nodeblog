var express = require("express");
var router = express.Router();
var mongo = require("mongodb");
const db = require("monk")("localhost/nodeblog");
db.then(() => {
	console.log("Connected correctly to server");
});
/* GET home page. */

router.get("/", function (req, res, next) {
	var posts = db.get("posts");
	posts.find({}).then((posts) => {
		res.render("index", { posts: posts });
	});
});

module.exports = router;
