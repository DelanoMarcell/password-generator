const recentPasswords = [];

document
  .getElementById("generatePassword")
  .addEventListener("click", function () {
    var length = document.getElementById("passwordLength").value;
    var includeLower = document.getElementById("includeLowerCase").checked;
    var includeUpper = document.getElementById("includeUpperCase").checked;
    var includeNumbers = document.getElementById("includeNumbers").checked;
    var includeSpecial = document.getElementById("includeSpecialChars").checked;

    if (!length) {
      showAlert("Please enter a password length.", "danger");
      clearPassword();
      return;
    }

    if (length < 6 || length > 20) {
      showAlert(
        "Password length must be between 6 and 20 characters.",
        "danger"
      );
      clearPassword();
      return;
    }

    if (!includeLower && !includeUpper && !includeNumbers && !includeSpecial) {
      showAlert("Please select at least one character type.", "danger");
      clearPassword();
      return;
    }

    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numbers = "0123456789";
    var specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    var characters = "";
    if (includeLower) characters += lowerChars;
    if (includeUpper) characters += upperChars;
    if (includeNumbers) characters += numbers;
    if (includeSpecial) characters += specialChars;

    var password = "";
    for (var i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    document.getElementById("generatedPassword").value = password;
    showAlert("Password generated successfully.", "success");

    recentPasswords.push(password);
  });

const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
const showAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  alertPlaceholder.innerHTML = wrapper.innerHTML;
};

const copyPassword = () => {
  var password = document.getElementById("generatedPassword");
  if (!password.value) return;
  password.select();
  password.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(password.value);
  showAlert("Password copied to clipboard.", "success");
};

const clearPassword = (removeAlert) => {
  document.getElementById("generatedPassword").value = "";
  if (removeAlert == true) {
    alertPlaceholder.innerHTML = "";
  }
};

// Modal Initialization
const modalElement = document.getElementById("viewPasswordsModal");
const viewModal = new bootstrap.Modal(modalElement);

// Show Modal
const viewPasswords = () => {
  //populate the modal with the recent passwords
  const passwordList = document.getElementById("passwordList");
  passwordList.innerHTML = "";
  recentPasswords.forEach((password, index) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = password;
    passwordList.appendChild(listItem);
  });

  viewModal.show();
};

//View password button functionality
const viewButton = document.getElementById("viewButton");
viewButton.addEventListener("click", view);
