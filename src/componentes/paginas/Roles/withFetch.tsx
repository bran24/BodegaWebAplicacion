import React from 'react';
import { useApiObtenerRolesQuery, useApiObtenerPermisosQuery } from '../../../api/apiSlice';
import { Roles, PermisosporTipo } from '../../../api/types';

interface WithFetchProps {
    datos: Roles[] | undefined;
    load: boolean;
    err: unknown;
    dataPermisos: PermisosporTipo[] | undefined;


}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {


        const { data: permisosData, error: errorPermisos, isLoading: isLoadingPermisos } = useApiObtenerPermisosQuery();


        const { data: rolesData, error: errorRoles, isLoading: isLoadingRoles } = useApiObtenerRolesQuery();


        const isLoading = isLoadingRoles || isLoadingPermisos;

        const error = errorRoles || errorPermisos;

        const datos = rolesData;
        const datosPermisos = permisosData;


        return (
            <Component
                {...props}
                datos={datos}
                load={isLoading}
                err={error}
                dataPermisos={datosPermisos}


            />
        );
    };
};

export default withFetch;