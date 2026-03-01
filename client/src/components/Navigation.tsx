/**
 * 導航欄組件
 * 提供應用的主要導航功能
 */

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchedule } from "@/contexts/ScheduleContext";
import { toast } from "sonner";

interface NavigationProps {
  currentPage: "home" | "settings";
  onPageChange: (page: "home" | "settings") => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { data, currentDeptId, setCurrentDeptId } = useSchedule();

  const handleAddMonthlyStaff = () => {
    if (!currentDeptId) {
      toast.error("請先選擇部門");
      return;
    }
    // 這個功能會在主頁面中實現
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => onPageChange("home")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === "home"
                  ? "bg-indigo-700 hover:bg-indigo-800"
                  : "bg-transparent hover:bg-indigo-700"
              }`}
              variant="ghost"
            >
              首頁
            </Button>
            <Button
              onClick={() => onPageChange("settings")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === "settings"
                  ? "bg-indigo-700 hover:bg-indigo-800"
                  : "bg-transparent hover:bg-indigo-700"
              }`}
              variant="ghost"
            >
              設定
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={currentDeptId || ""} onValueChange={setCurrentDeptId}>
              <SelectTrigger className="bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-medium w-auto">
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

            {currentPage === "home" && (
              <Button
                onClick={handleAddMonthlyStaff}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
              >
                增加出勤人員
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
