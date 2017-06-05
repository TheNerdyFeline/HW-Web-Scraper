var results = [];

$(document).on("click", "#scrape", scrapeArt);


function scrapeArt() {
    $.get("/scrape", function() {
	//window.location.href = "/";
    });
};

