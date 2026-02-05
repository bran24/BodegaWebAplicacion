
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SwitchCustomProps<T extends FieldValues> {
  register: UseFormRegister<T>,
  name: Path<T>;
  title: string;
  icon?: React.ReactNode;
  errors?: FieldError;
  disabled?:boolean;
}

const SwitchCustom = <T extends FieldValues,>({
  register,
  name,
  title,
  errors,
  disabled =false
}: SwitchCustomProps<T>) => {



  return (
    <div className="w-full mt-2 mb-5">
      <p className="font-semibold pl-2.5 text-gray-800">{title}</p>
      <div className="flex items-center gap-2 pl-2">
      

        <label className="inline-flex items-center gap-2">
          <span className="text-slate-600 text-sm">No</span>
          <div className="relative inline-block w-11 h-5">
            <input
              type="checkbox"
              {...register(name)}
              disabled={disabled}
              
              className={ ` ${disabled ?'bg-neutral-400 opacity-10 cursor-not-allowed' : ''} peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300`}
            />
            <label className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer" />
          </div>
          <span className="text-slate-600 text-sm">Sí</span>
        </label>
      </div>
      { errors && (
        <span className="text-red-500 text-xs sm:text-sm ml-1">{errors.message}</span>
      )}
    </div>
  );
};

export default SwitchCustom;