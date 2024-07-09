
interface ITabSwitchProps {
    label1: string,
    label2: string,
    page: number,
    setPage: (page: number) => void
}

const TabSwitch = (props: ITabSwitchProps) => {

    const { label1, label2, page, setPage } = props;

    const gradientBg = "bg-gradient-to-r from-sky-500 to-teal-500 text-white";

    const whiteBg = "bg-white text-gray-800 border";

    return <div className="w-full flex cursor-pointer">
        <div
            className={`w-full flex justify-center font-semibold rounded-l px-5 py-1 ${page === 0 ? gradientBg : whiteBg} border-gray-200 hover:brightness-95`}
            onClick={() => { setPage(0) }}
        >
            {label1}
        </div>
        <div
            className={`w-full flex justify-center font-semibold rounded-r px-5 py-1 ${page === 1 ? gradientBg : whiteBg} border-gray-200 hover:brightness-95`}
            onClick={() => { setPage(1) }}
        >
            {label2}
        </div>
    </div>
}

export default TabSwitch