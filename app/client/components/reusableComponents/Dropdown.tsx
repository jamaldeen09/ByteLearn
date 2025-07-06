"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownProps } from "../../types/types"

const Dropdown = ({ dropdownContent, label, children }: DropdownProps): React.ReactElement => {
  return (
    <DropdownMenu>
     <DropdownMenuTrigger>
        {children}
     </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 mt-4 iphone:mt-3">
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
         <DropdownMenuItem onClick={dropdownContent.funcToExecute}>{dropdownContent.text}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown