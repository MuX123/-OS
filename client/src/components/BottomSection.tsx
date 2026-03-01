/**
 * 底部區域組件
 * 包含聯絡方式、上班情況和備註欄
 */

import { useSchedule } from "@/contexts/ScheduleContext";
import { useState } from "react";

export function BottomSection() {
  const { data, currentDeptId } = useSchedule();
  const [notes, setNotes] = useState("");

  const currentDept = data.departments.find((d) => d.id === currentDeptId);
  const deptStaff = data.staff.filter((s) => s.deptId === currentDeptId);

  // 計算上班情況統計
  const staffCount = deptStaff.length;
  const presentCount = deptStaff.length; // 簡化版本，實際應計算有班表的人員

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* 聯絡方式 */}
      <div className="col-span-2 bg-white rounded-lg shadow p-3">
        <h3 className="text-base font-bold text-gray-800 mb-2 border-b pb-1">
          聯絡方式
        </h3>
        <div className="space-y-1 text-sm">
          {currentDept?.phone && (
            <div className="text-gray-700">{currentDept.phone}</div>
          )}
          {deptStaff.map((staff) => (
            <div key={staff.id} className="text-gray-700">
              {staff.name}: {staff.phone || "無"}
            </div>
          ))}
        </div>
      </div>

      {/* 上班情況 */}
      <div className="col-span-2 bg-white rounded-lg shadow p-3">
        <h3 className="text-base font-bold text-gray-800 mb-2 border-b pb-1">
          上班情況
        </h3>
        <div className="space-y-1 text-sm">
          <div className="text-gray-700">
            總人數: <span className="font-semibold">{staffCount}</span>
          </div>
          <div className="text-gray-700">
            出勤: <span className="font-semibold">{presentCount}</span>
          </div>
          {data.statuses.map((status) => {
            const count = deptStaff.length; // 簡化版本
            return (
              <div key={status.id} className="text-gray-700">
                {status.name}: <span className="font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 備註欄 */}
      <div className="col-span-8 bg-white rounded-lg shadow p-3">
        <h3 className="text-base font-bold text-gray-800 mb-2 border-b pb-1">
          備註欄
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 border rounded p-2 text-sm resize-none"
          placeholder="輸入備註..."
        />
      </div>
    </div>
  );
}
