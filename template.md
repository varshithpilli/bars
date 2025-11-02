# 🎵 Lyric Showcase Webpage

A modern, dark-themed single-page web application to display your favorite lyrics, artists, and songs in an elegant card layout.

---

## 🧭 Overview

The **Lyric Showcase** is a minimalist React-based web page designed to highlight lyrical lines from songs you love.  
Each lyric appears as a **card** featuring:

- 🎧 The lyric text  
- 🎵 Song name  
- 🎤 Artist name  
- 🌆 (Optional) Dynamic background fetched from the song’s album cover  

The layout and design prioritize **aesthetic balance**, **dark mode**, and **smooth modern visuals** using `shadcn/ui`, `TailwindCSS`, and optionally `Framer Motion`.

---

## 🧱 Directory Structure

This project assumes your Vite + React + Tailwind + shadcn setup is complete.

Below is the recommended file layout for the lyric page:

```

src/
├── components/
│    ├── Header.jsx
│    ├── LyricCard.jsx
│    └── index.js
├── data/
│    └── lyrics.js
├── App.jsx
├── main.jsx
└── index.css

````

### Components Description

| File | Description |
|------|--------------|
| **Header.jsx** | A sleek header bar displaying the site title. |
| **LyricCard.jsx** | Reusable lyric card component displaying the lyric, song, artist, and optional album art. |
| **lyrics.js** | A local array storing lyric entries (`lyric`, `song`, `artist`). |
| **App.jsx** | Main layout that organizes header and grid of lyric cards. |

---

## 🌑 Visual & Layout Specification

### 🖤 Theme
- Dark-only mode (no light theme toggle).  
- Background color: `#000000` (pure black) or `bg-neutral-950`.
- Text color: `text-white` and subtle grays for secondary info.
- Cards use **glassmorphism** style with translucent backgrounds.

### 📐 Layout
- The page content (main section) occupies **75% of the viewport width**, centered horizontally.
- Padding and spacing should provide good breathing room.
- Cards can be arranged either:
  - in a **responsive grid**, or  
  - in a **vertical scroll layout with even spacing**,  
  whichever fits the desired aesthetic.

Example Tailwind layout:
```html
<main className="mx-auto w-3/4 min-h-screen p-8 bg-black text-white">
  <!-- header -->
  <!-- lyric cards grid -->
</main>
````

### 🧩 Card Design

Each card:

* Uses `shadcn/ui` `Card` component.
* Has a **square aspect ratio** (1:1).
* Has a **gradient background** using the dominant color extracted from the album art.
* Displays the lyric prominently in italics.
* Song and artist details appear subtly below the lyric.

#### Tailwind Style Notes

```html
<Card className="overflow-hidden text-white backdrop-blur-sm border-0 shadow-xl transition-transform hover:scale-[1.02] aspect-square">
  <CardContent className="p-6 h-full flex flex-col justify-between">
    <p className="text-xl italic mb-3">"Sample lyric line here."</p>
    <p className="text-sm text-gray-300">— Artist, <em>Song</em></p>
  </CardContent>
</Card>
```

---

## 🌆 Album Art Color Extraction

Instead of using the album cover image directly, the `LyricCard` component:
1. Fetches the album cover via iTunes API
2. Extracts the dominant color using HTML5 Canvas
3. Creates a gradient background using the extracted color
4. Darkens the color for better text contrast

This provides a themed aesthetic while maintaining readability.

---

## 🧠 Component Details

### `Header.jsx`

A minimal, centered title.

```jsx
export default function Header() {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-4xl font-semibold text-white">Lyrics I Love 🎧</h1>
      <p className="text-gray-400 mt-2 text-sm">A collection of words that linger</p>
    </header>
  );
}
```

---

### `LyricCard.jsx`

Fetches album art and displays the lyric card.

```jsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function LyricCard({ lyric, song, artist }) {
  const [cover, setCover] = useState(null);
  const [dominantColor, setDominantColor] = useState("#000");

  useEffect(() => {
    async function fetchCover() {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(song + " " + artist)}&entity=song&limit=1`
      );
      const data = await res.json();
      if (data.results?.[0]?.artworkUrl100) {
        const imageUrl = data.results[0].artworkUrl100.replace("100x100", "600x600");
        setCover(imageUrl);

        // Create an image element to extract color
        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          // Draw the image on a canvas to extract color
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Get the dominant color (this is a simplified approach)
          const colorData = ctx.getImageData(0, 0, img.width, img.height).data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < colorData.length; i += 4) {
            r += colorData[i];
            g += colorData[i + 1];
            b += colorData[i + 2];
          }
          r = Math.floor(r / (colorData.length / 4));
          g = Math.floor(g / (colorData.length / 4));
          b = Math.floor(b / (colorData.length / 4));
          setDominantColor(`rgb(${r}, ${g}, ${b})`);
        };
      }
    }
    fetchCover();
  }, [song, artist]);

  return (
    <Card
      className="overflow-hidden text-white backdrop-blur-sm border-0 shadow-xl"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), ${dominantColor}`,
      }}
    >
      <div className="backdrop-blur-lg bg-black/60 p-6 h-full flex flex-col justify-between">
        <CardContent>
          <p className="text-xl italic mb-3">“{lyric}”</p>
          <p className="text-sm text-gray-300">
            — {artist}, <em>{song}</em>
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
```

---

### `lyrics.js`

Contains your lyric collection.

```js
export const lyrics = [
  {
    lyric: "And in the end, the love you take is equal to the love you make.",
    song: "The End",
    artist: "The Beatles",
  },
  {
    lyric: "We’re just two lost souls swimming in a fishbowl, year after year.",
    song: "Wish You Were Here",
    artist: "Pink Floyd",
  },
  {
    lyric: "I’m off the deep end, watch as I dive in.",
    song: "Shallow",
    artist: "Lady Gaga",
  },
];
```

---

### `App.jsx`

The main page layout.

```jsx
import Header from "./components/Header";
import LyricCard from "./components/LyricCard";
import { lyrics } from "./data/lyrics";

export default function App() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center">
      <div className="w-3/4 py-10">
        <Header />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lyrics.map((item, i) => (
            <LyricCard key={i} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

---

## ✨ Optional Enhancements

* Add **Framer Motion** for fade-in transitions:

  ```bash
  npm install framer-motion
  ```

  ```jsx
  import { motion } from "framer-motion";
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <LyricCard ... />
  </motion.div>
  ```

* Add **search** or **filter** by artist or song.

* Use **Vibrant.js** or **color-thief** to extract dominant color from album art and theme each card dynamically.

---

## 🪞 Final Look

A sleek, dark web page where:

* The title and tagline sit centered at the top.
* Below, a balanced set of lyric cards appear in a grid.
* Each card highlights a memorable lyric with ambient color from its album art.
* The design stays minimalist, immersive, and personal.

---

> **In short:**
> *A modern, dark lyric wall — personal, aesthetic, and dynamic.*
> Perfect for showcasing your favorite fragments of music and emotion.
