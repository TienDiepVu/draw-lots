import { useState } from 'react';
import FootballRegistration from './FootballRegistration';
import FootballGroupSetup from './FootballGroupSetup';
import FootballSeedSetup from './FootballSeedSetup';
import FootballDrawLots from './FootballDrawLots';
import FootballGroupsDisplay from './FootballGroupsDisplay';

export default function FootballApp({ onBack }) {
  const [step, setStep] = useState('registration'); // registration, group_setup, seed_setup, drawing, result
  const [teams, setTeams] = useState([]);
  const [numGroups, setNumGroups] = useState(2);
  const [groups, setGroups] = useState([]);

  // Bước 1 -> 2
  const handleRegistrationComplete = () => {
    const n = teams.length;
    let suggestedGroups = 2;
    if (n >= 16) suggestedGroups = 4;
    if (n >= 32) suggestedGroups = 8;
    setNumGroups(suggestedGroups);
    setStep('group_setup');
  };

  // Bước 2 -> 3
  const handleGroupSetupComplete = (groupsCount) => {
    setNumGroups(groupsCount);
    const N = teams.length;
    const base = Math.floor(N / groupsCount);
    const remainder = N % groupsCount;

    const newGroups = [];
    for (let i = 0; i < groupsCount; i++) {
       // Xếp đều từ cao đến thấp, chênh lệch không quá 1
       const capacity = i < remainder ? base + 1 : base;
       
       newGroups.push({
         name: `Bảng ${String.fromCharCode(65 + i)}`,
         capacity: capacity,
         teams: []
       });
    }
    setGroups(newGroups);
    setStep('seed_setup');
  };

  // Bước 3.1 -> 3.2
  const handleSeedSetupComplete = (seededGroups) => {
    setGroups(seededGroups);
    setStep('drawing');
  };

  const handleDrawingComplete = () => {
    setStep('result');
  };

  const resetTournament = () => {
    setTeams([]);
    setGroups([]);
    setStep('registration');
  };

  return (
    <div style={{ paddingBottom: '50px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Trở lại Menu</button>
        <h1 className="title-glow page-title">
          VTI GROUP <br/>Champions League 2026
        </h1>
        <div style={{ width: '150px' }}></div>
      </div>

      {step === 'registration' && (
        <FootballRegistration 
          teams={teams} 
          setTeams={setTeams} 
          onNext={handleRegistrationComplete} 
        />
      )}

      {step === 'group_setup' && (
        <FootballGroupSetup 
          teamsCount={teams.length}
          numGroups={numGroups}
          setNumGroups={setNumGroups}
          onNext={handleGroupSetupComplete}
          onBack={() => setStep('registration')}
        />
      )}

      {step === 'seed_setup' && (
        <FootballSeedSetup 
          teams={teams}
          numGroups={numGroups}
          groups={groups}
          onNext={handleSeedSetupComplete}
          onBack={() => setStep('group_setup')}
        />
      )}

      {step === 'drawing' && (
        <FootballDrawLots 
          teams={teams} 
          groups={groups} 
          setGroups={setGroups} 
          onComplete={handleDrawingComplete}
        />
      )}

      {step === 'result' && (
        <div className="glass-panel" style={{ marginTop: '20px' }}>
          <h2 className="title-glow" style={{ marginBottom: '20px' }}>🎉 Kết quả Bốc thăm hoàn tất 🎉</h2>
          <FootballGroupsDisplay groups={groups} />
          <div style={{ marginTop: '2rem' }}>
            <button className="btn" onClick={resetTournament}>BẮT ĐẦU GIẢI ĐẤU MỚI</button>
          </div>
        </div>
      )}
    </div>
  );
}
