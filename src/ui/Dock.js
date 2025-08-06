import React from 'react';

export default function Dock({ items, panelHeight, baseItemSize, magnification }) {
  return (
    <div style={{
      height: panelHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#222',
      borderRadius: 16,
      marginTop: 32,
      gap: 24,
    }}>
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: baseItemSize,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {item.icon}
          <span style={{ fontSize: 14 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}