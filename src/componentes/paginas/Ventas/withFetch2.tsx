import React, { useState } from 'react';
import { useApiObtenerMetodoPagoQuery,useApiObtenerProductosPaginacionQuery,useApiObtenerTipoComprobanteQuery } from '../../../api/apiSlice';
import { MetodoPago,TipoComprobante,Product, ProximoNumero } from '../../../api/types';

interface WithFetchProps {

    productos: Product[] | undefined;
    tipoComprobantes: TipoComprobante[] | undefined;
    metodoPagos:MetodoPago[]| undefined;
    load: boolean;
    err: unknown;
    setPage: (page: number) => void;

}

const withFetch2 = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {

        const limit = 10;
        const [page, setPage] = useState(1);
  

        const { data: pagoData, error: errorPago, isLoading: isLoadingPago } = useApiObtenerMetodoPagoQuery();
        const { data: comprobanteData, error: errorComprobante, isLoading: isLoadingComprobante } = useApiObtenerTipoComprobanteQuery();

        
        const { data: productosData, error: errorProductos, isLoading: isLoadingProductos } = useApiObtenerProductosPaginacionQuery({ page, limit });

        const isLoading =  isLoadingPago  || isLoadingComprobante || isLoadingProductos ;

        const error = errorPago || errorComprobante || errorProductos;

        const DataMetodoPagos = pagoData;
        const DataComprobanteData = comprobanteData;

        const datos = productosData?.productos;
        const totalItems = productosData?.totalItems || 0;
        const totalPages = productosData?.totalPages || 1;
        const currentPage = page;
    
        
        return (
            <Component
                {...props}
                productos={datos}
                totalItemsp={totalItems}
                totalPagesp={totalPages}
                currentPagep={currentPage}
                metodoPagos={ DataMetodoPagos }
                tipoComprobantes={ DataComprobanteData }
                load={isLoading}
                err={error}
                setPage={setPage}
            />
        );
    };
};

export default withFetch2;