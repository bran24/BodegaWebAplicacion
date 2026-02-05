import React, { useState } from 'react';
import { useApiObtenerProveedorPaginacionQuery } from '../../../api/apiSlice';
import { Proveedor } from '../../../api/types';

interface WithFetchProps {
    datos: Proveedor[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
    setQuery: (query: string | undefined) => void;
    query: string | undefined
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);
        const [query, setQuery] = useState<string | undefined>("");

        const { data: proveedorData, error: errorProveedor, isLoading: isLoadingProveedor } = useApiObtenerProveedorPaginacionQuery({ page, limit, query });


        const isLoading = isLoadingProveedor;

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
                query={query}
                setQuery={setQuery}
            />
        );
    };
};

export default withFetch;