import React, { useState } from "react";
import image from "../assets/logo.png";
import { AvatarButton, BellButton, useAuth } from "../AuthSystem";

const Header = ({ onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Machines", href: "#machines" },
    { name: "About Us", href: "#aboutus" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Main Header Bar */}
      <div className="relative flex items-center justify-between px-6 md:px-8 py-4 border-b border-blue-100 shadow-sm bg-gradient-to-r from-[#add6fd] via-white to-[#add6fd]">

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-1 bg-white/40 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm transition-transform duration-500 ease-in-out hover:scale-125 cursor-pointer">
            <img src={image} alt="Brand Logo" className="h-10 w-auto object-contain" />
          </div>
        </div>

        {/* CENTER: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 z-10">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-slate-600 hover:text-blue-500 transition-all duration-300 tracking-wide uppercase"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 md:gap-4 z-10">

          {/* Bell — visible on ALL screen sizes, handles its own dropdown */}
          <BellButton />

          {/* Desktop Avatar */}
          <div className="hidden md:flex">
            <AvatarButton onOpenAuth={onOpenAuth} />
          </div>

          {/* Mobile three-dots toggle */}
          <button
            onClick={() => setIsMenuOpen((s) => !s)}
            className="md:hidden p-2 text-slate-600 hover:bg-white/60 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`fixed left-0 right-0 top-[72px] bg-white/95 backdrop-blur-md border-b border-blue-100 transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        } md:hidden shadow-xl z-[9999]`}
      >
        <div className="flex flex-col p-6 gap-4">

          {/* Mobile Profile Section */}
          {user ? (
            <div className="flex items-center gap-3 pb-4 mb-2 border-b border-slate-100">
              <div className="h-10 w-10 rounded-full bg-blue-600 border border-blue-700 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                {user.room && <p className="text-xs text-blue-400 font-medium">Room {user.room}</p>}
              </div>
              <button
                type="button"
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="text-xs font-bold text-red-500 hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setIsMenuOpen(false); onOpenAuth?.(); }}
              className="flex items-center gap-3 pb-4 mb-2 border-b border-slate-100 text-left w-full"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700">?</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Sign in / Register</p>
                <p className="text-xs text-slate-500">Residents only</p>
              </div>
            </button>
          )}

          {/* Nav Links */}
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-700 hover:text-blue-500 transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
