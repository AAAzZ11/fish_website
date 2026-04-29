"use client";

import { useState, useEffect, useRef } from "react";
// 引入彩帶套件
import Confetti from "react-confetti";

// 定義模式設定
const MODES = [
  { id: "eco", label: "節能", power: 1, target: 55, color: "bg-green-500" },
  { id: "high", label: "強力", power: 3, target: 40, color: "bg-blue-500" },
  { id: "dry", label: "乾衣", power: 5, target: 0, color: "bg-purple-500" }, // 將乾衣目標設為 0
];

export default function KeelungDehumidifier() {
  // --- 狀態管理 ---
  const [humidity, setHumidity] = useState(15); // 為了方便測試，初始濕度設低一點
  const [activeModeId, setActiveModeId] = useState<string | null>(null);
  const [waterLevel, setWaterLevel] = useState(0); // 水箱百分比
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isQualifiedKeelunger, setIsQualifiedKeelunger] = useState(false); // 是否達成基隆人成就
  
  // 用於獲取視窗大小以載入彩帶
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const mainRef = useRef<HTMLDivElement>(null);

  // --- 核心邏輯：模擬環境變化 ---
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMode = MODES.find((m) => m.id === activeModeId);

      // 當濕度大於 0 時的正常運作邏輯
      if (isPowerOn && currentMode && waterLevel < 100 && humidity > 0) {
        setHumidity((prev) => Math.max(prev - 0.5 * currentMode.power, 0)); // 確保不會變成負數
        setWaterLevel((prev) => Math.min(prev + 0.2 * currentMode.power, 100));
      } else if (!isPowerOn && humidity < 85 && !isQualifiedKeelunger) {
        // 關機且未達成成就時，基隆的空氣會讓濕度快速回升
        setHumidity((prev) => prev + 0.5);
      }
    }, 500); // 加快一點速度以便測試

    return () => clearInterval(interval);
  }, [isPowerOn, activeModeId, waterLevel, humidity, isQualifiedKeelunger]);

  // --- 特效邏輯：監測濕度是否歸零 ---
  useEffect(() => {
    if (humidity <= 0 && !isQualifiedKeelunger) {
      setIsQualifiedKeelunger(true);
      setIsPowerOn(false); // 達成成就後自動關機，象徵基隆終於乾了
      
      // 設定彩帶範圍為當前視窗
      if (typeof window !== "undefined") {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    }
  }, [humidity, isQualifiedKeelunger]);

  // --- 處理函式 ---
  const togglePower = () => {
    if (isQualifiedKeelunger) return; // 達成成就後禁用電源，直到重置
    setIsPowerOn(!isPowerOn);
    if (!isPowerOn && !activeModeId) setActiveModeId("eco");
  };

  const emptyWater = () => setWaterLevel(0);
  
  // 重置按鈕（方便再次測試用）
  const resetChallenge = () => {
    setHumidity(80);
    setIsQualifiedKeelunger(false);
    setWaterLevel(0);
    setActiveModeId(null);
  };

  return (
    <main ref={mainRef} className="relative flex h-screen w-full flex-col items-center justify-center bg-zinc-950 p-4 text-white font-sans overflow-hidden">
      
      {/* 滿足條件時顯示全螢幕彩帶 */}
      {isQualifiedKeelunger && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true} // 讓彩帶持續飄落
          numberOfPieces={400}
          gravity={0.05} // 讓彩帶飄慢一點，比較有唯美感
          colors={['#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171']} // 自定義夢幻配色
        />
      )}

      {/* 基隆人成就達成彈出視窗 */}
      {isQualifiedKeelunger && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-zinc-100 rounded-3xl p-10 text-center shadow-2xl shadow-purple-500/50 border-4 border-purple-400 max-w-lg scale-in-center">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-5xl font-black text-zinc-900 leading-tight mb-4 tracking-tighter">
              恭喜你完成了除溼！
            </h2>
            <p className="text-2xl text-purple-700 font-bold mb-8 leading-relaxed">
              你現在是個合格的<span className="bg-purple-200 px-2 py-1 rounded-lg">基隆人</span>了。
            </p>
            <p className="text-zinc-600 mb-10 text-lg">在基隆能把濕度降到 0%，你創造了歷史！空氣終於不是液態的了。</p>
            <button 
              onClick={resetChallenge}
              className="bg-zinc-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-700 transition-all"
            >
              再次挑戰基隆氣候
            </button>
          </div>
        </div>
      )}
      
      {/* 機器主體 */}
      <div className={`relative w-full max-w-sm rounded-[3rem] bg-zinc-100 p-8 text-zinc-800 shadow-2xl transition-all duration-1000 ${isQualifiedKeelunger ? 'shadow-purple-500/50 scale-105' : 'shadow-blue-500/10'}`}>
        
        {/* 上方螢幕顯示區 */}
        <div className={`mb-8 rounded-2xl p-6 text-center text-white shadow-inner transition-colors ${isQualifiedKeelunger ? 'bg-purple-600' : 'bg-zinc-800'}`}>
          <div className="text-xs uppercase tracking-widest opacity-60">Rainy Port Humidity</div>
          <div className="text-7xl font-black italic tracking-tighter my-1">
            {Math.round(humidity)}<span className="text-3xl font-normal">%</span>
          </div>
          <div className="mt-2 text-xs font-bold tracking-wider">
            {isQualifiedKeelunger 
              ? "🏆 MISSION ACCOMPLISHED" 
              : (isPowerOn && waterLevel < 100 ? "● FIGHTING MOISTURE" : "○ STANDBY")}
          </div>
        </div>

        {/* 視覺風扇動畫 */}
        <div className="flex justify-center py-2 relative">
          {isQualifiedKeelunger && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl rotate-12">☀️</div>
          )}
          <div className={`h-24 w-24 rounded-full border-4 border-zinc-300 flex items-center justify-center transition-opacity ${isQualifiedKeelunger ? 'opacity-0' : 'opacity-100'} ${isPowerOn && waterLevel < 100 ? 'animate-spin' : ''}`} 
               style={{ animationDuration: activeModeId === 'high' ? '0.3s' : '1s' }}>
            <div className="h-1 w-20 bg-zinc-400 rounded-full"></div>
            <div className="absolute h-20 w-1 bg-zinc-400 rounded-full"></div>
          </div>
        </div>

        {/* 控制按鈕區 */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              disabled={!isPowerOn || isQualifiedKeelunger}
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
            disabled={isQualifiedKeelunger}
            className={`flex-1 rounded-2xl py-4 font-black tracking-widest transition-all disabled:opacity-30 ${
              isPowerOn ? "bg-red-500 text-white" : "bg-zinc-800 text-white"
            }`}
          >
            {isPowerOn ? "OFF" : "START FIGHT"}
          </button>
          
          <button 
            onClick={emptyWater}
            className="rounded-2xl bg-blue-100 px-6 font-bold text-blue-600 hover:bg-blue-200 disabled:opacity-50"
            disabled={isQualifiedKeelunger}
          >
            排水
          </button>
        </div>

        {/* 水箱進度條 */}
        <div className="mt-8 overflow-hidden rounded-xl bg-zinc-200 p-1">
          <div 
            className={`h-2 rounded-lg transition-all duration-500 ${waterLevel > 90 ? 'bg-red-500' : 'bg-blue-400'}`}
            style={{ width: `${waterLevel}%` }}
          />
        </div>

        {/* 水滿警告標籤 */}
        {waterLevel >= 100 && !isQualifiedKeelunger && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-xl animate-bounce">
            ⚠️ 水箱已滿 (在基隆很正常)
          </div>
        )}
      </div>

      {/* 底部說明 */}
      <div className="mt-8 text-center text-zinc-600">
        <p className="text-sm font-bold">Keelung Survival Series: Dehumidifier</p>
        <p className="text-xs opacity-70">挑戰將雨港濕度降為 0 的傳說</p>
      </div>

      {/* 簡單的 CSS 動畫 */}
      <style jsx global>{`
        @keyframes scale-in-center {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-in-center {
          animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
      `}</style>
    </main>
  );
}