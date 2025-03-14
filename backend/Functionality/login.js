    const jwt = require("jsonwebtoken");
    const express = require("express");
    const router = express.Router();
    const db = require("../model/db");

    router.post("/login", async (req, res) => {
        console.log("📝 Incoming request body:", req.body);
        const { email, pass } = req.body;


        console.log("📩 Processing login for:", email);

        try {
            const [rows] = await db.promise().query("SELECT * FROM users WHERE uemail = ?", [email]);

            if (rows.length === 0) {
                console.log("⚠️ User not found");
                return res.status(400).json({ error: "Invalid email or password" }); // Avoid revealing if email exists
            }

            const user = rows[0];

            if (user.pass !== pass) {
                console.log("❌ Invalid password");
                return res.status(401).json({ error: "Invalid email or password" });
            }
            

            const token = jwt.sign(
                { id: user.id, email: user.uemail },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            console.log("✅ Login successful, sending token...");
            res.status(200).json({ message: "Login successful", token ,name:user.uname,uid:user.uid});

        } catch (error) {
            console.error("❌ Login Error:", error);
            res.status(500).json({ error: "Server error", details: error.message });
        }

    });

    router.post("/verify-email", async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        try {
            // Ensure full match and case-insensitive check
            const [rows] = await db.promise().query("SELECT uemail FROM users WHERE LOWER(uemail) = LOWER(?)", [email]);

            if (rows.length > 0 && rows[0].uemail === email) {
                console.log("ok")
                return res.json({ success: true, message: "Email found" });
            } else {
                console.log("failed")
                return res.json({ success: false, message: "Email not registered" });
            }
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Database error" });
        }
    });



    router.post("/update-password", async (req, res) => {
        const { email, newPassword } = req.body;
        console.log("Received data:", req.body);

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Email and new password are required" });
        }

        try {
            // // Check if user exists before updating
            // const [userCheck] = await db.promise().query(
            //     "SELECT * FROM users WHERE LOWER(uemail) = LOWER(?)",
            //     [email]
            // );
            // console.log("User Check Result:", userCheck);

            // if (userCheck.length === 0) {
            //     return res.status(404).json({ success: false, message: "Email not found" });
            // }

            // Update password
            const [updateResult] = await db.promise().query(
                "UPDATE users SET pass = ? WHERE LOWER(uemail) = LOWER(?)",
                [newPassword, email]
            );

            // console.log("Update Result:", updateResult);

            if (updateResult.affectedRows === 0) {
                return res.json({ success: false, message: "Password update failed. Email may not exist." });
            }

            return res.json({ success: true, message: "Password updated successfully" });

        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: "Database error" });
        }
    });







    module.exports = router;
