document.addEventListener("DOMContentLoaded", () => {

    const registerWalkerForm = document.getElementById("register-walker-form");
    registerWalkerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // retrieve form data
        const fullName=document.getElementById("full_name").value;
        const emailAddress=document.getElementById("email_address").value;
        const experience=document.getElementById("experience").value;
        const available=document.getElementById("available").value;

        if(!fullName || !emailAddress || !experience || !available) {
            alert("All fields required");
            return;
        }

            const walkerData = new URLSearchParams();
            walkerData.append("fullName", fullName);
            walkerData.append("emailAddress", emailAddress);
            walkerData.append("experience", experience);
            walkerData.append("available", available);

        try {
            const response = await fetch("/register_walker", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: walkerData
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
            window.location.href = "/home"; // Redirect to the home page
        } catch (error) {
            // Handle other exceptions
            console.error("Error during registration:", error);
        }
    });
});