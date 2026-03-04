import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook for scroll reveals ────────────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ── Data ─────────────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Security Risks",
    body: "Clothes left unattended are vulnerable to being removed or stolen before a wash cycle even ends — with no way to know who accessed the machine.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Long Waiting Times",
    body: "Students walk to the laundry room only to find every machine occupied — wasting time, energy, and leading to repeated unnecessary trips.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    ),
    title: "No Scheduling System",
    body: "There's no way to book a machine in advance or track which ones are free. Everything is first-come, first-served — chaotic and unpredictable.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
    title: "Peak Hour Stress",
    body: "Evenings and weekends turn laundry rooms into conflict zones — machines are hoarded, cycles are left unattended, and frustration builds fast.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Poor Laundry Knowledge",
    body: "Many students damage clothes or machines from misuse — wrong settings, overloading, and mixing incompatible fabrics — due to a lack of guidance.",
  },
];

const SOLUTIONS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3M9.75 7.5h.008v.008H9.75V7.5Zm0 4.5h.008v.008H9.75V12Zm0 4.5h.008v.008H9.75v-.008Z" />
      </svg>
    ),
    title: "Live Machine Status",
    body: "The Nazeef app shows real-time status of every machine — vacant, booked, or in use — so you know exactly what's available before you leave your room.",
    tag: "Real-time",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Advance Booking",
    body: "Reserve a machine before you arrive. A 5-minute booking window holds your slot and automatically releases it if unused — fair and frictionless.",
    tag: "Smart Booking",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
      </svg>
    ),
    title: "QR Lock Access",
    body: "Each machine is secured with a QR lock. Only the resident who booked the machine can unlock it — eliminating unauthorized use and theft entirely.",
    tag: "Secure Access",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: "AI Forgotten Item Alerts",
    body: "AI detects clothes or items left inside a machine after a cycle ends and immediately sends a push notification to the owner's phone.",
    tag: "AI Powered",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Verified Residents Only",
    body: "Only registered dorm residents can log in and access the system — keeping facilities exclusive, safe, and accountable to the community.",
    tag: "Auth Gated",
  },
];

// ── Problem Card ─────────────────────────────────────────────────────────────
const ProblemCard = ({ icon, title, body, index, inView }) => (
  <div
    className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-red-100 bg-white/70 hover:border-red-200 hover:shadow-lg hover:shadow-red-50 transition-all duration-300"
    style={{
      backdropFilter: "blur(8px)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, box-shadow 0.3s ease, border-color 0.3s ease`,
    }}
  >
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-1 pt-0.5">
        <h4 className="text-sm font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {body}
        </p>
      </div>
    </div>
  </div>
);

// ── Solution Card ─────────────────────────────────────────────────────────────
const SolutionCard = ({ icon, title, body, tag, index, inView }) => (
  <div
    className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-blue-100 bg-white/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-300"
    style={{
      backdropFilter: "blur(10px)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${0.2 + index * 0.08}s, transform 0.6s ease ${0.2 + index * 0.08}s, box-shadow 0.3s ease, border-color 0.3s ease`,
    }}
  >
    {/* Top accent line on hover */}
    <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors duration-300 shrink-0">
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {tag}
      </span>
    </div>

    <div className="flex flex-col gap-1">
      <h4 className="text-sm font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {body}
      </p>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function AboutUs() {
  const [problemsRef, problemsInView] = useInView();
  const [solutionsRef, solutionsInView] = useInView();
  const [heroRef, heroInView] = useInView(0.2);

  return (
    <section
      id="aboutus"
      className="relative bg-gradient-to-b from-white via-[#f0f8ff] to-white py-28 px-4 md:px-10 overflow-hidden"
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute top-[10%] right-[-8%] w-[420px] h-[420px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-6%] w-[360px] h-[360px] rounded-full bg-[#add6fd]/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-24">

        {/* ── Section hero ─────────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> About Nazeef
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Why we built{" "}
              <span className="italic font-semibold text-blue-600">Nazeef</span>
            </h2>
          </div>
          <p
            className="text-sm text-slate-400 leading-relaxed max-w-sm md:text-right"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Dormitory laundry is broken. Nazeef is our answer — a smart system built specifically for university residents.
          </p>
        </div>

        {/* ── Problems ─────────────────────────────────────────────────────── */}
        <div ref={problemsRef} className="flex flex-col gap-8">

          {/* Problems header */}
          <div
            className="flex items-center gap-5"
            style={{
              opacity: problemsInView ? 1 : 0,
              transform: problemsInView ? "translateX(0)" : "translateX(-16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  The Problem
                </h3>
                <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  What's wrong with dorm laundry today
                </p>
              </div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
          </div>

          {/* Problems grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map((p, i) => (
              <ProblemCard key={p.title} {...p} index={i} inView={problemsInView} />
            ))}
          </div>
        </div>

        {/* ── Transition bridge ─────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <div className="relative z-10 flex items-center gap-3 bg-white/80 border border-blue-100 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg shadow-blue-50">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Here's how Nazeef solves every one of these
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3b82f6" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* ── Solutions ─────────────────────────────────────────────────────── */}
        <div ref={solutionsRef} className="flex flex-col gap-8">

          {/* Solutions header */}
          <div
            className="flex items-center gap-5"
            style={{
              opacity: solutionsInView ? 1 : 0,
              transform: solutionsInView ? "translateX(0)" : "translateX(-16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Solution
                </h3>
                <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  How Nazeef fixes dorm laundry
                </p>
              </div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
          </div>

          {/* Solutions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOLUTIONS.map((s, i) => (
              <SolutionCard key={s.title} {...s} index={i} inView={solutionsInView} />
            ))}
          </div>
        </div>

        {/* ── Result callout ─────────────────────────────────────────────────── */}
        <div
          className="relative rounded-3xl border border-blue-100 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(219,234,254,0.6) 0%, rgba(255,255,255,0.9) 50%, rgba(219,234,254,0.4) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
          </div>
          <div className="relative px-8 py-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex flex-col gap-2 md:flex-1">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The Result
              </span>
              <h3
                className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Less waiting. No conflicts.{" "}
                <span className="italic font-semibold text-blue-600">Fair laundry for everyone.</span>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Nazeef brings accountability, transparency, and intelligence to a space that has been ignored for decades — the dormitory laundry room.
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              {[
                { val: "5 min", label: "Booking hold" },
                { val: "QR", label: "Secure access" },
                { val: "AI", label: "Smart alerts" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span
                    className="text-2xl font-bold text-blue-600"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.val}
                  </span>
                  <span className="text-[10px] text-slate-400 tracking-widest uppercase text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
