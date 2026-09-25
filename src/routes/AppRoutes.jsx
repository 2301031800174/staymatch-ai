// src/routes/AppRoutes.jsx
// This file defines every URL (route) in our application
// and which page component should be shown for each URL.

import { Routes, Route } from "react-router-dom";

// Importing all page components
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import BrowsePG from "../pages/BrowsePG/BrowsePG";
import PGDetails from "../pages/PGDetails/PGDetails";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import OwnerDashboard from "../pages/OwnerDashboard/OwnerDashboard";
import AddPG from "../pages/AddPG/AddPG";
import Saved from "../pages/Saved/Saved";
import Compatibility from "../pages/Compatibility/Compatibility";
import ExpenseCalculator from "../pages/ExpenseCalculator/ExpenseCalculator";
import Profile from "../pages/Profile/Profile";

// New: AI PG Description Generator page
import AIDescription from "../pages/AIDescription/AIDescription";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages - anyone can visit these */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PG browsing pages */}
      <Route path="/browse" element={<BrowsePG />} />
      <Route path="/pg/:id" element={<PGDetails />} />

      {/* Dashboard pages */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/owner" element={<OwnerDashboard />} />

      {/* PG management */}
      <Route path="/add-pg" element={<AddPG />} />

      {/* Student features */}
      <Route path="/saved" element={<Saved />} />
      <Route path="/compatibility" element={<Compatibility />} />
      <Route path="/expenses" element={<ExpenseCalculator />} />

      {/* Profile */}
      <Route path="/profile" element={<Profile />} />

      {/* New: AI PG Description Generator */}
      <Route path="/ai-description" element={<AIDescription />} />
    </Routes>
  );
}

export default AppRoutes;