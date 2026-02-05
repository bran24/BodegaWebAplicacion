
import { generateInvoicePDF } from '../../../utils/generateInvoicePDF';
import ButtonPrimaryOnclick from "../../atomos/buttons/buttonPrimaryOnclick";
import { FaEye, FaMoneyBill, TiDelete, GoAlertFill } from '../../../assets/icon/icons'
import withFetch1 from "./withFetch1";
import { useApiActualizarEstadoVentaMutation, useApiObtenerVentaMutation, useLazyApiObtenerVentasPaginacionQuery } from '../../../api/apiSlice';
import { TipoComprobante, VentaPag } from "../../../api/types";
import { useState } from "react";
import ModalDosOpciones from "../../../utils/ModalDosOpciones";
import { successAlert, errorAlert, warningAlert } from "../../../utils/alertNotify";
import { generateSalesReportPDF } from '../../../utils/generateSalesReportPDF';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import Loader2 from '../../atomos/Loader/loader2';


interface ConsultarVentasProps {
    datos: VentaPag[] | undefined;
    load: boolean;
    err: unknown;
    setPage: (pag: number) => void
    tipoComprobanteVentaData: TipoComprobante[] | undefined;
    tiposEstadoVenta: { nombre: string }[];
    totalItemsp: number;
    totalPagesp: number;
    currentPagep: number;
    setFechaInicio: (fechaInicio: string | undefined) => void;
    setFechaFin: (fechaFin: string | undefined) => void;
    setEstado: (estado: string | undefined) => void;
    setTipoComprobanteId: (tipo_comprobanteid: number | undefined) => void;
    setSearch: (search: string | undefined) => void;
    // Props de valores
    fechaInicio: string | undefined;
    fechaFin: string | undefined;
    estado: string | undefined;
    tipo_comprobanteid: number | undefined;
    search: string | undefined;
}

type ApiError = {
    status: number;
    data: {
        message: string;
    };
}


