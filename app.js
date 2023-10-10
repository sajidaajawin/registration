import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
const firebaseApp = initializeApp( { apiKey: "AIzaSyCSWzicHrT7pt-i0PYAJwwdYaFCQAnCWZA",
authDomain: "project1-fca40.firebaseapp.com",
databaseURL: "https://project1-fca40-default-rtdb.firebaseio.com",
projectId: "project1-fca40",
storageBucket: "project1-fca40.appspot.com",
messagingSenderId: "605675293659",
appId: "1:605675293659:web:add09e49ca3f769436f5fe",
measurementId: "G-VS7MLCNF1G"
} );

const auth = getAuth(firebaseApp);
const database= getFirestore(app);


const registrationForm = document.getElementById("registration-form");
const errorMessage = document.getElementById("error-message");

registrationForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Validate inputs
    if (!isValidUsername(username) || !isValidPassword(password) || !isValidEmail(email) || !isValidPhone(phone)) {
        errorMessage.textContent = "Invalid input. Please check your details.";
        return;
    }

    // Check if the user already exists in the database
    const usersRef = ref(database, "users");
    const userQuery = query(usersRef, equalTo("username", username));
    const userSnapshot = await get(userQuery);
    
    if (userSnapshot.exists()) {
        alert("User already exists!");
        return;
    }

    // Create a new user with email and password using Firebase Authentication
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user data to Firebase Realtime Database
        const newUserRef = push(usersRef);
        set(newUserRef, {
            username: username,
            email: email,
            phone: phone,
            userId: user.uid
        });

        // Reset form and display success message
        registrationForm.reset();
        errorMessage.textContent = "Registration successful!";
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

function isValidUsername(username) {
    // Implement your username validation logic here (without spaces)
    return !/\s/.test(username);
}

function isValidPassword(password) {
    // Implement your password validation logic here (at least 8 characters, 1 number, 1 uppercase, 1 special character)
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(password);
}

function isValidEmail(email) {
    // Implement your email validation logic here (follows email format)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    // Implement your phone validation logic here (10 digits starts with 07)
    return /^07\d{8}$/.test(phone);
}
