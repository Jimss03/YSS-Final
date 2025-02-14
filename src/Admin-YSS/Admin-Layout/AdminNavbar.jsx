import React, { useState } from "react"; // Import React and useState
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Menu, ShoppingCart, Image, PackageCheck, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../Database/Firebase";
import Logo from "../admin-assets/admin-logo.png"; // Replace with the actual logo import

function AdminNavbar({ logOutHandler }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logOutHandler(); // Update App.js state
      localStorage.removeItem("isLoggedIn"); // Ensure logout persistence
      navigate("/admin"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-black text-white flex flex-col p-4 space-y-4 transition-all duration-300 flex-shrink-0 ${isExpanded ? "w-72" : "w-20"} fixed top-0 left-0 h-full`}
        style={{
          transition: "width 0.3s ease",
        }}
      >
        {/* Logo Container */}
        <div className="flex justify-center items-center py-4">
          {isExpanded && <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />} {/* Set logo size */}
        </div>

        <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-600"
            >
              <div className="flex justify-center items-center w-10 h-10">
                <Menu className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              {isExpanded && <span className="whitespace-nowrap font-cousine">YOUNG SOUL SEEKERS</span>}
        </button>


        {/* Navigation Links - Center aligned */}
        <nav className="flex flex-col space-y-2 flex-1 font-cousine items-center justify-center">
          {[{ to: "/Admindashboard", icon: LayoutDashboard, label: "DASHBOARD" },
            { to: "Adminshop", icon: ShoppingCart, label: "SHOP" },
            { to: "Adminlookbook", icon: Image, label: "LOOKBOOK" },
            { to: "Adminordermanagement", icon: PackageCheck, label: "ORDER MANAGEMENT" }]
            .map(({ to, icon: Icon, label }, index) => (
              <NavLink
                key={index}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-600 ${
                    isActive ? "bg-gray-500" : ""
                  }`
                }
              >
                <div className="flex justify-center items-center w-10 h-10">
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                {isExpanded && <span className="whitespace-nowrap">{label}</span>}
              </NavLink>
            ))}
        </nav>

        {/* Logout Button (Keep it at the bottom) */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-red-600 w-full"
            >
              <div className="flex justify-center items-center w-10 h-10">
                <LogOut className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              {isExpanded && <span className="whitespace-nowrap">LOG OUT</span>}
            </button>
          </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#FAFAFA] overflow-auto ml-20" style={{ marginLeft: isExpanded ? '18rem' : '5rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminNavbar;
