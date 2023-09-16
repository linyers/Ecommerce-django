import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePasswordEmail from "./pages/auth/ChangePasswordEmail";
import ChangePassword from "./pages/auth/ChangePassword";
import "./App.css";

import Header from './components/navigation/Header'
import PrivateRoutes from './utils/PrivateRoutes'

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoutes>
                  <Home />
                </PrivateRoutes>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/change-password" element={<ChangePasswordEmail />} /> */}
            {/* <Route path="/change-password-confirm" element={<ChangePassword />} /> */}
            <Route />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
