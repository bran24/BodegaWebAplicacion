import withFetch2 from "./withFetch2";
import { MetodoPago, Product, TipoComprobante, Venta } from '../../../api/types';
import React, { useEffect, useState } from 'react';
import { FaBox, GoAlertFill, MdDelete, MdEdit, MdPaid, MdEmail, MdOutlineLocalPhone } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import { FaCalendar } from 'react-icons/fa6';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Dropdown from '../../atomos/formInputs/dropdown';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiRegistrarVentaMutation, useApiActualizarEstadoVentaMutation } from '../../../api/apiSlice';



interface RegistrarVentas {

    productos: Product[] | undefined;
    load: boolean;
    err: unknown;
    metodoPagos: MetodoPago[]
    tipoComprobantes: TipoComprobante[]
    totalItemsp: number,
    totalPagesp: number,
    currentPagep: number,
    setPage: (pag: number) => void

}


const RegistrarVentasPag: React.FC<RegistrarVentas> = ({ productos, load, err, metodoPagos, tipoComprobantes, totalItemsp, totalPagesp, currentPagep, setPage }) => {

    interface VentasTypes {

        observacion: string;
        tipo_comprobante: number;
        metodo_pago: number;
        cliente: number;
        usuario: number;
        detalleVentas: DetalleVentaType[];
        pagos: PagoType;
        facturar: boolean




    }



    interface DetalleVentaType {
        productoid: number,
        cantidad: number,
        precio_unitario: number,
        subtotal: number

    }


    interface PagoType {
        metodoPagoid: number,
        monto: number,
        observacion: string,
        vuelto: number

    }


    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [ApiRegistrarVenta] = useApiRegistrarVentaMutation()

    const [ApiActEstado] = useApiActualizarEstadoVentaMutation()
    const [isLoadModal] = useState(false);
    const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false)
    const [isLoadConfirmationModal] = useState(false);

    const { register, clearErrors, handleSubmit, setValue, reset, formState: { errors } } = useForm<VentasTypes>()



    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>



    );




    return (
        <>
            <div className="w-full max-w-full mx-auto bg-white shadow-lg  rounded-sm border p-6">
                <h2 className="text-2xl font-bold mb-6">Registrar Venta</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="flex flex-row items-end gap-2 w-full">
    
    {/* Input de búsqueda */}
    <div className="flex flex-col w-2/3">
        <label className="text-sm font-medium">Buscar cliente (DNI o nombre)</label>
        <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="74211344 / Brandon"
        />
        {/* Lista de resultados */}
        <div className="border rounded mt-1 bg-white shadow text-sm">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Brandon (74211344)</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Cliente Genérico (00000000)</div>
        </div>
    </div>

    {/* Botón para crear cliente */}
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Nuevo Cliente
    </button>
</div>

             

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Fecha de Venta</label>
                        <input type="date" className="border rounded p-2" defaultValue="2025-01-10" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Tipo de Comprobante</label>
                        <select className="border rounded p-2">
                            <option>Factura</option>
                            <option>Boleta</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Usuario</label>
                        <input disabled className="border rounded p-2 bg-gray-100" defaultValue="prueba" />
                    </div>
                    <div className="Flex Flex-row gap-1 ">

                        <label className="px-1" htmlFor="">Facturar</label>

                        <input className="" type="checkbox"></input>
                        
                        
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                        <label className="font-semibold">Observación</label>
                        <textarea className="border rounded p-2" rows={2} defaultValue="Venta rápida sin incidencias" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-3">Productos</h3>

                <div className="flex flex-col gap-2 mb-4">



                    <div className="w-40">
                        
                        <button className="px-2 py-1  bg-blue-600 text-white rounded hover:bg-blue-700">
                        Buscar Producto
                    </button></div>
                        


                    
              <div className="flex flex-row gap-2 items-center">

                    <div className="text-sm font-semibold">Producto:</div>
                        <div className="text-sm ">Leche</div>

                         <div className="text-sm font-semibold">Precio:</div>
                        <div className="text-sm ">10</div>


                          <div className="text-sm font-semibold">Cantidad:</div>
                        <div className="text-sm ">10</div>
            
                



                       <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Agregar Producto
                    </button>

    </div>

                    </div>


                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Producto</th>
                                <th className="p-2 border">Cantidad</th>
                                <th className="p-2 border">Precio</th>
                                <th className="p-2 border">Subtotal</th>
                                <th className="p-2 border">IGV</th>
                                <th className="p-2 border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border">Arroz</td>
                                <td className="p-2 border">2</td>
                                <td className="p-2 border">50.00</td>
                                <td className="p-2 border">100.00</td>
                                <td className="p-2 border">18.00</td>
                                <td className="p-2 border font-semibold">118.00</td>
                            </tr>
                            <tr>
                                <td className="p-2 border">Azúcar</td>
                                <td className="p-2 border">1</td>
                                <td className="p-2 border">50.00</td>
                                <td className="p-2 border">50.00</td>
                                <td className="p-2 border">9.00</td>
                                <td className="p-2 border font-semibold">59.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-3">Pago</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Método de Pago</label>
                        <select className="border rounded p-2">
                            <option>Efectivo</option>
                            <option>Yape</option>
                            <option>Tarjeta</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Monto</label>
                        <input type="number" className="border rounded p-2" defaultValue="177.00" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                        <label className="font-semibold">Observación Pago</label>
                        <input className="border rounded p-2" defaultValue="Pago completo" />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <div className="text-left">
                          <div className="text-sm font-semibold">Vuelto:</div>
                            <div className="text-lg font-bold text-green-600">S/10</div>
                        <div className="text-sm font-semibold">Igv:</div>
                            <div className="text-lg font-bold text-green-600">S/0</div>
                         <div className="text-sm font-semibold">SubTotal:</div>
                            <div className="text-lg font-bold text-green-600">S/ 100.00</div>
                        <div className="text-lg font-semibold">Total Venta:</div>
                        <div className="text-2xl font-bold text-green-600">S/ 177.00</div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Guardar Venta
                    </button>
                </div>
            </div>

        </>


    )
}



const PageRegVentas = withFetch2(RegistrarVentasPag);


export default PageRegVentas;