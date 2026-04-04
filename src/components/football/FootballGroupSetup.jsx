import React from 'react';

export default function FootballGroupSetup({ teamsCount, numGroups, setNumGroups, onNext, onBack }) {
  const handleNumChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setNumGroups('');
      return;
    }
    const val = parseInt(rawVal, 10);
    if (!isNaN(val)) {
        if (val <= teamsCount) setNumGroups(val);
        else setNumGroups(teamsCount);
    }
  };

  const handleNext = () => {
    if (numGroups === '' || numGroups < 1) {
        alert("Vui lòng nhập số lượng bảng đấu hợp lệ (ít nhất 1 bảng).");
        return;
    }
    onNext(numGroups);
  };

  return (
    <div className="glass-panel">
      <h2 className="title-glow">Bước 2: Cài đặt Bảng đấu</h2>
      <p style={{ color: 'var(--text-muted)' }}>Hệ thống ghi nhận có tổng cộng <strong style={{ color: 'var(--primary)' }}>{teamsCount}</strong> đội tham gia.</p>

      <div style={{ margin: '30px 0', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Bạn muốn chia làm bao nhiêu bảng?</h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
            onClick={() => setNumGroups(Math.max(1, numGroups - 1))}
          >
            -
          </button>
          
          <input 
            type="number" 
            value={numGroups} 
            onChange={handleNumChange} 
            min="1" 
            max={teamsCount}
            style={{ width: '80px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
          />

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
            onClick={() => setNumGroups(Math.min(teamsCount, numGroups + 1))}
          >
            +
          </button>
        </div>

        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
          Trung bình <strong style={{ color: 'var(--primary)' }}>{(teamsCount / numGroups).toFixed(1)}</strong> đội / bảng
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          Quay lại
        </button>
        <button className="btn" onClick={handleNext}>
          Tiếp tục: Chọn Hạt giống
        </button>
      </div>
    </div>
  );
}
