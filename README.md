# **Video Sensitivity App**

A full-stack web application that analyzes videos for sensitive content and generates detailed sensitivity reports.
Built for **content creators, educators, compliance teams, and businesses** who need to ensure their video content is safe, compliant, and policy-friendly.

---

## 🚀 **Features**

* Upload and analyze videos for sensitive content
* Receive **sensitivity scores**, **flagged segments**, and **detailed reports**
* Modern, intuitive dashboard for managing video analyses
* Secure **authentication & authorization** (JWT)
* RESTful API for external integrations
* Modular backend (Node.js/Express)
* Optional worker process for Python/ML models
* Fully extensible architecture

---

## 🏗 **Architecture Overview**

The app follows a **client–server architecture**:

* **Frontend:** React
* **Backend:** Node.js + Express
* **Processing Worker:** ML model execution (Python optional)
* **Video Handling:** ffmpeg
* **Database:** MongoDB

### **High-Level Data Flow**

1. User uploads a video
2. Backend receives & stores the file
3. Worker analyzes the video with ML models
4. Backend returns sensitivity report (JSON)
5. UI displays detailed results

---

## ⚙️ **Installation**

### **Prerequisites**

* Node.js v14+
* npm or yarn
* Python 3.x (if using Python ML models)
* ffmpeg installed and available in PATH
* MongoDB running locally or in the cloud

---

## 📦 **Setup**

### **1. Clone the repository**

```bash
git clone https://github.com/neerav34/video-sensitivity-app.git
cd video-sensitivity-app
```

### **2. Install dependencies**

```bash
npm install
# or
yarn install
```

### **3. Configure environment variables**

Create a `.env` file in the project root:

```
PORT=3000
DB_URI=mongodb://localhost:27017/video-sensitivity
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads/
MODEL_PATH=models/
```

### **4. Start the development server**

```bash
npm run dev
```

Access the frontend at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 **Usage**

1. Register an account or log in
2. Upload a video for analysis
3. Wait for the sensitivity model to process
4. View the displayed score & flagged segments
5. Download or share report if needed

---

# 📡 **API Documentation**

## **🔹 Register User — POST `/api/register`**

Request Body:

```json
{
  "username": "user1",
  "password": "securePass123"
}
```

### **Responses**

**201** – User created
**400** – Validation error

---

## **🔹 Login User — POST `/api/login`**

Request Body:

```json
{
  "username": "user1",
  "password": "securePass123"
}
```

### **Responses**

**200** – Login successful
**401** – Invalid credentials

---

## **🔹 Upload Video — POST `/api/videos/upload`**

Headers:

```
Authorization: Bearer <token>
```

Form Data:

```
file: <video_file>  (required)
```

### **Responses**

**200** – Upload successful
**401** – Unauthorized

---

## **🔹 Get Video Analysis — GET `/api/videos/:id`**

Headers:

```
Authorization: Bearer <token>
```

### **Responses**

**200** – Returns JSON report
**404** – Video not found

---

## 📊 **Project Structure**

```
video-sensitivity-app/
│
├── client/         # React frontend
├── server/         # Express backend + APIs
├── models/         # ML models
├── uploads/        # Temporary video storage
└── docs/           # Documentation files & diagrams
```

---

## 🛠 **Development**

Start both frontend + backend concurrently:

```bash
npm run dev
```

Backend only:

```bash
npm run server
```

Frontend only:

```bash
npm run client
```

Linting:

* ESLint
* Prettier

---

## 🧪 **Testing**

Run backend tests:

```bash
npm run test
```

* Backend tests: Jest
* Frontend tests: React Testing Library

---

## 🐛 **Troubleshooting**

* Ensure `.env` is correctly configured
* Verify MongoDB is running
* Make sure `ffmpeg` is installed
* Check logs inside `logs/` directory
* Validate file upload permissions

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Ensure tests pass
4. Submit a PR with clear description

---

## 📜 **License**

This project is licensed under the **MIT License**.

---

## 📬 **Contact**

For support or suggestions, create a GitHub issue or email:
📧 **[neeravjha444@gmail.com](mailto:neeravjha444@gmail.com)**
