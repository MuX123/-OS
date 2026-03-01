/**
 * 部門頭部組件
 * 顯示當前部門的信息
 */

import { useSchedule } from "@/contexts/ScheduleContext";

export function DepartmentHeader() {
  const { data, currentDeptId } = useSchedule();

  const currentDept = data.departments.find((d) => d.id === currentDeptId);

  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {currentDept?.name || "未選擇部門"}
      </h1>
      {currentDept?.phone && (
        <p className="text-lg text-gray-600">{currentDept.phone}</p>
      )}
    </div>
  );
}
