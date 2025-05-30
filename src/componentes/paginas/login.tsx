
import imglogo from '../../assets/img/bodebrand.png'
import { Link, useNavigate } from 'react-router-dom';
import { errorAlert } from '../../utils/alertNotify';
import { useForm, SubmitHandler } from "react-hook-form"
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from "../../hook/useAppDispatch"
import { login } from "../../features/user/userSlice"
import { useApiLoginMutation } from "../../api/apiSlice"
import { handleEncrypt } from '../../utils/Encriptacion';

const Login = () => {

    type FormValues = {
        username: string
        password: string
    }
    type ApiError = {
        status: number;
        data: {
            message: string;
        };
    }

    const [apiLogin] = useApiLoginMutation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (dataform) => {

        const { username, password } = dataform

        try {

            const result = await apiLogin({ username, password }).unwrap()
            console.log(result)

            const token = handleEncrypt(result.token);

            localStorage.setItem('token', token)


            const user = { id: result.id, username: result.username, email: result.email, rol: result.rol, permisos: result.permisos }


            dispatch(login(user))


            navigate('/principal/dashboard', { replace: true })


        } catch (err) {

            console.error('Error', err); // Registra el error en la consola

            const apiError = err as ApiError;
            const errorMessage = apiError.data?.message || 'Error desconocido';

            errorAlert(errorMessage)

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
                        Iniciar Sesion
                    </h2>
                </div>




                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="flex text-sm font-medium leading-6 text-gray-900">
                                Nombre de Usuario
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    {...register("username")}
                                    type="text"
                                    required

                                    className="block w-full rounded-md border-0 outline-none py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-primary hover:text-primary2">
                                        ¿Olvidaste la contraseña?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 outline-none py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>


                        </div>



                        <div className='flex flex-col justify-center items-center'>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Iniciar Sesion
                            </button>
                            <div className="text-sm flex gap-3 mt-3" >
                                <p>¿No estas registrado?</p>

                                <Link to="/registrarUsuario" className="font-semibold text-primary hover:text-primary2">
                                    Registrate
                                </Link>
                            </div>
                        </div>

                    </form>


                </div>
            </div>
        </>
    )
}

export default Login;