/**
 * 班表系統全局數據上下文
 * 提供數據管理和操作方法
 */

import React, { createContext, useCallback, useEffect, useState } from "react";
import { AppData, ScheduleContextType } from "@/types/schedule";
import {
  loadData,
  saveData,
  generateId,
  DEFAULT_DATA,
} from "@/lib/storageUtils";
import { getMonthKey, getDaysInMonth } from "@/lib/dateUtils";

export const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

interface ScheduleProviderProps {
  children: React.ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [currentDeptId, setCurrentDeptId] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // 初始化數據
  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
  }, []);

  // 保存數據到本地存儲
  const updateData = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // 部門操作
  const addDepartment = useCallback(
    (name: string, phone?: string) => {
      const newData = {
        ...data,
        departments: [
          ...data.departments,
          { id: generateId(), name, phone: phone || "" },
        ],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const deleteDepartment = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        departments: data.departments.filter((d) => d.id !== id),
        staff: data.staff.filter((s) => s.deptId !== id),
      };
      updateData(newData);
      if (currentDeptId === id) {
        setCurrentDeptId(null);
      }
    },
    [data, currentDeptId, updateData]
  );

  // 人員操作
  const addStaff = useCallback(
    (deptId: string, name: string, position?: string, phone?: string) => {
      const newData = {
        ...data,
        staff: [
          ...data.staff,
          {
            id: generateId(),
            deptId,
            name,
            position: position || "",
            phone: phone || "",
          },
        ],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const deleteStaff = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        staff: data.staff.filter((s) => s.id !== id),
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const updateStaff = useCallback(
    (id: string, updates: Partial<Omit<any, "id" | "deptId">>) => {
      const newData = {
        ...data,
        staff: data.staff.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      };
      updateData(newData);
    },
    [data, updateData]
  );

  // 狀態操作
  const addStatus = useCallback(
    (name: string, color: string) => {
      const newData = {
        ...data,
        statuses: [
          ...data.statuses,
          { id: generateId(), name, color },
        ],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const deleteStatus = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        statuses: data.statuses.filter((s) => s.id !== id),
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const updateStatusColor = useCallback(
    (id: string, color: string) => {
      const newData = {
        ...data,
        statuses: data.statuses.map((s) =>
          s.id === id ? { ...s, color } : s
        ),
      };
      updateData(newData);
    },
    [data, updateData]
  );

  // 節日操作
  const addHolidays = useCallback(
    (holidays: Array<{ date: string; name: string }>) => {
      const newHolidays = holidays.map((h) => ({
        ...h,
        id: generateId(),
      }));
      const newData = {
        ...data,
        holidays: [...data.holidays, ...newHolidays],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const deleteHoliday = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        holidays: data.holidays.filter((h) => h.id !== id),
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const importStaffList = useCallback(
    (staffList: Staff[]) => {
      const newData = {
        ...data,
        staff: [...data.staff, ...staffList],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const importHolidaysList = useCallback(
    (holidays: Holiday[]) => {
      const newData = {
        ...data,
        holidays: [...data.holidays, ...holidays],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const importStatusesList = useCallback(
    (statuses: Status[]) => {
      const newData = {
        ...data,
        statuses: [...data.statuses, ...statuses],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const importDepartmentsList = useCallback(
    (departments: Department[]) => {
      const newData = {
        ...data,
        departments: [...data.departments, ...departments],
      };
      updateData(newData);
    },
    [data, updateData]
  );

  // 班表操作
  const setScheduleStatus = useCallback(
    (staffId: string, day: number, statusId: string | null) => {
      const monthKey = `${currentYear}-${currentMonth + 1}`;
      const cellKey = `${monthKey}-${staffId}-${day}`;
      const newScheduleData = { ...data.scheduleData };

      if (statusId) {
        newScheduleData[cellKey] = { statusId };
      } else {
        delete newScheduleData[cellKey];
      }

      const newData = {
        ...data,
        scheduleData: newScheduleData,
      };
      updateData(newData);
    },
    [data, currentYear, currentMonth, updateData]
  );

  const getScheduleStatus = useCallback(
    (staffId: string, day: number): string | null => {
      const monthKey = `${currentYear}-${currentMonth + 1}`;
      const cellKey = `${monthKey}-${staffId}-${day}`;
      const cellData = data.scheduleData[cellKey];
      return cellData ? cellData.statusId : null;
    },
    [data, currentYear, currentMonth]
  );

  // 月度人員操作
  const setMonthlyStaff = useCallback(
    (staffIds: string[]) => {
      const monthKey = `${currentYear}-${currentMonth + 1}`;
      const newData = {
        ...data,
        monthlyStaff: {
          ...data.monthlyStaff,
          [monthKey]: staffIds,
        },
      };
      updateData(newData);
    },
    [data, currentYear, currentMonth, updateData]
  );

  const getMonthlyStaff = useCallback((): string[] => {
    const monthKey = `${currentYear}-${currentMonth + 1}`;
    return data.monthlyStaff[monthKey] || [];
  }, [data, currentYear, currentMonth]);

  // 顏色操作
  const setSaturdayColor = useCallback(
    (color: string) => {
      const newData = {
        ...data,
        saturdayColor: color,
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const setSundayColor = useCallback(
    (color: string) => {
      const newData = {
        ...data,
        sundayColor: color,
      };
      updateData(newData);
    },
    [data, updateData]
  );

  const setHolidayColor = useCallback(
    (color: string) => {
      const newData = {
        ...data,
        holidayColor: color,
      };
      updateData(newData);
    },
    [data, updateData]
  );

  // 工具函數
  const getMonthKeyFn = useCallback(
    () => `${currentYear}-${currentMonth + 1}`,
    [currentYear, currentMonth]
  );

  const getDaysInMonthFn = useCallback(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const getMonthlyStaffForDept = useCallback((): any[] => {
    if (!currentDeptId) return [];
    const monthlyStaffIds = getMonthlyStaff();
    return data.staff.filter(
      (s) => s.deptId === currentDeptId && monthlyStaffIds.includes(s.id)
    );
  }, [data.staff, currentDeptId, getMonthlyStaff]);

  const value: ScheduleContextType = {
    data,
    currentDeptId,
    setCurrentDeptId,
    currentYear,
    currentMonth,
    setCurrentMonth,
    setCurrentYear,
    addDepartment,
    deleteDepartment,
    addStaff,
    deleteStaff,
    updateStaff,
    addStatus,
    deleteStatus,
    updateStatusColor,
    addHolidays,
    deleteHoliday,
    importStaffList,
    importHolidaysList,
    importStatusesList,
    importDepartmentsList,
    setScheduleStatus,
    getScheduleStatus,
    setMonthlyStaff,
    getMonthlyStaff,
    setSaturdayColor,
    setSundayColor,
    setHolidayColor,
    getMonthKey: getMonthKeyFn,
    getDaysInMonth: getDaysInMonthFn,
    getMonthlyStaffForDept,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

/**
 * 自定義 Hook，用於訪問班表上下文
 */
export function useSchedule(): ScheduleContextType {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
}
