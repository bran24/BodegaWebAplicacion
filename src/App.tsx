import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense } from "react";
import { ToastContainer } from 'react-toastify';
import './App.css'
import Loader from "./componentes/atomos/Loader/loader.tsx"
import { lazy } from "react";
import Principal from "./componentes/paginas/Principal/Principal.tsx";
import Dashboard from "./componentes/paginas/Dashboard/Dashboard.tsx";
import PageProductos from "./componentes/paginas/Productos/Productos.tsx";
import Clientes from "./componentes/paginas/Clientes/Clientes.tsx";
import RegistrarVentas from "./componentes/paginas/Ventas/RegistrarVentas.tsx";
import ConsultarVentas from "./componentes/paginas/Ventas/ConsultarVentas.tsx";
import PageProveedor from "./componentes/paginas/Proveedores/Proveedores.tsx";
import 'react-toastify/dist/ReactToastify.css';
import PagePermisos from "./componentes/paginas/Permisos/Permisos.tsx";
import PageRoles from "./componentes/paginas/Roles/Roles.tsx";
import PageUsuarios from "./componentes/paginas/Usuario/Usuarios.tsx";
import ProtectedRoute from "./utils/protectedRoute.tsx";
import ReporteCajaPage from "./componentes/paginas/Reportes/ReporteCaja.tsx";
import ChatIAPage from "./componentes/paginas/ChatbotIA/ChaIA.tsx";
import EstadoPago from "./componentes/paginas/Ventas/EstadoPago.tsx";
const LazyLogin = lazy(
  () => import("./componentes/paginas/login")
);

const LazyRegUsuario = lazy(
  () => import("./componentes/paginas/Usuario/RegistrarUsuario.tsx")
);



function App() {

  return (

    <Suspense fallback={
      (
        <Loader />)
    }>
      <BrowserRouter>

        <Routes>
          <Route path="*" element={<h1>No Encontrado</h1>} />
          <Route path="/" element={<LazyLogin />}>  </Route>
          <Route path="/unauthorized" element={<h1>No Tiene Autorizacion</h1>} />
          <Route path ="/payment-status" element={<EstadoPago/>} />
          <Route path="/registrarUsuario" element={<LazyRegUsuario />} />
          <Route path="/principal/*" element={<Principal />}>
            <Route path="*" element={<h1>No Encontrado</h1>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productos" element={<PageProductos />} />
            <Route path="chatbotIA" element={<ChatIAPage />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="ventas/registrarVentas" element={<RegistrarVentas />} />
            <Route path="ventas/consultarVentas" element={<ConsultarVentas />} />
            <Route path="proveedores" element={<PageProveedor />} />
            <Route path="usuarios/permisos" element={<ProtectedRoute requiredPermisos={[2, 3, 4, 5]} element={<PagePermisos />} />}></Route>
            <Route path="usuarios/roles" element={<ProtectedRoute requiredPermisos={[2, 3, 4, 5]} element={<PageRoles />} />}></Route>
            <Route path="usuarios/usuarios" element={<ProtectedRoute
              element={<PageUsuarios />}
              requiredPermisos={[2, 3, 4, 5]}
            />} />
            <Route path="reportes/caja" element={<ProtectedRoute requiredPermisos={[2, 3, 4, 5]} element={<ReporteCajaPage />} />}></Route>

          </Route>



        </Routes>
        <ToastContainer style={{ zIndex: 999999 }} />
      </BrowserRouter>
    </Suspense>
  )
}

export default App
