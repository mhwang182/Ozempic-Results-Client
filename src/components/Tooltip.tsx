const Tooltip = (props: { text: string }) => {

    return <div className="absolute z-10 group-hover:opacity-100 transition-opacity opacity-0 inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm">
        {props.text}
        <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
}

export default Tooltip