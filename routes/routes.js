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
var scraped = false;
var results = [];
var dupArt, newArt;

// load homepage
router.get("/", function(req, res) {
    if(!scraped) {
	var noArt = {noArt: {message: "Looks like you have not scraped any articles yet, click the scrape articles button to load articles."}};
	res.render("index", noArt);
    } else {
	var articles = {artDb: results};
	res.render("index", articles);
    }
});

// scrape articles and load to homepage
router.get("/scrape", function(req, res) {
    request("http://www.catster.com/", function(error, response, html) {
	if(error) {
	    res.json(error);
	} else {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(html);
	    // Now, we grab every h2 within an article tag, and do the following:
	    $("h2").each(function(i, element) {
		if ($(element).children().attr("href") != undefined) {
		    // Add the text and href of every link to result object
		    var title = $(this).children().text();
		    var link = $(this).children().attr("href");

		    results.push({
			title: title,
			link: link	
		    });			
		}
	    });
	}
    });
    scraped = true;
    console.log("scraped: " + scraped);
    res.redirect("/");
});

// save article to db
router.post("/saved", function(req, res) {
    Article.findOne({title : req.body.title}, function(err, found) {
	console.log("articles found are " + found);
	if(found === null) {
	    console.log("results are null");
	    dupArt = false;
	    newArt = {
		"title": req.body.title,
		"link": req.body.link
	    };
	} else {
	    console.log("results are " + found);
	    dupArt = true;
	}
	saveArt(newArt);
	res.redirect("/savedArt");
    });
});
    // if not already in db save article to db
function saveArt(article) {
    if(dupArt === false) {
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
    } else {
	console.log("article already saved");
    }
}

// load saved articles
router.get("/savedArt", function(req, res) {
    Article.find({}, function(err, found) {
	if(err) {
	    console.log(err);
	} else {
	    var articles = {savedArticles: found};
	    res.render("savedArt", articles);
	}
    });
});

// create note and save to db

// load notes
router.get("/notes", function(req, res) {
    Article.find({title: req.bosy.title}).populate("notes").exec(function(err, doc) {
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

module.exports = router;
