import React, { useState } from 'react';

export default function FootballSeedSetup({ teams, numGroups, groups, onNext, onBack }) {
  const [selectedSeeds, setSelectedSeeds] = useState([]);

  const toggleSeed = (team) => {
    if (selectedSeeds.includes(team)) {
      setSelectedSeeds(selectedSeeds.filter(t => t !== team));
    } else {
      if (selectedSeeds.length < numGroups) {
        setSelectedSeeds([...selectedSeeds, team]);
      }
    }
  };

  const handleNext = () => {
    if (selectedSeeds.length !== numGroups) return;
    
    // Tạo bản sao mới của nhóm để tránh thay đổi state trực tiếp
    const newGroups = groups.map(g => ({ ...g, teams: [...g.teams] }));
    
    // Sắp xếp các đội hạt giống lần lượt vào các bảng A, B, C...
    selectedSeeds.forEach((seed, index) => {
      newGroups[index].teams.push(seed);
    });

    onNext(newGroups);
  };

  return (
    <div className="glass-panel">
      <h2 className="title-glow">Bước 3.1: Chọn Đội Hạt Giống</h2>
      <p style={{ color: 'var(--text-muted)' }}>Với <strong style={{ color: 'var(--primary)' }}>{numGroups}</strong> bảng đấu, bạn cần chọn đủ <strong style={{ color: 'var(--primary)' }}>{numGroups}</strong> đội hạt giống.</p>
      
      <div style={{ padding: '10px 20px', background: selectedSeeds.length === numGroups ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${selectedSeeds.length === numGroups ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: '8px', margin: '20px 0', color: selectedSeeds.length === numGroups ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>
        Đã chọn: {selectedSeeds.length} / {numGroups}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px', className: 'grid-teams' }}>
        {teams.map(team => {
          const isSelected = selectedSeeds.includes(team);
          return (
            <button
              key={team}
              onClick={() => toggleSeed(team)}
              className={`team-card ${isSelected ? 'selected' : ''}`}
              style={{
                border: 'none',
                borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                cursor: 'pointer',
                padding: '10px 15px',
                minWidth: '120px',
                opacity: (!isSelected && selectedSeeds.length >= numGroups) ? 0.5 : 1,
                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                background: isSelected ? 'rgba(0, 243, 255, 0.1)' : 'var(--glass-bg)'
              }}
              disabled={!isSelected && selectedSeeds.length >= numGroups}
            >
              {team}
              {isSelected && <span style={{ marginLeft: '8px' }}>✓</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          Quay lại Bước 2
        </button>
        <button 
          className="btn" 
          onClick={handleNext}
          disabled={selectedSeeds.length !== numGroups}
        >
          Xác nhận & Vào Bốc thăm
        </button>
      </div>
    </div>
  );
}
