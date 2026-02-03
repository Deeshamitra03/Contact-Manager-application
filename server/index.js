const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.get("/", (req, res) => {
    res.send("Server is running correctly!");
});
app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});