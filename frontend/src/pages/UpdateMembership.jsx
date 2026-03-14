import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const EXTN_TYPES = [
    { value: 'six_months', label: '6 Months' },
    { value: 'one_year', label: '1 Year' },
    { value: 'two_years', label: '2 Years' },
];

function UpdateMembership() {
    const navigate = useNavigate();
    const [membershipNumber, setMembershipNumber] = useState('');
    const [memberships, setMemberships] = useState([]);
    const [form, setForm] = useState({ startDate: '', endDate: '', membershipType: '', isRemoved: false });
    const [fetched, setFetched] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    const fetchMemberships = async () => {
        try {
            const { data } = await API.get('/memberships');
            setMemberships(data);
        } catch (err) {
            console.error("Failed to fetch memberships", err);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    const handleSearch = async (numToSearch) => {
        const query = typeof numToSearch === 'string' ? numToSearch : membershipNumber.trim();
        if (!query) { setError('Please enter a membership number.'); return; }
        if (typeof numToSearch === 'string') setMembershipNumber(query);
        setSearching(true); setError('');
        try {
            const { data } = await API.get(`/memberships/${query}`);
            setFetched(data);
            setForm({
                startDate: data.startDate?.slice(0, 10) || '',
                endDate: data.endDate?.slice(0, 10) || '',
                membershipType: data.membershipType || '',
                isRemoved: data.isRemoved || false,
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            setError('Membership not found.'); setFetched(null);
        } finally {
            setSearching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newForm = { ...form, [name]: type === 'checkbox' ? checked : value };

        if ((name === 'startDate' || name === 'membershipType') && newForm.startDate && newForm.membershipType) {
            let months = 0;
            if (newForm.membershipType === 'six_months') months = 6;
            else if (newForm.membershipType === 'one_year') months = 12;
            else if (newForm.membershipType === 'two_years') months = 24;

            if (months > 0) {
                const date = new Date(newForm.startDate);
                date.setMonth(date.getMonth() + months);
                newForm.endDate = date.toISOString().slice(0, 10);
            }
        }
        setForm(newForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.startDate || !form.endDate || !form.membershipType) {
            setError('All fields are required.'); return;
        }
        setLoading(true); setError('');
        try {
            if (form.isRemoved) {
                await API.delete(`/memberships/${membershipNumber}`);
            } else {
                await API.put(`/memberships/${membershipNumber}`, form);
            }
            await fetchMemberships();
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
                    <h1>Update Membership</h1>
                    <p>Modify or remove an existing membership</p>
                </div>

                <div className="form-card">
                    <h2>✏️ Update Membership</h2>
                    <p className="required-note"><span>*</span> All fields are required</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    {}
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>Membership Number *</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="e.g. MEM00001"
                                value={membershipNumber}
                                onChange={(e) => setMembershipNumber(e.target.value)}
                            />
                            <button type="button" className="btn btn-primary" onClick={handleSearch} disabled={searching} style={{ whiteSpace: 'nowrap' }}>
                                {searching ? '🔍' : '🔍 Search'}
                            </button>
                        </div>
                    </div>

                    {fetched && (
                        <form onSubmit={handleSubmit}>
                            <div className="alert alert-info" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>📋 Found: <strong>{fetched.firstName} {fetched.lastName}</strong></div>
                                <div><span className={`badge ${fetched.isRemoved ? 'badge-danger' : new Date(fetched.endDate) < new Date() ? 'badge-warning' : 'badge-success'}`}>{fetched.isRemoved ? 'Removed' : new Date(fetched.endDate) < new Date() ? 'Inactive' : 'Active'}</span></div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>End Date *</label>
                                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Membership Extension</label>
                                <div className="radio-row" style={{ marginTop: '8px' }}>
                                    {EXTN_TYPES.map((t) => (
                                        <label key={t.value} className={`radio-label${form.membershipType === t.value ? ' selected' : ''}`}>
                                            <input type="radio" name="membershipType" value={t.value} checked={form.membershipType === t.value} onChange={handleChange} />
                                            {t.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label>Membership Remove</label>
                                <label className="radio-label" style={{ marginTop: '8px', border: form.isRemoved ? '1px solid var(--danger)' : '' }}>
                                    <input type="checkbox" name="isRemoved" checked={form.isRemoved} onChange={handleChange} />
                                    ❌ Mark for Removal
                                </label>
                                <p className="form-note">Checking this will deactivate the membership.</p>
                            </div>

                            <div className="btn-row">
                                <button type="submit" className="btn btn-primary" disabled={loading} id="update-membership-submit">
                                    {loading ? '⏳' : '✅'} {form.isRemoved ? 'Remove Membership' : 'Update Membership'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/cancel')}>❌ Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>All Memberships</h2>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mem No.</th>
                                    <th>Name</th>
                                    <th>Contact Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberships.map((m) => (
                                    <tr key={m.membershipNumber}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{m.membershipNumber}</td>
                                        <td>{m.firstName} {m.lastName}</td>
                                        <td>{m.contactName}</td>
                                        <td><span className={`badge ${m.isRemoved ? 'badge-danger' : new Date(m.endDate) < new Date() ? 'badge-warning' : 'badge-success'}`}>{m.isRemoved ? 'Removed' : new Date(m.endDate) < new Date() ? 'Inactive' : 'Active'}</span></td>
                                        <td>
                                            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleSearch(m.membershipNumber)}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                                {memberships.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No memberships found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UpdateMembership;
