import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    return (
        <div className="status-page">
            <div className="status-card">
                <div className="status-icon info">🚪</div>
                <h2>You Have Successfully Logged Out</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Thank you for using the Library Management System. See you next time!
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    🔐 Sign In Again
                </button>
            </div>
        </div>
    );
}

export default Logout;
