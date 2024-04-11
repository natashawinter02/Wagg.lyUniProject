document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registration-form");
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get the values of the registration form fields
        const registerEmail = document.getElementById("register-email").value;
        const registerPassword = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!registerEmail || !registerPassword || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        // Validate the registration data
        if (registerPassword.length < 8) {
            // error message for password length
            document.getElementById("reguser_password_error").textContent = "Password must be at least 8 characters.";
            return;

        }

        if (confirmPassword !== registerPassword) {
            // error message for password mismatch
            document.getElementById("confirmPasswordError").textContent = "Passwords do not match. Please retry.";
            return;

        }

        // Construct an object containing the registration data
        const userData = new URLSearchParams();
            userData.append("registerEmail", registerEmail);
            userData.append("registerPassword", registerPassword);
            userData.append("confirmPassword", confirmPassword);


        try {
            // Send a POST request to the server with the registration data
            const response= await fetch("/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Set the content type to JSON
                },
                // Convert the object to JSON format
                body: userData
            });

            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                // Handle server-side errors
                console.error("Server error:", errorData.error);
                return;
            }

            const responseData = await response.json();

            // Registration successful, redirect the user
            alert(responseData.message);
            window.location.href = "/login"; // Redirect to the home page
        } catch (error) {
            // Handle other exceptions
            console.error("Error during registration:", error);
        }
    });
});
