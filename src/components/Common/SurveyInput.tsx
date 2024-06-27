interface ISurveyInputProps {
    title: string,
    value: string,
    onChange?: (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => void,
    isTextArea?: boolean,
    type?: string,
    error?: any,
    errorMessage?: string
}

const SurveyInput = (props: ISurveyInputProps) => {

    const {
        title,
        value,
        type,
        onChange,
        errorMessage,
        error,
        isTextArea
    } = props;

    return (
        <>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                {title}
            </label>
            {isTextArea ?
                <textarea value={value} onChange={onChange} className="mt-2 w-full flex-grow rounded-[4px] p-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500" />
                :
                <div className="mt-2 flex justify-center rounded-[4px] ring-1 ring-inset ring-gray-300 focus:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500">
                    <input
                        type={type ? type : "text"}
                        value={value}
                        onChange={onChange}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                    />
                </div>
            }
            {error && <span className="text-sm text-red-600">{errorMessage}</span>}
        </>
    )
}

export default SurveyInput