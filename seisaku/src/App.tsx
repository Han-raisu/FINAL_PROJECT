import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import IngredientsPage from "./pages/IngredientsPage";
import RecipesPage from "./pages/RecipesPage";
import { useUserStore } from "./components/index";
import NewLogin from "./pages/NewLogin";

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/newlogin" element={<NewLogin />} />
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/ingredients"
          element={
            isLoggedIn ? <IngredientsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/recipes"
          element={
            isLoggedIn ? <RecipesPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
