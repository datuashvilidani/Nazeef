import { useState } from "react";

const LINKS = {
  Product: [
    { label: "Live Machines", href: "#machines" },
    { label: "Book a Slot", href: "#machines" },
    { label: "QR Lock Access", href: "#aboutus" },
    { label: "AI Alerts", href: "#aboutus" },
  ],
  Company: [
    { label: "About Nazeef", href: "#aboutus" },
    { label: "How It Works", href: "#aboutus" },
    { label: "Contact Us", href: "#contact" },
    { label: "Support", href: "#contact" },
  ],
  Residents: [
    { label: "Sign In", href: "#" },
    { label: "Register", href: "#" },
    { label: "My Bookings", href: "#machines" },
    { label: "Report an Issue", href: "#contact" },
  ],
};

const STATS = [
  { val: "3", label: "Laundry Blocks" },
  { val: "24", label: "Machines" },
  { val: "5 min", label: "Booking Hold" },
  { val: "AI", label: "Smart Alerts" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-b from-white to-[#f0f8ff] border-t border-blue-100 overflow-hidden">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute bottom-0 left-[-6%] w-[320px] h-[320px] rounded-full bg-blue-100/30 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-[-4%] w-[280px] h-[280px] rounded-full bg-[#add6fd]/20 blur-[90px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">

        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-blue-100/60 border-x border-blue-100/60">
          {STATS.map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-6 bg-white/70 backdrop-blur-sm">
              <span
                className="text-2xl font-bold text-blue-600"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {val}
              </span>
              <span
                className="text-[11px] text-slate-400 tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main footer body ───────────────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span
                className="text-2xl font-light italic text-slate-800 tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Nazeef<span className="text-blue-600 font-semibold">.</span>
              </span>
              <p
                className="text-xs text-slate-400 leading-relaxed max-w-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Smart dormitory laundry management. Book machines, track availability in real time, and get AI-powered alerts — all from your phone.
              </p>
            </div>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/80 border border-blue-100 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span
                className="text-[11px] font-semibold text-slate-500"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                All systems operational
              </span>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-2 mt-1">
              <p
                className="text-xs font-semibold text-slate-500 uppercase tracking-widest"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get laundry updates
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#22c55e" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-green-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    You're subscribed!
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                    placeholder="you@university.edu"
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/70 border border-blue-100 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:shadow-sm focus:shadow-blue-100 transition-all backdrop-blur-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {section}
              </span>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-blue-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-slate-400 text-center sm:text-left"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © {new Date().getFullYear()} Made By Daniel Datuashvili
          </p>

          <div className="flex items-center gap-3">
            {/* Resident only badge */}
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM4.5 4.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0ZM2 13.5A3.5 3.5 0 0 1 5.5 10h5a3.5 3.5 0 0 1 3.5 3.5.75.75 0 0 1-1.5 0A2 2 0 0 0 10.5 11.5h-5A2 2 0 0 0 3.5 13.5a.75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
              </svg>
              Authorised Residents Only
            </span>

            {/* QR badge */}
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M2 2.75A.75.75 0 0 1 2.75 2h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5A.75.75 0 0 1 2 5.25v-2.5Zm1.5.75v1h1v-1h-1ZM2 10.75A.75.75 0 0 1 2.75 10h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5Zm1.5.75v1h1v-1h-1ZM10.75 2a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-2.5A.75.75 0 0 0 13.25 2h-2.5Zm.75 2.5v-1h1v1h-1ZM7 2.75A.75.75 0 0 1 7.75 2h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 2.75ZM7.75 6a.75.75 0 0 0 0 1.5H8A.75.75 0 0 0 8 6h-.25ZM7 9.75A.75.75 0 0 1 7.75 9H8a.75.75 0 0 1 0 1.5h-.25A.75.75 0 0 1 7 9.75ZM7.75 12a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5h-.25ZM10 7.75A.75.75 0 0 1 10.75 7H11a.75.75 0 0 1 0 1.5h-.25A.75.75 0 0 1 10 7.75ZM10.75 10a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5ZM10 12.75a.75.75 0 0 1 .75-.75H11a.75.75 0 0 1 0 1.5h-.25a.75.75 0 0 1-.75-.75ZM12.25 10a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" />
              </svg>
              QR Secured
            </span>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </footer>
  );
}
