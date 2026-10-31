/* =========================================================
   AeroTech - Contact page
   Checks the form before "sending" it. Nothing is really
   sent anywhere, it just shows a thank you message.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  var form = document.getElementById("contact-form");
  var success = document.getElementById("contact-success");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("contact-name").value.trim();
    var email = document.getElementById("contact-email").value.trim();
    var message = document.getElementById("contact-message").value.trim();

    var errorName = document.getElementById("error-name");
    var errorEmail = document.getElementById("error-email");
    var errorMessage = document.getElementById("error-message");

    // clear old messages
    errorName.textContent = "";
    errorEmail.textContent = "";
    errorMessage.textContent = "";
    success.textContent = "";

    var allGood = true;

    if (name === "") {
      errorName.textContent = "Please enter your name.";
      allGood = false;
    }

    // very simple email check
    if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      errorEmail.textContent = "Please enter a valid email address.";
      allGood = false;
    }

    if (message.length < 10) {
      errorMessage.textContent = "Your message should be at least 10 characters.";
      allGood = false;
    }

    if (allGood) {
      success.textContent = "Thanks " + name + "! We got your message and will reply within 2 working days.";
      success.className = "form-message ok";
      form.reset();
    }
  });

});
