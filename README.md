# 🚀 AI Resume Builder

An AI-powered, real-time resume builder built with **React**, **Convex**, and **Clerk**.  
Create, edit, preview, download, and share professional resumes — all inside a clean and modern UI.

---

## 🌟 Features

### ⚡ Real-Time Editing  
Every keystroke instantly updates your live resume preview.

### 🤖 AI-Generated Summary  
Generate a professional summary using **Gemini AI** tailored to your job role.

### 🎨 Custom Themes  
Pick a theme color — applied instantly across the entire resume.

### 📄 One-Click PDF Download  
Export your resume using the browser’s print-to-PDF system.

### 🔗 Sharable Resume Link  
Each resume gets a unique public view URL:
/dashboard/resume/<id>/view

yaml
Copy code

### 🔐 Secure Auth  
Clerk authentication keeps your data safe.

### ☁️ Cloud Storage  
All resume data is stored in Convex, synced instantly across sessions.

---

## 🛠️ Tech Stack

**Frontend**
- React  
- React Router  
- Tailwind CSS  
- ShadCN UI  
- Lucide Icons  
- Sonner (toast notifications)

**Backend**
- Convex (database + backend functions)

**Auth**
- Clerk

**AI**
- Google Gemini (Text Generation)

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repo
```bash
git clone <your-repo-url>
cd <your-project-folder>
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Add Environment Variables
Create a new file:

lua
Copy code
.env.local
Add this:

ini
Copy code
VITE_CONVEX_URL=your_convex_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_GEMINI_API_KEY=your_ai_key
VITE_BASE_URL=http://localhost:5173
4️⃣ Run Dev Server
bash
Copy code
npm run dev
Your app will run on:
👉 http://localhost:5173

📁 Project Structure
css
Copy code
src/
 ├── features/
 │    ├── dashboard/
 │    │     ├── resumes/
 │    │     │      ├── view/
 │    │     │      │     └── ViewResume.jsx
 │    │     │      └── [id]/
 │    │     └── Dashboard.jsx
 │    ├── resumeEditor/
 │    │     ├── form/
 │    │     ├── preview/
 │    │     └── ResumeInfoContext.jsx
 │
 ├── components/
 ├── lib/
 ├── App.jsx
 └── main.jsx
📸 Screenshots
(Add your own screenshots here)
Example:

Editor Page	Preview Page

🚀 Deployment
You can deploy the project easily on:

Vercel (Recommended)

Netlify

Cloudflare Pages

Make sure to add environment variables to your hosting platform.

🤝 Contributing
Contributions are welcome.
To contribute:

Fork the repo

Make your changes

Open a pull request

📄 License
This project is licensed under the MIT License.

⭐ Support the Project
If you like this project, please give it a star ⭐ on GitHub.
It motivates future improvements!

Enjoy building your perfect resume! 🚀
less
Copy code

If you want, I can also create:  
✅ A banner image for GitHub  
✅ Icons / branding for the project  
✅ A hosted demo page template