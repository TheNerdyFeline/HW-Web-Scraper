// required packages
var express = require('express');
var router  = express.Router();

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// require models
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");

//declare variables
var dupArt, newArt;

// load homepage
router.get("/", function(req, res) {
    Article.find({saved: false}, function(err, docs) {
	if(err) {
	    throw err;
	}
	//console.log(docs);
	var articles = {artDb: docs};
	res.render("index", articles);
    });
    
});

// scrape articles and load to homepage
router.get("/scrape", function(req, res) {
    request("http://www.catster.com/", function(error, response, html) {
	if(error) {
	    res.json(error);
	} else {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(html);
	    var data = [];
	    var arrLength = $(".h2").length;
	    // Now, we grab every h2 within an article tag, and do the following:
	    $("h2").each(function(i, element) {
		if ($(element).children().attr("href") != undefined) {
		    var result = {};
		    // Add the text and href of every link to result object
		    result.title = $(this).children().text();
		    result.link = $(this).children().attr("href");
		    Article.findOne({title : result.title}, function(err, found) {
			console.log("articles found are " + found);
			if(found === null) {
			    console.log("results are null");
			    dupArt = false;
			    newArt = {
				"title": result.title,
				"link": result.link
			    };
			    //saveArt(newArt);
			    var entry = new Article(newArt);
			    entry.save(function(err, doc) {
				if (err) {
				    console.log(err);
				} else {
				    // console.log(doc);
				    data.push(doc);
				    if (data.length == arrLength){
					res.json(data);
				    }
				}
			    }); // closes save
			} else {
			    console.log("results are " + found);
			    dupArt = true;
			}
		    });
		}
	    });
	}
    });
});

// save article to add notes
router.post("/saved/:title", function(req, res) {
    console.log("update to save title: " + req.params.title);
    Article.update({
	title: req.params.title
    }, {
	$set: {
	    saved: true
	}
    }, function(err, saved) {
	if(err) {
	    res.send(err);
	} else {
	    console.log("saving article: " + saved);
	    res.send(saved);
	}
    });
});
    // if not already in db save article to db
function saveArt(article) {
    //if(dupArt === false) {
	console.log("new article saved: " + newArt);
	var entry = new Article(article);
	entry.save(function(err, doc) {
	    // Log any errors
	    if (err) {
		console.log(err);
	    }
	    // Or log the doc
	    else {
		console.log("new entry: " + doc);
	    }
	});
    //} else {
//	console.log("article already saved");
    //}
}

// load saved articles
router.get("/savedArt", function(req, res) {
    Article.find({saved: true}, function(err, found) {
	if(err) {
	    console.log(err);
	} else {
	    console.log("found: " + found);
	    var articles = {savedArticles: found};
	    console.log("saved articles: " + articles);
	    res.render("savedArt", articles);
	}
    });
});

// create note and save to db

// load notes
router.get("/notes", function(req, res) {
    Article.find({title: req.body.title}).populate("notes").exec(function(err, doc) {
	if(err) {
	    console.log(err);

	} else if(doc === null) {
	    var noNotes = {noNotes: {message: "No notes for this article yet."}};
	    res.render("index", noNotes);
	} else {
	    res.send(doc);
	}
    });
});
// delete notes

// delete article
router.get("/deleteArticle/:title", function(req, res) {
    Article.remove({title: req.params.title}, function(err, removed) {
	if(err) {
	    console.log(err);
	    res.send(err);
	} else {
	    console.log(removed);
	    res.send(removed);
	}
     });
});

module.exports = router;
