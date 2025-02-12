document.addEventListener("DOMContentLoaded", function () {
    const contentSection = document.querySelector('.content');

    // Create a sidebar container for buttons
    const sidebar = document.createElement('div');
    sidebar.style.width = "200px";  // Set sidebar width
    sidebar.style.padding = "20px";
    sidebar.style.position = "absolute";
    sidebar.style.top = "80px";  // Adjust based on navbar height
    sidebar.style.left = "10px"; // Stick to the left
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    sidebar.style.gap = "10px";

    // "Delete All Cart Items" Button
    const deleteAllButton = document.createElement('button');
    deleteAllButton.textContent = "Delete All Cart Items";
    deleteAllButton.style.padding = "10px";
    deleteAllButton.style.backgroundColor = "#d9534f";
    deleteAllButton.style.color = "white";
    deleteAllButton.style.border = "none";
    deleteAllButton.style.cursor = "pointer";
    deleteAllButton.onclick = deleteAllCartItems;

    // "Order" Button (Placeholder for now)
    // const orderButton = document.createElement('button');
    // orderButton.textContent = "Order";
    // orderButton.style.padding = "10px";
    // orderButton.style.backgroundColor = "#5bc0de";
    // orderButton.style.color = "white";
    // orderButton.style.border = "none";
    // orderButton.style.cursor = "pointer";

    // Append buttons to the sidebar
    sidebar.appendChild(deleteAllButton);
    // sidebar.appendChild(orderButton);

    // Insert sidebar before content section
    document.body.insertBefore(sidebar, contentSection);

    // Fetch cart data and display products
    fetch('https://edgistify-assignment.onrender.com/cart', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        contentSection.innerHTML = ""; // Clear previous content

        if (data.products && Array.isArray(data.products)) {
            data.products.forEach(item => {
                const product = item.product; // Extract product details
                const quantity = item.quantity;
                const cartItemId = item._id;
                
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 5px;">
                    <img src="${product.image}" alt="Product Image" style="width: 150px; height: auto;">
                    <h1><span style="color: blue;">Title:</span> ${product.title}</h1>
                    <h2><span style="color: blue;">Price:</span> ₹${product.price}</h2>
                    <p><span style="color: blue;">Description:</span> ${product.description}</p>
                    <p><span style="color: blue;">Availability:</span> ${product.availablity ? "In Stock" : "Out of Stock"}</p>
                    <p><span style="color: blue;">Quantity:</span> ${quantity}</p>
                </div>
                `;
                contentSection.appendChild(itemElement);
            });
        } else {
            contentSection.innerHTML = "<p>No products in cart.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching API data:', error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const orderButton = document.createElement("button");
    orderButton.textContent = "Place Order";
    orderButton.style.padding = "10px";
    orderButton.style.backgroundColor = "#28a745";
    orderButton.style.color = "white";
    orderButton.style.border = "none";
    orderButton.style.cursor = "pointer";
    orderButton.onclick = placeOrder;

    const sidebar = document.querySelector("div"); // Assuming sidebar is already created
    sidebar.appendChild(orderButton);
});

// Function to place an order
async function placeOrder() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token ) {
        Swal.fire("Error", "User not logged in. Please log in first.", "error");
        return;
    }

    try {
        // Fetch cart details
        const cartResponse = await fetch("https://edgistify-assignment.onrender.com/cart", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        });

        const cartData = await cartResponse.json();

        if (!cartData.products || cartData.products.length === 0) {
            Swal.fire("Error", "Your cart is empty.", "error");
            return;
        }

        // Get shipping address from localStorage or prompt user
        let shippingAddress = localStorage.getItem("shippingAddress");
        if (!shippingAddress) {
            const { value: userAddress } = await Swal.fire({
                title: "Enter Shipping Address",
                input: "text",
                inputLabel: "Shipping Address",
                inputPlaceholder: "Enter your shipping address",
                showCancelButton: true,
            });

            if (!userAddress) {
                Swal.fire("Error", "Shipping address is required to place an order.", "error");
                return;
            }
            shippingAddress = userAddress;
            localStorage.setItem("shippingAddress", shippingAddress);
        }

        // Place order request
        const orderResponse = await fetch("https://edgistify-assignment.onrender.com/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({shippingAddress: shippingAddress }),
        });

        const orderResult = await orderResponse.json();

        if (orderResponse.status === 201) {
            Swal.fire("Success", "Order placed successfully!", "success").then(() => {
                location.reload();
            });
        } else {
            Swal.fire("Error", orderResult.message, "error");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        Swal.fire("Error", "Failed to place order. Please try again.", "error");
    }
}

// Function to delete all cart items
function deleteAllCartItems() {
    fetch('https://edgistify-assignment.onrender.com/cart', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            user: localStorage.getItem('userId')
        })
    })
    .then(response => {
        if (response.status === 204) {
            Swal.fire({
                title: 'Cart Cleared',
                text: 'All items have been removed from your cart.',
                icon: 'success'
            }).then(() => {
                location.reload();
            });
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.message) {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting all cart items:', error);
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
