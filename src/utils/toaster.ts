
import { toast } from "react-toastify";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ status, message, autoClose }: {
    status?: "success" | "error" | "info" | "warning";
    message: string;
    autoClose?: number;
}) =>
    toast(message, {
        type: status || "success",
        autoClose: autoClose || 5000,
        closeOnClick: true,
        theme: "dark",
    });