/**
 * 班表系統主頁面
 * 集成所有組件，提供完整的班表管理功能
 */

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DepartmentHeader } from "@/components/DepartmentHeader";
import { MonthNavigation } from "@/components/MonthNavigation";
import { ScheduleTable } from "@/components/ScheduleTable";
import { BottomSection } from "@/components/BottomSection";
import { MonthlyStaffModal } from "@/components/modals/MonthlyStaffModal";
import { DepartmentSettings } from "@/components/settings/DepartmentSettings";
import { StaffSettings } from "@/components/settings/StaffSettings";
import { StatusSettings } from "@/components/settings/StatusSettings";
import { HolidaySettings } from "@/components/settings/HolidaySettings";
import { ColorSettings } from "@/components/settings/ColorSettings";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchedule } from "@/contexts/ScheduleContext";
import { exportAllAsXLSX, exportSettingsAsXLSX } from "@/lib/xlsxExport";
import { toast } from "sonner";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "settings">("home");
  const [showMonthlyStaffModal, setShowMonthlyStaffModal] = useState(false);
  const [selectedExportDept, setSelectedExportDept] = useState<string>("current");

  const {
    data,
    currentDeptId,
    currentYear,
    currentMonth,
    getDaysInMonth,
    getMonthlyStaffForDept,
  } = useSchedule();

  const handleExport = () => {
    if (!currentDeptId && selectedExportDept === "current") {
      toast.error("請先選擇部門");
      return;
    }

    const currentDept = data.departments.find((d) => d.id === currentDeptId);
    const staff = getMonthlyStaffForDept();
    const daysInMonth = getDaysInMonth();

    if (selectedExportDept === "current") {
      // 匯出目前選擇的部門
      exportAllAsXLSX(currentDept, staff, currentYear, currentMonth, daysInMonth, data);
    } else if (selectedExportDept === "settings") {
      // 匯出所有設定資料
      exportSettingsAsXLSX(data);
    } else {
      // 匯出指定部門
      const dept = data.departments.find((d) => d.id === selectedExportDept);
      if (dept) {
        const deptStaff = data.staff.filter((s) => s.deptId === dept.id);
        exportAllAsXLSX(dept, deptStaff, currentYear, currentMonth, daysInMonth, data);
      }
    }

    toast.success("已匯出 Excel 檔案");
  };

  const handleAddMonthlyStaff = () => {
    if (!currentDeptId) {
      toast.error("請先選擇部門");
      return;
    }
    setShowMonthlyStaffModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {currentPage === "home" ? (
        <div className="p-4">
          <DepartmentHeader />
          <MonthNavigation />
          <ScheduleTable />
          <BottomSection />
          
          {/* 下載區 */}
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">下載區</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedExportDept} onValueChange={setSelectedExportDept}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="選擇部門" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">目前選擇的部門</SelectItem>
                  <SelectItem value="settings">僅匯出設定資料</SelectItem>
                  {data.departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleExport}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                下載 Excel
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Excel 檔案包含「排班表」與「設定資料」兩個分頁，設定資料包含部門、人員、電話、假日、狀態選項及顏色設定
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 max-w-4xl mx-auto space-y-6">
          <DepartmentSettings />
          <StaffSettings />
          <StatusSettings />
          <HolidaySettings />
          <ColorSettings />
        </div>
      )}

      <MonthlyStaffModal
        isOpen={showMonthlyStaffModal}
        onClose={() => setShowMonthlyStaffModal(false)}
      />
    </div>
  );
}
