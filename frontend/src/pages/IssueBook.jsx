import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function IssueBook() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [issues, setIssues] = useState([]);
    const [form, setForm] = useState({ bookId: '', userId: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [returningId, setReturningId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: booksData } = await API.get('/books');
                setBooks(booksData.filter(b => b.quantity > 0));

                const { data: usersData } = await API.get('/users');
                setUsers(usersData.filter(u => u.isActive));

                const { data: issuesData } = await API.get('/issues?all=true');
                setIssues(Array.isArray(issuesData) ? issuesData : []);
            } catch (err) {
                setError('Failed to fetch required data.');
            }
        };
        fetchData();
    }, []);

    const formatDate = (d) => {
        if (!d) return '-';
        const dt = new Date(d);
        return Number.isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString();
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        if (!form.bookId) return 'Please select a book/movie.';
        if (!form.userId) return 'Please select a member.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            await API.post('/issues', form);
            setSuccess('Book issued successfully.');
            setForm({ bookId: '', userId: '' });
            const [{ data: booksData }, { data: issuesData }] = await Promise.all([
                API.get('/books'),
                API.get('/issues?all=true')
            ]);
            setBooks(booksData.filter(b => b.quantity > 0));
            setIssues(Array.isArray(issuesData) ? issuesData : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to issue book.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleReturn = async (issueId) => {
        setReturningId(issueId);
        setError('');
        setSuccess('');
        try {
            await API.put(`/issues/${issueId}/return`);
            setSuccess('Item returned successfully.');

            const [{ data: booksData }, { data: issuesData }] = await Promise.all([
                API.get('/books'),
                API.get('/issues?all=true')
            ]);
            setBooks(booksData.filter(b => b.quantity > 0));
            setIssues(Array.isArray(issuesData) ? issuesData : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to return item.');
        } finally {
            setReturningId('');
        }
    };

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>Issue Book / Movie</h1>
                    <p>Assign an available item to a registered member</p>
                </div>

                <div className="form-card">
                    <h2>📚 Issue Book to Member</h2>
                    <p className="required-note"><span>*</span> All fields are required to submit the form</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && <div className="alert alert-success">✅ {success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Select Member *</label>
                            <select name="userId" value={form.userId} onChange={handleChange}>
                                <option value="">-- Choose Member --</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>
                                        {u.name} ({u.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label>Select Book / Movie *</label>
                            <select name="bookId" value={form.bookId} onChange={handleChange}>
                                <option value="">-- Choose Item --</option>
                                {books.map(b => (
                                    <option key={b._id} value={b._id}>
                                        {b.type === 'book' ? '📖' : '🎬'} {b.name} {b.authorName ? `by ${b.authorName}` : ''} ({b.serialNo}) - Qty: {b.quantity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? '⏳ Processing...' : '✅ Issue Book'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>❌ Cancel</button>
                        </div>
                    </form>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Issued Items</h2>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Name</th>
                                    <th>Issued To</th>
                                    <th>Issue Date</th>
                                    <th>Return Date</th>
                                    <th>Status</th>
                                    <th>Fine</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No issues found.</td></tr>
                                ) : (
                                    issues.map((issue) => (
                                        <tr key={issue._id}>
                                            <td>
                                                <span className={`badge ${issue.book?.type === 'book' ? 'badge-purple' : 'badge-warning'}`}>
                                                    {issue.book?.type === 'book' ? '📖 Book' : '🎬 Movie'}
                                                </span>
                                            </td>
                                            <td>
                                                <strong>{issue.book?.name || '-'}</strong>
                                                {issue.book?.authorName ? <span style={{ color: 'var(--text-muted)' }}> — {issue.book.authorName}</span> : null}
                                            </td>
                                            <td>
                                                {issue.user?.name ? <strong>{issue.user.name}</strong> : '-'}
                                                {issue.user?.username ? <span style={{ color: 'var(--text-muted)' }}> ({issue.user.username})</span> : null}
                                            </td>
                                            <td>{formatDate(issue.issueDate)}</td>
                                            <td>{issue.isReturned ? formatDate(issue.returnDate) : '-'}</td>
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
                                            <td>
                                                {issue.isReturned ? (
                                                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        disabled={returningId === issue._id}
                                                        onClick={() => handleReturn(issue._id)}
                                                        style={{ padding: '8px 12px', fontSize: '13px' }}
                                                    >
                                                        {returningId === issue._id ? '⏳ Returning...' : '↩️ Return'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
                        Fine rule: after 15 days from issue date, ₹5 per overdue day.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default IssueBook;
