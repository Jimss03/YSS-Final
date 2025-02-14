import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Database/Firebase";

const AdminLogin = ({ logInHandler }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      logInHandler(); // Update login state in App.js
      navigate("/Admindashboard"); // Redirect on successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side with Logo */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <img src="src/assets/Logo.png" alt="YSS Logo" className="h-50 w-auto" />
      </div>

      {/* Divider */}
      <div className="relative flex justify-center items-center">
        <div className="h-5/6 w-px bg-gray-800"></div>
      </div>

      {/* Right Side with Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-3/4 max-w-md">
          <h1 className="text-4xl font-bold mb-4 font-cousine">Welcome back!</h1>
          <p className="text-gray-600 mb-8 font-cousine">Please login to your admin account</p>

          {error && <p className="text-red-500">{error}</p>}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full mt-2 p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full mt-2 p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="stay-signed-in" className="h-4 w-4 text-gray-600 focus:ring-gray-400" />
              <label htmlFor="stay-signed-in" className="ml-2 text-gray-600">
                Stay signed in
              </label>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-black text-white font-medium rounded-lg transition duration-300 hover:bg-white hover:text-black border border-black"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
