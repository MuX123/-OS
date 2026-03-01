/**
 * 班表組件
 * 顯示班表並支持狀態編輯
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { getDayOfWeek, getDayName, getHolidayName } from "@/lib/dateUtils";
import { useState } from "react";
import { StatusModal } from "./modals/StatusModal";

interface SelectedCellInfo {
  staffId: string;
  day: number;
}

export function ScheduleTable() {
  const {
    data,
    currentDeptId,
    currentYear,
    currentMonth,
    getDaysInMonth,
    getMonthlyStaffForDept,
    getScheduleStatus,
    setScheduleStatus,
  } = useSchedule();

  const [selectedCell, setSelectedCell] = useState<SelectedCellInfo | null>(
    null
  );
  const [showStatusModal, setShowStatusModal] = useState(false);

  const daysInMonth = getDaysInMonth();
  const monthlyStaff = getMonthlyStaffForDept();

  const handleCellClick = (staffId: string, day: number) => {
    setSelectedCell({ staffId, day });
    setShowStatusModal(true);
  };

  const handleStatusSelect = (statusId: string | null) => {
    if (selectedCell) {
      setScheduleStatus(selectedCell.staffId, selectedCell.day, statusId);
    }
    setShowStatusModal(false);
    setSelectedCell(null);
  };

  const getCellBackgroundColor = (day: number): string => {
    const dayOfWeek = getDayOfWeek(currentYear, currentMonth, day);
    const holidayName = getHolidayName(
      currentYear,
      currentMonth,
      day,
      data.holidays
    );

    if (holidayName) {
      return data.holidayColor;
    }
    if (dayOfWeek === 6) {
      return data.saturdayColor;
    }
    if (dayOfWeek === 0) {
      return data.sundayColor;
    }
    return "#ffffff";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 min-w-[70px] max-w-[70px] h-[24px] text-[10px] font-semibold">
                姓名
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const dayOfWeek = getDayOfWeek(
                    currentYear,
                    currentMonth,
                    day
                  );
                  const dayName = getDayName(dayOfWeek);
                  return (
                    <th
                      key={day}
                      className="border border-gray-300 bg-gray-100 p-1 min-w-[28px] h-[24px] text-[10px] font-semibold"
                    >
                      <div>{day}</div>
                      <div className="text-[8px]">{dayName}</div>
                    </th>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody>
            {monthlyStaff.map((staff) => (
              <tr key={staff.id}>
                <td className="border border-gray-300 bg-gray-50 p-2 min-w-[70px] max-w-[70px] text-[11px] font-medium">
                  {staff.position && `[${staff.position}]`} {staff.name}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const statusId = getScheduleStatus(staff.id, day);
                    const status = data.statuses.find(
                      (s) => s.id === statusId
                    );
                    const bgColor = getCellBackgroundColor(day);

                    return (
                      <td
                        key={`${staff.id}-${day}`}
                        onClick={() => handleCellClick(staff.id, day)}
                        className="border border-gray-300 p-0 min-w-[28px] h-[28px] text-[11px] text-center cursor-pointer hover:opacity-80 transition"
                        style={{
                          backgroundColor: status ? status.color : bgColor,
                        }}
                      >
                        {status && <span className="font-semibold">{status.name}</span>}
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <StatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onSelectStatus={handleStatusSelect}
        />
      )}
    </>
  );
}
