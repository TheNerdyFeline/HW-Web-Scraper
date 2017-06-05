var results = [];

$(document).on("click", "#scrape", scrapeArt);
$(document).on("click", "#saveArticle", saveArticle);
$(document).on("click", "#artNotes", seeNotes);


function scrapeArt() {
    $.get("/scrape", function() {
	//window.location.href = "/";
    });
};

function saveArticle() {
    var newArt = {
	"title": $("#title").attr("value"),
	"link": $("#link").attr("value")
    };
    console.log(newArt);
    $.post("/saved", newArt, function() {
    });
};

function seeNotes() {
    $("#notesModal").modal({backdrop: true});
};


