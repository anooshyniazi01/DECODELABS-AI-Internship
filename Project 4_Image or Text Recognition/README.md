# 🧠 AI Vision Lab — Image & Text Recognition

> **AI Internship Final Project (Project 4)**  
> A basic image and text recognition web application using pre-trained AI models.

---

## 📋 Project Overview

**Goal:** Implement a basic image or text recognition task using available libraries.

This project demonstrates the use of pre-trained AI models to perform:
1. **Image Classification** — Identifies objects in images using MobileNet v2
2. **Text Recognition (OCR)** — Extracts text from images using Tesseract.js

Everything runs **100% client-side** in the browser — no server or API keys needed!

---

## 🔧 Technologies Used

| Technology | Purpose |
|---|---|
| **TensorFlow.js** | Machine learning framework for the browser |
| **MobileNet v2** | Pre-trained CNN for image classification (1000+ classes) |
| **Tesseract.js v5** | OCR engine for text extraction (100+ languages) |
| **HTML5 / CSS3 / JavaScript** | Frontend (no frameworks) |

---

## 🚀 How to Run

1. **Open the project folder**
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Edge)
3. That's it! No installation, no build step, no server required.

> **Note:** The first time you classify an image, the MobileNet model (~5MB) will be downloaded from CDN. Subsequent classifications will be instant.

---

## 🎯 Features

### Image Recognition
- Upload any image (JPG, PNG, WEBP)
- Drag & drop support
- Top 5 predictions with confidence scores
- Animated confidence bars
- Uses MobileNet v2 (trained on ImageNet — 1000+ object classes)

### Text Recognition (OCR)
- Upload image containing text
- Supports 100+ languages (default: English)
- Real-time progress tracking
- Copy extracted text to clipboard
- Uses Tesseract.js OCR engine

### UI/UX
- Modern dark theme with glassmorphism
- Smooth animations and micro-interactions
- Fully responsive design
- Sample images for quick testing
- Toast notifications for user feedback

---

## 📁 Project Structure

```
ai-recognition-project/
├── index.html      # Main HTML structure
├── style.css       # All styling (dark theme, animations)
├── app.js          # Application logic (classification, OCR)
└── README.md       # Project documentation
```

---

## 🧪 Key Skills Demonstrated

- ✅ Using AI libraries (TensorFlow.js, Tesseract.js)
- ✅ Using pre-trained models (MobileNet v2)
- ✅ Performing recognition on sample input
- ✅ Displaying output clearly (confidence bars, formatted text)
- ✅ Understanding model outputs (probabilities, text extraction)

---

## 📸 Sample Usage

1. **Image Classification:** Upload a photo of a cat → AI returns "Tabby Cat (92.3%)"
2. **Text Recognition:** Upload a screenshot with text → AI extracts all readable text

---

## ⚠️ Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for first-time model download from CDN)
- No installation or server setup needed

---

## 📄 License

This project was created as part of an AI Internship program.
