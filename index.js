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

    if (length < 6 || length > 64) {
      showAlert(
        "Password length must be between 6 and 64 characters.",
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

const alertPlaceholderPopup = document.getElementById(
  "liveAlertPlaceholderPopup"
);

const copyPassword = () => {
  var password = document.getElementById("generatedPassword");
  if (!password.value) return;
  password.select();
  password.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(password.value);
  showAlert("Password copied to clipboard.", "success");
};

const copyRecentPassword = (index) => {
  var password = document.getElementById(`password-${index}`);

  if (!password || !password.innerText) return;

  navigator.clipboard
    .writeText(password.innerText)
    .then(() => {
      document.getElementById(`btn-${index}`).innerText = "copied";
      document.getElementById(`password-${index}`).style.color = "blue";

      setTimeout(() => {
        document.getElementById(`btn-${index}`).innerText = "copy";
        document.getElementById(`password-${index}`).style.color = "black";
      }, 1500);
    })
    .catch((err) => {
      showAlertPopup("Failed to copy password.", "danger");
      console.error("Error copying password: ", err);
    });
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

// Show Modal with proper overflow handling
const viewPasswords = () => {
  const passwordList = document.getElementById("passwordList");
  passwordList.innerHTML = "";

  recentPasswords.forEach((password, index) => {
    const listItem = document.createElement("li");
    listItem.className = `list-group-item list-${index}`;

    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";
    listItem.style.gap = "1rem";

    const passwordContainer = document.createElement("div");
    passwordContainer.style.flex = "1";
    passwordContainer.style.overflow = "hidden";
    passwordContainer.style.textOverflow = "ellipsis";
    passwordContainer.style.whiteSpace = "nowrap";

    const passwordItem = document.createElement("p");
    passwordItem.id = `password-${index}`;
    passwordItem.innerText = password;
    passwordItem.style.margin = "0";

    const listCopyButton = document.createElement("button");
    listCopyButton.className = "btn btn-outline-dark";
    listCopyButton.id = `btn-${index}`;
    listCopyButton.style.flexShrink = "0";
    listCopyButton.textContent = "Copy";
    listCopyButton.addEventListener("click", () => copyRecentPassword(index));

    passwordContainer.appendChild(passwordItem);
    listItem.appendChild(passwordContainer);
    listItem.appendChild(listCopyButton);
    passwordList.appendChild(listItem);
  });

  viewModal.show();
};
