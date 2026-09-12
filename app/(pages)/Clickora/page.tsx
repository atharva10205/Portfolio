"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, GitBranch, Share2, Megaphone, Users } from "lucide-react";

const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "flows", label: "Flows", icon: GitBranch },
    { id: "overallGraph", label: "Overall Graph", icon: Share2 },
    { id: "advertiserGraph", label: "Advertiser Graph", icon: Megaphone },
    { id: "publisherGraph", label: "Publisher Graph", icon: Users },
];

export default function Clickora() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const [activeSection, setActiveSection] = useState("overview");

    const overviewRef = useRef<HTMLDivElement>(null);
    const flowsRef = useRef<HTMLDivElement>(null);
    const overallGraphRef = useRef<HTMLDivElement>(null);
    const advertiserGraphRef = useRef<HTMLDivElement>(null);
    const publisherGraphRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null]);

    const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        overview: overviewRef,
        flows: flowsRef,
        overallGraph: overallGraphRef,
        advertiserGraph: advertiserGraphRef,
        publisherGraph: publisherGraphRef,
    };

    useEffect(() => {
        let cancelled = false;
        const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
        if (videos.length === 0) return;

        const checkReady = (video: HTMLVideoElement) =>
            new Promise<void>((resolve) => {
                if (video.readyState >= 3) {
                    setLoadedCount((c) => c + 1);
                    resolve();
                    return;
                }
                const onReady = () => {
                    video.removeEventListener("canplaythrough", onReady);
                    setLoadedCount((c) => c + 1);
                    resolve();
                };
                video.addEventListener("canplaythrough", onReady);
                const onError = () => {
                    video.removeEventListener("error", onError);
                    setLoadedCount((c) => c + 1);
                    resolve();
                };
                video.addEventListener("error", onError);
            });

        Promise.all(videos.map(checkReady)).then(() => {
            if (!cancelled) setLoaded(true);
        });

        const timeout = setTimeout(() => {
            if (!cancelled) setLoaded(true);
        }, 8000);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Object.keys(sectionRefs).find(
                            (key) => sectionRefs[key].current === entry.target
                        );
                        if (id) setActiveSection(id);
                    }
                });
            },
            { threshold: 0.4 }
        );
        Object.values(sectionRefs).forEach((ref) => ref.current && observer.observe(ref.current));
        return () => observer.disconnect();
    }, [loaded]);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
        ref.current?.scrollIntoView({ behavior: "smooth" });

    const activeIndex = sections.findIndex((s) => s.id === activeSection);

    return (
        <>
            <div
                className={`fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
            >
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-200 dark:border-neutral-700 border-t-[#FF6600] rounded-full animate-spin" />
                <p className="font-apple text-xs sm:text-sm font-semibold tracking-wide text-gray-500 dark:text-neutral-400">
                    Loading Clickora {loadedCount}/4
                </p>
            </div>

            {loaded && (
                <button
                    onClick={() => router.push("/")}
                    className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 cursor-pointer flex items-center gap-1.5 sm:gap-2 border border-gray-300 dark:border-neutral-700 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-xs sm:text-sm font-semibold text-gray-800 dark:text-neutral-200 hover:text-[#FF6600] transition-colors"
                >
                    <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Back</span>
                </button>
            )}

            {loaded && (
                <div className="fixed hidden md:flex md:right-4 md:top-1/2 md:-translate-y-1/2 md:flex-col rounded-2xl p-1 h-fit w-fit gap-4 border border-gray-300 dark:border-neutral-700 z-50 bg-white dark:bg-neutral-900">
                    <div
                        className="nav-highlight-desktop absolute aspect-square rounded-xl bg-[#FF6600] transition-transform duration-200 ease-in-out top-1 left-1 h-auto w-[calc(100%-8px)]"
                        style={{ "--active-index": activeIndex } as React.CSSProperties}
                    />
                    {sections.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => scrollTo(sectionRefs[s.id])}
                            className="relative z-10 p-2 cursor-pointer"
                        >
                            <s.icon
                                className={`w-[22px] h-[22px] transition-colors duration-300 ${activeSection === s.id ? "text-white" : "text-gray-800 dark:text-neutral-300"
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            )}

            <style jsx global>{`
                .nav-highlight-desktop {
                    transform: translateY(calc(var(--active-index) * (100% + 16px)));
                }
            `}</style>

            <div
                className={`h-[100dvh] overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-white dark:bg-neutral-950 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
            >
                <section
                    ref={overviewRef}
                    className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-16 sm:py-14 md:py-18 gap-4 sm:gap-6 md:gap-8"
                >
                    <div className="text-center flex flex-col gap-2 sm:gap-3">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Major Project
                        </span>
                        <h1 className="text-[26px] xs:text-[30px] sm:text-[38px] md:text-[45px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Clickora
                        </h1>
                        <p className="text-gray-400 dark:text-neutral-500 text-xs sm:text-sm max-w-[280px] sm:max-w-md mx-auto leading-relaxed px-2 sm:px-0">
                            A decentralized ads marketplace on Solana — advertisers fund campaigns,
                            publishers embed a widget and earn SOL per click.
                        </p>

                        <a href="https://clickora-seven.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-neutral-500 flex items-center justify-center gap-1 hover:text-[#FF6600] transition-colors duration-200"
                        >
                            Visit live site <span className="text-base">→</span>
                        </a>
                    </div>
                    <div className="w-full max-w-[92vw] sm:max-w-2xl md:max-w-4xl rounded-xl sm:rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700">
                        <video
                            ref={(el) => { videoRefs.current[0] = el; }}
                            src="/Clickora_Video/Overall_Clickora.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto"
                        />
                    </div>
                </section>

                <section className="snap-start h-[100dvh] max-h-[100dvh] overflow-hidden flex sm:hidden flex-col items-center px-3 pt-16 pb-3 gap-2">
                    <div className="text-center shrink-0 flex flex-col gap-1">
                        <span className="text-[9px] font-bold tracking-widest text-[#FF6600] uppercase">
                            How it works
                        </span>
                        <h2 className="text-[20px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Three Core Flows
                        </h2>
                    </div>

                    <div className="w-full flex-1 min-h-0 flex flex-col gap-2">
                        <div className="flex-1 min-h-0 flex flex-col gap-1 items-center justify-center">
                            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                                <video
                                    ref={(el) => { videoRefs.current[1] = el; }}
                                    src="/Clickora_Video/Advertiser_Campign.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="max-w-full max-h-full h-full w-auto aspect-video object-cover rounded-xl border border-gray-300 dark:border-neutral-700"
                                />
                            </div>
                            <span className="shrink-0 text-[9px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                Advertiser
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col gap-1 items-center justify-center">
                            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                                <video
                                    ref={(el) => { videoRefs.current[2] = el; }}
                                    src="/Clickora_Video/Publisher_Campign.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="max-w-full max-h-full h-full w-auto aspect-video object-cover rounded-xl border border-gray-300 dark:border-neutral-700"
                                />
                            </div>
                            <span className="shrink-0 text-[9px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                Publisher
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col gap-1 items-center justify-center">
                            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                                <video
                                    ref={(el) => { videoRefs.current[3] = el; }}
                                    src="/Clickora_Video/Withdrawal_Clickora.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="max-w-full max-h-full h-full w-auto aspect-video object-cover rounded-xl border border-gray-300 dark:border-neutral-700"
                                />
                            </div>
                            <span className="shrink-0 text-[9px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                Withdrawal
                            </span>
                        </div>
                    </div>
                </section>

                <section
                    ref={flowsRef}
                    className="snap-start h-dvh hidden sm:flex flex-col items-center justify-center px-6 md:px-10 py-6 gap-3"
                >
                    <div className="text-center mt-4 flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            How it works
                        </span>
                        <h2 className="text-[32px] md:text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Three Core Flows
                        </h2>
                    </div>

                    <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-3 flex-1 px-2">
                        <div className="flex flex-row items-center gap-3 w-auto">
                            <div className="flex flex-col gap-2 w-auto">
                                <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                    <video
                                        src="/Clickora_Video/Advertiser_Campign.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-64 md:h-72 w-auto aspect-video object-contain mx-auto"
                                    />
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                    Advertiser
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 w-auto">
                                <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                    <video
                                        src="/Clickora_Video/Publisher_Campign.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-64 md:h-72 w-auto aspect-video object-contain mx-auto"
                                    />
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                    Publisher
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-auto">
                            <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                <video
                                    src="/Clickora_Video/Withdrawal_Clickora.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-64 md:h-72 w-auto aspect-video object-contain mx-auto"
                                />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                Withdrawal
                            </span>
                        </div>
                    </div>
                </section>

                <section
                    ref={overallGraphRef}
                    className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-6 md:px-10 py-16 sm:py-6 gap-3 sm:gap-4"
                >
                    <div className="text-center flex flex-col gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Architecture
                        </span>
                        <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Overall Workflow
                        </h2>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center px-1 sm:px-2 min-h-0">
                        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-2 sm:p-4 bg-white dark:bg-neutral-900 max-w-full max-h-full">
                            <img
                                src="/Clickora_Video/Overall_Graph.png"
                                alt="Clickora overall workflow"
                                className="w-auto h-auto max-h-[55dvh] sm:max-h-[65dvh] max-w-full rounded-lg sm:rounded-xl object-contain mx-auto"
                            />
                        </div>
                    </div>
                </section>

                <section
                    ref={advertiserGraphRef}
                    className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-6 md:px-10 py-16 sm:py-6 gap-3 sm:gap-4"
                >
                    <div className="text-center flex flex-col gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Architecture
                        </span>
                        <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Advertiser Flow
                        </h2>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center px-1 sm:px-2 min-h-0">
                        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-2 sm:p-4 bg-white dark:bg-neutral-900 max-w-full max-h-full">
                            <img
                                src="/Clickora_Video/Advertiser_Graph.png"
                                alt="Advertiser workflow"
                                className="w-auto h-auto max-h-[55dvh] sm:max-h-[65dvh] max-w-full rounded-lg sm:rounded-xl object-contain mx-auto"
                            />
                        </div>
                    </div>
                </section>

                <section
                    ref={publisherGraphRef}
                    className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-6 md:px-10 py-16 sm:py-6 gap-3 sm:gap-4"
                >
                    <div className="text-center flex flex-col gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Architecture
                        </span>
                        <h2 className="text-[24px] sm:text-[32px] md:text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Publisher Flow
                        </h2>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center px-1 sm:px-2 min-h-0">
                        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-2 sm:p-4 bg-white dark:bg-neutral-900 max-w-full max-h-full">
                            <img
                                src="/Clickora_Video/Publisher_Graph.png"
                                alt="Publisher workflow"
                                className="w-auto h-auto max-h-[55dvh] sm:max-h-[65dvh] max-w-full rounded-lg sm:rounded-xl object-contain mx-auto"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}