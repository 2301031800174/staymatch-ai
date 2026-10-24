import { Routes, Route } from "react-router-dom";

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
import AIDescription from "../pages/AIDescription/AIDescription";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/browse" element={<BrowsePG />} />
      <Route path="/pg/:id" element={<PGDetails />} />

      {/* Student-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/expenses" element={<ExpenseCalculator />} />
      </Route>

      {/* Owner-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/add-pg" element={<AddPG />} />
        <Route path="/edit-pg/:id" element={<AddPG />} />
        <Route path="/ai-description" element={<AIDescription />} />
      </Route>

      {/* Any authenticated user */}
      <Route element={<ProtectedRoute allowedRoles={["student", "owner"]} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;