"use client";

import { useEffect, useState } from "react";

const words = [
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "مرحبا",
  "Olá",
  "Привет",
  "नमस्ते",
  "Hallo",
  "你好",
];

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = i + 1;
      if (i < words.length) {
        setIndex(i);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setSplitting(true);
          setTimeout(() => {
            setDone(true);
            onComplete();
          }, 400);
        }, 400);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (done) return null;

  return (
    <div className={`fixed inset-0 z-[9999] ${splitting ? "pointer-events-none" : "pointer-events-auto"}`}>

      {!splitting && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <span
            key={index}
            className="text-white font-semibold tracking-tight select-none animate-wordFade"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
          >
            {words[index]}
          </span>
        </div>
      )}
    </div>
  );
}