
# Ticket Management System

A RESTful API-based Ticket Management System built using **Node.js, Express.js, MongoDB and Mongoose**.

The application provides user authentication, JWT-based authorization, ticket management and role-based access control for USER and ADMIN accounts.

## Features

### Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only cookie-based token storage.
- Logout functionality.
- Protected API routes.

### Ticket Management
Authenticated users can:
- Create support tickets.
- View all their tickets.
- View individual ticket details.
- Update existing tickets.
- Delete their own tickets.

### Admin Management
Administrators can:
- View tickets created by all users.
- Retrieve ticket creator information.
- View usernames and email addresses using Mongoose `populate()`.
- Access admin-protected routes.

### Role-Based Access Control (RBAC)

Two user roles are supported:

| Role | Permissions |
|---|---|
| USER | Create, view, update and delete their own tickets |
| ADMIN | Access administrative routes and view tickets created by all users |

---

## Current Limitations

- Admins can view all submitted tickets, but changing ticket statuses (OPEN, IN_PROGRESS, CLOSED) through admin functionality has not been implemented yet.
- Centralized error handling is not implemented yet.
- Additional authentication improvements, such as access and refresh tokens, are planned for future development.

---


## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie handling |
| Postman | API testing |

## Project Structure

```text
Ticket_Management_System/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── DatabaseConnection.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   └── ticket.controller.js
│   ├── middleware/
│   │   ├── admin.authorization.middleware.js
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── ticket.schema.js
│   │   └── user.schema.js
│   ├── routes/
│   │   ├── admin.route.js
│   │   ├── auth.route.js
│   │   └── tickets.route.js
│   └── services/
│       └── auth.jwt.js
├── .env
├── architecture.txt
├── index.js
├── package.json
└── package-lock.json
```

## Installation and Setup

### 1. Clone the repository

bash
git clone YOUR_REPOSITORY_URL


### 2. Navigate to the project directory

bash
cd Ticket_Management_System


### 3. Install dependencies

bash
npm install


### 4. Configure environment variables

Create a `.env` file in the project root.

Example:

env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Use your actual environment variable names from `config.js`.

Never expose your MongoDB credentials or JWT secret.

### 5. Start the application

bash
node index.js


Server:

text
http://localhost:8000


---

# API Documentation

All endpoints can be tested using Postman.

## 1. Authentication APIs

Base route:

text
/api/auth


| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login an existing user |
| POST | `/api/auth/logout` | Logout and clear authentication cookie |

### Signup

http
POST /api/auth/signup


Example request:

json
{
    "username": "waleed",
    "email": "waleed@example.com",
    "password": "yourpassword"
}


Creates a new user account and stores the user's information in MongoDB.

### Login

http
POST /api/auth/login


Example request:

json
{
    "email": "waleed@example.com",
    "password": "yourpassword"
}


Login process:

1. Find the user using their email.
2. Compare the entered password with the stored hashed password using bcrypt.
3. Generate a JWT using `jwt.sign()`.
4. Store the JWT in an HTTP-only cookie.

### Logout

http
POST /api/auth/logout


Clears the authentication cookie.

Users can log in again using their existing credentials.

---

## 2. Ticket Management APIs

Base route:

text
/api/raise


