import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { settotalamount } from "../Redux/Slice/Amountslice";


function AddWallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const uid =useSelector((state)=>state.ids.uid);
  const amount =useSelector((state)=>state.amount.totalamount);
  const currentBalance= useSelector((state)=>state.amount.fetchamount);
  const lastDepositDate = useSelector((state)=>state.lastdepositdate.lastDepositDate);
  const lastDepositAmount = useSelector((state)=>state.amount.totalamount);



  const [Insertedamount, setInsertedAmount] = useState("");
  // const [currentBalance, setCurrentBalance] = useState(0);
  // const [lastDepositDate, setLastDepositDate] = useState(null);
  // const [lastDepositAmount, setLastDepositAmount] = useState(0);
  const [error, setError] = useState("");
  
  // const uid = localStorage.getItem("uid");
  

  const gotohome=()=>{
    navigate("/Dashboard");
  }

  
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    const enteredAmount = parseFloat(Insertedamount);
    if (enteredAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const lastDeposit = new Date(lastDepositDate);
    const today = new Date();
    const differenceInDays = Math.floor((today - lastDeposit) / (1000 * 60 * 60 * 24));

    if (currentBalance > lastDepositAmount * 0.1 && differenceInDays < 30) {
      setError("You must use at least 90% of your balance or wait for 30 days.");
      return;
    }

    try {
      const { data } = await axios.post("/api/updatelimit", { amount: enteredAmount, uid });
      alert(data.message);
      dispatch(settotalamount(enteredAmount));
      navigate("/Dashboard");
    } catch (err) {
      console.error("Error adding balance:", err.response?.data?.error);
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h5 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Set Monthly Balance
        </h5>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <p className="text-center text-gray-600 mb-2">Last Deposit Balance: ₹{lastDepositAmount}</p>
        {lastDepositDate && (
          <p className="text-center text-gray-500 text-sm mb-2">
            Last Deposit: {new Date(lastDepositDate).toLocaleDateString()}
          </p>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Monthly Limit (₹)</label>
            <input
              type="number"
              min="0"
              value={Insertedamount}
              onChange={(e) => setInsertedAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
          >
            Save Balance
          </button>
          <button
            type="submit"
            onClick={gotohome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
          >
            Home
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWallet;
