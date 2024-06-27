import { useUserAuthContext } from "../../context/UserAuthContext";

const RegistrationButton = ({ label }: { label: string }) => {

    const { isUserLoading } = useUserAuthContext();

    return (
        <button
            className="flex w-full justify-center rounded-md bg-gradient-to-r from-sky-500 to-teal-500 px-3 py-1.5 
                        text-sm font-semibold leading-6 text-white shadow-sm hover:brightness-95 focus-visible:outline 
                        focus-visible:outline-2 focus-visible:outline-offset-2"
            disabled={isUserLoading}
        >
            {isUserLoading ? "Loading..." : label}
        </button>
    )
}

export default RegistrationButton