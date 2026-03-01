# 班表系統代碼分離優化分析

## 原始代碼結構分析

### 當前問題
- **單一 HTML 檔案**：所有 HTML、CSS、JavaScript 混合在 123.html 中（860 行）
- **全局作用域污染**：所有變數和函數都在全局作用域中
- **邏輯耦合度高**：UI 渲染、數據管理、事件處理混在一起
- **難以維護和測試**：無法獨立測試各個功能模塊
- **重複代碼**：多個相似的事件監聽器和 DOM 操作

### 識別的主要邏輯模塊

#### 1. 數據管理層
- 部門（departments）
- 人員（staff）
- 狀態（statuses）
- 節日（holidays）
- 班表數據（scheduleData）
- 月度人員（monthlyStaff）
- 顏色配置（saturdayColor, sundayColor, holidayColor）

#### 2. UI 組件層
- 導航欄（Navigation）
- 首頁（Home Page）
  - 部門頭部（Department Header）
  - 月份導航（Month Navigation）
  - 班表（Schedule Table）
  - 聯絡方式（Contact Info）
  - 上班情況（Work Status）
  - 備註欄（Notes）
  - 匯出按鈕（Export CSV）
- 設定頁面（Settings Page）
  - 部門設定（Department Settings）
  - 工作人員設定（Staff Settings）
  - 狀態設定（Status Settings）
  - 週末底色設定（Weekend Color Settings）
  - 節日設定（Holiday Settings）
- 模態框（Modals）
  - 月度人員選擇（Monthly Staff Modal）
  - 狀態選擇（Status Selection Modal）
  - 編輯人員（Edit Staff Modal）

#### 3. 業務邏輯層
- 日期計算（getMonthKey, getDaysInMonth 等）
- 班表渲染（renderSchedule）
- 狀態設置（setStatus）
- CSV 匯出（exportCSV）
- 數據持久化（loadData, saveData）

#### 4. 事件處理層
- 導航事件（首頁/設定切換）
- 部門選擇事件
- 月份導航事件
- 班表單元格點擊事件
- 模態框事件
- 表單提交事件
- 顏色選擇事件

## 優化方案

### 目標架構
```
schedule-system-optimized/
├── client/src/
│   ├── components/
│   │   ├── Navigation.tsx          # 導航欄
│   │   ├── ScheduleTable.tsx       # 班表組件
│   │   ├── DepartmentHeader.tsx    # 部門頭部
│   │   ├── MonthNavigation.tsx     # 月份導航
│   │   ├── BottomSection.tsx       # 底部區域（聯絡、狀態、備註）
│   │   ├── modals/
│   │   │   ├── MonthlyStaffModal.tsx
│   │   │   ├── StatusModal.tsx
│   │   │   └── EditStaffModal.tsx
│   │   └── settings/
│   │       ├── DepartmentSettings.tsx
│   │       ├── StaffSettings.tsx
│   │       ├── StatusSettings.tsx
│   │       ├── HolidaySettings.tsx
│   │       └── ColorSettings.tsx
│   ├── hooks/
│   │   ├── useScheduleData.ts      # 數據管理 Hook
│   │   ├── useMonthNavigation.ts   # 月份導航 Hook
│   │   └── useScheduleExport.ts    # 匯出功能 Hook
│   ├── lib/
│   │   ├── dateUtils.ts            # 日期工具函數
│   │   ├── storageUtils.ts         # 本地存儲工具
│   │   └── csvExport.ts            # CSV 匯出工具
│   ├── contexts/
│   │   └── ScheduleContext.tsx     # 全局數據上下文
│   ├── pages/
│   │   └── Home.tsx                # 主頁面（整合所有組件）
│   ├── types/
│   │   └── schedule.ts             # TypeScript 類型定義
│   └── App.tsx
```

### 分離策略

#### 1. 創建 TypeScript 類型定義
- 定義所有數據結構的接口
- 提高代碼可讀性和類型安全

#### 2. 提取工具函數
- 日期計算函數（getMonthKey, getDaysInMonth 等）
- 本地存儲操作（loadData, saveData）
- CSV 生成和匯出邏輯

#### 3. 創建自定義 Hooks
- `useScheduleData`：管理班表數據的全局狀態
- `useMonthNavigation`：處理月份導航邏輯
- `useScheduleExport`：處理 CSV 匯出功能

#### 4. 創建 React Context
- `ScheduleContext`：提供全局數據和操作方法
- 避免 props drilling

#### 5. 分解 UI 組件
- 每個組件負責單一職責
- 使用 shadcn/ui 組件庫
- 保持組件的可重用性

#### 6. 事件處理分離
- 將事件監聽器邏輯移到組件內
- 使用 React 的事件系統替代原生 DOM 事件

## 優化收益

1. **可維護性提升**：每個文件職責清晰，易於理解和修改
2. **可測試性提升**：邏輯分離後可以獨立測試各個模塊
3. **代碼重用**：通用邏輯提取為工具函數和 Hooks
4. **性能優化**：React 的虛擬 DOM 和優化渲染
5. **可擴展性**：新功能可以輕鬆添加而不影響現有代碼
6. **類型安全**：使用 TypeScript 提高代碼質量

## 實施步驟

1. ✅ 初始化 React 項目
2. ⏳ 定義 TypeScript 類型
3. ⏳ 提取工具函數
4. ⏳ 創建自定義 Hooks
5. ⏳ 創建 React Context
6. ⏳ 分解 UI 組件
7. ⏳ 集成所有組件到主頁面
8. ⏳ 測試和驗證
9. ⏳ 提交到 GitHub
