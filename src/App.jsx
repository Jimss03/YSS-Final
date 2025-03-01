import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import { CartProvider } from './Layout/CartContext';  // Import CartProvider
import Home from './User-YSS/Home';
import About from './User-YSS/About';
import Shop from './User-YSS/Shop';
import NavBar from './Layout/NavbarLayout';
import Lookbook from './User-YSS/Lookbook';
import Contact from './User-YSS/Contact';
import FAQ from './User-YSS/FAQ';
import UserSignIn from './User-YSS/UserSignIn';
import AdminLogin from './Admin-YSS/AdminLogin';
import AdminDashboard from './Admin-YSS/AdminDashboard';
import AdminShop from './Admin-YSS/AdminShop';
import AdminLookbook from './Admin-YSS/AdminLookbook';
import AdminOrderManagement from './Admin-YSS/AdminOrderManagement';
import AdminNavbar from './Admin-YSS/Admin-Layout/AdminNavbar';
import { useState, useEffect } from 'react';
import UserSIgnup from './User-YSS/UserSIgnup';

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
          <Route path="UserSignIn" element={<UserSignIn />} />
          <Route path="UserSignUp" element={<UserSIgnup />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin logInHandler={logInHandler} />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admindashboard" element={isLoggedIn ? <AdminNavbar logOutHandler={logOutHandler} /> : <Navigate to="/admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="adminshop" element={<AdminShop />} />
          <Route path="adminlookbook" element={<AdminLookbook />} />
          <Route path="adminordermanagement" element={<AdminOrderManagement />} />
        </Route>

        {/* Catch-all route for non-existent paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </>
    )
  );

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;
