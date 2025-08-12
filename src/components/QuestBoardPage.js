import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QuestBoard from './QuestBoard';
import { saveUserData } from '../api/userData';

export default function QuestBoardPage() {
  const dispatch = useDispatch();
  const quests = useSelector(state => state.quests || { daily: [], weekly: [] });
  const stats = useSelector(state => state.stats);
  const user = useSelector(state => state.user);

  // Handlers for quests (same as in Dashboard)
  const handleAddQuest = (type, text, stat, extra = {}) => {
    if (!quests || !quests[type]) return;
    const { estimateMin, energy, context } = extra || {};
    const updated = [...quests[type], { text, completed: false, stat, ...(estimateMin ? { estimateMin } : {}), ...(energy ? { energy } : {}), ...(context && context.length ? { context } : {}) }];
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
  };
  
  const handleToggleQuest = (type, idx) => {
    if (!quests || !quests[type] || !quests[type][idx]) return;
    const quest = quests[type][idx];
    const updated = quests[type].map((q, i) => i === idx ? { ...q, completed: !q.completed } : q);
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: updated });
    
    // Update streak when quest is completed
    if (!quest.completed) {
      dispatch({ type: 'UPDATE_STREAK', payload: { habitName: quest.text, completed: true } });
      // Add XP and stat points based on quest stat
      const statToUpdate = quest.stat || 'willpower';
      dispatch({ type: 'UPDATE_STATS', payload: { [statToUpdate]: (stats?.[statToUpdate] || 0) + 5 } });
      
      // Add achievement if milestone reached
      const completedQuests = updated.filter(q => q.completed).length;
      if (completedQuests === 5) {
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: { 
          id: `quest_${type}_5`, 
          name: `${type === 'daily' ? 'Daily' : 'Weekly'} Champion`, 
          description: `Complete 5 ${type} quests`,
          unlockedAt: new Date().toISOString()
        }});
      }
    }
  };

  const handleKudos = (type, idx) => {
    const list = [...(quests[type] || [])];
    if (!list[idx]) return;
    list[idx] = { ...list[idx], kudosCount: (list[idx].kudosCount || 0) + 1 };
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: list });
  };

  const handleAddNote = (type, idx, note) => {
    if (!note || !note.trim()) return;
    const list = [...(quests[type] || [])];
    if (!list[idx]) return;
    list[idx] = { ...list[idx], notes: [...(list[idx].notes || []), { date: new Date().toISOString(), text: note.trim() }] };
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: list });
  };

  const handleFocusComplete = (type, idx) => {
    const list = [...(quests[type] || [])];
    if (!list[idx]) return;
    list[idx] = { ...list[idx], pomodorosCompleted: (list[idx].pomodorosCompleted || 0) + 1 };
    dispatch({ type: 'UPDATE_QUEST', questType: type, quests: list });
  };

  // Save quests promptly when they change on this page
  useEffect(() => {
    const persist = async () => {
      if (!user?.uid) return;
      try {
        await saveUserData(user.uid, { quests, lastUpdated: new Date().toISOString() });
      } catch (e) {
        console.error('Error saving quests:', e);
      }
    };
    persist();
  }, [quests, user?.uid]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.18)',
        borderRadius: 24,
        padding: '32px 24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: '#fff',
              padding: '8px 12px',
              cursor: 'pointer',
              marginRight: '16px',
              fontWeight: 'bold'
            }}
          >
            ← Back
          </button>
          <h1 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '28px',
            margin: 0
          }}>
            Quest Board
          </h1>
        </div>
        
        <QuestBoard
          dailyQuests={quests.daily}
          weeklyQuests={quests.weekly}
          onAddQuest={handleAddQuest}
          onToggleQuest={handleToggleQuest}
          onKudos={handleKudos}
          onAddNote={handleAddNote}
          onFocusComplete={handleFocusComplete}
        />
      </div>
    </div>
  );
}
