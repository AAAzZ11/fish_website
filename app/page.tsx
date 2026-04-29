"use client";

import { useState } from "react";
import Scene from "@/components/Scene";
import Card from "@/components/Card";
import { messages } from "@/config/messages";

export default function Home() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const handleGiftSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  const handleCloseCard = () => {
    setSelectedMessageId(null);
  };

  const selectedMessage = selectedMessageId
    ? messages.find((m) => m.id === selectedMessageId) || null
    : null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute top-4 left-4 z-10 text-white/50">
        <h1 className="text-2xl font-bold tracking-tighter">生日快樂</h1>
        <p className="text-sm">隨機點開一個禮物可以獲得驚喜...或驚嚇</p>
      </div>

      <Scene onGiftSelect={handleGiftSelect} />

      <Card message={selectedMessage} onClose={handleCloseCard} />
    </main>
  );
}
