import React from 'react';

export default function InventoryPanel({ inventory }) {
  return (
    <div style={{ background: '#fff2', padding: 16, borderRadius: 12, marginBottom: 24 }}>
      <h3>Inventory</h3>
      <ul>
        {inventory && inventory.length > 0 ? (
          inventory.map((item, idx) => (
            <li key={idx}>{item.item} x{item.qty}</li>
          ))
        ) : (
          <li>No items yet.</li>
        )}
      </ul>
    </div>
  );
}