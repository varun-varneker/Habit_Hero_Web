import React, { useState, useEffect } from 'react';

export default function Dock({ items, panelHeight = 68, baseItemSize = 50, magnification = 70 }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      height: panelHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: 16,
      gap: isMobile ? 16 : 24,
      padding: '0 20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 1000,
    }}>
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: isMobile ? 14 : baseItemSize,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px',
            borderRadius: 8,
            transition: 'all 0.2s ease',
            minWidth: isMobile ? 60 : 70,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(123, 47, 242, 0.3)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <div style={{ marginBottom: 4 }}>{item.icon}</div>
          <span style={{ 
            fontSize: isMobile ? 10 : 12,
            fontWeight: 600
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}