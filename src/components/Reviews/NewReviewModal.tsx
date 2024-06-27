import { useState } from "react";
import { CloseIcon } from "../../svgs/svgs"
import { Rating } from "react-simple-star-rating";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SelectOption, SideEffectOptions, medicationOptions } from "../../utils/contants";
import SurveySelect from "../Common/ReactSelect";
import MultiSelect from "../Common/MultiSelect";
import SurveyInput from "../Common/SurveyInput";
import ModalBackground from "../Common/ModalBackground";
import { useReviewsContext } from "../../context/ReviewsContext";

const NewReviewModal = ({ onClose }: { onClose: () => void }) => {

    const [rating, setRating] = useState(0);

    const { addReview } = useReviewsContext();

    const { control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            medicationUsed: undefined as unknown as SelectOption,
            sideEffects: [] as unknown as SelectOption,
            reviewBody: ""
        }
    });

    const onFormSubmit: SubmitHandler<{
        medicationUsed: SelectOption,
        sideEffects: SelectOption,
        reviewBody: string
    }> = (data) => {
        console.log({ ...data, rating });
        addReview({ ...data, rating });
        onClose();
    }

    return (
        <ModalBackground>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left 
                                    shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-[600px] w-full
                                    min-h-fit
                                    ">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col space-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <h2 className='w-full font-semibold'>{"New Review: "} </h2>
                        <button
                            onClick={onClose}
                            className=""
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <form className="size-full flex flex-col space-y-2" onSubmit={handleSubmit(onFormSubmit)}>

                        <Rating
                            initialValue={rating}
                            fillColor="#0ea5e9"
                            SVGclassName={'inline-block'}
                            onClick={(value) => { setRating(value) }}
                        />
                        <Controller
                            name='medicationUsed'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <SurveySelect
                                {...field}
                                title="Medication"
                                options={medicationOptions}
                                error={errors.medicationUsed}
                                errorMessage='*This field is required'
                            />}
                        />
                        <Controller
                            name='sideEffects'
                            control={control}
                            render={({ field }) => <MultiSelect
                                {...field}
                                title="Side Effects"
                                options={SideEffectOptions}
                                error={errors.medicationUsed}
                            />}
                        />
                        <div className="min-h-44 flex flex-col">
                            <Controller
                                name='reviewBody'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) =>
                                    <SurveyInput
                                        {...field}
                                        title='Review'
                                        isTextArea
                                        error={errors.reviewBody}
                                        errorMessage='*This field is required'
                                    />

                                }
                            />
                        </div>
                        <button
                            className="py-1 px-2 rounded-md font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                        >
                            Submit
                        </button>
                    </form>

                </div>
            </div>
        </ModalBackground >
    )
}

export default NewReviewModal