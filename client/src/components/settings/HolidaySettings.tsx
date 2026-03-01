/**
 * 節日設定組件
 * 用於管理特殊節日
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HolidaySettings() {
  const { data, addHolidays, deleteHoliday, setHolidayColor } = useSchedule();
  const [input, setInput] = useState("");
  const [color, setColor] = useState(data.holidayColor);

  const handleAdd = () => {
    if (input.trim()) {
      const lines = input.split("\n");
      const holidays = lines
        .map((line) => {
          const parts = line.split("\t");
          if (parts.length >= 2) {
            return {
              date: parts[0].trim(),
              name: parts[1].trim(),
            };
          }
          return null;
        })
        .filter((h) => h !== null) as Array<{ date: string; name: string }>;

      if (holidays.length > 0) {
        addHolidays(holidays);
        setInput("");
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setHolidayColor(newColor);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
        特殊節日設定
      </h2>
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="輸入格式：2025/1/1	2025元旦
每行一筆，日期與名稱用Tab分隔"
        />
        <div className="flex space-x-2 mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">節日底色:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-8 cursor-pointer"
            />
          </div>
          <Button
            onClick={handleAdd}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            批次新增節日
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {data.holidays.map((holiday) => (
          <div
            key={holiday.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span>
              {holiday.date} - {holiday.name}
            </span>
            <Button
              onClick={() => deleteHoliday(holiday.id)}
              className="text-red-500 hover:text-red-700 px-2"
              variant="ghost"
            >
              刪除
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
