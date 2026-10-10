# ResQNet – Emergency Response System

ResQNet is a full-stack emergency response application designed to help users manage emergency contacts and track emergencies through a simple, user-friendly interface.

## Features

- **Emergency Dashboard:** View and manage emergency-related information.
- **Emergency Contacts:** Manage emergency contacts through the application.
- **Emergency Management:** Search and filter emergency records.
- **Offline Support:** Includes online-status detection and utilities for handling pending actions.
- **Responsive UI:** Built with React and custom CSS.
- **Backend Integration:** Connects the frontend with backend APIs.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB

## Project Structure

```text
Emergencyapp/
├── resqnet-client/
│   ├── Backend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anshxs07/OfflineApp.git
cd OfflineApp
```

### 2. Install frontend dependencies

```bash
cd resqnet-client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the appropriate backend directory and add the required configuration, such as your MongoDB connection URI and server port.

Never commit credentials or secret API keys to GitHub.

### 4. Start the application

Run the backend using the start script defined in its `package.json`.

Start the frontend from `resqnet-client`:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Future Improvements

- Improve offline action synchronization.
- Add authentication and authorization.
- Deploy the frontend and backend.
- Improve error handling and automated testing.

## Author

**Ansh Sharma**

GitHub: [@anshxs07](https://github.com/anshxs07)
