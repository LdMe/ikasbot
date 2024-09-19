# Ikasbot


Ikasbot is an innovative web platform designed to streamline the process of creating and evaluating programming exercises. It empowers teachers to craft tailored coding challenges and enables students to receive instant feedback on their solutions.

## 🚀 Features

- **Exercise Creation**: Teachers can create coding exercises with associated test cases.
  - Manual creation for full control over exercise content and tests.
  - AI-assisted creation leveraging Large Language Models (LLMs) for efficiency.

- **Automated Testing**: Student-submitted code is automatically executed and evaluated against predefined test cases.

- **Instant Feedback**: Students receive immediate results and feedback after submitting their solutions.

- **Secure Execution**: Code execution takes place in isolated Docker containers to ensure system security.

- **User-Friendly Interface**: Intuitive design for both teachers creating exercises and students solving them.

## 🏗️ Architecture

Ikasbot uses the MERN stack (MongoDB, Express, React, Node.js) and is fully dockerized:

1. **Frontend**: React application for user interactions
2. **Backend**: Node.js with Express for API and business logic
3. **Database**: MongoDB for data storage
4. **Code Execution Service**: Docker container for safe code execution and testing

## 🛠️ Technologies Used

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- Containerization: Docker
- AI Integration: Anthropic API

## 🏁 Getting Started

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory
3. Copy `.env.example` to `.env` and fill in the required values:
   ```
   APP_PORT=
   DB_ROOT_USERNAME=
   DB_ROOT_PASSWORD=
   DB_NAME=
   DB_USERNAME=
   DB_PASSWORD=
   DB_HOST=
   DB_PORT=
   APP_NAME=
   JWT_SECRET=
   CLIENT_URL=http://localhost:5173
   ANTHROPIC_API_KEY=
   ```
4. Start the backend services using Docker Compose:
   ```
   docker-compose up --build
   ```

### Frontend Setup

1. Navigate to `client/ejercicios_client`
2. Copy `.env.example` to `.env` and set the backend URL:
   ```
   VITE_BACKEND_URL=http://localhost:3001
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

The frontend should now be accessible at `http://localhost:5173`.

## 👩‍🏫 For Teachers

- Create new exercises through the web interface
- Optionally use AI assistance to generate exercise content and test cases
- Manage and update existing exercises
- View student submissions and performance analytics

## 🧑‍🎓 For Students

- Browse available exercises
- Submit solutions through the web interface
- Receive instant feedback on submissions
- Track progress and performance over time

## 🤝 Contributing

I welcome contributions to Ikasbot! If you're interested in contributing, please feel free to submit pull requests or open issues on the GitHub repository.

## 🔐 Security

Ikasbot takes security seriously, especially when executing user-submitted code. The Docker-based execution environment is designed to isolate and safely run code.

## 📬 Contact

If you have any questions about the project or would like to connect, feel free to reach out:

- LinkedIn: https://www.linkedin.com/in/danel-lafuente/
- Portfolio: https://lafuentedanel.com

## 🚀 Test it

You can go to [https://ikasbot.tbfsb.com](https://ikasbot.tbfsb.com) and test it out. You can use the user `usuario@mail.com`and password `1234` to test it as a student.

---

Empowering education through technology - Happy coding with Ikasbot! 🚀📚