// (c) gkhandake 2026
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState('');
  const [days, setDays] = useState('');
  const [numDesks, setNumDesks] = useState(2);
  const [numVolsPerDesk, setNumVolsPerDesk] = useState(1);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('locations', JSON.stringify(locations.split(',').map(s => s.trim())));
    formData.append('days', JSON.stringify(days.split(',').map(s => s.trim())));
    formData.append('num_desks', numDesks);
    formData.append('num_vols_per_desk', numVolsPerDesk);

    try {
      const response = await axios.post('http://localhost:8000/schedule', formData);
      setSchedule(response.data);
    } catch (error) {
      alert('Error generating schedule: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!schedule) return;

    let csvContent = "data:text/csv;charset=utf-8,Location,Day,Slot,Desk,Alphabet Range,Volunteer Name,Email\n";

    schedule.schedules.forEach(loc => {
      loc.days.forEach(day => {
        day.slots.forEach(slot => {
          slot.assignments.forEach(asgn => {
            const vols = asgn.volunteers.length > 0 ? asgn.volunteers : [{ name: "Unassigned", email: "-" }];
            vols.forEach(v => {
              csvContent += `"${loc.location}","${day.day}","${slot.slot_type}","Desk ${asgn.desk}","${asgn.alphabet_range}","${v.name}","${v.email}"\n`;
            });
          });
        });
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteer_schedule.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="app-container">
      <header>
        <h1>Volunteer Scheduler</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Assign volunteers to marathon counters efficiently.
        </p>
      </header>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="config-section">
            <div className="left-col">
              <div className="input-group">
                <label>Locations (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Start Point, Finisher Line, Expo Hall"
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Days (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Saturday, Sunday"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="right-col">
              <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Num Desks</label>
                  <input
                    type="number"
                    value={numDesks}
                    onChange={(e) => setNumDesks(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Vols per Desk</label>
                  <input
                    type="number"
                    value={numVolsPerDesk}
                    onChange={(e) => setNumVolsPerDesk(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Volunteer CSV (name, email, location, slot)</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Schedule'}
          </button>
        </form>
      </div>

      {schedule && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Generated Schedule</h2>
            <button onClick={exportToCSV} style={{ background: 'var(--accent)', color: '#0f172a' }}>
              Export to CSV
            </button>
          </div>
          {schedule.schedules.map((loc, lIdx) => (
            <div key={lIdx} style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--accent)' }}>{loc.location}</h3>
              {loc.days.map((day, dIdx) => (
                <div key={dIdx} style={{ marginLeft: '1rem', marginBottom: '1.5rem' }}>
                  <h4>{day.day}</h4>
                  <div className="table-container glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Slot</th>
                          <th>Desk</th>
                          <th>Volunteer Names</th>
                          <th>Emails</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.slots.map((slot) => {
                          const slotRows = slot.assignments.length;
                          return slot.assignments.map((asgn, aIdx) => (
                            <tr key={`${slot.slot_type}-${asgn.desk}`} className={`desk-row-${(asgn.desk % 4) || 4}`}>
                              {aIdx === 0 && (
                                <td rowSpan={slotRows} style={{ verticalAlign: 'top' }}>
                                  <span className={`badge badge-${slot.slot_type}`}>
                                    {slot.slot_type.toUpperCase()}
                                  </span>
                                </td>
                              )}
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <strong>Desk {asgn.desk}</strong>
                                  <span className="alphabet-range">{asgn.alphabet_range}</span>
                                </div>
                              </td>
                              <td>
                                <div className="volunteer-list">
                                  {asgn.volunteers.length > 0 ? (
                                    asgn.volunteers.map((v, vIdx) => (
                                      <div key={vIdx} className="volunteer-item" style={{ fontWeight: '600' }}>
                                        {v.name}
                                      </div>
                                    ))
                                  ) : (
                                    <em style={{ color: '#ef4444' }}>Unassigned</em>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="volunteer-list">
                                  {asgn.volunteers.length > 0 ? (
                                    asgn.volunteers.map((v, vIdx) => (
                                      <div key={vIdx} className="volunteer-item" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {v.email}
                                      </div>
                                    ))
                                  ) : (
                                    '-'
                                  )}
                                </div>
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <p>&copy; gkhandake 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
