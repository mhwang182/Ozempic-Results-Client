import { useUserAuthContext } from "../../context/UserAuthContext"
import SignInContent from "../Layout/SignInContent";
import TabSwitch from "../Common/TabSwitch";
import { useState } from "react";
import SignUp from "../Layout/SignUpContent";

const Registration = () => {

    const { token } = useUserAuthContext();

    const [page, setPage] = useState(0);

    const RegisterButton = (props: { title: string }) => {
        return (
            <button
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-sky-500 to-teal-500 
                px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline 
                focus-visible:outline-2 focus-visible:outline-offset-2 hover:brightness-95"
            >
                {props.title}
            </button>
        )
    }

    return (

        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
            {token && token.length > 0 ?
                <>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2
                            className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                        >
                            You Are Signed In!
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <RegisterButton
                            title={'View Info'}
                        />
                        <br />
                        <RegisterButton
                            title={'Log Out'}
                        />
                    </div>
                </> :
                <>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <TabSwitch label1={"Sign In"} label2={"Sign Up"} page={page} setPage={setPage} />
                    </div>
                    {page ?
                        <SignUp /> :
                        <SignInContent />
                    }

                </>
            }
        </div>
    )
}

export default Registration