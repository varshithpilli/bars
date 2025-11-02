import { useEffect, useState } from "react";
import Header from "./components/Header";
import LyricCard from "./components/LyricCard";
import { lyrics } from "./data/lyrics";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [shuffledLyrics, setShuffledLyrics] = useState(lyrics);

  useEffect(() => {
    setShuffledLyrics(shuffleArray(lyrics));
  }, []);

  useEffect(() => {
    let offset = 0;
    const interval = setInterval(() => {
      offset += 0.2;
      const bgDiv = document.getElementById("background");
      if (bgDiv) {
        bgDiv.style.backgroundPosition = `center, ${offset}px ${offset}px`;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      <div
        id="background"
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(125% 125% at 50% 10%, #0F0E0E 40%, #0F0E0E 100%),
            radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "100% 100%, 30px 30px",
          backgroundPosition: "center, 0 0",
          backgroundBlendMode: "overlay",
          transition: "background-position 0.05s linear",
        }}
      />

      <main className="text-white min-h-screen flex flex-col items-center">
        <div className="w-3/4 py-10">
          <Header />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shuffledLyrics.map((item, i) => (
              <LyricCard key={i} {...item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
