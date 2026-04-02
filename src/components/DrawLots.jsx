import { useState, useRef } from 'react';
import HeatDisplay from './HeatDisplay';
import { playTick, playSelect, playSuccess } from '../utils/sound';

export default function DrawLots({ teams, heats, setHeats, onComplete }) {
  const [remainingTeams, setRemainingTeams] = useState([...teams]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSlotText, setCurrentSlotText] = useState('---');
  const [mode, setMode] = useState('manual'); // 'manual' | 'auto'

  const spinInterval = useRef(null);

  // Helper: get all available heats
  const getAvailableHeats = () => {
    return heats.filter(h => h.teams.length < h.capacity);
  };

  const handleSelectTeam = (team) => {
    if (isSpinning) return;
    setActiveTeam(team);
    setCurrentSlotText('SẴN SÀNG QUAY');
  };

  const assignTeamToHeat = (team, heatIndex) => {
    const newHeats = [...heats];
    newHeats[heatIndex].teams.push(team);
    setHeats(newHeats);
    setRemainingTeams(prev => prev.filter(t => t !== team));
    setActiveTeam(null);
    setCurrentSlotText('---');
  };

  // Option 1: Manual (Team draws Heat)
  const spinManual = () => {
    if (!activeTeam || isSpinning) return;
    
    const available = getAvailableHeats();
    if (available.length === 0) return;

    setIsSpinning(true);
    let ticks = 0;
    
    // Spinning animation
    spinInterval.current = setInterval(() => {
      const heat = available[Math.floor(Math.random() * available.length)];
      setCurrentSlotText(heat.name);
      playTick();
      ticks++;
      
      if (ticks > 20) {
        clearInterval(spinInterval.current);
        const finalHeatIndex = heats.findIndex(h => h.name === heat.name);
        setCurrentSlotText(heats[finalHeatIndex].name);
        playSelect();
        
        setTimeout(() => {
          assignTeamToHeat(activeTeam, finalHeatIndex);
          setIsSpinning(false);
          checkCompletion([...heats]);
        }, 1000);
      }
    }, 100);
  };

  // Option 2: Auto (Randomly assign all remaining teams)
  const drawAutoAll = () => {
    if (isSpinning || remainingTeams.length === 0) return;
    setIsSpinning(true);
    
    let currentRemaining = [...remainingTeams];
    let newHeats = JSON.parse(JSON.stringify(heats)); // Deep copy

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
    
    shuffleArray(currentRemaining);
    setCurrentSlotText('ĐANG XẾP...');
    playTick();

    // Fill all empty slots
    newHeats.forEach(heat => {
      while (heat.teams.length < heat.capacity && currentRemaining.length > 0) {
        heat.teams.push(currentRemaining.pop());
      }
    });

    setTimeout(() => {
      setHeats(newHeats);
      setRemainingTeams([]);
      setCurrentSlotText('HOÀN TẤT');
      playSuccess();
      setIsSpinning(false);
      onComplete();
    }, 1500);
  };

  const checkCompletion = (latestHeats) => {
    const totalAssigned = latestHeats.reduce((sum, h) => sum + h.teams.length, 0);
    if (totalAssigned === teams.length) {
      setTimeout(() => {
        playSuccess();
        onComplete();
      }, 500);
    }
  };

  if (remainingTeams.length === 0) {
    return (
      <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="title-glow">Kết quả Phân Lượt Vòng 1</h2>
        <HeatDisplay heats={heats} />
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="title-glow">Bốc Thăm Lượt Thi Đấu</h2>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          className={`btn ${mode === 'manual' ? '' : 'btn-secondary'}`} 
          onClick={() => setMode('manual')}
          disabled={isSpinning}
        >
          Đại điện Đội Lên Quay
        </button>
        <button 
          className={`btn ${mode === 'auto' ? '' : 'btn-secondary'}`} 
          onClick={() => setMode('auto')}
          disabled={isSpinning}
        >
          Quay Tự Động Tất Cả
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Side: remaining teams */}
        <div style={{ flex: 1, textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Các đội chưa xếp ({remainingTeams.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {remainingTeams.map(t => (
              <button
                key={t}
                onClick={() => mode === 'manual' && handleSelectTeam(t)}
                disabled={isSpinning || mode === 'auto'}
                style={{
                  background: activeTeam === t ? 'var(--primary)' : 'transparent',
                  color: activeTeam === t ? '#000' : 'var(--text-main)',
                  border: `1px solid ${activeTeam === t ? 'var(--primary)' : 'var(--glass-border)'}`,
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: (isSpinning || mode === 'auto') ? 'default' : 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Slot Machine */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
          {mode === 'manual' && (
            <div style={{ fontSize: '1.2rem', minHeight: '30px' }}>
              {activeTeam ? `Đội bốc: ${activeTeam}` : 'Vui lòng chọn 1 đội bên trái'}
            </div>
          )}

          <div className="slot-machine-container" style={{ width: '100%', maxWidth: '300px', height: '100px' }}>
            <div className="slot-item" style={{ animation: isSpinning ? 'drawSpin 0.1s infinite linear' : 'none' }}>
              {currentSlotText}
            </div>
          </div>

          {mode === 'manual' ? (
            <button 
              className="btn" 
              onClick={spinManual}
              disabled={!activeTeam || isSpinning}
              style={{ padding: '1rem 3rem', fontSize: '1.5rem' }}
            >
              QUAY LƯỢT
            </button>
          ) : (
            <button 
              className="btn" 
              onClick={drawAutoAll}
              disabled={isSpinning}
              style={{ padding: '1rem 3rem', fontSize: '1.5rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
            >
              TỰ ĐỘNG XẾP
            </button>
          )}
        </div>
      </div>

      <HeatDisplay heats={heats} />
    </div>
  );
}
