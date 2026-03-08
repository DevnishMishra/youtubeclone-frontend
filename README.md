Video Streaming Platform – Frontend

Overview

This is the frontend of the Video Streaming Platform built using React + Vite + TailwindCSS.
It allows users to browse videos, watch them, like/dislike, and comment.

The frontend communicates with the backend API to fetch videos, comments, and user authentication.

⸻

Tech Stack
• React
• Vite
• React Router
• Tailwind CSS
• Axios
• Context API (Authentication)

Folder Structure:

src
│
├── components
│ ├── Navbar.jsx
│ ├── Sidebar.jsx
│ └── VideoCard.jsx
│
├── pages
│ ├── Home.jsx
│ ├── VideoPlayer.jsx
│ ├── Login.jsx
│ ├── Register.jsx
│ └── Channel.jsx
|\_\_\_ CreteChannel
│
├── utils
│ ├── api.js
│ └── AuthContext.jsx
│
└── App.jsx
how to use:
git clone https://github.com/DevnishMishra/youtubeclone-frontend.git
cd frontend
npm install

run dev server:npm run dev
bgackend api:http://localhost:5000
