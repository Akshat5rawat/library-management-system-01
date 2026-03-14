import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function AdminHome() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({ memberships: 0, books: 0, movies: 0, users: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [m, b, u] = await Promise.all([
                    API.get('/memberships'),
                    API.get('/books'),
                    API.get('/users'),
                ]);
                const books = b.data.filter((x) => x.type === 'book').length;
                const movies = b.data.filter((x) => x.type === 'movie').length;
                setStats({ memberships: m.data.length, books, movies, users: u.data.length });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { icon: '🪪', label: 'Total Memberships', value: stats.memberships, color: 'rgba(108,99,255,0.2)' },
        { icon: '📖', label: 'Total Books', value: stats.books, color: 'rgba(34,197,94,0.2)' },
        { icon: '🎬', label: 'Total Movies', value: stats.movies, color: 'rgba(255,101,132,0.2)' },
        { icon: '👥', label: 'Total Users', value: stats.users, color: 'rgba(245,158,11,0.2)' },
    ];

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, manage your library from here</p>
                </div>

                <div className="welcome-banner">
                    <div className="welcome-avatar">👑</div>
                    <div>
                        <h2>Hello, {user.name || 'Admin'}!</h2>
                        <p>You have full administrative access. Use the sidebar to manage memberships, books, movies, and users.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    {cards.map((c) => (
                        <div className="stat-card" key={c.label}>
                            <div className="stat-icon" style={{ background: c.color }}>{c.icon}</div>
                            <h3>{c.value}</h3>
                            <p>{c.label}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default AdminHome;
