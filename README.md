# 🧠 AI Image Classifier

[![GitHub homepage](https://img.shields.io/badge/homepage-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://meesamabbasnaqvi.github.io/Ai-image-classifier/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://js.tensorflow.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<img width="1890" height="910" alt="image" src="https://github.com/user-attachments/assets/5823b65f-1b4f-4894-848a-40e797c091fc" />


A modern, responsive, and high-performance **Dual-AI Image Classification** web application. The platform leverages on-device edge machine learning for sub-second image categorization and optionally hooks into Google's Gemini 1.5 Flash cloud vision API for deep structural analysis, OCR, and scene semantic understanding.

Designed with a sleek, glassmorphic layout, the application serves as a comprehensive tool for both edge-diagnostics and academic reporting.

---

## 🚀 Key Features

- **Dual-AI Scanning Engine**:
  - **Local Edge AI**: Runs **Google MobileNet v2** locally inside your browser using **TensorFlow.js**. Performs instant classification of uploaded images in milliseconds without uploading pixel data to a remote server.
  - **Cloud AI Analysis (Gemini Live)**: When enabled with a Google Gemini API key, it sends the image to **Gemini 1.5 Flash** for advanced semantic detailing (scene parsing, colors, visible text/OCR, keywords, and summary).
  - **Intelligent Simulator Fallback**: Automatically falls back to a category-aware simulated metadata generator if a Gemini API key is not supplied or is rate-limited.
- **Academic Laboratory Worksheet**:
  - Generates detailed, printable laboratory sheets showing confidence levels, predictions, and metadata.
  - Fully printable or exportable directly as a **PDF**.
- **Interactive Data Visualization**:
  - Leverages animated bar graphs to visualize prediction probabilities for the top-3 identified object classes.
- **Client-Side Session Control**:
  - Clean local user authentication (Registration & Login) persisted securely in the browser's `localStorage`.
- **Persistent Scan History**:
  - Localized history logs caching all scanned image previews, timestamps, confidence scores, and AI metadata.
- **Stunning UI/UX**:
  - Designed using Tailwind CSS with a modern glassmorphic look, responsive layouts, micro-animations, customizable API key configurations, and rich feedback (using `canvas-confetti` and `react-hot-toast`).

---


## 💻 Tech Stack

- **UI Framework**: React (v18)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide React (Icons)
- **Client-Side Machine Learning**: `@tensorflow/tfjs`, `@tensorflow-models/mobilenet`
- **Network Requests & Cloud API**: Axios, Google Generative Language API
- **Utilities**: `canvas-confetti` (success animations), `react-hot-toast` (notifications), `react-router-dom` (v6 routing)

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) and **npm** installed on your local machine.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Meesamabbasnaqvi/Ai-image-classifier.git
   cd Ai-image-classifier
   ```

2. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

---

## 🔑 Activating Live Cloud Vision (Optional)

To enable advanced Gemini-powered semantic analysis instead of Simulated Mode:

1. Click on the **Gear Icon (Settings)** in the top right navbar.
2. Paste your **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/)).
3. Click **Save Key**. The app status indicator in the navbar will update from `Simulator Mode` to `Gemini Live`.
4. *Your API key is saved safely in your local browser storage (`localStorage`) and never leaves your machine except to contact Google's API.*

---

## 📦 Deployment

This project is configured for deployment to **GitHub Pages**. To deploy your own custom build:

1. Update the `homepage` URL in `package.json` to point to your GitHub page:
   ```json
   "homepage": "https://<your-username>.github.io/<your-repo-name>/"
   ```
2. Build and deploy the bundle:
   ```bash
   npm run deploy
   ```

---

## 👥 Author

Developed as a Major Academic Project by **[Meesam Abbas](https://github.com/Meesamabbasnaqvi)**.


