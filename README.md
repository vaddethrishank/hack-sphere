<div align="center">

  <h1>Hackathon 2026 by NIT Silchar</h1>
</div>

This repository contains the source code for the "Hackathon 2026 by NIT Silchar" platform, a comprehensive solution for hosting and managing hackathons. It includes features for user authentication, team registration, multi-round contests (MCQs and coding problems), and an admin dashboard for managing the event.

## ✨ Features

### For Participants
- **Secure Authentication:** Signup and login with email and password, including email verification.
- **Team Management:** Create and join teams to collaborate with other participants.
- **Participant Dashboard:** A central hub to view your team's status, access rounds, and track your progress.
- **Multi-Round Contests:** Participate in a variety of challenges designed to test your skills.

### For Admins
- **Admin Dashboard:** A powerful interface to manage the entire hackathon.
- **Team Management:** View all registered teams, verify payments, and manage team details.
- **Round Management:** Create, update, and control the visibility of different hackathon rounds.
- **Problem Management:** Add, edit, and delete Multiple Choice Questions (MCQs) and coding problems with hidden test cases.
- **Submission Review:** View and evaluate submissions from participating teams.
- **Result Management:** Manage and publish the results of each round.
- **Certificate Management:** Issue and manage certificates for participants and winners.

## 🚀 Hackathon Rounds

The hackathon is structured into three exciting rounds:

1.  **Round 1: Online Challenge**
    An online preliminary round combining a time-bound MCQ quiz and a set of coding challenges. This round tests your fundamental CS knowledge, logical reasoning, and problem-solving skills.

2.  **Round 2: Project Submission**
    Shortlisted teams will be given a single, detailed problem statement. Your task is to develop a comprehensive software solution and submit the complete project files. This round evaluates your development skills, creativity, and ability to build a functional application.

3.  **Round 3: Offline Hackathon**
    The final round is a 24-hour offline hackathon at the NIT Silchar campus. Top teams will build a functional prototype of their solution for a given problem statement. This is where innovation, teamwork, and presentation skills come into play.

## 💻 Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Tailwind CSS (or other CSS framework), Lucide React for icons
- **Routing:** React Router DOM
- **State Management:** React Context API

## Code Execution Engine

For the evaluation of coding problems, this project uses the [Judge0 API](https://judge0.com/). Judge0 is a robust and scalable open-source online code execution system that allows for the submission of code in a variety of languages and runs it against a set of predefined test cases.

**Key Features:**
- **Multi-Language Support:** Supports a wide range of programming languages.
- **Secure Execution:** Code is executed in a sandboxed environment to prevent malicious code from affecting the server.
- **Scalable:** Can handle a large number of submissions simultaneously.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm
- A free Supabase account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/hackathon-2026-by-nit-silchar.git
    cd hackathon-2026-by-nit-silchar
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    - Create a new project on [Supabase](https://app.supabase.com).
    - For a detailed guide on setting up and configuring Supabase for this project, please refer to the [Supabase Setup Guide](SUPABASE_SETUP.md).

4.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Supabase project URL and anon key:
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

5.  **Run the database migrations:**
    Execute the SQL script in `supabase/schema.sql` in your Supabase project's SQL editor to set up the necessary tables.

6.  **(Optional) Seed the database:**
    To populate your database with mock data, run the seed script:
    ```bash
    npx tsx scripts/seed.ts
    ```

7.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, logos, etc.
│   ├── components/       # Reusable React components
│   ├── contexts/         # React context for state management
│   ├── data/             # Mock data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase client and other libraries
│   ├── pages/            # Page components for each route
│   ├── scripts/          # Scripts for seeding, testing, etc.
│   ├── supabase/         # Supabase schema and migrations
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Entry point of the application
├── .env.local            # Environment variables (ignored by git)
├── package.json
└── README.md
```

## 🚀 Deployment

The application is built as a static site, which can be deployed to any static hosting service like Vercel, Netlify, or Firebase Hosting.

1.  **Build the application:**
    ```bash
    npm run build
    ```
2.  **Deploy the `dist` folder to your hosting provider.** Make sure to set up the same environment variables in your hosting provider's settings.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/hackathon-2026-by-nit-silchar/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
