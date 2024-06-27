import { ReactElement, useState } from 'react';
import semaglutideImg from '../images/semaglutide.png';
import { AdjustmentIcon, CloseIcon, HomeIcon, SearchIcon, UserIcon } from '../../svgs/svgs';
import { JsxAttribute } from 'typescript';
import SideBar from '../Common/SideBar';

const MedicationsPage = () => {

    const [open, setOpen] = useState(false);


    return (
        <div className="flex flex-1 flex-col">
            <div className="">
                <button
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold border border-gray-900/10 lg:hidden flex mt-3 ml-3"
                    onClick={() => {
                        setOpen(!open)
                    }}
                >
                    Filters <AdjustmentIcon />
                </button>
            </div>

        </div>
    )
}

export default MedicationsPage