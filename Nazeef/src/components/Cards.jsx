import { useState, useEffect, useRef } from "react";

const BLOCKS = ["G1", "G2", "G3"];
const MACHINES_PER_BLOCK = 8;
const BOOKING_DURATION = 5 * 60; // 5 minutes in seconds

const WashingMachineIcon = ({ status }) => {
  const isSpinning = status === "in-use";
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      {/* Body */}
      <rect x="8" y="6" width="48" height="52" rx="6" fill={status === "available" ? "#eff6ff" : status === "booked" ? "#fef9c3" : "#dbeafe"} stroke={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"} strokeWidth="2"/>
      {/* Top panel */}
      <rect x="8" y="6" width="48" height="14" rx="6" fill={status === "available" ? "#dbeafe" : status === "booked" ? "#fde68a" : "#bfdbfe"}/>
      <rect x="8" y="14" width="48" height="6" fill={status === "available" ? "#dbeafe" : status === "booked" ? "#fde68a" : "#bfdbfe"}/>
      {/* Knobs */}
      <circle cx="20" cy="13" r="3" fill={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"}/>
      <circle cx="30" cy="13" r="2" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fcd34d" : "#93c5fd"}/>
      {/* Display */}
      <rect x="38" y="9" width="12" height="8" rx="2" fill={status === "in-use" ? "#1d4ed8" : "#e0f2fe"} opacity="0.9"/>
      {status === "in-use" && <rect x="40" y="11" width="8" height="4" rx="1" fill="#60a5fa" opacity="0.7"/>}
      {/* Door ring */}
      <circle cx="32" cy="38" r="14" fill="white" stroke={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"} strokeWidth="2.5"/>
      <circle cx="32" cy="38" r="10" fill={status === "available" ? "#eff6ff" : status === "booked" ? "#fffbeb" : "#dbeafe"} stroke={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"} strokeWidth="1.5"/>
      {/* Drum / spin animation */}
      <g style={isSpinning ? { transformOrigin: "32px 38px", animation: "spin 1.2s linear infinite" } : {}}>
        <circle cx="32" cy="31" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
        <circle cx="38.5" cy="42" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
        <circle cx="25.5" cy="42" r="2.5" fill={status === "in-use" ? "#3b82f6" : "#cbd5e1"} opacity="0.7"/>
      </g>
      {/* Door handle */}
      <rect x="30" y="49" width="4" height="3" rx="1.5" fill={status === "available" ? "#93c5fd" : status === "booked" ? "#f59e0b" : "#3b82f6"}/>
      {/* Bottom feet */}
      <rect x="14" y="56" width="8" height="3" rx="1.5" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"}/>
      <rect x="42" y="56" width="8" height="3" rx="1.5" fill={status === "available" ? "#bfdbfe" : status === "booked" ? "#fde68a" : "#93c5fd"}/>
    </svg>
  );
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
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

const MachineCard = ({ machine, onBook, onCancel }) => {
  const { id, label, status, timeLeft } = machine;

  return (
    <div
      className={`relative group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300
        ${status === "available"
          ? "bg-white/80 border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 cursor-pointer"
          : status === "booked"
          ? "bg-amber-50/80 border-amber-200 shadow-md"
          : "bg-blue-50/80 border-blue-200 shadow-md"
        }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Machine number */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          #{label}
        </span>
      </div>

      {/* Icon */}
      <div className="mt-3">
        <WashingMachineIcon status={status} />
      </div>

      {/* Status badge */}
      <StatusBadge status={status} />

      {/* Timer */}
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

      {/* Action button */}
      {status === "available" && (
        <button
          onClick={() => onBook(id)}
          className="w-full mt-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold tracking-wide hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm shadow-blue-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Book Now
        </button>
      )}
      {status === "booked" && (
        <button
          onClick={() => onCancel(id)}
          className="w-full mt-1 py-2 rounded-xl bg-white border border-amber-300 text-amber-600 text-xs font-bold tracking-wide hover:bg-amber-50 active:scale-95 transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Cancel
        </button>
      )}
      {status === "in-use" && (
        <div className="w-full mt-1 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-400 text-xs font-bold tracking-wide text-center"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          In Progress
        </div>
      )}
    </div>
  );
};

const BlockAvailabilityBar = ({ machines }) => {
  const available = machines.filter(m => m.status === "available").length;
  const booked = machines.filter(m => m.status === "booked").length;
  const inUse = machines.filter(m => m.status === "in-use").length;
  const allUnavailable = available === 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{available} free</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{booked} booked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{inUse} in use</span>
      </div>
      {allUnavailable && (
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" /> All Occupied
        </span>
      )}
    </div>
  );
};

const initMachines = (blockId) =>
  Array.from({ length: MACHINES_PER_BLOCK }, (_, i) => ({
    id: `${blockId}-${i + 1}`,
    label: `${i + 1}`.padStart(2, "0"),
    status: "available",
    timeLeft: 0,
  }));

export default function MachineBlocks() {
  const [blocks, setBlocks] = useState(() =>
    Object.fromEntries(BLOCKS.map((b) => [b, initMachines(b)]))
  );

  // Seed some machines as in-use for demo
  useEffect(() => {
    setBlocks((prev) => {
      const next = { ...prev };
      [["G1", 0], ["G1", 2], ["G2", 4], ["G3", 1]].forEach(([block, idx]) => {
        next[block] = next[block].map((m, i) =>
          i === idx ? { ...m, status: "in-use", timeLeft: Math.floor(Math.random() * 240) + 60 } : m
        );
      });
      return next;
    });
  }, []);

  // Countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const next = {};
        for (const [blockId, machines] of Object.entries(prev)) {
          next[blockId] = machines.map((m) => {
            if (m.timeLeft <= 1 && (m.status === "booked" || m.status === "in-use")) {
              return { ...m, status: "available", timeLeft: 0 };
            }
            if (m.timeLeft > 0) {
              // booked → in-use after 10s for demo feel
              const newStatus = m.status === "booked" && m.timeLeft < BOOKING_DURATION - 10 ? "in-use" : m.status;
              return { ...m, timeLeft: m.timeLeft - 1, status: newStatus };
            }
            return m;
          });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = (blockId, machineId) => {
    setBlocks((prev) => ({
      ...prev,
      [blockId]: prev[blockId].map((m) =>
        m.id === machineId ? { ...m, status: "booked", timeLeft: BOOKING_DURATION } : m
      ),
    }));
  };

  const handleCancel = (blockId, machineId) => {
    setBlocks((prev) => ({
      ...prev,
      [blockId]: prev[blockId].map((m) =>
        m.id === machineId ? { ...m, status: "available", timeLeft: 0 } : m
      ),
    }));
  };

  return (
    <section
      id="machines"
      className="relative bg-gradient-to-b from-white via-[#f0f8ff] to-white py-24 px-4 md:px-10"
    >
      {/* Subtle dot grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-16">

        {/* Section header */}
        <div className="flex flex-col gap-2">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Laundry Blocks
          </span>
          <h2
            className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Find a <span className="italic font-semibold text-blue-600">Machine</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-md mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Book a machine in your block. Bookings are held for 5 minutes before being released.
          </p>
        </div>

        {/* Blocks */}
        {BLOCKS.map((blockId, blockIdx) => {
          const machines = blocks[blockId];
          return (
            <div
              key={blockId}
              className="relative"
              style={{
                opacity: 1,
                animation: `fadeUp 0.5s ease ${blockIdx * 0.15}s both`,
              }}
            >
              {/* Block card wrapper */}
              <div className="rounded-3xl border border-blue-100 bg-white/70 shadow-xl shadow-blue-50 overflow-hidden"
                style={{ backdropFilter: "blur(12px)" }}>

                {/* Block header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-[#e8f4fe]/80 via-white to-[#e8f4fe]/80">
                  <div className="flex items-center gap-4">
                    {/* Block badge */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                      <span
                        className="text-white text-lg font-bold"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {blockId}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold text-slate-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Block {blockId}
                      </h3>
                      <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {MACHINES_PER_BLOCK} machines · Floor {blockIdx + 1}
                      </p>
                    </div>
                  </div>
                  <BlockAvailabilityBar machines={machines} />
                </div>

                {/* Machine grid */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {machines.map((machine) => (
                    <MachineCard
                      key={machine.id}
                      machine={machine}
                      onBook={(id) => handleBook(blockId, id)}
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

              {/* Block separator (not after last) */}
              {blockIdx < BLOCKS.length - 1 && (
                <div className="flex items-center gap-4 mt-10 mb-2 px-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-blue-300 uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    next block
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
