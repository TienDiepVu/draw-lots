import { useState, useEffect } from 'react';
import RacingApp from './components/racing/RacingApp';
import FootballApp from './components/football/FootballApp';

function App() {
  // 'menu', 'racing', 'football'
  const [appMode, setAppMode] = useState('menu');

  useEffect(() => {
    // Thay đổi background tùy theo chế độ
    if (appMode === 'football') {
      document.body.className = 'bg-football';
    } else if (appMode === 'racing') {
      document.body.className = 'bg-racing';
    } else {
      document.body.className = '';
    }
  }, [appMode]);

  if (appMode === 'racing') {
    return <RacingApp onBack={() => setAppMode('menu')} />;
  }

  if (appMode === 'football') {
    return <FootballApp onBack={() => setAppMode('menu')} />;
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      <h1 className="title-glow main-title">
        HỆ THỐNG QUẢN LÝ TIỆN ÍCH
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '4rem' }}>
        Vui lòng chọn hệ thống bạn muốn sử dụng
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
        <button 
          className="glass-panel menu-card"
          onClick={() => setAppMode('racing')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏎️</div>
          <h2 className="title-glow" style={{ color: 'var(--primary)' }}>Đua xe Mô phỏng</h2>
          <p style={{ color: 'var(--text-muted)' }}>Bốc thăm lượt thi đấu trên Simulator</p>
        </button>

        <button 
          className="glass-panel menu-card"
          onClick={() => setAppMode('football')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#3498db';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚽</div>
          <h2 className="title-glow" style={{ color: '#3498db' }}>Bốc thăm Bóng đá</h2>
          <p style={{ color: 'var(--text-muted)' }}>Chia bảng, xếp hạt giống tự động</p>
        </button>
      </div>
    </div>
  );
}

export default App;
