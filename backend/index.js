require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const loginRoutes = require("./Functionality/login");
const signupRoutes = require("./Functionality/signup");
const addbalance=require("./Functionality/addbalance");
const handle_expenses=require("./Functionality/handle_expenses");




app.use(cors());
app.use(express.json()); // ✅ Ensure JSON parsing
app.use(express.urlencoded({ extended: true }));

app.use("/api", loginRoutes);
app.use("/api", signupRoutes);
app.use("/api",addbalance);
app.use("/api",handle_expenses);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
