import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  const [fetch_amount, setfetchamount] = useState(0);
  const [isLogin, setIsLogin] = useState("false");
  // const amount = useSelector((state) => state.wallet.amount); // Get amount from Redux
  const uid = localStorage.getItem("uid");
  const [totalamount, settotalamount] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`/api/getamount?uid=${uid}`);
        console.log("Fetched amount:", response.data.amount);
        setfetchamount(response.data.amount);
        console.log("total amount" + response.data.totalamount);
        settotalamount(response.data.totalamount);
      } catch (error) {
        console.error("Error fetching amount:", error);
        setfetchamount(0); // ✅ Set amount to 0 in case of error
      }
    };
    fetchdata();
  }, [uid]);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (fetch_amount <= totalamount * 0.1) {
      setShowAlert(true);

      // Hide alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer
    } else {
      setShowAlert(false); // Ensure alert disappears immediately if amount increases
    }
  }, [fetch_amount, totalamount]); // Re-run effect when fetch_amount or totalamount changes

  useEffect(() => {
    let storedToken = localStorage.getItem("token");
    let storedName = localStorage.getItem("name");

    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
    }

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const navigate_to_home = () => {
    navigate("/dashboard");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("uid");
    setToken(null);
    setName("");
    alert("Logged out successfully!");
    navigate("/");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/addwallet");
  };

  return (
    <header className="px-10 py-4 flex items-center justify-between bg-green-900 shadow-lg md:justify-between">
      <nav>
        <ul className="flex gap-4 text-white font-semibold text-lg">
          <li>
            <Link to="/dashboard" className="cursor-pointer">
              Expense Tracker
            </Link>
          </li>
          <li>
            <Link to="/dashboard/expense" className="text-gray-300">
              Analyser
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faUser} className="text-gray-300 text-2xl" />
          <p className="text-gray-100 font-medium text-lg">{name || "Guest"}</p>
        </div>

        {token && (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex items-center rounded-lg"
            >
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faWallet} /> {/* Wallet Icon */}
                Your Wallet
              </button>
            </form>

            <div
              className={`font-bold ${
                fetch_amount >= totalamount * 0.6
                  ? "text-green-500" // ✅ Green if remaining amount is 60% or more
                  : fetch_amount >= totalamount * 0.3
                  ? "text-yellow-500" // ✅ Yellow if remaining amount is between 50% - 60%
                  : "text-red-500" // ✅ Red if remaining amount is below 50%
              }`}
            >
              Current Amount: ₹{fetch_amount}
            </div>

            {showAlert && (
              <div className="mt-2 p-2 text-white bg-red-500 rounded-md animate-pulse">
                ⚠️ Warning: Your balance is running low!
              </div>
            )}

            <button
              className="bg-red-500 text-white font-medium py-2 px-5 rounded-lg shadow-lg hover:bg-red-900 transition-all duration-300 hover:scale-105"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
