import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = (() => {
        try {
            return !!JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return false;
        }
    })();

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;