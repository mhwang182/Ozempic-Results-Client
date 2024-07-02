import { useUserAuthContext } from "../../context/UserAuthContext";
import RegistrationButton from "../Common/RegistrationButton";
import SurveyInput from "../Common/SurveyInput"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Tooltip from "../Tooltip";
import { NewUserDTO } from "../../utils/contants";

const SingUpContent = () => {

    type SignUpFields = {
        Username: string,
        Email: string,
        Password: string,
        Firstname: string,
        Lastname: string,
        SignUpCode?: string
    }

    const { createUser, loginAlert } = useUserAuthContext();

    const { control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            Username: "",
            Email: "",
            Password: "",
            Firstname: "",
            Lastname: "",
            SignUpCode: ""
        }
    })

    const onSubmit: SubmitHandler<SignUpFields> = (data) => {
        const newUser: NewUserDTO = {
            username: data.Username,
            email: data.Email,
            password: data.Password,
            firstname: data.Firstname,
            lastname: data.Lastname,
        }
        createUser(newUser, data.SignUpCode);
    }

    const genericMessage = "*This field is required";

    return (
        <div className="min-h-screen max-h-full pt-10 flex flex-col">
            <h2
                className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
            >
                Sign Up Info
            </h2>
            {loginAlert &&
                <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                    <p className="text-red-600 mt-3">*{loginAlert}</p>
                </div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-6">
                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="Username"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="Username:"
                                    {...field}
                                    error={errors.Username}
                                    errorMessage={genericMessage}
                                />}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="Email"
                            control={control}
                            rules={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="Email"
                                    {...field}
                                    error={errors.Email}
                                    errorMessage={"*Please Enter a Valid Email"}
                                />}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="Password"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="Password"
                                    {...field}
                                    type="password"
                                    error={errors.Password}
                                    errorMessage={genericMessage}
                                />}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="Firstname"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="First Name:"
                                    {...field}
                                    error={errors.Firstname}
                                    errorMessage={genericMessage}
                                />}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="Lastname"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="Last Name:"
                                    {...field}
                                    error={errors.Lastname}
                                    errorMessage={genericMessage}
                                />}
                        />
                    </div>
                </div>
                <div className="mt-6 relative group">

                    <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                        <Controller
                            name="SignUpCode"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    title="Sign Up Code:"
                                    {...field}
                                    error={errors.SignUpCode}
                                    errorMessage={genericMessage}
                                />}
                        />
                        <Tooltip text={"Email mhwang.dev@gmail.com for a sign up code!"} />
                    </div>
                </div>
                <div className="sm:max-w-sm sm:w-full sm:mx-auto mt-10">
                    <RegistrationButton label="Sign Up" />
                </div>
            </form>
        </div>
    )
}

export default SingUpContent