const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

// 1. REGISTRATION
router.post("/register", async (req, res) => {
  try {
    // 1. Destructure the req.body (name, email, password)
    const { name, email, password } = req.body;

    // 2. Check if user exists (if yes, throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length > 0) {
      return res.status(401).send("User already exists");
    }

    // 3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user inside our database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // 5. Generate our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    // 1. Destructure the req.body
    const { email, password } = req.body;

    // 2. Check if user doesn't exist (if not, throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 3. Check if incoming password is the same as the database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 4. Give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. VERIFY ROUTE (To keep them logged in when they refresh)
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;