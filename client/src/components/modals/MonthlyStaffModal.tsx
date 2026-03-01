/**
 * 月度人員選擇模態框
 * 用於選擇該月份出勤的人員
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MonthlyStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MonthlyStaffModal({ isOpen, onClose }: MonthlyStaffModalProps) {
  const { data, currentDeptId, getMonthlyStaff, setMonthlyStaff } =
    useSchedule();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(getMonthlyStaff());
    }
  }, [isOpen, getMonthlyStaff]);

  if (!isOpen) return null;

  const deptStaff = data.staff.filter((s) => s.deptId === currentDeptId);

  const handleToggle = (staffId: string) => {
    setSelectedIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSave = () => {
    setMonthlyStaff(selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">選擇出勤人員</h3>
        <div className="space-y-2 mb-4">
          {deptStaff.map((staff) => (
            <label
              key={staff.id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(staff.id)}
                onChange={() => handleToggle(staff.id)}
                className="w-4 h-4"
              />
              <span>
                {staff.position && `[${staff.position}]`} {staff.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            確定
          </Button>
        </div>
      </div>
    </div>
  );
}
