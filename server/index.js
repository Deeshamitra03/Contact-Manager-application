const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // Keep your database connection

// ==========================================
// 🚨 THE SIMPLE FIX (Allow Everyone)
// ==========================================
app.use(cors()); 
// This automatically allows Vercel, Localhost, and your Phone.
// No complex rules. No "Preflight" errors.
// ==========================================

app.use(express.json()); // Allows access to req.body

// ==========================================
// 👇 YOUR ROUTES (Do not touch these)
// ==========================================

// Authentication Routes
app.use("/auth", require("./routes/jwtAuth")); 

// Dashboard Routes
app.use("/dashboard", require("./routes/dashboard"));

// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});