

document.addEventListener("DOMContentLoaded", function () {

  var newThreadBtn = document.getElementById("new-thread-btn");
  var threadForm = document.getElementById("thread-form");
  var threadMessage = document.getElementById("thread-message");

  newThreadBtn.addEventListener("click", function () {
    if (threadForm.hidden) {
      threadForm.hidden = false;
      newThreadBtn.setAttribute("aria-expanded", "true");
      document.getElementById("thread-title").focus();
    } else {
      threadForm.hidden = true;
      newThreadBtn.setAttribute("aria-expanded", "false");
    }
  });

  threadForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("thread-title").value.trim();
    var body = document.getElementById("thread-body").value.trim();

    if (title === "" || body === "") {
      threadMessage.textContent = "Please fill in a title and a message.";
      threadMessage.className = "form-message bad";
      return;
    }

    threadMessage.textContent = "Thanks! Your thread has been posted (this is just a demo).";
    threadMessage.className = "form-message ok";
    threadForm.reset();
  });

});
