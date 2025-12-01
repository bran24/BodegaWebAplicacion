import React, { useState } from 'react';
import {  useApiObtenerClientePaginacionQuery, useApiObtenerTipoDocQuery } from '../../../api/apiSlice';
import { Cliente } from '../../../api/types';

interface WithFetchProps {
    datos:   Cliente[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);

        const { data: clienteData, error: errorCliente, isLoading: isLoadingCliente } = useApiObtenerClientePaginacionQuery({ page, limit });

        const { data: docData, error: errorDoc, isLoading: isLoadingDoc} = useApiObtenerTipoDocQuery();
        const isLoading = isLoadingCliente || isLoadingDoc ;

        const error = errorCliente || errorDoc ;

        const datos = clienteData?.clientes;
        const totalItems = clienteData?.totalItems || 0;
        const totalPages = clienteData?.totalPages || 1;
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
                tipodocumentos={docData}

            />
        );
    };
};

export default withFetch;