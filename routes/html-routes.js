// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/main");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/main");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/main", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/main.html"));
  });

  // app.get("/character", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/character.html"));
  // });

  // app.get("/campaign", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/campaign.html"));
  // });
};
