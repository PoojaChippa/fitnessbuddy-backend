# 🏋️ FitnessBuddy – Backend API

## 📌 Overview

**FitnessBuddy** is a scalable backend API for a Full Stack Fitness Tracking and Group Workout Application.

This backend is built using **Node.js + Express** and integrates with **Supabase (PostgreSQL)** as the primary database and authentication provider.

It provides secure, modular, and production-ready APIs for:

- User Authentication
- Profile Management
- Workout Tracking
- Group Creation & Membership
- Leaderboards
- Challenge Management
- Secure JWT Authorization
- Centralized Error Handling

The project follows **MVC Architecture**, clean code principles, and industry best practices.

---

# 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **Supabase (PostgreSQL)**
- **JWT Authentication**
- **Dotenv**
- **CORS**
- **Helmet**
- **Postman (API Testing)**

---

# 📂 Project Structure

fitnessbuddy-backend/
│
├── config/
│ └── supabase.js
│
├── controllers/
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── workout.controller.js
│ ├── match.controller.js
│ ├── message.controller.js
│ ├── group.controller.js
│ ├── challenge.controller.js
│ ├── gym.controller.js
│ └── share.controller.js
│
├── middleware/
│ ├── auth.middleware.js
│ └── error.middleware.js
│
├── models/
│ ├── user.model.js
│ ├── workout.model.js
│ ├── match.model.js
│ ├── message.model.js
│ ├── group.model.js
│ ├── challenge.model.js
│ └── share.model.js
│
├── routes/
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── workout.routes.js
│ ├── match.routes.js
│ ├── message.routes.js
│ ├── group.routes.js
│ ├── challenge.routes.js
│ ├── gym.routes.js
│ └── share.routes.js
│
├── utils/
│ ├── bmi.js
│ └── gyms.js
│
├── .env
├── package.json
└── server.js

---

# 🔐 Authentication System

Authentication is handled using:

- Supabase Auth
- JWT Token Verification
- Protected Routes via Middleware

## 🔁 Authentication Flow

1. User registers via `/api/auth/register`
2. Supabase creates an authentication user
3. Backend stores additional profile data in `users` table
4. JWT token is generated and returned
5. Protected routes validate JWT using middleware

---

# 🗄️ Database Schema (Supabase PostgreSQL)

Below are the database tables used in the system.

---

## 📄 Table: `users`

| Field      | Type      | Constraints      | Description            |
| ---------- | --------- | ---------------- | ---------------------- |
| id         | UUID      | PRIMARY KEY      | Unique user identifier |
| name       | TEXT      | NOT NULL         | Full name              |
| email      | TEXT      | UNIQUE, NOT NULL | Email address          |
| height     | INTEGER   |                  | Height in cm           |
| weight     | INTEGER   |                  | Weight in kg           |
| bmi        | NUMERIC   |                  | Calculated BMI         |
| target_bmi | NUMERIC   |                  | Target BMI             |
| goal       | TEXT      |                  | Fitness goal           |
| created_at | TIMESTAMP | DEFAULT now()    | Account creation date  |

---

## 📄 Table: `workouts`

| Field      | Type      | Constraints                       | Description        |
| ---------- | --------- | --------------------------------- | ------------------ |
| id         | UUID      | PRIMARY KEY                       | Workout ID         |
| user_id    | UUID      | FK → users(id), ON DELETE CASCADE | Owner of workout   |
| type       | TEXT      | NOT NULL                          | Workout type       |
| duration   | INTEGER   | NOT NULL                          | Duration (minutes) |
| calories   | INTEGER   |                                   | Calories burned    |
| created_at | TIMESTAMP | DEFAULT now()                     | Workout date       |

---

## 📄 Table: `groups`

| Field      | Type      | Constraints                       | Description        |
| ---------- | --------- | --------------------------------- | ------------------ |
| id         | UUID      | PRIMARY KEY                       | Group ID           |
| name       | TEXT      | NOT NULL                          | Group name         |
| created_by | UUID      | FK → users(id), ON DELETE CASCADE | Group creator      |
| created_at | TIMESTAMP | DEFAULT now()                     | Creation timestamp |

---

## 📄 Table: `group_members`

