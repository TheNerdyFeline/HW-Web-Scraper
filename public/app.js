$(document).on("click", "#scrape", scrapeArt);
$(document).on("click", "#saveArticle", saveArticle);
$(document).on("click", "#deleteArt", deleteArticle);
$(document).on("click", "#artNotes", seeNotes);
$(document).on("click", "#newNote", addNote);
$(document).on("click", ".deleteNote", deleteNote);


function scrapeArt() {
    console.log("getting articles");
    $.get("/scrape", function(response) {
	window.location.href = "/";
    });
};

function saveArticle() {
    var newArt = {
	"title": $(this).attr("data-id"),
	"link": $(this).attr("value")
    };
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
    var id = $(this).attr("value");
    console.log("show notes modal");
    console.log('id of article', id);
    $("#notesModal").modal({backdrop: true});
    $.get("/notes/" + id, function(response) {
	//$('body').html(response);
	/*$('.artNote').empty();
	response[0].notes.forEach(function(el){
	    console.log(el.note);
	    $('.artNote').append($('<p></p>').html(el.note));
	    $(".artNote").append($("<button>").text("Delete Note").addClass('deleteNote').attr("data-id", el._id));
	    event.target.remove();*/
	    console.log("response recieved");
	  //  console.log(response); 
	//});    
    });
};

			 

function addNote() {
    var newNote = {"note": $("#note").val()};
    //var id = $(this).attr("data-id");
    $.post("/addNote", newNote, function() {
	
    });
    $("#note").val("");
    console.log("adding note");
}

function deleteNote() {
    var id = $(this).attr("data-id");
    $.ajax({
	type: "GET",
	url : "/deleteNote/" + id,
	success: function(response) {
	    seeNotes();
	}
    });
};
