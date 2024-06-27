import { Link } from "react-router-dom"
import { UserIcon } from "../../svgs/svgs"

const SignUpTile = () => {

    return (
        <div className="w-full border rounded-md flex flex-col relative bg-white overflow-hidden mb-3 justify-center items-center space-y-2 p-4">
            <div className="h-16 w-16 bg-zinc-200 p-2 rounded-2xl"><UserIcon size="fit" /></div>
            <p className="text-2xl text-center font-semibold">Sign up to access all features!</p>
            <Link to={'/registration'}>
                <div className="py-2 px-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full text-sm text-white mr-2 mb-2 font-semibold cursor-pointer hover:brightness-95">
                    Sign Up
                </div>
            </Link>
        </div>
    )
}

export default SignUpTile