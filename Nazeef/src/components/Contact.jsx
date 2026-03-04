import { useState, useEffect, useRef } from "react";

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

const Field = ({ label, type = "text", value, onChange, placeholder, error, multiline }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {label}
    </label>
    <div className={`relative flex rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm
      ${error ? "border-red-300 shadow-sm shadow-red-100" : "border-blue-100 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100"}`}>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none resize-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      )}
    </div>
    {error && <span className="text-[11px] text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</span>}
  </div>
);

const INFO_ITEMS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "Nazeef@gmail.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    label: "Phone",
    value: "+60 11-1234 5678",
    sub: "Mon–Fri, 9am – 6pm",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    label: "Location",
    value: "University of Birmingham, Dubai",
    sub: "Laundry Management Office",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: "Office Hours",
    value: "Mon – Fri: 9am – 6pm",
    sub: "Sat: 10am – 2pm",
  },
];

export default function ContactUs() {
  const [formRef, formInView] = useInView(0.1);
  const [infoRef, infoInView] = useInView(0.1);
  const [heroRef, heroInView] = useInView(0.2);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.message.trim().length < 10) e.message = "Message is too short";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative bg-gradient-to-b from-white via-[#f0f8ff] to-white py-28 px-4 md:px-10 overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(circle, #93c5fd 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute top-[5%] left-[-8%] w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-6%] w-[360px] h-[360px] rounded-full bg-[#add6fd]/25 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-16">

        {/* Section header */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Get In Touch
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              We'd love to{" "}
              <span className="italic font-semibold text-blue-600">hear from you</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm md:text-right" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Have a question, report an issue, or want to suggest a feature? Reach out and we'll get back to you promptly.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* LEFT: Info panel */}
          <div
            ref={infoRef}
            className="md:col-span-2 flex flex-col gap-5"
            style={{
              opacity: infoInView ? 1 : 0,
              transform: infoInView ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            {/* Info card */}
            <div
              className="rounded-3xl border border-blue-100 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(219,234,254,0.5) 0%, rgba(255,255,255,0.9) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

              {/* Top teal band */}
              <div className="px-7 pt-7 pb-5 border-b border-blue-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                      <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a29.798 29.798 0 0 1 4.24 3.355.75.75 0 0 0 1.138-.032 29.77 29.77 0 0 1 .363-.438 29.795 29.795 0 0 1 3.877-3.403c.27.423.59.824.96 1.193a.75.75 0 1 0 1.061-1.06 6.57 6.57 0 0 1-.739-.914c.508-.29 1.026-.564 1.554-.82a.75.75 0 0 0 .418-.74 41.029 41.029 0 0 0-.39-3.114A29.848 29.848 0 0 0 18 11.459v.18a30.258 30.258 0 0 0-4 2.442V9.394a2.216 2.216 0 0 0-.958-1.833 37 37 0 0 0-3.446-2.12.75.75 0 1 0-.714 1.319 35.504 35.504 0 0 1 3.305 2.033c.186.129.302.348.302.592v4.687a30.305 30.305 0 0 0-4-2.442v-.18Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'Playfair Display', serif" }}>Nazeef Support</p>
                    <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>University Laundry System</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Our team is here to help residents with bookings, machine issues, account access, and any feedback you have.
                </p>
              </div>

              {/* Info rows */}
              <div className="flex flex-col divide-y divide-blue-50">
                {INFO_ITEMS.map(({ icon, label, value, sub }, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 px-7 py-4"
                    style={{
                      opacity: infoInView ? 1 : 0,
                      transform: infoInView ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 0.5s ease ${0.2 + i * 0.08}s, transform 0.5s ease ${0.2 + i * 0.08}s`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 shrink-0">
                      {icon}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                      <span className="text-sm font-semibold text-slate-700 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                      <span className="text-[11px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick response badge */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/70 border border-blue-100 backdrop-blur-sm shadow-sm">
              <div className="flex gap-1">
                {["bg-green-400", "bg-blue-400", "bg-amber-400"].map((c, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full ${c} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Average response time: <span className="font-bold text-blue-600">under 4 hours</span>
              </p>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div
            ref={formRef}
            className="md:col-span-3"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateX(0)" : "translateX(20px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <div
              className="rounded-3xl border border-blue-100 overflow-hidden shadow-xl shadow-blue-50"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(237,246,255,0.98) 100%)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

              {/* Form header */}
              <div className="px-8 pt-8 pb-6 border-b border-blue-50">
                <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Send a Message
                </h3>
                <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Fill in the form and we'll get back to you as soon as possible.
                </p>
              </div>

              {sent ? (
                /* Success state */
                <div className="px-8 py-16 flex flex-col items-center gap-5 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center"
                    style={{ animation: "popIn 0.4s ease" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" className="w-8 h-8">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h4>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Thanks for reaching out. We'll reply to <span className="text-blue-500 font-medium">{form.email}</span> shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="text-xs text-blue-400 hover:text-blue-600 transition-colors underline underline-offset-4"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* Form fields */
                <div className="px-8 py-7 flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="John Doe" error={errors.name} />
                    <Field label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="you@university.edu" error={errors.email} />
                  </div>
                  <Field label="Subject" value={form.subject} onChange={set("subject")} placeholder="e.g. Machine not working in G2" error={errors.subject} />
                  <Field label="Message" value={form.message} onChange={set("message")} placeholder="Describe your issue or question in detail..." error={errors.message} multiline />

                  {/* Topic chips */}
                  <div className="flex flex-wrap gap-2">
                    {["Machine Issue", "Booking Help", "Account Access", "Feedback", "Other"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, subject: chip }))}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                          ${form.subject === chip
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                            : "bg-white/60 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500"
                          }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300
                      ${loading
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200 hover:shadow-blue-300"
                      }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </section>
  );
}
