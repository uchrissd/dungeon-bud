var multiselect = require("../libraries/lou-multi-select-57fb8d3/js/jquery.multi-select");
var characterDiv = $(characterDiv);
var campaignDiv = $(campaignDiv);

$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.name);
  });

  $.get("/api/user_data").then(function (data) {
    $(".member-name").attr("id", data.id);
  });
  var userId = $(".member-name").attr("id");

  // eslint-disable-next-line no-use-before-define
  getCharacterByUser(userId);
  // eslint-disable-next-line no-use-before-define
  getCampaignByUser(userId);
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
      // If we have a post with this id, set a flag for us to know to update the post
      // when we hit submit
      updating = true;
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