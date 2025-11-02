import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ColorThief from "colorthief";
// ⚡ ADD:
import * as htmlToImage from "html-to-image";

interface LyricCardProps {
  lyric: string;
  song: string;
  artist: string;
}

export default function LyricCard({ lyric, song, artist }: LyricCardProps) {
  const [gradient, setGradient] = useState<string>(
    "linear-gradient(135deg, rgb(31,41,55) 0%, rgb(17,24,39) 100%)"
  ); // fallback gray-800 gradient
  const imgRef = useRef<HTMLImageElement | null>(null);

  // ⚡ ADD: ref for the card itself
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCoverAndExtractColors() {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            song + " " + artist
          )}&entity=song&limit=1`
        );
        //         const res = await fetch(
        //   `https://cors-anywhere.herokuapp.com/https://itunes.apple.com/search?term=${encodeURIComponent(song + " " + artist)}&entity=song&limit=1`
        // );
        // const res = await fetch(
        //   `https://open.spotify.com/oembed?url=https://open.spotify.com/search/${encodeURIComponent(
        //     song + " " + artist
        //   )}`
        // );
        const data = await res.json();
        if (data.results?.[0]?.artworkUrl100) {
          const coverUrl = data.results[0].artworkUrl100.replace(
            "100x100",
            "600x600"
          );
          extractColors(coverUrl);
        }
      } catch (error) {
        console.error("Failed to fetch album cover:", error);
      }
    }

    function extractColors(imageUrl: string) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        if (!imgRef.current) imgRef.current = img;
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 5);

          if (palette && palette.length > 0) {
            const paletteWithBrightness = (palette as number[][]).map(
              ([r, g, b]) => {
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return { color: [r, g, b], brightness };
              }
            );

            paletteWithBrightness.sort((a, b) => a.brightness - b.brightness);
            const n = paletteWithBrightness.length;
            const arranged = [
              paletteWithBrightness[0].color,
              paletteWithBrightness[Math.floor(n / 2)].color,
              ...paletteWithBrightness.slice(1, n).map((c) => c.color),
              paletteWithBrightness[n - 1].color,
            ];

            const gradientString = `linear-gradient(120deg, ${arranged
              .map(([r, g, b], i) => {
                const dr = Math.floor(r * 0.85);
                const dg = Math.floor(g * 0.85);
                const db = Math.floor(b * 0.85);
                const percent = Math.round((i / (arranged.length - 1)) * 100);
                return `rgb(${dr},${dg},${db}) ${percent}%`;
              })
              .join(", ")})`;

            setGradient(gradientString);
          }
        } catch (err) {
          console.error("Color extraction failed:", err);
        }
      };
    }

    fetchCoverAndExtractColors();
  }, [song, artist]);

  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(
    `${song} ${artist}`
  )}`;

  // ⚡ ADD: function to download as image
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
    if (!cardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        backgroundColor: "#000",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${song}-${artist}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export card:", err);
    }
  };

  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      // ⚡ ADD: Right-click or normal click triggers download
      onClick={handleDownload}
    >
      <Card
        ref={cardRef} // ⚡ ADD
        className="overflow-hidden text-white backdrop-blur-md border-0 shadow-xl transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
        style={{ background: gradient }}
      >
        <CardContent className="m-1 h-full flex flex-col justify-between">
          <p className="text-2xl italic mb-3 leading-snug text-gray-100 tinos-regular-italic whitespace-pre-line">
            {lyric}
          </p>

          <div className="flex flex-col gap-0">
            <p className="text-md text-gray-300">{song}</p>
            <p className="text-sm text-gray-300">{artist}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
