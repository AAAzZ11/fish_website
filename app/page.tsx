"use client";

import { useState, useEffect } from "react";
import MachineScene from "@/components/MachineScene";
import ControlPanel from "@/components/ControlPanel";

// 定義除濕機的運作模式
const modes = [
  { id: "eco", label: "節能模式", power: 1, target: 55 },
  { id: "high", label: "強力除濕", power: 3, target: 40 },
  { id: "dry", label: "乾衣模式", power: 5, target: 30 },
];

export default function DehumidifierPage() {
  const [currentHumidity, setCurrentHumidity] = useState(75); // 初始濕度
  const [activeModeId, setActiveModeId] = useState<string | null>(null);
  const [isWaterFull, setIsWaterFull] = useState(false);

  // 模擬濕度隨時間變化的邏輯
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHumidity((prev) => {
        const mode = modes.find((m) => m.id === activeModeId);
        // 如果有開機且水箱沒滿，且濕度高於目標，就下降
        if (mode && !isWaterFull && prev > mode.target) {
          return prev - 1;
        }
        // 沒開機或沒達成目標時，濕度緩慢回升
        return prev < 80 ? prev + 0.1 : prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [activeModeId, isWaterFull]);

  const activeMode = modes.find((m) => m.id === activeModeId) || null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-900 text-white">
      {/* 狀態指示標題 */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-3xl font-light tracking-widest">SMART DRY 2000</h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-5xl font-mono">{Math.round(currentHumidity)}%</span>
          <span className="text-sm opacity-50">當前環境濕度</span>
        </div>
      </div>

      {/* 視覺場景：傳入目前的濕度與運作狀態，控制動畫 */}
      <MachineScene 
        isRunning={!!activeModeId && !isWaterFull} 
        humidity={currentHumidity} 
      />

      {/* 控制面板：切換模式 */}
      <ControlPanel 
        activeModeId={activeModeId}
        onModeSelect={(id) => setActiveModeId(id === activeModeId ? null : id)}
        isWaterFull={isWaterFull}
        onEmptyTank={() => setIsWaterFull(false)}
      />

      {/* 警示通知 */}
      {isWaterFull && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm">
          <div className="bg-red-600 p-6 rounded-lg animate-bounce">
            <p className="font-bold">?? 水箱已滿，請立即排水</p>
          </div>
        </div>
      )}
    </main>
  );
}