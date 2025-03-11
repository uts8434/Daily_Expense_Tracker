const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT || 3306, // Important for Railway
  user: process.env.DB_USER, 
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME, 
  waitForConnections: true,
  connectionLimit: 10, // Handles multiple requests better
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release(); // Release connection back to pool
  }
});

module.exports = db;
