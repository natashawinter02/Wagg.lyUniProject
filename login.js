document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        //get values of login form fields
        const loginEmail = document.getElementById('login-email').value;
        const loginPassword = document.getElementById('login-password').value;

        if (!loginEmail || !loginPassword) {
            alert("All fields are required");
            return;
        }

        const loginUserData = new URLSearchParams();
        loginUserData.append("loginEmail", loginEmail);
        loginUserData.append("loginPassword", loginPassword);

        try {
            const response= await fetch("/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                body: loginUserData
        });

            if (!response.ok) {
              const errorData = await response.json();
                // Handle server-side errors
                console.error("Server error:", errorData.error);

                if(response.status === 401) {
                    alert("Email not found. Please try again with valid email details.")
                } else {
                    alert("An error occurred. Please retry.")
                }
                return;
            }

            const responseData = await response.json();

            if (responseData.success) {
                window.location.href ='/home';
            } else {
                alert("Invalid email or password. Please try again.");
            }

           } catch (error) {
                console.log("Error during login:", error);
         }
    });
});