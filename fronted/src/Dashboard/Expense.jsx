import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const uid = localStorage.getItem("uid"); // Change this to a dynamic user ID

  // Fix state initialization
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  // const [debit, setDebit] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`/api/fetchexpense?uid=${uid}`);
        const data = await response.json();

        // Fix setting state
        setMonthlyIncome(data.totalcredited);
        // setDebit(data.total_debited);

        // Transform data to an array of { category, amount }
        const expenseData = [];
        data.allExpenses.forEach((entry) => {
          entry.expenses.forEach((exp) => {
            if (exp.eamount > 0) {
              expenseData.push({
                category: exp.ediscription, 
                amount: exp.eamount,
                mode: exp.modeOfPayment,
              });
            }
          });
        });

        setExpenses(expenseData);
        setFilteredExpenses(expenseData); // Default to all expenses
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = monthlyIncome - totalExpenses; // Calculate savings

  // Filter expenses based on selection
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === "all") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((exp) => exp.mode === filter));
    }
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#FF4567", "#A020F0"];

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold my-4">Expense Breakdown</h2>
      <div className="mb-6 flex flex-col md:flex-row gap-6 text-lg font-semibold">
        {/* Total Credited Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-2xl shadow-md flex items-center gap-4 w-72">
          <div className="text-4xl bg-yellow-300 text-black p-3 rounded-full">💰</div>
          <div>
            <p className="text-sm uppercase tracking-wide">Total Credited</p>
            <p className="text-2xl font-bold">₹{monthlyIncome}</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-gradient-to-r from-red-500 to-rose-700 text-white p-6 rounded-2xl shadow-md flex items-center gap-4 w-72">
          <div className="text-4xl bg-yellow-300 text-black p-3 rounded-full">📉</div>
          <div>
            <p className="text-sm uppercase tracking-wide">Total Expenses</p>
            <p className="text-2xl font-bold">₹{totalExpenses}</p>
          </div>
        </div>
      </div>



      {/* Filter Buttons */}
      <div className="flex gap-4 my-4">
        <button 
          className={`px-4 py-2 rounded ${selectedFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}`} 
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedFilter === "online" ? "bg-blue-500 text-white" : "bg-gray-300"}`} 
          onClick={() => handleFilterChange("online")}
        >
          Online
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedFilter === "cash" ? "bg-blue-500 text-white" : "bg-gray-300"}`} 
          onClick={() => handleFilterChange("cash")}
        >
          Cash
        </button>
      </div>

      {/* Pie Chart */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredExpenses.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={filteredExpenses}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="amount"
            nameKey="category"
            label
          >
            {filteredExpenses.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend  />  
        </PieChart>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};

export default Expense;
