$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.form-signup");
  var nameInput = $("input#name-input");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      name: nameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    // eslint-disable-next-line no-use-before-define
    signUpUser(userData.name, userData.email, userData.password);
    nameInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(name, email, password) {
    $.post("/api/signup", {
      name: name,
      email: email,
      password: password
    })
      // eslint-disable-next-line no-unused-vars
      .then(function(data) {
        window.location.replace("/main");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      // eslint-disable-next-line no-use-before-define
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
