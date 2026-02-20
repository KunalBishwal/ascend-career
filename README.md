# 🌌 Ascend Career

Ascend Career is an AI-powered professional development platform designed to help you navigate your career journey with confidence. From hyper-personalized career roadmaps to real-time learning recommendations, Ascend Career bridges the gap between where you are and where you want to be.

## 🚀 Key Features

### 1. 🎓 Real-Time Learning Hub
- **Dynamic Course Discovery**: Integrated with the **YouTube Data API v3** to fetch high-quality, free tutorials from top-tier educators like freeCodeCamp and Programming with Mosh.
- **Resume-Driven Recommendations**: Our AI analyzes your resume skills and automatically suggests courses to bridge your knowledge gaps.
- **Search Anything**: Need to learn something specific? Use the integrated YouTube search to find tutorials directly within the platform.

### 2. 🗺️ Career Galaxy (Interactive Roadmap)
- **Visual Career Mapping**: A stunning "Galaxy" visualization of your career path, showing milestones from your current role to your target goal.
- **Full Edit Mode**: Empowering you to take control. Manually add, delete, or edit milestones including job titles, salary expectations, required skills, and duration.
- **Smart Progress Tracking**: Mark milestones as completed, current, or upcoming to visualize your professional growth.

### 3. 📄 AI Resume Intelligence
- **Deep Analysis**: Powered by **Google Gemini API**, providing detailed ATS scoring, skill extraction, and career recommendations.
- **Resume History**: A dedicated management system where you can view all past analyses, delete old ones, or instantly regenerate your career roadmap from a previous resume.

### 4. 🤖 AI Career Mentor
- **Context-Aware Guidance**: A 24/7 AI mentor ready to answer your career questions, help with interview prep, or provide industry insights.
- **Cloud-Synced History**: All your mentor conversations are saved to Firestore, allowing you to pick up exactly where you left off.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui, Lucide React
- **Backend & Persistence**: Firebase (Auth, Firestore, Storage)
- **AI Models**: Google Gemini Pro & Flash
- **External APIs**: YouTube Data API v3

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/KunalBishwal/Ascend-Career.git
   cd Ascend-Career
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_GEMINI_MENTOR_API_KEY=your_gemini_mentor_key
   VITE_GEMINI_ROADMAP_API_KEY=your_gemini_roadmap_key
   VITE_YOUTUBE_API_KEY=your_youtube_key
   ```

4. **Run in development mode**:
   ```sh
   npm run dev
   ```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
