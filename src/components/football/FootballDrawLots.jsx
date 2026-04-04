import React, { useState, useRef, useEffect } from 'react';
import FootballGroupsDisplay from './FootballGroupsDisplay';
import { playTick, playSelect, playSuccess } from '../../utils/sound';

export default function FootballDrawLots({ teams, groups, setGroups, onComplete }) {
  const [remainingTeams, setRemainingTeams] = useState(() => {
    const assignedTeams = new Set();
    groups.forEach(g => g.teams.forEach(t => assignedTeams.add(t)));
    return teams.filter(t => !assignedTeams.has(t));
  });

  const [spinState, setSpinState] = useState('idle'); // idle | spinning | drawn
  const [pendingTeam, setPendingTeam] = useState(null);
  const [pendingGroupIndex, setPendingGroupIndex] = useState(null);
  const [currentSlotText, setCurrentSlotText] = useState('---');
  const [autoSpinNext, setAutoSpinNext] = useState(false);
  
  const spinInterval = useRef(null);

  // Tìm bảng trống đầu tiên
  const targetGroupIndex = groups.findIndex(g => g.teams.length < g.capacity);
  const targetGroup = targetGroupIndex !== -1 ? groups[targetGroupIndex] : null;

  // Xử lý logic tự động:
  useEffect(() => {
    // 1. Tự động chuyển xếp bảng cuối cùng khi các bảng đầu đã đầy
    if (targetGroupIndex === groups.length - 1 && remainingTeams.length > 0 && spinState === 'idle') {
      autoFillLastGroup();
      setAutoSpinNext(false);
    } 
    // 2. Chức năng quay tiếp liên tục lúc bấm "Tiếp tục"
    else if (autoSpinNext && spinState === 'idle' && remainingTeams.length > 0 && targetGroupIndex < groups.length - 1) {
      setAutoSpinNext(false);
      startSpin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetGroupIndex, remainingTeams.length, spinState, autoSpinNext]);

  const assignTeamToGroup = (team, groupIndex) => {
    const newGroups = groups.map((g, idx) => {
      if (idx === groupIndex) {
        return { ...g, teams: [...g.teams, team] };
      }
      return g;
    });
    setGroups(newGroups);
    setRemainingTeams(prev => prev.filter(t => t !== team));
    setCurrentSlotText('---');
  };

  const startSpin = () => {
    if (spinState !== 'idle' || !targetGroup || remainingTeams.length === 0) return;

    setSpinState('spinning');
    let ticks = 0;

    spinInterval.current = setInterval(() => {
      const randomTeam = remainingTeams[Math.floor(Math.random() * remainingTeams.length)];
      setCurrentSlotText(randomTeam);
      playTick();
      ticks++;

      if (ticks > 25) {
        clearInterval(spinInterval.current);
        const finalTeam = remainingTeams[Math.floor(Math.random() * remainingTeams.length)];
        setCurrentSlotText(finalTeam);
        setPendingTeam(finalTeam);
        setPendingGroupIndex(targetGroupIndex);
        setSpinState('drawn');
        playSelect();
      }
    }, 100);
  };

  // Xác nhận lưu vào bảng (từ nút ấn của người dùng sau khi đã quay xong)
  const confirmResult = () => {
    if (spinState === 'drawn' && pendingTeam !== null && pendingGroupIndex !== null) {
      // Đưa pendingTeam vào groups
      const newGroups = groups.map((g, idx) => {
        if (idx === pendingGroupIndex) {
          return { ...g, teams: [...g.teams, pendingTeam] };
        }
        return g;
      });
      
      setGroups(newGroups);
      setRemainingTeams(prev => prev.filter(t => t !== pendingTeam));
      
      setPendingTeam(null);
      setPendingGroupIndex(null);
      setSpinState('idle');
      setAutoSpinNext(true); // Kích hoạt hiệu ứng quay vòng tiếp theo

      checkCompletion(newGroups);
    }
  };

  const autoFillLastGroup = () => {
    let currentRemaining = [...remainingTeams];
    let newGroups = groups.map(g => ({ ...g, teams: [...g.teams] }));

    setCurrentSlotText('TỰ ĐỘNG XẾP BẢNG CUỐI...');
    setSpinState('spinning');
    playTick();

    newGroups.forEach((g, idx) => {
      if (idx >= targetGroupIndex) {
         while (g.teams.length < g.capacity && currentRemaining.length > 0) {
           g.teams.push(currentRemaining.pop());
         }
      }
    });

    setTimeout(() => {
      setGroups(newGroups);
      setRemainingTeams([]);
      setCurrentSlotText('HOÀN TẤT');
      setSpinState('idle');
      playSuccess();
      onComplete();
    }, 1500);
  };

  const checkCompletion = (latestGroups) => {
    const totalAssigned = latestGroups.reduce((sum, g) => sum + g.teams.length, 0);
    // Tính số lượng seed ban đầu để không bị cộng sai nếu dùng length của teams
    // Nhưng do teams truyền vào không thay đổi, ta có thể so sánh totalAssigned với teams.length
    if (totalAssigned === teams.length) {
      setTimeout(() => {
        playSuccess();
        onComplete();
      }, 500);
    }
  };

  if (remainingTeams.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="title-glow">Bước 3.2: Bốc Thăm Chia Bảng</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Hệ thống sẽ lấp đầy lần lượt các bảng.</p>

      <div style={{ display: 'flex', gap: '30px', margin: '30px 0', flexWrap: 'wrap' }}>
        {/* Cột trái: Đội chưa xếp */}
        <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '15px' }}>
            Các đội chờ bốc thăm ({remainingTeams.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {remainingTeams.map(t => (
              <div
                key={t}
                className="team-card"
                style={{
                  background: pendingTeam === t ? 'var(--primary)' : 'var(--glass-bg)',
                  color: pendingTeam === t ? '#000' : 'var(--text-main)',
                  border: pendingTeam === t ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: pendingTeam === t ? 'bold' : 'normal'
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Khung quay số */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {targetGroup && (
            <div style={{ fontSize: '1.2rem', minHeight: '30px', fontWeight: 'bold', color: 'var(--secondary)' }}>
              {targetGroupIndex === groups.length - 1 
                ? `Đang xếp các đội vào ${targetGroup.name}` 
                : spinState === 'drawn' 
                  ? `Đã bốc được đội cho: ${targetGroup.name}`
                  : `Đang bốc lượt cho: ${targetGroup.name}`}
            </div>
          )}

          <div className="slot-machine-container" style={{ 
            width: '100%', 
            maxWidth: '280px', 
            height: '100px',
            border: spinState === 'drawn' ? '2px solid var(--secondary)' : '2px solid var(--primary)',
            boxShadow: spinState === 'drawn' ? 'inset 0 0 15px rgba(0,0,0,0.8), 0 0 15px var(--secondary-glow)' : 'inset 0 0 15px rgba(0,0,0,0.8), 0 0 15px var(--primary-glow)',
            transition: 'all 0.3s ease'
          }}>
            <div className="slot-item" style={{ 
              fontSize: '1.8rem', 
              color: spinState === 'drawn' ? 'var(--text-main)' : 'var(--accent)',
              animation: spinState === 'spinning' ? 'drawSpin 0.1s infinite linear' : (spinState === 'drawn' ? 'popIn 0.4s ease-out' : 'none'),
              textAlign: 'center',
              padding: '0 10px',
              textShadow: spinState === 'drawn' ? '0 0 10px var(--secondary-glow)' : '0 0 10px rgba(252, 238, 10, 0.5)'
            }}>
              {currentSlotText}
            </div>
          </div>

          {targetGroupIndex !== groups.length - 1 && (
             spinState === 'idle' ? (
                <button 
                  className="btn" 
                  onClick={startSpin}
                  disabled={remainingTeams.length === 0}
                  style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                >
                  BẮT ĐẦU
                </button>
             ) : spinState === 'drawn' ? (
                <button 
                  className="btn btn-secondary" 
                  onClick={confirmResult}
                  style={{ fontSize: '1.2rem', padding: '1rem 3rem', animation: 'neonPulse 1.5s infinite' }}
                >
                  TIẾP TỤC
                </button>
             ) : (
                <button 
                  className="btn" 
                  disabled
                  style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                >
                  ĐANG QUAY...
                </button>
             )
          )}
        </div>
      </div>

      <FootballGroupsDisplay groups={groups} />
    </div>
  );
}
