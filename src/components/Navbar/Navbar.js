import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const profile = localStorage.getItem("profile");
  const userType =  useSelector((state) => state.auth.userType);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-xl relative">
      {/* Logo */}
      <a
        href={`/${userType}`}
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        FindCreators
      </a>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div
        className={`flex justify-center ${
          isOpen ? "block" : "hidden"
        } md:hidden absolute bg-white w-full left-0 top-full shadow-lg`}
      >
        <div>
          <div
            onClick={toggleMenu}
            className="flex items-center gap-1 cursor-pointer p-4 md:p-0"
          >
            <span className="text-gray-600">Solutions</span>
            <ChevronDown size={16} className="text-gray-600" />
          </div>

          <div
            onClick={toggleMenu}
            className="flex items-center gap-1 cursor-pointer p-4 md:p-0"
          >
            <span className="text-gray-600">Resources</span>
            <ChevronDown size={16} className="text-gray-600" />
          </div>

          <div
            onClick={toggleMenu}
            className="text-gray-600 cursor-pointer p-4 md:p-0"
          >
            Pricing
          </div>
          <div
            onClick={toggleMenu}
            className="text-gray-600 cursor-pointer p-4 md:p-0"
          >
            About
          </div>

          {/* Auth Buttons */}
          {!profile && (
            <div className="flex justify-center items-center gap-4 p-4 md:p-0">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="text-blue-600 hover:text-blue-700"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
          {profile && (
            <div className="py-4 md:p-0">
              <Link
                to="/home"
                onClick={() => {
                  toggleMenu();
                  localStorage.clear();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation Items */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex items-center gap-1 cursor-pointer">
          <span className="text-gray-600">Solutions</span>
          <ChevronDown size={16} className="text-gray-600" />
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <span className="text-gray-600">Resources</span>
          <ChevronDown size={16} className="text-gray-600" />
        </div>

        <span className="text-gray-600 cursor-pointer">Pricing</span>
        <span className="text-gray-600 cursor-pointer">About</span>
      </div>

      {/* Desktop Auth Buttons */}
      {!profile && (
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      )}
      {profile && (
        <Link
          to="/home"
          onClick={() => {
            toggleMenu();
            localStorage.clear();
          }}
          className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Log out
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
