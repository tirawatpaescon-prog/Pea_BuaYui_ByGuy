// src/App.tsx
import { useState } from 'react';
import { loadBranchData } from './services/sheetsService';
import { BranchName } from './constants/sheets';

function App() {
  const [selectedBranch, setSelectedBranch] = useState<BranchName>('กฟส.บัวใหญ่');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: 'สวัสดีครับ ผมพี่เอก ช่างไฟฟ้าประจำพื้นที่ครับ\nมีอะไรเกี่ยวกับงานไฟฟ้า การอ่านข้อมูล แจ้งซ่อม หรือปัญหาไฟฟ้า ถามได้เลยครับ ผมช่วยได้' 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const branches: BranchName[] = ['กฟส.บัวใหญ่', 'กฟส.ประทาย', 'กฟส.บัวลาย', 'กฟส.บ้านเหลื่อม', 'กฟส.คง', 'กฟส.โนนแดง'];

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const result = await loadBranchData(selectedBranch);
      setData(result);
      alert(`โหลดข้อมูล \( {selectedBranch} สำเร็จ ( \){result.length} แถว)`);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setChatLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("ไม่พบ GEMINI_API_KEY");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `คุณคือ "พี่เอก" ช่างไฟฟ้ามืออาชีพ อายุ 35 ปี ทำงานกับการไฟฟ้าส่วนภูมิภาคมานาน 
                พูดตรง ๆ ชัดเจน เป็นกันเอง ใช้ภาษางานไฟฟ้าได้ดี มีประสบการณ์เรื่องสายไฟ หม้อแปลง เครื่องจักรกลไฟฟ้า การอ่านข้อมูลจากระบบ
                ตอบให้เป็นประโยชน์ เน้นความปลอดภัยในการทำงานไฟฟ้า
                
                ผู้ใช้: ${userMsg}
                ตอบในฐานะช่างไฟฟ้าที่ช่วยงานจริง ๆ`
              }]
            }]
          })
        }
      );

      const result = await response.json();
      const aiReply = result.candidates?.[0]?.content?.parts?.[0]?.text 
        || "ครับ ผมเข้าใจแล้ว แต่ลองอธิบายเพิ่มเติมหน่อยได้ไหมครับ";

      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'ขออภัยครับ ตอนนี้เชื่อมต่อระบบไม่ได้ กรุณาตรวจสอบ GEMINI_API_KEY หรือลองใหม่อีกครั้ง' 
      }]);
    }
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-orange-500 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-3xl">⚡</div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Pea BuaYui By Guy</h1>
              <p className="text-slate-400">ระบบช่วยงานการไฟฟ้า • พี่เอก ช่างไฟฟ้า</p>
            </div>
          </div>
          <div className="text-orange-400 font-medium">ช่างไฟฟ้า • มืออาชีพ</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar เลือกสาขา */}
        <div className="lg:w-80 bg-zinc-900/90 backdrop-blur rounded-2xl p-6 border border-orange-500/30 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-orange-400 flex items-center gap-2">
            ⚡ เลือกสาขา
          </h2>
          
          <div className="space-y-2 mb-6">
            {branches.map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`w-full text-left px-5 py-3.5 rounded-xl transition-all ${selectedBranch === branch 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-slate-300'}`}
              >
                {branch}
              </button>
            ))}
          </div>

          <button
            onClick={handleLoadData}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 py-4 rounded-2xl font-semibold text-lg disabled:opacity-70 transition"
          >
            {loading ? 'กำลังโหลดข้อมูล...' : `โหลดข้อมูล ${selectedBranch}`}
          </button>
        </div>

        {/* Main Area */}
        <div className="flex-1 space-y-8">
          {/* Data Table */}
          <div className="bg-zinc-900/90 backdrop-blur rounded-3xl p-6 border border-orange-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400">
              📋 ข้อมูล {selectedBranch}
            </h2>
            {data.length > 0 ? (
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-zinc-800">
                    <tr>
                      {data[0]?.map((_: any, i: number) => (
                        <th key={i} className="px-4 py-3 text-left">คอลัมน์ {i+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {data.slice(0, 80).map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800">
                        {row.map((cell: any, i: number) => (
                          <td key={i} className="px-4 py-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                ยังไม่มีข้อมูล<br />เลือกสาขาแล้วกดโหลดข้อมูลได้เลยครับ ⚡
              </div>
            )}
          </div>

          {/* Chat with ช่างเอก */}
          <div className="bg-zinc-900/90 backdrop-blur rounded-3xl p-6 border border-orange-500/30 flex flex-col h-[620px]">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 flex items-center gap-2">
              ⚡ คุยกับพี่เอก (ช่างไฟฟ้า)
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl ${msg.role === 'user' 
                    ? 'bg-orange-600 rounded-br-none' 
                    : 'bg-zinc-800 rounded-bl-none border border-orange-400/30'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="text-orange-400">พี่เอกกำลังคิดคำตอบ...</div>}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="ถามเรื่องงานไฟฟ้า การอ่านข้อมูล หรือปัญหาที่เจอ..."
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-orange-500 rounded-2xl px-6 py-4 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !input.trim()}
                className="bg-orange-600 hover:bg-orange-500 px-10 rounded-2xl font-medium disabled:opacity-60"
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;