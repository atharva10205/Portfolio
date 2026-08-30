"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, GitBranch, Share2, Network } from "lucide-react";

const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "flows", label: "Flows", icon: GitBranch },
    { id: "overallGraph", label: "Overall Graph", icon: Share2 },
    { id: "flowGraphs", label: "Flow Graphs", icon: Network },
];

export default function Clickora() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const [activeSection, setActiveSection] = useState("overview");

    const overviewRef = useRef<HTMLDivElement>(null);
    const flowsRef = useRef<HTMLDivElement>(null);
    const overallGraphRef = useRef<HTMLDivElement>(null);
    const flowGraphsRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null]);

    const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
        overview: overviewRef,
        flows: flowsRef,
        overallGraph: overallGraphRef,
        flowGraphs: flowGraphsRef,
    };

    // Preload gate: wait until every video can play through before revealing the page
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
            });

        Promise.all(videos.map(checkReady)).then(() => {
            if (!cancelled) setLoaded(true);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Scrollspy for the side nav
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);

    const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
        ref.current?.scrollIntoView({ behavior: "smooth" });

    const activeIndex = sections.findIndex((s) => s.id === activeSection);

    return (
        <>
            <div
                className={`fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
            >
                <div className="w-10 h-10 border-2 border-gray-200 dark:border-neutral-700 border-t-[#FF6600] rounded-full animate-spin" />
                <p className="font-apple text-sm font-semibold tracking-wide text-gray-500 dark:text-neutral-400">
                    Loading Clickora {loadedCount}/4
                </p>
            </div>

            {loaded && (
                <button
                    onClick={() => router.push("/")}
                    className="fixed top-4 left-4 z-50 cursor-pointer flex items-center gap-2 border border-gray-300 dark:border-neutral-700 rounded-full px-4 py-2 bg-white dark:bg-neutral-900 text-sm font-semibold text-gray-800 dark:text-neutral-200 hover:text-[#FF6600] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            )}

            {loaded && (
                <div className="fixed top-1/2 rounded-2xl right-4 flex flex-col p-1 -translate-y-1/2 h-fit w-fit gap-4 border border-gray-300 dark:border-neutral-700 z-50 bg-white dark:bg-neutral-900">
                    <div
                        className="absolute w-[calc(100%-8px)] aspect-square rounded-xl bg-[#FF6600] transition-transform duration-200 ease-in-out left-1"
                        style={{ transform: `translateY(calc(${activeIndex} * (100% + 16px)))` }}
                    />
                    {sections.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => scrollTo(sectionRefs[s.id])}
                            className="relative z-10 p-2 cursor-pointer"
                        >
                            <s.icon
                                size={22}
                                className={`transition-colors duration-300 ${activeSection === s.id ? "text-white" : "text-gray-800 dark:text-neutral-300"
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div
                className={`h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-white dark:bg-neutral-950 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
            >
                <section
                    ref={overviewRef}
                    className="snap-start min-h-screen flex flex-col items-center justify-center px-10 py-18 gap-8"
                >
                    <div className="text-center flex flex-col gap-3">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Major Project
                        </span>
                        <h1 className="text-[45px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Clickora
                        </h1>
                        <p className="text-gray-400 dark:text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
                            A decentralized ads marketplace on Solana — advertisers fund campaigns,
                            publishers embed a widget and earn SOL per click.
                        </p>
                        
                           <a href="https://clickora-seven.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-gray-400 dark:text-neutral-500 flex items-center justify-center gap-1 hover:text-[#FF6600] transition-colors duration-200"
                        >
                            Visit live site <span className="text-base">→</span>
                        </a>
                    </div>
                    <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700">
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

                <section
                    ref={flowsRef}
                    className="snap-start h-screen flex flex-col items-center justify-center px-10 py-6 gap-3"
                >
                    <div className="text-center flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            How it works
                        </span>
                        <h2 className="text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Three Core Flows
                        </h2>
                    </div>

                    <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-3 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                    <video
                                        ref={(el) => { videoRefs.current[1] = el; }}
                                        src="/Clickora_Video/Advertiser_Campign.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-56 sm:h-64 md:h-72 w-auto aspect-video object-contain"
                                    />
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                    Advertiser
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                    <video
                                        ref={(el) => { videoRefs.current[2] = el; }}
                                        src="/Clickora_Video/Publisher_Campign.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-56 sm:h-64 md:h-72 w-auto aspect-video object-contain"
                                    />
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase text-center">
                                    Publisher
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 bg-black">
                                <video
                                    ref={(el) => { videoRefs.current[3] = el; }}
                                    src="/Clickora_Video/Withdrawal_Clickora.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-56 sm:h-64 md:h-72 w-auto aspect-video object-contain"
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
                    className="snap-start h-screen flex flex-col items-center justify-center px-10 py-6 gap-4"
                >
                    <div className="text-center flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Architecture
                        </span>
                        <h2 className="text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Overall Workflow
                        </h2>
                    </div>

                    <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-4 flex-1 flex items-center justify-center">
                        <img
                            src="/Clickora_Video/Overall_Graph.png"
                            alt="Clickora overall workflow"
                            className="w-auto h-auto max-h-[calc(100vh-200px)] rounded-xl object-contain"
                        />
                    </div>
                </section>

                <section
                    ref={flowGraphsRef}
                    className="snap-start h-screen flex flex-col items-center justify-center px-10 py-6 gap-4"
                >
                    <div className="text-center flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF6600] uppercase">
                            Architecture
                        </span>
                        <h2 className="text-[36px] font-apple font-semibold tracking-tight text-gray-900 dark:text-neutral-100 leading-none">
                            Advertiser & Publisher Flows
                        </h2>
                    </div>

                    <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-3">
                            <img
                                src="/Clickora_Video/Advertiser_Graph.png"
                                alt="Advertiser workflow"
                                className="w-full h-auto max-h-[calc(100vh-220px)] rounded-xl object-contain"
                            />
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-neutral-700 p-3">
                            <img
                                src="/Clickora_Video/Publisher_Graph.png"
                                alt="Publisher workflow"
                                className="w-full h-auto max-h-[calc(100vh-220px)] rounded-xl object-contain"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}