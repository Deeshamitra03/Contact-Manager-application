const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// 1. CREATE A CONTACT (Updated with Notes & Tags)
router.post("/contacts", authorization, async (req, res) => {
  try {
    // We now accept notes and tags from the frontend
    const { name, phone, email, notes, tags } = req.body;
    
    const newContact = await pool.query(
      "INSERT INTO contacts (user_id, name, phone, email, notes, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, name, phone, email, notes, tags]
    );
    
    res.json(newContact.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// 2. GET ALL CONTACTS (Sorted: Favorites first, then Alphabetical)
router.get("/contacts", authorization, async (req, res) => {
  try {
    const allContacts = await pool.query(
      "SELECT * FROM contacts WHERE user_id = $1 ORDER BY is_favorite DESC, name ASC",
      [req.user.id]
    );
    res.json(allContacts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// 3. TOGGLE FAVORITE STATUS
router.put("/contacts/favorite/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFavorite = await pool.query(
      "UPDATE contacts SET is_favorite = NOT is_favorite WHERE contact_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    res.json(updateFavorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// 4. DELETE A CONTACT
router.delete("/contacts/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteContact = await pool.query(
      "DELETE FROM contacts WHERE contact_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    res.json("Contact was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;