All ticket management endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/raise/tickets` | Create a new ticket |
| GET | `/api/raise/tickets` | Retrieve logged-in user's tickets |
| GET | `/api/raise/tickets/:id` | Retrieve a specific ticket |
| PATCH | `/api/raise/tickets/:id` | Update an existing ticket |
| DELETE | `/api/raise/tickets/:id` | Delete a ticket |

### Create Ticket

http
POST /api/raise/tickets


Example request:

json
{
    "title": "Laptop is not working",
    "description": "My laptop display stopped working.",
    "priority": "HIGH"
}


The ticket is automatically associated with the authenticated user through their MongoDB user ID.

The `createdBy` field is obtained from the verified JWT payload, not from the Postman request body.

### Get All User Tickets

http
GET /api/raise/tickets


Returns all tickets created by the currently authenticated user.

### Get Single Ticket

http
GET /api/raise/tickets/:id


Retrieves an individual ticket using its MongoDB ObjectId.

The user can access only their own ticket.

### Update Ticket

http
PATCH /api/raise/tickets/:id


Example request:

json
{
    "title": "Laptop display issue",
    "description": "The laptop display is damaged.",
    "priority": "MEDIUM"
}


Uses Mongoose `findOneAndUpdate()` to update the ticket.

Update options:

- `new: true` returns the updated document.
- `runValidators: true` runs schema validation during the update.

The update query also checks ticket ownership.

### Delete Ticket

http
DELETE /api/raise/tickets/:id


Deletes the specified ticket if it belongs to the authenticated user.

---

## 3. Admin APIs

Admin functionality is separated into its own controller, middleware and route files.

Files:

text
controllers/
└── admin.controller.js

middleware/
└── admin.authorization.middleware.js

routes/
└── admin.route.js


### View All Tickets

The admin controller retrieves all tickets:

javascript
const usersData = await userTicketModel.find()
    .populate('createdBy', 'username email');


Unlike normal users, administrators can retrieve tickets belonging to all users.

The `populate()` method retrieves the referenced user's username and email from the User collection.

Example response:

json
{
    "usersData": [
        {
            "_id": "ticket_id",
            "title": "Laptop is not working",
            "description": "Display got broken",
            "priority": "HIGH",
            "status": "OPEN",
            "createdBy": {
                "_id": "user_id",
                "username": "waleed",
                "email": "waleed@example.com"
            }
        }
    ]
}


The admin route is protected using authentication and admin authorization middleware.

---

# Database Models

## User Model

File:

text
src/models/user.schema.js


Stores registered user information.

Main fields:

| Field | Description |
|---|---|
| username | User's username |
| email | User's email address |
| password | Hashed password |
| role | User authorization role |

Supported roles:

javascript
['USER', 'ADMIN']


Default role:

javascript
'USER'


## Ticket Model

File:

text
src/models/ticket.schema.js


Stores support ticket information.

| Field | Type | Description |
|---|---|---|
| title | String | Ticket title |
| description | String | Ticket description |
| priority | String | LOW, MEDIUM or HIGH |
| status | String | OPEN, IN_PROGRESS or CLOSED |
| createdBy | ObjectId | Reference to the User model |
| createdAt | Date | Ticket creation date |
| updatedAt | Date | Last update date |

### Ticket Priority

javascript
['LOW', 'MEDIUM', 'HIGH']


### Ticket Status

javascript
['OPEN', 'IN_PROGRESS', 'CLOSED']


Mongoose timestamps automatically maintain creation and update dates.

### User Relationship

The ticket schema uses an ObjectId reference:

javascript
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
}


Mongoose `populate()` is used to retrieve referenced user information.

---

# Authentication and Authorization

The application uses JWT-based authentication and role-based authorization.

## Authentication Flow

1. User registers or logs in.
2. Password is verified using bcrypt.
3. JWT is generated using `jwt.sign()`.
4. JWT is stored in an HTTP-only cookie.
5. Authentication middleware reads the cookie.
6. `jwt.verify()` validates the token.
7. The decoded JWT payload is attached to `request.user`.

## Authorization Flow

Authentication and authorization are handled separately.

**Authentication middleware**

File:

text
src/middleware/auth.middleware.js


Verifies the user's JWT and checks whether the request is authenticated.

**Admin authorization middleware**

File:

text
src/middleware/admin.authorization.middleware.js


Checks whether the authenticated user has the ADMIN role.

Example:

javascript
checkUserAuthorization(['ADMIN'])


Only administrators can access routes protected by this authorization check.

---

# HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request or ObjectId |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

# Testing

The APIs can be tested using Postman.

Recommended testing sequence:

1. Register a new user.
2. Log in using the registered credentials.
3. Verify that the JWT cookie is received.
4. Create a ticket.
5. Retrieve all tickets belonging to the logged-in user.
6. Retrieve an individual ticket.
7. Update the ticket.
8. Delete the ticket.
9. Test protected routes without authentication.
10. Test admin-only routes using a USER account.
11. Promote a user to ADMIN and test administrative access.
12. Verify that the admin can retrieve tickets created by different users.

---

# Security Considerations

- Passwords are hashed using bcrypt.
- JWT authentication protects private routes.
- HTTP-only cookies are used for token storage.
- Role-based authorization restricts administrative access.
- Ticket ownership is checked during user-level operations.
- MongoDB ObjectId validation is performed.
- Mongoose schema validators are enabled during ticket updates.
- User roles should only be changed through a trusted administrative process.

---

# Future Improvements

Potential improvements:

- Centralized error-handling middleware.
- Access token and refresh token implementation.
- JWT expiration and refresh-token rotation.
- Request validation using Joi or Zod.
- Pagination and filtering for admin ticket listings.
- Ticket assignment to administrators.
- Ticket comments and activity history.
- Rate limiting.
- Automated testing using Jest or Vitest.
- API documentation using Swagger/OpenAPI.

---

## Author

Developed as a backend API project using Node.js, Express.js, MongoDB and JWT.
=======
# Customer_support_Ticket_Management_System
>>>>>>> 0eb7781f30d15671218566469ead311f5d0526ba
