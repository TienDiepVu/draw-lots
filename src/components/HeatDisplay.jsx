import React from 'react';

export default function HeatDisplay({ heats }) {
  // heats is an array of objects: { name: 'Lượt 1', capacity: 4, teams: ['Team A', 'Team B'] }
  
  return (
    <div className="heats-container">
      {heats.map((heat, index) => (
        <div key={index} className="heat-box">
          <div className="heat-header">
            {heat.name} ({heat.teams.length}/{heat.capacity})
          </div>
          <div className="heat-body">
            {Array.from({ length: heat.capacity }).map((_, slotIndex) => {
              const team = heat.teams[slotIndex];
              return (
                <div key={slotIndex} className="heat-slot">
                  <span className="slot-number">#{slotIndex + 1}</span>
                  {team ? (
                    <span className="slot-team">{team}</span>
                  ) : (
                    <span className="slot-team" style={{ color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.5 }}>Khuyết</span>
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
