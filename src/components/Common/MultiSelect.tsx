import Select, { MultiValue } from 'react-select';
import { SelectOption } from '../../utils/contants';

interface ISelectProps {
    title: string,
    options: SelectOption[],
    value?: SelectOption | undefined,
    onChange?: (options: MultiValue<SelectOption>) => void,
    error?: any,
    errorMessage?: string
}

const MultiSelect = (props: ISelectProps) => {

    const {
        title,
        options,
        value,
        onChange,
        error,
        errorMessage
    } = props;

    return (
        <>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</label>
            <Select
                isSearchable={false}
                options={options}
                value={value}
                onChange={onChange}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#0ea5e9',
                    },
                })}
                isMulti={true}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
            {error && <span className="text-sm text-red-600">{errorMessage}</span>}
        </>
    )
}

export default MultiSelect