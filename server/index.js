const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

// Basic Check Route
app.get("/", (req, res) => {
    res.send("Server is running correctly!");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});