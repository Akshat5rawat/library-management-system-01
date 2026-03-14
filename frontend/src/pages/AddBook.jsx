import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

function AddBook() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ type: '', name: '', authorName: '', dateOfProcurement: '', quantity: 1 });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        if (!form.type) return 'Please select Book or Movie.';
        if (!form.name.trim()) return 'Book/Movie name is required.';
        if (form.type === 'book' && !form.authorName?.trim()) return 'Author name is required for a book.';
        if (!form.dateOfProcurement) return 'Date of procurement is required.';
        if (!form.quantity || form.quantity < 1) return 'Quantity must be at least 1.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true); setError('');
        try {
            await API.post('/books', form);
            navigate('/confirmation');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book/movie.');
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>Add Book / Movie</h1>
                    <p>Add a new book or movie to the library catalog</p>
                </div>

                <div className="form-card">
                    <h2>📖 Add Book / Movie</h2>
                    <p className="required-note"><span>*</span> All fields are required to submit the form</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Type *</label>
                            <div className="radio-row" style={{ marginTop: '8px' }}>
                                <label className={`radio-label${form.type === 'book' ? ' selected' : ''}`}>
                                    <input type="radio" name="type" value="book" defaultChecked={true} onChange={handleChange} />
                                    📖 Book
                                </label>
                                <label className={`radio-label${form.type === 'movie' ? ' selected' : ''}`}>
                                    <input type="radio" name="type" value="movie" onChange={handleChange} />
                                    🎬 Movie
                                </label>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Book / Movie Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={form.type === 'movie' ? 'Enter movie title' : 'Enter book title'}
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                            {form.type === 'book' && (
                                <div className="form-group">
                                    <label>Author Name *</label>
                                    <input
                                        type="text"
                                        name="authorName"
                                        placeholder="Enter author name"
                                        value={form.authorName}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Date of Procurement *</label>
                                <input type="date" name="dateOfProcurement" value={form.dateOfProcurement} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Quantity / Copies *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    min={1}
                                    onChange={handleChange}
                                    placeholder="Default: 1"
                                />
                                <p className="form-note">Default quantity is 1.</p>
                            </div>
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="btn btn-primary" disabled={loading} id="add-book-submit">
                                {loading ? '⏳ Saving...' : '✅ Add ' + (form.type === 'movie' ? 'Movie' : 'Book')}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>❌ Cancel</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddBook;