| Field     | Type      | Constraints                        | Description      |
| --------- | --------- | ---------------------------------- | ---------------- |
| id        | UUID      | PRIMARY KEY                        | Membership ID    |
| group_id  | UUID      | FK → groups(id), ON DELETE CASCADE | Group reference  |
| user_id   | UUID      | FK → users(id), ON DELETE CASCADE  | Member reference |
| joined_at | TIMESTAMP | DEFAULT now()                      | Join date        |

---

## 📄 Table: `challenges`

| Field        | Type      | Constraints   | Description              |
| ------------ | --------- | ------------- | ------------------------ |
| id           | UUID      | PRIMARY KEY   | Challenge ID             |
| name         | TEXT      | NOT NULL      | Challenge name           |
| goal_type    | TEXT      | NOT NULL      | e.g., calories, duration |
| target_value | INTEGER   | NOT NULL      | Target value             |
| created_at   | TIMESTAMP | DEFAULT now() | Created date             |

---

## 🔗 Relationships

- One User → Many Workouts
- One Group → Many Members
- One User → Many Group Memberships
- Groups aggregate workout progress
- Challenges track user-specific goals
- All relationships use foreign keys with cascading deletes

---

# 📡 API Documentation

## 🔑 Authentication Routes

### Register

POST /api/auth/register

### Login

POST /api/auth/login

---

## 👤 User Routes

### Update Profile

PUT /api/user

### Get Profile

GET /api/user

(Protected Route)

---

## 🏋️ Workout Routes

### Add Workout

POST /api/workout

### Get Workouts

GET /api/workout

### Get WorkoutStats

GET/api/workout/stats

(Protected Routes)

---

## 👥 Group Routes

### Create Group

POST /api/group

### Join Group

POST /api/group/join

### Log Group Workout

POST /api/group/workout

### Get My Groups

GET /api/group/my

### Get GroupStats

GET /api/group/:groupId/stats

### Get Group Progress

GET /api/group/:groupId/progress

### Get Group Leaderboard

GET /api/group/:groupId/leaderboard

(Protected Routes)

---

## 🎯 Challenge Routes

### Create Challenge

POST /api/challenge

### Join Challenge

POST /api/challenge/join

### Log Progress

POST /api/challenge/log

### Get My Challenges

GET /api/challenge/my

### Get Progress

GET /api/challenge/:challengeId

(Protected Routes)

---

## 📊 Dashboard Routes

### Get Dashboard

GET /api/dashboard

(Protected Route)

---

## 🤝 Match Routes

### Get Matches

GET /api/matches

(Protected Route)

---

## 💬 Message Routes

### Send Message

POST /api/message

### Get Conversation

GET api/message/:userId

(Protected Routes)

---

## 📢 Share Routes

### Share Progress

POST api/share

### Get My Feed

GET api/share/my

(Protected Routes)

---

## 🏢 Gym Routes

### Get Near By Gyms

GET /api/gym

(Protected Route)

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <backend-repo-link>
cd fitnessbuddy-backend
```

2️⃣ Install Dependencies

npm install

3️⃣ Create .env File

PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret

4️⃣ Run Development Server

npm run dev

Server runs at:
http://localhost:5000

# ☁️ Deployment (Render)

1. Push backend to GitHub

2. Create new Web Service in Render

3. Connect repository

4. Add environment variables

5. Deploy

6. After deployment:

https://fitnessbuddy-backend-d4rn.onrender.com

# 🛡️ Error Handling & Security

1. Centralized Error Middleware

2. Proper HTTP Status Codes

3. Input Validation before DB operations

4. JWT Verification Middleware

5. Helmet for HTTP security headers

6. CORS configuration

7. Rate limiting (if enabled)

# 🧩 Architecture

MVC Architecture

Modular folder structure

Separation of Concerns

Reusable services

Scalable REST API design

# 🔗 Integration

The backend integrates with:

React Frontend (Axios API calls)

Supabase PostgreSQL Database

JWT Authentication System

# 📦 Future Enhancements

AI-based workout recommendations

Real-time notifications

Social activity feed

Advanced analytics dashboard

# 🚀 Deployment Link

https://fitnessbuddy-backend-d4rn.onrender.com
