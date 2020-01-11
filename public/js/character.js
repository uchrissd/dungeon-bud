/* eslint-disable linebreak-style */
$(document).ready(function () {
  var characterInput = $("charForm");
  var nameInput = $("nameInput");
  var raceInput = $("raceInput");
  var classInput = $("classInput");
  var levelInput = $("levelInput");
  var bioInput = $("bioInput");
  var userId = $(".member-name").attr("id");

  $(charForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body or a title
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
      userId: userId
    };

    console.log(newCharacter);

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newCharacter.id = id;
      updateCharacter(newCharacter);
    } else {
      submitCharacter(newCharacter);
    }
  });

  // Submits a new post and brings user to blog page upon completion
  function submitCharacter(Post) {
    $.post("/api/character/", Post, function () {
      window.location.href = "/members";
    });
  }

  // Update a given post, bring user to the blog page when done
  function updateCharacter(character) {
    $.ajax({
      method: "PUT",
      url: "/api/character",
      data: character
    })
      .then(function () {
        window.location.href = "/members";
      });
  }
});
