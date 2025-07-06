import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { AlertProps } from "../../types/types"

const AlertComponent = ({ alertTitle, alertDescription, icon }: AlertProps) => {
    return (
        <Alert>
            {icon || <Terminal />}
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>
               {alertDescription}
            </AlertDescription>
        </Alert>
    )
}

export default AlertComponent