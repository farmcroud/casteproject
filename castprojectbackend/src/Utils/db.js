// utils/db.js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Optional: Test the connection to the database
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed - " + err.stack);
    return;
  }
  console.log("Connected to database");
  connection.release(); // Release the connection back to the pool
});

// Export the promise-enabled pool
module.exports = pool.promise(); // Ensure this line exports the promise-based pool
