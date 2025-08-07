import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function FriendsPanel() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const dispatch = useDispatch();
  const friends = useSelector(state => state.friends || []);
  const friendRequests = useSelector(state => state.friendRequests || []);

  const handleSendFriendRequest = (e) => {
    e.preventDefault();
    if (friendEmail.trim()) {
      // In a real app, this would send a request via API
      dispatch({
        type: 'SEND_FRIEND_REQUEST',
        payload: { email: friendEmail, status: 'pending', sentAt: new Date().toISOString() }
      });
      setFriendEmail('');
      setShowAddFriend(false);
    }
  };

  const handleAcceptFriend = (requestId) => {
    dispatch({ type: 'ACCEPT_FRIEND_REQUEST', payload: requestId });
  };

  const handleRejectFriend = (requestId) => {
    dispatch({ type: 'REJECT_FRIEND_REQUEST', payload: requestId });
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h3 style={styles.title}>👥 Friends</h3>
        <button 
          style={styles.addBtn}
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          +
        </button>
      </div>

      {/* Add Friend Form */}
      {showAddFriend && (
        <form onSubmit={handleSendFriendRequest} style={styles.addForm}>
          <input
            type="email"
            placeholder="Friend's email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            style={styles.emailInput}
            required
          />
          <button type="submit" style={styles.sendBtn}>Send Request</button>
        </form>
      )}

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Friend Requests</h4>
          {friendRequests.map((request, idx) => (
            <div key={idx} style={styles.requestItem}>
              <div style={styles.requestInfo}>
                <span style={styles.requestEmail}>{request.email}</span>
                <span style={styles.requestTime}>
                  {new Date(request.sentAt).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.requestActions}>
                <button 
                  style={styles.acceptBtn}
                  onClick={() => handleAcceptFriend(idx)}
                >
                  ✓
                </button>
                <button 
                  style={styles.rejectBtn}
                  onClick={() => handleRejectFriend(idx)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>My Friends ({friends.length})</h4>
        {friends.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No friends yet!</p>
            <p style={styles.emptySubtext}>Add friends to share your journey and stay motivated together.</p>
          </div>
        ) : (
          <div style={styles.friendsList}>
            {friends.map((friend, idx) => (
              <div key={idx} style={styles.friendItem}>
                <div style={styles.friendAvatar}>
                  <img 
                    src={friend.avatar || "https://img.icons8.com/color/48/000000/person-male.png"}
                    alt={friend.name}
                    style={styles.avatarImg}
                  />
                  <div style={styles.statusIndicator(friend.isOnline)} />
                </div>
                <div style={styles.friendInfo}>
                  <span style={styles.friendName}>{friend.name || friend.email}</span>
                  <span style={styles.friendLevel}>Level {friend.level || 1}</span>
                  <span style={styles.friendStatus}>
                    {friend.isOnline ? 'Online' : `Last seen ${friend.lastSeen || 'Unknown'}`}
                  </span>
                </div>
                <div style={styles.friendActions}>
                  <button style={styles.encourageBtn} title="Send Encouragement">
                    💪
                  </button>
                  <button style={styles.challengeBtn} title="Challenge Friend">
                    ⚔️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button style={styles.actionBtn}>
          <span>🏆</span>
          <span>Leaderboard</span>
        </button>
        <button style={styles.actionBtn}>
          <span>🎯</span>
          <span>Group Challenge</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 2px 8px #7b2ff2aa',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    margin: 0,
  },
  addBtn: {
    background: '#7b2ff2',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addForm: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  emailInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 14,
  },
  sendBtn: {
    background: '#7b2ff2',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#b39ddb',
    fontSize: 14,
    fontWeight: 600,
    margin: '0 0 8px 0',
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    marginBottom: 6,
  },
  requestInfo: {
    flex: 1,
  },
  requestEmail: {
    color: '#fff',
    fontSize: 14,
    display: 'block',
  },
  requestTime: {
    color: '#b39ddb',
    fontSize: 12,
  },
  requestActions: {
    display: 'flex',
    gap: 6,
  },
  acceptBtn: {
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    width: 24,
    height: 24,
    cursor: 'pointer',
    fontSize: 12,
  },
  rejectBtn: {
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    width: 24,
    height: 24,
    cursor: 'pointer',
    fontSize: 12,
  },
  emptyState: {
    textAlign: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#fff',
    margin: 0,
    fontSize: 14,
  },
  emptySubtext: {
    color: '#b39ddb',
    margin: '4px 0 0 0',
    fontSize: 12,
  },
  friendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  friendItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    gap: 12,
  },
  friendAvatar: {
    position: 'relative',
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  statusIndicator: (isOnline) => ({
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: isOnline ? '#4caf50' : '#888',
    border: '2px solid #333',
  }),
  friendInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  friendName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
  },
  friendLevel: {
    color: '#7b2ff2',
    fontSize: 12,
    fontWeight: 500,
  },
  friendStatus: {
    color: '#b39ddb',
    fontSize: 11,
  },
  friendActions: {
    display: 'flex',
    gap: 6,
  },
  encourageBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
    fontSize: 16,
  },
  challengeBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
    fontSize: 16,
  },
  quickActions: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    background: 'rgba(123, 47, 242, 0.3)',
    border: '1px solid #7b2ff2',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
  },
};
