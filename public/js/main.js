//var multiselect = require("../libraries/lou-multi-select-57fb8d3/js/jquery.multi-select");
var characterDiv = $("characterDiv");
var campaignDiv = $("campaignDiv");
var nameInput = $("input#charName");
var raceInput = $("input#charRace");
var classInput = $("input#charClass");
var levelInput = $("input#charLevel");
var bioInput = $("input#charBio");

$(document).ready(function () {
  $.get("/api/user_data").then(function (data) {
    var userId = data.id;
    $(".member-name").text(data.name);
    $(".member-name").attr("id", data.id);
    // eslint-disable-next-line no-use-before-define
    getCharacterByUser(userId);
    // eslint-disable-next-line no-use-before-define
    getCampaignByUser(userId);
    console.log(userId);

    $("form.character").on("submit", function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!nameInput.val().trim()) {
        return;
      }
      // Constructing a newPost object to hand to the database
      var newCharacter = {
        name: nameInput.val().trim(),
        race: raceInput.val().trim(),
        class: classInput.val().trim(),
        level: levelInput.val().trim(),
        bio: bioInput.val().trim(),
        UserId: userId
      };

      console.log(newCharacter);
      submitCharacter(newCharacter);

      // Submits a new character and brings user to main page upon completion
      function submitCharacter(newCharacter) {
        $.ajax({
          method: "POST",
          url: "/api/character",
          data: newCharacter
        })
          .then(function () {
            window.location.href = "/main";
          });
      }

      // Update a given post, bring user to the blog page when done
      function updateCharacter(character) {
        $.ajax({
          method: "PUT",
          url: "/api/characters/",
          data: character
        })
          .then(function () {
            window.location.href = "/main";
          });
      }
    });
  });
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {

  });
});

function getCharacterByUser(userId) {
  $.get("/api/character/user/" + userId, function (data) {
    if (data) {
      // If this character exists, prefill our cms forms with its data
      nameInput.val(data.name);
      raceInput.val(data.race);
      classInput.val(data.class);
      levelInput.val(data.level);
      bioInput.val(data.bio);
    }
  });
}

function getCampaignByUser(userId) {
  $.get("/api/campaign/user/" + userId, function (data) {
    if (data) {
      // If this character exists, prefill our cms forms with its data
      titleInput.val(data.title);
      descriptionInput.val(data.description);
      charactersInput.val(data.characters);
      // If we have a post with this id, set a flag for us to know to update the post
      // when we hit submit
      updating = true;
    }
  });
}


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