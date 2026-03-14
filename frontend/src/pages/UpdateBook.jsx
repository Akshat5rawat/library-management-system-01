import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const STATUS_OPTIONS = ['available', 'issued', 'lost', 'damaged'];

function UpdateBook() {
    const navigate = useNavigate();
    const [typeFilter, setTypeFilter] = useState('book');
    const [books, setBooks] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [form, setForm] = useState({ name: '', authorName: '', serialNo: '', status: '', date: '', quantity: 1 });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get(`/books?type=${typeFilter}`)
            .then(({ data }) => {
                setBooks(data);
                setSelectedId('');
                setForm({ name: '', authorName: '', serialNo: '', status: '', date: '', quantity: 1 });
            })
            .catch(() => { });
    }, [typeFilter]);

    const handleSelect = (id) => {
        setSelectedId(id);
        const book = books.find((b) => b._id === id);
        if (book) setForm({
            name: book.name,
            authorName: book.authorName || '',
            serialNo: book.serialNo,
            status: book.status,
            date: book.dateOfProcurement?.slice(0, 10) || '',
            quantity: typeof book.quantity === 'number' ? book.quantity : 1,
        });
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        if (!typeFilter) return 'Please select Book or Movie type.';
        if (!selectedId) return 'Please select a book/movie.';
        if (!form.name || !form.serialNo || !form.status || !form.date) return 'All fields are required.';
        if (typeFilter === 'book' && !form.authorName?.trim()) return 'Author name is required for a book.';
        const qty = Number(form.quantity);
        if (!Number.isFinite(qty) || qty < 0) return 'Quantity must be 0 or more.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true); setError('');
        try {
            await API.put(`/books/${selectedId}`, {
                name: form.name,
                authorName: form.authorName,
                serialNo: form.serialNo,
                status: form.status,
                dateOfProcurement: form.date,
                quantity: Number(form.quantity),
            });
            navigate('/confirmation');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>Update Book / Movie</h1>
                    <p>Edit details of an existing book or movie</p>
                </div>

                <div className="form-card">
                    <h2>🔄 Update Book / Movie</h2>
                    <p className="required-note"><span>*</span> All fields are required to submit the form</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Type *</label>
                            <div className="radio-row" style={{ marginTop: '8px' }}>
                                <label className={`radio-label${typeFilter === 'book' ? ' selected' : ''}`}>
                                    <input type="radio" name="typeFilter" value="book" checked={typeFilter === 'book'} onChange={(e) => setTypeFilter(e.target.value)} />
                                    📖 Book
                                </label>
                                <label className={`radio-label${typeFilter === 'movie' ? ' selected' : ''}`}>
                                    <input type="radio" name="typeFilter" value="movie" checked={typeFilter === 'movie'} onChange={(e) => setTypeFilter(e.target.value)} />
                                    🎬 Movie
                                </label>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>{typeFilter === 'book' ? 'Book Name *' : 'Movie Name *'}</label>
                            <select value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
                                <option value="">— Select —</option>
                                {books.map((b) => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                            {books.length === 0 && (
                                <p className="form-note">No {typeFilter === 'book' ? 'books' : 'movies'} found.</p>
                            )}
                        </div>

                        {selectedId && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Book / Movie Name *</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                                </div>
                                {typeFilter === 'book' && (
                                    <div className="form-group">
                                        <label>Author Name *</label>
                                        <input type="text" name="authorName" value={form.authorName} onChange={handleChange} placeholder="Enter author name" />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Serial No</label>
                                    <input type="text" name="serialNo" value={form.serialNo} onChange={handleChange} placeholder="Serial number" />
                                </div>
                                <div className="form-group">
                                    <label>Status *</label>
                                    <select name="status" value={form.status} onChange={handleChange}>
                                        <option value="">— Select Status —</option>
                                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Quantity *</label>
                                    <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" />
                                </div>
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <div className="btn-row">
                            <button type="submit" className="btn btn-primary" disabled={loading || !selectedId} id="update-book-submit">
                                {loading ? '⏳ Saving...' : '✅ Update'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>❌ Cancel</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default UpdateBook;
