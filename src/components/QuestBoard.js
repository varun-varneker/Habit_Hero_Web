import React, { useMemo, useState } from 'react';

const statOptions = [
  { key: 'charisma', label: 'Charisma' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'strength', label: 'Strength' },
  { key: 'adaptability', label: 'Adaptability' },
  { key: 'willpower', label: 'Willpower' },
];

const CONTEXTS = ['Home', 'Work', 'Errands', 'Offline'];
const ENERGY = [
  { key: 'low', label: 'Low' },
  { key: 'med', label: 'Medium' },
  { key: 'high', label: 'High' },
];

export default function QuestBoard({ dailyQuests = [], weeklyQuests = [], onAddQuest, onToggleQuest, onKudos, onAddNote, onFocusComplete }) {
  const [newQuest, setNewQuest] = useState('');
  const [selectedStat, setSelectedStat] = useState('willpower');
  const [estimateMin, setEstimateMin] = useState(25);
  const [energy, setEnergy] = useState('med');
  const [context, setContext] = useState([]);

  const [filterEnergy, setFilterEnergy] = useState('');
  const [filterContext, setFilterContext] = useState('');

  const startFocusTimer = (onDone) => {
    const input = window.prompt('Focus minutes (default 25):', '25');
    const minutes = Math.max(1, Number.isFinite(Number(input)) ? Number(input) : 25);
    const ms = minutes * 60 * 1000;
    try {
      // Tiny notification
      alert(`Focus started for ${minutes} min. Keep going!`);
      setTimeout(() => {
        alert('Focus session complete!');
        if (onDone) onDone();
      }, ms);
    } catch (e) {
      // Fallback immediate completion
      if (onDone) onDone();
    }
  };

  const filteredDaily = useMemo(() => {
    return dailyQuests.filter(q => {
      const okEnergy = filterEnergy ? q.energy === filterEnergy : true;
      const okCtx = filterContext ? (Array.isArray(q.context) && q.context.includes(filterContext)) : true;
      return okEnergy && okCtx;
    });
  }, [dailyQuests, filterEnergy, filterContext]);

  const filteredWeekly = useMemo(() => {
    return weeklyQuests.filter(q => {
      const okEnergy = filterEnergy ? q.energy === filterEnergy : true;
      const okCtx = filterContext ? (Array.isArray(q.context) && q.context.includes(filterContext)) : true;
      return okEnergy && okCtx;
    });
  }, [weeklyQuests, filterEnergy, filterContext]);

  return (
    <div style={styles.board}>
      {/* Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Energy</label>
          <select style={styles.select} value={filterEnergy} onChange={e => setFilterEnergy(e.target.value)}>
            <option value="">All</option>
            {ENERGY.map(e => (
              <option key={e.key} value={e.key}>{e.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Context</label>
          <select style={styles.select} value={filterContext} onChange={e => setFilterContext(e.target.value)}>
            <option value="">All</option>
            {CONTEXTS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 style={styles.title}>Daily Quests</h3>
      <ul style={styles.list}>
        {filteredDaily.map((q, i) => (
          <li key={i} style={styles.quest}>
            <input type="checkbox" checked={q.completed} onChange={() => onToggleQuest('daily', i)} />
            <span style={{ textDecoration: q.completed ? 'line-through' : 'none', color: '#fff' }}>{q.text}</span>
            {q.estimateMin ? <span style={styles.meta}>⏱ {q.estimateMin}m</span> : null}
            {q.energy ? <span style={styles.meta}>⚡ {q.energy}</span> : null}
            {Array.isArray(q.context) && q.context.length ? <span style={styles.meta}>🏷 {q.context.join(', ')}</span> : null}
            <span style={{ marginLeft: 8, color: '#b39ddb', fontSize: 13 }}>({q.stat ? statOptions.find(s => s.key === q.stat)?.label : 'Willpower'})</span>
            <div style={styles.rowActions}>
              <button type="button" style={styles.smallBtn} onClick={() => onKudos && onKudos('daily', i)}>👏 {q.kudosCount || 0}</button>
              <button type="button" style={styles.smallBtn} onClick={() => {
                const note = window.prompt('Add note');
                if (note) onAddNote && onAddNote('daily', i, note);
              }}>📝</button>
              <button type="button" style={styles.smallBtn} onClick={() => startFocusTimer(() => onFocusComplete && onFocusComplete('daily', i))}>⏱ Focus</button>
              {q.pomodorosCompleted ? <span style={styles.meta}>🍅 {q.pomodorosCompleted}</span> : null}
            </div>
          </li>
        ))}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newQuest.trim()) {
            onAddQuest('daily', newQuest.trim(), selectedStat, { estimateMin, energy, context });
            setNewQuest('');
          }
        }}
        style={{ marginTop: 8 }}
      >
        <input
          style={styles.input}
          value={newQuest}
          onChange={e => setNewQuest(e.target.value)}
          placeholder="Add new quest..."
        />
        <select style={styles.select} value={selectedStat} onChange={e => setSelectedStat(e.target.value)}>
          {statOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
        <select style={styles.select} value={estimateMin} onChange={e => setEstimateMin(Number(e.target.value))}>
          {[5, 15, 25, 45, 60].map(v => (
            <option key={v} value={v}>{v} min</option>
          ))}
        </select>
        <select style={styles.select} value={energy} onChange={e => setEnergy(e.target.value)}>
          {ENERGY.map(e => (
            <option key={e.key} value={e.key}>{e.label}</option>
          ))}
        </select>
        <div style={styles.contextWrap}>
          {CONTEXTS.map(c => {
            const checked = context.includes(c);
            return (
              <label key={c} style={styles.contextChip}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setContext(prev => checked ? prev.filter(x => x !== c) : [...prev, c])}
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
        <button style={styles.addBtn} type="submit">Add</button>
      </form>
      <h3 style={{ ...styles.title, marginTop: 24 }}>Weekly Challenges</h3>
      <ul style={styles.list}>
        {filteredWeekly.map((q, i) => (
          <li key={i} style={styles.quest}>
            <input type="checkbox" checked={q.completed} onChange={() => onToggleQuest('weekly', i)} />
            <span style={{ textDecoration: q.completed ? 'line-through' : 'none', color: '#fff' }}>{q.text}</span>
            {q.estimateMin ? <span style={styles.meta}>⏱ {q.estimateMin}m</span> : null}
            {q.energy ? <span style={styles.meta}>⚡ {q.energy}</span> : null}
            {Array.isArray(q.context) && q.context.length ? <span style={styles.meta}>🏷 {q.context.join(', ')}</span> : null}
            <span style={{ marginLeft: 8, color: '#b39ddb', fontSize: 13 }}>({q.stat ? statOptions.find(s => s.key === q.stat)?.label : 'Willpower'})</span>
            <div style={styles.rowActions}>
              <button type="button" style={styles.smallBtn} onClick={() => onKudos && onKudos('weekly', i)}>👏 {q.kudosCount || 0}</button>
              <button type="button" style={styles.smallBtn} onClick={() => {
                const note = window.prompt('Add note');
                if (note) onAddNote && onAddNote('weekly', i, note);
              }}>📝</button>
              <button type="button" style={styles.smallBtn} onClick={() => startFocusTimer(() => onFocusComplete && onFocusComplete('weekly', i))}>⏱ Focus</button>
              {q.pomodorosCompleted ? <span style={styles.meta}>🍅 {q.pomodorosCompleted}</span> : null}
            </div>
          </li>
        ))}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newQuest.trim()) {
            onAddQuest('weekly', newQuest.trim(), selectedStat, { estimateMin, energy, context });
            setNewQuest('');
          }
        }}
        style={{ marginTop: 8 }}
      >
        <input
          style={styles.input}
          value={newQuest}
          onChange={e => setNewQuest(e.target.value)}
          placeholder="Add new challenge..."
        />
        <select style={styles.select} value={selectedStat} onChange={e => setSelectedStat(e.target.value)}>
          {statOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
        <select style={styles.select} value={estimateMin} onChange={e => setEstimateMin(Number(e.target.value))}>
          {[5, 15, 25, 45, 60].map(v => (
            <option key={v} value={v}>{v} min</option>
          ))}
        </select>
        <select style={styles.select} value={energy} onChange={e => setEnergy(e.target.value)}>
          {ENERGY.map(e => (
            <option key={e.key} value={e.key}>{e.label}</option>
          ))}
        </select>
        <div style={styles.contextWrap}>
          {CONTEXTS.map(c => {
            const checked = context.includes(c);
            return (
              <label key={c} style={styles.contextChip}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setContext(prev => checked ? prev.filter(x => x !== c) : [...prev, c])}
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
        <button style={styles.addBtn} type="submit">Add</button>
      </form>
    </div>
  );
}

const styles = {
  board: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 2px 8px #7b2ff2aa',
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
  },
  filtersRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  filterLabel: {
    color: '#e6dcff',
    fontSize: 12,
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  quest: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  rowActions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  smallBtn: {
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: '4px 8px',
    cursor: 'pointer',
  },
  meta: {
    marginLeft: 8,
    color: '#d9d2ff',
    fontSize: 12,
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '2px 8px',
  },
  input: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '6px 10px',
    fontSize: 15,
    marginRight: 8,
  },
  select: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '6px 10px',
    fontSize: 15,
    marginRight: 8,
    background: '#fff',
  },
  contextWrap: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: 8,
  },
  contextChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#fff',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: '4px 8px',
    fontSize: 12,
  },
  addBtn: {
    background: '#7b2ff2',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
