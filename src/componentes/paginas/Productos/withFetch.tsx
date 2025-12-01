import React, { useState } from 'react';
import { useApiObtenerCategoriaQuery, useApiObtenerUnidadQuery,useApiObtenerProveedorQuery, useApiObtenerProductosPaginacionQuery } from '../../../api/apiSlice';
import { Product, Unidad, Categoria, Proveedor } from '../../../api/types';

interface WithFetchProps {
    datos: Product[] | undefined;
    categorias: Categoria[] | undefined;
    unidades: Unidad[] | undefined;
    proveedores: Proveedor[]| undefined;
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
         const { data: proveedores, error: errorProveedores, isLoading: isLoadingProveedores } = useApiObtenerProveedorQuery();


        const { data: productosData, error: errorProductos, isLoading: isLoadingProductos } = useApiObtenerProductosPaginacionQuery({ page, limit });


        const isLoading = isLoadingProveedores || isLoadingCategorias || isLoadingUnidades ||isLoadingProductos;

        const error = errorProductos || errorCategorias || errorUnidades || errorProveedores;

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
                proveedores={proveedores}
                load={isLoading}
                err={error}
                setPage={setPage}

            />
        );
    };
};

export default withFetch;