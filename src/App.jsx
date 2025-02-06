import "./styles/bootstrap/bootstrap.min.css";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import PublicRoute from "./components/Route/PublicRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import SearchUser from "./pages/SearchUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={<PublicRoute element={<RegisterPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute element={<LoginPage />} />}
        />
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route
          path="/search"
          element={<ProtectedRoute element={<SearchUser />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
