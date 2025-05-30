import { useAppSelector } from "../hook/useAppSelector";
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement; // Cambiado a React.ReactElement
  requiredPermisos: number[]; // Lista de permisos requeridos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredPermisos,
}) => {
  // Verificar si el usuario tiene todos los permisos requeridos
  const userPermisos = useAppSelector((state) => state.user.permisos);

  const hasRequiredPermisos = requiredPermisos.every((permiso) =>
    userPermisos.includes(permiso)
  );

  return hasRequiredPermisos ? element : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;