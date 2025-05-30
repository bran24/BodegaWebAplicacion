import React, { useState } from 'react';
import { useApiObtenerCategoriaQuery, useApiObtenerUnidadQuery, useApiObtenerProductosPaginacionQuery } from '../../../api/apiSlice';
import { Product, Unidad, Categoria } from '../../../api/types';

interface WithFetchProps {
    datos: Product[] | undefined;
    categorias: Categoria[] | undefined;
    unidades: Unidad[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);
        const { data: categorias, error: errorCategorias, isLoading: isLoadingCategorias } = useApiObtenerCategoriaQuery();
        const { data: unidades, error: errorUnidades, isLoading: isLoadingUnidades } = useApiObtenerUnidadQuery();

        const { data: productosData, error: errorProductos, isLoading: isLoadingProductos } = useApiObtenerProductosPaginacionQuery({ page, limit });


        const isLoading = isLoadingProductos || isLoadingCategorias || isLoadingUnidades;

        const error = errorProductos || errorCategorias || errorUnidades;

        const datos = productosData?.productos;
        const totalItems = productosData?.totalItems || 0;
        const totalPages = productosData?.totalPages || 1;
        const currentPage = page;

        return (
            <Component
                {...props}
                datos={datos}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                categorias={categorias}
                unidades={unidades}
                load={isLoading}
                err={error}
                setPage={setPage}

            />
        );
    };
};

export default withFetch;