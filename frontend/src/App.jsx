import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Activate from "./pages/auth/Activate";
import ChangePasswordEmail from "./pages/auth/ChangePasswordEmail";
import ChangePassword from "./pages/auth/ChangePassword";
import UserDashboard from "./pages/auth/UserDashboard";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";

import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";

import ScrollToTop from "./utils/ScrollToTop";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { AddressProvider } from "./context/AddressContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import BuyingPage from "./pages/buying/BuyingPage";
import PurchasesPage from "./pages/PurchasesPage";

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <OrdersProvider>
                <Toaster />
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/activate/:uid/:token" element={<Activate />} />
                  <Route
                    path="/change-password"
                    element={<ChangePasswordEmail />}
                  />
                  <Route
                    path="/change-password/:uid/:token"
                    element={<ChangePassword />}
                  />
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/s" element={<ProductsPage />} />
                  <Route path="/:slug" element={<ProductsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/buying/" element={<BuyingPage />} />
                  <Route path="/my-purchases" element={<PurchasesPage />}/>
                </Routes>
                <Footer />
              </OrdersProvider>
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
