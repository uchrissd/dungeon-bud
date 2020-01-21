//var multiselect = require("../libraries/lou-multi-select-57fb8d3/js/jquery.multi-select");
var charDiv = $(".userCharacters");
var campaignDiv = $(".userCampaigns");
var nameInput = $("input#charName");
var raceInput = $("input#charRace");
var classInput = $("input#charClass");
var levelInput = $("input#charLevel");
var bioInput = $("input#charBio");
var titleInput = $("input#campTitle");
var statusSelect = $("select.status");
var descriptionInput = $("input#campDesc");
var charactersInput = $("select.characters");
var updatingChar = false;
var characterId;
var updatingCamp = false;
var campaignId;

$(document).ready(function () {
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.name);
    $(".member-name").attr("id", data.id);

    // eslint-disable-next-line no-use-before-define
    getCharacterByUser(data.id);
    // eslint-disable-next-line no-use-before-define
    getCampaignByUser(data.id);

    // $("#new-character").modal().open();
    // $("#new-campaign").modal().open();

    //Create new character
    $("form.character").on("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();
      // Wont submit the character if we are missing a body or a title
      if (!nameInput.val().trim() || !raceInput.val().trim() || !classInput.val().trim() || !levelInput.val().trim() || !bioInput.val().trim()) {
        return;
      }
      console.log(data.id);
      // Constructing a newPost object to hand to the database
      var newCharacter = {
        name: nameInput.val().trim(),
        race: raceInput.val().trim(),
        class: classInput.val().trim(),
        level: levelInput.val().trim(),
        bio: bioInput.val().trim(),
        userId: data.id
      };
      console.log(updatingChar);

      //determine if we're updating the character or adding a new one
      if (updatingChar) {
        updateCharacter(newCharacter, characterId);
        updatingChar = false;
      }
      else {
        submitCharacter(newCharacter);
      }
      //call method to send character info to database

      // Submits a new character and brings user to main page upon completion
      function submitCharacter(newCharacter) {
        console.log(newCharacter);
        $.ajax({
          method: "POST",
          url: "/api/character",
          data: newCharacter
        }).then(function () {
          window.location.href = "/main";
        });
      }
    });

    //create new campaign
    $("form.campaign").on("submit", function (event) {
      event.stopPropagation();
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
        status: statusSelect.val().trim(),
        characters: JSON.stringify(charactersInput.val()),
        userId: data.id
      };

      if (updatingCamp) {
        updateCampaign(newCampaign, campaignId);
        updatingCamp = false;
      }
      else {
        submitCampaign(newCampaign);
      }
      //call method to send campaign info to database

      // Submits a new character and brings user to main page upon completion
      function submitCampaign(newCampaign) {
        console.log(newCampaign);
        $.ajax({
          method: "POST",
          url: "/api/campaigns",
          data: newCampaign
        }).then(function () {
          window.location.href = "/main";
        });
      }

      // Update a campaign, bring user to the main page when done
      function updateCampaign(campaign, campaignId) {
        $.ajax({
          method: "PUT",
          url: "/api/campaigns/" + campaignId,
          data: campaign
        }).then(function () {
          location.reload();
        });
      }
    });

    //function gets the list of characters associated to the user"s unique ID

    function getCharacterByUser(userId) {
      console.log(userId);
      //gets a user's characters
      $.get("/api/character/user/" + userId, function (data) {
        if (data) {
          console.log(data);
        }
      }).then(function (data) {
        var userCharacterList = [];
        console.log(data.body, "this is the character data");

        var charUl = $("<ul>").attr("class", "collapsible");
        console.log(data, "this is the character data");
        //creating html to render out each of a user's characters
        for (i = 0; i < data.length; i++) {
          var charLi = $("<li>" + data[i].name + "</li>").attr("class", "collapsible-header");
          var charInfoDiv = $("<div>").attr("class", "collapsible-body").attr("id", data[i].id);
          var raceSpan = $("<p>Race: " + data[i].race + "<p>");
          var classSpan = $("<p>Class: " + data[i].class + "</p>");
          var levelSpan = $("<p>Level: " + data[i].level + "</p>");
          var bioSpan = $("<p>Bio: " + data[i].bio + "</p>");
          var buttonDiv = $("<div>").attr("class", "buttonDiv");
          var editButton = $("<button>Edit</button>").attr("href", "#charUpdateModal").attr("class", "charEdit btn-large modal-trigger #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          var deleteButton = $("<button>Delete</button>").attr("class", "charDelete btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          charInfoDiv.append(raceSpan);
          charInfoDiv.append(classSpan);
          charInfoDiv.append(levelSpan);
          charInfoDiv.append(bioSpan);
          buttonDiv.append(editButton);
          buttonDiv.append(deleteButton);
          charInfoDiv.append(buttonDiv);
          charLi.append(charInfoDiv);
          charUl.append(charLi);
          charDiv.append(charUl);
          userCharacterList.push(data[i].name);
        }
        console.log(charUl);

        //This is for making the character card collapsible
        $(".collapsible-header").click(function (event) {
          event.stopPropagation();
          event.stopImmediatePropagation();
          $(this).children("div.collapsible-body").stop(true, true).slideToggle("fast"),
            $("div.collapsible-body").toggleClass("dropdown-active");
        });

        //click event to edit the character
        $(".charEdit").on("click", function (event) {
          event.stopPropagation();
          $("#charModal").modal("open");
          var charId = $(this).attr("id");
          console.log(charId);
          getCharacterById(charId);
        });

        $(".charDelete").on("click", function (event) {
          event.stopPropagation();
          var charId = $(this).attr("id");
          console.log(charId);
          deleteCharacter(charId);
        });

        //method to get the character data we want to edit
        function getCharacterById(charId) {
          console.log(charId);
          console.log(updatingChar);
          updatingChar = true;
          $.ajax({
            method: "GET",
            url: "/api/character/" + charId,
            function(data) {
              if (data) {
                console.log(data.body);
              }
            }
          })
            //fill the edit form with the character data that has been retrieved
            .then(function (data) {
              characterId = data.id;
              console.log("Character Update" + data.id);
              nameInput.val(data.name);
              raceInput.val(data.race);
              classInput.val(data.class);
              levelInput.val(data.level);
              bioInput.val(data.bio);
            });
        }
      });
    }

    //retrieve a user's campaigns
    function getCampaignByUser(userId) {
      $.get("/api/campaign/user/" + userId, function (data) {
        if (data) {
          // If this character exists, prefill our cms forms with its data
          titleInput.val(data.title);
          descriptionInput.val(data.description);
          charactersInput.val(data.characters);
        }
      }).then(function (data) {
        //creating and rendering the html with campaign data
        var campUl = $("<ul>").attr("class", "collapsible");
        for (i = 0; i < data.length; i++) {
          var characterString = JSON.parse(data[i].characters).join(", ");
          var campLi = $("<li>" + data[i].title + "</li>").attr("class", "collapsible-header");
          var campInfoDiv = $("<div>").attr("class", "collapsible-body").attr("id", data[i].id);
          var descList = $("<p>Description: " + data[i].description + "<p>");
          var statusText = $("<p>Status: " + data[i].status + "<p>");
          var charList = $("<p>Players: " + characterString + "<p>");
          var buttonDiv = $("<div>").attr("class", "buttonDiv");
          var editButton = $("<button>Edit</button>").attr("class", "campEdit btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          var deleteButton = $("<button>Delete</button>").attr("class", "campDelete btn-large #b71c1c red darken-4").attr("id", data[i].id).attr("css", "z-index: 1;");
          campInfoDiv.append(descList);
          campInfoDiv.append(statusText);
          campInfoDiv.append(charList);
          buttonDiv.append(editButton);
          buttonDiv.append(deleteButton);
          campInfoDiv.append(buttonDiv);
          campLi.append(campInfoDiv);
          campUl.append(campLi);
          campaignDiv.append(campUl);
        }
        function closeCollapsible() {
          $("div.collapsible-header").each(function () {
            $(this).children("div.collapsible-body").stop(true, true).slideToggle("fast"),
            $("div.collapsible-body").toggleClass("dropdown-active");
          });
        }

        //click event to pop open campaign collapsible
        $(".collapsible-header").click(function (event) {
          closeCollapsible();
          event.stopPropagation();
          event.stopImmediatePropagation();
          $(this).children("div.collapsible-body").stop(true, true).slideToggle("fast"),
          $("div.collapsible-body").toggleClass("dropdown-active");
        });

        //click event to edit a campaign
        $(".campEdit").on("click", function (event) {
          event.stopPropagation();
          $("#campaignModal").modal("open");
          var campId = $(this).attr("id");
          console.log(campId);
          getCampaignById(campId);
        });

        $(".campDelete").on("click", function (event) {
          event.stopPropagation();
          var charId = $(this).attr("id");
          console.log(charId);
          deleteCampaign(charId);
        });

        //method to get the campaign info we want to edit
        function getCampaignById(campId) {
          console.log(campId);
          console.log(updatingCamp);
          updatingCamp = true;
          $.ajax({
            method: "GET",
            url: "/api/campaigns/" + campId,
            function(data) {
              if (data) {
                console.log(data.body);
              }
            }
          })
            //populate our edit form with the data retrieved
            .then(function (data) {
              campaignId = data.id;
              console.log("Campaign Update" + JSON.stringify(data));
              titleInput.val(data.title);
              descriptionInput.val(data.description);
              statusSelect.val(data.status);
              charactersInput.val(JSON.parse(data.characters));
            });
        }
      });
    }
  });

  //retrieve a list of character classes from the open5e api
  function classList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/classes/"
    }).then(function (data) {
      var classes = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        classes.push(data.results[i].name);
      }
      renderClassDropdown(classes);
    });
  }

  //create html dropdown and fill it with the classes retrieved from the api
  function renderClassDropdown(classes) {
    var classSelect = $(".class-select");
    var classDivRow = $("<div>").attr("class", "row");
    for (i = 0; i < classes.length; i++) {
      var classDivCol = $("<div>").attr("class", "col s4");
      var classButton = $("<button>" + classes[i] + "</button>").attr("class", "classSelected btn-large #b71c1c red darken-4").attr("id", classes[i]);
      classDivCol.append(classButton);
      classDivRow.append(classDivCol);
    }
    classSelect.append(classDivRow);

    $(".classSelected").on("click", function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      var classText = $(this).attr("id");
      classInput.val(classText);
      var classText = $(this).attr("id");
      console.log(classText);
      getClassInfo(classText);
    });
  }
  function getClassInfo(classSelection) {
    var classInfo = classSelection.toLowerCase();
    var classUrl = "https://api.open5e.com/classes/" + classInfo;
    var classInfoDiv = $(".class-info");
    $.ajax({
      method: "GET",
      url: classUrl
    }).then(function (classData) {
      classInfoDiv.empty();
      var className = $("<p>You have selected " + classSelection + "</p>");
      var classHitDice = $("<p><b>Hit Dice:</b> " + classData.hit_dice + "</p>");
      var classHP = $("<p><b>Hit Points at 1st Level:</b> " + classData.hp_at_1st_level + "</p>");
      var classArmor = $("<p><b>Armor Proficiencies:</b> " + classData.prof_armor + "</p>");
      var classWeapons = $("<p><b>Weapon Proficiencies:</b> " + classData.prof_weapons + "</p>");
      var classEquipment = $("<p><b>Starting Equipment:</b> " + classData.equipment + "</p>");
      classInfoDiv.append(className);
      classInfoDiv.append(classHitDice);
      classInfoDiv.append(classHP);
      classInfoDiv.append(classArmor);
      classInfoDiv.append(classWeapons);
      classInfoDiv.append(classEquipment);
    });
  }
  //retrieve a list of character races from the open5e api
  function raceList() {
    $.ajax({
      method: "GET",
      url: "https://api.open5e.com/races/"
    }).then(function (data) {
      var races = [];
      console.log(data.results);
      for (i = 0; i < data.results.length; i++) {
        races.push(data.results[i].name);
      }
      renderRaceDropdown(races);
    });
  }

  //create html dropdown and fill it with the races retrieved from the api
  function renderRaceDropdown(races) {
    var raceSelect = $(".race-select");
    var raceDivRow = $("<div>").attr("class", "row");
    for (i = 0; i < races.length; i++) {
      var raceDivCol = $("<div>").attr("class", "col s4");
      var raceButton = $("<button>" + races[i] + "</button>").attr("class", "raceSelected btn-large #b71c1c red darken-4").attr("id", races[i]);
      raceDivCol.append(raceButton);
      raceDivRow.append(raceDivCol);
    }
    raceSelect.append(raceDivRow);

    $(".raceSelected").on("click", function (event) {
      event.stopPropagation();
      var raceText = $(this).attr("id");
      raceInput.val(raceText);
      var raceText = $(this).attr("id");
      console.log(raceText);
      getRaceInfo(raceText);
    });
  }

  function getRaceInfo(raceSelection) {
    var raceInfo = raceSelection.toLowerCase();
    var raceInfoDiv = $(".race-info");
    var raceUrl = "https://api.open5e.com/races/" + raceInfo;
    $.ajax({
      method: "GET",
      url: raceUrl
    }).then(function (raceData) {
      raceInfoDiv.empty();
      var raceName = $("<p>You've selected " + raceSelection + "</p>");
      var raceAge = $("<p>" + raceData.age + "</p>");
      var raceSize = $("<p>" + raceData.size + "</p>");
      var raceSpeed = $("<p>" + raceData.speed_desc + "</p>");
      var raceLanguages = $("<p>" + raceData.languages + "</p>");
      raceInfoDiv.append(raceName);
      raceInfoDiv.append(raceAge);
      raceInfoDiv.append(raceSize);
      raceInfoDiv.append(raceSpeed);
      raceInfoDiv.append(raceLanguages);
    });
  }

  // class function

  // race function

  //get a list of all players' characters from the database
  function characterList() {
    $.ajax({
      method: "GET",
      url: "/api/character"
    }).then(function (data) {
      console.log(data);
      var characters = [];
      console.log(data);
      for (i = 0; i < data.length; i++) {
        characters.push(data[i].name);
      }
      renderCharacterDropdown(characters);
    });
  }

  //create html for a multiselect list of all characters
  function renderCharacterDropdown(characters) {
    var characterSelect = $("select.characters");
    for (i = 0; i < characters.length; i++) {
      var option = $(
        "<option value=" + characters[i] + ">" + characters[i] + "</option>"
      );
      characterSelect.append(option);
    }
  }

  //function to update character information
  function updateCharacter(character, charId) {
    console.log(character);
    $.ajax({
      method: "PUT",
      url: "/api/character/" + charId,
      data: character
    }).then(function () {
      location.reload();
    });
  }

  function deleteCharacter(charId) {
    console.log(charId);
    $.ajax({
      method: "DELETE",
      url: "/api/character/" + charId
    }).then(function () {
      location.reload();
    });
  }

  function deleteCampaign(charId) {
    console.log(charId);
    $.ajax({
      method: "DELETE",
      url: "/api/campaigns/" + charId
    }).then(function () {
      location.reload();
    });
  }

  //generic triggers for modals and collapsibles
  $(".modal").modal();
  $(".modal-trigger").modal();
  $(".collapsible").collapsible({ accordion: true });

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
