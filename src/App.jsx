import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import Home from './User-YSS/Home';
import About from './User-YSS/About';
import Shop from './User-YSS/Shop';
import NavBar from './Layout/NavbarLayout';
import Lookbook from './User-YSS/Lookbook';
import Contact from './User-YSS/Contact';
import FAQ from './User-YSS/FAQ';
import AdminLogin from './Admin-YSS/AdminLogin';
import AdminDashboard from './Admin-YSS/AdminDashboard';
import AdminShop from './Admin-YSS/AdminShop';
import AdminLookbook from './Admin-YSS/AdminLookbook';
import AdminOrderManagement from './Admin-YSS/AdminOrderManagement';
import AdminNavbar from './Admin-YSS/Admin-Layout/AdminNavbar';
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logInHandler = () => {
    setIsLoggedIn(true);
  };

  const logOutHandler = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* User Path */}
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="lookbook" element={<Lookbook />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin" element={<AdminLogin logInHandler={logInHandler} />} />
        
        {/* Protected Admin Routes */}
        {isLoggedIn ? (
          <Route path="/Admindashboard" element={<AdminNavbar logOutHandler={logOutHandler} />}>
            <Route index element={<AdminDashboard />} /> {/* Ensures dashboard loads first */}
            <Route path="Adminshop" element={<AdminShop />} />
            <Route path="Adminlookbook" element={<AdminLookbook />} />
            <Route path="Adminordermanagement" element={<AdminOrderManagement />} />
          </Route>
        ) : (
          <Route path="/Admindashboard" element={<Navigate to="/admin" />} />
        )}
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
