const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const db = require("../model/db");

// Add Balance
router.post("/addbalance", async (req, res) => {
    const { amount, uid } = req.body;

    console.log("Amount:", amount, "uid:", uid);

    if (!amount || !uid) {
        return res.status(400).json({ error: "Please set amount and uid" });
    }

    try {
        await db.promise().query(
            "INSERT INTO amounts (uid, amount,totalamount) VALUES (?, ?,?)", 
            [uid, amount,amount]
        );
        return res.status(201).json({ message: "Added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to add balance" });
    }
});

router.get("/getamount", async (req, res) => {
    const uid = req.query.uid;
    console.log("Received UID:", uid);

    try {
        const [rows] = await db.promise().query(
            "SELECT amount,totalamount FROM amounts WHERE uid = ? ORDER BY created_at DESC LIMIT 1",
            [uid]
        );

        console.log("Query Result:", rows);

        // If no record is found, return amount as 0 instead of 404
        if (rows.length === 0) {
            console.log("No amount found for UID:", uid);
            return res.status(200).json({ amount: 0 });  // ✅ No error, just amount = 0
        }

        return res.status(200).json({ amount: rows[0].amount,totalamount:rows[0].totalamount });

    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetchexpenses", async (req, res) => {
    try {
        const uid = req.query.uid;
        if (!uid) {
            return res.status(400).json({ error: "UID is required" });
        }

        
        const [rows] = await db.promise().query("SELECT aid,totalamount FROM amounts WHERE uid=?", [uid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No AID found for this UID" });
        }

    
        let allExpenses = [];
        for (const row of rows) {
            const [expenses] = await db.promise().query("SELECT * FROM expenses WHERE aid=?", [row.aid]);
            allExpenses.push({ aid: row.aid, expenses });
        }
        if(allExpenses.length==0){
            return res.status(404).json({ message: "No expenses`  found for this UID", allExpenses: [], rows  });
       
        }

        // Log all expenses in console before sending the response
        console.log("All Expenses Data:", JSON.stringify(allExpenses, null, 2));

        return res.json({ allExpenses,rows });

    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




router.post("/updatelimit", (req, res) => {
    const { amount, uid, modeOfPayment, onlinePaymentName, description } = req.body;

    console.log("Received request:", req.body);

    const getLastDepositQuery = `
        SELECT aid, amount, created_at AS lastDepositDate, totalamount 
        FROM amounts 
        WHERE uid = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    `;

    db.query(getLastDepositQuery, [uid], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        let currentBalance = results.length > 0 ? results[0].amount : 0;
        let lastDepositDate = results.length > 0 ? results[0].lastDepositDate : null;
        let lastDepositAmount = results.length > 0 ? results[0].totalamount : 0;

        let today = new Date();
        let lastDeposit = lastDepositDate ? new Date(lastDepositDate) : null;
        let differenceInDays = lastDeposit ? Math.floor((today - lastDeposit) / (1000 * 60 * 60 * 24)) : 31;
        let minBalanceThreshold = lastDepositAmount * 0.1;

        console.log("Last Deposit Date:", lastDepositDate, "Difference in Days:", differenceInDays);

        if (results.length > 0 && differenceInDays < 30 && currentBalance > minBalanceThreshold) {
            return res.status(400).json({ error: "Cannot add a new balance until 30 days pass or balance falls below 10%" });
        }

        const newTotalAmount = currentBalance + amount;
        console.log("Inserting into amounts:", { uid, newTotalAmount, amount });

        const insertAmountQuery = `
            INSERT INTO amounts (uid, amount, totalamount, created_at) VALUES (?, ?, ?, NOW())
        `;

        db.query(insertAmountQuery, [uid, newTotalAmount, amount], (err, insertResult) => {
            if (err) return res.status(500).json({ error: "Database insert error", details: err });

            const newAid = insertResult.insertId;
            console.log("Inserted Amount ID:", newAid);

            if (!newAid) return res.status(500).json({ error: "Failed to retrieve new aid" });

            const insertExpenseQuery = `
                INSERT INTO expenses (aid, eamount, left_amount, modeOfPayment, online_payment_Name, eother, ediscription, edate)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            console.log("Inserting into expenses:", { newAid, amount, newTotalAmount });

            db.query(insertExpenseQuery, [newAid, 0, newTotalAmount, "N/A", 'N/A', `Added New Balance ${amount}`, 'N/A'], (err) => {
                if (err) {
                    console.error("Expense Insert Error:", err.sqlMessage);
                    return res.status(500).json({ error: "Expense insert error", details: err.sqlMessage });
                }
            
                return res.json({ message: "Balance added successfully and recorded in expenses!" });
            });
            
            
        });
    });
});


router.get("/fetchexpense", async (req, res) => {
    try {
        const uid = req.query.uid;
        // console.log("uidjhb",uid);
        if (!uid) {
            return res.status(400).json({ error: "UID is required" });
        }

        // Fetch total added amount for the user
        const [rows] = await db.promise().query("SELECT aid,totalamount FROM amounts WHERE uid=?", [uid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No amounts found for this UID" });
        }
        // console.log(rows);

        let totalcredited = 0;
        let total_debited = 0;
        let saved_amount=0;
        let allExpenses = [];
        
        for (const row of rows) {
            totalcredited += row.totalamount; // Sum all credited amounts
        
            const [expenses] = await db.promise().query("SELECT eamount,modeOfPayment,ediscription FROM expenses WHERE aid=?", [row.aid]);
            
            let expenseSum = expenses.reduce((sum, expense) => sum + expense.eamount, 0); // Sum all eamount values
            
            total_debited += expenseSum; // Add to total debited amount
        
            allExpenses.push({ aid: row.aid, expenses });
        }
        saved_amount=totalcredited-total_debited;
        
        if (allExpenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for this UID", allExpenses: [], rows });
        }
        
        console.log("Total Credited:", totalcredited);
        console.log("Total Debited:", total_debited);
        console.log("Total saved:", totalcredited-total_debited);
        console.log("All Expenses Data:", JSON.stringify(allExpenses, null, 2));
        
        return res.json({ totalcredited, total_debited, allExpenses });
    


    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});









module.exports = router;
