/**
 * 狀態選擇模態框
 * 用於選擇班表單元格的狀態
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStatus: (statusId: string | null) => void;
}

export function StatusModal({
  isOpen,
  onClose,
  onSelectStatus,
}: StatusModalProps) {
  const { data } = useSchedule();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-4 w-64">
        <h3 className="text-base font-bold mb-3">選擇狀態</h3>
        <div className="space-y-2 mb-3">
          <button
            onClick={() => onSelectStatus(null)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition"
          >
            清除
          </button>
          {data.statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => onSelectStatus(status.id)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition flex items-center space-x-2"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: status.color }}
              />
              <span>{status.name}</span>
            </button>
          ))}
        </div>
        <Button
          onClick={onClose}
          className="w-full bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
        >
          取消
        </Button>
      </div>
    </div>
  );
}
