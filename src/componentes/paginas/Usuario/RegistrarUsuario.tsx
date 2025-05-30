
import imglogo from '../../../assets/img/bodebrand.png'
import { Link, useNavigate } from 'react-router-dom';

import { useForm, SubmitHandler } from "react-hook-form"
import 'react-toastify/dist/ReactToastify.css';
import { infoAlert } from "../../utils/alertNotify"
import { useAppDispatch } from "../../../hook/useAppDispatch"
import { login } from "../../../features/user/userSlice"
import FormTextInput from '../../atomos/formInputs/formTextInput';
import { FaRegUser, MdEmail, MdPassword } from '../../../assets/icon/icons';
import { useApiCrearUsuarioMutation } from "../../../api/apiSlice"
import { handleEncrypt } from '../../../utils/Encriptacion'

const RegistrarUsuario = () => {

    type FormValues = {
        email: string
        username: string,
        password: string,
        repPass: string
    }
    const [apiCreateUser] = useApiCrearUsuarioMutation()

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const {
        register,
        clearErrors,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (dataform) => {

        // crypto

        const { username, email, password } = dataform

        try {

            const result = await apiCreateUser({ username, email, password, rol: 1 }).unwrap()

            const token = handleEncrypt(result.token);

            localStorage.setItem('token', token)

            const user = { id: result.result.id, username: result.result.username, email: result.result.email, rol: result.result.rol }
            console.log(result, result)
            console.log('user', user)


            dispatch(login(user))

            navigate('/principal/dashboard', { replace: true })


        } catch (error) {
            console.error(error)

        }


    }

    return (

        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src={imglogo}
                        className="mx-auto h-40 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Registrar Usuario
                    </h2>
                </div>




                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


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

                        <FormTextInput

                            inputName="password"
                            title="Contraseña"
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



                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Registrar
                            </button>
                        </div>

                        <div className='flex flex-col justify-center items-center'>

                            <div className="text-sm flex gap-3 mt-3" >
                                <p>¿Ya tienes una cuenta?</p>

                                <Link to="/" className="font-semibold text-primary hover:text-primary2">
                                    Iniciar Sesion
                                </Link>
                            </div>
                        </div>

                    </form>


                </div>
            </div>
        </>
    )
}

export default RegistrarUsuario;