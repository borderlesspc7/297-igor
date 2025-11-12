import { Routes, Route, BrowserRouter } from "react-router-dom";
import { paths } from "./path";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MenuPage from "../pages/Menu/Menu";
import { Layout } from "../components/Layout/Layout";

export default function AppRoutes() {
  const GestaoDeNumeros = () => {
    return (
      <Layout>
        <h1>Gestão de Números</h1>
      </Layout>
    );
  };

  const GestaoDeUsuarios = () => {
    return (
      <Layout>
        <h1>Gestão de Usuarios</h1>
      </Layout>
    );
  };

  const PlanoDeAquecimento = () => {
    return (
      <Layout>
        <h1>Plano de Aquecimento</h1>
      </Layout>
    );
  };

  const Interacoes = () => {
    return (
      <Layout>
        <h1>Interações</h1>
      </Layout>
    );
  };

  const Grupos = () => {
    return (
      <Layout>
        <h1>grupos</h1>
      </Layout>
    );
  };

  const Relatorios = () => {
    return (
      <Layout>
        <h1>Relatórios</h1>
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Login />} />
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoutes>
              <MenuPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.gestaoDeNumeros}
          element={
            <ProtectedRoutes>
              <GestaoDeNumeros />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.gestaoDeUsuarios}
          element={
            <ProtectedRoutes>
              <GestaoDeUsuarios />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.planoDeAquecimento}
          element={
            <ProtectedRoutes>
              <PlanoDeAquecimento />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.interacoes}
          element={
            <ProtectedRoutes>
              <Interacoes />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.grupos}
          element={
            <ProtectedRoutes>
              <Grupos />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.relatorios}
          element={
            <ProtectedRoutes>
              <Relatorios />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
