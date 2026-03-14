import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const MEMBERSHIP_TYPES = [
    { value: 'six_months', label: '6 Months' },
    { value: 'one_year', label: '1 Year' },
    { value: 'two_years', label: '2 Years' },
];

const INITIAL = {
    firstName: '', lastName: '', contactName: '', contactAddress: '',
    aadharCardNo: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', membershipType: '',
};

function AddMembership() {
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newForm = { ...form, [name]: value };

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

    const validate = () => {
        const { firstName, lastName, contactName, contactAddress, aadharCardNo, startDate, endDate, membershipType } = form;
        if (!firstName || !lastName || !contactName || !contactAddress || !aadharCardNo || !startDate || !endDate || !membershipType)
            return 'All fields are required.';
        if (endDate <= startDate) return 'End date must be after start date.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true); setError('');
        try {
            await API.post('/memberships', form);
            navigate('/confirmation');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add membership.');
            setLoading(false);
        }
    };

    const handleCancel = () => navigate('/cancel');

    return (
        <div className="dashboard">
            <Sidebar isAdmin={true} />
            <main className="main-content page-animate">
                <div className="page-header">
                    <h1>Add Membership</h1>
                    <p>Create a new member record</p>
                </div>

                <div className="form-card">
                    <h2>🪪 New Membership Form</h2>
                    <p className="required-note"><span>*</span> All fields are required</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" placeholder="Enter first name" value={form.firstName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" placeholder="Enter last name" value={form.lastName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Contact Name *</label>
                                <input type="text" name="contactName" placeholder="Contact person name" value={form.contactName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Contact Address *</label>
                                <input type="text" name="contactAddress" placeholder="Full address" value={form.contactAddress} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Aadhar Card No *</label>
                                <input type="text" name="aadharCardNo" placeholder="12-digit Aadhar number" value={form.aadharCardNo} onChange={handleChange} maxLength={12} />
                            </div>
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>End Date *</label>
                                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label>Membership Duration *</label>
                            <div className="radio-row" style={{ marginTop: '8px' }}>
                                {MEMBERSHIP_TYPES.map((t) => (
                                    <label
                                        key={t.value}
                                        className={`radio-label${form.membershipType === t.value ? ' selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="membershipType"
                                            value={t.value}
                                            checked={form.membershipType === t.value}
                                            onChange={handleChange}
                                        />
                                        {t.label}
                                    </label>
                                ))}
                            </div>
                            <p className="form-note">Only one membership type can be selected.</p>
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="btn btn-primary" disabled={loading} id="add-membership-submit">
                                {loading ? '⏳ Saving...' : '✅ Add Membership'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddMembership;
