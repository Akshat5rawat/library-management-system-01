import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const reportTabs = [
  'masterBooks',
  'masterMovies',
  'masterMembership',
  'activeIssues',
  'overdueReturn',
  'issueRequests',
];

function Reports() {
  const [activeTab, setActiveTab] = useState('masterBooks');
  const [masterBooks, setMasterBooks] = useState([]);
  const [masterMovies, setMasterMovies] = useState([]);
  const [masterMembership, setMasterMembership] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);
  const [overdueReturn, setOverdueReturn] = useState([]);
  const [issueRequests, setIssueRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch books data
  const fetchBooks = async () => {
    try {
      const res = await API.get('/books?type=book');
      const formattedBooks = res.data.map((book) => ({
        serialNo: book.serialNo,
        name: book.name,
        authorName: book.authorName || '-',
        status: book.status,
        dateOfProcurement: book.dateOfProcurement ? new Date(book.dateOfProcurement).toLocaleDateString() : '-',
      }));
      setMasterBooks(formattedBooks);
    } catch (err) {
      setError('Failed to fetch books: ' + (err.response?.data?.message || err.message));
    }
  };

  // Fetch movies data
  const fetchMovies = async () => {
    try {
      const res = await API.get('/books?type=movie');
      const formattedMovies = res.data.map((movie) => ({
        serialNo: movie.serialNo,
        name: movie.name,
        authorName: movie.authorName || '-',
        status: movie.status,
        dateOfProcurement: movie.dateOfProcurement ? new Date(movie.dateOfProcurement).toLocaleDateString() : '-',
      }));
      setMasterMovies(formattedMovies);
    } catch (err) {
      setError('Failed to fetch movies: ' + (err.response?.data?.message || err.message));
    }
  };

  // Fetch memberships data
  const fetchMemberships = async () => {
    try {
      const res = await API.get('/memberships');
      const formattedMemberships = res.data.map((m) => ({
        membershipNumber: m.membershipNumber,
        memberName: `${m.firstName} ${m.lastName}`,
        aadharCardNo: m.aadharCardNo,
        startDate: m.startDate ? new Date(m.startDate).toLocaleDateString() : '-',
        endDate: m.endDate ? new Date(m.endDate).toLocaleDateString() : '-',
      }));
      setMasterMembership(formattedMemberships);
    } catch (err) {
      setError('Failed to fetch memberships: ' + (err.response?.data?.message || err.message));
    }
  };

  // Fetch issues data
  const fetchIssuesData = async () => {
    try {
      const res = await API.get('/issues');
      const allIssues = res.data;

      // Filter active issues (not returned)
      const active = allIssues.filter((issue) => !issue.isReturned).map((issue) => ({
        serialNo: issue.book?.serialNo || '-',
        name: issue.book?.name || '-',
        membershipId: issue.user?.username || '-',
        issueDate: issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : '-',
        returnDate: '-',
      }));
      setActiveIssues(active);

      // Filter overdue issues (not returned AND returnDate < today)
      const today = new Date();
      const overdue = allIssues
        .filter((issue) => {
          if (issue.isReturned) return false;
          const issueDate = new Date(issue.issueDate);
          const dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + 15); 
          return dueDate < today;
        })
        .map((issue) => {
          const issueDate = new Date(issue.issueDate);
          const dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + 15);
          const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          const fine = daysOverdue * 5; 
          const membershipNumber = issue.user?.username || '-'; 
          return {
            serialNo: issue.book?.serialNo || '-',
            name: issue.book?.name || '-',
            membershipId: membershipNumber,
            issueDate: issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : '-',
            returnDate: dueDate.toLocaleDateString(),
            fine: `₹${fine}`,
          };
        });
      setOverdueReturn(overdue);
    } catch (err) {
      setError('Failed to fetch issues: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle tab changes and fetch data accordingly
  useEffect(() => {
    setError('');
    const fetchData = async () => {
      if (activeTab === 'masterBooks') {
        await fetchBooks();
      } else if (activeTab === 'masterMovies') {
        await fetchMovies();
      } else if (activeTab === 'masterMembership') {
        await fetchMemberships();
      } else if (activeTab === 'activeIssues' || activeTab === 'overdueReturn') {
        await fetchIssuesData();
      }
    };
    fetchData();
  }, [activeTab]);

  const renderNoData = (colSpan) => (
    <tr>
      <td colSpan={colSpan} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        No records found.
      </td>
    </tr>
  );

  return (
    <div className="dashboard">
      <Sidebar isAdmin={true} />

      <main className="main-content page-animate">
        <div className="page-header">
          <h1>Reports</h1>
          <p>Library report dashboard</p>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
          <aside className="form-card" style={{ height: 'fit-content' }}>
            <h2 style={{ marginBottom: '12px' }}>Report</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className={`btn ${activeTab === 'masterBooks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('masterBooks')}>Master List of Books</button>
              <button className={`btn ${activeTab === 'masterMovies' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('masterMovies')}>Master List of Movies</button>
              <button className={`btn ${activeTab === 'masterMembership' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('masterMembership')}>Master List of Membership</button>
              <button className={`btn ${activeTab === 'activeIssues' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('activeIssues')}>Active Issues</button>
              <button className={`btn ${activeTab === 'overdueReturn' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('overdueReturn')}>Overdue Return</button>
              <button className={`btn ${activeTab === 'issueRequests' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('issueRequests')}>Issue Requests</button>
            </div>
          </aside>

          <section className="form-card">
            {activeTab === 'masterBooks' && (
              <>
                <h2>Master List of Books</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No</th>
                        <th>Name of Book</th>
                        <th>Author Name</th>
                        <th>Status</th>
                        <th>Procurement Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterBooks.length === 0
                        ? renderNoData(5)
                        : masterBooks.map((r) => (
                            <tr key={r.serialNo}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.authorName}</td>
                              <td>{r.status}</td>
                              <td>{r.dateOfProcurement}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'masterMovies' && (
              <>
                <h2>Master List of Movies</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No</th>
                        <th>Name of Movie</th>
                        <th>Author Name</th>
                        <th>Status</th>
                        <th>Procurement Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterMovies.length === 0
                        ? renderNoData(5)
                        : masterMovies.map((r) => (
                            <tr key={r.serialNo}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.authorName}</td>
                              <td>{r.status}</td>
                              <td>{r.dateOfProcurement}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'masterMembership' && (
              <>
                <h2>Master List of Membership</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Membership Id</th>
                        <th>Name of Member</th>
                        <th>Aadhar Card No</th>
                        <th>Start Date of Membership</th>
                        <th>End Date of Membership</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterMembership.length === 0
                        ? renderNoData(5)
                        : masterMembership.map((r) => (
                            <tr key={r.membershipNumber}>
                              <td>{r.membershipNumber}</td>
                              <td>{r.memberName}</td>
                              <td>{r.aadharCardNo}</td>
                              <td>{r.startDate}</td>
                              <td>{r.endDate}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'activeIssues' && (
              <>
                <h2>Active Issues</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No Book/Movie</th>
                        <th>Name of Book/Movie</th>
                        <th>Membership Id</th>
                        <th>Date of Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeIssues.length === 0
                        ? renderNoData(4)
                        : activeIssues.map((r, i) => (
                            <tr key={i}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.membershipId}</td>
                              <td>{r.issueDate}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'overdueReturn' && (
              <>
                <h2>Overdue Return</h2>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial No Book</th>
                        <th>Name of Book</th>
                        <th>Membership Id</th>
                        <th>Date of Issue</th>
                        <th>Due Date</th>
                        <th>Fine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueReturn.length === 0
                        ? renderNoData(6)
                        : overdueReturn.map((r, i) => (
                            <tr key={i}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.membershipId}</td>
                              <td>{r.issueDate}</td>
                              <td>{r.returnDate}</td>
                              <td>{r.fine}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'issueRequests' && (
              <>
                <h2>Issue Requests</h2>
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p>Issue Requests feature is not yet available. This endpoint needs to be created in the backend.</p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Reports;