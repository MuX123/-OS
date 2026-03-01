/**
 * 編輯人員模態框
 * 用於編輯人員信息
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface EditStaffModalProps {
  staffId: string;
  onClose: () => void;
}

export function EditStaffModal({ staffId, onClose }: EditStaffModalProps) {
  const { data, updateStaff } = useSchedule();
  const [position, setPosition] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const staff = data.staff.find((s) => s.id === staffId);

  useEffect(() => {
    if (staff) {
      setPosition(staff.position || "");
      setName(staff.name);
      setPhone(staff.phone || "");
    }
  }, [staff]);

  const handleSave = () => {
    updateStaff(staffId, {
      position,
      name,
      phone,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-bold mb-4">編輯人員</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="職位"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="姓名"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="電話"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            儲存
          </Button>
        </div>
      </div>
    </div>
  );
}
