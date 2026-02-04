import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;