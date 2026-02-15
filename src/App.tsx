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
import ChatIAPage from "./componentes/paginas/AsistenteIA/ChaIA.tsx";
import EstadoPago from "./componentes/paginas/Ventas/EstadoPago.tsx";
const LazyLogin = lazy(
  () => import("./componentes/paginas/login")
);


// principal

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
          <Route path="/payment-status" element={<EstadoPago />} />
          <Route path="/principal/*" element={<Principal />}>
            <Route path="*" element={<h1>No Encontrado</h1>} />
            <Route path="dashboard" element={<ProtectedRoute requiredPermisos={['DASHBOARD_VER']} element={<Dashboard />} />} />
            <Route path="productos" element={<ProtectedRoute requiredPermisos={['PRODUCTOS_VER']} element={<PageProductos />} />} />
            <Route path="chatIA" element={<ProtectedRoute requiredPermisos={['ASISTENTE_VER']} element={<ChatIAPage />} />} />
            <Route path="clientes" element={<ProtectedRoute requiredPermisos={['CLIENTES_VER']} element={<Clientes />} />} />
            <Route path="ventas/registrarVentas" element={<ProtectedRoute requiredPermisos={['VENTAS_CREAR']} element={<RegistrarVentas />} />} />
            <Route path="ventas/consultarVentas" element={<ProtectedRoute requiredPermisos={['VENTAS_VER']} element={<ConsultarVentas />} />} />
            <Route path="proveedores" element={<ProtectedRoute requiredPermisos={['PROVEEDORES_VER']} element={<PageProveedor />} />} />
            <Route path="usuarios/permisos" element={<ProtectedRoute requiredPermisos={['PERMISOS_VER']} element={<PagePermisos />} />}></Route>
            <Route path="usuarios/roles" element={<ProtectedRoute requiredPermisos={['ROLES_VER']} element={<PageRoles />} />}></Route>
            <Route path="usuarios/usuarios" element={<ProtectedRoute
              element={<PageUsuarios />}
              requiredPermisos={['USUARIOS_VER']}
            />} />
            <Route path="reportes/caja" element={<ProtectedRoute requiredPermisos={['REPORTES_VER']} element={<ReporteCajaPage />} />}></Route>

          </Route>



        </Routes>
        <ToastContainer style={{ zIndex: 999999 }} />
      </BrowserRouter>
    </Suspense>
  )
}

export default App
