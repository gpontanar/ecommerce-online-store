import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { UserProvider } from '../src/context/UserContext';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import UserOrders from './pages/UserOrders';
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: false,
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: false,
    });
  };

  // Eto yung mg Rehydrate user state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch user details');
          }
          return res.json();
        })
        .then((data) => {
          if (data && data._id) {
            setUser({
              id: data._id,
              isAdmin: data.isAdmin,
            });
          } else {
            console.warn('Invalid user data received');
            unsetUser(); // Clear user state if token is invalid
          }
        })
        .catch((err) => {
          console.error('Error fetching user details:', err);
          unsetUser(); // Clear user state on error
        });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Orders />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/user-orders" element={<UserOrders />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;