/**
 * 部門設定組件
 * 用於管理部門信息
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DepartmentSettings() {
  const { data, addDepartment, deleteDepartment } = useSchedule();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      addDepartment(name, phone);
      setName("");
      setPhone("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
        部門設定
      </h2>
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
