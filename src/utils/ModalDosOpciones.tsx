import React from 'react';
import ReactDOM from 'react-dom';
import { CgSpinner, IoCloseSharp } from '../assets/icon/icons';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  titleFirstOption?: string;
  titleSecondOption?: string;
  onClickFirstOption: () => void;
  onClickSecondOption: () => void;
  isLoadSecondOption: boolean;


}

const ModalDosOpciones: React.FC<ModalProps> = ({ children, isOpen, titleFirstOption = "Cancelar", titleSecondOption = "Aceptar", onClickFirstOption, onClickSecondOption, isLoadSecondOption }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed z-9999 inset-0 bg-black bg-opacity-50 flex justify-center items-center" >
      <div className="bg-white md:max-h-[40rem] max-h-lvh overflow-auto py-3 px-7 rounded-lg shadow-lg  md:w-10/12 w-11/12" onClick={(e) => e.stopPropagation()}>
        <div className=' flex justify-end'>
          <IoCloseSharp onClick={() => { onClickFirstOption() }} className='hover:text-primary  text-xl' />

        </div>

        {children}


        <div className="flex justify-center items-center gap-4 mt-3">
          <button
            type="button"
            onClick={() => onClickFirstOption()}
            className="   bg-primary2 opacity-90 text-white px-3 py-1 rounded-md hover:bg-primary"
          >
            {titleFirstOption}
          </button>



          <button
            type='submit'
            onClick={() => onClickSecondOption()}
            className={`flex items-center py-1 px-3 bg-primary2 hover:bg-primary text-white rounded-md ${isLoadSecondOption ? 'cursor-not-allowed' : ''}`}
            disabled={isLoadSecondOption}

          >
            {isLoadSecondOption && <CgSpinner className='animate-spin mr-1' />}
            {titleSecondOption}
          </button>





        </div>


      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default ModalDosOpciones;