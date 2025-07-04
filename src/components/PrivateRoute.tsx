import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }: { children: JSX.Element })  => {
    const isAuthenticated = !!localStorage.getItem("id") && localStorage.getItem("kode") ;
    return (
        isAuthenticated ? children : <Navigate to="/login" replace />
    );
};

export default PrivateRoute;