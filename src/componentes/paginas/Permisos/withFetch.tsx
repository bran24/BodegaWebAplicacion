import React from 'react';
import { useApiObtenerPermisosQuery } from '../../../api/apiSlice';
import { PermisosporTipo } from '../../../api/types';

interface WithFetchProps {
    datos: PermisosporTipo[] | undefined;
    load: boolean;
    err: unknown;

}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {


        const { data: permisosData, error: errorPermisos, isLoading: isLoadingPermisos } = useApiObtenerPermisosQuery();


        const isLoading = isLoadingPermisos;

        const error = errorPermisos;

        const datos = permisosData;


        return (
            <Component
                {...props}
                datos={datos}
                load={isLoading}
                err={error}


            />
        );
    };
};

export default withFetch;