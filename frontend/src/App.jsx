// (c) gkhandake 2026
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState('');
  const [daysList, setDaysList] = useState([]);
  const [numDesks, setNumDesks] = useState('');
  const [numVolsPerDesk, setNumVolsPerDesk] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState('');
  const [rangeMode, setRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const addDay = (date) => {
    if (!daysList.includes(date)) {
      setDaysList([...daysList, date].sort());
    }
  };

  const addRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const dates = [];
    let curr = new Date(start);
    while (curr <= end) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    const newList = [...new Set([...daysList, ...dates])].sort();
    setDaysList(newList);
  };

  const removeDay = (index) => {
    setDaysList(daysList.filter((_, i) => i !== index));
  };

  const generateSchedule = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a volunteer CSV file');
      return;
    }
    if (daysList.length === 0) {
      setError('Please select at least one day');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('locations', JSON.stringify(locations.split(',').map(s => s.trim())));
    formData.append('days', JSON.stringify(daysList));
    formData.append('num_desks', parseInt(numDesks));
    formData.append('num_vols_per_desk', parseInt(numVolsPerDesk));

    try {
      const response = await axios.post('http://localhost:8000/schedule', formData);
      setSchedule(response.data);
      if (response.data.schedules.length > 0 && response.data.schedules[0].days.length > 0) {
        setActiveDay(response.data.schedules[0].days[0].day);
      }
    } catch (err) {
      setError(err.response?.data?.detail || '🚨 Failed to generate schedule. Please check your inputs.');
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
    link.setAttribute("download", `marathon_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format date with day name
  const formatDateWithDay = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  // Get unique days from the schedule
  const allDays = schedule ? [...new Set(schedule.schedules.flatMap(loc => loc.days.map(d => d.day)))] : [];

  return (
    <div className="container">
      <header className="header">
        <h1>🏃 Run Volunteer Scheduler</h1>
        <p>Assign and manage race goodies distribution volunteers with ease ✨</p>
      </header>

      <div className="main-layout">
        {/* Left Column: Configuration */}
        <aside className="sidebar">
          <div className="card">
            <div className="card-header">
              <h2>⚙️ Configuration</h2>
            </div>
            <form onSubmit={generateSchedule}>
              <div className="config-grid">
                <div className="input-group">
                  <label>📍 Locations</label>
                  <input
                    type="text"
                    placeholder="e.g. Expo, Start, Finish"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <div className="input-group-header">
                    <label>📅 Selected Days</label>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => setRangeMode(!rangeMode)}
                    >
                      {rangeMode ? 'Single Mode' : 'Range Mode'}
                    </button>
                  </div>

                  <div className="selected-days-list">
                    {daysList.map((d, i) => (
                      <span key={i} className="day-badge">
                        {formatDateWithDay(d)}
                        <button type="button" onClick={() => removeDay(i)}>×</button>
                      </span>
                    ))}
                    {daysList.length === 0 && <span className="placeholder-text">No days selected</span>}
                  </div>

                  {rangeMode ? (
                    <div className="range-picker-row">
                      <div className="range-inputs">
                        <div className="input-group">
                          <label>From</label>
                          <input type="date" className="date-picker-input" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
                        </div>
                        <div className="input-group">
                          <label>To</label>
                          <input type="date" className="date-picker-input" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
                        </div>
                      </div>
                      <button type="button" className="btn-secondary" onClick={addRange}>
                        ➕ Add Range
                      </button>
                    </div>
                  ) : (
                    <div className="add-day-row">
                      <input
                        type="date"
                        className="date-picker-input"
                        onChange={(e) => {
                          if (e.target.value) {
                            addDay(e.target.value);
                            e.target.value = ''; // Reset after add
                          }
                        }}
                      />
                      <span className="add-hint">Select a date to add it to the schedule</span>
                    </div>
                  )}
                </div>
                <div className="input-group-row">
                  <div className="input-group">
                    <label>🗄️ Desks</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      value={numDesks}
                      onChange={(e) => setNumDesks(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>👥 Per Desk</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 2"
                      value={numVolsPerDesk}
                      onChange={(e) => setNumVolsPerDesk(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: '0.5rem' }}>
                  <label>📄 Volunteer CSV</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? '⏳ Generating...' : '🚀 Generate Schedule'}
              </button>
            </form>
          </div>
          {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
        </aside>

        {/* Right Column: Results */}
        <main className="content">
          {schedule ? (
            <div className="schedule-results animate-in">
              <div className="results-header">
                <h2 style={{ margin: 0 }}>📊 Schedule Results</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={exportToCSV} className="btn-success" style={{ height: 'fit-content' }}>
                    📥 Export CSV
                  </button>
                </div>
              </div>

              {/* Metrics Dashboard */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-label">📈 Coverage</span>
                  <span className="metric-value">{schedule.metrics.coverage_percentage}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${schedule.metrics.coverage_percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="metric-card">
                  <span className="metric-label">👥 Volunteers</span>
                  <span className="metric-value">
                    {schedule.metrics.assigned_volunteers_count} / {schedule.metrics.total_volunteers_available}
                  </span>
                  <span className="metric-hint">Assigned vs Available</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label">🚨 Status</span>
                  {schedule.metrics.unassigned_slots_count > 0 ? (
                    <>
                      <span className="metric-value status-deficit">-{schedule.metrics.unassigned_slots_count}</span>
                      <span className="metric-hint">Unfilled Positions</span>
                    </>
                  ) : (
                    <>
                      <span className="metric-value status-surplus">+{schedule.metrics.surplus_volunteers_count}</span>
                      <span className="metric-hint">Surplus Volunteers</span>
                    </>
                  )}
                </div>
              </div>

              <div className="tab-container">
                <div className="tab-buttons">
                  {schedule && [...new Set(schedule.schedules.flatMap(loc => loc.days.map(d => d.day)))].map(day => (
                    <button
                      key={day}
                      className={`tab-button ${activeDay === day ? 'active' : ''}`}
                      onClick={() => setActiveDay(day)}
                    >
                      🗓️ {formatDateWithDay(day)}
                    </button>
                  ))}
                </div>

                <div className="scroll-area">
                  {schedule.schedules.map((loc) => (
                    <div key={loc.location} className="location-section">
                      <h3 className="location-title">📍 {loc.location}</h3>
                      {loc.days.filter(d => d.day === activeDay).map((day) => {
                        const firstSlot = day.slots.find(s => s.slot_type.toLowerCase() === 'first');
                        const secondSlot = day.slots.find(s => s.slot_type.toLowerCase() === 'second');
                        const numDesksTotal = Math.max(
                          firstSlot?.assignments.length || 0,
                          secondSlot?.assignments.length || 0
                        );

                        return (
                          <div key={day.day}>
                            <div className="schedule-grid">
                              <div className="grid-header">
                                <div className="col-desk">🏢 Desk</div>
                                <div className="col-slot">🕒 First Slot (AM)</div>
                                <div className="col-slot">🕓 Second Slot (PM)</div>
                              </div>
                              <div className="grid-body">
                                {Array.from({ length: numDesksTotal }).map((_, idx) => {
                                  const deskNum = idx + 1;
                                  const firstAsgn = firstSlot?.assignments.find(a => a.desk === deskNum);
                                  const secondAsgn = secondSlot?.assignments.find(a => a.desk === deskNum);

                                  return (
                                    <div key={deskNum} className={`grid-row desk-row-${(deskNum % 4) || 4}`}>
                                      <div className="col-desk">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                          <strong>D-{deskNum}</strong>
                                          <span className="alphabet-range">{firstAsgn?.alphabet_range || secondAsgn?.alphabet_range}</span>
                                        </div>
                                      </div>
                                      <div className="col-slot">
                                        <div className="volunteer-list">
                                          {/* Assigned Volunteers */}
                                          {firstAsgn?.volunteers.map((v, vIdx) => (
                                            <div key={vIdx} className="volunteer-item horizontal">
                                              <span className="v-name">{v.name}</span>
                                              <span className="v-email-inline">({v.email})</span>
                                            </div>
                                          ))}
                                          {/* Empty Slots */}
                                          {Array.from({ length: Math.max(0, numVolsPerDesk - (firstAsgn?.volunteers.length || 0)) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="volunteer-item horizontal">
                                              <em className="unassigned">❌ Empty</em>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="col-slot">
                                        <div className="volunteer-list">
                                          {/* Assigned Volunteers */}
                                          {secondAsgn?.volunteers.map((v, vIdx) => (
                                            <div key={vIdx} className="volunteer-item horizontal">
                                              <span className="v-name">{v.name}</span>
                                              <span className="v-email-inline">({v.email})</span>
                                            </div>
                                          ))}
                                          {/* Empty Slots */}
                                          {Array.from({ length: Math.max(0, numVolsPerDesk - (secondAsgn?.volunteers.length || 0)) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="volunteer-item horizontal">
                                              <em className="unassigned">❌ Empty</em>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-card">
              <div className="placeholder-content">
                <span style={{ fontSize: '3rem' }}>📈</span>
                <h3>No Schedule Generated</h3>
                <p>Fill out the configuration on the left to get started.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; gkhandake 2026. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
          Created using <strong>Gemini</strong> and <strong>Antigravity</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
