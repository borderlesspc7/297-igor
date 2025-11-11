import { Routes, Route, BrowserRouter } from "react-router-dom";
import { paths } from "./path";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export default function AppRoutes() {
  const Menu = () => {
    return <h1>Menu</h1>;
  };

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
              <Menu />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
