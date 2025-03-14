import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Index() {
  const [expenseamount, setexpenseamount] = useState("");
  const [payment_method, setpaymentmethod] = useState("");
  const [payment_app, setpayment_app] = useState("");
  const [customPaymentApp, setCustomPaymentApp] = useState(""); // New state for custom input
  const [discription, setDiscription] = useState("");
  const [message, setmessage] = useState("");
  const [error, seterror] = useState("");
  const [expense, setexpense] = useState([]);
  const [totalAomunt, setTotalamount] = useState([]);

  const uid = useSelector((state)=>state.ids.uid);

  useEffect(() => {
    const fetchexpenses = async () => {
      try {
        console.log("uidf", uid);
        const responses = await axios.get(`/api/fetchexpenses?uid=${uid}`);
        // console.log("fetch expenses",responses.data.allExpenses);
        // console.log("fetch aid ", responses.data.rows)
        setexpense(responses.data.allExpenses || []);
        setTotalamount(responses.data.rows || []);
        console.log(responses.data.rows);
      } catch (error) {
        console.log(error);
      }
    };
    fetchexpenses();
  }, [uid]);

  const handelReset = () => {
    setexpenseamount("");
    setpaymentmethod("");
    setpayment_app("");
    setCustomPaymentApp(""); // Reset custom input
    setDiscription("");
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    try {
      const finalPaymentApp =
        payment_app === "others" ? customPaymentApp : payment_app;
      if (!uid || !expenseamount || !payment_method || !finalPaymentApp) {
        seterror("All fields are required.");
        return;
      }
      console.log(
        expenseamount +
          " " +
          payment_method +
          " " +
          finalPaymentApp +
          " " +
          discription
      );
      const { data } = await axios.post("/api/handle_expenses", {
        uid,
        expenseamount,
        payment_method,
        payment_app,
        customPaymentApp,
        discription,
      });
      setmessage(data.message);
      seterror("");
      handelReset();
    } catch (error) {
      seterror(error.response?.data?.error || "Failed to add expense");
      setmessage("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
  {/* Left Side - Form */}
  <div className="w-1/2 lg:w-1/3 w-full flex items-center justify-center bg-white shadow-lg p-6">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Add Expense
      </h2>

      {/* Success Message */}
      {message && (
        <p className="text-green-700 bg-green-100 text-center font-medium p-2 rounded">
          {message}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-700 bg-red-100 text-center font-medium p-2 rounded">
          {error}
        </p>
      )}

      <form className="space-y-4" onSubmit={handelsubmit}>
        {/* Expense Amount */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Expense Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            value={expenseamount}
            onChange={(e) => setexpenseamount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Mode of Payment */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mode of Payment
          </label>
          <select
            value={payment_method}
            onChange={(e) => {
              setpaymentmethod(e.target.value);
              if (e.target.value !== "online") {
                setpayment_app("N/A");
                setCustomPaymentApp("N/A");
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Choose payment method</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Name of Online Payment */}
        {payment_method === "online" && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name of Online Payment
            </label>
            <select
              value={payment_app}
              onChange={(e) => setpayment_app(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">Choose payment gateway</option>
              <option value="gpay">Gpay</option>
              <option value="phonepe">PhonePe</option>
              <option value="paytm">Paytm</option>
              <option value="applepay">Apple Pay</option>
              <option value="paypal">PayPal</option>
              <option value="others">Others</option>
            </select>
          </div>
        )}

        {/* Custom Input for 'Others' */}
        {payment_app === "others" && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter Payment Method
            </label>
            <input
              type="text"
              value={customPaymentApp}
              onChange={(e) => setCustomPaymentApp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter custom payment method"
              required
            />
          </div>
        )}

        {/* Expense Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter description"
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
            rows="2"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all"
          >
            Save Expense
          </button>
          <button
            type="button"
            onClick={handelReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-all"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Right Side - Expense Table */}
  <div className="w-1/2 lg:w-2/3 w-full overflow-auto bg-white p-6 border-l">
    <h2 className="text-xl font-bold mb-4">Expenses</h2>

    {expense.length === 0 ? (
      <p className="text-gray-500">No expenses found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Expense Amount</th>
              <th className="border p-2">Left Amount</th>
              <th className="border p-2">Mode of Payment</th>
              <th className="border p-2">Online Payment Name</th>
              <th className="border p-2">Other Payment Method</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expense.map((item, itemIndex) =>
              item.expenses.map((exp, index) => (
                <tr key={`${itemIndex}-${index}`} className="border text-nowrap">
                  <td className="p-2 border text-green-800">
                    {totalAomunt[itemIndex]?.totalamount}
                  </td>
                  <td className="p-2 border text-red-800">₹{exp.eamount}</td>
                  <td className="p-2 border">₹{exp.left_amount}</td>
                  <td className="p-2 border">{exp.modeOfPayment}</td>
                  <td className="p-2 border">{exp.online_payment_Name}</td>
                  <td className="p-2 border">{exp.eother}</td>
                  <td className="p-2 border">{exp.ediscription}</td>
                  <td className="p-2 border">{exp.edate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

  );
}

export default Index;
