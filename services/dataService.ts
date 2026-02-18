
import { ElectricityUser, BranchName, SearchType } from '../types';
import { MOCK_USERS } from './mockData';

interface DataSheet {
  id: string;
  gid: string;
}

const MASTER_ID_กฟส_คง = '2PACX-1vQmUSr4g7osAgTaOtbCPso4-l1UR-RFtMzrT4Ua3epUW5ijEuIabvPilg49x-wlVg';
const MASTER_ID_กฟส_บัวลาย = [
  '2PACX-1vQ0nilYnM8skEKzSTiDBzUgaKesf1GN6arGnUye6WbMP6PN7hGJdhV7RT2k1TcXUg',
  '2PACX-1vTdXRwqCtW3m4ZMa_bQtoB-upL6Ke7QPtLC5hujtnRqtu7bDLZcuqeSfj9yrYrLhw',
  '2PACX-1vRIzC0sgvSRCsgbS6Bpbo_Ot4zRzIZzcBBUIIj7tEOzD1sEwqFc7ViJeCqht0QFhA',
  '2PACX-1vSCknCDxCLwghF-95-JokfR6z7tHTa9ERLm-vIM-SgFiYTWUKOlm_FIvLe5HqW8Lw'
];
const MASTER_ID_กฟส_บ้านเหลื่อม = [
  '2PACX-1vRG1FsnvTFwnw13BeP2_y8v74sPYYu6RD_Hiz_kcd1IqhkpwvJR3XDyPSKpNbX-uQ',
  '2PACX-1vRka0tNgE0l7c88dJRgHF7P6XI493QGMtivZ4VhnBh2qGhh_6ThoHwS1rZ_RI4UjA',
  '2PACX-1vQmdSOkDajGsZaMvEq1DNbW-315LcUIOM8b1mYlG2ixHKhAcnX22IVJ-c1V4ZEJQA',
  '2PACX-1vSXak3JwcZ2V5TAN8YTMcyYdx_UC0AbOBi2kCNx2dXezfwaRnFRP0sxX4Dut-XoiQ'
];
const MASTER_ID_กฟส_ประทาย = [
  '2PACX-1vTy9AI9THeHhfN6QM4-H3W1eotZKWueZKou3SG9bcl7zpw-RWpPUvAtG4bK3Cm2PA',
  '2PACX-1vT7E9p5zg7PFIPJtCTxcyOVuaGti7Yk1JDPs7nhAc9r-OkxgeG8E_QwM7BBYOZchw',
  '2PACX-1vRZpmhUHaxQ-s1xhRNhMZOeJp9e6WLiXYmks3PXOztMvlR0R4dIHkxFBsAu12Q2Wg',
  '2PACX-1vRbv0anVlKdjPHb-3cKejiymoNE1v1ZxdH4QsdhsL_FO1SDY94d-qCoqmxXEeAOXA',
  '2PACX-1vS9lsgUgkLqRSYmj54RxP2skJvUEV4LSntNb77uAwpOaAe-cNTzqSn2tXGjyMw30g',
  '2PACX-1vS12BFg1JdUrz1GzpOo6gj46dMiVVDdFe0BFfyJayRwEB50Bnw-TKDDpfHMd91eUw',
  '2PACX-1vSySRN-3bunSkBPG5wnokJojcoqjidL6M81OL32a9Hthg_dNTx4shx_H1UNDARuJg',
  '2PACX-1vQW9tBXda-MIYZBBkOL0UTKkccoVtejFM4vZJiQJc4KWi3vGffDA-T9JxA6gAluKw',
  '2PACX-1vSAEUNuLz7egImADPE8ceLd1V-sOhyENd-ZuBUNzvEl_CeEFNiUQR7XWx85RLdvpA',
  '2PACX-1vTEGYWIdVj5qF1gblH0a9uu68qjj__dxfzoQ6twMppWuVVlz19fjXrswBO-s7LK7Q',
  '2PACX-1vRK6Wkf6Ji5YsUmUiAQms9hDvCUzC9jcWdOL1QcPstz4Q8cP6rhsjmWIV7LmkAAeA',
  '2PACX-1vS0yq-K1GHyME70Gcz4KHQfFaf-TF-C39W2Ljes59wMBEKS45Th_PdKEAu4_WFLag'
];
const MASTER_ID_กฟส_บัวใหญ่ = [
  '2PACX-1vSz1bTQAU4Id5jeLff6iQcQoaajd24kD7v-fHS1iaZFmEpIny644oANqGR_vMasvQ',
  '2PACX-1vQl_4xgQ7ac1f8Il-BVEm0FGtPXO-4R_xyIh0SA_DkzguFcXy2gkd3NRA8XY8dVlg',
  '2PACX-1vRWKN19LcKHl3PN6rt5e_rFweHLobKgpLTUAIwbJZyCFIWPdI1r-BnalMadRh7keQ',
  '2PACX-1vQrEH_jh22aTcpeqyP6xtisWiypzA3VIBVAiJvM81MpQ31p5DlLBGNA5A6UujLccA',
  '2PACX-1vTJkC4Mh8PyW6Ch_sZf0uY7TyQYePJXqGCxaX_Ww4dTrIxcwaLUSRpgGOSQoi8c_A',
  '2PACX-1vTkoxQ9FsUxq8tABEjUkLSt4WRvLERWRCNE7XR1Mtyb_amL-o9tiLxamn1CF_VpcQ',
  '2PACX-1vQnKZYHDmgyxStgQ4yWvZKZayyfKH_uT4m5gzeuHAEtsdp__KOrkNjzlwDbfep4hA',
  '2PACX-1vQZht7zBuR8deZs8XxCPhem5yMn8qUPZvNpA0rKtblByjvsFyAN30LWb0AA7My_kQ',
  '2PACX-1vSnxVJqiyuJJvHt_WLOsl8kNsPZ9m74Ju3AQ2HdjeJ8DQILxcZt6KL11o_T0-RFKw',
  '2PACX-1vSYUgZ7B71KX6MKc8gkgLEIB4Y3wbmij83VUuM7gxE891qk8o6Jwt215peZjAV-cw'
];

