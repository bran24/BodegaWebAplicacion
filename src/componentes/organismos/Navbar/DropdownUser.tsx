import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../../../utils/ClickOutside';
import UserOne from '../../../assets/img/persona.jpg';
import { useAppDispatch } from "../../../hook/useAppDispatch"

import { FaChevronDown, FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { logout } from "../../../features/user/userSlice"
import { } from "../../../assets/icon/icons"
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../../../hook/useAppSelector"

const DropdownUser = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch();





  const navigate = useNavigate()
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black ">
            {user.email}
          </span>
          <span className="block text-xs">{user.rol?.nombre ?? "---"}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>
        < FaChevronDown className="hidden fill-current sm:block" />

      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-6 flex w-60 flex-col rounded-sm border
            bg-white shadow-default `}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <FaRegUser />
                Mi Perfil
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <IoSettingsOutline />
                Cofiguracion
              </Link>
            </li>
          </ul>
          <button onClick={() => {
            localStorage.setItem('token', '')
            dispatch(logout())
            navigate('/', { replace: true })


          }} className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">

            <CiLogout />
            Finalizar Sesion
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
