// src/services/sheetsService.ts
import { DATA_SOURCES, BranchName, DataSheet } from '../constants/sheets';

export const fetchGoogleSheet = async (sheet: DataSheet): Promise<any[]> => {
  const url = `https://docs.google.com/spreadsheets/d/\( {sheet.id}/gviz/tq?gid= \){sheet.gid}&tqx=out:json`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // แปลง response จาก Google Visualization เป็น JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.substring(jsonStart, jsonEnd);

    const data = JSON.parse(jsonStr);

    if (!data.table?.rows) {
      return [];
    }

    // แปลงเป็น array ของ array (แต่ละ row เป็น array ของค่า)
    return data.table.rows.map((row: any) => {
      if (!row.c) return [];
      return row.c.map((cell: any) => {
        if (cell == null) return '';
        // จัดการค่าต่าง ๆ (string, number, boolean, date)
        return cell.v !== undefined ? cell.v : '';
      });
    });

  } catch (error) {
    console.error(`Error fetching sheet ID: ${sheet.id}, GID: ${sheet.gid}`, error);
    return [];
  }
};

/**
 * โหลดข้อมูลทั้งหมดของสาขาที่เลือก
 */
export const loadBranchData = async (branch: BranchName): Promise<any[]> => {
  const sheets = DATA_SOURCES[branch] || [];
  let allData: any[] = [];

  console.log(`กำลังโหลดข้อมูลสาขา: \( {branch} ( \){sheets.length} แผ่น)`);

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const sheetData = await fetchGoogleSheet(sheet);

    if (sheetData.length > 0) {
      // ถ้าแถวแรกเป็น header และมีข้อมูลมากกว่า 1 แถว ให้ข้าม header
      if (sheetData.length > 1) {
        allData = [...allData, ...sheetData.slice(1)];
      } else {
        allData = [...allData, ...sheetData];
      }
    }
  }

  console.log(`โหลดข้อมูล ${branch} เสร็จสิ้น: ${allData.length} แถว`);
  return allData;
};

/**
 * โหลดข้อมูลทุกสาขาพร้อมกัน (ถ้าต้องการใช้ในอนาคต)
 */
export const loadAllBranchesData = async (): Promise<Record<BranchName, any[]>> => {
  const result: Record<BranchName, any[]> = {} as Record<BranchName, any[]>;
  
  const branches: BranchName[] = ['กฟส.บัวใหญ่', 'กฟส.ประทาย', 'กฟส.บัวลาย', 'กฟส.บ้านเหลื่อม', 'กฟส.คง', 'กฟส.โนนแดง'];

  for (const branch of branches) {
    result[branch] = await loadBranchData(branch);
  }

  return result;
};