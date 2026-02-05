import React, { useState } from 'react';
import { useApiObtenerCategoriaQuery, useApiObtenerUnidadQuery, useApiObtenerProveedorQuery, useApiObtenerProductosPaginacionQuery } from '../../../api/apiSlice';
import { Product, Unidad, Categoria, Proveedor } from '../../../api/types';

interface WithFetchProps {
    datos: Product[] | undefined;
    categorias: Categoria[] | undefined;
    unidades: Unidad[] | undefined;
    proveedores: Proveedor[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;
    setQuery: (query: string | undefined) => void;
    query: string | undefined,
    setCategoria: (categoria: number | undefined) => void;
    categoria: number | undefined,
    setProveedor: (proveedor: number | undefined) => void;
    proveedor: number | undefined,
    setFechaVencimiento: (fechaVencimiento: string | undefined) => void;
    fechaVencimiento: string | undefined,
    setOrdenStock: (orden: string | undefined) => void;
    ordenStock: string | undefined;
}

const withFetch = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);
        const { data: categorias, error: errorCategorias, isLoading: isLoadingCategorias } = useApiObtenerCategoriaQuery();
        const { data: unidades, error: errorUnidades, isLoading: isLoadingUnidades } = useApiObtenerUnidadQuery();
        const { data: proveedores, error: errorProveedores, isLoading: isLoadingProveedores } = useApiObtenerProveedorQuery();
        const [query, setQuery] = useState<string | undefined>("");
        const [categoria, setCategoria] = useState<number | undefined>(undefined);
        const [proveedor, setProveedor] = useState<number | undefined>(undefined);
        const [fechaVencimiento, setFechaVencimiento] = useState<string | undefined>(undefined);
        const [ordenStock, setOrdenStock] = useState<string | undefined>(undefined);

        const { data: productosData, error: errorProductos, isLoading: isLoadingProductos } = useApiObtenerProductosPaginacionQuery({
            page,
            limit,
            query,
            categoria,
            proveedor,
            fechaVencimiento,
            ordenStock
        });


        const isLoading = isLoadingProveedores || isLoadingCategorias || isLoadingUnidades || isLoadingProductos;

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
                setQuery={setQuery}
                query={query}
                categoria={categoria}
                setCategoria={setCategoria}
                proveedor={proveedor}
                setProveedor={setProveedor}
                fechaVencimiento={fechaVencimiento}
                setFechaVencimiento={setFechaVencimiento}
                ordenStock={ordenStock}
                setOrdenStock={setOrdenStock}
            />
        );
    };
};

export default withFetch;