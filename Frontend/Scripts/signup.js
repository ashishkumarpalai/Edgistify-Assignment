document.addEventListener("DOMContentLoaded", function () {
    const loginToggle = document.getElementById("login-toggle");
    const signupToggle = document.getElementById("signup-toggle");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    loginToggle.addEventListener("click", function () {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        loginToggle.style.backgroundColor = "#eee";
        signupToggle.style.backgroundColor = "transparent";
    });

    signupToggle.addEventListener("click", function () {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        signupToggle.style.backgroundColor = "#eee";
        loginToggle.style.backgroundColor = "transparent";
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        const loginData = {
            email: email,
            password: password
        };

        // Replace with your API endpoint for login
        fetch("https://edgistify-assignment.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg == "Sucessfully Login ") {
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("user", data.user)
                    localStorage.setItem("name", data.name)
                    console.log(data)
                    // swal("Login Successful", "", "success")
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'You have successfully logged in.',
                    });
                    // window.open("../index.html")
                    // Redirect to another page after a delay
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: data.msg,
                    });
                    // Redirect to another page after a delay
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                }
                console.log("Login API Response:", data);
                // Handle the response, such as redirecting the user or displaying an error message
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;

        const signupData = {
            fullname: fullName,
            email: email,
            password: password
        };

        // Replace with your API endpoint for signup
        fetch("https://edgistify-assignment.onrender.com/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Signup API Response:", data);
                // Handle the response, such as redirecting the user or displaying an error message
                // Check if registration was successful
                if (data.msg === "new User has been register") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        text: 'You have successfully registered.',
                    });
                    // You can also redirect the user to a different page if needed.
                    // Redirect to another page after a delay
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                } else {
                    // Handle registration failure
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: data.msg,
                    });
                    // Redirect to another page after a delay
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                }
            })
            .catch(error => {
                console.error("Error:", error);
                // Display an error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while processing your request. Please try again later.',
                });
                // Redirect to another page after a delay
                setTimeout(function () {
                    window.location.href = "../index.html";
                }, 2000); // 2000 milliseconds (2 seconds) delay
            });
    });
});
