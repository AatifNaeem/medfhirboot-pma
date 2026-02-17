import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

export const notifySuccess = (message) =>
    toast.success(message, {
        icon: <CheckCircle className="w-6 h-6 text-success" />,
    });

export const notifyError = (message) =>
    toast.error(message, {
        icon: <XCircle className="w-6 h-6 text-error" />,
    });
