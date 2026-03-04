import React, { useState, useEffect } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#e8f4fe] via-white to-[#daeffe] flex items-center">

      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#add6fd]/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#bde3ff]/25 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-blue-100/40 blur-[100px] -translate-x-1/2" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Thin horizontal rule accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-24 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT: Copy */}
        <div className="flex flex-col gap-8">

          {/* Eyebrow tag */}
          <div
            className="inline-flex items-center gap-2 self-start"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Industrial Solutions
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            }}
          >
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight text-slate-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Precision
              <br />
              <span className="font-semibold italic text-blue-600">Engineered</span>
              <br />
              <span className="text-slate-500 font-light">Machinery.</span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-base md:text-lg text-slate-500 leading-relaxed max-w-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            High-performance machines built for demanding environments.
            Engineered to last, designed to perform.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            <a
              href="#machines"
              className="group inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore Machines
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-300 underline underline-offset-4 decoration-slate-300 hover:decoration-blue-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get in Touch
            </a>
          </div>
       
        </div>

        {/* RIGHT: Visual card stack */}
        <div
          className="relative flex justify-center items-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
          }}
        >
          {/* Back card */}
          <div className="absolute w-64 h-80 rounded-3xl bg-gradient-to-br from-[#bfdbfe] to-[#93c5fd]/60 border border-white/70 shadow-xl rotate-6 translate-x-6 -translate-y-2 backdrop-blur-sm" />

          {/* Middle card */}
          <div className="absolute w-64 h-80 rounded-3xl bg-white/60 border border-white/80 shadow-lg rotate-2 translate-x-2 backdrop-blur-md" />

          {/* Front card */}
          <div className="relative w-64 h-80 rounded-3xl bg-white/80 border border-white shadow-2xl backdrop-blur-lg flex flex-col justify-between p-6 overflow-hidden">
            {/* Card top gloss */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-3xl" />

            {/* Card header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                    <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 0 0 4.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 0 1-.493.11 3.01 3.01 0 0 1-1.618-1.616.455.455 0 0 1 .11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 0 0-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 1 0 3.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01ZM5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  MX-7 Series
                </span>
              </div>
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* Card center visual */}
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200/60 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Heavy Fabricator</p>
                <p className="text-xs text-slate-400 mt-0.5">Output: 4.2 t/hr</p>
              </div>
            </div>

            {/* Card bottom bar */}
            <div className="z-10">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span>Efficiency</span>
                <span className="font-semibold text-blue-600">97%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div
            className="absolute -bottom-4 -left-4 bg-white/90 border border-blue-100 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-md"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3b82f6" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>ISO Certified</p>
              <p className="text-[10px] text-slate-400">9001:2015</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />

      {/* Float keyframe */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
