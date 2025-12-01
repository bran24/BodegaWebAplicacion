import React, { useState } from 'react';
import {  useApiObtenerVentasPaginacionQuery } from '../../../api/apiSlice';
import { VentaPag } from '../../../api/types';

interface WithFetchProps {
    datos:  VentaPag [] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
}

const withFetch1 = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);

        const { data: ventaData, error: errorVenta, isLoading: isLoadingVenta } = useApiObtenerVentasPaginacionQuery({ page, limit });


        const isLoading = isLoadingVenta ;

        const error = errorVenta;

        const datos = ventaData?.ventas;
        const totalItems = ventaData?.totalItems || 0;
        const totalPages = ventaData?.totalPages || 1;
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

export default withFetch1;