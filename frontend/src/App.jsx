import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Activate from "./pages/auth/Activate";
import ChangePasswordEmail from "./pages/auth/ChangePasswordEmail";
import ChangePassword from "./pages/auth/ChangePassword";
import ProductsPage from './pages/ProductsPage'

import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import PrivateRoutes from "./utils/PrivateRoutes";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activate/:uid/:token" element={<Activate />} />
            {/* <Route path="/change-password" element={<ChangePasswordEmail />} /> */}
            {/* <Route path="/change-password/:uid/:token" element={<ChangePassword />} /> */}
            <Route path="/s" element={<ProductsPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
