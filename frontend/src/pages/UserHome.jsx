import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function UserHome() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [books, setBooks] = useState([]);
    const [myIssues, setMyIssues] = useState([]);

    const issuedCount = myIssues.filter((i) => !i.isReturned).length;
    const returnedCount = myIssues.filter((i) => i.isReturned).length;
    const totalCount = myIssues.length;
    const issuedPct = totalCount ? Math.round((issuedCount / totalCount) * 100) : 0;
    const returnedPct = totalCount ? Math.round((returnedCount / totalCount) * 100) : 0;

    const computeFine = (issue) => {
        if (typeof issue?.fine === 'number') return issue.fine;

        const issueDate = new Date(issue?.issueDate);
        const endDate = issue?.isReturned && issue?.returnDate ? new Date(issue.returnDate) : new Date();
        if (Number.isNaN(issueDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;

        const startUtc = Date.UTC(issueDate.getUTCFullYear(), issueDate.getUTCMonth(), issueDate.getUTCDate());
        const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
        const daysHeld = Math.max(0, Math.floor((endUtc - startUtc) / (24 * 60 * 60 * 1000)));
        const overdueDays = Math.max(0, daysHeld - 15);
        return overdueDays * 5;
    };

    useEffect(() => {
        if (user.id || user._id) {
            const userId = user.id || user._id;
            API.get(`/issues/user/${userId}`).then(({ data }) => setMyIssues(data)).catch(() => { });
        }
        API.get('/books').then(({ data }) => setBooks(data)).catch(() => { });
    }, []);

    return (
        <div className="dashboard">
            <Sidebar isAdmin={false} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>User Home</h1>
                    <p>Track your issued items and browse catalog</p>
                </div>

                <div className="welcome-banner">
                    <div className="welcome-avatar">👤</div>
                    <div>
                        <h2>Hello, {user.name || 'User'}!</h2>
                        <p>Welcome to your Dashboard. Here you can track your issued books and browse our library catalog.</p>
                    </div>
                </div>

                <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>📚 My Issued Books</h2>

                <div className="form-card" style={{ maxWidth: '900px', marginBottom: '20px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>📊 Issue Summary</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        Visual summary of your issued vs returned items.
                    </p>

                    <div style={{ display: 'grid', gap: '10px' }}>
                        <div style={{ display: 'grid', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span><span className="badge badge-warning">Issued</span> {issuedCount}</span>
                                <span>{issuedPct}%</span>
                            </div>
                            <div style={{ height: '10px', borderRadius: '999px', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                                <div style={{ width: `${issuedPct}%`, height: '100%', background: 'var(--warning)' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span><span className="badge badge-success">Returned</span> {returnedCount}</span>
                                <span>{returnedPct}%</span>
                            </div>
                            <div style={{ height: '10px', borderRadius: '999px', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                                <div style={{ width: `${returnedPct}%`, height: '100%', background: 'var(--success)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper" style={{ marginBottom: '40px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Name</th>
                                <th>Issue Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myIssues.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>You haven't issued any books yet.</td></tr>
                            ) : (
                                myIssues.map((issue) => (
                                    <tr key={issue._id}>
                                        <td>
                                            <span className={`badge ${issue.book?.type === 'book' ? 'badge-purple' : 'badge-warning'}`}>
                                                {issue.book?.type === 'book' ? '📖 Book' : '🎬 Movie'}
                                            </span>
                                        </td>
                                        <td><strong>{issue.book?.name}</strong> {issue.book?.authorName && <span style={{ color: 'var(--text-muted)' }}>- by {issue.book.authorName}</span>}</td>
                                        <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                                        <td>{issue.isReturned && issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span className={`badge ${issue.isReturned ? 'badge-success' : 'badge-warning'}`}>
                                                {issue.isReturned ? 'Returned' : 'Issued'}
                                            </span>
                                        </td>
                                        <td>
                                            {computeFine(issue) > 0 ? (
                                                <span className="badge badge-danger">₹{computeFine(issue)}</span>
                                            ) : (
                                                <span className="badge badge-success">₹0</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-28px', marginBottom: '40px' }}>
                    Fine rule: after 15 days from issue date, ₹5 per overdue day.
                </p>

                <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>📖 Library Catalog</h2>
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
