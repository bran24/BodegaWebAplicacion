
import { Proveedor } from '../../../api/types';
import React, { useEffect, useState } from 'react';
import withFetch from './withFetch';
import { FaBox, GoAlertFill, MdDelete, MdEdit, MdPaid, MdEmail, MdOutlineLocalPhone } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import { FaCalendar } from 'react-icons/fa6';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Dropdown from '../../atomos/formInputs/dropdown';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiRegistrarProveedorMutation, useApiActualizarProveedorMutation, useApiEliminarProveedorMutation, useApiObtenerProveedorPaginacionQuery } from '../../../api/apiSlice';



interface ProveedorTableProps {
    datos: Proveedor[] | undefined;
    load: boolean;
    err: unknown;
    totalItems: number,
    totalPages: number,
    currentPage: number,
    setPage: (pag: number) => void,
    setQuery: (query: string | undefined) => void,
    query: string | undefined
}


const ProveedorTable: React.FC<ProveedorTableProps> = ({ datos, load, err, totalItems,
    totalPages,
    currentPage,
    setPage,
    setQuery,
    query }) => {


    interface ProveedorTypes {
        // id: number;

        nombre: string;
        descripcion?: string;
        contacto?: string;
        email: string;
        telefono: string;
        direccion: string;
        pais: string


    }
    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [apiEliminarProveedor] = useApiEliminarProveedorMutation()
    const [apiRegistrarProveedor] = useApiRegistrarProveedorMutation()
    const [apiActualizarProveedor] = useApiActualizarProveedorMutation()
    const [selProveedor, setSelProveedor] = useState<Proveedor | null>(null)
    const [typeOfPanel, setTypeOfPanel] = useState('Registrar');
    const [isModalOpen, setModalOpen] = useState(false)
    const [isLoadModal] = useState(false);

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
    const {
        register,
        clearErrors,
        handleSubmit,
        setValue,
        reset,

        formState: { errors },
    } = useForm<ProveedorTypes>();

    useEffect(() => {
        if (selProveedor && typeOfPanel === 'Actualizar') {


            setValue("nombre", selProveedor?.nombre || '');
            setValue("descripcion", selProveedor?.descripcion || '');
            setValue("contacto", selProveedor?.contacto || '');
            setValue("email", selProveedor?.email || '');
            setValue("pais", selProveedor?.pais || '');
            setValue("telefono", selProveedor?.telefono || '');
            setValue("direccion", selProveedor?.direccion || '');




            clearErrors();



        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selProveedor])

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

    // if (!datos || datos.length === 0) return <p>No hay Proveedor disponibles.</p>;



    const clearInputs = () => {

        reset({
            nombre: '',
            descripcion: '',
            contacto: '',
            email: '',
            pais: '',
            telefono: '',
            direccion: '',



        });
        setIdToDelete(-1)
        setSelProveedor(null)
        clearErrors();
    };


    const onSubmit: SubmitHandler<ProveedorTypes> = async (dataform) => {

        const { nombre, descripcion, contacto, email, pais, telefono, direccion } = dataform

        if (typeOfPanel === 'Registrar') {


            try {


                const jsondata = { nombre, descripcion, contacto, email, pais, telefono, direccion }

                console.log(jsondata)
                await apiRegistrarProveedor(jsondata).unwrap()

                handleCloseModal()


                successAlert('Proveedor Registrado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        } else if (typeOfPanel === 'Actualizar') {

            try {



                const jsondata = { "id": selProveedor?.id, nombre, descripcion, contacto, email, pais, telefono, direccion }

                console.log(jsondata)
                await apiActualizarProveedor(jsondata).unwrap()

                handleCloseModal()


                successAlert('Proveedor Actualizado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        }






    }

    const eliminarProveedor = async () => {



        try {
            await apiEliminarProveedor(idToDelete.toString()).unwrap(); // Llama a la mutación para eliminar el Proveedor
            successAlert('Proveedor Eliminado Correctamente')

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

        <div className="w-full max-w-full h-screen rounded-sm border  bg-white p-3">
            <p className='font-semibold text-4xl my-4'>Proveedor</p>

            <div className='w-full md:w-2/12' >
                <label className="text-sm font-semibold text-gray-700">Buscar</label>

                <input placeholder="Buscar" onChange={handleBuscarChange} value={query || ""} className="border p-2 rounded w-full bg-white" type="text" />

            </div>

            <div className='flex justify-end'>

                <div className='mb-4 w-auto' >

                    <ButtonPrimaryOnclick onClick={() => {

                        setTypeOfPanel("Registrar")
                        handleOpenModal()


                    }} title='Registrar Proveedor' disable={false}></ButtonPrimaryOnclick>

                </div>

            </div>

            <div className='max-h-80 overflow-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead >
                        <tr >
                            <th className='border border-secundary4' >ID</th>
                            <th className='border border-secundary4'>Nombre</th>
                            <th className='border border-secundary4'>telefono</th>
                            <th className='border border-secundary4'>email</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos && datos.length > 0 ? datos?.map(product => (
                            <tr key={product.id}>
                                <td className='border border-secundary4'>{product.id || ''}</td>
                                <td className='border border-secundary4'>{product.nombre || ''}</td>
                                <td className='border border-secundary4'>{product.telefono || ''}</td>
                                <td className='border border-secundary4'>{product.contacto || ''}</td>
                                <td className='border border-secundary4 '>

                                    <div className='flex flex-row justify-center gap-3 my-1'>

                                        <MdEdit title="Editar Proveedor" onClick={() => {


                                            setTypeOfPanel("Actualizar")
                                            setSelProveedor(product)
                                            handleOpenModal()

                                        }} className='bg-secundary2 hover:bg-secundary4 p-1 text-2xl rounded'></MdEdit>
                                        <MdDelete title="Eliminar Proveedor" className='bg-secundary2  hover:bg-secundary4 p-1 text-2xl rounded' onClick={() => {
                                            setIdToDelete(product.id)
                                            handleConfirmationOpenModal();

                                        }} ></MdDelete>


                                    </div>

                                </td>
                            </tr>
                        )) : <tr><td colSpan={5} className="text-center">No hay datos disponibles.</td></tr>}
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

                    <h2 className="text-xl font-bold text-center my-3">{typeOfPanel + " Proveedor"}
                    </h2>

                    <form >
                        <FormTextInput
                            inputName="nombre"
                            title="Nombre"
                            icon={< FaBox />}
                            placeholder="Ingresar Proveedor"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Proveedor requerido',
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9 áéíóúüÁÉÍÓÚÜñÑ.,-]+$/,
                                    message: 'Nombre invalido',
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'No más de 50 caracteres.',
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
                            inputName="contacto"
                            title="Contacto"
                            icon={< FaBox />}
                            placeholder="Ingresar contacto"
                            options={{


                            }}
                            register={register}
                            errors={errors.contacto} type='text'

                        />

                        <FormTextInput
                            inputName="telefono"
                            title="Telefono"
                            type="text"
                            icon={<MdOutlineLocalPhone />}
                            placeholder="Ingresar Telefono"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Telefono requerido',
                                },
                                pattern: {
                                    value: /^\d{9}$/,
                                    message: 'Teléfono inválido: debe tener 9 dígitos',
                                },
                            }}
                            register={register}
                            errors={errors.telefono}

                        />


                        <FormTextInput
                            inputName="email"
                            title="Correo"
                            type=""
                            icon={<MdEmail />}
                            placeholder="Ingresar Correo"
                            options={{
                                required: {

                                },
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Correo invalido',
                                },
                            }}
                            register={register}
                            errors={errors.email}

                        />


                        <FormTextInput
                            inputName="pais"
                            title="Pais"
                            icon={< FaBox />}
                            placeholder="Ingresar pais"
                            options={{


                            }}
                            register={register}
                            errors={errors.pais} type='text'

                        />

                        <FormTextInput
                            inputName="direccion"
                            title="Direccion"
                            icon={< FaBox />}
                            placeholder="Ingresar Direccion"
                            options={{


                            }}
                            register={register}
                            errors={errors.direccion} type='text'

                        />








                    </form>


                </div>


            </ModalDosOpciones>

            <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={isModalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={eliminarProveedor} >
                <div className='flex justify-center items-center'>
                    <GoAlertFill className='text-xl text-primary' />
                    <p className='font-medium'>{` ¿Desea eliminar el Proveedor con id ${idToDelete}?`}</p>

                </div>



            </ModalDosOpciones>



        </div>



    );
};


const PageProveedor = withFetch(ProveedorTable);

export default PageProveedor;