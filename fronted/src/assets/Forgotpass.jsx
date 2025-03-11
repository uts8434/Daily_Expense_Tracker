import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Forgotpass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Verify email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-email", { email });
      if (response.data.success) {
        setEmailVerified(true);
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  const hadelcancel=()=>{
    navigate("/")
  }

  // Step 2: Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/update-password", { email, newPassword });
      if (response.data.success) {
        setMessage(response.data.message);
        navigate("/");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>

      {!emailVerified ? (
        <form onSubmit={handleVerifyEmail} className="space-y-4 bg-gray-800 p-6 rounded-md shadow-lg w-80">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your email"
            required
          />
          
          <div className="flex gap-4">
          <button type="submit" className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md transition-all">
            Verify Email
          </button>
          <button type="submit" onClick={hadelcancel} className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md transition-all">
            Cancel
          </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-4 bg-gray-800 p-6 rounded-md shadow-lg w-80">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter new password"
            required
          />

          <div className="flex gap-4">
          <button type="submit" className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md transition-all">
            Update Password
          </button>
          <button type="submit" onClick={hadelcancel} className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md transition-all">
            Cancel
          </button>

          </div>
        </form>
      )}

      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
    </div>
  );
}

export default Forgotpass;
