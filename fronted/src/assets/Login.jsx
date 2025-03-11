import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [sname, setSname] = useState("");
  const [semail, setSemail] = useState("");
  const [spass, setSpass] = useState("");
  const [scpass, setScpass] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !pass) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const { data } = await axios.post("/api/login", { email, pass });
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("uid", data.uid);
      alert("Login Successfully...!!!!!");

      navigate("/Dashboard");
    } catch (error) {

      setError(error.response?.data?.error || "Something went wrong. Please try again.");
      alert("Please try again Incorrect details ");
    }
  };

  const handelsignup= async(e)=>{
    e.preventDefault();
    setError("");
    if (!sname || !semail || !spass || !scpass) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    if(spass!=scpass){
      setError("Password do not match.");
    }
    

    try {
      const { data } = await axios.post("/api/signup", { sname,  semail,  spass });
      alert("Signup Successful! Please log in.");
      setIsLogin(true);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong. Please try again.");
    }



  }

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen px-4">
      <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md text-white">
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 text-lg font-semibold rounded transition-all duration-300 ${
              isLogin
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "bg-gray-600 text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 ml-4 text-lg font-semibold rounded transition-all duration-300 ${
              !isLogin
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                : "bg-gray-600 text-gray-300 hover:bg-green-500 hover:text-white"
            }`}
            onClick={() => setIsLogin(false)}
          >
            SignUp
          </button>
        </div>

        {error && <p className="text-white text-center mb-4 font-semibold bg-red-900 px-4 py-2 rounded-md">{error}</p>}

        {isLogin ? (
         <form onSubmit={handleLogin} className="space-y-6">
  <div className="relative">
    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-gray-400" />
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-400 text-white"
      placeholder="Email"
    />
  </div>
  <div className="relative">
    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-4 text-gray-400" />
    <input
      type="password"
      value={pass}
      onChange={(e) => setPass(e.target.value)}
      className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-400 text-white"
      placeholder="Password"
    />
  </div>
  
  {/* Forgot Password Link */}
  <div className="text-right">
    <Link to="/forgot-password" className="text-indigo-400 hover:underline">
      Forgot Password?
    </Link>
  </div>

  <button
    type="submit"
    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:scale-105 transform transition-all duration-300"
  >
    Login
  </button>
</form>

        ) : (
          <form className="space-y-6" onSubmit={handelsignup}>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                value={sname}
                onChange={(e) => setSname(e.target.value)}
                className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 text-white"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                value={semail}
                onChange={(e) => setSemail(e.target.value)}
                className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 text-white"
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                value={spass}
                onChange={(e) => setSpass(e.target.value)}
                className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 text-white"
                placeholder="Password"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                value={scpass}
                onChange={(e) => setScpass(e.target.value)}
                className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 text-white"
                placeholder="Confirm Password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md hover:scale-105 transform transition-all duration-300"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
