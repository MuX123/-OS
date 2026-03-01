/**
 * 部門設定組件
 * 用於管理部門信息
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { exportDepartmentsCSV, readCSVFile, importDepartments } from "@/lib/csvExport";

export function DepartmentSettings() {
  const { data, addDepartment, deleteDepartment, importDepartmentsList } = useSchedule();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      addDepartment(name, phone);
      setName("");
      setPhone("");
    }
  };

  const handleExport = () => {
    exportDepartmentsCSV(data.departments);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const rows = await readCSVFile(file);
        const imported = importDepartments(rows);
        importDepartmentsList(imported);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to import departments:", error);
        alert("導入失敗，請檢查文件格式");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-gray-800">部門設定</h2>
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
          placeholder="部門名稱"
          className="flex-1 border rounded px-3 py-2"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="部門電話"
          className="flex-1 border rounded px-3 py-2"
        />
        <Button
          onClick={handleAdd}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
        >
          新增部門
        </Button>
      </div>
      <div className="space-y-2">
        {data.departments.map((dept) => (
          <div
            key={dept.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span>
              <strong>{dept.name}</strong> {dept.phone || ""}
            </span>
            <Button
              onClick={() => deleteDepartment(dept.id)}
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
