//var multiselect = require("../libraries/lou-multi-select-57fb8d3/js/jquery.multi-select");
var characterDiv = $(".userCharacters");
var campaignDiv = $("campaignDiv");
var nameInput = $("input#charName");
var raceSelect = $("select.race");
var classSelect = $("select.class");
var levelInput = $("input#charLevel");
var bioInput = $("input#charBio");
var titleInput = $("input#campTitle");
var descriptionInput = $("input#campDesc");
var charactersInput = $("select.characters");

$(document).ready(function() {
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.name);
    $(".member-name").attr("id", data.id);
    // eslint-disable-next-line no-use-before-define
    getCharacterByUser(data.id);
    // eslint-disable-next-line no-use-before-define
    getCampaignByUser(data.id);

    $("form.character").on("submit", function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!nameInput.val().trim()) {
        return;
      }
      console.log(data.id);
      // Constructing a newPost object to hand to the database
      var newCharacter = {
        name: nameInput.val().trim(),
        race: raceSelect.val().trim(),
        class: classSelect.val().trim(),
        level: levelInput.val().trim(),
        bio: bioInput.val().trim(),
        userId: data.id
      };

      submitCharacter(newCharacter);

      // Submits a new character and brings user to main page upon completion
      function submitCharacter(newCharacter) {
        console.log(newCharacter);
        $.ajax({
          method: "POST",
          url: "/api/character",
          data: newCharacter
        }).then(function() {
          window.location.href = "/main";
        });
      }

      // Update a given post, bring user to the blog page when done
      function updateCharacter(character) {
        $.ajax({
          method: "PUT",
          url: "/api/character/:id",
          data: character
        }).then(function() {
          window.location.href = "/main";
        });
      }
    });

    $("form.campaign").on("submit", function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!titleInput.val().trim()) {
        return;
      }
      console.log(data.id);
      // Constructing a newPost object to hand to the database
      var newCampaign = {
        title: titleInput.val().trim(),
        description: descriptionInput.val().trim(),
        characters: JSON.stringify(charactersInput.val()),
        userId: data.id
      };

      submitCampaign(newCampaign);

      // Submits a new character and brings user to main page upon completion
      function submitCampaign(newCampaign) {
        console.log(newCampaign);
        $.ajax({
          method: "POST",
          url: "/api/campaigns",
          data: newCampaign
        }).then(function() {
          window.location.href = "/main";
        });
      }

      // Update a given post, bring user to the blog page when done
      function updateCampaign(campaign) {
        $.ajax({
          method: "PUT",
          url: "/api/campaigns/:id",
          data: campaign
        }).then(function() {
          window.location.href = "/main";
        });
      }
    });

    //function gets the list of characters associated to the user's unique ID

    function getCharacterByUser(userId) {
      console.log(userId);
      $.get("/api/character/user/" + userId, function(data) {
        if (data) {
          // If this character exists, prefill our cms forms with its data
          nameInput.val(data.name);
          raceInput.val(data.race);
          classInput.val(data.class);
          levelInput.val(data.level);
          bioInput.val(data.bio);
        }
      }).then(function(data) {
        var userCharacterList = [];
        console.log(data);
        for (i = 0; i < data.length; i++) {
          userCharacterList.push(data[i].name);
        }
      });
    }

    function getCampaignByUser(userId) {
      $.get("/api/campaign/user/" + userId, function(data) {
        if (data) {
          // If this character exists, prefill our cms forms with its data
          titleInput.val(data.title);
          descriptionInput.val(data.description);
          charactersInput.val(data.characters);
          // If we have a post with this id, set a flag for us to know to update the post
          // when we hit submit
        }
      });
    }
  });
  function classList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/classes/"
    }).then(function(data) {
      var classes = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        classes.push(data.results[i].name);
      }
      renderClassDropdown(classes);
    });
  }
  function renderClassDropdown(classes) {
    var classSelect = $("select.class");
    for (i = 0; i < classes.length; i++) {
      var option = $(
        "<option value=" + classes[i] + ">" + classes[i] + "</option>"
      );
      classSelect.append(option);
    }
  }

  function raceList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/races/"
    }).then(function(data) {
      var races = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        races.push(data.results[i].name);
      }
      renderRaceDropdown(races);
    });
  }
  function renderRaceDropdown(races) {
    var raceSelect = $("select.race");
    for (i = 0; i < races.length; i++) {
      var option = $(
        "<option value=" + races[i] + ">" + races[i] + "</option>"
      );
      raceSelect.append(option);
    }
  }

  function characterList() {
    $.ajax({
      method: "GET",
      url: "/api/character"
    }).then(function(data) {
      console.log(data);
      var characters = [];
      console.log(data);
      for (i = 0; i < data.length; i++) {
        characters.push(data[i].name);
      }
      renderCharacterDropdown(characters);
    });
  }

  function renderCharacterDropdown(characters) {
    var characterSelect = $("select.characters");
    for (i = 0; i < characters.length; i++) {
      var option = $(
        "<option value=" + characters[i] + ">" + characters[i] + "</option>"
      );
      characterSelect.append(option);
    }
  }
  classList();
  raceList();
  characterList();
});

// function renderAuthorList(rows) {
//   authorList.children().not(":last").remove();
//   authorContainer.children(".alert").remove();
//   if (rows.length) {
//     console.log(rows);
//     authorList.prepend(rows);
//   }
//   else {
//     renderEmpty();
//   }
// }

// // Function for handling what to render when there are no authors
// function renderEmpty() {
//   var alertDiv = $("<div>");
//   alertDiv.addClass("alert alert-danger");
//   alertDiv.text("You must create an Author before you can create a Post.");
//   authorContainer.append(alertDiv);
// }
