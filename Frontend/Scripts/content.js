
// fetch('http://localhost:3000/product', {
//     headers: {
//         "Content-type": "application/json"
//     }
// }) // Replace with your actual API endpoint
//     .then(response => response.json())
//     .then(data => {
//         const contentSection = document.querySelector('.content');

//         // Check if data is an array
//         if (Array.isArray(data)) {
//             data.forEach(item => {
//                 const itemElement = document.createElement('div');
//                 itemElement.innerHTML = `
//                     <img src="${item.image}" alt="Movie Poster">
//                     <h1><span style="color: blue;">Title:-</span>${item.title}</h1>
//                     <h2><span style="color: blue;">Price:-</span>${item.price}</h2>
//                     <p><span style="color: blue;">Description:-</span>${item.description}</p>
                    
//                 `;
//                 contentSection.appendChild(itemElement);
//             });
//         } else {
//             console.error('API data is not an array:', data);
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching API data:', error);
//     });

// function checkToken() {
//     const token = localStorage.getItem('token');
//     if (token) {
//         // Token exists, allow access to the page
//         Swal.fire({
//             title: 'Access Granted',
//             text: 'You have access to the protected page.',
//             icon: 'success'
//         });


//         window.location.href = 'mycontent.html';
//         // window.open("./page/mycontent.html")
//     } else {
//         // Token does not exist, show an alert and redirect to a login page
//         Swal.fire({
//             title: 'Access Denied',
//             text: 'Please log in to access this page.',
//             icon: 'error'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Redirect to the login page
//                 window.location.href = '../index.html';
//             }
//         });
//     }
// }


// // Add logout functionality with Swal confirmation
// const logoutButton = document.getElementById('logout');
// logoutButton.addEventListener('click', function () {
//     // Show a confirmation dialog using SweetAlert
//     Swal.fire({
//         title: 'Logout',
//         text: 'Are you sure you want to log out?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, Logout'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // User confirmed the logout
//             // Remove the token and user name from Local Storage
//             localStorage.removeItem('token');
//             localStorage.removeItem('name');
//             localStorage.removeItem('user');
//             // Redirect to the login page after logout
//             window.location.href = '../index.html';
//         }
//     });
// });

fetch('http://localhost:3000/product', {
    headers: {
        "Content-type": "application/json"
    }
})
.then(response => response.json())
.then(data => {
    const contentSection = document.querySelector('.content');

    if (Array.isArray(data)) {
        data.forEach(item => {
            console.log(item);
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="Movie Poster">
                <h1><span style="color: blue;">Title:-</span> ${item.title}</h1>
                <h2><span style="color: blue;">Price:-</span> ${item.price}</h2>
                <p><span style="color: blue;">Description:-</span> ${item.description}</p>
                <p><span style="color: blue;">Availability:-</span> ${item.availablity}</p>
                <button 
                        style="
                            background-color: #007bff;
                            color: white;
                            font-size: 16px;
                            padding: 10px 15px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            transition: background-color 0.3s ease, transform 0.2s ease;
                        "
                        onmouseover="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';"
                        onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1)';"
                        onmousedown="this.style.backgroundColor='#003d80'; this.style.transform='scale(0.98)';"
                        onmouseup="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';"
                        onclick="addToCart('${item._id}')"
                    >
                        Add to Cart
                </button>
            `;
            contentSection.appendChild(itemElement);
        });
    } else {
        console.error('API data is not an array:', data);
    }
})
.catch(error => {
    console.error('Error fetching API data:', error);
});

// function addToCart(productId) {
//     fetch('http://localhost:3000/cart', {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `${localStorage.getItem('token')}` // Assuming token is stored in session storage
//         },
//         body: JSON.stringify({ productid:productId })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data.message ==="Product added to cart successfully"){
//             Swal.fire({
//                 title: 'Success',
//                 text: 'Product added to cart!',
//                 icon: 'success'
//             });
//         }else{  
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Login Failed',
//                 text: data.message,
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error adding product to cart:', error);
//     });
// }


function addToCart(productId) {
    Swal.fire({
        title: 'Enter Quantity',
        input: 'number',
        inputAttributes: {
            min: 1,
            step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Cancel',
        preConfirm: (quantity) => {
            if (!quantity || quantity < 1) {
                Swal.showValidationMessage('Please enter a valid quantity');
            }
            return quantity;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const quantity = result.value;

            fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productid: productId, quantity: quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Product added to cart successfully") {
                    Swal.fire({
                        title: 'Success',
                        text: `Added ${quantity} item(s) to cart!`,
                        icon: 'success'
                    });
                } else {  
                    Swal.fire({
                        icon: 'error',
                        title: 'Try to login again',
                        text: data.message
                    });
                }
            })
            .catch(error => {
                console.error('Error adding product to cart:', error.message);
            });
        }
    });
}

function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
        Swal.fire({
            title: 'Access Granted',
            text: 'You have access to the protected page.',
            icon: 'success'
        });
        window.location.href = 'mycontent.html';
    } else {
        Swal.fire({
            title: 'Access Denied',
            text: 'Please log in to access this page.',
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../index.html';
            }
        });
    }
}

// Add logout functionality with Swal confirmation
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function () {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed the logout
            // Remove the token and user name from Local Storage
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('user');
            localStorage.removeItem('shippingAddress');
            // Redirect to the login page after logout
            window.location.href = '../index.html';
        }
    });
});
