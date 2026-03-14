import { useNavigate } from 'react-router-dom';

function Cancel() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const homeLink = user.isAdmin ? '/admin' : '/home';

    return (
        <div className="status-page">
            <div className="status-card">
                <div className="status-icon warning">⚠️</div>
                <h2>Transaction Cancelled</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    No changes were saved. You can go back and try again.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate(homeLink)}>
                        🏠 Go to Home
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                </div>
                <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {user.isAdmin ? 'Note: Home takes you to Admin Home Page' : 'Note: Home takes you to User Home Page'}
                </p>
            </div>
        </div>
    );
}

export default Cancel;
