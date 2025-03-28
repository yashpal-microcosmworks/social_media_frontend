import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth pages/LoginPage";
import HomePage from "./pages/Auth pages/HomePage";
import VerifyAccountPage from "./pages/Auth pages/VerifyAccountPage";
import RegisterPage from "./pages/Auth pages/RegisterPage";
import FriendsPage from "./pages/Auth pages/FriendsPage";
import ProfilePage from "./pages/Auth pages/ProfilePage";
import HeaderLayout from "./components/Layout/HeaderLayout";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyAccountPage />} />

      <Route
        path="/home"
        element={isAuthenticated ? <HeaderLayout /> : <Navigate to="/" />}
      >
        <Route index element={<HomePage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
