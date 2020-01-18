// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //get all characters from the db
  app.get("/api/character", function(req, res) {
    db.Character.findAll({
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  //get specific character from db
  app.get("/api/character/:id", function(req, res) {
    console.log(req);
    db.Character.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  //get all characters for a user
  app.get("/api/character/user/:id", function(req, res) {
    console.log("line 73" + JSON.stringify(req.params.id));
    db.Character.findAll({
      where: {
        userId: req.params.id
      },
      include: [
        {model: db.User},
      ]
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    }).catch(function(err){
      throw err;
    });

  });

  //get all campaigns for a user
  app.get("/api/campaign/user/:id", function(req, res) {
    console.log("line 73" + JSON.stringify(req.params.id));
    db.Campaign.findAll({
      where: {
        UserId: req.params.id
      },
      include: [
        {model: db.User}
      ]
    }).then(function(dbCampaign) {
      res.json(dbCampaign);
    }).catch(function(err){
      throw err;
    });
  });

  //get campaigns from the db
  app.get("/api/campaigns", function(req, res) {
    db.Campaign.findAll({
      include: [
        {model: db.User},
        {model: db.Character}
      ]
    }).then(function(dbCampaign) {
      res.json(dbCampaign);
    });
  });

  //get specific campaign from db
  app.get("/api/campaigns/:id", function(req, res) {
    db.Campaign.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  //add characters to the db
  app.post("/api/character", function(req, res) {
    console.log(req.body);
    db.Character.create({
      name: req.body.name,
      race: req.body.race,
      class: req.body.class,
      level: req.body.level,
      bio: req.body.bio,
      UserId: req.body.userId
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  //add campaigns to the db
  app.post("/api/campaigns", function(req, res) {
    console.log("***********************"+req.body.userId);
    db.Campaign.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      characters: req.body.characters,
      UserId: parseInt(req.body.userId)
    }).then(function(dbCampaign) {
      res.json(dbCampaign);
    });
  });

  //update character in the db
  app.put("/api/character/:id", function(req, res) {
    console.log(req.body);
    db.Character.update({
      name: req.body.name,
      race: req.body.race,
      class: req.body.class,
      level: req.body.level,
      bio: req.body.bio
    },
    {
      where: { id: req.params.id}
    })
      .then(function(dbCharacter) {
        res.json(dbCharacter);
      });
  });

  app.put("/api/campaigns/:id", function(req, res) {
    db.Campaign.update({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      characters: req.body.characters
    },
    {
      where: { id: req.params.id}
    }).then(function(dbCampaign) {
      res.json(dbCampaign);
    });
  });

  app.delete("/api/campaigns/:id", function(req, res) {
    db.Campaign.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCampaign) {
      res.json(dbCampaign);
    });
  });

  app.delete("/api/character/:id", function(req, res) {
    db.Character.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });
};
