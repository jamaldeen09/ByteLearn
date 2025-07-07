import { SidebarLinkSchema, SidebarProps } from "../../types/types"
import { sidebarlinks } from "../../utils/utils"
import Logo from "../reusableComponents/Logo"

const Sidebar = ({ currentRoute, setCurrentRoute }: SidebarProps) => {
    const handleRouteChange = (value: string) => {
        setCurrentRoute(value);
    };

    return (
        <>
            <div className="col-span-1 max-lg:col-span-3 py-4 hidden md:flex flex-col">
                {/* Routes */}
                <div className="min-h-96 flex flex-col space-y-4">
                    {/* logo + title */}
                    <div className="flex max-lg:m-0 max-lg:items-center max-lg:justify-start tablets and iphones: justify-center items-center mx-auto">
                        <Logo />
                        <h1 className="font-extrabold text-xl hidden max-lg:inline">ByteLearn</h1>
                    </div>

                    {/* Links */}
                    <ul className="flex flex-col h-fit px-3 space-y-10 max-lg:space-y-6">
                        {sidebarlinks.map((link: SidebarLinkSchema) => (
                            <li
                                key={link.value}
                                onClick={() => handleRouteChange(link.value)}
                                className={`
                                group relative flex items-center transition-all duration-200
                                hover:cursor-pointer rounded-full mx-auto
                                max-lg:space-x-4 max-lg:px-4 max-lg:py-5 max-lg:justify-start max-lg:w-full max-lg:h-fit
                                justify-center w-12 h-12 liCon
                                ${currentRoute === link.value
                                        ? "bg-black text-white"
                                        : "hover:bg-black hover:text-white"
                                    }
                            `}
                            >
                                {/* Icon */}
                                <span
                                    className="relative"
                                >
                                    {link.icon}
                                    {/* Chats Number */}
                                    {link.routeName === "Chats" && <span
                                        className="text-xs font-bold bg-black rounded-full w-4 h-4 text-white absolute centered-flex top-0 left-4
                                  unread">
                                        2
                                    </span>}
                                </span>

                                <span className="hidden max-lg:inline ml-2">
                                    {link.routeName}
                                </span>

                                <span className={`
                                max-lg:hidden absolute -top-10 left-1/2 transform -translate-x-1/2
                                bg-black text-white text-xs font-medium py-1 px-2 rounded
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                whitespace-nowrap pointer-events-none
                                before:content-[''] before:absolute before:top-full before:left-1/2 
                                before:-translate-x-1/2 before:border-4 before:border-transparent 
                                before:border-t-black ${(link.routeName === "Achievements" || link.routeName === "My Courses") ? "ml-4" : "ml-0"}
                            `}>
                                    {link.routeName}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Sidebar