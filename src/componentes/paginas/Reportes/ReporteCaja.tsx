import React, { useState } from 'react';
import { useApiObtenerReporteIngresosQuery, useApiObtenerMetodoPagoQuery, useLazyApiObtenerReporteIngresosQuery } from '../../../api/apiSlice';
import { FaCalendar, FaArrowLeft, FaArrowRight, FaFilePdf, FaSpinner } from 'react-icons/fa';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { generateReportPDF } from '../../../utils/generateReportPDF';
import { warningAlert, errorAlert } from '../../../utils/alertNotify';

const ReporteCajaPage = () => {
    // Estado para filtros y paginación
    const [page, setPage] = useState(1);

    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');
    const [metodoPago, setMetodoPago] = useState<number | undefined>(undefined);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Obtener métodos de pago para el select
    const { data: metodosPago } = useApiObtenerMetodoPagoQuery();

    // Hook Lazy para exportar TODOS los datos
    const [triggerGetReporteIngresos] = useLazyApiObtenerReporteIngresosQuery();

    // Consultar reporte de ingresos (Vista en tabla paginada)
    const { data: reporteData, isLoading, isError, error } = useApiObtenerReporteIngresosQuery({
        page,
        limit: 10,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        metodoPago: metodoPago
    });

    const handleLimpiarFiltros = () => {
        setFechaInicio('');
        setFechaFin('');
        setMetodoPago(undefined);
        setPage(1);
    };

    const handleGenerarPDF = async () => {
        // Validación inicial visual (si la tabla está vacía, probablemente no hay nada, pero confirmamos con el fetch)
        if (reporteData && reporteData.totalItems === 0) {
            warningAlert('No hay datos para generar el reporte.');
            return;
        }

        try {
            setIsGeneratingPdf(true);

            // Hacemos una petición ESPECÍFICA para el reporte con límite alto
            // para traer TODOS los registros coincidentes
            const fullReportData = await triggerGetReporteIngresos({
                page: 1,
                limit: 2, // Límite alto para "traer todo"
                fechaInicio: fechaInicio || undefined,
                fechaFin: fechaFin || undefined,
                metodoPago: metodoPago,
                all: "true"
            }).unwrap();

            if (fullReportData.ingresos.length === 0) {
                warningAlert('No se encontraron registros para exportar.');
                return;
            }

            const metodoPagoNombre = metodoPago
                ? metodosPago?.find(m => m.id === metodoPago)?.nombre
                : 'Todos';

            // Generamos PDF con la data COMPLETA
            await generateReportPDF(fullReportData.ingresos, {
                fechaInicio,
                fechaFin,
                metodoPagoNombre
            });

        } catch (err) {
            console.error("Error generando reporte", err);
            errorAlert('Ocurrió un error al generar el PDF.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="w-full p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCalendar /> Reporte de Ingresos
            </h1>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex flex-col min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <select
                        value={metodoPago || ''}
                        onChange={(e) => setMetodoPago(e.target.value ? Number(e.target.value) : undefined)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    >
                        <option value="">Todos</option>
                        {metodosPago?.map((mp) => (
                            <option key={mp.id} value={mp.id}>{mp.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-[1px]">
                    <ButtonPrimaryOnclick onClick={handleLimpiarFiltros} title="Limpiar" />
                </div>

                <div className="mb-[1px]">
                    <button
                        onClick={handleGenerarPDF}
                        disabled={isGeneratingPdf}
                        className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 font-medium whitespace-nowrap ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    >
                        {isGeneratingPdf ? (
                            <>
                                <FaSpinner className="animate-spin" /> Generando...
                            </>
                        ) : (
                            <>
                                <FaFilePdf /> Generar PDF
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabla de Resultados */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {isLoading && <div className="p-8 text-center text-gray-500">Cargando reporte...</div>}

                {isError && (
                    <div className="p-8 text-center text-red-500">
                        Error al cargar datos. {(error as any)?.data?.message || 'Intente nuevamente.'}
                    </div>
                )}

                {!isLoading && !isError && reporteData && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="p-4 border-b">N°</th>
                                        <th className="p-4 border-b">Método de Pago</th>
                                        <th className="p-4 border-b">Fecha y Hora</th>
                                        <th className="p-4 border-b text-right">Total Ingreso</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {reporteData.ingresos.length > 0 ? (
                                        reporteData.ingresos.map((ingreso, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 border-b last:border-0 hover:text-black transition-colors">
                                                <td className="p-4">{(page - 1) * 10 + idx + 1}</td>
                                                <td className="p-4">{ingreso.metodoNombre}</td>
                                                <td className="p-4">
                                                    {new Date(ingreso.fecha).toLocaleDateString('es-PE')} {' '}
                                                    <span className="text-gray-500 text-xs">
                                                        {new Date(ingreso.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-medium">S/ {Number(ingreso.total).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                No se encontraron registros en este periodo.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Mostrando página <span className="font-semibold">{page}</span> de <span className="font-semibold">{reporteData.totalPages}</span> (Total: {reporteData.totalItems})
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                                >
                                    <FaArrowLeft />
                                </button>
                                <button
                                    onClick={() => setPage(p => (page < reporteData.totalPages ? p + 1 : p))}
                                    disabled={page >= reporteData.totalPages}
                                    className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ReporteCajaPage;
