// src/components/layout/Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login", { replace: true });
  };

  const dashboardPath =
    user?.role === "owner" ? "/owner" : "/student";

  const linkClass =
    "text-gray-700 font-medium hover:text-blue-600 transition-colors";

  const buttonClass =
    "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors";

  const renderAuthLinks = (mobile = false) => {
    const mobileClick = mobile ? closeMenu : undefined;

    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            onClick={mobileClick}
            className={linkClass}
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={mobileClick}
            className={buttonClass}
          >
            Sign Up
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          to={dashboardPath}
          onClick={mobileClick}
          className={linkClass}
        >
          Dashboard
        </Link>

        <Link
          to="/profile"
          onClick={mobileClick}
          className={linkClass}
        >
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition-colors hover:bg-red-700"
        >
          Log Out
        </button>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600"
            onClick={closeMenu}
          >
            StayMatch AI
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link to="/" className={linkClass}>
              Home
            </Link>

            <Link to="/browse" className={linkClass}>
              Browse PGs
            </Link>

            <Link to="/#features" className={linkClass}>
              Features
            </Link>

            <Link to="/#about" className={linkClass}>
              About
            </Link>
          </div>

          {/* Desktop authentication links */}
          <div className="hidden items-center space-x-4 md:flex">
            {renderAuthLinks()}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="text-2xl text-gray-700 focus:outline-none md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col space-y-4 pt-3">
            <Link
              to="/"
              onClick={closeMenu}
              className={linkClass}
            >
              Home
            </Link>

            <Link
              to="/browse"
              onClick={closeMenu}
              className={linkClass}
            >
              Browse PGs
            </Link>

            <Link
              to="/#features"
              onClick={closeMenu}
              className={linkClass}
            >
              Features
            </Link>

            <Link
              to="/#about"
              onClick={closeMenu}
              className={linkClass}
            >
              About
            </Link>

            <div className="flex flex-col space-y-3 border-t border-gray-100 pt-4">
              {renderAuthLinks(true)}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;