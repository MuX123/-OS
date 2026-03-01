/**
 * 人員設定組件
 * 用於管理工作人員信息
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { EditStaffModal } from "../modals/EditStaffModal";
import { exportStaffCSV, readCSVFile, importStaff } from "@/lib/csvExport";

export function StaffSettings() {
  const { data, addStaff, deleteStaff, importStaffList } = useSchedule();
  const [deptId, setDeptId] = useState("");
  const [position, setPosition] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (deptId && name.trim()) {
      addStaff(deptId, name, position, phone);
      setPosition("");
      setName("");
      setPhone("");
    }
  };

  const handleExport = () => {
    exportStaffCSV(data.staff, data.departments);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const rows = await readCSVFile(file);
        const importedStaff = importStaff(rows, data.departments);
        importStaffList(importedStaff);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to import staff:", error);
        alert("導入失敗，請檢查文件格式");
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-gray-800">工作人員設定</h2>
          <div className="flex space-x-2">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              導出 CSV
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
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
          <Select value={deptId} onValueChange={setDeptId}>
            <SelectTrigger className="border rounded px-3 py-2">
              <SelectValue placeholder="選擇部門" />
            </SelectTrigger>
            <SelectContent>
              {data.departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="職位"
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="姓名"
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="電話"
            className="flex-1 border rounded px-3 py-2"
          />
          <Button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            新增人員
          </Button>
        </div>
        <div className="space-y-2">
          {data.staff.map((staff) => {
            const dept = data.departments.find((d) => d.id === staff.deptId);
            return (
              <div
                key={staff.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>
                  {dept ? `[${dept.name}]` : ""} {staff.position ? `${staff.position}` : ""}{" "}
                  {staff.name} {staff.phone || ""}
                </span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setEditingStaffId(staff.id)}
                    className="text-blue-500 hover:text-blue-700 px-2"
                    variant="ghost"
                  >
                    編輯
                  </Button>
                  <Button
                    onClick={() => deleteStaff(staff.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                    variant="ghost"
                  >
                    刪除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingStaffId && (
        <EditStaffModal
          staffId={editingStaffId}
          onClose={() => setEditingStaffId(null)}
        />
      )}
    </>
  );
}
