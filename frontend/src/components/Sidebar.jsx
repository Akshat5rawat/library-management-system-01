import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ isAdmin }) {
    const navigate = useNavigate();
    const homeLink = isAdmin ? '/admin' : '/home';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/logout');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="icon">📚</div>
                <div>
                    <h2>LibraryMS</h2>
                    <span>{isAdmin ? 'Admin Panel' : 'User Panel'}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Navigation</div>
                    <NavLink to={homeLink} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                        <span className="nav-icon">🏠</span> Home
                    </NavLink>
                </div>

                {isAdmin && (
                    <>
                        <div className="nav-section">
                            <div className="nav-section-title">Membership</div>
                            <NavLink to="/membership/add" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">➕</span> Add Membership
                            </NavLink>
                            <NavLink to="/membership/update" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">✏️</span> Update Membership
                            </NavLink>
                        </div>

                        <div className="nav-section">
                            <div className="nav-section-title">Books / Movies</div>
                            <NavLink to="/book/add" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">📖</span> Add Book/Movie
                            </NavLink>
                            <NavLink to="/book/update" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">🔄</span> Update Book/Movie
                            </NavLink>
                            <NavLink to="/book/issue" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">📌</span> Issue Book/Movie
                            </NavLink>
                        </div>

                        <div className="nav-section">
                            <div className="nav-section-title">Admin</div>
                            <NavLink to="/user-management" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">👥</span> User Management
                            </NavLink>
                        </div>

                        <div className="nav-section">
                            <div className="nav-section-title">Reports</div>
                            <NavLink to="/Reports" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                                <span className="nav-icon">📊</span>Reports
                            </NavLink>
                        </div>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <span>🚪</span> Log Out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
