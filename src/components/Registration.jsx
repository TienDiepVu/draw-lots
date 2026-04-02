import { useRef } from 'react';
import * as XLSX from 'xlsx';

export default function Registration({ teams, setTeams, onNext }) {
  const fileInputRef = useRef(null);

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
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

        const newTeams = [];
        for (const t of importedTeams) {
           if (newTeams.length < 40) {
              newTeams.push(t);
           }
        }
        setTeams(newTeams);
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
      ["Racing Team 1"],
      ["Racing Team 2"],
      ["Racing Team 3"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Auto calculate column width
    ws["!cols"] = [{ wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");
    XLSX.writeFile(wb, "DanhSachDoi_Mau.xlsx");
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="title-glow">Đăng ký Đội Thi Đấu</h2>
      <p style={{ color: 'var(--text-muted)' }}>Hệ thống sẽ tự động chia lượt dựa trên số lượng đội (tối đa 4 xe/lượt)</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
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
          disabled={teams.length >= 40}
          title="File Excel cần có tên đội ở cột đầu tiên"
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

      <div style={{ margin: '20px 0', fontSize: '1.2rem', color: 'var(--primary)' }}>
        Số lượng đội đã đăng ký: {teams.length}
      </div>

      <div className="grid-teams">
        {teams.map((t, idx) => (
          <div key={idx} className="team-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t}</span>
            <button
              onClick={() => removeTeam(idx)}
              style={{ background: 'transparent', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="dock">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn xóa tất cả các đội đang có?')) {
              setTeams([]);
            }
          }}
          disabled={teams.length === 0}
        >
          XÓA TẤT CẢ
        </button>
        <button 
          className="btn" 
          onClick={onNext}
          disabled={teams.length === 0}
        >
          {teams.length > 0 ? 'BẮT ĐẦU BỐC THĂM' : 'CẦN ÍT NHẤT 1 ĐỘI'}
        </button>
      </div>
    </div>
  );
}
