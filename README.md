
# Keeper – Full Stack MERN Note-Taking App

A full-stack cloud-based note-taking application inspired by Google Keep.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB
- API Communication: Axios

## Features
- Create notes
- Delete notes
- Persistent storage using MongoDB
- RESTful API architecture
- Responsive UI

## Project Structure

```
Keeper/
├── FrontEnd/
│ ├── src/
│ │ ├── components/
│ │ │ ├── App.jsx
│ │ │ ├── CreateArea.jsx
│ │ │ ├── Note.jsx
│ │ │ ├── Header.jsx
│ │ │ └── Footer.jsx
│ │ └── index.jsx
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── BackEnd/
│ ├── server.js
│ ├── package.json
│ └── node_modules/
│
├── .gitignore
└── README.md
```

## Run Locally

### Prerequisites
- Node.js
- MongoDB (running on `localhost:27017`)

### Backend Setup
```bash
cd BackEnd
npm install
node server.js
```
### Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```