const express = require("express");
const router = express.Router();
const db = require("../model/db");

router.post("/handle_expenses", async (req, res) => {
    try {
        const { uid, expenseamount, payment_method, payment_app, customPaymentApp, discription } = req.body;

        // Validate required fields
        if (!uid || !expenseamount || !payment_method) {
            return res.status(400).json({ error: "uid, expenseamount, and payment_method are required." });
        }

        // Fetch the latest aid and amount for the given uid
        const [aidRows] = await db.promise().query(
            "SELECT aid, amount FROM amounts WHERE uid = ? ORDER BY created_at DESC LIMIT 1",
            [uid]
        );

        // Check if any record exists
        if (aidRows.length === 0) {
            return res.status(404).json({ error: "No amount record found for this uid." });
        }

        const aid = aidRows[0].aid;
        let amount = parseFloat(aidRows[0].amount);
        const numericExpenseAmount = parseFloat(expenseamount) || 0;
        const leftAmount = amount - numericExpenseAmount;

        // Prevent overspending
        if (leftAmount < 0) {
            return res.status(400).json({ error: "Insufficient balance." });
        }

        console.log(`UID: ${uid}, AID: ${aid}, Expense Amount: ${expenseamount}, Left Amount: ${leftAmount}, Payment Method: ${payment_method}, Payment App: ${payment_app}, Custom Payment App: ${customPaymentApp}, Description: ${discription}`);

        // Insert expense record
        await db.promise().query(
            "INSERT INTO expenses (aid, eamount, left_amount, modeOfPayment, online_payment_Name, eother, ediscription, edate) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [aid, numericExpenseAmount, leftAmount, payment_method, payment_app, customPaymentApp, discription]
        );

        // Update the remaining amount
        await db.promise().query(
            "UPDATE amounts SET amount = ? WHERE aid = ?",
            [leftAmount, aid]
        );

        return res.status(201).json({ message: "Expense added successfully", leftAmount });

    } catch (error) {
        console.error("Error handling expense:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
