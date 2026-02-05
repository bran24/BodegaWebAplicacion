// components/ProductoTable/ProductoTable.tsx
import React, { useEffect, useState } from 'react';
import { Categoria, Product, Unidad, Proveedor } from '../../../api/types';
import withFetch from './withFetch';
import { FaBox, GoAlertFill, MdDelete, MdEdit, MdPaid } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import { FaCalendar, FaPercent } from 'react-icons/fa6';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Dropdown from '../../atomos/formInputs/dropdown';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiEliminarProductosMutation, useApiActualizarProductosMutation, useApiRegistrarProductosMutation, useLazyApiObtenerProductosPaginacionQuery } from '../../../api/apiSlice';
import SwitchCustom from '../../atomos/checkbox/switchCustom';
import { generateProductsPDF } from '../../../utils/generateProductsPDF';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';

interface ProductoTableProps {
    datos: Product[] | undefined;
    load: boolean;
    err: unknown;
    categorias: Categoria[] | undefined;
    unidades: Unidad[] | undefined;
    proveedores: Proveedor[] | undefined;
    totalItems: number,
    totalPages: number,
    currentPage: number,
    setPage: (pag: number) => void,
    setQuery: (query: string | undefined) => void,
    query: string | undefined,
    categoria: number | undefined,
    setCategoria: (categoria: number | undefined) => void,
    proveedor: number | undefined,
    setProveedor: (proveedor: number | undefined) => void,
    fechaVencimiento: string | undefined,
    setFechaVencimiento: (fechaVencimiento: string | undefined) => void,
    ordenStock: string | undefined,
    setOrdenStock: (orden: string | undefined) => void,


}

