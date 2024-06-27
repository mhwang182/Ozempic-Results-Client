const ReviewPageSkeleton = () => {

    const ReviewPrevieSkeleton = () => {
        return <div className="w-full max-w-[900px]">
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[100%] mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[80%] mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[90%] mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[80%] mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[90%] mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[80%] mb-2.5"></div>
        </div>
    }
    return (
        <div className="size-full animate-pulse">
            <div className="size-full flex flex-col p-4 space-y-4 items-center overflow-hidden">
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
                <ReviewPrevieSkeleton />
            </div>
        </div>
    )
}

export default ReviewPageSkeleton