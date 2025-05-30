import { Link } from 'react-router-dom';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../../assets/img/bodebrand.png';
import { FaBars } from "react-icons/fa";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 ">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <FaBars
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}

                        className="z-99999 block lg:hidden  hover:text-primary"
                    >

                    </FaBars>

                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" to="/principal/dashboard">
                        <img className='w-12' src={LogoIcon} alt="Logo" />
                    </Link>
                </div>

                <div className="hidden sm:block">
                    {/* nuevo elemento */}

                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* <!-- Dark Mode Toggler --> */}

                        {/* <!-- Dark Mode Toggler --> */}

                        {/* <!-- Notification Menu Area --> */}
                        {/* <!-- Notification Menu Area --> */}

                        {/* <!-- Chat Notification Area --> */}

                        {/* <!-- Chat Notification Area --> */}
                    </ul>

                    {/* <!-- User Area --> */}
                    <DropdownUser />
                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
