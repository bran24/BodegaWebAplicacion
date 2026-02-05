
interface ButtonPrimaryTypes {
  title: string,
  onClick?: () => void,
  disable?: boolean


}

const ButtonPrimaryOnclick = ({
  title, onClick, disable = false,
}: ButtonPrimaryTypes) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex space-x-1 items-center justify-center py-2 px-3 font-medium text-secundary3 bg-primary2 hover:bg-primary rounded-md w-full focus:outline-none transition duration-300
    ${disable ? 'cursor-not-allowed ' : ' '}
    ${disable ? '' : ''}`}
    disabled={disable}
  >
    <div className="whitespace-wrap">{title}</div>

  </button>
);



export default ButtonPrimaryOnclick;
