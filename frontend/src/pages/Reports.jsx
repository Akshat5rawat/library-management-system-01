import { useState } from 'react';
import Sidebar from '../components/Sidebar';

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

  // Keep arrays empty for now; connect to API later.
  const masterBooks = [];
  const masterMovies = [];
  const masterMembership = [];
  const activeIssues = [];
  const overdueReturn = [];
  const issueRequests = [];

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
                        <th>Category</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Procurement Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterBooks.length === 0
                        ? renderNoData(7)
                        : masterBooks.map((r) => (
                            <tr key={r.serialNo}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.authorName}</td>
                              <td>{r.category}</td>
                              <td>{r.status}</td>
                              <td>{r.cost}</td>
                              <td>{r.procurementDate}</td>
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
                        <th>Category</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Procurement Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterMovies.length === 0
                        ? renderNoData(7)
                        : masterMovies.map((r) => (
                            <tr key={r.serialNo}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.authorName}</td>
                              <td>{r.category}</td>
                              <td>{r.status}</td>
                              <td>{r.cost}</td>
                              <td>{r.procurementDate}</td>
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
                        <th>Contact Number</th>
                        <th>Contact Address</th>
                        <th>Aadhar Card No</th>
                        <th>Start Date of Membership</th>
                        <th>End Date of Membership</th>
                        <th>Status (Active/Inactive)</th>
                        <th>Amount Pending (Fine)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterMembership.length === 0
                        ? renderNoData(9)
                        : masterMembership.map((r) => (
                            <tr key={r.membershipId}>
                              <td>{r.membershipId}</td>
                              <td>{r.memberName}</td>
                              <td>{r.contactNumber}</td>
                              <td>{r.contactAddress}</td>
                              <td>{r.aadharCardNo}</td>
                              <td>{r.startDate}</td>
                              <td>{r.endDate}</td>
                              <td>{r.status}</td>
                              <td>{r.amountPending}</td>
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
                        <th>Date of return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeIssues.length === 0
                        ? renderNoData(5)
                        : activeIssues.map((r, i) => (
                            <tr key={i}>
                              <td>{r.serialNo}</td>
                              <td>{r.name}</td>
                              <td>{r.membershipId}</td>
                              <td>{r.issueDate}</td>
                              <td>{r.returnDate}</td>
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
                        <th>Date of return</th>
                        <th>Fine Calculations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueReturn.length === 0
                        ? renderNoData(6)
                        : overdueReturn.map((r, i) => (
                            <tr key={i}>
                              <td>{r.serialNo}</td>
                              <td>{r.bookName}</td>
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
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Membership Id</th>
                        <th>Name of Book/Movie</th>
                        <th>Requested Date</th>
                        <th>Request Fulfilled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issueRequests.length === 0
                        ? renderNoData(4)
                        : issueRequests.map((r, i) => (
                            <tr key={i}>
                              <td>{r.membershipId}</td>
                              <td>{r.itemName}</td>
                              <td>{r.requestedDate}</td>
                              <td>{r.fulfilledDate}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
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