
import { ElectricityUser } from '../types';

export const MOCK_USERS: ElectricityUser[] = [
  {
    id: '1',
    branch: 'กฟส.คง',
    firstName: 'สมชาย',
    lastName: 'สายฟ้า',
    caNumber: '0200123456',
    peaMeter: 'PEA-889900',
    amperhour: '5(15)A',
    phase: '1',
    address: '123/45 หมู่ 1 ต.ในเมือง อ.เมือง 30260',
    latitude: 15.3456,
    longitude: 102.3456,
    status: 'Active'
  },
  {
    id: '2',
    branch: 'กฟส.ประทาย',
    firstName: 'วิภา',
    lastName: 'ส่องแสง',
    caNumber: '0200987654',
    peaMeter: 'PEA-112233',
    amperhour: '15(45)A',
    phase: '1',
    address: '99 ถ.สุขุมวิท 30180',
    latitude: 15.4567,
    longitude: 102.5678,
    status: 'Active'
  }
];
