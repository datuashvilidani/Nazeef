import { useState, useEffect, useRef } from "react";
import { useAuth, useNotifications } from "../AuthSystem";

const BLOCKS = ["G1", "G2", "G3"];
const MACHINES_PER_BLOCK = 8;
const BOOKING_DURATION = 5 * 60; // 5 min in seconds
const MAX_BOOKINGS_PER_USER = 2;
const STORAGE_KEY = "nazeef_machines";

// ── Persistence helpers ───────────────────────────────────────────────────────
const initMachines = (blockId) =>
  Array.from({ length: MACHINES_PER_BLOCK }, (_, i) => ({
    id: `${blockId}-${i + 1}`,
    label: `${i + 1}`.padStart(2, "0"),
    status: "available",  // "available" | "booked" | "in-use"
    timeLeft: 0,
    bookedBy: null,       // stores the user's email
  }));

const buildInitialState = () =>
  Object.fromEntries(BLOCKS.map((b) => [b, initMachines(b)]));

// Load from localStorage and adjust timers for real time elapsed while away
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { blocks, savedAt } = JSON.parse(raw);
    const elapsed = Math.floor((Date.now() - savedAt) / 1000);
    const restored = {};
    for (const [blockId, machines] of Object.entries(blocks)) {
      restored[blockId] = machines.map((m) => {
        if (m.status === "available") return m;
        const newTimeLeft = Math.max(0, (m.timeLeft || 0) - elapsed);
        if (newTimeLeft === 0) return { ...m, status: "available", timeLeft: 0, bookedBy: null };
        return { ...m, timeLeft: newTimeLeft };
      });
    }
    return restored;
  } catch {
    return null;
  }
};

