import React, { useState } from 'react';
import { useApiObtenerUsuariosPaginacionQuery, useApiObtenerRolesQuery } from '../../../api/apiSlice';
import { Usuario } from '../../../api/types';

interface WithFetchProps {
    datos: Usuario[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);


        const { data: usuariosData, error: errorUsuarios, isLoading: isLoadingUsuarios } = useApiObtenerUsuariosPaginacionQuery({ page, limit });

        const { data: rolesData, error: errorRoles, isLoading: isLoadingRoles } = useApiObtenerRolesQuery()


        const isLoading = isLoadingUsuarios || isLoadingRoles;

        const error = errorUsuarios || errorRoles;

        const datos = usuariosData?.usuarios;
        const totalItems = usuariosData?.totalItems || 0;
        const totalPages = usuariosData?.totalPages || 1;
        const currentPage = page;

        return (
            <Component
                {...props}
                datos={datos}
                datosRoles={rolesData}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                load={isLoading}
                err={error}
                setPage={setPage}

            />
        );
    };
};

export default withFetch;