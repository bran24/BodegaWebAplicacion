import React, { useState } from 'react';
import { useApiObtenerClientePaginacionQuery, useApiObtenerTipoDocQuery } from '../../../api/apiSlice';
import { Cliente } from '../../../api/types';

interface WithFetchProps {
    datos: Cliente[] | undefined;
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

        const { data: clienteData, error: errorCliente, isLoading: isLoadingCliente } = useApiObtenerClientePaginacionQuery({ page: page, limit: limit, query: query });

        const { data: docData, error: errorDoc, isLoading: isLoadingDoc } = useApiObtenerTipoDocQuery();
        const isLoading = isLoadingCliente || isLoadingDoc;

        const error = errorCliente || errorDoc;

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
                setQuery={setQuery}
                query={query}
                tipodocumentos={docData}

            />
        );
    };
};

export default withFetch;