const ProductoTable: React.FC<ProductoTableProps> = ({ datos, load, err, categorias, unidades, proveedores, totalItems,
    totalPages,
    currentPage,
    query,
    setQuery,
    setPage,
    categoria,
    setCategoria,
    proveedor,
    setProveedor,
    fechaVencimiento,
    setFechaVencimiento,
    ordenStock,
    setOrdenStock
}) => {


    interface ProductoTypes {
        // id: number;
        nombre: string;
        descripcion: string;
        precioCompra: string;
        afecta_igv: boolean
        precioVenta: string;
        unidad: string;
        categoria: string;
        proveedor: string;
        cantidad: number;
        fechaVencimiento: string; // Puede ser Date si prefieres trabajar con objetos Date


    }
    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [apiEliminarProducto] = useApiEliminarProductosMutation()
    const [apiRegistrarProductos] = useApiRegistrarProductosMutation()
    const [apiActualizarProductos] = useApiActualizarProductosMutation()
    const [selProducto, setSelProducto] = useState<Product | null>(null)
    const [typeOfPanel, setTypeOfPanel] = useState('Registrar');
    const [isModalOpen, setModalOpen] = useState(false)
    const [isLoadModal] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


    const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false)
    const [isLoadConfirmationModal] = useState(false);

    const [idToDelete, setIdToDelete] = useState(-1);
    const handleConfirmationOpenModal = () => setModalConfirmationOpen(true);
    const handleConfirmationCloseModal = () => {
        setIdToDelete(-1)
        setModalConfirmationOpen(false)
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {

        clearInputs();
        setModalOpen(false)
    };

    const [triggerGetProductos] = useLazyApiObtenerProductosPaginacionQuery();

    const handleGenerarPDF = async () => {
        if (datos && datos.length === 0) {
            errorAlert('No hay productos para generar el reporte.');
            return;
        }

        try {
            setIsGeneratingPdf(true);
            const fullData = await triggerGetProductos({
                page: 1,
                limit: 100000, // Limit alto para traer todo s el backend no soporta 'all' aun, pero el ideal es 'all'
                query: query,
                categoria: categoria,
                proveedor: proveedor,
                fechaVencimiento: fechaVencimiento,
                ordenStock: ordenStock,
                all: "true"
            }).unwrap();

            if (fullData.productos.length === 0) {
                errorAlert('No se encontraron registros para exportar.');
                return;
            }

            const categoriaNombre = categoria
                ? categorias?.find(c => c.id === categoria)?.nombre
                : undefined;

            const proveedorNombre = proveedor
                ? proveedores?.find(p => p.id === proveedor)?.nombre
                : undefined;

            await generateProductsPDF(fullData.productos, {
                query,
                categoria: categoriaNombre,
                proveedor: proveedorNombre,
                fechaVencimiento
            });

        } catch (error) {
            console.error(error);
            errorAlert('Error al generar el reporte PDF');
        } finally {
            setIsGeneratingPdf(false);
        }
    };


    const {
        register,
        clearErrors,
        handleSubmit,
        setValue,
        reset,

        formState: { errors },
    } = useForm<ProductoTypes>({ defaultValues: { afecta_igv: false } });

    useEffect(() => {
        if (selProducto && typeOfPanel === 'Actualizar') {


            setValue("nombre", selProducto?.nombre || '');
            setValue("afecta_igv", selProducto?.afecta_igv || false)
            setValue("descripcion", selProducto?.descripcion || '');
            setValue("precioVenta", selProducto?.precioVenta || '');
            setValue("precioCompra", selProducto?.precioCompra || '');
            setValue("unidad", selProducto?.unidad?.id.toString() || '0');
            setValue("categoria", selProducto?.categoria?.id.toString() || '0');
            setValue("proveedor", selProducto?.proveedor?.id.toString() || '0');
            setValue("cantidad", selProducto?.cantidad || 0);


            if (selProducto?.fechaVencimiento) {

                const dateObject = new Date(selProducto.fechaVencimiento);


                const year = dateObject.getFullYear();
                const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 
                const day = String(dateObject.getDate()).padStart(2, '0'); // Asegura que 

                setValue("fechaVencimiento", `${year}-${month}-${day}` || '');

            }




            clearErrors();



        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selProducto])

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoriaId = event.target.value;
        if (categoriaId === "") {
            setCategoria(undefined);
        } else {
            setCategoria(Number(categoriaId));
        }
    };

    const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const proveedorId = event.target.value;
        if (proveedorId === "") {
            setProveedor(undefined);
        } else {
            setProveedor(Number(proveedorId));
        }
    };
    const handleFechaVencimientoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fechaVencimiento = event.target.value;
        if (fechaVencimiento === '') {
            setFechaVencimiento(undefined);
        }
        else {
            setFechaVencimiento(fechaVencimiento);
        }

    };

    const handleOrdenStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const orden = event.target.value;
        if (orden === "") {
            setOrdenStock(undefined);
        } else {
            setOrdenStock(orden);
        }
    };


    function handleBuscarChange(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value;

        console.log(query)
        setQuery(query);
    }





    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>




    );





    const clearInputs = () => {

        reset({
            nombre: '',
            descripcion: '',
            precioCompra: '',
            precioVenta: '',
            unidad: '',
            categoria: '',
            cantidad: 0,
            fechaVencimiento: ''
        });
        setIdToDelete(-1)
        setSelProducto(null)
        clearErrors();
    };


    const onSubmit: SubmitHandler<ProductoTypes> = async (dataform) => {

        const { cantidad, fechaVencimiento, nombre, descripcion, precioCompra, precioVenta, unidad, categoria, proveedor, afecta_igv } = dataform

        if (typeOfPanel === 'Registrar') {


            try {


                const jsondata = { nombre, precioCompra, descripcion, precioVenta, cantidad, fechaVencimiento, unidad, categoria, proveedor, afecta_igv }

                console.log(jsondata)
                await apiRegistrarProductos(jsondata).unwrap()

                handleCloseModal()


                successAlert('Producto Registrado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        } else if (typeOfPanel === 'Actualizar') {

            try {



                const jsondata = { "id": selProducto?.id, nombre, precioCompra, descripcion, precioVenta, cantidad, fechaVencimiento, unidad, categoria, proveedor, afecta_igv }

                console.log(jsondata)
                await apiActualizarProductos(jsondata).unwrap()

                handleCloseModal()


                successAlert('Producto Actualizado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        }






    }

    const eliminarProducto = async () => {



        try {
            await apiEliminarProducto(idToDelete.toString()).unwrap(); // Llama a la mutación para eliminar el producto
            successAlert('Producto Eliminado Correctamente')

            handleConfirmationCloseModal()

            setIdToDelete(-1)
        } catch (err) {
            setIdToDelete(-1)
            const apiError = err as ApiError;
            const errorMessage = apiError.data?.message || 'Error desconocido';
            handleConfirmationCloseModal()
            errorAlert(errorMessage)
        }



    }











    return (

        <div className="w-full max-w-full h-screen rounded-sm border  bg-white p-4">
            <p className='font-semibold text-4xl my-4'>Productos</p>

            <div className='flex justify-between flex-wrap gap-2 items-center mb-4' >
                <div className='w-full md:w-[20%]'>
                    <label className="text-sm font-semibold text-gray-700">Buscar</label>

                    <input placeholder="Buscar" onChange={handleBuscarChange} value={query || ""} className="border p-2 rounded w-full bg-white" type="text" />
                </div>


                <div className='flex flex-col w-full md:w-[15%]'>

                    <label className="text-sm font-semibold text-gray-700">Categoria</label>
                    <select className='border p-2 rounded w-full bg-white' name="categoria" value={categoria || ""} onChange={handleCategoriaChange} id="">
                        <option value="">Todos</option>
                        {categorias?.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}

                    </select>
                </div>

                <div className='flex flex-col w-full md:w-[15%]'>
                    <label className="text-sm font-semibold text-gray-700">Proveedor</label>
                    <select className='border p-2 rounded w-full bg-white' name="proveedor" value={proveedor || ""} onChange={handleProveedorChange}>
                        <option value="">Todos</option>
                        {proveedores?.map((proveedor) => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </option>
                        ))}

                    </select>
                </div>
                <div className='flex flex-col w-full md:w-[15%]'>
                    <label className="text-sm font-semibold text-gray-700">Fecha de Vencimiento</label>
                    <input name="fechaVencimiento" value={fechaVencimiento || ""} onChange={handleFechaVencimientoChange} type="date" className="border p-2 rounded w-full bg-white" />
                </div>

                <div className='flex flex-col w-full md:w-[15%]'>
                    <label className="text-sm font-semibold text-gray-700">Ordenar por Stock</label>
                    <select
                        className='border p-2 rounded w-full bg-white'
                        value={ordenStock || ""}
                        onChange={handleOrdenStockChange}
                    >
                        <option value="">Por defecto</option>
                        <option value="ASC">Menor Stock</option>
                        <option value="DESC">Mayor Stock</option>
                    </select>
                </div>

            </div>

            <div className='flex justify-end gap-2'>

                <div className='mb-4 w-auto'>
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
                                <FaFilePdf /> Generar Reporte PDF
                            </>
                        )}
                    </button>
                </div>


                <div className='mb-4 w-auto' >

                    <ButtonPrimaryOnclick onClick={() => {

                        setTypeOfPanel("Registrar")
                        handleOpenModal()


                    }} title='Registrar Producto' disable={false}></ButtonPrimaryOnclick>

                </div>

            </div>


            <div className='max-h-[500px] overflow-y-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead >
                        <tr >
                            <th className='border border-secundary4' >ID</th>
                            <th className='border border-secundary4'>Nombre</th>
                            <th className='border border-secundary4'>SKU</th>
                            <th className='border border-secundary4'>P.Compra</th>
                            <th className='border border-secundary4'>P.Venta</th>
                            <th className='border border-secundary4'>Categoria</th>
                            <th className='border border-secundary4'>Unidad</th>
                            <th className='border border-secundary4'>Proveedor</th>
                            <th className='border border-secundary4'>Cantidad</th>
                            <th className='border border-secundary4'>Fecha de Vencimiento</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos && datos?.length > 0 ? datos?.map(product => (
                            <tr key={product.id}>
                                <td className='border border-secundary4'>{product.id || ''}</td>
                                <td className='border border-secundary4'>{product.nombre || ''}</td>
                                <td className='border border-secundary4'>{product.sku || ''}</td>
                                <td className='border border-secundary4'>{product.precioCompra || ''}</td>
                                <td className='border border-secundary4'>{product.precioVenta || ''}</td>
                                <td className='border border-secundary4'>{product.categoria?.nombre || ''}</td>
                                <td className='border border-secundary4'>{product.unidad?.abreviatura || ''}</td>
                                <td className='border border-secundary4'>{product.proveedor?.nombre || ''}</td>

                                <td className={`border border-secundary4 ${(product.cantidad || 0) < 10 ? 'bg-red-100 text-red-700 font-bold' : ''}`}>{product.cantidad || 0}</td>
                                <td className='border border-secundary4'>{
                                    product?.fechaVencimiento ?
                                        new Date(product.fechaVencimiento).toISOString().split('T')[0] : ''}</td>
                                <td className='border border-secundary4 '>
                                    <div className='flex flex-row justify-center gap-3 my-1'>

                                        <MdEdit title="Editar Producto" onClick={() => {


                                            setTypeOfPanel("Actualizar")
                                            setSelProducto(product)
                                            handleOpenModal()

                                        }} className='bg-secundary2 hover:bg-secundary4 p-1 text-2xl rounded'></MdEdit>
                                        <MdDelete title="Eliminar Producto" className='bg-secundary2  hover:bg-secundary4 p-1 text-2xl rounded' onClick={() => {
                                            setIdToDelete(product.id)
                                            handleConfirmationOpenModal();

                                        }} ></MdDelete>


                                    </div>

                                </td>
                            </tr>
                        )) : <tr><td colSpan={11} className="text-center">No hay Productos disponibles.</td></tr>}
                    </tbody>
                </table>


            </div>

            {/* Control de paginación */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => setPage(1)} // Ir a la primera página
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-primary2 text-white rounded hover:bg-primary disabled:bg-gray-400"
                >
                    Primera
                </button>



                <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setPage(index + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === index + 1
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary hover:bg-blue-100'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>


                <button
                    onClick={() => setPage(totalPages)} // Ir a la última página
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-primary2 text-white rounded hover:bg-primary disabled:bg-gray-400"
                >
                    Última
                </button>
            </div>


            <ModalDosOpciones
                isLoadSecondOption={isLoadModal}
                isOpen={isModalOpen}
                onClickFirstOption={handleCloseModal}
                onClickSecondOption={handleSubmit(onSubmit)}
            >



                <div >

                    <h2 className="text-xl font-bold text-center my-3">{typeOfPanel + " Producto"}
                    </h2>

                    <form >
                        <FormTextInput
                            inputName="nombre"
                            title="Nombre"
                            icon={< FaBox />}
                            placeholder="Ingresar Producto"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Producto requerido',
                                },
                                pattern: {
                                    value: /^[a-zA-Z áéíóúüÁÉÍÓÚÜñÑ]+$/,
                                    message: 'Nombre invalido',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'No más de 20 caracteres.',
                                },
                            }}
                            register={register}
                            errors={errors.nombre} type='text'

                        />


                        <FormTextInput
                            inputName="descripcion"
                            title="Descripcion"
                            icon={< FaBox />}
                            placeholder="Ingresar descripcion"
                            options={{


                            }}
                            register={register}
                            errors={errors.descripcion} type='text'

                        />

                        <FormTextInput
                            inputName="cantidad"
                            title="Cantidad"
                            type="number"
                            icon={<FaBox />}
                            placeholder="Ingresar Cantidad"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Cantidad requerido',
                                },
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Cantidad invalida',
                                },

                            }}
                            register={register}
                            errors={errors.cantidad}

                        />

                        <FormTextInput
                            inputName="precioCompra"
                            title="Precio de Compra"
                            type="money"
                            icon={<MdPaid />}
                            placeholder="Ingresar Precio"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Precio requerido',
                                },
                                pattern: {
                                    value: /^[0-9.]+$/,
                                    message: 'Precio invalido',
                                },
                                min: {
                                    value: 0.01,
                                    message: 'Precio debe ser mayor a 0',
                                },

                            }}
                            register={register}
                            errors={errors.precioCompra}

                        />

                        <FormTextInput
                            inputName="precioVenta"
                            title="Precio de Venta"
                            type="money"
                            icon={<MdPaid />}
                            placeholder="Ingresar Precio"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Precio requerido',
                                },
                                pattern: {
                                    value: /^[0-9.]+$/,
                                    message: 'Precio invalido',
                                },
                                min: {
                                    value: 0.01,
                                    message: 'Precio debe ser mayor a 0',
                                },

                            }}
                            register={register}
                            errors={errors.precioVenta}

                        />




                        <FormTextInput
                            inputName="fechaVencimiento"
                            title="Fecha de Vencimiento"
                            type="date"
                            icon={<FaCalendar />}
                            placeholder="Ingresar Fecha"
                            options={{

                            }}
                            register={register}
                            errors={errors.fechaVencimiento}

                        />

                        <Dropdown
                            options={{


                            }}
                            register={register} errors={errors.proveedor} title='Proveedor' placeholder=' Seleccionar Proveedor' inputName='proveedor' icon={< FaBox />} >
                            {Array.isArray(proveedores)
                                && proveedores.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        className="capitalize text-gray-700"
                                    >
                                        {item.nombre}
                                    </option>
                                ))}

                        </Dropdown>

                        <Dropdown
                            options={{
                                required: {
                                    value: true,
                                    message: 'Categoria requerida',
                                },

                            }}
                            register={register} errors={errors.categoria} title='Categoria' placeholder=' Seleccionar Categoria' inputName='categoria' icon={< FaBox />} >
                            {Array.isArray(categorias)
                                && categorias.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        className="capitalize text-gray-700"
                                    >
                                        {item.nombre}
                                    </option>
                                ))}

                        </Dropdown>

                        <Dropdown
                            options={{
                                required: {
                                    value: true,
                                    message: 'Unidad requerida',
                                },

                            }}
                            register={register}
                            errors={errors.unidad} title='Unidad' placeholder=' Seleccionar Unidad' inputName='unidad' icon={< FaBox />} >
                            {Array.isArray(unidades)
                                && unidades.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        className="capitalize text-gray-700"
                                    >
                                        {item.nombre}
                                    </option>
                                ))}

                        </Dropdown>

                        <SwitchCustom
                            register={register}
                            name="afecta_igv"
                            title="Afecta IGV"
                            errors={errors.afecta_igv}
                        />


                    </form>


                </div>


            </ModalDosOpciones>

            <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={isModalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={eliminarProducto} >
                <div className='flex justify-center items-center'>
                    <GoAlertFill className='text-xl text-primary' />
                    <p className='font-medium'>{` ¿Desea eliminar el producto con id ${idToDelete}?`}</p>

                </div>



            </ModalDosOpciones>



        </div>



    );
};


const PageProductos = withFetch(ProductoTable);

export default PageProductos;