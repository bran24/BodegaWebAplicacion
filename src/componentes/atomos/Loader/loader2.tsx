import { FaSpinner } from "react-icons/fa";

const Loader2 = () => {
    return (
        <div className="flex min-h-screen justify-center items-center w-full max-w-full h-screen rounded-sm border  bg-white p-3
        
        
        ">

            <FaSpinner className="animate-spin h-16 w-16 mr-2 text-primary" />

        </div>


    )

}

export default Loader2;