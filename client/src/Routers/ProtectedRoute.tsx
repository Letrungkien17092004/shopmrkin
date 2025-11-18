// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.tsx";

type Props = {
    children: React.ReactNode;
    allowedRoles: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const { profile } = useAuthContext();

    if (!profile) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(profile.role)) {
        window.alert("deo co quyen")
        return <Navigate to="/" replace />;
    }

    return children;
};
