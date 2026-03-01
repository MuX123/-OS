/**
 * 本地存儲工具函數
 * 提供數據持久化功能
 */

import { AppData } from "@/types/schedule";

const STORAGE_KEY = "schedule-system-data";

/**
 * 默認的應用數據
 */
export const DEFAULT_DATA: AppData = {
  departments: [],
  staff: [],
  statuses: [
    { id: "1", name: "病", color: "#ffcdd2" },
    { id: "2", name: "休", color: "#c8e6c9" },
    { id: "3", name: "事", color: "#fff9c4" },
    { id: "4", name: "代", color: "#bbdefb" },
  ],
  holidays: [],
  saturdayColor: "#e6f3ff",
  sundayColor: "#ffe6e6",
  holidayColor: "#ffeb3b",
  monthlyStaff: {},
  scheduleData: {},
};

/**
 * 從本地存儲加載數據
 * @returns 存儲的應用數據，如果沒有則返回默認數據
 */
export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    const parsed = JSON.parse(stored);
    // 合併默認數據和存儲的數據，確保新增的字段有默認值
    return {
      ...DEFAULT_DATA,
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

/**
 * 保存數據到本地存儲
 * @param data 要保存的應用數據
 */
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
}

/**
 * 清除所有存儲的數據
 */
export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear data from localStorage:", error);
  }
}

/**
 * 生成唯一 ID
 * @returns 唯一的字符串 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 驗證應用數據的完整性
 * @param data 要驗證的數據
 * @returns 驗證是否通過
 */
export function validateData(data: unknown): data is AppData {
  if (typeof data !== "object" || data === null) return false;

  const appData = data as Record<string, unknown>;

  return (
    Array.isArray(appData.departments) &&
    Array.isArray(appData.staff) &&
    Array.isArray(appData.statuses) &&
    Array.isArray(appData.holidays) &&
    typeof appData.saturdayColor === "string" &&
    typeof appData.sundayColor === "string" &&
    typeof appData.holidayColor === "string" &&
    typeof appData.monthlyStaff === "object" &&
    typeof appData.scheduleData === "object"
  );
}
