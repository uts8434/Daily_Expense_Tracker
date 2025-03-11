import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  const [fetch_amount, setfetchamount] = useState(0);
  const [isLogin, setIsLogin] = useState("false");
  // const amount = useSelector((state) => state.wallet.amount); // Get amount from Redux
  const uid = localStorage.getItem("uid");
  const [totalamount, settotalamount] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
  const handleNavClick = () => {
    setIsOpen(false);
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
    <div className="bg-green-900 px-6 md:px-16 py-4 flex justify-between items-center">
      <div className="w-full flex items-center justify-between px-6 py-3 text-white">
        {/* Left Side - Navigation */}
        {token && (
          <div className="flex items-center gap-8">
            <ul className="flex gap-4 font-semibold text-lg">
              <li>
                <Link to="/dashboard" className="cursor-pointer">
                  Expense Tracker
                </Link>
              </li>
            </ul>
            {/* Only visible on medium screens and above */}
            <ul className="hidden md:flex gap-4 font-semibold text-lg">
              <li>
                <Link to="/dashboard/expense" className="text-gray-300">
                  Analyser
                </Link>
              </li>
            </ul>
          </div>
        )}
        {!token && (
        <div className="flex items-center gap-8">
          <ul className="flex gap-4 font-semibold text-lg">
            <li>
              <h3 className="cursor-pointer">Expense Tracker</h3>
            </li>
          </ul>
        </div>
        )}

        {/* Mobile Menu Button */}
        {token && (
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* Right Side - User Info & Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* User Info */}
          <nav className="flex items-center gap-4 bg-green-700 px-4 py-1  rounded-lg shadow-md">
            <div className="flex items-center  text-center justify-center w-8 h-8 bg-green-900 rounded-full">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-300 text-xl"
              />
            </div>
            <p className="text-gray-100 font-medium text-lg">
              {name || "Guest"}
            </p>
          </nav>

          {/* Wallet Button */}
          {token && (
            <nav>
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded flex items-center gap-2 shadow-md"
                >
                  <FontAwesomeIcon icon={faWallet} /> Your Wallet
                </button>
              </form>
            </nav>
          )}

          {/* Current Amount */}
          {token && (
            <nav>
              <div
                className={`font-bold ${
                  fetch_amount >= totalamount * 0.6
                    ? "text-green-500"
                    : fetch_amount >= totalamount * 0.3
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                💰 Current Amount: ₹{fetch_amount}
              </div>
            </nav>
          )}

          {/* Low Balance Warning */}
          {token && showAlert && (
            <nav>
              <div className="p-2 text-white bg-red-500 rounded-md animate-pulse">
                ⚠️ Warning: Your balance is running low!
              </div>
            </nav>
          )}

          {/* Logout Button */}
          {token && (
            <nav>
              <button
                className="bg-red-500 text-white font-medium py-2 px-5 rounded-lg shadow-lg hover:bg-red-900 transition-all duration-300 hover:scale-105"
                onClick={handleLogout}
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-10 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-green-900 p-6 flex flex-col gap-5 text-white shadow-2xl z-[9999] md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-300 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
        {token && (
          <>
            {/* Profile Section */}
            <nav className="flex items-center gap-3 border-b border-gray-600 pb-3">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-300 text-2xl"
              />
              <p className="text-gray-100 font-medium text-lg">
                {name || "Gujnest"}
              </p>
            </nav>
          </>
        )}

        {/* Current Amount & Alert */}
        {token && (
          <nav className="w-full bg-gray-800 text-white py-4 text-center rounded-md shadow-lg">
            <div
              className={`font-bold text-lg ${
                fetch_amount >= totalamount * 0.6
                  ? "text-green-400"
                  : fetch_amount >= totalamount * 0.3
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              💰 Current Amount: ₹{fetch_amount}
            </div>

            {showAlert && (
              <div className="mt-3 w-full p-3 bg-red-500 text-white rounded-md shadow-md">
                ⚠️ Warning: Your balance is running low!
              </div>
            )}
          </nav>
        )}

        {/* Wallet Button */}
        {token && (
          <nav className="w-full">
            <form onSubmit={handleSubmit} className="w-full">
              <button
                onClick={() => setIsOpen(false)}
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 rounded-lg flex justify-center items-center gap-2 shadow-md"
              >
                <FontAwesomeIcon icon={faWallet} /> Your Wallet
              </button>
            </form>
          </nav>
        )}

        {/* Navigation Links */}
        <nav className="flex flex-col items-center text-lg font-semibold">
          {token && (
            <ul className="w-full flex flex-col gap-4 text-center">
              <li className="py-2 w-full bg-gray-700 rounded-md hover:bg-gray-600">
                <Link
                  to="/dashboard/expense"
                  className="block p-3"
                  onClick={() => setIsOpen(false)}
                >
                  📊 Analyser
                </Link>
              </li>
            </ul>
          )}
        </nav>

        {/* Logout Button */}
        {token && (
          <nav className="flex justify-center">
            <button
              className="bg-red-500 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:bg-red-700"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              🚪 Logout
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Header;
