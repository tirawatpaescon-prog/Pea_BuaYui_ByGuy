
export type BranchName = 
  | 'กฟส.คง' 
  | 'กฟส.บัวลาย' 
  | 'กฟส.บ้านเหลื่อม' 
  | 'กฟส.ประทาย' 
  | 'กฟส.บัวใหญ่' 
  | 'กฟส.โนนแดง';

export type SearchType = 'all' | 'name' | 'ca' | 'meter';

export interface ElectricityUser {
  id: string;
  branch: string;
  caNumber: string;
  peaMeter: string;
  amperhour: string;
  phase: string;
  firstName: string;
  lastName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  outstandingBalance?: number;
}

export interface SearchState {
  isLoggedIn: boolean;
  currentUser: string | null;
  selectedBranch: BranchName | null;
  query: string;
  searchType: SearchType;
  isSearching: boolean;
  results: ElectricityUser[];
  error: string | null;
  totalRecords: number;
  routeQueue: ElectricityUser[];
  optimizedRoute: string[] | null;
  viewMode: 'search' | 'map';
  activeMapUser: ElectricityUser | null;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
