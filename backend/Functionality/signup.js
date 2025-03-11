const express = require("express");
const router = express.Router();
const db = require("../model/db");

router.post("/signup", async (req, res) => {
    const { sname, semail, spass} = req.body;
    console.log(sname,semail,spass);

    

   

    try {
        const [existingUser] = await db.promise().query("SELECT * FROM users WHERE uemail = ?", [semail]);
        console.log("user"+existingUser);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        await db.promise().query("INSERT INTO users (uname, uemail, pass) VALUES (?, ?, ?)", [
            sname, semail, spass,
        ]);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;  // ✅ Ensure it's exported properly
