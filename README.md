# Edgistify-Assignment

# Full-Stack Application

## Introduction
This is a full-stack application that allows users to browse products, add them to their cart, and manage authentication using tokens. The frontend is built with HTML, CSS, and JavaScript, while the backend is powered by Node.js and Express with a MongoDB database.

## Project Type
Fullstack (Frontend + Backend)

## Deployed App
- Frontend: https://gleeful-pixie-0fd72f.netlify.app/
- Backend: https://edgistify-assignment.onrender.com/
- Postman Collection https://www.postman.com/altimetry-astronomer-93622011/edgistify-assignment/overview
- Database: MongoDB

## Directory Structure
```
my-app/
├─ backend/
│  ├─ server.js
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  ├─ script.js
```


## Features
- Fetches product details from an API.
- Allows users to add products to a cart with a quantity selection popup.
- Authentication system using tokens (login/logout functionality).
- SweetAlert notifications for user actions (e.g., successful add-to-cart, login required).
- Secure API calls with authentication headers.

## Design Decisions & Assumptions
- The cart feature requires authentication; users must be logged in to add products.
- API requests include an authorization token for security.
- SweetAlert is used for better UI/UX experience in alerts and confirmations.

## Installation & Getting Started
Clone the repository and follow the steps below:

```bash
# Clone the repository
git clone https://github.com/ashishkumarpalai/Edgistify-Assignment

# Navigate to the project directory
cd Edgistify-Assignment

# Install backend dependencies
cd Backend
npm install

# Start the backend server
npm start

# Install frontend dependencies (if using a package manager)
cd ../frontend


# Open index.html in a browser
```

## Usage
After setting up the application, users can:
- Browse available products.
- Add products to their cart.
- Log in to manage their cart.
- Loged user Order Placed
- Log out securely.


## APIs Used
- Custom backend API endpoints for product retrieval, authentication, and cart management. ,user register/login ,Order management

## API Endpoints
| Method | Endpoint           | Description                      |
|--------|-------------------|----------------------------------|
] Post   | /Register         | User Register                   |
| POST   | /login            | Authenticate user               |
| GET    | /product          | Fetch all products              |
| POST   | /cart             | Add product to cart (auth)      |
| GET    | /cart             | Retrieve user cart (auth)       |
| POST   | /order             | Placed order (auth)      |

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (Vanilla JS, SweetAlert)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Token-based authentication (localStorage/sessionStorage)

---

Let me know if you need any edits or improvements! 🚀

