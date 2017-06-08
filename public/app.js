$(document).on("click", "#scrape", scrapeArt);
$(document).on("click", "#saveArticle", saveArticle);
$(document).on("click", "#deleteArt", deleteArticle);
$(document).on("click", "#artNotes", seeNotes);


function scrapeArt() {
    $.get("/scrape", function() {
	window.location.href = "/";
    });
};

function saveArticle() {
    newArt = {
	"title": $(this).attr("data-id"),
	"link": $(this).attr("value")
    }
    $.post("/saved", newArt, function() {
    });
};

function deleteArticle() {
    var title = $(this).attr("value");
    console.log(title);
    $.ajax({
	type: "GET",
	url: "/deleteArticle/" + title,

	success: function(response) {
	  //this.remove();
	}
    });
};

function seeNotes() {
    $("#notesModal").modal({backdrop: true});
};


