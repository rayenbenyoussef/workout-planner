# Workout Planner

> [!NOTE]
>
> A weekly workout planner built with **Node.js**, **Express**, and **SQLite** — plan your exercises day by day, and have them persist across sessions.

---

> [!IMPORTANT]
> By working through this project, you will understand:
>
> - How a **REST API** works with `GET`, `POST`, `PUT`, and `DELETE` routes
> - How to persist data using **SQLite** via `sql.js`
> - How the **frontend** communicates with the **backend** using `fetch()`
> - How to structure a full-stack **Node.js** project

---

## 🧱 What It Does

The Workout Planner lets you manage a weekly exercise schedule through a clean web interface. Each day of the week (Monday → Sunday) has its own card where you can:

- ➕ **Add** an exercise with a name and reps/sets
- ✏️ **Edit** an existing exercise
- 🗑️ **Delete** an exercise

All data is saved to a local SQLite database and reloaded automatically every time you open the app.

---

## 🖥️ Backend Tools

### 🟢 Node.js
Runs JavaScript on the server side. Powers the backend of this project.

### 🚂 Express
Lightweight framework that defines the API routes — rules for what the server does when it receives a request.

### 🗄️ sql.js
A pure JavaScript port of **SQLite** that requires no native compilation. All exercises are stored in a `workout.sqlite` file in your project folder.

> **Why `sql.js` instead of `better-sqlite3`?**
> `better-sqlite3` requires compiling native C++ code, which can fail on newer versions of Node.js. `sql.js` is pure JavaScript and works on any platform and any Node version with no extra setup.

---

## 📡 API Endpoints — `/exercises`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/exercises` | Retrieve all exercises (all days) |
| `GET` | `/exercises/:day` | Retrieve exercises for a specific day |
| `POST` | `/exercises` | Add a new exercise |
| `PUT` | `/exercises/:id` | Update an existing exercise |
| `DELETE` | `/exercises/:id` | Remove an exercise |

Each exercise record has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `TEXT` | Unique identifier (generated on the frontend) |
| `day` | `TEXT` | Day key: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun` |
| `name` | `TEXT` | Exercise name (e.g. `Push-ups`) |
| `reps` | `TEXT` | Reps or sets (e.g. `3×12` or `30 sec`) |

> [!TIP]
> You can test the API endpoints using [Postman](https://www.postman.com/), [Apidog](https://apidog.com/), or [curl](https://curl.se/).

---

## 🚀 Setup

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Download or clone the project folder:
```bash
git clone https://github.com/rayenbenyoussef/workout-planner.git
cd workout-planner
```

2. Install dependencies:
```bash
npm install
```

### Running the Project

```bash
node server.js
```

Then open your browser and go to:
```
http://localhost:3000
```

The `workout.sqlite` database file will be created automatically on first run.

---

## 📁 Project Structure

```
workout-planner/
├── public/
│   └── index.html       # Frontend (HTML + CSS + JS)
├── server.js            # Express server & API routes
├── workout.sqlite       # SQLite database (auto-created)
├── package.json         # Project dependencies and scripts
└── README.md
```

---

## 🔄 How It Works

```
Browser (index.html)
      │
      │  fetch('/exercises', ...)
      ▼
Express Server (server.js)
      │
      │  db.run / db.query
      ▼
SQLite Database (workout.sqlite)
```

1. When the page loads, `fetch('/exercises')` retrieves all saved exercises from the database and renders them into the day cards.
2. When you add, edit, or delete an exercise, the frontend sends a `POST`, `PUT`, or `DELETE` request to the server.
3. The server processes the request, updates the SQLite database, and saves it to disk.
4. The frontend updates the UI immediately from its local cache — no full page reload needed.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `sql.js` | SQLite database (pure JavaScript, no compilation needed) |
