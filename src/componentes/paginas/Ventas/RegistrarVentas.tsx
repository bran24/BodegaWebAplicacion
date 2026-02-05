import withFetch2 from "./withFetch2";
import { Categoria, MetodoPago, Product, TipoComprobante, Venta } from '../../../api/types';
import React, { useEffect, useState } from 'react';
import { FaBox, GoAlertFill, MdDelete, MdEdit, MdPaid, MdEmail, MdOutlineLocalPhone } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import { FaCalendar } from 'react-icons/fa6';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert, warningAlert } from '../../../utils/alertNotify';
import Dropdown from '../../atomos/formInputs/dropdown';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiRegistrarMercadoPagoMutation, useApiRegistrarVentaMutation, useApiObtenerFiltroClientesQuery, useApiRegistrarClienteMutation, useApiObtenerTipoDocQuery, useApiObtenerFiltroProductosQuery } from '../../../api/apiSlice';
import FormularioCliente, { ClienteFormData } from "../../organismos/Formularios/FormularioCliente";
import { useAppSelector } from '../../../hook/useAppSelector';
import SwitchCustom from "../../atomos/checkbox/switchCustom";
import { roundToTwoDecimals } from "../../../utils/documentHelpers";
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { PUBLIC_KEY_MERCADOPAGO } from '../../../config'
import yapeimg from '../../../assets/img/yape-icon.png'

if (PUBLIC_KEY_MERCADOPAGO) {
    initMercadoPago(PUBLIC_KEY_MERCADOPAGO, { locale: 'es-PE' });
}



interface MercadoPagoPaymentData {

    payment_method_id: string;
    token?: string;
    installments?: number;
    payer: {
        email?: string;
        identification?: {
            type: string;
            number: string;
        };
    };
    [key: string]: any; // Para campos adicionales
}



interface MercadoPagoButtonTypes {

    items: Object,
    total: number


}


interface RegistrarVentas {

    productos: Product[] | undefined;
    categoriaProductos: Categoria[] | undefined;
    load: boolean;
    err: unknown;
    metodoPagos: MetodoPago[]
    tipoComprobantes: TipoComprobante[]
    totalItemsp: number,
    totalPagesp: number,
    currentPagep: number,
    setPage: (pag: number) => void,


}


