import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MedicationOptions, SelectOption } from '../../utils/contants';
import SurveyInput from '../Common/SurveyInput';
import SurveySelect from '../Common/ReactSelect';


interface INewFormPostProps {
    onFormSubmit: SubmitHandler<{ weightLost: string, medicationUsed: SelectOption, caption: string }>,
    submitFormRef: React.RefObject<HTMLFormElement>,
    isUploading: boolean
}

const NewPostForm = ({ onFormSubmit, submitFormRef, isUploading }: INewFormPostProps) => {

    const { control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            weightLost: "0",
            medicationUsed: undefined as unknown as SelectOption,
            caption: ""
        }
    });

    const medicationOptions = MedicationOptions.map((opt, index) => { return { label: `${opt.OfficialName} (${opt.TradeName})`, value: index } })

    return (
        <>
            {isUploading ?
                <div className='size-full'>loading...</div> :
                <form className="size-full flex flex-col" onSubmit={handleSubmit(onFormSubmit)} ref={submitFormRef}>
                    <div className='h-fit'>
                        <Controller
                            name='weightLost'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <SurveyInput
                                    {...field}
                                    title='Weight Lost (lbs)'
                                    type="number"
                                    error={errors.weightLost}
                                    errorMessage='*This field is required'
                                />
                            }
                        />
                    </div>
                    <br />
                    <Controller
                        name='medicationUsed'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <SurveySelect
                            {...field}
                            title="Medication Used"
                            options={medicationOptions}
                            error={errors.medicationUsed}
                            errorMessage='*This field is required'
                        />}
                    />
                    <br />
                    <Controller
                        name='caption'
                        control={control}
                        rules={{ required: true, maxLength: 150 }}
                        render={({ field }) =>
                            <SurveyInput
                                {...field}
                                title='Caption (150 character max)'
                                isTextArea
                                error={errors.caption}
                                errorMessage='*This field is required'
                            />
                        }
                    />
                </form>
            }
        </>

    )
}

export default NewPostForm