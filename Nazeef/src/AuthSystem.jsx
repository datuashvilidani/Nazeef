import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Auth Context ────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = logged out

  const login = (email, name) => setUser({ email, name, initials: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const EyeIcon = ({ show }) =>
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
    </svg>
  );

// ─── Input Field ─────────────────────────────────────────────────────────────
const Field = ({ label, type = "text", value, onChange, placeholder, error, suffix }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm
        ${error ? "border-red-300 shadow-sm shadow-red-100" : "border-blue-100 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100"}`}>
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="pr-4 text-slate-300 hover:text-blue-400 transition-colors">
            <EyeIcon show={show} />
          </button>
        )}
        {suffix && <span className="pr-4 text-xs text-slate-300">{suffix}</span>}
      </div>
      {error && <span className="text-[11px] text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</span>}
    </div>
  );
};

// ─── Auth Modal ───────────────────────────────────────────────────────────────
export const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [mounted, setMounted] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", room: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const overlayRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (tab === "register" && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (tab === "register" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (tab === "register" && !form.room.trim()) e.room = "Room number is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate request
    setLoading(false);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 800));
    login(form.email, tab === "register" ? form.name : form.email.split("@")[0]);
    onClose();
  };

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(186, 220, 253, 0.25)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/60 border border-blue-100"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(237,246,255,0.97) 100%)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Top ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>

        <div className="px-8 pt-10 pb-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Resident Portal
              </span>
            </div>
            <h2 className="text-3xl font-light text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {tab === "login" ? "Sign in to book laundry machines" : "Register to access laundry facilities"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100/80 p-1 gap-1">
            {["login", "register"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300
                  ${tab === t ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-slate-400 hover:text-slate-600"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {tab === "register" && (
              <Field label="Full Name" value={form.name} onChange={set("name")} placeholder="John Doe" error={errors.name} />
            )}
            <Field label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="you@university.edu" error={errors.email} />
            <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" error={errors.password} />
            {tab === "register" && (
              <>
                <Field label="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" error={errors.confirm} />
                <Field label="Room Number" value={form.room} onChange={set("room")} placeholder="e.g. G1-204" error={errors.room} />
              </>
            )}
          </div>

          {/* Forgot password */}
          {tab === "login" && (
            <div className="flex justify-end -mt-2">
              <button className="text-xs text-blue-400 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-blue-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`relative w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 overflow-hidden
              ${success
                ? "bg-green-500 text-white shadow-lg shadow-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]"
              }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Verifying...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                Success!
              </span>
            ) : tab === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Switch tab hint */}
          <p className="text-center text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {tab === "login" ? "Don't have an account? " : "Already registered? "}
            <button
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setErrors({}); }}
              className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
            >
              {tab === "login" ? "Register here" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
export const ProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleLogout = () => { logout(); onClose(); };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-blue-100 shadow-2xl shadow-blue-100/60 overflow-hidden z-50"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(237,246,255,0.99) 100%)",
        backdropFilter: "blur(16px)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      {/* Profile header */}
      <div className="px-5 py-5 border-b border-blue-50 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{user?.name}</p>
          <p className="text-xs text-slate-400 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Verified Resident
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2 flex flex-col gap-0.5">
        {[
          { icon: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z", label: "My Profile" },
          { icon: "M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 0 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z", label: "My Bookings" },
          { icon: "M4.5 12.75l6 6 9-13.5", label: "Usage History" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 text-left"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-blue-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── Auth Gate (wrap MachineBlocks with this) ─────────────────────────────────
export const AuthGate = ({ children, onRequestLogin }) => {
  const { user } = useAuth();

  if (user) return children;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.4 }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="flex flex-col items-center gap-5 px-10 py-10 rounded-3xl border border-blue-100 shadow-2xl shadow-blue-100/50 text-center max-w-sm mx-4"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(237,246,255,0.99) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" className="w-8 h-8">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl font-light text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Residents <span className="italic font-semibold text-blue-600">Only</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sign in or register with your resident account to book laundry machines.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={onRequestLogin}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold tracking-wide hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </button>
            <button
              onClick={onRequestLogin}
              className="w-full py-3 rounded-xl border border-blue-200 text-blue-600 text-sm font-bold tracking-wide hover:bg-blue-50 active:scale-[0.98] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Create Account
            </button>
          </div>

          <p className="text-[11px] text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Authorised residents only · University Housing
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Updated Avatar Button (for Header) ──────────────────────────────────────
// Replace your header's avatar div with this component:
export const AvatarButton = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      {user ? (
        <>
          <div
            onClick={() => setShowDropdown(s => !s)}
            className="hidden md:flex h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <span className="text-xs font-bold text-white">{user.initials}</span>
          </div>
          {showDropdown && <ProfileDropdown onClose={() => setShowDropdown(false)} />}
        </>
      ) : (
        <button
          onClick={onOpenAuth}
          className="hidden md:flex h-9 w-9 rounded-full bg-white/80 border border-white items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3b82f6" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};
