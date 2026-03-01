/**
 * CSV 匯出工具函數
 * 提供班表數據的 CSV 格式導出功能
 */

import { AppData, Department, Staff, Status } from "@/types/schedule";
import { getMonthKey } from "./dateUtils";

/**
 * 生成 CSV 內容
 * @param dept 部門信息
 * @param staff 該月份的人員列表
 * @param year 年份
 * @param month 月份（0-11）
 * @param daysInMonth 該月份的天數
 * @param data 應用數據
 * @returns CSV 內容字符串
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
 * @param csv CSV 內容
 * @param filename 文件名
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
 * @param dept 部門信息
 * @param staff 該月份的人員列表
 * @param year 年份
 * @param month 月份（0-11）
 * @param daysInMonth 該月份的天數
 * @param data 應用數據
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
  const filename = `班表_${dept ? dept.name : ""}\_${year}年${month + 1}月.csv`;
  downloadCSV(csv, filename);
}
