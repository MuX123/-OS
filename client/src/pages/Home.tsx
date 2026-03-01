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
import { useSchedule } from "@/contexts/ScheduleContext";
import { exportScheduleAsCSV } from "@/lib/csvExport";
import { toast } from "sonner";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "settings">("home");
  const [showMonthlyStaffModal, setShowMonthlyStaffModal] = useState(false);

  const {
    data,
    currentDeptId,
    currentYear,
    currentMonth,
    getDaysInMonth,
    getMonthlyStaffForDept,
  } = useSchedule();

  const handleExportCSV = () => {
    if (!currentDeptId) {
      toast.error("請先選擇部門");
      return;
    }

    const currentDept = data.departments.find((d) => d.id === currentDeptId);
    const staff = getMonthlyStaffForDept();
    const daysInMonth = getDaysInMonth();

    exportScheduleAsCSV(
      currentDept,
      staff,
      currentYear,
      currentMonth,
      daysInMonth,
      data
    );
    toast.success("班表已匯出");
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
          <div className="mt-4 text-center space-x-2">
            <Button
              onClick={handleAddMonthlyStaff}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              增加出勤人員
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              匯出 CSV
            </Button>
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
