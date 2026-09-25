// src/components/layout/Navbar.jsx

// Importing useState to track whether the mobile menu is open or closed
import { useState } from "react";

// Link is used instead of <a> tags so React Router can handle navigation
// without reloading the whole page
import { Link } from "react-router-dom";

// Icons for the mobile hamburger menu (menu = open, close = close)
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  // This state controls whether the mobile menu is visible or not
  // true = menu open, false = menu closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This function flips the current state (open becomes closed, closed becomes open)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Whenever a nav link is clicked on mobile, we close the menu automatically
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // "sticky top-0" keeps the navbar fixed at the top while scrolling
    // "z-50" makes sure it stays above other page content
    // "shadow-md" gives it a soft shadow, "bg-white" keeps background white
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container to place logo on the left and everything else on the right */}
        <div className="flex items-center justify-between h-16">

          {/* ---------- Logo ---------- */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600"
            onClick={closeMenu}
          >
            StayMatch AI
          </Link>

          {/* ---------- Desktop Nav Links ---------- */}
          {/* "hidden md:flex" means: hidden on mobile, shown as flex from medium screens upward */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Browse PGs
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* ---------- Desktop Right Side Buttons ---------- */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* ---------- Mobile Hamburger Button ---------- */}
          {/* "md:hidden" means: only visible on small (mobile) screens */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Show the "X" icon when menu is open, hamburger icon when closed */}
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* ---------- Mobile Menu ---------- */}
      {/* Only rendered when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <div className="flex flex-col space-y-3 pt-3">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={closeMenu}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Browse PGs
            </Link>
            <Link
              to="//"
              onClick={closeMenu}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Features
            </Link>
            <Link
              to="//"
              onClick={closeMenu}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              About
            </Link>

            {/* Divider line to visually separate nav links from auth buttons */}
            <div className="border-t border-gray-100 pt-3 flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="bg-blue-600 text-white text-center px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;