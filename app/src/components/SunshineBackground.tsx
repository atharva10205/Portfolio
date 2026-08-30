"use client";
import { useEffect, useRef } from "react";

export default function SunshineBackground() {
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(".snap-y") ?? window;
    const handleScroll = () => {
      if (!raysRef.current) return;
      const scrollY =
        scrollContainer instanceof Window
          ? window.scrollY
          : (scrollContainer as Element).scrollTop;
      raysRef.current.style.transform = `translateY(-${scrollY * 0.35}px)`;
    };
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const rays = [
    { rotate: 162, width: 420, opacity: 0.45 },
    { rotate: 150, width: 95,  opacity: 0.18 },
    { rotate: 138, width: 380, opacity: 0.42 },
    { rotate: 126, width: 75,  opacity: 0.15 },
    { rotate: 114, width: 320, opacity: 0.38 },
    { rotate: 102, width: 60,  opacity: 0.13 },
    { rotate: 90,  width: 260, opacity: 0.35 },
    { rotate: 78,  width: 50,  opacity: 0.12 },
    { rotate: 65,  width: 190, opacity: 0.30 },
    { rotate: 52,  width: 40,  opacity: 0.10 },
    { rotate: 40,  width: 130, opacity: 0.22 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden", zIndex: 0 }}
    >
      {/* BASE: rich amber-gold top-left → pure white bottom-right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(118deg, #FFB300 0%, #FFCC00 18%, #FFD835 32%, #FFE870 50%, #FFF8CC 68%, #FFFDE8 80%, #ffffff 93%)",
        }}
      />

      {/* Extra depth in upper-left corner to match Daniel's deep gold */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 65% at 15% 10%, #FFAA00 0%, #FFD000 35%, transparent 70%)",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />

      {/* RAYS: bright white/cream beams from upper-right origin */}
      <div
        ref={raysRef}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "200%",
          willChange: "transform",
        }}
      >
        {rays.map(({ rotate, width, opacity }, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-8%",
              left: "65%",
              width: `${width}px`,
              height: "88%",
              marginLeft: `-${width / 2}px`,
              transformOrigin: "top center",
              transform: `rotate(${rotate}deg)`,
              background:
                "linear-gradient(to bottom, rgba(255,255,245,0.98) 0%, rgba(255,255,220,0.75) 20%, rgba(255,252,200,0.3) 55%, transparent 80%)",
              opacity,
            }}
          />
        ))}

        {/* White-hot core glow at origin */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "65%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,1) 0%, rgba(255,245,150,0.85) 25%, rgba(255,220,0,0.4) 50%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(30px)",
            opacity: 1,
          }}
        />

        {/* Inner tight halo */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "65%",
            transform: "translateX(-50%)",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(12px)",
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
}