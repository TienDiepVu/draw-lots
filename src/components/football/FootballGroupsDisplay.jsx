import React from 'react';

export default function FootballGroupsDisplay({ groups }) {
  return (
    <div className="heats-container">
      {groups.map((group, idx) => (
        <div key={idx} className="heat-box">
          <div className="heat-header">
            {group.name}
          </div>
          <div>
            {/* Render đủ số slot của bảng (capacity) */}
            {Array.from({ length: group.capacity }).map((_, slotIdx) => {
              const teamName = group.teams[slotIdx];
              return (
                <div key={slotIdx} className="heat-slot">
                  <span className="slot-number">{slotIdx + 1}</span>
                  {teamName ? (
                    <span className="slot-team">
                      {teamName}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>[ Trống ]</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
