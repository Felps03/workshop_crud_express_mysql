const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "example",
  database: "node_mysql_login",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Service is healthy",
    version: process.env.npm_package_version,
  });
});

// Create a new user
app.post("/user", async (req, res) => {
  try {
    const { name: username } = req.body;
    const insertResult = await pool.query(
      "INSERT INTO users (username) VALUES (?)",
      [username]
    );

    const userId = insertResult[0].insertId;

    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    return res.status(200).json(user[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    return res.status(200).send({ users });
  } catch (error) {
    return res.status(500).send({ message: "Error fetching users" });
  }
});

// Update a user by ID
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name: username } = req.body;

    const [result] = await pool.query(
      "UPDATE users SET username = ? WHERE id = ?",
      [username, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    const [updatedUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return res.status(200).send(updatedUser[0]);
  } catch (error) {
    return res.status(500).send({ message: "Error updating user" });
  }
});

// Delete a book by ID
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: "Error deleting user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
