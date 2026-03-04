import React, { useState } from "react";
import image from "../assets/logo.png";
import { AvatarButton } from "../AuthSystem";

const Header = ({ onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Machines", href: "#machines" },
    { name: "Contact", href: "#contact" },
    { name: "About Us", href: "#aboutus" },
  ];

  return (
    <header className="relative z-50">
      {/* Main Header Bar */}
      <div
        className="relative flex items-center justify-between px-6 md:px-8 py-4 border-b border-blue-100 shadow-sm overflow-hidden 
        bg-gradient-to-r from-[#add6fd] via-white to-[#add6fd]"
      >
        {/* Glossy Overlay (Now spans the whole header for consistent shine) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* LEFT: Logo with Smooth Hover Scale */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-1 bg-white/40 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm transition-transform duration-500 ease-in-out hover:scale-125 cursor-pointer">
            <img src={image} alt="Brand Logo" className="h-10 w-auto object-contain" />
          </div>
        </div>

        {/* CENTER: Desktop Nav (Hidden on Mobile) */}
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
          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-white/60 rounded-full transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
          </button>

          {/* Desktop Avatar (Visible on md and up) */}
          <div className="hidden md:flex">
            <AvatarButton onOpenAuth={onOpenAuth} />
          </div>

          {/* MOBILE THREE-DOTS TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-white/60 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md border-b border-blue-100 transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        } md:hidden shadow-xl`}
      >
        <div className="flex flex-col p-6 gap-4">
          {/* Mobile Profile Section */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onOpenAuth?.();
            }}
            className="flex items-center gap-3 pb-4 mb-2 border-b border-slate-100 text-left"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-700">JD</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Sign in / Register</p>
              <p className="text-xs text-slate-500">Residents only</p>
            </div>
          </button>

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