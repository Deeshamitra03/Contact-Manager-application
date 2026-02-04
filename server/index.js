const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // Keep your database connection import
require("dotenv").config(); // Load environment variables

// =================================================================
// 🛡️ THE UNIVERSAL CORS FIX (Copy this exact block)
// =================================================================
const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (like Postman or Mobile Apps)
    if (!origin) return callback(null, true);

    // 2. Allow ANY Vercel URL (Preview or Production) and Localhost
    if (origin.includes("vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/tokens
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all standard methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allow headers
};

// Apply the CORS settings
app.use(cors(corsOptions));

// =================================================================

app.use(express.json()); // allows us to access req.body

// -----------------------------------------------------------------
// 👇 YOUR ROUTES GO BELOW HERE 👇
// (If you have "app.post('/auth/register'...)" keep it here!)
// -----------------------------------------------------------------

// Example: Authentication Routes
app.use("/auth", require("./routes/jwtAuth")); 

// Example: Dashboard Routes
app.use("/dashboard", require("./routes/dashboard"));

// -----------------------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});