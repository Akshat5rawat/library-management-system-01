import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function UserHome() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        API.get('/books').then(({ data }) => setBooks(data)).catch(() => { });
    }, []);

    return (
        <div className="dashboard">
            <Sidebar isAdmin={false} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>User Home</h1>
                    <p>Browse available books and movies</p>
                </div>

                <div className="welcome-banner">
                    <div className="welcome-avatar">👤</div>
                    <div>
                        <h2>Hello, {user.name || 'User'}!</h2>
                        <p>Welcome to the Library Management System. Browse available books and movies below.</p>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Author</th>
                                <th>Serial No</th>
                                <th>Status</th>
                                <th>Copies</th>
                                <th>Procured On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No books/movies available.</td></tr>
                            ) : (
                                books.map((b) => (
                                    <tr key={b._id}>
                                        <td>
                                            <span className={`badge ${b.type === 'book' ? 'badge-purple' : 'badge-warning'}`}>
                                                {b.type === 'book' ? '📖 Book' : '🎬 Movie'}
                                            </span>
                                        </td>
                                        <td>{b.name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{b.authorName || '-'}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{b.serialNo}</td>
                                        <td>
                                            <span className={`badge ${b.status === 'available' ? 'badge-success' : b.status === 'issued' ? 'badge-warning' : 'badge-danger'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>{b.quantity}</td>
                                        <td>{new Date(b.dateOfProcurement).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default UserHome;
