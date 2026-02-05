
import { Cliente, TipoDocumento } from '../../../api/types';
import React, { useEffect, useState } from 'react';
import withFetch from './withFetch';
import { FaBox, GoAlertFill, MdDelete, MdEdit, MdPaid, MdEmail, MdOutlineLocalPhone } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Dropdown from '../../atomos/formInputs/dropdown';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiRegistrarClienteMutation, useApiActualizarClienteMutation, useApiEliminarClienteMutation } from '../../../api/apiSlice';
import FormularioCliente, { ClienteFormData } from '../../organismos/Formularios/FormularioCliente';



interface ClienteTableProps {
    datos: Cliente[] | undefined;
    load: boolean;
    err: unknown;
    totalItems: number,
    totalPages: number,
    currentPage: number,
    tipodocumentos: TipoDocumento[] | undefined;
    setPage: (pag: number) => void,
    setQuery: (query: string | undefined) => void,
    query: string | undefined
}


const ClienteTable: React.FC<ClienteTableProps> = ({ datos, tipodocumentos, load, err, totalItems,
    totalPages,
    currentPage,
    setPage,
    setQuery,
    query }) => {



    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [apiEliminarCliente] = useApiEliminarClienteMutation()
    const [apiRegistrarCliente] = useApiRegistrarClienteMutation()
    const [apiActualizarCliente] = useApiActualizarClienteMutation()
    const [selCliente, setSelCliente] = useState<Cliente | null>(null)
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
        watch,
        formState: { errors },
    } = useForm<ClienteFormData>({
        defaultValues: {
            // puedes agregar más defaults aquí
        },
    });

    // const tipoDocumentoSeleccionado = watch("tipo_documento");


    // useEffect(()=>{

    //     if (tipoDocumentoSeleccionado === "")
    //     {
    //         setValue("numero_documento","");
    //     }


    // },[tipoDocumentoSeleccionado,setValue])

    useEffect(() => {
        if (selCliente && typeOfPanel === 'Actualizar') {


            setValue("nombre", selCliente?.nombre || '');
            setValue("tipo_documento", selCliente?.tipo_documento?.id.toString() || '0');
            setValue("numero_documento", selCliente?.numero_documento || '');
            setValue("direccion", selCliente?.direccion || '');
            setValue("correo", selCliente?.correo || '');
            setValue("telefono", selCliente?.telefono || '');
            setValue("es_empresa", selCliente?.es_empresa || false);





            clearErrors();



        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selCliente])


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

    // if (!datos || datos.length === 0) return <p>No hay Cliente disponibles.</p>;



    const clearInputs = () => {

        reset({
            nombre: '',
            tipo_documento: '',
            numero_documento: '',
            direccion: '',
            correo: '',
            telefono: '',
            es_empresa: false




        });
        setIdToDelete(-1)
        setSelCliente(null)
        clearErrors();
    };


    const onSubmit: SubmitHandler<ClienteFormData> = async (dataform) => {

        const { nombre, tipo_documento, numero_documento, direccion, correo, telefono, es_empresa } = dataform;


        if (typeOfPanel === 'Registrar') {


            try {

                const jsondata = {
                    nombre,
                    tipo_documento,
                    numero_documento,
                    direccion,
                    correo,
                    telefono,
                    es_empresa: es_empresa || false
                };

                console.log(jsondata)
                await apiRegistrarCliente(jsondata).unwrap()

                handleCloseModal()


                successAlert('Cliente Registrado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';



                errorAlert(errorMessage)

            }

        } else if (typeOfPanel === 'Actualizar') {

            try {



                const jsondata = { "id": selCliente?.id, nombre, tipo_documento, numero_documento, direccion, correo, telefono, es_empresa: es_empresa || false }



                console.log(jsondata)
                await apiActualizarCliente(jsondata).unwrap()

                handleCloseModal()


                successAlert('Cliente Actualizado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        }






    }

    const eliminarCliente = async () => {



        try {
            await apiEliminarCliente(idToDelete.toString()).unwrap(); // Llama a la mutación para eliminar el Cliente
            successAlert('Cliente Eliminado Correctamente')

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
            <p className='font-semibold text-4xl my-4'>Cliente</p>

            <div className='w-full md:w-2/12' >
                <label className="text-sm font-semibold text-gray-700">Buscar</label>

                <input placeholder="Buscar" onChange={handleBuscarChange} value={query || ""} className="border p-2 rounded w-full bg-white" type="text" />

            </div>

            <div className='flex justify-end'>

                <div className='mb-4 w-auto' >

                    <ButtonPrimaryOnclick onClick={() => {

                        setTypeOfPanel("Registrar")
                        handleOpenModal()


                    }} title='Registrar  Cliente' disable={false}></ButtonPrimaryOnclick>

                </div>

            </div>

            <div className='max-h-80 overflow-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead >
                        <tr >
                            <th className='border border-secundary4' >ID</th>
                            <th className='border border-secundary4'>Nombre</th>
                            <th className='border border-secundary4'>Dni</th>
                            <th className='border border-secundary4'>email</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos && datos.length > 0 ? datos.map(client => (
                            <tr key={client.id}>
                                <td className='border border-secundary4'>{client.id || ''}</td>
                                <td className='border border-secundary4'>{client?.nombre || ''}</td>
                                <td className='border border-secundary4'>{client?.numero_documento || ''}</td>
                                <td className='border border-secundary4'>{client?.correo || ''}</td>
                                <td className='border border-secundary4 '>

                                    <div className='flex flex-row justify-center gap-3 my-1'>

                                        <MdEdit title="Editar Cliente" onClick={() => {


                                            setTypeOfPanel("Actualizar")
                                            setSelCliente(client)
                                            handleOpenModal()

                                        }} className='bg-secundary2 hover:bg-secundary4 p-1 text-2xl rounded'></MdEdit>
                                        <MdDelete title="Eliminar Cliente" className='bg-secundary2  hover:bg-secundary4 p-1 text-2xl rounded' onClick={() => {
                                            setIdToDelete(client.id)
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

                <FormularioCliente
                    register={register}
                    errors={errors}
                    tipodocumentos={tipodocumentos}
                    tipoDocumentoSeleccionado={watch("tipo_documento")}
                    setValue={setValue}
                />





            </ModalDosOpciones>

            <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={isModalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={eliminarCliente} >
                <div className='flex justify-center items-center'>
                    <GoAlertFill className='text-xl text-primary' />
                    <p className='font-medium'>{` ¿Desea eliminar el Cliente con id ${idToDelete}?`}</p>

                </div>



            </ModalDosOpciones>



        </div>



    );
};


const PageCliente = withFetch(ClienteTable);

export default PageCliente;