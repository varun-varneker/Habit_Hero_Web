import React from "react";
import { useDispatch, useSelector } from "react-redux";

const STAT_KEYS = ["charisma", "intelligence", "strength", "adaptability", "willpower"];

export default function LevelUpModal({ onClose }) {
  const dispatch = useDispatch();
  const stats = useSelector(state => state.stats);

  function handleReward(stat) {
    dispatch({
      type: "UPDATE_STATS",
      payload: {
        [stat]: (stats[stat] || 0) + 1,
        levelUpPending: false
      }
    });
    if (onClose) onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 24px #23294644",
        padding: 32,
        zIndex: 9999
      }}
    >
      <h2 style={{ color: "#7b2ff2" }}>🎉 Level Up!</h2>
      <p>Choose a stat to boost:</p>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {STAT_KEYS.map(stat => (
          <button
            key={stat}
            onClick={() => handleReward(stat)}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}