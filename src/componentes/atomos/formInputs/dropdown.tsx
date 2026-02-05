import { ReactNode } from 'react';
import { IoIosArrowDown } from '../../../assets/icon/icons'
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";
// Definición de tipos para las props


interface FormTextProps<T extends FieldValues> {
  register: UseFormRegister<T>,
  errors?: FieldError;
  inputName: Path<T>,
  title: string,
  icon: ReactNode,
  placeholder: string,
  options: object
  children: ReactNode;
  disabled?: boolean;



}



const Dropdown = <T extends FieldValues,>({
  register,
  errors,
  inputName,
  title,
  icon,
  placeholder,
  options,
  children,
  disabled
}: FormTextProps<T>) => {

  return (
    <div className="w-full mt-2 mb-5">
      <p className="font-semibold pl-2.5 text-gray-800">
        {title}
      </p>
      <label htmlFor={inputName} className="flex flex-col">
        <div className={`flex relative border border-gray-300 rounded-xl`}>
          <div className="w-9 flex items-center justify-center p-1 bg-gray-200 text-primary font-semibold rounded-l-xl border-r border-gray-300">
            {icon}
          </div>
          <select
            {...register(inputName, options)}
            name={inputName}
            id={inputName}
            disabled={disabled}
            className={`appearance-none bg-white pl-3 py-1.5 text-sm rounded-r-xl w-full ring-1 ring-gray-300 focus:outline-none ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
          >
            <option value="" >
              {placeholder}
            </option>
            {children}
          </select>
          <span className="absolute right-0 top-1.5 h-5 w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center rounded-full bg-white">
            <IoIosArrowDown />
          </span>
        </div>
        <span className="text-red-500 text-xs sm:text-sm ml-1">{errors?.message}</span>


      </label>
    </div>
  );
};

export default Dropdown;