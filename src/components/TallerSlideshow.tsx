"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const fotos = ["/taller-foto-1.jpg", "/taller-foto-2.jpg", "/taller-foto-3.jpg"];

export default function TallerSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % fotos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
      {fotos.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={src}
            alt={`Taller corporativo ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
