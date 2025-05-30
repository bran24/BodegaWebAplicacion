import React from 'react';
import ReactDOM from 'react-dom';


interface ModalProps {
  children: React.ReactNode;

  isOpen: boolean;

  titleFirstOption?: string;
  onClickFirstOption: () => void;


}

const ModalUnaOpcion: React.FC<ModalProps> = ({ children, isOpen, titleFirstOption = "Aceptar", onClickFirstOption, }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" >
      <div className="bg-white p-8 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className='flex flex-row justify-center gap-5'>
          <button className="mt-3 bg-primary2 opacity-90 text-white px-3 py-1 rounded-md hover:bg-primary" onClick={() => onClickFirstOption()}>
            {titleFirstOption}
          </button>

        </div>




      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default ModalUnaOpcion;