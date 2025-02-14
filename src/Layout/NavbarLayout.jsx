import { Outlet, NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import Footer from './FooterLayout';

function NavBar() {
  const location = useLocation(); // Hook to track the current location

  // Check if the current location is either /about, /contact, or /FAQ
  const isAboutActive = location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/FAQ';

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-20">
        <nav className="container mx-auto flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <img
                src="src/assets/YSS LOGO PNG 2.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive
                    ? 'text-gray-700 border-b-2 border-gray-700'
                    : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/Shop"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive
                    ? 'text-gray-700 border-b-2 border-gray-700'
                    : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              SHOP
            </NavLink>

            {/* About Us with Dropdown */}
            <div className="relative group">
              <NavLink
                to="/about"
                className={`nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isAboutActive
                    ? 'text-gray-700 border-b-2 border-gray-700'
                    : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`}
              >
               ABOUT US
              </NavLink>

              {/* Dropdown Menu */}
              <ul className="absolute left-0 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto font-cousine bg-[#FAFAFA]">
                <li>
                  <NavLink
                    to="/contact"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/FAQ"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    FAQ
                  </NavLink>
                </li>
              </ul>
            </div>

            <NavLink
              to="/lookbook"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive
                    ? 'text-gray-700 border-b-2 border-gray-700'
                    : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              LOOKBOOK
            </NavLink>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <NavLink to="/cart" className="flex items-center justify-center h-16 px-4">
              <img
                src="/src/assets/shopping-cart-01-svgrepo-com.svg"
                alt="Cart"
                className="h-8 w-8"
              />
            </NavLink>
          </div>
        </nav>
      </header>

      <div className="pt-50">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default NavBar;
