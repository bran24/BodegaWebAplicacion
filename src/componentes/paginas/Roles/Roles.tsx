// components/RolesTable/RolesTable.tsx
import React, { useEffect, useState } from 'react';
import { PermisosporTipo, Roles, } from '../../../api/types';
import withFetch from './withFetch';
import { FaBox, GoAlertFill, MdDelete, MdEdit, } from '../../../assets/icon/icons'
import ModalDosOpciones from '../../../utils/ModalDosOpciones';
import { useForm, SubmitHandler } from "react-hook-form"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import ButtonPrimaryOnclick from '../../atomos/buttons/buttonPrimaryOnclick';
import { errorAlert, successAlert } from '../../../utils/alertNotify';
import Loader2 from '../../atomos/Loader/loader2';
import { useApiEliminarRolMutation, useApiActualizarRolMutation, useApiRegistrarRolMutation, useApiRegistrarRolPermisoMutation, useApiObtenerPermisosPorRolMutation, useApiActualizarRolPermisoMutation, useApiEliminarRolPermisoMutation } from '../../../api/apiSlice';


interface RolesTableProps {
    datos: Roles[] | undefined;
    load: boolean;
    err: unknown;
    dataPermisos: PermisosporTipo[] | undefined;

}

const RolesTable: React.FC<RolesTableProps> = ({ datos, load, err, dataPermisos }) => {


    interface RolTypes {
        id: number;
        nombre: string;
        descripcion: string;
        permisos: string[
        ];
        // Puede ser Date si prefieres trabajar con objetos Date

    }
    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }
    const [visibleTipos, setVisibleTipos] = useState<number[]>([]);
    const [apiEliminarRol] = useApiEliminarRolMutation()
    const [apiRegistrarRoles] = useApiRegistrarRolMutation()
    const [apiPermisosporRol] = useApiObtenerPermisosPorRolMutation()
    const [apiRegistrarRolPermiso] = useApiRegistrarRolPermisoMutation()
    const [apiActualizarRolPermiso] = useApiActualizarRolPermisoMutation()
    const [apiActualizarRoles] = useApiActualizarRolMutation()
    const [apiEliminarRolPermiso] = useApiEliminarRolPermisoMutation()
    const [selRol, setSelRol] = useState<Roles | null>(null)
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
    } = useForm<RolTypes>();

    useEffect(() => {

        fetchPermisos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selRol])

    const fetchPermisos = async () => {
        if (selRol && typeOfPanel === 'Actualizar') {
            try {
                const res = await apiPermisosporRol(selRol.id).unwrap();

                if (Array.isArray(res) && res.length > 0) {
                    const permisosres = res.map(item => item?.permiso?.id.toString()).filter(id => id !== undefined);


                    console.log(permisosres)
                    setValue("permisos", permisosres);


                } else {
                    console.log("No se encontraron permisos");
                }



                setValue("nombre", selRol?.nombre || '');
                setValue("descripcion", selRol?.descripcion || '');



                clearErrors(); // Limpia errores si es necesario
            } catch (error) {
                console.error('Error al obtener permisos:', error);
            }
        }
    };


    if (load) return <Loader2 />;
    if (err) return (
        <>
            <p className='text-4xl '>Error al cargar los datos</p>
            <Loader2 />

        </>




    );

    if (!datos || datos.length === 0) return <p>No hay roless disponibles.</p>;



    const clearInputs = () => {

        reset({
            nombre: '',
            descripcion: ''

        });
        setIdToDelete(-1)
        setSelRol(null)
        clearErrors();
    };

    const toggleTipo = (id: number) => {
        setVisibleTipos((prev) =>
            prev.includes(id) ? prev.filter((tipoId) => tipoId !== id) : [...prev, id]
        );
    };

    const onSubmit: SubmitHandler<RolTypes> = async (dataform) => {

        const { nombre, descripcion, permisos } = dataform



        console.log(permisos, nombre, descripcion)

        if (typeOfPanel === 'Registrar') {


            try {


                const jsondata = { nombre, descripcion }


                const resultreg = await apiRegistrarRoles(jsondata).unwrap()
                console.log(resultreg)

                if (permisos.length > 0) {
                    const resultreg2 = await apiRegistrarRolPermiso({ rolId: resultreg.result.id, permisosId: permisos })

                    console.log(resultreg2)
                }

                handleCloseModal()
                successAlert('Rol Registrado')

            } catch (error) {
                handleCloseModal()
                console.error(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        } else if (typeOfPanel === 'Actualizar') {

            try {



                const jsondata = { "id": selRol?.id, nombre, descripcion }

                console.log(jsondata)
                await apiActualizarRoles(jsondata).unwrap()
                if (permisos.length > 0) {
                    const resultreg2 = await apiActualizarRolPermiso({ rolId: selRol?.id, permisosId: permisos })

                    console.log(resultreg2)
                }



                handleCloseModal()


                successAlert('Rol Actualizado')

            } catch (error) {
                handleCloseModal()
                console.log(error)
                const apiError = error as ApiError;
                const errorMessage = apiError.data?.message || 'Error desconocido';

                errorAlert(errorMessage)

            }

        }






    }

    const eliminarRol = async () => {



        try {

            await apiEliminarRolPermiso(idToDelete.toString()).unwrap(); // Llama a la mutación para eliminar el roles


            successAlert('Rol Eliminado Correctamente')

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
            <p className='font-semibold text-4xl my-4'>Roles</p>

            <div className='flex justify-end'>

                <div className='mb-4 w-auto' >

                    <ButtonPrimaryOnclick onClick={() => {

                        setTypeOfPanel("Registrar")
                        handleOpenModal()


                    }} title='Registrar Rol' disable={false}></ButtonPrimaryOnclick>

                </div>

            </div>


            <div className='max-h-80 overflow-auto'>
                <table className="table-auto border shadow-sm border-secundary4 w-full bg-white text-center">
                    <thead >
                        <tr >
                            <th className='border border-secundary4'>ID</th>
                            <th className='border border-secundary4'>Nombre</th>
                            <th className='border border-secundary4'>Descripcion</th>
                            <th className='border border-secundary4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map(rol => (
                            <tr key={rol.id}>
                                <td className='border border-secundary4'>{rol.id || ''}</td>
                                <td className='border border-secundary4'>{rol.nombre || ''}</td>
                                <td className='border border-secundary4'>{rol.descripcion || ''}</td>

                                <td className='border border-secundary4 '>
                                    <div className='flex flex-row justify-center gap-3 my-1'>

                                        <MdEdit title="Editar Rol" onClick={() => {


                                            setTypeOfPanel("Actualizar")
                                            setSelRol(rol)
                                            handleOpenModal()

                                        }} className='bg-secundary2 hover:bg-secundary4 p-1 text-2xl rounded'></MdEdit>
                                        <MdDelete title="Eliminar Rol" className='bg-secundary2  hover:bg-secundary4 p-1 text-2xl rounded' onClick={() => {
                                            setIdToDelete(rol.id)
                                            handleConfirmationOpenModal();

                                        }} ></MdDelete>


                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>



            <ModalDosOpciones
                isLoadSecondOption={isLoadModal}
                isOpen={isModalOpen}
                onClickFirstOption={handleCloseModal}
                onClickSecondOption={handleSubmit(onSubmit)}
            >



                <div >

                    <h2 className="text-xl font-bold text-center my-3">{typeOfPanel + " Rol"}
                    </h2>

                    <form>
                        <FormTextInput
                            inputName="nombre"
                            title="Nombre"
                            icon={< FaBox />}
                            placeholder="Ingresar Rol"
                            options={{
                                required: {
                                    value: true,
                                    message: 'Rol requerido',
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


                        <div className="w-full">
                            <h2 className="font-semibold pl-2.5 text-gray-800 mb-2">Selecciona los permisos</h2>
                            <div className="flex flex-col w-full mb-2 overflow-auto max-h-40">
                                {dataPermisos?.map((tipoPermiso) => (
                                    <div key={tipoPermiso.id} className="mb-2">
                                        {/* Header del tipo de permiso */}
                                        <div
                                            className="flex justify-between items-center cursor-pointer bg-gray-200 p-2 rounded"
                                            onClick={() => toggleTipo(tipoPermiso.id)}
                                        >
                                            <span className="font-semibold text-gray-800">{tipoPermiso.nombre}</span>
                                            <span>{visibleTipos.includes(tipoPermiso.id) ? '-' : '+'}</span>
                                        </div>

                                        {/* Mostrar los permisos si el tipo es visible */}
                                        {visibleTipos.includes(tipoPermiso.id) && (
                                            <div key={tipoPermiso.id} className="ml-4 mt-2">
                                                {tipoPermiso.permisos.map((permiso) => (
                                                    <div className="flex items-center space-x-3" key={permiso.id}>
                                                        <input
                                                            type="checkbox"
                                                            value={permiso.id}
                                                            {...register('permisos')}
                                                            className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                                                        />

                                                        <span className="text-gray-700">{permiso.nombre}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>





                    </form>

                </div>


            </ModalDosOpciones>

            <ModalDosOpciones isLoadSecondOption={isLoadConfirmationModal} isOpen={isModalConfirmationOpen} onClickFirstOption={handleConfirmationCloseModal} onClickSecondOption={eliminarRol} >
                <div className='flex justify-center items-center'>
                    <GoAlertFill className='text-xl text-primary' />
                    <p className='font-medium'>{` ¿Desea eliminar el roles con id ${idToDelete}?`}</p>

                </div>



            </ModalDosOpciones>



        </div>



    );
};


const PageRoles = withFetch(RolesTable);

export default PageRoles;