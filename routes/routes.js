// required packages
var express = require('express');
var router  = express.Router();
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

//declare variables
var scraped = false;
var results = [];
var articles;

// load homepage
router.get("/", function(req, res) {
    if(!scraped) {
	console.log("no articles");
	var noArt = {noArt: {message: "Looks like you have not scraped any articles yet, click the scrape articles button to load articles."}};
	res.render("index", noArt);
    } else {
	articles = {articles: results};
	console.log(articles);
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
		if ($(element).children().attr("href") != "undefined" || $(element).children().text() != '') {
		    // Add the text and href of every link to result object
		    var title = $(this).children().text();
		    var link = $(this).children().attr("href");
		    
		    results.push({
			title: title,
			link: link
		    });
		    // console.log(results);
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
// Using our Article model, create a new entry
    var entry = new Article(result);

    // Now, save that entry to the db
    entry.save(function(err, doc) {
	// Log any errors
	if (err) {
	    console.log(err);
	}
	// Or log the doc
	else {
	    console.log(doc);
	}
    }); 
});

// load saved articles

// create note and save to db

// delete notes

// delete article

module.exports = router;
