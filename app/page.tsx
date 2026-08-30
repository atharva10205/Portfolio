"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import localFont from "next/font/local";
import IntroLoader from "../app/src/components/IntroLoader";
import GitHubChart from "./src/components/GitHubChart";
import MinecraftGitChart from "./src/components/MinecraftGitChart";
import Image from "next/image";
import LiveClock from "./src/components/LiveClock";
import { FolderKanban, Home, User, Volume2, VolumeX, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const minecraftFont = localFont({
  src: "../public/Minecraftia-Regular.ttf",
  variable: "--font-minecraft",
});

export default function Home_() {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntroLoader, setShowIntroLoader] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    const visited = sessionStorage.getItem("introShown");
    if (visited) {
      setIntroComplete(true);
      setShowIntroLoader(false);
    } else {
      setShowIntroLoader(true);
    }
  }, []);

  const [muted, setMuted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [flipping, setFlipping] = useState(false);
  const [rotated, setRotated] = useState(false);
  const cols = 30, rows = 30;

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    clickSoundRef.current = new Audio("/Click_Sound.mp3");
    bgMusicRef.current = new Audio("/BG_music.mp3");
    bgMusicRef.current.loop = true;
  }, []);

  const toggleMute = () => {
    clickSoundRef.current?.play().catch(() => { });
    setMuted((m) => {
      const next = !m;
      if (bgMusicRef.current) {
        if (next) {
          bgMusicRef.current.pause();
        } else {
          bgMusicRef.current.play().catch(() => { });
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const music = bgMusicRef.current;
    if (!music) return;

    if (flipping) {
      music.currentTime = 0;
      music.play().catch(() => { });
    } else {
      music.pause();
      music.currentTime = 0;
    }
  }, [flipping]);

  const triggerFlip = () => {
    clickSoundRef.current?.play().catch(() => { });
    setRotated(true);
    setTimeout(() => setRotated(false), 200);

    document.body.classList.remove("pickaxe-cursor");
    document.body.classList.add("pickaxe-cursor-swing");
    setTimeout(() => {
      document.body.classList.remove("pickaxe-cursor-swing");
      document.body.classList.add("pickaxe-cursor");
    }, 150);

    setFlipping(true);
  };

  const swingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!flipping) {
      if (swingTimeoutRef.current) clearTimeout(swingTimeoutRef.current);
      document.body.classList.remove("pickaxe-cursor", "pickaxe-cursor-swing");
      return;
    }

    const handleDown = () => {
      if (swingTimeoutRef.current) clearTimeout(swingTimeoutRef.current);
      document.body.classList.add("pickaxe-cursor-swing");
      document.body.classList.remove("pickaxe-cursor");
      swingTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove("pickaxe-cursor-swing");
        document.body.classList.add("pickaxe-cursor");
      }, 150);
    };

    window.addEventListener("mousedown", handleDown);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      if (swingTimeoutRef.current) clearTimeout(swingTimeoutRef.current);
      document.body.classList.remove("pickaxe-cursor-swing");
    };
  }, [flipping]);

  const homeRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = [
      { ref: homeRef, id: "home" },
      { ref: projectsRef, id: "projects" },
      { ref: aboutRef, id: "about" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.ref.current === entry.target);
            if (match) {
              setActiveSection(match.id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => {
      if (s.ref.current) {
        observer.observe(s.ref.current);
      }
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("introShown", "true");
    setIntroComplete(true);
  }, []);
 const regularProjects = [
  { title: "Property Marketplace", desc: "HomiFi is a rental property app built with Next.js, Prisma, and Neon, using NextAuth,Upstash Redis to cache .", tag: "Homify", img: "Homify_img_1.png", video: "/Homify_Video.mp4" },
  { title: "Image sharing Platform", desc: "PixVault is a Pinterest-inspired image sharing platform where users can upload, organize, discover, and save high-quality images .", tag: "PixVault", img: "PixVault.png", video: "/Pixvault_video.mp4" },
  { title: "Fastify Backend Optimized", desc: "Benchmark pitting a Fastify server against a hand-tuned raw Node http server to isolate framework overhead.", tag: "Fastify", icon: true, link: "https://github.com/atharva10205/Fastify-Backend-Optimized" },
  
  { title: "Anchor AMM", desc: "Automated market maker built on Solana with the Anchor framework, handling swaps, liquidity pools, and pricing on-chain.", tag: "AMM", icon: true, link: "https://github.com/atharva10205/Anchor-AMM" },
];

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <>
      {showIntroLoader && <IntroLoader onComplete={handleIntroComplete} />}

      {introComplete && (
        <div className="fixed top-1/2 rounded-2xl right-4 flex flex-col p-1 -translate-y-1/2 h-fit w-fit gap-4 border border-gray-300 dark:border-neutral-700 z-50">
          <div
            className="absolute w-[calc(100%-8px)] aspect-square rounded-xl bg-[#FF6600] transition-transform duration-200 ease-in-out left-1"
            style={{
              transform: `translateY(calc(${activeSection === "home" ? 0 : activeSection === "projects" ? 1 : 2
                } * (100% + 16px)))`,
            }}
          />

          <div onClick={() => scrollTo(homeRef)} className="relative z-10 p-2 cursor-pointer">
            <Home size={24} className={`transition-colors duration-300 ${activeSection === "home" ? "text-white" : "text-gray-800 dark:text-neutral-300"}`} />
          </div>

          <div onClick={() => scrollTo(projectsRef)} className="relative z-10 p-2 cursor-pointer">
            <FolderKanban size={24} className={`transition-colors duration-300 ${activeSection === "projects" ? "text-white" : "text-gray-800 dark:text-neutral-300"}`} />
          </div>

          <div onClick={() => scrollTo(aboutRef)} className="relative z-10 p-2 cursor-pointer">
            <User size={24} className={`transition-colors duration-300 ${activeSection === "about" ? "text-white" : "text-gray-800 dark:text-neutral-300"}`} />
          </div>
        </div>
      )}

      <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
        <main
  ref={homeRef}
  className={`
    relative snap-start
    min-h-screen w-full flex items-center justify-center
    bg-white dark:bg-neutral-950
    font-apple
    text-[#111] dark:text-neutral-100
    overflow-hidden
    transition-opacity duration-[600ms] ease-in delay-[100ms]
    ${introComplete ? "opacity-100" : "opacity-0"}
  `}
>
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#FF660008_0%,transparent_60%),radial-gradient(ellipse_at_70%_80%,#FF660005_0%,transparent_50%)] dark:hidden" />


         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FF6600]/6 rounded-full blur-[180px] pointer-events-none dark:hidden" />


          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF6600]/4 rounded-full blur-[140px] pointer-events-none dark:hidden" />

          <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6600] animate-pulse shrink-0" />
              <LiveClock />
            </div>
            <div className="flex items-center gap-0.5 px-1 py-1 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-800/40 shadow-sm">
              <button
                onClick={triggerFlip}
                className="p-1.5 rounded-full text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all hover:bg-gray-100/80 dark:hover:bg-neutral-800/80"
              >
                <Image
                  className="rounded-[4px] transition-transform duration-300"
                  style={{ transform: rotated ? "rotate(45deg)" : "rotate(0deg)" }}
                  src="/creeper.jpg"
                  width={16}
                  height={16}
                  alt={muted ? "Unmute" : "Mute"}
                />
              </button>
              <span className="w-px h-4 bg-gray-200/50 dark:bg-neutral-700/50" />
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-1.5 rounded-full text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all hover:bg-gray-100/80 dark:hover:bg-neutral-800/80"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-6xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">

            <div className="flex flex-col gap-6 py-6">

              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF6600] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6600]" />
                </span>
                <span className="text-[9px] font-medium tracking-[0.25em] text-gray-400 dark:text-neutral-500 uppercase">
                  Available for work
                </span>
              </div>

              <h1 className="text-[3.2rem] md:text-[4.5rem] lg:text-[5rem] font-bold tracking-tight leading-[1.06]">
                Atharva{" "}
              </h1>

              <div className="flex items-center flex-wrap gap-3 text-base md:text-lg text-gray-500 dark:text-neutral-400">
                <span className="font-medium">FullStack Developer</span>
                <span className="flex items-center gap-2 font-medium">
                  <svg width="18" height="18" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <defs>
                      <linearGradient id="solOrange" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF6600" />
                        <stop offset="100%" stopColor="#FF9A00" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#solOrange)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                    <path fill="url(#solOrange)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                    <path fill="url(#solOrange)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                  </svg>
                  Solana Engineer
                </span>
              </div>

              <a
                href="mailto:atharvapandhare3@gmail.com"
                className="group flex items-center gap-2.5 w-fit text-sm text-gray-400 dark:text-neutral-500 hover:text-[#FF6600] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="border-b border-transparent group-hover:border-[#FF6600]/30 transition-all duration-300">
                  atharvapandhare3@gmail.com
                </span>
              </a>

              <div className="flex flex-wrap gap-2 pt-1">
                {["Anchor", "Next.js", "Node.js", "AWS", "Docker"].map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-neutral-400 bg-gray-100/60 dark:bg-neutral-800/40 rounded-full px-3.5 py-1.5 transition-all hover:text-[#FF6600] hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                  >
                    {tech === "Anchor" && <Image src="/icons/anchor.jpg" width={14} height={14} alt="Anchor" />}
                    {tech === "Next.js" && <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width={14} height={14} />}
                    {tech === "Node.js" && <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width={14} height={14} />}
                    {tech === "AWS" && <Image src="/icons/aws-logo-white.jpg" width={14} height={14} alt="aws-logo-white" />}
                    {tech === "Docker" && <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width={14} height={14} />}
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://cal.com/atharva-pandhare-6fau9d/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF6600] text-white text-sm font-medium rounded-full px-7 py-2.5 hover:bg-[#e65c00] transition-all hover:shadow-lg hover:shadow-[#FF6600]/30 active:scale-95"
                >
                  Book a call
                </a>
                <a
                  href="/Atharva_Pandhare_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 text-sm font-medium rounded-full px-7 py-2.5 hover:text-[#FF6600] hover:border-[#FF6600] transition-all"
                >
                  Resume
                </a>

                <div className="flex items-center gap-3 ml-1">
                  <a
                    href="https://github.com/atharva10205"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 dark:text-neutral-500 hover:text-[#FF6600] transition-all hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/AtharvaPandhar4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 dark:text-neutral-500 hover:text-[#FF6600] transition-all hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative flex justify-end">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-2 bg-[#FF6600]/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative border border-gray-200/60 dark:border-neutral-800/60 rounded-2xl p-6 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1.5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] font-medium tracking-[0.18em] text-gray-400 dark:text-neutral-500 uppercase">
                      Contribution Activity
                    </p>
                    <span className="text-[8px] font-medium text-gray-400 dark:text-neutral-500 bg-gray-100/70 dark:bg-neutral-800/50 px-2.5 py-0.5 rounded-full">
                      GitHub
                    </span>
                  </div>
                  <GitHubChart
                    username="atharva10205"
                    token={process.env.NEXT_PUBLIC_GITHUB_TOKEN}
                    colour="orange"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/10 to-transparent dark:hidden" />
        </main>

        <section ref={projectsRef} className="snap-start h-screen bg-white dark:bg-neutral-950 flex flex-col items-center pt-20 px-10 overflow-hidden">
          <a href="" className="text-[45px] font-semibold tracking-tight text-[#FF6600] leading-none mb-10">
            Projects
          </a>

          <div className="w-full max-w-5xl flex flex-col gap-10">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 dark:text-neutral-500 uppercase mb-3">
                Major Project
              </p>

              <div className="flex gap-7 items-center group cursor-pointer">
                <div className="w-[420px] h-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <video
                    ref={(el) => {
                      videoRefs.current[0] = el;
                    }}
                    src="/Clickora_Video/Overall_Clickora.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                    Clickora
                  </span>
                  <h2 className="text-gray-900 dark:text-neutral-100 text-3xl font-semibold leading-tight">
                    Decentralised Ads Marketplace
                  </h2>
                  <p className="text-gray-400 dark:text-neutral-500 text-sm leading-relaxed max-w-xs">
                    Clickora is a decentralized application (dApp) that lets users earn SOL from ad clicks, or host and fund their own ad campaigns using SOL.
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span onClick={() => router.push("/Clickora")} className="text-xs font-medium text-gray-400 dark:text-neutral-500 flex items-center gap-1 group-hover:text-[#FF6600] transition-colors duration-200">
                      More details <span className="text-base">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 dark:text-neutral-500 uppercase mb-3">
                Other Projects
              </p>

              <div className="grid grid-cols-2 gap-8">
                {regularProjects.map((p) => (
  <div
    key={p.title}
    onClick={() => {
      if (p.tag === "Homify") {
        window.open("https://homifi-henna.vercel.app/home", "_blank");
      } else if (p.tag === "PixVault") {
        window.open("https://pixvault-np0u.onrender.com/Home", "_blank");
      } else if (p.link) {
        window.open(p.link, "_blank");
      }
    }}
    className="flex gap-4 items-center group cursor-pointer"
  >
    <div className="w-50 h-32 rounded-xl overflow-hidden flex-shrink-0">
      {p.icon ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF6600]/15 to-[#FF6600]/5 dark:from-[#FF6600]/20 dark:to-neutral-900 transition-transform duration-500 group-hover:scale-105">
          <Code2 size={36} strokeWidth={1.75} className="text-[#FF6600]" />
        </div>
      ) : p.video ? (
        <video
          src={p.video}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <img
          src={p.img}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                        {p.tag}
                      </span>
                      <h3 className="text-gray-900 dark:text-neutral-100 text-base font-semibold leading-tight group-hover:text-[#FF6600] transition-colors duration-200">
                        {p.title}
                      </h3>
                      <p className="text-gray-400 dark:text-neutral-500 text-xs leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={aboutRef} className="snap-start h-screen relative bg-white dark:bg-neutral-950 flex flex-col items-center justify-center px-10 py-20 gap-8">
          <a
            className="text-[45px] absolute left-1/2 -translate-x-1/2 top-8 font-apple font-semibold tracking-tight antialiased text-[#FF6600]"
            href=""
          >
            About
          </a>

          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center justify-center">
           

            <div className="flex flex-col gap-5 text-center md:text-left">
              <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed max-w-lg">
                I&apos;m a final-year IIoT engineering student who builds full-stack
                and web3 products end to end — from smart contracts on Solana to
                the frontend that ships them. I like taking projects from idea to
                a live, working product rather than just a prototype.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-1.5">
                  Final-year IIoT student
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-1.5">
                  Full-Stack & Web3 Dev
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-1.5">
                  Open to opportunities
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
                <a
                  href="https://cal.com/atharva-pandhare-6fau9d/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#FF6600] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#e65c00] transition-colors"
                >
                  Book a call
                </a>

                <a
                  href="/Atharva_Pandhare_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 text-sm font-semibold rounded-full px-5 py-2.5 hover:text-[#FF6600] hover:border-[#FF6600] transition-colors"
                >
                  Download resume
                </a>

                <a
                  href="mailto:atharvapandhare3@gmail.com"
                  className="flex items-center gap-2 border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 text-sm font-semibold rounded-full px-5 py-2.5 hover:text-[#FF6600] hover:border-[#FF6600] transition-colors"
                >
                  Email me
                </a>
              </div>


            </div>
          </div>
        </section>
      </div>

      {flipping && (
        <>
          {(() => {
            const w = window.innerWidth, h = window.innerHeight;
            return (
              <>
                <div
                  className="fixed inset-0 z-[999] grid"
                  style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
                >
                  {Array.from({ length: cols * rows }).map((_, i) => {
                    const r = Math.floor(i / cols), c = i % cols;
                    const dist = (cols - 1 - c) + r;
                    return (
                      <div key={i} className="tile-flip" style={{ animationDelay: `${dist * 30}ms` }}>
                        <div
                          className="tile-back"
                          style={{
                            "--bg-w": `${w}px`,
                            "--bg-h": `${h}px`,
                            "--bg-x": `-${c * (w / cols)}px`,
                            "--bg-y": `-${r * (h / rows)}px`,
                          } as React.CSSProperties}
                        />
                      </div>
                    );
                  })}
                </div>

                <div
                  className={`fixed inset-0 z-[1000] pointer-events-auto ${minecraftFont.className}`}
                  style={{
                    opacity: 0,
                    animation: `contentFadeIn 0.5s ease forwards`,
                    animationDelay: `${(cols + rows) * 30}ms`,
                  }}
                >
                  <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover -z-10">
                    <source src="/backgrounde.mp4" type="video/mp4" />
                  </video>

                  <div className="flex items-center justify-end px-4 pt-4">
                    <LiveClock />
                    <div className="flex items-center border rounded-[5px] border-white/40 mt-3 p-2 gap-4 bg-black/20 backdrop-blur-sm">
                      <button
                        onClick={() => setFlipping(false)}
                        className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        <Image className="rounded-[5px]" src="/creeper.jpg" width={20} height={20} alt="Flip back" />
                      </button>

                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        {muted ? <VolumeX size={20} strokeWidth={2} /> : <Volume2 size={20} strokeWidth={2} />}
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-4 flex p-6 flex-row border-black rounded-lg w-[70vw] h-[25vw] bg-[url('/WoodPlank.JPG')] bg-cover bg-center backdrop-blur-sm">
                    <div className="flex w-[240px] border border-black h-auto rounded-lg overflow-hidden">
                      <Image
                        src="/Minecraft_me.PNG"
                        alt="Atharva Pandhare"
                        width={240}
                        height={240}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex font-apple font-semibold tracking-tight antialiased p-5 gap-3 flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="text-[#00000] text-3xl">Atharva Pandhare</div>
                        <div className="flex items-center border rounded-full border-gray-300 p-2 gap-4">
                          <a href="https://github.com/atharva10205" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                          <a href="https://x.com/AtharvaPandhar4" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <div className="text-lg text-white rounded-lg flex items-center gap-2">FullStack Dev & Solana Engineer</div>

                      <div className="rounded-lg cursor-pointer text-2xl">
                        <a href="mailto:atharvapandhare3@gmail.com" className="group text-xl flex items-center gap-2 text-white transition-colors w-fit">
                          atharvapandhare3@gmail.com
                        </a>
                      </div>

                      <div className="rounded-lg text-2xl">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-300 rounded-lg px-2 py-1">
                            <Image src="/icons/anchor.jpg" width={24} height={24} alt="Anchor" />
                            Anchor
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-300 rounded-lg px-2 py-1">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width={18} height={18} />
                            Next.js
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-300 rounded-lg px-2 py-1">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width={18} height={18} />
                            Node.js
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-300 rounded-lg px-2 py-1">
                            <Image src="/icons/aws-logo-white.jpg" width={24} height={24} alt="aws-logo-white" />
                            AWS
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 border border-gray-300 rounded-lg px-2 py-1">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width={18} height={18} />
                            Docker
                          </div>
                        </div>
                      </div>

                      <MinecraftGitChart
                        username="atharva10205"
                        token={process.env.NEXT_PUBLIC_GITHUB_TOKEN}
                        colour="black"
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </>
      )}
    </>
  );
}