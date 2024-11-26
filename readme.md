# RBAC Project

This project is an implementation of a Role-Based Access Control (RBAC) system using Node.js, Express, MongoDB, and JWT for authentication.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/rbac-project.git
cd rbac-project

```

### 2. Create .env file.
  
- **Environment Variables:**
  - `PORT`: Port number for the app to run.
  - `MONGODB_URI`: MongoDB connection string.
  - `DB_NAME`: The name of your MongoDB database.
  - `SESSION_SECRET`: Secret for securing user sessions.
  - `ADMIN_EMAIL`: The email address for the admin user.
  - `JWT_SECRET`: Secret for signing JSON Web Tokens used in authentication.
```

### Run the project

```
npm start

```