const ConsultarVentas = ({ datos, load, err, setPage, tipoComprobanteVentaData, tiposEstadoVenta, totalItemsp, totalPagesp, currentPagep, setFechaInicio, setFechaFin, setEstado, setTipoComprobanteId, setSearch, fechaInicio, fechaFin, estado, tipo_comprobanteid, search }: ConsultarVentasProps) => {


    const [modalConfirmationOpen, setModalConfirmationOpen] = useState(false);
    const [idVenta, setIdVenta] = useState(-1);
    const [idVentaEstado, setIdVentaEstado] = useState('');
    const [isLoadConfirmationModal] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const [datosDetalleVentaSel, setDatosDetalleVentaSel] = useState<any>(undefined);
    const [modalDetalleVentaOpen, setModalDetalleVentaOpen] = useState(false);
    const handleDetalleVentaCloseModal = () => setModalDetalleVentaOpen(false);
    const handleDetalleVentaOpenModal = () => setModalDetalleVentaOpen(true);


    const handleConfirmationOpenModal = () => setModalConfirmationOpen(true);
    const handleConfirmationCloseModal = () => {
        setIdVenta(-1)
        setIdVentaEstado('')
        setModalConfirmationOpen(false)
    };

    const [updateVenta] = useApiActualizarEstadoVentaMutation();
    const [obtenerVenta] = useApiObtenerVentaMutation();
    const [triggerGetVentas] = useLazyApiObtenerVentasPaginacionQuery();

    function handleEstadoChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.target.value === "") {
            setEstado(undefined);
            return;
        }
        setEstado(e.target.value);
    }
    function handleTipoComprobanteChange(e: React.ChangeEvent<HTMLSelectElement>) {

        if (e.target.value === "") {
            setTipoComprobanteId(undefined);
            return;
        }

        setTipoComprobanteId(Number(e.target.value));

    }
    function handleFechaInicialChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === "") {
            setFechaInicio(undefined);
        } else {
            setFechaInicio(value);
        }
    }
    function handleFechaFinalChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        if (value === "") {
            setFechaFin(undefined);
        } else {
            setFechaFin(value);
        }
    }
    function handleBuscarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearch(value);
    }
    async function handleEstadoClick() {

        try {

            const res = await updateVenta({ id: idVenta, estado: idVentaEstado }).unwrap();

            console.log(res)

            successAlert('Venta actualizada correctamente')
            setModalConfirmationOpen(false)

        } catch (error) {
            const apiError = error as ApiError;
            errorAlert(apiError?.data?.message || 'Error al actualizar la venta');

        }

    }

    async function handleGenerarpdf() {
        if (datosDetalleVentaSel) {
            generateInvoicePDF(datosDetalleVentaSel);
        } else {
            warningAlert('No hay datos de venta seleccionados para imprimir');
        }
    }

    async function handleGenerarReportePDF() {
        if (datos && datos.length === 0) {
            warningAlert('No hay ventas para generar el reporte.');
            return;
        }

        try {
            setIsGeneratingPdf(true);
            const fullData = await triggerGetVentas({
                page: 1,
                limit: 10,
                estado: estado,
                tipo_comprobanteid: tipo_comprobanteid,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                search: search,
                all: "true"
            }).unwrap();

            if (fullData.ventas.length === 0) {
                warningAlert('No se encontraron registros para exportar.');
                return;
            }

            const tipoNombre = tipo_comprobanteid
                ? tipoComprobanteVentaData?.find(t => t.id === tipo_comprobanteid)?.nombre
                : undefined;

            await generateSalesReportPDF(fullData.ventas, {
                fechaInicio,
                fechaFin,
                estado,
                tipoComprobante: tipoNombre,
                search
            });

        } catch (error) {
            console.error(error);
            errorAlert('Error al generar el reporte PDF');
        } finally {
            setIsGeneratingPdf(false);
        }
    }


    async function consultarVentaClick(id_venta: number) {
        try {
            const res = await obtenerVenta(id_venta).unwrap();
            setDatosDetalleVentaSel(res?.result)

            handleDetalleVentaOpenModal()

        } catch (error) {
            const apiError = error as ApiError;
            errorAlert(apiError?.data?.message || 'Error al actualizar la venta');

        }

    }




    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>




    );

    return (
        <>

            <div className="w-full max-w-full mx-auto bg-white shadow-lg  rounded-sm border p-6 ">
                <p className="text-4xl">Consultar Ventas</p>
                <div className='flex justify-between items-center mt-3 '>

                    <div className='w-full md:w-2/12' >
                        <label className="text-sm font-semibold text-gray-700">Buscar</label>

                        <input placeholder="Buscar" onChange={handleBuscarChange} value={search || ""} className="border p-2 rounded w-full bg-white" type="text" />

                    </div>

                    <div className="w-full md:w-3/12">
                        <label className="text-sm font-semibold text-gray-700">Estado</label>
                        <select onChange={handleEstadoChange} value={estado || ""} className="border p-2 rounded w-full bg-white">
                            <option value="">Todas</option>
                            {tiposEstadoVenta?.map((estado) => (
                                <option key={estado.nombre} value={estado.nombre}>
                                    {estado.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/6">
                        <label className="text-sm font-semibold text-gray-700">Tipo Comprobante</label>
                        <select onChange={handleTipoComprobanteChange} value={tipo_comprobanteid || ""} className="border p-2 rounded w-full bg-white">
                            <option value="">Todas</option>
                            {tipoComprobanteVentaData?.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/6">
                        <label className="text-sm font-semibold text-gray-700">Fecha Inicial</label>
                        <input type="date" onChange={handleFechaInicialChange} value={fechaInicio || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                    <div className="w-full md:w-1/6">
                        <label className="text-sm font-semibold text-gray-700">Fecha Final</label>
                        <input type="date" onChange={handleFechaFinalChange} value={fechaFin || ""} className="border p-2 rounded w-full bg-white" />
                    </div>

                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerarReportePDF}
                        disabled={isGeneratingPdf}
                        className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 font-medium whitespace-nowrap ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    >
                        {isGeneratingPdf ? (
                            <>
                                <FaSpinner className="animate-spin" /> Generando...
                            </>
                        ) : (
                            <>
                                <FaFilePdf /> Generar Reporte PDF
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-4 max-h-[500px] overflow-y-auto">
                    <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-secundary4 px-4 py-2">Id</th>
                                <th className="border border-secundary4 px-4 py-2">Codigo</th>
                                <th className="border border-secundary4 px-4 py-2">Fecha</th>
                                <th className="border border-secundary4 px-4 py-2">Cliente</th>
                                <th className="border border-secundary4 px-4 py-2">Estado</th>
                                <th className="border border-secundary4 px-4 py-2">Tipo Comprobante</th>
                                <th className="border border-secundary4 px-4 py-2">Total</th>
                                <th className="border border-secundary4 px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos?.map((venta) => (
                                <tr key={venta.id} className="hover:bg-gray-50">
                                    <td className="border border-secundary4 px-4 py-2">{venta.id}</td>
                                    <td className="border border-secundary4 px-4 py-2">{venta.serie + '-' + venta.numero}</td>
                                    <td className="border border-secundary4 px-4 py-2">{
                                        venta.fecha_venta ?
                                            new Date(venta.fecha_venta).toISOString().split('T')[0] : ''}</td>
                                    <td className="border border-secundary4 px-4 py-2">{venta.cliente.nombre}</td>

                                    <td className="border border-secundary4 px-4 py-2">
                                        <span className={venta.estado === "FACTURADO" ? "px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-500" : venta.estado === "PENDIENTE" ? "px-2 py-1 rounded-full text-xs font-semibold text-white bg-yellow-500" : "px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500"}>{venta.estado}</span>

                                    </td>

                                    <td className="border border-secundary4 px-4 py-2">{venta.tipo_comprobante.nombre}</td>
                                    <td className="border border-secundary4 px-4 py-2">{venta.total}</td>
                                    <td className="border border-secundary4 px-4 py-2">
                                        <div className="flex space-x-2 items-center justify-center">
                                            <FaEye title="Ver" className="text-yellow-500 cursor-pointer text-xl" onClick={() => { consultarVentaClick(venta.id) }} />
                                            <FaMoneyBill title="Facturar" className="text-green-500 cursor-pointer text-xl" onClick={() => { setIdVenta(venta.id); setIdVentaEstado('FACTURADO'); handleConfirmationOpenModal() }} />
                                            <TiDelete title="Anular" className="text-red-500 cursor-pointer text-xl" onClick={() => { setIdVenta(venta.id); setIdVentaEstado('ANULADO'); handleConfirmationOpenModal() }} />


                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Control de paginación */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => setPage(1)} // Ir a la primera página
                        disabled={currentPagep === 1}
                        className="px-4 py-2 bg-primary2 text-white rounded hover:bg-primary disabled:bg-gray-400"
                    >
                        Primera
                    </button>



                    <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPagesp }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setPage(index + 1)}
                                className={`px-3 py-1 border rounded ${currentPagep === index + 1
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-primary hover:bg-blue-100'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>


                    <button
                        onClick={() => setPage(totalPagesp)} // Ir a la última página
                        disabled={currentPagep === totalPagesp}
                        className="px-4 py-2 bg-primary2 text-white rounded hover:bg-primary disabled:bg-gray-400"
                    >
                        Última
                    </button>
                </div>


                <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={modalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={handleEstadoClick} >
                    <div className='flex justify-center items-center'>
                        <GoAlertFill className='text-xl text-primary' />
                        <p className='font-medium'>{` ¿Desea cambiar el estado a ${idVentaEstado} de la venta con id ${idVenta}?`}</p>

                    </div>



                </ModalDosOpciones>


                <ModalDosOpciones
                    isLoadSecondOption={false}
                    isOpen={modalDetalleVentaOpen}
                    onClickFirstOption={handleDetalleVentaCloseModal}
                    onClickSecondOption={handleGenerarpdf}
                    titleFirstOption="Cerrar"
                    titleSecondOption="Imprimir PDF"
                >
                    {datosDetalleVentaSel && (
                        <div className='w-full p-2 text-sm'>
                            {/* Cabecera */}
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Venta {datosDetalleVentaSel.serie}-{datosDetalleVentaSel.numero}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${datosDetalleVentaSel.estado === "FACTURADO" ? "bg-green-100 text-green-800" :
                                        datosDetalleVentaSel.estado === "ANULADO" ? "bg-red-100 text-red-800" :
                                            "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {datosDetalleVentaSel.estado}
                                    </span>
                                </div>
                                <div className="text-right text-gray-600">
                                    <p>{new Date(datosDetalleVentaSel.fecha_venta).toLocaleDateString()} {new Date(datosDetalleVentaSel.fecha_venta).toLocaleTimeString()}</p>
                                    <p className="font-semibold">{datosDetalleVentaSel.tipo_comprobante?.nombre}</p>
                                </div>
                            </div>

                            {/* Info General en Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-3 rounded">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Cliente</p>
                                    <p className="font-medium">{datosDetalleVentaSel.cliente?.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Vendedor</p>
                                    <p className="font-medium">{datosDetalleVentaSel.usuario?.username}</p>
                                </div>
                            </div>

                            {/* Tabla de Productos */}
                            <div className="mb-6 overflow-x-auto">
                                <h4 className="font-semibold mb-2 text-gray-700 border-l-4 border-primary pl-2">Productos</h4>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-xs text-gray-600">
                                            <th className="p-2 border-b">Producto</th>
                                            <th className="p-2 border-b text-right">Precio</th>
                                            <th className="p-2 border-b text-center">Cant.</th>
                                            <th className="p-2 border-b text-right">Subtotal</th>
                                            <th className="p-2 border-b text-right">IGV</th>
                                            <th className="p-2 border-b text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        {datosDetalleVentaSel.detalleVentas?.map((item: any, idx: number) => (
                                            <tr key={item.id || idx} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{item.producto?.nombre}</td>
                                                <td className="p-2 text-right">{item.precio_unitario}</td>
                                                <td className="p-2 text-center">{item.cantidad}</td>
                                                <td className="p-2 text-right text-gray-500">{item.subtotal}</td>
                                                <td className="p-2 text-right text-gray-500">{item.igv}</td>
                                                <td className="p-2 text-right font-medium">{item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sección Inferior: Pagos y Totales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Lista de Pagos */}
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-700 border-l-4 border-primary pl-2">Pagos</h4>
                                    <ul className="space-y-1">
                                        {datosDetalleVentaSel.pagos?.map((pago: any, idx: number) => (
                                            <li key={pago.id || idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                                <span>{pago.metodoPago?.nombre}</span>
                                                <span className="font-mono">{pago.monto}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Total General */}
                                <div className="flex flex-col justify-end items-end">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Monto Total</p>
                                        <p className="text-3xl font-bold text-primary">{datosDetalleVentaSel.total}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ModalDosOpciones>



            </div>

        </>


    )
}

const pageConsultarVentas = withFetch1(ConsultarVentas)

export default pageConsultarVentas;