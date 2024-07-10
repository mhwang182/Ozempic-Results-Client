import { ReactElement, useState } from "react"
import { CloseIcon, DocIcon, HomeIcon, LogoutIcon, SearchIcon, UserIcon } from "../../svgs/svgs"
import { Link, useLocation } from 'react-router-dom'
import { useUserAuthContext } from "../../context/UserAuthContext"
import { CSSTransition } from "react-transition-group"
import "../../css/search-bar.css";
import { MedicationOptions } from "../../utils/contants"
import { useSearchResultContext } from "../../context/SearchResultContext"

const SideBar = () => {

    const { token, logout } = useUserAuthContext();
    const { getSearchPosts } = useSearchResultContext();
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const MenuOption = ({ text, icon, link }: { text: string, icon?: ReactElement, link: string }) => {
        return (
            <div className='p-2 mt-4 mb-4 hover:bg-gray-100 rounded-md text-lg w-10 md:w-64'>
                <Link to={link} state={{ previousLocation: location }}>
                    <div className='flex space-x-2 justify-center md:justify-start'>
                        {icon ? icon : null}<div className="hidden md:flex">{text}</div>
                    </div>
                </Link>
            </div>)
    }

    const MenuButton = ({ text, icon, onClick }: { text: string, icon?: ReactElement, onClick: () => void }) => {
        return (
            <div
                className='p-2 mt-4 mb-4 hover:bg-gray-100 rounded-md text-lg w-10 md:w-64 cursor-pointer'
                onClick={onClick}
            >
                <div className='flex space-x-2 justify-center md:justify-start items-center'>
                    {icon ? icon : null}<div className="hidden md:flex">{text}</div>
                </div>
            </div>)
    }

    const SearchLink = (props: { children: ReactElement }) => {
        return searchTerm.length > 0 ?
            <Link to={'/search'} >{props.children}</Link> :
            <>{props.children}</>
    }

    return (
        <>
            <CSSTransition
                in={isSearchOpen}
                timeout={300}
                classNames={'search-bar'}
            >
                <div className={`pt-2 flex flex-col space-y-2 bg-white min-h-screen max-h-screen w-[18.5rem] fixed top-0 z-40 -translate-x-full px-5 border-r ${isSearchOpen ? 'shadow-right-only' : ''} md:border-r-0 md:shadow-none`}>
                    <div onClick={() => setIsSearchOpen(false)}><CloseIcon /></div>

                    <div className="pt-2 relative mx-auto text-gray-600">
                        <input
                            className="border-2 border-gray-30 w-60 bg-zinc-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
                            type="search"
                            name="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                setSearchTerm(e.currentTarget.value);
                            }}
                        />
                        <SearchLink>
                            <button
                                type="submit"
                                className="absolute right-0 top-0 mt-4 mr-4"
                                onClick={() => {
                                    getSearchPosts(searchTerm, true);
                                    setIsSearchOpen(false);
                                }}
                            >
                                <SearchIcon />
                            </button>
                        </SearchLink>
                    </div>
                    <div className='p-2 text-lg font-semibold'>
                        Quick Search:
                    </div>
                    <div className="flex flex-col items-center">
                        {MedicationOptions.map((med, index) => {
                            return (
                                <Link to={'/search'} key={`quick-${index}`}>
                                    <div
                                        className="py-2 px-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full text-sm text-white mr-2 mb-2 font-semibold w-60 cursor-pointer hover:brightness-95"
                                        onClick={() => {
                                            getSearchPosts(med.OfficialName, true);
                                            setIsSearchOpen(false);
                                        }}
                                    >
                                        {`${med.TradeName} (${med.OfficialName})`}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                </div>
            </CSSTransition >
            <div className={`pt-10 md:pl-5 md:pr-5 flex-col space-y-2 sticky flex bg-white h-screen border-r w-16 md:w-80 items-center md:items-start top-0`}>
                <div className='p-2 text-lg font-semibold hidden md:flex'>
                    OzempicResults.com
                </div>
                <MenuOption text={'Home'} link={''} icon={<HomeIcon />} />
                <MenuOption text={'Reviews'} link={'/reviews'} icon={<DocIcon />} />
                <MenuButton text={'Search'} icon={<SearchIcon />} onClick={() => setIsSearchOpen(true)} />
                <MenuOption text={'Profile'} link={'/registration'} icon={<UserIcon />} />

                {token && token.length > 0 ?
                    <MenuButton
                        text={'Logout'}
                        icon={<LogoutIcon />}
                        onClick={() => { logout() }}
                    />
                    : null
                }
            </div>
        </>
    )
}

export default SideBar
