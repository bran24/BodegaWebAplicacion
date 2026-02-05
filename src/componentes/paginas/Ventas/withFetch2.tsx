import React, { useState } from 'react';
import { useApiObtenerCategoriaQuery, useApiObtenerMetodoPagoQuery, useApiObtenerProductosPaginacionQuery, useApiObtenerTipoComprobanteQuery } from '../../../api/apiSlice';
import { MetodoPago, TipoComprobante, Product, ProximoNumero } from '../../../api/types';

interface WithFetchProps {

    productos: Product[] | undefined;
    tipoComprobantes: TipoComprobante[] | undefined;
    metodoPagos: MetodoPago[] | undefined;
    load: boolean;
    err: unknown;
    tipospago:{ id:number,nombre: string }[]
    setPage: (page: number) => void;

}

const withFetch2 = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {

        const limit = 10;
        const [page, setPage] = useState(1);


        const { data: pagoData, error: errorPago, isLoading: isLoadingPago } = useApiObtenerMetodoPagoQuery();
        const { data: comprobanteData, error: errorComprobante, isLoading: isLoadingComprobante } = useApiObtenerTipoComprobanteQuery();
        const { data: categoriaData, error: errorCategoria, isLoading: isLoadingCategoria } = useApiObtenerCategoriaQuery();

        const { data: productosData, error: errorProductos, isLoading: isLoadingProductos } = useApiObtenerProductosPaginacionQuery({ page, limit });

        const isLoading = isLoadingCategoria || isLoadingPago || isLoadingComprobante || isLoadingProductos;

        const error = errorCategoria || errorPago || errorComprobante || errorProductos;

        const DataMetodoPagos = pagoData;
        const DataComprobanteData = comprobanteData;
        const DataCategoriaData = categoriaData;

        const datos = productosData?.productos;
        const totalItems = productosData?.totalItems || 0;
        const totalPages = productosData?.totalPages || 1;
        const currentPage = page;

        const tipospago= [{"id":1,"nombre":'Efectivo'},{"id":2,"nombre":'Tarjeta/Yape'}]


        return (
            <Component
                {...props}
                productos={datos}
                totalItemsp={totalItems}
                totalPagesp={totalPages}
                currentPagep={currentPage}
                metodoPagos={DataMetodoPagos}
                tipoComprobantes={DataComprobanteData}
                categoriaProductos={DataCategoriaData}
                load={isLoading}
                err={error}
                setPage={setPage}
                tipospago={tipospago}
            />
        );
    };
};

export default withFetch2;