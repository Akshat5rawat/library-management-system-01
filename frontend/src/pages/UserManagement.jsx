import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function UserManagement() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('new');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [form, setForm] = useState({ name: '', username: '', password: '', isActive: true, isAdmin: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get('/users').then(({ data }) => setUsers(data)).catch(() => { });
    }, []);

    useEffect(() => {
        if (userType === 'existing' && selectedUserId) {
            const u = users.find((x) => x._id === selectedUserId);
            if (u) setForm({ name: u.name, username: u.username, password: '', isActive: u.isActive, isAdmin: u.isAdmin });
        } else if (userType === 'new') {
            setForm({ name: '', username: '', password: '', isActive: true, isAdmin: false });
            setSelectedUserId('');
        }
    }, [userType, selectedUserId, users]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const validate = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (userType === 'new' && !form.username.trim()) return 'Username is required.';
        if (userType === 'new' && !form.password.trim()) return 'Password is required.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            if (userType === 'new') {
                await API.post('/users', form);
                setSuccess('User created successfully!');
                setForm({ name: '', username: '', password: '', isActive: true, isAdmin: false });
                const { data } = await API.get('/users');
                setUsers(data);
            } else {
                await API.put(`/users/${selectedUserId}`, form);
                navigate('/confirmation');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>User Management</h1>
                    <p>Create and manage system users</p>
                </div>

                <div className="form-card" style={{ maxWidth: '860px' }}>
                    <h2>👥 User Management</h2>
                    <p className="required-note"><span>*</span> All fields are required to submit the form</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Unchecking the Active/Admin checkbox implies the user is inactive or not an admin.
                    </p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && <div className="alert alert-success">✅ {success}</div>}

                    <form onSubmit={handleSubmit}>
                        {}
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label>User Type *</label>
                            <div className="radio-row" style={{ marginTop: '8px' }}>
                                <label className={`radio-label${userType === 'new' ? ' selected' : ''}`}>
                                    <input type="radio" name="userType" value="new" checked={userType === 'new'} onChange={(e) => setUserType(e.target.value)} />
                                    🆕 New User
                                </label>
                                <label className={`radio-label${userType === 'existing' ? ' selected' : ''}`}>
                                    <input type="radio" name="userType" value="existing" checked={userType === 'existing'} onChange={(e) => setUserType(e.target.value)} />
                                    🔄 Existing User
                                </label>
                            </div>
                        </div>

                        {userType === 'existing' && (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Select User</label>
                                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                                    <option value="">— Select User —</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.username})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                            </div>
                            {userType === 'new' && (
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input type="text" name="username" placeholder="Login username" value={form.username} onChange={handleChange} />
                                </div>
                            )}
                            {userType === 'new' && (
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input type="password" name="password" placeholder="Set password" value={form.password} onChange={handleChange} />
                                </div>
                            )}
                            {userType === 'existing' && form.name && (
                                <div className="form-group">
                                    <label>New Password (optional)</label>
                                    <input type="password" name="password" placeholder="Leave blank to keep existing" value={form.password} onChange={handleChange} />
                                </div>
                            )}
                        </div>

                        <div className="checkbox-group" style={{ marginBottom: '24px' }}>
                            <label className="checkbox-label">
                                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                                ✅ Status — Active
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} />
                                👑 Admin — Grant Admin Access
                            </label>
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="btn btn-primary" disabled={loading} id="user-mgmt-submit">
                                {loading ? '⏳' : userType === 'new' ? '➕ Create User' : '✅ Update User'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>❌ Cancel</button>
                        </div>
                    </form>
                </div>

                {}
                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>All Users</h2>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{u.username}</td>
                                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                                        <td><span className={`badge ${u.isAdmin ? 'badge-purple' : 'badge-warning'}`}>{u.isAdmin ? '👑 Admin' : '👤 User'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserManagement;
