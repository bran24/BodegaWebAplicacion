import { FaSpinner } from "react-icons/fa";

const Loader = () => {
    return (
        <div className="flex w-full h-screen fixed min-h-screen justify-center items-center">

            <FaSpinner className="animate-spin h-16 w-16 mr-2" />

        </div>


    )

}

export default Loader;