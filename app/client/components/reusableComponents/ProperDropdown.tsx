import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatDropDownData } from "../../types/types"


const ProperDropdown = ({ dropdownItems, dropdownTitle, children }: { dropdownItems: ChatDropDownData[], dropdownTitle: string | undefined, children: React.ReactNode }) => {
    return (

            <DropdownMenu>
                <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4 mt-3">
                    <DropdownMenuLabel>{dropdownTitle}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dropdownItems.map((item: ChatDropDownData): React.ReactElement => {
                        return (
                            <DropdownMenuItem key={item.name} onClick={item.clickFunc}>{item.name}</DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
    )
}

export default ProperDropdown