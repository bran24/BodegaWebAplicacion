import React, { useState } from 'react';
import { useApiObtenerTipoComprobanteQuery, useApiObtenerVentasPaginacionQuery } from '../../../api/apiSlice';
import { TipoComprobante, VentaPag } from '../../../api/types';

interface WithFetchProps {
    datos: VentaPag[] | undefined;
    load: boolean;
    tipoComprobanteVentaData: TipoComprobante[] | undefined;
    tiposEstadoVenta: { nombre: string }[];
    err: unknown;
    setPage: (page: number) => void;
    setFechaInicio: (fechaInicio: string | undefined) => void;
    setFechaFin: (fechaFin: string | undefined) => void;
    setEstado: (estado: string | undefined) => void;
    setTipoComprobanteId: (tipo_comprobanteid: number | undefined) => void;
    setSearch: (buscar: string | undefined) => void;
    // Valores de estado pasados como props
    fechaInicio: string | undefined;
    fechaFin: string | undefined;
    estado: string | undefined;
    tipo_comprobanteid: number | undefined;
    search: string | undefined;
}

const withFetch1 = <P,>(Component: React.ComponentType<P & WithFetchProps>) => {
    return (props: P) => {
        const limit = 10;
        const [page, setPage] = useState(1);
        const [fechaInicio, setFechaInicio] = useState<string | undefined>(undefined);
        const [fechaFin, setFechaFin] = useState<string | undefined>(undefined);
        const [estado, setEstado] = useState<string | undefined>(undefined);
        const [tipo_comprobanteid, setTipoComprobanteId] = useState<number | undefined>(undefined);
        const [search, setSearch] = useState<string | undefined>(undefined);
        const { data: ventaData, error: errorVenta, isLoading: isLoadingVenta } = useApiObtenerVentasPaginacionQuery({ page: page, limit: limit, fechaInicio: fechaInicio, fechaFin: fechaFin, estado: estado, tipo_comprobanteid: tipo_comprobanteid, search: search });
        const tiposEstadoVenta = [{ nombre: 'FACTURADO' }, { nombre: 'ANULADO' }, { nombre: 'PENDIENTE' }];
        const { data: tipoComprobanteVentaData, error: errorComprobante, isLoading: isLoadingComprobante } = useApiObtenerTipoComprobanteQuery();
        const isLoading = isLoadingVenta || isLoadingComprobante;

        const error = errorVenta || errorComprobante;
        const datos = ventaData?.ventas;
        const totalItems = ventaData?.totalItems || 0;
        const totalPages = ventaData?.totalPages || 1;
        const currentPage = page;

        return (
            <Component
                {...props}
                datos={datos}
                tipoComprobanteVentaData={tipoComprobanteVentaData}
                tiposEstadoVenta={tiposEstadoVenta}
                totalItemsp={totalItems}
                totalPagesp={totalPages}
                currentPagep={currentPage}
                load={isLoading}
                err={error}
                setPage={setPage}
                setFechaInicio={setFechaInicio}
                setFechaFin={setFechaFin}
                setEstado={setEstado}
                setTipoComprobanteId={setTipoComprobanteId}
                setSearch={setSearch}
                // Pasando los valores
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                estado={estado}
                tipo_comprobanteid={tipo_comprobanteid}
                search={search}
            />
        );
    };
};

export default withFetch1;