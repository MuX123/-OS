/**
 * 顏色設定組件
 * 用於設置週末和節日的底色
 */

import { useSchedule } from "@/contexts/ScheduleContext";

export function ColorSettings() {
  const { data, setSaturdayColor, setSundayColor } = useSchedule();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
        週末底色設定
      </h2>
      <div className="flex space-x-8">
        <div className="flex items-center space-x-3">
          <span className="font-medium">星期六:</span>
          <input
            type="color"
            value={data.saturdayColor}
            onChange={(e) => setSaturdayColor(e.target.value)}
            className="w-12 h-8 cursor-pointer"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-medium">星期日:</span>
          <input
            type="color"
            value={data.sundayColor}
            onChange={(e) => setSundayColor(e.target.value)}
            className="w-12 h-8 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
