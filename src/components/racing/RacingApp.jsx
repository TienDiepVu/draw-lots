import { useState } from 'react';
import Registration from '../Registration';
import DrawLots from '../DrawLots';

export default function RacingApp({ onBack }) {
  const [step, setStep] = useState('registration'); // registration, drawing, result
  const [teams, setTeams] = useState([]);
  const [heats, setHeats] = useState([]);

  const handleRegistrationComplete = () => {
    const N = teams.length;
    if (N === 0) return;
    
    // Tự động tính số lượt chơi (mỗi lượt tối đa 4 đội)
    const numHeats = Math.ceil(N / 4);
    const base = Math.floor(N / numHeats);
    const remainder = N % numHeats;
    
    const newHeats = [];
    for (let i = 0; i < numHeats; i++) {
       newHeats.push({
         name: `Lượt ${i + 1}`,
         capacity: i < remainder ? base + 1 : base,
         teams: []
       });
    }
    setHeats(newHeats);
    setStep('drawing');
  };

  const handleDrawingComplete = () => {
    // Optionally wait a bit before moving to results or just stay there
  };

  const resetTournament = () => {
    setTeams([]);
    setHeats([]);
    setStep('registration');
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Trở lại Menu</button>
        <h1 className="title-glow page-title">
          TỔ CHỨC ĐUA XE MÔ PHỎNG
        </h1>
        <div style={{ width: '130px' }}></div> {/* Spacer to center title */}
      </div>

      {step === 'registration' && (
        <Registration 
          teams={teams} 
          setTeams={setTeams} 
          onNext={handleRegistrationComplete} 
        />
      )}

      {step === 'drawing' && (
        <DrawLots 
          teams={teams} 
          heats={heats} 
          setHeats={setHeats} 
          onComplete={handleDrawingComplete}
        />
      )}
      
      {step === 'drawing' && heats.reduce((s, h) => s + h.teams.length, 0) === teams.length && teams.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <button className="btn" onClick={resetTournament}>BẮT ĐẦU GIẢI ĐẤU MỚI</button>
        </div>
      )}
    </div>
  );
}
