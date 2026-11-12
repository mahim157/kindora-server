# 🌱 Kindora | Backend API

**Kindora Backend** is the server-side application of the Kindora Social Development Events Platform. It provides RESTful APIs for event management, user participation, authentication, and database operations.

The backend connects with the frontend application to deliver a reliable experience for discovering, creating, managing, and joining community development events.

## 🌐 Live Application & Repositories

- **Backend Live URL:** [https://kindora-server-mocha.vercel.app](https://kindora-server-mocha.vercel.app)
- **Frontend Live Website:** [https://kindora-client-qvje.vercel.app](https://kindora-client-qvje.vercel.app)
- **Backend Repository:** [GitHub](https://github.com/mahim157/kindora-server)
- **Frontend Repository:** [GitHub](https://github.com/mahim157/kindora-client)

## ✨ Key Features

- **MongoDB Integration:** Connects to MongoDB for storing and managing application data.
- **Event Management:** Provides APIs to create, retrieve, update, and delete events.
- **Upcoming Events:** Retrieves upcoming community development events.
- **Recent Events:** Provides recently added events for the homepage.
- **My Events:** Retrieves events created by the authenticated user.
- **Joined Events:** Retrieves events joined by the authenticated user.
- **User Authentication:** Integrates Better Auth for secure authentication.
- **JWT Authorization:** Validates JWT tokens to protect private API endpoints.
- **Protected Routes:** Restricts sensitive operations to authenticated users.
- **Frontend Integration:** Supports communication with the Kindora frontend through REST APIs.

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Programming Language:** JavaScript
- **Database:** MongoDB
- **Authentication:** Better Auth
- **Authorization:** JWT
- **Deployment:** Vercel

## 🔗 API Endpoints

**Production Base URL:**

```text
https://kindora-server-mocha.vercel.app
```

### Events API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Retrieve upcoming events |
| GET | `/api/events/recent` | Retrieve recent events |
| GET | `/api/events/mine` | Retrieve user's created events |
| GET | `/api/events/joined` | Retrieve joined events |
| POST | `/api/events` | Create a new event |

**Note:** Protected endpoints require valid authentication. The exact endpoint paths should match the implemented backend routes.

## 🚀 Getting Started

Follow these instructions to run the backend application locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/mahim157/kindora-server.git
```

### 2. Navigate to the Project Directory

```bash
cd kindora-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend root directory and add the required configuration.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

Add any additional environment variables required by your authentication providers or server configuration.

**Important:** Never commit your `.env` file or expose database credentials, authentication secrets, or private API keys.

### 5. Run the Backend Server

Start the development server using:

```bash
npm run dev
```

Or use the production start command configured in `package.json`:

```bash
npm start
```

When the server starts successfully, it should connect to MongoDB and listen on the configured port.

## 🔗 Frontend Integration

The backend provides REST API services to the Kindora frontend application.

**Production Frontend:**

```text
https://kindora-client-qvje.vercel.app
```

**Production Backend:**

```text
https://kindora-server-mocha.vercel.app
```

For local development, configure the frontend and backend URLs according to your environment.

## 🚀 Deployment

The Kindora backend application is deployed on **Vercel**.

**Live Backend:** [https://kindora-server-mocha.vercel.app](https://kindora-server-mocha.vercel.app)

---

**Developed with ❤️ for Kindora Social Development Events Platform.**
