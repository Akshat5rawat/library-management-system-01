import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) return <Navigate to="/login" />;
    if (!user.isAdmin) return <Navigate to="/home" />;
    return <Outlet />;
}

export default AdminRoute;
