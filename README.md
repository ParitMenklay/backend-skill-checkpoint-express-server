# Backend Skill Checkpoint – Express Server

A RESTful API built with **Node.js**, **Express**, and **PostgreSQL** for managing **questions** and **answers**.
This project was created as part of a backend skill checkpoint to demonstrate API design, validation, database interaction, and error handling.

---

## 📌 Features

* Create, read, update, and delete **questions**
* Search questions by **title** and **category**
* Create and manage **answers** for each question
* Delete all answers belonging to a question
* Input validation using **custom Express middleware**
* Proper **HTTP status code handling**
* PostgreSQL connection using **pg Pool**

---

## 🏗️ Project Structure

```
BACKEND-SKILL-CHECKPOINT-EXPRESS-SERVER
│
├── middlewares/
│   └── questionsValidation.mjs
│
├── routes/
│   └── questions.routes.mjs
│
├── utils/
│   └── db.mjs
│
├── app.mjs
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd BACKEND-SKILL-CHECKPOINT-EXPRESS-SERVER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
PORT=4000
```

---

## ▶️ Running the Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:4000
```

---

## 🗄️ Database Schema (Simplified)

### **questions**

| Column      | Type   |
| ----------- | ------ |
| id          | serial |
| title       | text   |
| description | text   |
| category    | text   |

### **answers**

| Column      | Type   |
| ----------- | ------ |
| id          | serial |
| question_id | int    |
| content     | text   |

---

## 📡 API Endpoints

### Questions

| Method | Endpoint                 | Description                        |
| ------ | ------------------------ | ---------------------------------- |
| POST   | `/questions`             | Create a new question              |
| GET    | `/questions`             | Get all questions                  |
| GET    | `/questions/search`      | Search questions by title/category |
| GET    | `/questions/:questionId` | Get question by ID                 |
| PUT    | `/questions/:questionId` | Update question                    |
| DELETE | `/questions/:questionId` | Delete question                    |

### Answers

| Method | Endpoint                         | Description                      |
| ------ | -------------------------------- | -------------------------------- |
| POST   | `/questions/:questionId/answers` | Create answer for question       |
| GET    | `/questions/:questionId/answers` | Get answers of a question        |
| DELETE | `/questions/:questionId/answers` | Delete all answers of a question |

---

## 🧪 Example Response

### Success – Get Answers

```json
{
  "data": [
    {
      "id": 1,
      "content": "The capital of France is Paris."
    }
  ]
}
```

### Error – Not Found

```json
{
  "message": "Question not found."
}
```

---

## 🛡️ Validation Rules

### Question

* **title** → required
* **description** → required
* **category** → required

### Answer

* **content** must not exceed **300 characters**

---

## 📚 Technologies Used

* Node.js
* Express.js
* PostgreSQL
* pg
* dotenv

---

## 👨‍💻 Author

**Parit Menklay**
Aspiring Full‑Stack Developer

---

## 📄 License

This project is created for **educational purposes**.
