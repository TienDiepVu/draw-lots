import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function FootballRegistration({ teams, setTeams, onNext }) {
  const [numTeams, setNumTeams] = useState(teams.length > 0 ? teams.length : 8);
  const [teamNames, setTeamNames] = useState(
    teams.length > 0 ? teams : Array.from({ length: 8 }, (_, i) => `Đội ${i + 1}`)
  );
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (numTeams === '') return;
    const count = parseInt(numTeams, 10);
    // Sync array length with numTeams when numTeams changes manually
    if (count > teamNames.length) {
      setTeamNames([
        ...teamNames,
        ...Array.from({ length: count - teamNames.length }, (_, i) => `Đội ${teamNames.length + i + 1}`)
      ]);
    } else if (count < teamNames.length && count >= 2) {
      setTeamNames(teamNames.slice(0, count));
    }
  }, [numTeams, teamNames]);

  const handleNameChange = (index, value) => {
    const newNames = [...teamNames];
    newNames[index] = value;
    setTeamNames(newNames);
  };

  const handleNumChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setNumTeams('');
      return;
    }
    const val = parseInt(rawVal, 10);
    if (!isNaN(val)) {
      if (val <= 64) setNumTeams(val);
      else setNumTeams(64);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonRow = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        const importedTeams = [];
        jsonRow.forEach((row, index) => {
          if (row && row[0]) {
             const teamName = String(row[0]).trim();
             if (teamName) {
               if (index === 0 && (teamName.toLowerCase() === 'tên đội' || teamName.toLowerCase() === 'ten doi')) {
                 return;
               }
               importedTeams.push(teamName);
             }
          }
        });

        // Cập nhật số lượng và tên
        if (importedTeams.length >= 2) {
            setNumTeams(importedTeams.length);
            setTeamNames(importedTeams);
        } else {
            alert("File excel cần ít nhất 2 đội.");
        }
      } catch (error) {
        console.error("Lỗi đọc file excel:", error);
        alert("Không thể đọc file excel. Vui lòng kiểm tra lại định dạng.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws_data = [
      ["Tên Đội"], // Header
      ["Chelsea"],
      ["Real Madrid"],
      ["Bayern Munich"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws["!cols"] = [{ wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");
    XLSX.writeFile(wb, "DanhSachDoi_BongDa.xlsx");
  };

  const submitRegistration = () => {
    if (numTeams === '' || numTeams < 2) {
        alert("Vui lòng nhập ít nhất 2 đội");
        return;
    }
    const finalTeams = teamNames.map((t, i) => t.trim() || `Đội ${i + 1}`);
    setTeams(finalTeams);
    onNext();
  };

  return (
    <div className="glass-panel">
      <h2 className="title-glow">Bước 1: Đăng ký Đội Bóng</h2>
      <p style={{ color: 'var(--text-muted)' }}>Nhập số lượng đội và tên cho từng đội hoặc tải lên từ Excel.</p>

      <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Số lượng đội:</label>
            <input 
            type="number" 
            value={numTeams} 
            onChange={handleNumChange} 
            min="2" 
            max="64"
            style={{ width: '100px', textAlign: 'center' }}
            />
        </div>
        <div style={{ width: '2px', height: '24px', background: 'var(--glass-border)', margin: '0 10px' }}></div>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => fileInputRef.current?.click()}
        >
          Nhập Excel
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={downloadTemplate}
        >
          Tải File Mẫu
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginTop: '20px', textAlign: 'left' }}>
        {teamNames.map((name, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', width: '30px', color: 'var(--text-muted)' }}>{idx + 1}.</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              placeholder={`Tên đội ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="btn" onClick={submitRegistration} style={{ width: '100%', maxWidth: '300px' }}>
          Tiếp tục: Chia bảng
        </button>
      </div>
    </div>
  );
}
