import { Routes, Route, BrowserRouter } from "react-router-dom";
import { paths } from "./path";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MenuPage from "../pages/Menu/Menu";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Login />} />
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route
          path={paths.menu}
          element={
            <ProtectedRoutes>
              <MenuPage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
