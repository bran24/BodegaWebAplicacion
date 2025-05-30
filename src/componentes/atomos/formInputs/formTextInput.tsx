/* eslint linebreak-style: ["error", "windows"] */

import { ReactNode } from "react";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";


interface FormTextProps<T extends FieldValues> {
  register: UseFormRegister<T>,
  errors?: FieldError;
  inputName: Path<T>,
  title: string,
  icon: ReactNode,
  placeholder: string,
  options: object
  type: string,
  disabled?: boolean,


}


const FormTextInput = <T extends FieldValues,>({
  register,
  errors,
  inputName,
  title,
  icon,
  placeholder,
  options,
  type,
  disabled,
}: FormTextProps<T>) => {
  return (
    <label htmlFor={inputName} className="w-full mt-2 ">
      <p className="font-semibold pl-2.5 text-gray-800 mb-2">{title}</p>
      <div className="flex flex-col w-full mb-2">
        <div className="flex justify-center w-full rounded-xl border border-gray-300 focus-within:border-primary">
          <div className="w-9 flex justify-center items-center p-1 bg-gray-200 text-primary font-semibold rounded-l-xl border-r border-gray-300 ">
            {icon}
          </div>
          <input
            {...(!disabled && { placeholder })}
            {...(type === 'password' && {
              autoComplete: 'new-password',
              type: 'password',
            })}
            {...(type === 'range' && {
              autoComplete: 'Deslice',
              type: 'range',
            })}
            {...(type === 'number' && {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              type: 'number',
            })}
            {...(type === 'money' && {
              inputMode: 'decimal',
              pattern: '[0-9.]*',
              step: 0.01,
              type: 'number',
            })}
            {...(type === 'date' && {
              type: 'date',
            })}
            {...(type === 'text' && {
              type: 'text',
            })}
            id={inputName}
            disabled={disabled}
            className={`py-1 px-2 rounded-r-xl w-full sm:w-full focus:outline-none bg-white ${disabled ? 'cursor-not-allowed' : ''
              } `}
            {...register(inputName, options)}
          />
        </div>



        <span className="text-red-500 text-xs sm:text-sm ml-1">
          {errors?.message && errors.message as string}
        </span>
      </div>
    </label>
  );
}




export default FormTextInput;
