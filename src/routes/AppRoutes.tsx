import { Routes, Route, BrowserRouter } from "react-router-dom";
import { paths } from "./path";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import { Layout } from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import NumbersManagment from "../pages/NumbersManagment/NumbersManagment";
import ClientsManagement from "../pages/ClientsManagment/ClientsManagment";

export default function AppRoutes() {
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
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.gestaoDeNumeros}
          element={
            <ProtectedRoutes>
              <NumbersManagment />
            </ProtectedRoutes>
          }
        />
        <Route
          path={paths.gestaoDeClientes}
          element={
            <ProtectedRoutes>
              <ClientsManagement />
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
