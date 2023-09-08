import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutes = ({isAllowed}) => {
    if (!isAllowed) {
        return <Navigate to="/login"/> 
    }
    return Outlet

}