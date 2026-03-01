/**
 * 日期工具函數
 * 提供日期計算、格式化等功能
 */

/**
 * 獲取月份鍵值（用於數據存儲）
 * @param year 年份
 * @param month 月份（0-11）
 * @returns 格式為 "YYYY-M" 的字符串
 */
export function getMonthKey(year: number, month: number): string {
  return `${year}-${month + 1}`;
}

/**
 * 獲取指定月份的天數
 * @param year 年份
 * @param month 月份（0-11）
 * @returns 該月份的天數
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 獲取指定日期是星期幾
 * @param year 年份
 * @param month 月份（0-11）
 * @param day 日期（1-31）
 * @returns 0-6 表示周日到周六
 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month, day).getDay();
}

/**
 * 判斷是否為週末
 * @param dayOfWeek 星期幾（0-6）
 * @returns 是否為週末
 */
export function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * 判斷是否為星期六
 * @param dayOfWeek 星期幾（0-6）
 * @returns 是否為星期六
 */
export function isSaturday(dayOfWeek: number): boolean {
  return dayOfWeek === 6;
}

/**
 * 判斷是否為星期日
 * @param dayOfWeek 星期幾（0-6）
 * @returns 是否為星期日
 */
export function isSunday(dayOfWeek: number): boolean {
  return dayOfWeek === 0;
}

/**
 * 判斷是否為節日
 * @param year 年份
 * @param month 月份（0-11）
 * @param day 日期（1-31）
 * @param holidays 節日列表
 * @returns 節日名稱或 null
 */
export function getHolidayName(
  year: number,
  month: number,
  day: number,
  holidays: Array<{ date: string; name: string }>
): string | null {
  const dateStr = `${year}/${month + 1}/${day}`;
  const holiday = holidays.find((h) => h.date === dateStr);
  return holiday ? holiday.name : null;
}

/**
 * 格式化月份顯示
 * @param year 年份
 * @param month 月份（0-11）
 * @returns 格式為 "YYYY年M月" 的字符串
 */
export function formatMonth(year: number, month: number): string {
  return `${year}年${month + 1}月`;
}

/**
 * 獲取星期名稱
 * @param dayOfWeek 星期幾（0-6）
 * @returns 星期名稱（中文）
 */
export function getDayName(dayOfWeek: number): string {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return days[dayOfWeek];
}

/**
 * 解析日期字符串
 * @param dateStr 日期字符串，格式為 "YYYY/M/D"
 * @returns { year, month, day } 或 null 如果格式不正確
 */
export function parseDate(
  dateStr: string
): { year: number; month: number; day: number } | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;

  return { year, month, day };
}
