/**
 * XLSX 匯出工具函數
 * 提供班表數據及設定資料的 XLSX 格式導出功能（支援顏色）
 */
import * as XLSX from "xlsx";
import { AppData, Department, Staff, Status, Holiday } from "@/types/schedule";
import { getMonthKey } from "./dateUtils";

/**
 * 將 hex 顏色轉換為 XLSX 的 RGB 格式
 */
function hexToRGB(hex: string): string {
  // 移除 # 符號
  hex = hex.replace("#", "");
  
  // 解析 RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r},${g},${b}`;
}

/**
 * 創建帶顏色的单元格样式
 */
function createColoredCell(value: string, color: string, isHeader: boolean = false): object {
  const rgb = hexToRGB(color);
  
  return {
    v: value,
    s: {
      fill: {
        patternType: "solid",
        fgColor: { rgb: rgb }
      },
      font: {
        color: isHeader ? { rgb: "FFFFFF" } : { rgb: "000000" },
        bold: isHeader,
        name: "Microsoft JhengHei"
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    }
  };
}

/**
 * 創建普通单元格
 */
function createCell(value: string, isHeader: boolean = false): object {
  return {
    v: value,
    s: {
      font: {
        bold: isHeader,
        name: "Microsoft JhengHei"
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    }
  };
}

/**
 * 導出排班表為 XLSX（帶顏色）
 */
export function exportScheduleAsXLSX(
  dept: Department | undefined,
  staff: Staff[],
  year: number,
  month: number,
  daysInMonth: number,
  data: AppData
): void {
  const worksheet: any[] = [];

  // 標題行
  const titleRow = [];
  titleRow.push({ v: dept ? dept.name : "", s: { font: { bold: true, size: 14, name: "Microsoft JhengHei" }, alignment: { horizontal: "left" } } });
  titleRow.push({ v: `${year}年${month + 1}月`, s: { font: { bold: true, size: 14, name: "Microsoft JhengHei" }, alignment: { horizontal: "right" } } });
  worksheet.push(titleRow);
  worksheet.push([]); // 空行

  // 表頭
  const headerRow = [];
  headerRow.push(createCell("姓名", true));
  for (let d = 1; d <= daysInMonth; d++) {
    headerRow.push(createCell(String(d), true));
  }
  worksheet.push(headerRow);

  // 獲取月份的key
  const monthKey = getMonthKey(year, month);

  // 數據行
  staff.forEach((s) => {
    const row = [];
    row.push(createCell(s.name));
    
    for (let d = 1; d <= daysInMonth; d++) {
      const cellKey = `${monthKey}-${s.id}-${d}`;
      const cellData = data.scheduleData[cellKey];
      
      if (cellData) {
        const status = data.statuses.find((st) => st.id === cellData.statusId);
        if (status) {
          // 檢查是否為假日
          const isHoliday = data.holidays.some(h => {
            const holidayDate = h.date.replace(/\//g, "-");
            return holidayDate === `${year}-${month + 1}-${d}`;
          });
          
          // 獲取顏色
          let cellColor = status.color;
          if (isHoliday) {
            cellColor = data.holidayColor;
          } else if (new Date(year, month, d).getDay() === 0) { // 週日
            cellColor = data.sundayColor;
          } else if (new Date(year, month, d).getDay() === 6) { // 週六
            cellColor = data.saturdayColor;
          }
          
          row.push(createColoredCell(status.name, cellColor));
        } else {
          row.push(createCell(""));
        }
      } else {
        row.push(createCell(""));
      }
    }
    worksheet.push(row);
  });

  // 創建工作簿
  const workbook = XLSX.utils.book_new();
  const worksheetData = XLSX.utils.aoa_to_sheet(worksheet);

  // 設置列寬
  const colWidths = [{ wch: 10 }]; // 姓名列寬
  for (let d = 1; d <= daysInMonth; d++) {
    colWidths.push({ wch: 4 }); // 日期列寬
  }
  worksheetData["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheetData, "排班表");

  // 生成下載
  const filename = `班表_${dept ? dept.name : ""}_${year}年${month + 1}月.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * 導出設定資料為 XLSX
 */
export function exportSettingsAsXLSX(
  data: AppData
): void {
  const workbook = XLSX.utils.book_new();

  // ===== 部門資料 =====
  const deptSheet: any[] = [];
  deptSheet.push([createCell("部門名稱", true), createCell("電話", true)]);
  data.departments.forEach((dept) => {
    deptSheet.push([dept.name, dept.phone || ""]);
  });
  const deptWorksheet = XLSX.utils.aoa_to_sheet(deptSheet);
  deptWorksheet["!cols"] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, deptWorksheet, "部門資料");

  // ===== 人員資料 =====
  const staffSheet: any[] = [];
  staffSheet.push([createCell("姓名", true), createCell("職位", true), createCell("電話", true), createCell("部門", true)]);
  data.staff.forEach((s) => {
    const dept = data.departments.find((d) => d.id === s.deptId);
    staffSheet.push([s.name, s.position || "", s.phone || "", dept ? dept.name : ""]);
  });
  const staffWorksheet = XLSX.utils.aoa_to_sheet(staffSheet);
  staffWorksheet["!cols"] = [{ wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, staffWorksheet, "人員資料");

  // ===== 特殊假日 =====
  const holidaySheet: any[] = [];
  holidaySheet.push([createCell("日期", true), createCell("名稱", true)]);
  data.holidays.forEach((h) => {
    holidaySheet.push([h.date, h.name]);
  });
  const holidayWorksheet = XLSX.utils.aoa_to_sheet(holidaySheet);
  holidayWorksheet["!cols"] = [{ wch: 12 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, holidayWorksheet, "特殊假日");

  // ===== 狀態選項 =====
  const statusSheet: any[] = [];
  statusSheet.push([createCell("名稱", true), createCell("顏色", true)]);
  data.statuses.forEach((s) => {
    statusSheet.push([s.name, s.color]);
  });
  const statusWorksheet = XLSX.utils.aoa_to_sheet(statusSheet);
  statusWorksheet["!cols"] = [{ wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, statusWorksheet, "狀態選項");

  // ===== 顏色設定 =====
  const colorSheet: any[] = [];
  colorSheet.push([createCell("設定項目", true), createCell("顏色", true)]);
  colorSheet.push(["星期六顏色", data.saturdayColor]);
  colorSheet.push(["星期日顏色", data.sundayColor]);
  colorSheet.push(["國定假日顏色", data.holidayColor]);
  const colorWorksheet = XLSX.utils.aoa_to_sheet(colorSheet);
  colorWorksheet["!cols"] = [{ wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, colorWorksheet, "顏色設定");

  // 生成下載
  XLSX.writeFile(workbook, "設定資料.xlsx");
}

/**
 * 導出完整資料（排班表 + 設定資料）為 XLSX
 */
export function exportAllAsXLSX(
  dept: Department | undefined,
  staff: Staff[],
  year: number,
  month: number,
  daysInMonth: number,
  data: AppData
): void {
  const workbook = XLSX.utils.book_new();
  const monthKey = getMonthKey(year, month);

  // ===== 排班表 =====
  const worksheet: any[] = [];
  
  // 標題
  worksheet.push([
    { v: dept ? dept.name : "", s: { font: { bold: true, size: 14, name: "Microsoft JhengHei" }, alignment: { horizontal: "left" } } },
    { v: `${year}年${month + 1}月`, s: { font: { bold: true, size: 14, name: "Microsoft JhengHei" }, alignment: { horizontal: "right" } } }
  ]);
  worksheet.push([]);

  // 表頭
  const headerRow = [];
  headerRow.push(createCell("姓名", true));
  for (let d = 1; d <= daysInMonth; d++) {
    headerRow.push(createCell(String(d), true));
  }
  worksheet.push(headerRow);

  // 數據
  staff.forEach((s) => {
    const row = [];
    row.push(createCell(s.name));
    
    for (let d = 1; d <= daysInMonth; d++) {
      const cellKey = `${monthKey}-${s.id}-${d}`;
      const cellData = data.scheduleData[cellKey];
      
      if (cellData) {
        const status = data.statuses.find((st) => st.id === cellData.statusId);
        if (status) {
          const isHoliday = data.holidays.some(h => {
            const holidayDate = h.date.replace(/\//g, "-");
            return holidayDate === `${year}-${month + 1}-${d}`;
          });
          
          let cellColor = status.color;
          if (isHoliday) {
            cellColor = data.holidayColor;
          } else if (new Date(year, month, d).getDay() === 0) {
            cellColor = data.sundayColor;
          } else if (new Date(year, month, d).getDay() === 6) {
            cellColor = data.saturdayColor;
          }
          
          row.push(createColoredCell(status.name, cellColor));
        } else {
          row.push(createCell(""));
        }
      } else {
        row.push(createCell(""));
      }
    }
    worksheet.push(row);
  });

  const scheduleSheet = XLSX.utils.aoa_to_sheet(worksheet);
  const colWidths = [{ wch: 10 }];
  for (let d = 1; d <= daysInMonth; d++) {
    colWidths.push({ wch: 4 });
  }
  scheduleSheet["!cols"] = colWidths;
  XLSX.utils.book_append_sheet(workbook, scheduleSheet, "排班表");

  // ===== 部門資料 =====
  const deptSheet: any[] = [];
  deptSheet.push([createCell("部門名稱", true), createCell("電話", true)]);
  data.departments.forEach((dept) => {
    deptSheet.push([dept.name, dept.phone || ""]);
  });
  const deptWorksheet = XLSX.utils.aoa_to_sheet(deptSheet);
  deptWorksheet["!cols"] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, deptWorksheet, "部門資料");

  // ===== 人員資料 =====
  const staffSheet: any[] = [];
  staffSheet.push([createCell("姓名", true), createCell("職位", true), createCell("電話", true), createCell("部門", true)]);
  data.staff.forEach((s) => {
    const dept = data.departments.find((d) => d.id === s.deptId);
    staffSheet.push([s.name, s.position || "", s.phone || "", dept ? dept.name : ""]);
  });
  const staffWorksheet = XLSX.utils.aoa_to_sheet(staffSheet);
  staffWorksheet["!cols"] = [{ wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, staffWorksheet, "人員資料");

  // ===== 特殊假日 =====
  const holidaySheet: any[] = [];
  holidaySheet.push([createCell("日期", true), createCell("名稱", true)]);
  data.holidays.forEach((h) => {
    holidaySheet.push([h.date, h.name]);
  });
  const holidayWorksheet = XLSX.utils.aoa_to_sheet(holidaySheet);
  holidayWorksheet["!cols"] = [{ wch: 12 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, holidayWorksheet, "特殊假日");

  // ===== 狀態選項 =====
  const statusSheet: any[] = [];
  statusSheet.push([createCell("名稱", true), createCell("顏色", true)]);
  data.statuses.forEach((s) => {
    statusSheet.push([s.name, s.color]);
  });
  const statusWorksheet = XLSX.utils.aoa_to_sheet(statusSheet);
  statusWorksheet["!cols"] = [{ wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, statusWorksheet, "狀態選項");

  // ===== 顏色設定 =====
  const colorSheet: any[] = [];
  colorSheet.push([createCell("設定項目", true), createCell("顏色", true)]);
  colorSheet.push(["星期六顏色", data.saturdayColor]);
  colorSheet.push(["星期日顏色", data.sundayColor]);
  colorSheet.push(["國定假日顏色", data.holidayColor]);
  const colorWorksheet = XLSX.utils.aoa_to_sheet(colorSheet);
  colorWorksheet["!cols"] = [{ wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(workbook, colorWorksheet, "顏色設定");

  // 生成下載
  const filename = `班表_${dept ? dept.name : ""}_${year}年${month + 1}月_完整版.xlsx`;
  XLSX.writeFile(workbook, filename);
}
