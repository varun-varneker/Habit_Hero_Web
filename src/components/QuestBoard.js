import React, { useState } from 'react';

const statOptions = [
  { key: 'charisma', label: 'Charisma' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'strength', label: 'Strength' },
  { key: 'adaptability', label: 'Adaptability' },
  { key: 'willpower', label: 'Willpower' },
];

export default function QuestBoard({ dailyQuests = [], weeklyQuests = [], onAddQuest, onToggleQuest }) {
  const [newQuest, setNewQuest] = useState('');
  const [selectedStat, setSelectedStat] = useState('willpower');

  return (
    <div style={styles.board}>
      <h3 style={styles.title}>Daily Quests</h3>
      <ul style={styles.list}>
        {dailyQuests.map((q, i) => (
          <li key={i} style={styles.quest}>
            <input type="checkbox" checked={q.completed} onChange={() => onToggleQuest('daily', i)} />
            <span style={{ textDecoration: q.completed ? 'line-through' : 'none', color: '#fff' }}>{q.text}</span>
            <span style={{ marginLeft: 8, color: '#b39ddb', fontSize: 13 }}>({q.stat ? statOptions.find(s => s.key === q.stat)?.label : 'Willpower'})</span>
          </li>
        ))}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newQuest.trim()) {
            onAddQuest('daily', newQuest.trim(), selectedStat);
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
        <button style={styles.addBtn} type="submit">Add</button>
      </form>
      <h3 style={{ ...styles.title, marginTop: 24 }}>Weekly Challenges</h3>
      <ul style={styles.list}>
        {weeklyQuests.map((q, i) => (
          <li key={i} style={styles.quest}>
            <input type="checkbox" checked={q.completed} onChange={() => onToggleQuest('weekly', i)} />
            <span style={{ textDecoration: q.completed ? 'line-through' : 'none', color: '#fff' }}>{q.text}</span>
            <span style={{ marginLeft: 8, color: '#b39ddb', fontSize: 13 }}>({q.stat ? statOptions.find(s => s.key === q.stat)?.label : 'Willpower'})</span>
          </li>
        ))}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newQuest.trim()) {
            onAddQuest('weekly', newQuest.trim(), selectedStat);
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