const MASTER_ID_กฟส_โนนแดง = [
  '2PACX-1vTpWox1FSvre_CeP3kWXloo6eO2B7d_n4pyT8r7wa-BYkA8B-7CryKI6s9elIcofg',
  '2PACX-1vR3quYH0z8fW-3asR2VnieU2fa2oPuOfMBCgEHVZFe2GkvNfaX123Qf4V-vS0VVwg',
  '2PACX-1vSUN--oQueDbCAPuXkp2PhD9zMeTWcPruOoRaeYZ6rd3RQU4jSXe5KkEVTxOERYAQ',
  '2PACX-1vSxHNn3Ofutzd6eIaXYCWoscTSBdsfbD8TQQPtoOeforFoH0abnXufJc4N0Po88NQ',
  '2PACX-1vQErI86zmH_LrK6TG2ore5WOCZmL67s7-NQYb5VAmg5haj9ou1MAbK1Kp_CsnYJPg'
];

const DATA_SOURCES: Record<BranchName, DataSheet[]> = {
  'กฟส.บัวใหญ่': [
    { id: MASTER_ID_กฟส_บัวใหญ่[0], gid: '2118576286' },
    { id: MASTER_ID_กฟส_บัวใหญ่[1], gid: '900446192' },
    { id: MASTER_ID_กฟส_บัวใหญ่[2], gid: '864379877' },
    { id: MASTER_ID_กฟส_บัวใหญ่[3], gid: '1126714009' },
    { id: MASTER_ID_กฟส_บัวใหญ่[4], gid: '569094589' },
    { id: MASTER_ID_กฟส_บัวใหญ่[5], gid: '1484961957' },
    { id: MASTER_ID_กฟส_บัวใหญ่[6], gid: '118160825' },
    { id: MASTER_ID_กฟส_บัวใหญ่[7], gid: '1040186103' },
    { id: MASTER_ID_กฟส_บัวใหญ่[8], gid: '1652679163' },
    { id: MASTER_ID_กฟส_บัวใหญ่[9], gid: '474069767' }
  ],
  'กฟส.ประทาย': [
    { id: MASTER_ID_กฟส_ประทาย[0], gid: '283854068' },
    { id: MASTER_ID_กฟส_ประทาย[1], gid: '979188452' },
    { id: MASTER_ID_กฟส_ประทาย[2], gid: '1108140570' },
    { id: MASTER_ID_กฟส_ประทาย[3], gid: '1686081816' },
    { id: MASTER_ID_กฟส_ประทาย[4], gid: '2035140553' },
    { id: MASTER_ID_กฟส_ประทาย[5], gid: '1986278156' },
    { id: MASTER_ID_กฟส_ประทาย[6], gid: '1775354496' },
    { id: MASTER_ID_กฟส_ประทาย[7], gid: '772284759' },
    { id: MASTER_ID_กฟส_ประทาย[8], gid: '709948515' },
    { id: MASTER_ID_กฟส_ประทาย[9], gid: '982258505' },
    { id: MASTER_ID_กฟส_ประทาย[10], gid: '1847240937' },
    { id: MASTER_ID_กฟส_ประทาย[11], gid: '642331848' }
  ],
  'กฟส.บัวลาย': [
    { id: MASTER_ID_กฟส_บัวลาย[0], gid: '2027467279' },
    { id: MASTER_ID_กฟส_บัวลาย[1], gid: '1138128176' },
    { id: MASTER_ID_กฟส_บัวลาย[2], gid: '1193294237' },
    { id: MASTER_ID_กฟส_บัวลาย[3], gid: '147554951' },
  ],
  'กฟส.บ้านเหลื่อม': [
    { id: MASTER_ID_กฟส_บ้านเหลื่อม[0], gid: '1765642745' },
    { id: MASTER_ID_กฟส_บ้านเหลื่อม[1], gid: '1254065892' },
    { id: MASTER_ID_กฟส_บ้านเหลื่อม[2], gid: '756578577' },
    { id: MASTER_ID_กฟส_บ้านเหลื่อม[3], gid: '482805253' }
  ],
  'กฟส.คง': [
    { id: MASTER_ID_กฟส_คง, gid: '1369075692' },
    { id: MASTER_ID_กฟส_คง, gid: '1068360310' },
    { id: MASTER_ID_กฟส_คง, gid: '1732634518' },
    { id: MASTER_ID_กฟส_คง, gid: '1163686574' },
    { id: MASTER_ID_กฟส_คง, gid: '2091672130' },
    { id: MASTER_ID_กฟส_คง, gid: '1372990930' },
    { id: MASTER_ID_กฟส_คง, gid: '1402874618' },
    { id: MASTER_ID_กฟส_คง, gid: '883503346' },
    { id: MASTER_ID_กฟส_คง, gid: '1192435712' },
    { id: MASTER_ID_กฟส_คง, gid: '394969253' }
  ],
  'กฟส.โนนแดง': [
    { id: MASTER_ID_กฟส_โนนแดง[0], gid: '580555727' },
    { id: MASTER_ID_กฟส_โนนแดง[1], gid: '79679604' },
    { id: MASTER_ID_กฟส_โนนแดง[2], gid: '1773009161' },
    { id: MASTER_ID_กฟส_โนนแดง[3], gid: '1361739263' },
    { id: MASTER_ID_กฟส_โนนแดง[4], gid: '1646704388' }
  ]
};

