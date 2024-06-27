import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useUserAuthContext } from "../../context/UserAuthContext";
import SurveyInput from "../Common/SurveyInput";
import RegistrationButton from "../Common/RegistrationButton";

const SignInContent = () => {

    const { login, loginAlert } = useUserAuthContext();

    const { control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            Email: "",
            Password: ""
        }
    });

    const onSubmit: SubmitHandler<{ Email: string, Password: string }> = (data) => {
        login({ email: data.Email, password: data.Password });
    }

    return <>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2
                className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
            >
                Sign in to your account
            </h2>
            {loginAlert && <p className="text-red-600 mt-3">*{loginAlert}</p>}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-10">
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
            <div className="mt-10">
                <div className="sm:max-w-sm sm:w-full sm:mx-auto">
                    <Controller
                        name="Password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) =>
                            <SurveyInput
                                title="Password"
                                {...field}
                                error={errors.Password}
                                errorMessage={"*This field is required"}
                                type="password"
                            />}
                    />
                </div>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <RegistrationButton label="Sign In" />
            </div>
        </form>
    </>
}

export default SignInContent