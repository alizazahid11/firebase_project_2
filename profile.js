
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database(); // Reference to Firebase Realtime Database

// Check user's sign-in status on page load
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, you can now update their password or perform other actions
  } else {
    // User is not signed in, handle this case accordingly
  }
});

const profileForm = document.getElementById("profile-form");
const photoInput = document.getElementById("photo-input");
const firstNameInput = document.getElementById("profile-name");
const passwordInput = document.getElementById("password-form");
const editNameIcon = document.getElementById("edit-icon");
const editPhotoIcon = document.getElementById("edit-photo");
const repeatPasswordInput = document.getElementById("repeat-password-form"); 

// Function to update profile information
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Check if the new password and repeat password match
  const newPassword = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value; // Get the value of the repeat password input

  if (newPassword !== repeatPassword) {
    alert("New password and repeat password do not match.");
    return; 
  }

  // Update profile photo
  const photoFile = photoInput.files[0];
  if (photoFile) {
    const storageRef = storage.ref(`profile_photos/${photoFile.name}`);
    await storageRef.put(photoFile);
    const photoUrl = await storageRef.getDownloadURL();
    // Update user's profile photo URL in the database
    // Example: You might use Firebase Firestore or Realtime Database
  }

  // Update first name, last name, and password
  const firstName = firstNameInput.value;
  
  // Update user information in the database
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;

    // Update the password in the Realtime Database
    database.ref(`users/${userId}`).update({
      password: newPassword,
      repeatPassword: repeatPassword,
      // Add other user information here if needed
    });

    // Clear password input for security
    passwordInput.value = "";
    repeatPasswordInput.value = "";


    alert("Profile updated successfully!");
  } else {
    alert("User is not signed in.");
  }
});

// Add an event listener to the edit name icon
editNameIcon.addEventListener("click", () => {
  // Show a form or modal for editing the name
  const newName = prompt("Enter your new name:");
  if (newName !== null) {
    // Update the displayed name and send it to the database
    firstNameInput.textContent = newName;
    // You should also send the new name to the database here
  }
});

// Add an event listener to the edit photo icon
editPhotoIcon.addEventListener("click", () => {
  // Create an input element for file upload
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  // Add an event listener to the file input
  fileInput.addEventListener("change", (event) => {
    const photoFile = event.target.files[0];

    if (photoFile) {
      // Read the selected image file and display it in the browser
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target.result;
        photoInput.src = newImageUrl;
      };
      reader.readAsDataURL(photoFile);

      // You can also update the profile image in the database here
    }
  });

  // Trigger a click event on the file input to open the file selection dialog
  fileInput.click();
});

const updatePasswordButton = document.querySelector(".update-button");

updatePasswordButton.addEventListener("click", async () => {
  // Get the new password input value
  const newPassword = document.querySelector("input[type='password'][placeholder='New Password']").value;

  // Check if the user is signed in
  const user = firebase.auth().currentUser;
  if (user) {
    try {
      // Update the password
      await user.updatePassword(newPassword);

      // Update the password in the Realtime Database
      const userId = user.uid;
      database.ref(`users/${userId}`).update({
        password: newPassword,
        // Add other user information here if needed
      });

      alert("Password updated successfully!");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  } else {
    alert("User is not signed in.");
  }
});
