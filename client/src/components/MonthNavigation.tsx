/**
 * 月份導航組件
 * 提供月份切換功能
 */

import { Button } from "@/components/ui/button";
import { useSchedule } from "@/contexts/ScheduleContext";
import { formatMonth } from "@/lib/dateUtils";

export function MonthNavigation() {
  const { currentYear, currentMonth, setCurrentMonth, setCurrentYear } =
    useSchedule();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 mb-4">
      <Button
        onClick={handlePrevMonth}
        variant="outline"
        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
      >
        ◀ 上月
      </Button>
      <span className="text-lg font-bold text-gray-800">
        {formatMonth(currentYear, currentMonth)}
      </span>
      <Button
        onClick={handleNextMonth}
        variant="outline"
        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
      >
        下月 ▶
      </Button>
    </div>
  );
}