const saveToStorage = (blocks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks, savedAt: Date.now() }));
  } catch {}
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ── Icons / badges ────────────────────────────────────────────────────────────
const WashingMachineIcon = ({ status }) => {
  const isSpinning = status === "in-use";
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <rect x="8" y="6" width="48" height="52" rx="6"
        fill={status === "available" ? "#eff6ff" : status === "booked" ? "#fef9c3" : "#dbeafe"}
        stroke={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"} strokeWidth="2"/>
      <rect x="8" y="6" width="48" height="14" rx="6"
        fill={status === "available" ? "#dbeafe" : status === "booked" ? "#fde68a" : "#bfdbfe"}/>
      <rect x="8" y="14" width="48" height="6"
        fill={status === "available" ? "#dbeafe" : status === "booked" ? "#fde68a" : "#bfdbfe"}/>
      <circle cx="20" cy="13" r="3" fill={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"}/>
      <circle cx="30" cy="13" r="2" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fcd34d" : "#93c5fd"}/>
      <rect x="38" y="9" width="12" height="8" rx="2" fill={status === "in-use" ? "#1d4ed8" : "#e0f2fe"} opacity="0.9"/>
      {status === "in-use" && <rect x="40" y="11" width="8" height="4" rx="1" fill="#60a5fa" opacity="0.7"/>}
      <circle cx="32" cy="38" r="14" fill="white"
        stroke={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"} strokeWidth="2.5"/>
      <circle cx="32" cy="38" r="10"
        fill={status === "available" ? "#eff6ff" : status === "booked" ? "#fffbeb" : "#dbeafe"}
        stroke={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"} strokeWidth="1.5"/>
      <g style={isSpinning ? { transformOrigin: "32px 38px", animation: "spin 1.2s linear infinite" } : {}}>
        <circle cx="32" cy="31" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
        <circle cx="38.5" cy="42" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
        <circle cx="25.5" cy="42" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
      </g>
      <rect x="30" y="49" width="4" height="3" rx="1.5" fill={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"}/>
      <rect x="14" y="56" width="8" height="3" rx="1.5" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"}/>
      <rect x="42" y="56" width="8" height="3" rx="1.5" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"}/>
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "available")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Available
      </span>
    );
  if (status === "booked")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" /> Booked
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" /> In Use
    </span>
  );
};

// ── Machine Card ──────────────────────────────────────────────────────────────
const MachineCard = ({ machine, onBook, onStart, onCancel, userEmail, userBookingCount }) => {
  const { id, label, status, timeLeft, bookedBy } = machine;
  const isMine = bookedBy === userEmail && userEmail !== null;
  const canBook = status === "available" && !!userEmail && userBookingCount < MAX_BOOKINGS_PER_USER;
  const atLimit = status === "available" && !!userEmail && userBookingCount >= MAX_BOOKINGS_PER_USER;

  return (
    <div
      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300
        ${status === "available"
          ? canBook
            ? "bg-white/80 border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
            : "bg-white/50 border-slate-100"
          : status === "booked"
          ? isMine
            ? "bg-amber-50/90 border-amber-300 shadow-md ring-1 ring-amber-200"
            : "bg-amber-50/60 border-amber-100"
          : isMine
          ? "bg-blue-50/90 border-blue-300 shadow-md ring-1 ring-blue-200"
          : "bg-blue-50/60 border-blue-100"
        }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Number + "Yours" tag */}
      <div className="absolute top-2.5 left-3 flex items-center gap-1">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          #{label}
        </span>
        {isMine && (status === "booked" || status === "in-use") && (
          <span className="text-[9px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-px rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Yours
          </span>
        )}
      </div>

      <div className="mt-3">
        <WashingMachineIcon status={status} />
      </div>

      <StatusBadge status={status} />

      {/* Countdown timer */}
      {(status === "booked" || status === "in-use") && (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span>{status === "booked" ? "Booking expires" : "Time remaining"}</span>
            <span className={`font-bold ${status === "booked" ? "text-amber-500" : "text-blue-500"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${status === "booked" ? "bg-amber-400" : "bg-blue-500"}`}
              style={{ width: `${(timeLeft / BOOKING_DURATION) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-1.5 mt-1">

        {/* Available */}
        {status === "available" && (
          <button
            onClick={() => canBook && onBook(id)}
            disabled={!canBook}
            title={!userEmail ? "Sign in to book" : atLimit ? `Max ${MAX_BOOKINGS_PER_USER} bookings reached` : ""}
            className={`w-full py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200
              ${canBook
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {!userEmail
              ? "Sign in to Book"
              : atLimit
              ? `Limit (${MAX_BOOKINGS_PER_USER}/${MAX_BOOKINGS_PER_USER})`
              : "Book Now"}
          </button>
        )}

        {/* Booked — owner sees Start + Cancel */}
        {status === "booked" && isMine && (
          <>
            <button
              onClick={() => onStart(id)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold tracking-wide hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm shadow-blue-200 flex items-center justify-center gap-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z" />
              </svg>
              Start Wash
            </button>
            <button
              onClick={() => onCancel(id)}
              className="w-full py-2 rounded-xl bg-white border border-amber-300 text-amber-600 text-xs font-bold tracking-wide hover:bg-amber-50 active:scale-95 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Cancel
            </button>
          </>
        )}

        {/* Booked by someone else */}
        {status === "booked" && !isMine && (
          <div className="w-full py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-400 text-xs font-bold tracking-wide text-center"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Reserved
          </div>
        )}

        {/* In use — owner gets distinct label */}
        {status === "in-use" && (
          <div className={`w-full py-2 rounded-xl border text-xs font-bold tracking-wide text-center
            ${isMine ? "bg-blue-100 border-blue-300 text-blue-600" : "bg-blue-50 border-blue-200 text-blue-400"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {isMine ? "🔄 Your Wash" : "In Progress"}
          </div>
        )}
      </div>
    </div>
  );
};

const BlockAvailabilityBar = ({ machines }) => {
  const available = machines.filter(m => m.status === "available").length;
  const booked = machines.filter(m => m.status === "booked").length;
  const inUse = machines.filter(m => m.status === "in-use").length;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {[
        { count: available, color: "bg-green-500", label: "free" },
        { count: booked,    color: "bg-amber-400", label: "booked" },
        { count: inUse,     color: "bg-blue-500",  label: "in use" },
      ].map(({ count, color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{count} {label}</span>
        </div>
      ))}
      {available === 0 && (
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" /> All Occupied
        </span>
      )}
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
export default function MachineBlocks() {
  const { user } = useAuth();
  const { push: pushNotif } = useNotifications();
  const userEmail = user?.email ?? null;

  const [blocks, setBlocks] = useState(() => loadFromStorage() ?? buildInitialState());

  // Keep localStorage in sync on every change
  useEffect(() => { saveToStorage(blocks); }, [blocks]);

  // 1-second countdown tick
  useEffect(() => {
    const id = setInterval(() => {
      setBlocks((prev) => {
        const next = {};
        for (const [blockId, machines] of Object.entries(prev)) {
          next[blockId] = machines.map((m) => {
            if ((m.status === "booked" || m.status === "in-use") && m.timeLeft <= 1) {
              // Fire notification only for the machine owner
              if (m.bookedBy && m.bookedBy === userEmail) {
                const label = `Machine #${m.label} in Block ${blockId}`;
                if (m.status === "in-use") {
                  pushNotif(`✅ ${label} has finished! Please collect your laundry.`, "done");
                } else {
                  pushNotif(`⏰ Your booking for ${label} has expired and was released.`, "alert");
                }
              }
              return { ...m, status: "available", timeLeft: 0, bookedBy: null };
            }
            if (m.timeLeft > 0) return { ...m, timeLeft: m.timeLeft - 1 };
            return m;
          });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [userEmail, pushNotif]);

  // How many active slots does the logged-in user hold?
  const userBookingCount = Object.values(blocks)
    .flat()
    .filter(m => m.bookedBy === userEmail && (m.status === "booked" || m.status === "in-use"))
    .length;

  const handleBook = (blockId, machineId) => {
    if (!userEmail || userBookingCount >= MAX_BOOKINGS_PER_USER) return;
    setBlocks(prev => ({
      ...prev,
      [blockId]: prev[blockId].map(m =>
        m.id === machineId ? { ...m, status: "booked", timeLeft: BOOKING_DURATION, bookedBy: userEmail } : m
      ),
    }));
  };

  const handleStart = (blockId, machineId) => {
    setBlocks(prev => ({
      ...prev,
      [blockId]: prev[blockId].map(m =>
        m.id === machineId && m.bookedBy === userEmail ? { ...m, status: "in-use" } : m
      ),
    }));
  };

  const handleCancel = (blockId, machineId) => {
    setBlocks(prev => ({
      ...prev,
      [blockId]: prev[blockId].map(m =>
        m.id === machineId && m.bookedBy === userEmail
          ? { ...m, status: "available", timeLeft: 0, bookedBy: null }
          : m
      ),
    }));
  };

  return (
    <section id="machines" className="relative bg-gradient-to-b from-white via-[#f0f8ff] to-white py-24 px-4 md:px-10">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Laundry Blocks
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Find a <span className="italic font-semibold text-blue-600">Machine</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <p className="text-sm text-slate-400 max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Book a machine in your block. Bookings held for 5 min.{" "}
              <span className="font-semibold text-blue-500">Max {MAX_BOOKINGS_PER_USER} active bookings</span> per resident.
            </p>
            {userEmail && (
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  userBookingCount >= MAX_BOOKINGS_PER_USER
                    ? "text-red-500 bg-red-50 border-red-200"
                    : "text-blue-500 bg-blue-50 border-blue-100"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${userBookingCount >= MAX_BOOKINGS_PER_USER ? "bg-red-400" : "bg-blue-400"}`} />
                {userBookingCount}/{MAX_BOOKINGS_PER_USER} slots used
              </span>
            )}
          </div>
        </div>

        {/* Blocks */}
        {BLOCKS.map((blockId, blockIdx) => (
          <div key={blockId} className="relative" style={{ animation: `fadeUp 0.5s ease ${blockIdx * 0.15}s both` }}>
            <div className="rounded-3xl border border-blue-100 bg-white/70 shadow-xl shadow-blue-50 overflow-hidden" style={{ backdropFilter: "blur(12px)" }}>

              {/* Block header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-[#e8f4fe]/80 via-white to-[#e8f4fe]/80 flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                    <span className="text-white text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{blockId}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Block {blockId}</h3>
                    <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{MACHINES_PER_BLOCK} machines · Floor {blockIdx + 1}</p>
                  </div>
                </div>
                <BlockAvailabilityBar machines={blocks[blockId]} />
              </div>

              {/* Machine grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {blocks[blockId].map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    userEmail={userEmail}
                    userBookingCount={userBookingCount}
                    onBook={(id) => handleBook(blockId, id)}
                    onStart={(id) => handleStart(blockId, id)}
                    onCancel={(id) => handleCancel(blockId, id)}
                  />
                ))}
              </div>

              {/* Block footer */}
              <div className="px-6 py-3 border-t border-blue-50 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-300 tracking-widest uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {blockId} · {MACHINES_PER_BLOCK} Units
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-blue-400">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
                  </svg>
                  5 min booking hold
                </div>
              </div>
            </div>

            {blockIdx < BLOCKS.length - 1 && (
              <div className="flex items-center gap-4 mt-10 mb-2 px-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-blue-300 uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>next block</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}
