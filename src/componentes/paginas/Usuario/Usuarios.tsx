// components/UsuarioTable/UsuarioTable.tsx
import React, { useEffect, useState } from 'react';
import { Usuario, Roles } from '../../../api/types';
import withFetch from './withFetch';
import { GoAlertFill, MdDelete, MdEdit, MdEmail, MdPassword, FaRegUser, FaBox } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiEliminarUsuarioMutation, useApiActualizarUsuarioMutation, useApiCrearUsuarioMutation } from '../../../api/apiSlice';
import Dropdown from '../../atomos/formInputs/dropdown';

interface UsuarioTableProps {
    datos: Usuario[] | undefined;
    load: boolean;
    err: unknown;
    totalItems: number,
    totalPages: number,
    currentPage: number,
    datosRoles: Roles[],
    setPage: (pag: number) => void

}

const UsuarioTable: React.FC<UsuarioTableProps> = ({ datos, load, err,
    totalPages,
    currentPage,
    datosRoles,
    setPage }) => {


    interface UsuarioTypes {
        //  id: number;
        username: string;
        email: string;
        password: string;
        repPass: string
        rol: string



    }
    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [apiEliminarUsuario] = useApiEliminarUsuarioMutation()
    const [apiRegistrarUsuarios] = useApiCrearUsuarioMutation()
    const [apiActualizarUsuarios] = useApiActualizarUsuarioMutation()
    const [selUsuario, setSelUsuario] = useState<Usuario | null>(null)
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
    } = useForm<UsuarioTypes>();

    useEffect(() => {
        if (selUsuario && typeOfPanel === 'Actualizar') {


            setValue("username", selUsuario?.username || '');
            setValue("email", selUsuario?.email || '');
            setValue("password", selUsuario?.password);
            setValue("repPass", selUsuario?.password);
            setValue("rol", selUsuario?.rol?.id.toString());
            clearErrors();



        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selUsuario])


    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>




    );

    if (!datos || datos.length === 0) return <p>No hay usuarios disponibles.</p>;



    const clearInputs = () => {

        reset({
            username: '',
            email: '',
            password: '',
            repPass: '',
            rol: ''

        });
        setIdToDelete(-1)
        setSelUsuario(null)
        clearErrors();
    };


    const onSubmit: SubmitHandler<UsuarioTypes> = async (dataform) => {

        const { username, email, password, rol } = dataform

        if (typeOfPanel === 'Registrar') {


            try {


                const jsondata = { username, email, password, rol: parseInt(rol) }

                console.log(jsondata)
                await apiRegistrarUsuarios(jsondata).unwrap()

                handleCloseModal()


                successAlert('Usuario Registrado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        } else if (typeOfPanel === 'Actualizar') {

            try {



                const jsondata = { "id": selUsuario?.id, username, email, password, rol: parseInt(rol) }

                console.log(jsondata)
                await apiActualizarUsuarios(jsondata).unwrap()

                handleCloseModal()


                successAlert('Usuario Actualizado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        }






    }

    const eliminarUsuario = async () => {



        try {
            await apiEliminarUsuario(idToDelete.toString()).unwrap(); // Llama a la mutación para eliminar el usuario
            successAlert('Usuario Eliminado Correctamente')

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
            <p className='font-semibold text-4xl my-4'>Usuarios</p>

            <div className='flex justify-end'>

                <div className='mb-4 w-40' >

                    <ButtonPrimaryOnclick onClick={() => {

                        setTypeOfPanel("Registrar")
                        handleOpenModal()


                    }} title='Registrar  Usuario' disable={false}></ButtonPrimaryOnclick>

                </div>

            </div>


            <div className='max-h-80 overflow-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead >
                        <tr >
                            <th className='border border-secundary4' >ID</th>
                            <th className='border border-secundary4'>Username</th>
                            <th className='border border-secundary4'>Email</th>
                            <th className='border border-secundary4'>Rol</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map(usuario => (
                            <tr key={usuario.id}>
                                <td className='border border-secundary4'>{usuario.id || ''}</td>
                                <td className='border border-secundary4'>{usuario.username || ''}</td>
                                <td className='border border-secundary4'>{usuario.email || ''}</td>

                                <td className='border border-secundary4'>{usuario.rol.nombre || ''}</td>


                                <td className='border border-secundary4 '>
                                    <div className='flex flex-row justify-center gap-3 my-1'>

                                        <MdEdit title="Editar Usuario" onClick={() => {


                                            setTypeOfPanel("Actualizar")
                                            setSelUsuario(usuario)
                                            handleOpenModal()

                                        }} className='bg-secundary2 hover:bg-secundary4 p-1 text-2xl rounded'></MdEdit>
                                        <MdDelete title="Eliminar Usuario" className='bg-secundary2  hover:bg-secundary4 p-1 text-2xl rounded' onClick={() => {
                                            setIdToDelete(usuario.id)
                                            handleConfirmationOpenModal();

                                        }} ></MdDelete>


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

                    <h2 className="text-xl font-bold text-center my-3">{typeOfPanel + " Usuario"}
                    </h2>

                    <form >


                        <FormTextInput
                            inputName="email"
                            title="Correo"
                            icon={<MdEmail />}
                            placeholder="Ingresar Correo Electronico"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Correo requerido',
                                },
                                pattern: {
                                    value: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
                                    message: 'Correo Electrónico invalido',
                                },

                            }}
                            register={register}
                            errors={errors.email} type='email'

                        />

                        <FormTextInput
                            inputName="username"
                            title="Usuario"
                            icon={<FaRegUser />}
                            placeholder="Ingresar Usuario"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Usuario requerido',
                                },
                                pattern: {
                                    value: /^[a-zA-Z 0-9]+$/,
                                    message: 'Usuario invalido',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'No más de 20 caracteres.',
                                },
                            }}
                            register={register}
                            errors={errors.username} type='text'

                        />


                        <Dropdown
                            options={{
                                required: {
                                    value: true,
                                    message: 'Rol requerido',
                                },

                            }}
                            register={register}
                            errors={errors.rol} title='Rol' placeholder='Seleccionar Rol' inputName='rol' icon={< FaBox />} >
                            {Array.isArray(datosRoles)
                                && datosRoles.map((item) => (
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

                            inputName="password"
                            title="Nueva Contraseña"
                            icon={<MdPassword />}
                            placeholder="Ingresar Contraseña"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Contraseña requerida',
                                },
                                minLength: {
                                    value: 4,
                                    message: 'Debe tener mínimo 4 caracteres',
                                },
                            }}
                            type="password"
                            register={register}
                            errors={errors.password}
                        />


                        <FormTextInput
                            inputName="repPass"
                            title="Repetir Contraseña"
                            icon={<MdPassword />}
                            placeholder="Repetir Contraseña"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Verificación requerida',
                                },
                                validate: {
                                    same: (e: string) => e === watch('password') || 'Contraseñas no coinciden',
                                },
                            }}
                            type="password"
                            register={register}
                            errors={errors.repPass}
                        />


                    </form>


                </div>


            </ModalDosOpciones>

            <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={isModalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={eliminarUsuario} >
                <div className='flex justify-center items-center'>
                    <GoAlertFill className='text-xl text-primary' />
                    <p className='font-medium'>{` ¿Desea eliminar el usuario con id ${idToDelete}?`}</p>

                </div>



            </ModalDosOpciones>



        </div>



    );
};


const PageUsuarios = withFetch(UsuarioTable);

export default PageUsuarios;