const RegistrarVentasPag: React.FC<RegistrarVentas> = ({ productos, categoriaProductos, load, err, metodoPagos, tipoComprobantes, totalItemsp, totalPagesp, currentPagep, setPage, tipospago }) => {

    interface VentasTypes {

        observacion: string;
        tipo_comprobante: number;
        metodoPago: number;
        cliente: number;
        usuario: number;
        detalleVentas: DetalleVentaResType[];
        facturar: boolean;
        montoPagado: number,
        observacionPago: string,
        vuelto: number

    }

    interface DetalleVentaResType {
        productoid: number,
        cantidad: number,
        precio_unitario: number


    }

    interface DetalleVentaType {
        productoid: number,
        nombre: string,
        sku: string,
        cantidad: number,
        stock: number,
        afecta_igv: boolean,
        precio_unitario: number,
        subtotal: number,
        igv: number,
        total: number

    }



    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    interface YapeTypes {
        yapeNumero: string,
        yapeOtp: string
    }
    const user = useAppSelector((state) => state.user)

    const { register, clearErrors, handleSubmit, setValue, reset, formState: { errors }, watch } = useForm<VentasTypes>()

    const { register: registerYape, handleSubmit: handleSubmitYape, setValue: setValueYape, reset: resetYape, formState: { errors: errorsYape }, watch: watchYape } = useForm<YapeTypes>()
    const [ApiRegistrarVenta] = useApiRegistrarVentaMutation()

    const [ApiRegistrarMercadoPago] = useApiRegistrarMercadoPagoMutation()


    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermProd, setSearchTermProd] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<any>('');
    const [isClienteLocked, setIsClienteLocked] = useState(false);
    const [fechaEstimada, setFechaEstimada] = useState(() => new Date().toLocaleString('es-PE'));
    const [productosVentaExiste, setProductosVentaExiste] = useState(false);

    const [isModalClienteOpen, setModalClienteOpen] = useState(false);
    const [isModalProductoOpen, setModalProductoOpen] = useState(false);

    const [productosVenta, setProductosVenta] = useState<DetalleVentaType[]>([]);
    const [productosVentaSeleccionados, setProductosVentaSeleccionados] = useState<DetalleVentaType[]>([]);
    const [mostrarPago, SetMostrarPago] = useState(false);

    // Hook para registrar cliente
    const [apiRegistrarCliente] = useApiRegistrarClienteMutation();

    // Obtener tipos de documento
    const { data: tipoDocumentos } = useApiObtenerTipoDocQuery();
    const [subtotalf, setSubtotalf] = useState(0);
    const [igvf, setIgvf] = useState(0);
    const [totalf, setTotalf] = useState(0);
    const [vueltof, setVueltof] = useState(0);
    const {
        register: registerCliente,
        handleSubmit: handleSubmitCliente,
        reset: resetCliente,
        setValue: setValueCliente,
        formState: { errors: errorsCliente },
        watch: watchCliente
    } = useForm<ClienteFormData>();

    const [dataVentaEnvio, setdataVentaEnvio] = useState({})

    const [emailcliente, setEmailcliente] = useState('');


    const { data: clientesFiltrados, isLoading: isLoadingClientes } = useApiObtenerFiltroClientesQuery(
        { query: searchTerm },
        { skip: searchTerm.length <= 2 } // Solo busca si hay al menos 2 caracteres
    );

    const { data: dataProductosFiltrados, isLoading: isLoadingProductosFiltrados } = useApiObtenerFiltroProductosQuery({
        query: searchTermProd,
        categoria: selectedCategoria
    })


    const handleSearchChangeProd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setSearchTermProd(value);

    };




    const handleSelectProducto = (producto: any) => {

        if (producto.stock === 0) {
            warningAlert('El producto no tiene stock');
            return;
        }

        const prodEncontrado = productosVentaSeleccionados.find((prod) => prod.productoid === producto.id)

        if (prodEncontrado) {
            warningAlert('El producto ya se encuentra en la lista');
            return;
        }
        const precio = producto.precioVenta ? Math.round(producto.precioVenta * 100) / 100 : 0;
        const subtotal0 = precio;

        let igv0 = 0;
        if (producto.afecta_igv) {
            igv0 = subtotal0 * 0.18;
        }
        const total0 = subtotal0 + igv0;



        const prod: DetalleVentaType = {
            productoid: producto.id,
            afecta_igv: producto.afecta_igv,
            sku: producto.sku,
            nombre: producto.nombre,
            stock: producto.cantidad,
            precio_unitario: precio,
            cantidad: 1,
            subtotal: subtotal0,
            igv: igv0,
            total: total0
        };

        setProductosVentaSeleccionados((prevProductos) => [...prevProductos, prod]);





    };



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(value.length >= 3); // Solo mostrar si hay 3 o más caracteres
    };


    const handleSelectCliente = (cliente: any) => {

        setSearchTerm(`${cliente.nombre} (${cliente.numero_documento})`);
        setShowResults(false);
        setIsClienteLocked(true);
        setValue('cliente', cliente.id);
        setEmailcliente(cliente.correo);

    }



    useEffect(() => {
        if (productosVenta.length > 0) {
            setProductosVentaExiste(false);
        }
    }, [productosVenta]);

    const handleClearCliente = () => {

        setSearchTerm('');
        setShowResults(false);
        setIsClienteLocked(false);
        setValue('cliente', 0); // Resetea el valor en el formulario
    };

    const handleClearVenta = () => {

        setFechaEstimada(new Date().toLocaleString('es-PE'));
        setProductosVenta([])
        setSubtotalf(0);
        setIgvf(0);
        setTotalf(0);
        setVueltof(0);
        setValue('cliente', 0);
        SetMostrarPago(false);
        setValueYape("yapeNumero", "")
        setValueYape("yapeOtp", "")
        setdataVentaEnvio({})


    };

    useEffect(() => {
        register('cliente');
    }, [register]);


    useEffect(() => {
        const subtotal = productosVenta.reduce((acc, item) => acc + item.subtotal, 0);
        const igv = productosVenta.reduce((acc, item) => acc + item.igv, 0);
        const total = productosVenta.reduce((acc, item) => acc + item.total, 0);

        setSubtotalf(subtotal);
        setIgvf(igv);
        setTotalf(total);

    }, [productosVenta]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.relative')) {
                setShowResults(false);
            }
        };

        if (showResults) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showResults]);

    // Observamos el valor del input en tiempo real
    const montoPagadoWatch = watch('montoPagado');
    const metodoPagoWatch = watch('metodoPago');

    useEffect(() => {
        // Si no hay monto pagado o es menor a 0, el vuelto es 0 (o negativo si prefieres mostrar cuánto falta)
        const pagado = Number(montoPagadoWatch) || 0;
        const vuelto = pagado - totalf;

        // Opcional: Solo mostrar vuelto si es positivo, o mostrar negativo como "Falta pagar"
        setVueltof(roundToTwoDecimals(vuelto));
        setValue('vuelto', (roundToTwoDecimals(vuelto)))

    }, [montoPagadoWatch, totalf])

    useEffect(() => {
        if (metodoPagoWatch == 2 || metodoPagoWatch == 3 || metodoPagoWatch == 4) {
            setValue('facturar', true);

        }

        setValue('montoPagado', totalf);

    }, [metodoPagoWatch, totalf]);


    //env
    const onSubmit: SubmitHandler<VentasTypes> = async (data) => {


        try {

            if (!productosVenta || productosVenta.length === 0) {
                setProductosVentaExiste(true)
                warningAlert('No hay productos en la lista');
                return;
            }
            setProductosVentaExiste(false)

            const usuario = user.id;

            // Convertimos los productos del estado (UI) al formato que pide la API
            const detalleVentasFormateado: DetalleVentaResType[] = productosVenta.map(p => ({
                productoid: p.productoid,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario
            }));




            // 1=Efectivo


            const metpago = data.metodoPago




            const dataSend = {
                clienteid: data.cliente,
                usuarioid: usuario,
                tipo_comprobanteid: data.tipo_comprobante,
                observacion: data.observacion,
                detalleVentas: detalleVentasFormateado,
                facturar: data.facturar,
                pago: { monto: data.montoPagado, vuelto: data.vuelto, metodoPagoid: metpago, observacion: data.observacionPago },


            }

            console.log('Datos del formulario:', dataSend);


            setdataVentaEnvio(dataSend)


            if (data.metodoPago == 1) {


                const dataVenta = { dataVenta: dataSend, dataPago: {} }


                const result = await ApiRegistrarVenta(dataVenta).unwrap();

                reset();
                handleClearCliente();
                handleClearVenta();
                successAlert('Venta registrada correctamente')




            }

            else {
                successAlert('Datos Validos, a continuacion realizar el pago')
                SetMostrarPago(true)




            }




        } catch (error) {
            const apiError = error as ApiError;
            errorAlert(apiError?.data?.message || 'Error al registrar la venta');
        }


    };

    const onSubmitCliente: SubmitHandler<ClienteFormData> = async (data) => {
        try {


            const result0 = await apiRegistrarCliente(data).unwrap();
            const result = result0?.result;

            successAlert('Cliente registrado exitosamente');


            if (result?.id) {
                handleSelectCliente(result);

            }

            setModalClienteOpen(false);
            resetCliente();
        } catch (error) {
            const apiError = error as ApiError;
            errorAlert(apiError?.data?.message || 'Error al registrar cliente');
        }
    };

    const resetProductoSeleccionado = () => {
        setProductosVentaSeleccionados([]);
        setSearchTermProd('');
    }


    const guardarProductoSeleccionado = () => {
        setModalProductoOpen(false);
        if (productosVentaSeleccionados.length === 0) return;
        const prod = productosVentaSeleccionados

        setProductosVenta([...productosVenta, ...prod]);
        resetProductoSeleccionado();

    }






    function handleCantidadChange(e: React.ChangeEvent<HTMLInputElement>, producto: DetalleVentaType, tipo?: string): void {
        // Es mejor usar parseFloat aquí, ya que la cantidad podría ser decimal (ej: peso)
        const cantidad = parseFloat(e.target.value) || 1;

        if (cantidad > producto.stock) {
            errorAlert('No hay stock disponible');
            return;
        }

        // Paso 1: Cálculos iniciales
        const subtotalBruto = cantidad * producto.precio_unitario;

        let igvBruto = 0;

        if (producto.afecta_igv) {
            igvBruto = subtotalBruto * 0.18;
        }

        const totalBruto = subtotalBruto + igvBruto;

        // Paso 2: Redondeo a 2 decimales para almacenar valores




        const subtotal = roundToTwoDecimals(subtotalBruto);
        const igv = roundToTwoDecimals(igvBruto);
        const total = roundToTwoDecimals(totalBruto);

        // --- Resto de la lógica (Sin cambios) ---
        const nuevoProducto = { ...producto, cantidad, subtotal, igv, total };

        if (tipo && tipo === 'seleccionados') {
            const nuevosProductos = productosVentaSeleccionados.map(p => p.productoid === producto.productoid ? nuevoProducto : p);
            setProductosVentaSeleccionados(nuevosProductos);
        } else {
            const nuevosProductos = productosVenta.map(p => p.productoid === producto.productoid ? nuevoProducto : p);
            setProductosVenta(nuevosProductos);
        }

    }

    function handleCategoriaChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedCategoria(e.target.value);

        console.log(e.target.value);
    }






    const initialization = {
        amount: totalf

    };

    const onSubmitYape = async (formData: YapeTypes) => {
        try {
            console.log(formData);

            const otp = formData.yapeOtp;

            const phoneNumber = formData.yapeNumero;


            // Generar requestId único (puedes usar uuid o timestamp para pruebas)
            const requestId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

            const response = await fetch(`https://api.mercadopago.com/platforms/pci/yape/v1/payment?public_key=${PUBLIC_KEY_MERCADOPAGO}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    otp: otp,
                    requestId: requestId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error MP API:', errorData);
                throw new Error(errorData.message || 'Error al conectar con Yape');
            }

            const data = await response.json();

            // data.id contiene el token

            const yapeToken = data?.id;

            if (!yapeToken) {
                throw new Error('No se pudo obtener el token de Yape');
            }

            const transaction_amount = totalf;
            const payer = {
                email: emailcliente,

            };


            const dataYapeEnvio = { token: yapeToken, transaction_amount: transaction_amount, payer: payer }

            const dataVenta = { dataVenta: dataVentaEnvio, dataMercadoPago: dataYapeEnvio }

            console.log(dataYapeEnvio);

            const resposeYape = await ApiRegistrarVenta(dataVenta).unwrap();


            if (resposeYape.statusPago === "approved") {
                successAlert('Venta registrada exitosamente');
                reset();
                handleClearCliente();
                handleClearVenta();

                console.log(resposeYape);
            }

            else {
                console.log(resposeYape);
                errorAlert("El pago fue rechazado o está pendiente")
            }




        } catch (error) {
            console.error('Error al registrar la venta:', error);
            errorAlert('Error al registrar la venta');
        }
    };


    const onSubmitMercadoPago = async (formData: MercadoPagoPaymentData) => {


        try {
            console.log(formData);

            const dataVenta = { dataVenta: dataVentaEnvio, dataMercadoPago: formData }
            const resposeMercadoPago = await ApiRegistrarVenta(dataVenta).unwrap();




            if (resposeMercadoPago.statusPago === "approved") {
                successAlert('Venta registrada exitosamente');
                reset();
                handleClearCliente();
                handleClearVenta();

                console.log(resposeMercadoPago);
            }

            else {
                console.log(resposeMercadoPago);
                errorAlert("El pago fue rechazado o está pendiente")
            }


        }
        catch (error) {
            const apiError = error as ApiError;
            errorAlert(apiError?.data?.message || 'Error al registrar la venta');

        }


    };





    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>



    );




    return (
        <>
            <form className="w-full max-w-full mx-auto bg-white shadow-lg  rounded-sm border p-6">
                <h2 className="text-2xl font-bold mb-6">Registrar Venta</h2>
                <h3 className="text-xl font-semibold mb-4">Información General</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="flex flex-row items-end gap-2 w-full">
                        {/* Input de búsqueda */}
                        <div className="flex flex-col w-2/3 relative">
                            <label className="text-sm font-medium">
                                Buscar cliente (DNI o nombre) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className={`border p-2 rounded w-full ${isClienteLocked ? 'bg-gray-100' : ''
                                        } ${errors.cliente ? 'border-red-500' : ''}`}
                                    placeholder="000000000 / cliente"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => !isClienteLocked && searchTerm.length >= 2 && setShowResults(true)}
                                    disabled={isClienteLocked}
                                />
                                {/* Botón X para limpiar */}
                                {isClienteLocked && (
                                    <button
                                        type="button"
                                        onClick={handleClearCliente}
                                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                                        title="Limpiar selección"
                                        disabled={mostrarPago}

                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <input
                                type="hidden"
                                {...register("cliente", { required: true })}
                            />

                            {/* Mensaje de error si no se seleccionó cliente */}
                            {errors.cliente && (
                                <span className="absolute top-full left-0 text-red-500 text-xs mt-1">
                                    Debe seleccionar un cliente
                                </span>
                            )}

                            {/* Lista de resultados */}
                            {showResults && !isClienteLocked && (
                                <div className="absolute top-full left-0 right-0 border rounded mt-1 bg-white shadow-lg text-sm z-10 max-h-60 overflow-y-auto">
                                    {isLoadingClientes ? (
                                        <div className="p-2 text-center text-gray-500">Buscando...</div>
                                    ) : clientesFiltrados && Array.isArray(clientesFiltrados) && clientesFiltrados.length > 0 ? (
                                        clientesFiltrados.map((cliente: any) => (
                                            <div
                                                key={cliente.id}
                                                className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                                onClick={() => handleSelectCliente(cliente)}
                                            >
                                                <div className="font-medium">{cliente.nombre}</div>
                                                <div className="text-xs text-gray-500">
                                                    DNI: {cliente.numero_documento}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-center text-gray-500">
                                            No se encontraron clientes
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Botón para crear cliente */}
                        <div className="w-auto flex">
                            <ButtonPrimaryOnclick

                                onClick={() => setModalClienteOpen(true)}
                                title='Nuevo Cliente'
                                disable={mostrarPago}

                            />
                        </div>


                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">
                            Fecha de Venta
                            <span className="text-xs text-gray-500 ml-2">(se registrará al guardar)</span>
                        </label>
                        <input
                            type="text"
                            className="border rounded p-2 bg-gray-100 cursor-not-allowed"
                            value={fechaEstimada}
                            disabled
                            readOnly
                        />
                    </div>

                    <Dropdown
                        disabled={mostrarPago}
                        options={{
                            required: {
                                value: true,
                                message: 'Tipo de Comprobante requerido',
                            },

                        }}

                        register={register} errors={errors.tipo_comprobante} title='Tipo de Comprobante' placeholder='Seleccionar Tipo de Comprobante' inputName='tipo_comprobante' icon={< FaBox />} >
                        {Array.isArray(tipoComprobantes)
                            && tipoComprobantes.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                    className="capitalize text-gray-700"
                                >
                                    {item.nombre}
                                </option>
                            ))}


                    </Dropdown>



                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Usuario</label>
                        <input disabled readOnly className="border rounded p-2 bg-gray-100 cursor-not-allowed" value={user.username} />
                    </div>
                    <div className="border border-gray-500 rounded">

                        <SwitchCustom register={register} errors={errors.facturar} title='Facturar' name='facturar' disabled={mostrarPago || metodoPagoWatch == 2 || metodoPagoWatch == 3 || metodoPagoWatch == 4} />


                    </div>


                    <FormTextInput
                        inputName="observacion"
                        title="Observación"
                        type="text"
                        icon={<FaBox />}
                        placeholder="Ingresar observación"
                        options={{

                        }}
                        register={register}
                        errors={errors.observacion}
                        disabled={mostrarPago}

                    />



                </div>

                <h3 className="text-xl font-semibold mt-8 mb-2">Productos</h3>

                {/* Sección de búsqueda y agregar producto */}

                <div className="flex flex-col md:flex-row justify-end mb-4">

                    <div className="w-auto">
                        <ButtonPrimaryOnclick

                            onClick={


                                () => {
                                    setModalProductoOpen(true)

                                }

                            }
                            disable={mostrarPago}
                            title='Buscar Producto'


                        />
                    </div>

                </div>


                {/* Tabla de productos */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                            <tr>
                                <th className="p-3 border text-left font-semibold text-gray-700">Producto</th>
                                <th className="p-3 border text-center font-semibold text-gray-700 w-24">Cantidad</th>
                                <th className="p-3 border text-right font-semibold text-gray-700 w-28">Precio Unit.</th>
                                <th className="p-3 border text-right font-semibold text-gray-700 w-28">Subtotal</th>
                                <th className="p-3 border text-right font-semibold text-gray-700 w-24">IGV (18%)</th>
                                <th className="p-3 border text-right font-semibold text-gray-700 w-28">Total</th>
                                <th className="p-3 border text-center font-semibold text-gray-700 w-20">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosVenta && productosVenta.length > 0 ? productosVenta.map(producto => (
                                <tr key={producto.productoid} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 border">
                                        <div className="font-medium text-gray-800">{producto.nombre}</div>
                                        <div className="text-xs text-gray-500">Código: {producto.sku}</div>
                                    </td>
                                    <td className="p-3 border text-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={producto.cantidad}
                                            onChange={(e) => handleCantidadChange(e, producto)}
                                            className="border rounded p-1 w-16 text-center focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="p-3 border text-right text-gray-700">S/ {producto.precio_unitario}</td>
                                    <td className="p-3 border text-right text-gray-700">S/ {producto.subtotal}</td>
                                    <td className="p-3 border text-right text-gray-600">S/ {producto.igv}</td>
                                    <td className="p-3 border text-right font-semibold text-green-700">S/ {producto.total}</td>
                                    <td className="p-3 border text-center">
                                        <button
                                            disabled={mostrarPago}
                                            type="button"

                                            onClick={() => {

                                                const productosVentaFiltrados = productosVenta.filter(pro => pro.productoid !== producto.productoid);
                                                setProductosVenta(productosVentaFiltrados);
                                            }}
                                            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="p-4 text-center">No hay productos en la lista</td></tr>
                            )}

                        </tbody>


                    </table>

                </div>
                {productosVentaExiste && (
                    <span className=" text-red-500 text-xs mt-1">
                        Debe agregar productos
                    </span>
                )}

                <h3 className="text-xl font-semibold mt-8 mb-4">Pago y Resumen</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna Izquierda: Información de Pago */}
                    <div className="bg-gray-50 border rounded-lg p-5">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MdPaid className="text-blue-600" size={20} />
                            Información de Pago
                        </h4>

                        {/* Método de Pago */}
                        <Dropdown
                            disabled={mostrarPago}
                            options={{
                                required: {
                                    value: true,
                                    message: 'Metodo de pago requerido',
                                },

                            }}

                            register={register} errors={errors.metodoPago} title='Metodo de Pago' placeholder='Seleccionar Metodo de Pago' inputName='metodoPago' icon={< FaBox />} >
                            {Array.isArray(metodoPagos)
                                && metodoPagos.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        className="capitalize text-gray-700"
                                    >
                                        {item.nombre}
                                    </option>
                                ))}



                        </Dropdown>



                        <FormTextInput
                            inputName="montoPagado"
                            title="Monto Recibido"
                            type="number"
                            icon={<FaBox />}
                            placeholder="0.00"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Monto pagado es requerido',
                                },
                                min: {
                                    value: 0,
                                    message: "El monto debe ser mayor a 0"
                                }

                            }}
                            register={register}
                            errors={errors.montoPagado}
                            disabled={mostrarPago || metodoPagoWatch == 2 || metodoPagoWatch == 3 || metodoPagoWatch == 4}


                        />

                        {/* Monto Recibido */}


                        {/* Observación */}

                        <FormTextInput
                            inputName="observacionPago"
                            title="Observación Pago"
                            type="text"
                            icon={<FaBox />}
                            placeholder="Ingresar observación"
                            options={{

                            }}
                            register={register}
                            errors={errors.observacionPago}
                            disabled={mostrarPago}


                        />


                        {(metodoPagoWatch == 2 || metodoPagoWatch == 3) && mostrarPago ? (
                            <div className="mt-4">
                                <CardPayment
                                    initialization={initialization}
                                    onSubmit={onSubmitMercadoPago}


                                />
                            </div>
                        ) : metodoPagoWatch == 4 && mostrarPago ? (
                            <div className="mt-4">
                                <img src={yapeimg} alt="yape" className="w-20 h-20 mx-auto mb-2 rounded-2xl" />
                                <p className="text-black text-md mb-2 text-center font-bold">Pago Yape</p>


                                <FormTextInput
                                    inputName="yapeNumero"
                                    title="Número de Celular"
                                    type="number"
                                    icon={<FaBox />}
                                    placeholder="Ingresar número de celular"
                                    options={{
                                        required: {
                                            value: true,
                                            message: 'Número de celular es requerido',
                                        },
                                        maxLength: {
                                            value: 9,
                                            message: 'Número de celular debe tener 9 dígitos',
                                        },
                                        minLength: {
                                            value: 9,
                                            message: 'Número de celular debe tener 9 dígitos',
                                        },
                                        pattern: {
                                            value: /^[0-9]{9}$/,
                                            message: 'Número de celular debe tener 9 dígitos',
                                        },

                                    }}
                                    register={registerYape}
                                    errors={errorsYape.yapeNumero}



                                />

                                <FormTextInput
                                    inputName="yapeOtp"
                                    title="OTP"
                                    type="password"
                                    icon={<FaBox />}
                                    placeholder="Ingresar OTP"
                                    options={{
                                        maxLength: {
                                            value: 6,
                                            message: 'OTP debe tener 6 dígitos',
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'OTP debe tener 6 dígitos',
                                        },
                                        required: {
                                            value: true,
                                            message: 'OTP es requerido',
                                        },
                                        pattern: {
                                            value: /^[0-9]{6}$/,
                                            message: 'OTP debe tener 6 dígitos',
                                        },

                                    }}
                                    register={registerYape}
                                    errors={errorsYape.yapeOtp}

                                />

                                <div className="w-40 mx-auto mt-4   ">

                                    <ButtonPrimaryOnclick
                                        title="Pagar"
                                        onClick={handleSubmitYape(onSubmitYape)}

                                    />  </div>




                            </div>) :
                            <div >

                            </div>}





                    </div>

                    {/* Columna Derecha: Resumen de Venta */}
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaBox className="text-green-600" size={20} />
                            Resumen de Venta
                        </h4>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-300">
                            <span className="text-gray-700 font-medium">Subtotal:</span>
                            <span className="text-lg font-semibold text-gray-800">S/{subtotalf}</span>
                        </div>

                        {/* IGV */}
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-300">
                            <span className="text-gray-700 font-medium">IGV (18%):</span>
                            <span className="text-lg font-semibold text-gray-800">S/{igvf}</span>
                        </div>

                        {/* Total a Pagar - DESTACADO */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-5 mb-4 shadow-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-white">TOTAL A PAGAR:</span>
                                <span className="text-4xl font-bold text-white">S/{totalf}</span>
                            </div>
                        </div>

                        {/* Vuelto - Más discreto */}
                        <div className="bg-green-50 rounded-lg p-3 border border-green-300">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Vuelto:</span>
                                <span className={vueltof < 0 ? "text-red-600 text-xl font-bold" : "text-green-600 text-xl font-bold"}>{vueltof < 0 ? "Monto Recibido Insuficiente" : "S/" + vueltof}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                                Se calculará automáticamente
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">





                    {metodoPagoWatch != 2 && metodoPagoWatch != 3 && metodoPagoWatch != 4 ? (
                        <div className="w-auto">
                            <ButtonPrimaryOnclick
                                onClick={handleSubmit(onSubmit)}
                                title='Guardar Venta'

                            />
                        </div>
                    ) : mostrarPago ? (
                        <div>

                            <div className="w-auto">
                                <ButtonPrimaryOnclick
                                    onClick={() => {
                                        SetMostrarPago(false);
                                        setValueYape("yapeNumero", "")
                                        setValueYape("yapeOtp", "")

                                    }}
                                    title='Editar Venta'

                                />
                            </div>

                        </div>

                    ) : (
                        <div>

                            <div className="w-auto">
                                <ButtonPrimaryOnclick
                                    onClick={handleSubmit(onSubmit)}
                                    title='Validar Datos'

                                />
                            </div>

                        </div>

                    )}





                </div>

                {/* Modal para registrar nuevo cliente */}
                <ModalDosOpciones
                    isLoadSecondOption={false}
                    isOpen={isModalClienteOpen}
                    onClickFirstOption={() => {
                        setModalClienteOpen(false);
                        resetCliente();
                    }}
                    onClickSecondOption={handleSubmitCliente(onSubmitCliente)}
                >
                    <h2 className="text-xl font-bold text-center my-3">Registrar Cliente</h2>
                    <FormularioCliente
                        register={registerCliente}
                        errors={errorsCliente}
                        tipodocumentos={tipoDocumentos}
                        tipoDocumentoSeleccionado={watchCliente('tipo_documento')}
                        setValue={setValueCliente}
                    />
                </ModalDosOpciones>

                <ModalDosOpciones

                    isLoadSecondOption={false}
                    isOpen={isModalProductoOpen}
                    onClickFirstOption={() => {
                        setModalProductoOpen(false);
                        resetProductoSeleccionado();
                    }}
                    onClickSecondOption={() => guardarProductoSeleccionado()}

                >
                    <h2 className="text-xl font-bold text-center my-3">Agregar Productos a la Venta</h2>
                    <div className="bg-gray-50 border rounded-lg p-4 mb-4">

                        <div className="grid grid-cols-1 gap-6">
                            {/* 1. SECCIÓN DE FILTROS (Buscador + Categoría) */}
                            <div className="flex flex-col md:flex-row gap-3 mb-4">

                                {/* Buscador */}
                                {/* aca */}
                                <div className="flex-grow">
                                    <label className="text-sm font-semibold text-gray-700">Buscar</label>
                                    <input
                                        type="text"
                                        className="border p-2 rounded w-full"
                                        placeholder="Nombre o código del producto"
                                        value={searchTermProd}
                                        onChange={handleSearchChangeProd}
                                    />
                                </div>

                                {/* Filtro de Categoría (Placeholder por ahora) */}
                                <div className="w-full md:w-1/3">
                                    <label className="text-sm font-semibold text-gray-700">Categoria</label>
                                    <select onChange={handleCategoriaChange} value={selectedCategoria} className="border p-2 rounded w-full bg-white">
                                        <option value="">Todas</option>
                                        {categoriaProductos?.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 2. TABLA DE RESULTADOS */}
                            <div className="border rounded-lg overflow-hidden shadow-sm max-h-60 overflow-y-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3 text-right">Precio</th>
                                            <th className="px-4 py-3 text-center">Stock</th>
                                            <th className="px-4 py-3 text-center">Categoria</th>
                                            <th className="px-4 py-3 text-center">Fecha Vencimiento</th>
                                            <th className="px-4 py-3 text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingProductosFiltrados ? (
                                            <tr><td colSpan={4} className="p-4 text-center">Cargando...</td></tr>
                                        ) : dataProductosFiltrados && Array.isArray(dataProductosFiltrados) && dataProductosFiltrados.length > 0 ? (
                                            dataProductosFiltrados.map((producto: any) => (
                                                <tr key={producto.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                        {producto.nombre}
                                                        <div className="text-xs text-gray-500">{producto.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">S/ {producto.precioVenta}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${producto.cantidad > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {producto.cantidad}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {producto.categoria.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {producto.fechaVencimiento ? new Date(producto.fechaVencimiento).toISOString().split('T')[0] : ''}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectProducto(producto)}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            Seleccionar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="p-4 text-center">No se encontraron productos</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>







                        </div>

                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">

                        <table className="w-full border-collapse ">
                            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                                <tr>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Producto</th>
                                    <th className="p-3 border text-center font-semibold text-gray-700 w-24">Cantidad</th>
                                    <th className="p-3 border text-right font-semibold text-gray-700 w-28">Precio Unit.</th>
                                    <th className="p-3 border text-right font-semibold text-gray-700 w-28">Subtotal</th>
                                    <th className="p-3 border text-right font-semibold text-gray-700 w-24">IGV (18%)</th>
                                    <th className="p-3 border text-right font-semibold text-gray-700 w-28">Total</th>
                                    <th className="p-3 border text-center font-semibold text-gray-700 w-20">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosVentaSeleccionados && productosVentaSeleccionados.length > 0 ? productosVentaSeleccionados.map(producto => (
                                    <tr key={producto.productoid} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 border">
                                            <div className="font-medium text-gray-800">{producto.nombre}</div>
                                            <div className="text-xs text-gray-500">Código: {producto.sku}</div>
                                        </td>
                                        <td className="p-3 border text-center">
                                            <input
                                                type="number"

                                                min="1"
                                                value={producto.cantidad}
                                                onChange={(e) => handleCantidadChange(e, producto, 'seleccionados')}
                                                className="border rounded p-1 w-16 text-center focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-3 border text-right text-gray-700">S/ {producto.precio_unitario}</td>
                                        <td className="p-3 border text-right text-gray-700">S/ {producto.subtotal}</td>
                                        <td className="p-3 border text-right text-gray-600">S/ {producto.igv}</td>
                                        <td className="p-3 border text-right font-semibold text-green-700">S/ {producto.total}</td>
                                        <td className="p-3 border text-center">
                                            <button
                                                type="button"
                                                onClick={() => {

                                                    const productosVentaFiltrados = productosVentaSeleccionados.filter(pro => pro.productoid !== producto.productoid);
                                                    setProductosVentaSeleccionados(productosVentaFiltrados);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="p-4 text-center">No hay productos en la lista</td></tr>)}

                            </tbody>


                        </table>

                    </div>



                </ModalDosOpciones>



            </form >

        </>


    )
}



const PageRegVentas = withFetch2(RegistrarVentasPag);


export default PageRegVentas;