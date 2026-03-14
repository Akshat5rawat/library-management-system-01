import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import UserManagement from './pages/UserManagement';
import Confirmation from './pages/Confirmation';
import Cancel from './pages/Cancel';
import Logout from './pages/Logout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/membership/add" element={<AddMembership />} />
        <Route path="/membership/update" element={<UpdateMembership />} />
        <Route path="/book/add" element={<AddBook />} />
        <Route path="/book/update" element={<UpdateBook />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

      {}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<UserHome />} />
      </Route>

      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
}

export default App;
