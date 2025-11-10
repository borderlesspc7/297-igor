import { Routes, Route, BrowserRouter } from "react-router-dom";
import { paths } from "./path";
import ProtectedRoutes from "./ProtectedRoutes";

export default function AppRoutes() {
  const Home = () => {
    return <h1>Home</h1>;
  };

  const Login = () => {
    return <h1>Login</h1>;
  };

  const Register = () => {
    return <h1>Register</h1>;
  };

  const Menu = () => {
    return <h1>Menu</h1>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Home />} />
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