let cachedData: Record<string, ElectricityUser[]> = {};

const normalize = (str: string) => (str || '').toString().replace(/[\s\u0E30-\u0E4E]/g, '').toLowerCase();
const clean = (val: string) => (val || '').trim().replace(/^["']|["']$/g, '');

const splitRow = (line: string, delimiter: string) => {
  const result = [];
  let start = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === delimiter && !inQuotes) {
      result.push(line.substring(start, i));
      start = i + 1;
    }
  }
  result.push(line.substring(start));
  return result.map(clean);
};

const parseCSV = (csvText: string, branchName: string): ElectricityUser[] => {
  const sanitizedText = csvText.replace(/^\uFEFF/, '');
  const lines = sanitizedText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  
  return lines.slice(1).map((line) => {
    const v = splitRow(line, delimiter);
    if (v.length < 5) return null;

    let lat = 0, lng = 0;
    const locStr = v[9] || '';
    if (locStr) {
      const coordParts = locStr.split(/[,\s/]+/).map(p => p.trim()).filter(p => p !== '');
      if (coordParts.length >= 2) {
        lat = parseFloat(coordParts[0]);
        lng = parseFloat(coordParts[1]);
      }
    }

    return {
      id: `${branchName}-${v[0]}-${Math.random().toString(36).substr(2, 5)}`,
      branch: branchName,
      caNumber: v[0] || '-',       
      peaMeter: v[1] || '-',       
      amperhour: v[2] || '-',      
      phase: v[3] || '-',          
      firstName: v[4] || 'ไม่ทราบชื่อ', 
      lastName: '',                
      address: v[8] || 'ไม่มีข้อมูลที่อยู่', 
      latitude: isNaN(lat) ? 0 : lat,
      longitude: isNaN(lng) ? 0 : lng,
      status: 'Active',
      outstandingBalance: 0
    } as ElectricityUser;
  }).filter((u): u is ElectricityUser => u !== null);
};

export const preloadBranchData = async (branch: BranchName): Promise<number> => {
  if (cachedData[branch]) return cachedData[branch].length;

  const sources = DATA_SOURCES[branch] || [];
  try {
    const results = await Promise.all(sources.map(async (src) => {
      const url = `https://docs.google.com/spreadsheets/d/e/${src.id}/pub?gid=${src.gid}&output=csv&t=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      return parseCSV(text, branch);
    }));
    
    const allUsers = results.flat();
    if (allUsers.length === 0) throw new Error("No data parsed");
    
    cachedData[branch] = allUsers;
    return allUsers.length;
  } catch (error) {
    console.warn(`Could not load live data for ${branch}, using mock data instead.`, error);
    const fallback = MOCK_USERS.map(u => ({...u, branch}));
    cachedData[branch] = fallback;
    return fallback.length;
  }
};

export const searchUserInBranch = async (
  branch: BranchName, 
  query: string, 
  type: SearchType = 'all'
): Promise<{ users: ElectricityUser[] }> => {
  if (!cachedData[branch]) {
    try {
      await preloadBranchData(branch);
    } catch(e) {}
  }
  
  const users = cachedData[branch] || [];
  const q = normalize(query);

  const filtered = users.filter(u => {
    switch (type) {
      case 'name':
        return normalize(u.firstName).includes(q);
      case 'ca':
        return normalize(u.caNumber).includes(q);
      case 'meter':
        return normalize(u.peaMeter).includes(q);
      default: {
        const isNumeric = /^\d+$/.test(query.trim());
        if (isNumeric) {
          return normalize(u.caNumber).includes(q) || normalize(u.peaMeter).includes(q);
        }
        return normalize(u.firstName).includes(q);
      }
    }
  });

  return { users: filtered.slice(0, 15) };
};
