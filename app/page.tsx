"use client";

import { useState, useEffect } from "react";

// 定義模式設定
const MODES = [
  { id: "eco", label: "節能", power: 1, target: 55, color: "bg-green-500" },
  { id: "high", label: "強力", power: 3, target: 40, color: "bg-blue-500" },
  { id: "dry", label: "乾衣", power: 5, target: 30, color: "bg-purple-500" },
];

export default function Dehumidifier() {
  // --- 狀態管理 ---
  const [humidity, setHumidity] = useState(78); // 當前濕度
  const [activeModeId, setActiveModeId] = useState<string | null>(null); // 運作模式
  const [waterLevel, setWaterLevel] = useState(20); // 水箱百分比
  const [isPowerOn, setIsPowerOn] = useState(false); // 電源狀態

  // --- 核心邏輯：模擬環境變化 ---
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMode = MODES.find((m) => m.id === activeModeId);

      if (isPowerOn && currentMode && waterLevel < 100) {
        // 1. 如果開機且水箱未滿：濕度下降
        setHumidity((prev) => (prev > currentMode.target ? prev - 1 : prev));
        // 2. 水箱水位上升
        setWaterLevel((prev) => Math.min(prev + 0.5, 100));
      } else {
        // 3. 待機中：濕度隨空氣緩慢回升
        setHumidity((prev) => (prev < 80 ? prev + 0.1 : prev));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPowerOn, activeModeId, waterLevel]);

  // --- 處理函式 ---
  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
    if (!isPowerOn && !activeModeId) setActiveModeId("eco");
  };

  const emptyWater = () => setWaterLevel(0);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-zinc-900 p-4 text-white font-sans">
      
      {/* 機器主體 */}
      <div className="relative w-full max-w-sm rounded-[3rem] bg-zinc-100 p-8 text-zinc-800 shadow-2xl shadow-blue-500/20">
        
        {/* 上方螢幕顯示區 */}
        <div className="mb-8 rounded-2xl bg-zinc-800 p-6 text-center text-white shadow-inner">
          <div className="text-xs uppercase tracking-widest opacity-50">Current Humidity</div>
          <div className="text-6xl font-black italic tracking-tighter">
            {Math.round(humidity)}<span className="text-2xl font-normal">%</span>
          </div>
          <div className="mt-2 text-xs font-medium text-blue-400">
            {isPowerOn && waterLevel < 100 ? "● SYSTEM RUNNING" : "○ STANDBY"}
          </div>
        </div>

        {/* 視覺風扇動畫 */}
        <div className="flex justify-center py-4">
          <div className={`h-24 w-24 rounded-full border-4 border-zinc-300 flex items-center justify-center ${isPowerOn && waterLevel < 100 ? 'animate-spin' : ''}`} 
               style={{ animationDuration: activeModeId === 'high' ? '0.5s' : '1.5s' }}>
            <div className="h-1 w-20 bg-zinc-400 rounded-full"></div>
            <div className="absolute h-20 w-1 bg-zinc-400 rounded-full"></div>
          </div>
        </div>

        {/* 控制按鈕區 */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              disabled={!isPowerOn}
              onClick={() => setActiveModeId(mode.id)}
              className={`rounded-xl py-3 text-sm font-bold transition-all ${
                activeModeId === mode.id && isPowerOn
                  ? `${mode.color} text-white shadow-lg`
                  : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
              } disabled:opacity-30`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* 電源鍵與排水鍵 */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={togglePower}
            className={`flex-1 rounded-2xl py-4 font-black tracking-widest transition-all ${
              isPowerOn ? "bg-red-500 text-white" : "bg-zinc-800 text-white"
            }`}
          >
            {isPowerOn ? "OFF" : "POWER ON"}
          </button>
          
          <button 
            onClick={emptyWater}
            className="rounded-2xl bg-blue-100 px-6 font-bold text-blue-600 hover:bg-blue-200"
          >
            排水
          </button>
        </div>

        {/* 水箱進度條 */}
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-xs font-bold uppercase opacity-60">
            <span>Water Tank</span>
            <span>{Math.round(waterLevel)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div 
              className={`h-full transition-all duration-500 ${waterLevel > 90 ? 'bg-red-500' : 'bg-blue-400'}`}
              style={{ width: `${waterLevel}%` }}
            />
          </div>
        </div>

        {/* 水滿警告標籤 */}
        {waterLevel >= 100 && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-xl animate-bounce">
            ?? 水箱已滿
          </div>
        )}
      </div>

      {/* 底部說明 */}
      <div className="mt-8 text-center text-zinc-500">
        <p className="text-sm">Virtual Dehumidifier System v1.0</p>
        <p className="text-xs opacity-50">模擬真實濕度與排水機制</p>
      </div>
    </main>
  );
}