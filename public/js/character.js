// /* eslint-disable linebreak-style */
// $(document).ready(function () {
//   $.get("/api/user_data").then(function (data) {
//     var nameInput = $("input#charName");
//     var raceInput = $("input#charRace");
//     var classInput = $("input#charClass");
//     var levelInput = $("input#charLevel");
//     var bioInput = $("input#charBio");
//     var userId = data.id;

//     console.log(userId);

//     $("form.character").on("submit", function handleFormSubmit(event) {
//       event.preventDefault();
//       // Wont submit the character if we are missing a body or a title
//       if (!nameInput.val().trim()) {
//         return;
//       }
//       // Constructing a newPost object to hand to the database
//       var newCharacter = {
//         name: nameInput.val().trim(),
//         race: raceInput.val().trim(),
//         class: classInput.val().trim(),
//         level: levelInput.val().trim(),
//         bio: bioInput.val().trim(),
//         UserId: userId
//       };

//       console.log(newCharacter);
//       submitCharacter(newCharacter);

//       // Submits a new character and brings user to main page upon completion
//       function submitCharacter(newCharacter) {
//         $.ajax({
//           method: "POST",
//           url: "/api/characters/",
//           data: newCharacter
//         })
//           .then(function () {
//             window.location.href = "/main";
//           });
//       }

//       // Update a given post, bring user to the blog page when done
//       function updateCharacter(character) {
//         $.ajax({
//           method: "PUT",
//           url: "/api/characters/",
//           data: character
//         })
//           .then(function () {
//             window.location.href = "/main";
//           });
//       }
//     });
//   });
// });
