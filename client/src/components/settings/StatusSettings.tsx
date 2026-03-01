/**
 * 狀態設定組件
 * 用於管理班表狀態（如：病、休、事、代）
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { exportStatusesCSV, readCSVFile, importStatuses } from "@/lib/csvExport";

export function StatusSettings() {
  const { data, addStatus, deleteStatus, updateStatusColor, importStatusesList } = useSchedule();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff9999");

  const handleAdd = () => {
    if (name.trim()) {
      addStatus(name, color);
      setName("");
      setColor("#ff9999");
    }
  };

  const handleExport = () => {
    exportStatusesCSV(data.statuses);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const rows = await readCSVFile(file);
        const imported = importStatuses(rows);
        importStatusesList(imported);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to import statuses:", error);
        alert("導入失敗，請檢查文件格式");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-gray-800">狀態設定</h2>
        <div className="flex space-x-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-100 font-bold"
          >
            導出 CSV
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
              className="text-green-600 border-green-600 hover:bg-green-100 font-bold"
          >
            導入 CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="狀態名稱"
          className="flex-1 border rounded px-3 py-2"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm">顏色:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-8 cursor-pointer"
          />
        </div>
        <Button
          onClick={handleAdd}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
        >
          新增狀態
        </Button>
      </div>
      <div className="space-y-2">
        {data.statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center">
              <input
                type="color"
                value={status.color}
                onChange={(e) => updateStatusColor(status.id, e.target.value)}
                className="w-8 h-6 mr-2 cursor-pointer"
              />
              <span>{status.name}</span>
            </div>
            <Button
              onClick={() => deleteStatus(status.id)}
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
