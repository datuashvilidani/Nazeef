import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ─── Storage keys ─────────────────────────────────────────────────────────────
const USERS_KEY   = "nazeef_users";   // registry: { [email]: { name, email, passwordHash, room, registeredAt } }
const SESSION_KEY = "nazeef_user";    // currently logged-in user object

// ─── Simple hash (not crypto — just obfuscation for localStorage demo) ────────
const simpleHash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h.toString(36);
};

// ─── User registry helpers ────────────────────────────────────────────────────
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
};
const saveUsers = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
};
const registerUser = ({ name, email, password, room }) => {
  const users = getUsers();
  if (users[email.toLowerCase()]) return { ok: false, error: "An account with this email already exists." };
  users[email.toLowerCase()] = {
    name, email: email.toLowerCase(), passwordHash: simpleHash(password), room,
    registeredAt: new Date().toISOString(),
  };
  saveUsers(users);
  return { ok: true };
};
const loginUser = ({ email, password }) => {
  const users = getUsers();
  const record = users[email.toLowerCase()];
  if (!record) return { ok: false, error: "No account found with this email. Please register first." };
  if (record.passwordHash !== simpleHash(password)) return { ok: false, error: "Incorrect password. Please try again." };
  return { ok: true, user: record };
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login  = useCallback((userRecord) => {
    const u = {
      email:    userRecord.email,
      name:     userRecord.name,
      room:     userRecord.room,
      initials: userRecord.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    };
    setUser(u);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── useForm hook ─────────────────────────────────────────────────────────────
const useForm = (initialValues) => {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    // Clear error on change
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }, []);

  const setFieldError = useCallback((key, msg) => {
    setErrors(e => ({ ...e, [key]: msg }));
  }, []);

  const touch = useCallback((key) => {
    setTouched(t => ({ ...t, [key]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setServerError = useCallback((msg) => {
    setErrors(e => ({ ...e, _server: msg }));
  }, []);

  return { values, errors, touched, setValue, setFieldError, touch, reset, setServerError };
};

// ─── Validate helpers ─────────────────────────────────────────────────────────
const validateLogin = ({ email, password }) => {
  const e = {};
  if (!email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
  if (!password) e.password = "Password is required";
  else if (password.length < 6) e.password = "Password must be at least 6 characters";
  return e;
};

const validateRegister = ({ name, email, password, confirm, room }) => {
  const e = {};
  if (!name.trim()) e.name = "Full name is required";
  else if (name.trim().length < 2) e.name = "Name is too short";
  if (!email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
  if (!password) e.password = "Password is required";
  else if (password.length < 6) e.password = "Minimum 6 characters";
  if (!confirm) e.confirm = "Please confirm your password";
  else if (confirm !== password) e.confirm = "Passwords do not match";
  if (!room.trim()) e.room = "Room number is required";
  return e;
};

// ─── Shared UI ────────────────────────────────────────────────────────────────
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

const Field = ({ label, type = "text", value, onChange, onBlur, placeholder, error }) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm
        ${error
          ? "border-red-300 shadow-sm shadow-red-100"
          : "border-blue-100 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100"
        }`}
      >
        <input
          type={isPassword && showPw ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={isPassword ? "current-password" : type === "email" ? "email" : "off"}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(s => !s)} className="pr-4 text-slate-300 hover:text-blue-400 transition-colors">
            <EyeIcon show={showPw} />
          </button>
        )}
      </div>
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0">
            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 6a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 6Zm0 5a.75.75 0 1 0 0-1 .75.75 0 0 0 0 1Z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

// ─── Login Form ───────────────────────────────────────────────────────────────
const LoginForm = ({ onSuccess, onSwitchTab }) => {
  const { login } = useAuth();
  const form = useForm({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const errs = validateLogin(form.values);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => form.setFieldError(k, v));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = loginUser(form.values);
    setLoading(false);
    if (!result.ok) { form.setServerError(result.error); return; }
    setSuccess(true);
    await new Promise(r => setTimeout(r, 600));
    login(result.user);
    onSuccess?.();
  };

  return (
    <div className="flex flex-col gap-5">
      {form.errors._server && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ef4444" className="w-4 h-4 mt-0.5 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {form.errors._server}
            {form.errors._server.includes("register") && (
              <button onClick={onSwitchTab} className="ml-1 font-bold underline underline-offset-2 hover:text-red-800 transition-colors">
                Register here →
              </button>
            )}
          </p>
        </div>
      )}

      <Field
        label="Email Address"
        type="email"
        value={form.values.email}
        onChange={e => form.setValue("email", e.target.value)}
        onBlur={() => form.touch("email")}
        placeholder="you@university.edu"
        error={form.errors.email}
      />
      <Field
        label="Password"
        type="password"
        value={form.values.password}
        onChange={e => form.setValue("password", e.target.value)}
        onBlur={() => form.touch("password")}
        placeholder="••••••••"
        error={form.errors.password}
      />

      <div className="flex justify-end -mt-2">
        <button className="text-xs text-blue-400 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-blue-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Forgot password?
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || success}
        className={`relative w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300
          ${success ? "bg-green-500 text-white shadow-lg shadow-green-200"
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
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
            </svg>
            Welcome back!
          </span>
        ) : "Sign In"}
      </button>
    </div>
  );
};

// ─── Register Form ────────────────────────────────────────────────────────────
const RegisterForm = ({ onSuccess, onSwitchTab }) => {
  const { login } = useAuth();
  const form = useForm({ name: "", email: "", password: "", confirm: "", room: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const errs = validateRegister(form.values);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => form.setFieldError(k, v));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const result = registerUser(form.values);
    setLoading(false);
    if (!result.ok) { form.setServerError(result.error); return; }
    setSuccess(true);
    await new Promise(r => setTimeout(r, 700));
    // Auto-login after registration
    const loginResult = loginUser({ email: form.values.email, password: form.values.password });
    if (loginResult.ok) login(loginResult.user);
    onSuccess?.();
  };

  return (
    <div className="flex flex-col gap-4">
      {form.errors._server && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ef4444" className="w-4 h-4 mt-0.5 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
          </svg>
          <p className="text-xs text-red-600 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {form.errors._server}
            {form.errors._server.includes("already exists") && (
              <button onClick={onSwitchTab} className="ml-1 font-bold underline underline-offset-2 hover:text-red-800 transition-colors">
                Sign in instead →
              </button>
            )}
          </p>
        </div>
      )}

      <Field label="Full Name" value={form.values.name}
        onChange={e => form.setValue("name", e.target.value)}
        onBlur={() => form.touch("name")} placeholder="John Doe" error={form.errors.name} />
      <Field label="Email Address" type="email" value={form.values.email}
        onChange={e => form.setValue("email", e.target.value)}
        onBlur={() => form.touch("email")} placeholder="you@university.edu" error={form.errors.email} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Password" type="password" value={form.values.password}
          onChange={e => form.setValue("password", e.target.value)}
          onBlur={() => form.touch("password")} placeholder="••••••••" error={form.errors.password} />
        <Field label="Confirm" type="password" value={form.values.confirm}
          onChange={e => form.setValue("confirm", e.target.value)}
          onBlur={() => form.touch("confirm")} placeholder="••••••••" error={form.errors.confirm} />
      </div>
      <Field label="Room Number" value={form.values.room}
        onChange={e => form.setValue("room", e.target.value)}
        onBlur={() => form.touch("room")} placeholder="e.g. G1-204" error={form.errors.room} />

      <button
        onClick={handleSubmit}
        disabled={loading || success}
        className={`relative w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 mt-1
          ${success ? "bg-green-500 text-white shadow-lg shadow-green-200"
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
            Creating account...
          </span>
        ) : success ? (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
            </svg>
            Account Created!
          </span>
        ) : "Create Account"}
      </button>
    </div>
  );
};

// ─── Auth Modal ───────────────────────────────────────────────────────────────
export const AuthModal = ({ onClose, defaultTab = "login" }) => {
  const [tab, setTab] = useState(defaultTab);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 20); return () => clearTimeout(t); }, []);

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[10050] flex items-center justify-center p-4"
      style={{ background: "rgba(186, 220, 253, 0.25)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/60 border border-blue-100"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(237,246,255,0.97) 100%)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"/>
          </svg>
        </button>

        <div className="px-8 pt-10 pb-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd"/>
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
              {tab === "login"
                ? "Sign in with your registered resident account."
                : "Register to access Nazeef laundry facilities."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100/80 p-1 gap-1">
            {["login", "register"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300
                  ${tab === t ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-slate-400 hover:text-slate-600"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Forms */}
          {tab === "login"
            ? <LoginForm    onSuccess={onClose} onSwitchTab={() => setTab("register")} />
            : <RegisterForm onSuccess={onClose} onSwitchTab={() => setTab("login")} />
          }

          {/* Switch hint */}
          <p className="text-center text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {tab === "login" ? "Don't have an account? " : "Already registered? "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
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
export const ProfileDropdown = ({ onClose, skipOutsideClick = false }) => {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 20); return () => clearTimeout(t); }, []);

  // Only attach outside-click if not handled by parent
  useEffect(() => {
    if (skipOutsideClick) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, skipOutsideClick]);

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

      <div className="px-5 py-5 border-b border-blue-50 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{user?.name}</p>
          <p className="text-xs text-slate-400 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</p>
          {user?.room && (
            <p className="text-xs text-blue-400 font-medium mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Room {user.room}</p>
          )}
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Verified Resident
          </span>
        </div>
      </div>

      <div className="p-2 border-t border-blue-50">
        <button
          onClick={() => { logout(); onClose(); }}
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

// ─── Auth Gate ────────────────────────────────────────────────────────────────
export const AuthGate = ({ children, onRequestLogin }) => {
  const { user } = useAuth();
  if (user) return children;
  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.4 }}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="flex flex-col items-center gap-5 px-10 py-10 rounded-3xl border border-blue-100 shadow-2xl shadow-blue-100/50 text-center max-w-sm mx-4"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(237,246,255,0.99) 100%)", backdropFilter: "blur(20px)" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" className="w-8 h-8">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd"/>
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
            <button onClick={onRequestLogin} className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold tracking-wide hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sign In
            </button>
            <button onClick={onRequestLogin} className="w-full py-3 rounded-xl border border-blue-200 text-blue-600 text-sm font-bold tracking-wide hover:bg-blue-50 active:scale-[0.98] transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Create Account
            </button>
          </div>
          <p className="text-[11px] text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>Authorised residents only · University Housing</p>
        </div>
      </div>
    </div>
  );
};

// ─── Avatar Button ────────────────────────────────────────────────────────────
export const AvatarButton = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef(null);

  // Close when clicking outside — but not when clicking the avatar itself
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e) => {
      if (avatarRef.current && avatarRef.current.contains(e.target)) return;
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  return (
    <div className="relative" ref={avatarRef}>
      {user ? (
        <>
          <div
            onClick={() => setShowDropdown(s => !s)}
            className="hidden md:flex h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <span className="text-xs font-bold text-white">{user.initials}</span>
          </div>
          {showDropdown && (
            <ProfileDropdown onClose={() => setShowDropdown(false)} skipOutsideClick />
          )}
        </>
      ) : (
        <button
          onClick={onOpenAuth}
          className="hidden md:flex h-9 w-9 rounded-full bg-white/80 border border-white items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3b82f6" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Notification Context ─────────────────────────────────────────────────────
const NotifContext = createContext(null);
export const useNotifications = () => useContext(NotifContext);

export const NotificationProvider = ({ children }) => {
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nazeef_notifs") || "[]"); } catch { return []; }
  });

  const save = (n) => {
    try { localStorage.setItem("nazeef_notifs", JSON.stringify(n)); } catch {};
  };

  const push = useCallback((msg, type = "done") => {
    setNotifs(prev => {
      const n = [{ id: Date.now(), msg, type, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }, ...prev].slice(0, 20);
      save(n);
      return n;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs(prev => { const n = prev.map(x => ({ ...x, read: true })); save(n); return n; });
  }, []);

  const clear = useCallback(() => { setNotifs([]); save([]); }, []);

  const unread = notifs.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifs, push, markAllRead, clear, unread }}>
      {children}
    </NotifContext.Provider>
  );
};

// ─── Bell / Notifications Button ──────────────────────────────────────────────
export const BellButton = () => {
  const { notifs, unread, markAllRead, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    if (!open) { setMounted(false); return; }
    // Calculate position so dropdown never overflows off screen on mobile
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        // On mobile: pin to left edge with full-width feel
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 8,
          left: 12,
          right: 12,
          width: "auto",
        });
      } else {
        setDropdownStyle({});
      }
    }
    const t = setTimeout(() => setMounted(true), 20);
    markAllRead();
    return () => clearTimeout(t);
  }, [open, markAllRead]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const typeStyle = (type) => {
    if (type === "done")  return { bg: "bg-green-50 border-green-200",  icon: "text-green-500",  dot: "bg-green-500" };
    if (type === "alert") return { bg: "bg-amber-50 border-amber-200",  icon: "text-amber-500",  dot: "bg-amber-400" };
    if (type === "info")  return { bg: "bg-blue-50 border-blue-200",    icon: "text-blue-500",   dot: "bg-blue-500" };
    return                       { bg: "bg-blue-50 border-blue-200",    icon: "text-blue-500",   dot: "bg-blue-500" };
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen(s => !s)}
        className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-white/60 rounded-full transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="rounded-2xl border border-blue-100 shadow-2xl shadow-blue-100/60 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(237,246,255,0.99) 100%)",
            backdropFilter: "blur(16px)",
            zIndex: 10060,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            // Default desktop positioning (overridden on mobile via dropdownStyle)
            position: "absolute",
            right: 0,
            top: "calc(100% + 12px)",
            width: "320px",
            ...dropdownStyle,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

          {/* Header */}
          <div className="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                  <path d="M13.306 7.1a5.305 5.305 0 0 0-4.682-4.682A1.75 1.75 0 0 0 7 1a1.75 1.75 0 0 0-1.624 1.418A5.305 5.305 0 0 0 .694 7.1 1.5 1.5 0 0 0 1 10h.685a4.503 4.503 0 0 0 4.316 3h4a4.503 4.503 0 0 0 4.314-3H15a1.5 1.5 0 0 0 .306-2.9Z"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notifications</span>
              {notifs.length > 0 && (
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {notifs.length}
                </span>
              )}
            </div>
            {notifs.length > 0 && (
              <button
                onClick={clear}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>No notifications</p>
                  <p className="text-xs text-slate-300 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>You'll be notified when your wash is done</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-blue-50/60">
                {notifs.map((n) => {
                  const s = typeStyle(n.type);
                  return (
                    <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 ${!n.read ? "bg-blue-50/30" : ""}`}>
                      <div className={`mt-0.5 w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.bg}`}>
                        {n.type === "done" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 ${s.icon}`}>
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"/>
                          </svg>
                        ) : n.type === "info" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 ${s.icon}`}>
                            <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-9 .5a.75.75 0 0 0 0 1.5h1.25v1.75a.75.75 0 0 0 1.5 0V9A.75.75 0 0 0 8 8.5H6ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 ${s.icon}`}>
                            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 6a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 6Zm0 5a.75.75 0 1 0 0-1 .75.75 0 0 0 0 1Z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{n.msg}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{n.time}</p>
                      </div>
                      {!n.read && <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
