/**
 * CSV 匯出與匯入工具函數
 * 提供班表數據及設定資料的 CSV 格式導出與導入功能
 */

import { AppData, Department, Staff, Status, Holiday } from "@/types/schedule";
import { getMonthKey } from "./dateUtils";
import { generateId } from "./storageUtils";

/**
 * 生成班表 CSV 內容
 */
export function generateCSV(
  dept: Department | undefined,
  staff: Staff[],
  year: number,
  month: number,
  daysInMonth: number,
  data: AppData
): string {
  let csv = "\uFEFF"; // BOM for Excel

  // 部門信息
  csv += `${dept ? dept.name : ""},${dept ? dept.phone || "" : ""}\n`;
  csv += `${year}年${month + 1}月\n\n`;

  // 表頭
  csv += "姓名";
  for (let d = 1; d <= daysInMonth; d++) {
    csv += `,${d}`;
  }
  csv += "\n";

  // 數據行
  const monthKey = getMonthKey(year, month);
  staff.forEach((s) => {
    csv += s.name;
    for (let d = 1; d <= daysInMonth; d++) {
      const cellKey = `${monthKey}-${s.id}-${d}`;
      const cellData = data.scheduleData[cellKey];
      if (cellData) {
        const status = data.statuses.find((st) => st.id === cellData.statusId);
        csv += `,${status ? status.name : ""}`;
      } else {
        csv += ",";
      }
    }
    csv += "\n";
  });

  return csv;
}

/**
 * 下載 CSV 文件
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 導出班表為 CSV
 */
export function exportScheduleAsCSV(
  dept: Department | undefined,
  staff: Staff[],
  year: number,
  month: number,
  daysInMonth: number,
  data: AppData
): void {
  const csv = generateCSV(dept, staff, year, month, daysInMonth, data);
  const filename = `班表_${dept ? dept.name : ""}_${year}年${month + 1}月.csv`;
  downloadCSV(csv, filename);
}

// --- 設定資料導出 ---

/**
 * 導出人員名單為 CSV
 */
export function exportStaffCSV(staff: Staff[], departments: Department[]): void {
  let csv = "\uFEFF姓名,職位,電話,部門\n";
  staff.forEach((s) => {
    const dept = departments.find((d) => d.id === s.deptId);
    csv += `"${s.name}","${s.position || ""}","${s.phone || ""}","${dept ? dept.name : ""}"\n`;
  });
  downloadCSV(csv, "人員名單.csv");
}

/**
 * 導出特別假期為 CSV
 */
export function exportHolidaysCSV(holidays: Holiday[]): void {
  let csv = "\uFEFF日期,名稱\n";
  holidays.forEach((h) => {
    csv += `"${h.date}","${h.name}"\n`;
  });
  downloadCSV(csv, "特別假期.csv");
}

/**
 * 導出選項設定（狀態）為 CSV
 */
export function exportStatusesCSV(statuses: Status[]): void {
  let csv = "\uFEFF名稱,顏色\n";
  statuses.forEach((s) => {
    csv += `"${s.name}","${s.color}"\n`;
  });
  downloadCSV(csv, "選項設定.csv");
}

/**
 * 導出部門設定為 CSV
 */
export function exportDepartmentsCSV(departments: Department[]): void {
  let csv = "\uFEFF名稱,電話\n";
  departments.forEach((d) => {
    csv += `"${d.name}","${d.phone || ""}"\n`;
  });
  downloadCSV(csv, "部門設定.csv");
}

// --- 設定資料導入 ---

/**
 * 解析 CSV 字符串
 */
function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  return lines
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches) return line.split(",").map((s) => s.replace(/^"|"$/g, ""));
      return matches.map((s) => s.replace(/^"|"$/g, ""));
    });
}

/**
 * 讀取上傳的文件
 */
export function readCSVFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(parseCSV(text));
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * 導入人員名單
 */
export function importStaff(
  rows: string[][],
  departments: Department[]
): Staff[] {
  // 跳過表頭
  const dataRows = rows.slice(1);
  return dataRows.map((row) => {
    const [name, position, phone, deptName] = row;
    const dept = departments.find((d) => d.name === deptName);
    return {
      id: generateId(),
      name: name || "未知",
      position: position || "",
      phone: phone || "",
      deptId: dept ? dept.id : (departments[0]?.id || ""),
    };
  });
}

/**
 * 導入特別假期
 */
export function importHolidays(rows: string[][]): Holiday[] {
  const dataRows = rows.slice(1);
  return dataRows.map((row) => {
    const [date, name] = row;
    return {
      id: generateId(),
      date: date || "",
      name: name || "",
    };
  });
}

/**
 * 導入選項設定
 */
export function importStatuses(rows: string[][]): Status[] {
  const dataRows = rows.slice(1);
  return dataRows.map((row) => {
    const [name, color] = row;
    return {
      id: generateId(),
      name: name || "未知",
      color: color || "#000000",
    };
  });
}

/**
 * 導入部門設定
 */
export function importDepartments(rows: string[][]): Department[] {
  const dataRows = rows.slice(1);
  return dataRows.map((row) => {
    const [name, phone] = row;
    return {
      id: generateId(),
      name: name || "未知",
      phone: phone || "",
    };
  });
}
