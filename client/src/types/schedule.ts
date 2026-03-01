/**
 * 班表系統的 TypeScript 類型定義
 * 提供全應用的類型安全和自動完成支持
 */

/**
 * 部門信息
 */
export interface Department {
  id: string;
  name: string;
  phone?: string;
}

/**
 * 工作人員信息
 */
export interface Staff {
  id: string;
  deptId: string;
  position?: string;
  name: string;
  phone?: string;
}

/**
 * 班表狀態（如：病、休、事、代）
 */
export interface Status {
  id: string;
  name: string;
  color: string;
}

/**
 * 節日信息
 */
export interface Holiday {
  id: string;
  date: string; // 格式：YYYY/M/D
  name: string;
}

/**
 * 單個班表單元格的數據
 */
export interface ScheduleCell {
  statusId: string;
}

/**
 * 班表數據存儲結構
 * Key: "${monthKey}-${staffId}-${day}"
 * Value: ScheduleCell
 */
export type ScheduleData = Record<string, ScheduleCell>;

/**
 * 月度人員選擇
 * Key: monthKey (例如："2025-1")
 * Value: 該月份被選中的人員 ID 列表
 */
export type MonthlyStaff = Record<string, string[]>;

/**
 * 應用全局數據狀態
 */
export interface AppData {
  departments: Department[];
  staff: Staff[];
  statuses: Status[];
  holidays: Holiday[];
  saturdayColor: string;
  sundayColor: string;
  holidayColor: string;
  monthlyStaff: MonthlyStaff;
  scheduleData: ScheduleData;
}

/**
 * 班表上下文的值類型
 */
export interface ScheduleContextType {
  data: AppData;
  currentDeptId: string | null;
  setCurrentDeptId: (deptId: string | null) => void;
  currentYear: number;
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;

  // Department operations
  addDepartment: (name: string, phone?: string) => void;
  deleteDepartment: (id: string) => void;

  // Staff operations
  addStaff: (
    deptId: string,
    name: string,
    position?: string,
    phone?: string
  ) => void;
  deleteStaff: (id: string) => void;
  updateStaff: (
    id: string,
    updates: Partial<Omit<Staff, "id" | "deptId">>
  ) => void;

  // Status operations
  addStatus: (name: string, color: string) => void;
  deleteStatus: (id: string) => void;
  updateStatusColor: (id: string, color: string) => void;

  // Holiday operations
  addHolidays: (holidays: Array<{ date: string; name: string }>) => void;
  deleteHoliday: (id: string) => void;

  // Import operations
  importStaffList: (staff: Staff[]) => void;
  importHolidaysList: (holidays: Holiday[]) => void;
  importStatusesList: (statuses: Status[]) => void;
  importDepartmentsList: (departments: Department[]) => void;

  // Schedule operations
  setScheduleStatus: (
    staffId: string,
    day: number,
    statusId: string | null
  ) => void;
  getScheduleStatus: (staffId: string, day: number) => string | null;

  // Monthly staff operations
  setMonthlyStaff: (staffIds: string[]) => void;
  getMonthlyStaff: () => string[];

  // Color operations
  setSaturdayColor: (color: string) => void;
  setSundayColor: (color: string) => void;
  setHolidayColor: (color: string) => void;

  // Utility operations
  getMonthKey: () => string;
  getDaysInMonth: () => number;
  getMonthlyStaffForDept: () => Staff[];
}

/**
 * 月份導航狀態
 */
export interface MonthNavigationState {
  year: number;
  month: number;
  monthKey: string;
  daysInMonth: number;
}

/**
 * 班表單元格信息（用於點擊事件）
 */
export interface SelectedCellInfo {
  staffId: string;
  day: number;
}
