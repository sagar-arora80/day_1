# Engineer Portfolio & Admin Dashboard

A modern, dynamic personal portfolio website built for software engineers. This project features a high-performance frontend with a "premium dark" aesthetic and a fully functional Admin Dashboard for managing content without touching code.

## 🚀 Features

### Public Frontend
- **Dynamic Content**: All projects, texts, and social links are fetched from Firebase Firestore.
- **Premium UI**: Glassmorphism, smooth gradients, and micro-animations using **Tailwind CSS** and **Framer Motion**.
- **Responsive Design**: Mobile-first layout that adapts perfectly to tablets and desktops.
- **Sections**:
  - **Hero**: Customizable title, subtext, and "Contact Me" call-to-action.
  - **Projects**: Categorized displays for Employment, Weekend Experiments, and AI Initiatives.
  - **Blog**: Showcase technical writing.

### Admin Dashboard (`/admin`)
- **Secure Authentication**: Firebase Auth protection for admin routes.
- **Project Management**:
  - Add, Edit, and Delete portfolio items.
  - **Image Upload**: Seamless integration with Firebase Storage for project covers.
- **Site Settings**:
  - Live preview editing of **Brand Name** (Logo).
  - Update **Hero Title** & **Introduction**.
  - customize **Social Media Links** (LinkedIn, Twitter, GitHub).
  - Manage **Contact Button** text and URL.

## 🛠️ Tech Stack

- **Frontend**: React (Create React App), React Router v6
- **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
- **Backend & Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (Image hosting)
- **Authentication**: Firebase Auth (Email/Password)
- **Deployment**: Firebase Hosting

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/sagar-arora80/day_1.git
cd day_1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1.  Create a project at [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Authentication** (Sign-in method: Email/Password).
3.  Create a **Firestore Database** (Start in **production** mode).
4.  Enable **Storage** (Start in **production** mode).
5.  Get your web app config object from Project Settings.

### 4. Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_APP_ID=your_app_id
```

### 5. CORS Configuration (For Image Uploads)
To allow image uploads from localhost, you must configure CORS for Firebase Storage.
1.  Install Google Cloud SDK.
2.  Run: `gsutil cors set cors.json gs://<YOUR_STORAGE_BUCKET_NAME>`

### 6. Run Locally
```bash
npm start
```
Visit `http://localhost:3000`.

## 🚢 Deployment

This project is configured for **Firebase Hosting**.

1.  Login to Firebase CLI:
    ```bash
    firebase login
    ```
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Deploy:
    ```bash
    firebase deploy
    ```

## 📝 Usage Guide

1.  **First Login**: The first user created in Firebase Auth will need to be manually created via the Firebase Console, or you can temporarily enable a signup route.
2.  **Access Admin**: Go to `/admin` and login.
3.  **Populate Content**:
    - Go to **Site Settings** first to set your Name and Socials.
    - Go to **Projects** to start adding your portfolio pieces.

## 📄 License
MIT
