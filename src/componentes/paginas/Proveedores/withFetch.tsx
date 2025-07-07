import React, { useState } from 'react';
import {  useApiObtenerProveedorPaginacionQuery } from '../../../api/apiSlice';
import { Proveedor } from '../../../api/types';

interface WithFetchProps {
    datos:   Proveedor[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);

        const { data: proveedorData, error: errorProveedor, isLoading: isLoadingProveedor } = useApiObtenerProveedorPaginacionQuery({ page, limit });


        const isLoading = isLoadingProveedor ;

        const error = errorProveedor;

        const datos = proveedorData?.proveedores;
        const totalItems = proveedorData?.totalItems || 0;
        const totalPages = proveedorData?.totalPages || 1;
        const currentPage = page;

        return (
            <Component
                {...props}
                datos={datos}
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