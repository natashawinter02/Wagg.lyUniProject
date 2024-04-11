document.addEventListener("DOMContentLoaded", () => {

    const registerDogForm = document.getElementById("register-dog-form");
    registerDogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Retrieve the form values.
        const dogName=document.getElementById("dog_name").value;
        const breed=document.getElementById("breed").value;
        const age=document.getElementById("age").value;
        const ownersName=document.getElementById("owners_name").value;
        const ownerPhone=document.getElementById("owner_phone").value;

        if (!dogName || !breed || !age || !ownersName || !ownerPhone) {
            alert("All fields are required");
            return;
        }

        if (dogName.length > 50 || breed.length > 50) {
            alert("Exceeds maximum length.");
            return;
        }

            const dogData = new URLSearchParams();
            dogData.append("dogName", dogName);
            dogData.append("breed", breed);
            dogData.append("age", age);
            dogData.append("ownersName", ownersName);
            dogData.append("ownerPhone", ownerPhone);


        try {
            const response= await fetch("/register_dog", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: dogData
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