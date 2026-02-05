/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../assets/img/bodebrand.png'
import { MdDashboard } from "react-icons/md";
import { FaBox, FaArrowLeft, FaAngleUp, FaRegRectangleList, FaRegUser, MdPaid, FaBottleWater } from './../../../assets/icon/icons'
import SidebarLinkGroup from './SidebarLinkGroup';
import { useAppSelector } from "../../../hook/useAppSelector";
interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;

}


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {


    const location = useLocation();
    const { pathname } = location

    const userPermisos = useAppSelector((state) => state.user.permisos);
    const requiredPermisosUsuario = [2, 3, 4, 5]
    const hasRequiredPermisosUs = requiredPermisosUsuario.every((permiso) =>
        userPermisos.includes(permiso)
    );
    const trigger = useRef<any>(null)
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );
    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);





    return (


        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden bg-secundary duration-300 ease-linea lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >

            <div className="flex items-center justify-between lg:justify-center gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/principal/dashboard">
                    <img src={Logo} className="w-36" alt="Logo" />
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <FaArrowLeft className='w-5 h-5' />
                </button>

            </div>
            <div className='flex  flex-col overflow-auto duration-300 ease-linear'>
                <nav className='mt-5 mb-4 ml-4 text-sm font-semibold'>

                    <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                        MENU
                    </h3>

                    <ul className="mb-6 flex flex-col gap-1.5">

                        <li>
                            <NavLink
                                to="/principal/dashboard"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary2  ${pathname.includes('dashboard') &&
                                    'bg-primary'
                                    }`}
                            >
                                < MdDashboard />
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/principal/productos"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary2  ${pathname.includes('productos') &&
                                    'bg-primary'
                                    }`}
                            >
                                <  FaBox />
                                Productos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/principal/clientes"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary2  ${pathname.includes('clientes') &&
                                    'bg-primary'
                                    }`}
                            >
                                < FaRegUser />
                                Clientes
                            </NavLink>
                        </li>


                        {hasRequiredPermisosUs && (
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/principal/ventas' || pathname.includes('ventas')
                                }
                            >
                                {(handleClick, open) => (
                                    <>
                                        <NavLink
                                            to="#"
                                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-primary2 ${(pathname === '/principal/ventas/registrarVentas' ||
                                                pathname === '/principal/ventas/consultarVentas') &&
                                                'bg-primary'
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                            }}
                                        >
                                            <FaRegUser />
                                            Ventas
                                            <FaAngleUp
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 ${open && 'rotate-180'
                                                    }`}
                                            />
                                        </NavLink>

                                        {/* Dropdown con ambas opciones */}
                                        <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                <li>
                                                    <NavLink
                                                        to="/principal/ventas/registrarVentas"
                                                        className={({ isActive }) =>
                                                            'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                            (isActive && '!text-primary2')
                                                        }
                                                    >Registrar Ventas
                                                    </NavLink>
                                                </li>

                                                <li>
                                                    <NavLink
                                                        to="/principal/ventas/consultarVentas"
                                                        className={({ isActive }) =>
                                                            'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                            (isActive && '!text-primary2')
                                                        }
                                                    >Consultar Ventas
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </SidebarLinkGroup>
                        )}








                        <li>
                            <NavLink
                                to="/principal/proveedores"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary2  ${pathname.includes('proveedores') &&
                                    'bg-primary'
                                    }`}
                            >
                                < FaBox />
                                Proveedores
                            </NavLink>
                        </li>




                        {hasRequiredPermisosUs && <SidebarLinkGroup
                            activeCondition={
                                pathname === '/principal/usuarios' || pathname.includes('usuarios')
                            }

                        >
                            {
                                (handleClick, open) => {
                                    return (
                                        <>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-primary2  ${((pathname === '/principal/usuarios/roles') ||

                                                    (pathname === '/principal/usuarios/usuarios') || (pathname === '/principal/usuarios/permisos'))

                                                    &&
                                                    'bg-primary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                < FaRegUser />

                                                Usuarios
                                                <FaAngleUp className={`absolute right-4 top-1/2 -translate-y-1/2
                                                ${open && 'rotate-180'
                                                    } `} />

                                            </NavLink>
                                            {/* <!-- Dropdown Menu Start --> */}

                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="usuarios/usuarios"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                                (isActive && '!text-primary2')
                                                            }
                                                        >
                                                            Usuarios
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>




                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="usuarios/roles"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                                (isActive && '!text-primary2')
                                                            }
                                                        >
                                                            Roles
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="usuarios/permisos"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                                (isActive && '!text-primary2')
                                                            }
                                                        >
                                                            Permisos
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>


                                        </>



                                    )

                                }

                            }


                        </SidebarLinkGroup>}



                        <SidebarLinkGroup
                            activeCondition={
                                pathname === '/principal/reportes' || pathname.includes('reportes')
                            }

                        >
                            {
                                (handleClick, open) => {
                                    return (
                                        <>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-primary2  ${(pathname === '/principal/reportes/ventas'
                                                ) &&
                                                    'bg-primary'
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(true);
                                                }}
                                            >
                                                < FaRegRectangleList />

                                                Reportes
                                                <FaAngleUp className={`absolute right-4 top-1/2 -translate-y-1/2
                                                ${open && 'rotate-180'
                                                    } `} />

                                            </NavLink>
                                            {/* <!-- Dropdown Menu Start --> */}
                                            <div
                                                className={`translate transform overflow-hidden ${!open && 'hidden'
                                                    }`}
                                            >
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="reportes/caja"
                                                            className={({ isActive }) =>
                                                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-secundary3 duration-300 ease-in-out hover:text-primary2 ' +
                                                                (isActive && '!text-primary2')
                                                            }
                                                        >
                                                            Caja
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>



                                        </>



                                    )

                                }

                            }


                        </SidebarLinkGroup>


                        <li>
                            <NavLink
                                to="/principal/chatbotIA"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary2  ${pathname.includes('chatIA') &&
                                    'bg-primary'
                                    }`}
                            >
                                <  FaBox />
                                ChatBot IA
                            </NavLink>
                        </li>


                    </ul>

                </nav>


            </div>



        </aside>






    )
}

export default Sidebar