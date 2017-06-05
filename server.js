// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
//mongoose.connect("mongodb://heroku_wcljfhz0:k8jlpd1q8k47u68n0rqitugac6@ds163721.mlab.com:63721/heroku_wcljfhz0");
mongoose.connect("mongodb://localhost/articles");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Import routes and give the server access to them.
var routes = require("./routes/routes.js");

app.use("/", routes);

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
