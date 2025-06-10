import React from "react";
import type { ReactElement } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

// Updated type here:
function PrivateRoute({ element }: { element: ReactElement }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <nav className="flex gap-8 items-center px-8 py-4 bg-white shadow-md">
        <Link to="/login" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">Login</Link>
        <Link to="/signup" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">Signup</Link>
        <Link to="/profile" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">Profile</Link>
      </nav>
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/profile"
              element={<PrivateRoute element={<Profile />} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}