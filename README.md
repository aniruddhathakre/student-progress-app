Student Progress Tracker
Hi there! This is a full-stack MERN application that I built from scratch for the Full Stack Developer role at TLE Eliminators.

The goal was to create a simple but powerful tool for managing students and tracking their competitive programming progress by connecting directly to the official Codeforces API.

Demo Video & GitHub Link
Walkthrough Video: [\[Link to Your Demo Video Here\]](https://youtu.be/d3OEeSb_a1c)

What The Product Does (Features)
This application is packed with features to make managing student progress easy:

Manage Your Students: You can easily add new students, edit their information (like their name or Codeforces handle), and remove them. Everything happens through a clean and simple interface with pop-up forms.

View All Students at a Glance: The main dashboard shows all your students in a table with their current and max Codeforces ratings, and when their data was last synced.

Download Everything: You can download the entire list of your students and their data as a CSV file with a single click.

Detailed Student Profiles: Clicking on a student takes you to their personal profile page, which shows a deep dive into their progress.

Interactive Rating Chart: The profile page has a line chart showing a student's rating history. You can filter the chart to see their progress over the last 30 days, 90 days, or all time.

Problem-Solving Stats: The profile also shows key stats like the total number of unique problems a student has solved, their average problem difficulty, and the hardest problem they've ever solved.

Visualize Problem Difficulty: I included a bar chart that shows how many problems a student has solved at each rating level (e.g., how many 1200-rated problems, 1400-rated problems, etc.).

Automatic Data Sync: The application has a backend process that is set up to automatically fetch the latest data from Codeforces for all students every day, keeping the information fresh.

Light & Dark Mode: Of course, there's a theme toggle for user comfort!

APIs and Interfaces
I built a complete REST API on the backend to power the application. Here are the main interfaces:

Student Management APIs:

GET /api/students - Gets the list of all students.

POST /api/students - Creates a new student and fetches their initial Codeforces data.

GET /api/students/:id - Gets the details for a single student.

PUT /api/students/:id - Updates a student's information. If the Codeforces handle is changed, it automatically re-syncs all their data in real-time.

DELETE /api/students/:id - Deletes a student.

Codeforces Data APIs:

GET /api/students/:handle/contests - Gets the contest history for a specific handle.

GET /api/students/:handle/submissions - Gets the submission history for a specific handle.

System APIs:

POST /api/students/sync - Manually triggers the data sync job for all students.

How I Built It (Tech Stack)
Frontend: React, using Vite for a fast development experience.

UI Components: Material-UI (MUI) for a clean, professional look and pre-built components like tables and modals.

Charts: Recharts for the interactive line and bar charts.

Backend: Node.js and Express.js for the API server.

Database: MongoDB Atlas, with Mongoose to model the data.

API Communication: Axios on the frontend, and a secure, authenticated API client on the backend using Node's crypto module for SHA512 signatures as required by the Codeforces API.

Automation: node-cron for scheduling the daily data sync.

How to Run It Locally
Get the code: Clone the GitHub repository to your computer.

Set up the Backend:

Go into the backend folder.

Run npm install.

Create a .env file and fill in your details for MONGO_URI, CODEFORCES_API_KEY, and CODEFORCES_API_SECRET.

Run npm run dev to start the server.

Set up the Frontend:

In a new terminal, go into the frontend folder.

Run npm install.

Run npm run dev to start the web application.
