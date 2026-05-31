"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Caveat } from "next/font/google";
import {
  Spinner,
  Pulse,
  Skeleton,
  Dots,
  Wave,
} from "../components/loaders";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

// Standard preset colors for Unity-like clean theme
const PRESET_COLORS = [
  { name: "Slate Grey", value: "#475569" },
  { name: "Unity Blue", value: "#0284c7" },
  { name: "Emerald Mint", value: "#059669" },
  { name: "Amber Gold", value: "#d97706" },
  { name: "Crimson Red", value: "#dc2626" },
  { name: "Orchid Violet", value: "#7c3aed" },
];

interface LoaderAsset {
  id: string;
  name: string;
  family: "Spinner" | "Pulse" | "Skeleton" | "Dots" | "Wave";
  variant: string;
  description: string;
  version: string;
  render: (params: {
    color: string;
    size: number;
    speed: "slow" | "normal" | "fast";
    count: number;
    skeletonAnimate: "shimmer" | "pulse" | "none";
  }) => React.ReactNode;
  getJSX: (params: {
    color: string;
    size: number;
    speed: string;
    count: number;
    skeletonAnimate: string;
  }) => string;
}

export default function Home() {
  // Global settings in the Sidebar
  const [color, setColor] = useState<string>("#0284c7");
  const [size, setSize] = useState<number>(40);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [elementCount, setElementCount] = useState<number>(5);
  const [skeletonAnimate, setSkeletonAnimate] = useState<"shimmer" | "pulse" | "none">("shimmer");
  
  // Interactive UI Theme customizer colors
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [bgClr, setBgClr] = useState<string>("#f8fafc");
  const [cardBgClr, setCardBgClr] = useState<string>("#ffffff");
  const [textClr, setTextClr] = useState<string>("#0f172a");
  const [borderClr, setBorderClr] = useState<string>("#e2e8f0");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");

  // Theme transitions including parameter state resets
  const handleToggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      setBgClr("#09090b");
      setCardBgClr("#18181b");
      setTextClr("#f4f4f5");
      setBorderClr("#27272a");
    } else {
      setBgClr("#f8fafc");
      setCardBgClr("#ffffff");
      setTextClr("#0f172a");
      setBorderClr("#e2e8f0");
    }
  };

  // Reset parameters to defaults
  const handleResetTheme = () => {
    if (darkMode) {
      setBgClr("#09090b");
      setCardBgClr("#18181b");
      setTextClr("#f4f4f5");
      setBorderClr("#27272a");
    } else {
      setBgClr("#f8fafc");
      setCardBgClr("#ffffff");
      setTextClr("#0f172a");
      setBorderClr("#e2e8f0");
    }
  };

  // All 17 asset variants mapped for display
  const assets: LoaderAsset[] = [
    // Spinners
    {
      id: "spinner-classic",
      name: "Classic Arc Spinner",
      family: "Spinner",
      variant: "classic",
      description: "Smooth vector arc with gradient trail animation",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Spinner variant="classic" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Spinner variant="classic" size={${size}} color="${color}" speed="${speed}" />`,
    },
    {
      id: "spinner-ring",
      name: "Track Ring Spinner",
      family: "Spinner",
      variant: "ring",
      description: "Concentric rotating segment on a subtle base ring track",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Spinner variant="ring" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Spinner variant="ring" size={${size}} color="${color}" speed="${speed}" />`,
    },
    {
      id: "spinner-dual",
      name: "Dual Segment Spinner",
      family: "Spinner",
      variant: "dual",
      description: "Two opposing symmetric spinning visual segments",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Spinner variant="dual" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Spinner variant="dual" size={${size}} color="${color}" speed="${speed}" />`,
    },
    {
      id: "spinner-dashed",
      name: "Dashed Circular Spinner",
      family: "Spinner",
      variant: "dashed",
      description: "Dashed vector border with a lightweight rotating timeline",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Spinner variant="dashed" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Spinner variant="dashed" size={${size}} color="${color}" speed="${speed}" />`,
    },

    // Pulses
    {
      id: "pulse-circle",
      name: "Expanding Pulse Circle",
      family: "Pulse",
      variant: "circle",
      description: "Single radial circle fading outwards smoothly",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Pulse variant="circle" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Pulse variant="circle" size={${size}} color="${color}" speed="${speed}" />`,
    },
    {
      id: "pulse-ripple",
      name: "Multi concentric Ripple",
      family: "Pulse",
      variant: "ripple",
      description: "Concentric hardware-accelerated ripple rings",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Pulse variant="ripple" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Pulse variant="ripple" size={${size}} color="${color}" speed="${speed}" />`,
    },
    {
      id: "pulse-double",
      name: "Double Radial Pulse",
      family: "Pulse",
      variant: "double",
      description: "Two out-of-phase pulsating circles scaling dynamically",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Pulse variant="double" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Pulse variant="double" size={${size}} color="${color}" speed="${speed}" />`,
    },

    // Skeletons
    {
      id: "skeleton-text",
      name: "Text Line Placeholder",
      family: "Skeleton",
      variant: "text",
      description: "Sleek block placeholder mimicking editorial text line rows",
      version: "v1.0.0",
      render: ({ skeletonAnimate }) => (
        <Skeleton variant="text" width="80%" animate={skeletonAnimate} />
      ),
      getJSX: ({ skeletonAnimate }) =>
        `<Skeleton variant="text" width="80%" animate="${skeletonAnimate}" />`,
    },
    {
      id: "skeleton-rect",
      name: "Rectangle Block Placeholder",
      family: "Skeleton",
      variant: "rect",
      description: "Media block placeholder for grids or card containers",
      version: "v1.0.0",
      render: ({ skeletonAnimate }) => (
        <Skeleton variant="rect" width="100%" height="80px" animate={skeletonAnimate} />
      ),
      getJSX: ({ skeletonAnimate }) =>
        `<Skeleton variant="rect" width="100%" height="80px" animate="${skeletonAnimate}" />`,
    },
    {
      id: "skeleton-circle",
      name: "Avatar Circle Placeholder",
      family: "Skeleton",
      variant: "circle",
      description: "Rounded vector mask representation of avatars or profiles",
      version: "v1.0.0",
      render: ({ size, skeletonAnimate }) => (
        <Skeleton variant="circle" width={size} height={size} animate={skeletonAnimate} />
      ),
      getJSX: ({ size, skeletonAnimate }) =>
        `<Skeleton variant="circle" width={${size}} height={${size}} animate="${skeletonAnimate}" />`,
    },
    {
      id: "skeleton-card",
      name: "Full Composite Card Skeleton",
      family: "Skeleton",
      variant: "card",
      description: "Ready-to-use compound loader combining media, avatars, and text",
      version: "v1.0.0",
      render: ({ skeletonAnimate }) => (
        <Skeleton variant="card" animate={skeletonAnimate} />
      ),
      getJSX: ({ skeletonAnimate }) =>
        `<Skeleton variant="card" animate="${skeletonAnimate}" />`,
    },

    // Dots
    {
      id: "dots-bouncing",
      name: "Bouncing Wave Dots",
      family: "Dots",
      variant: "bouncing",
      description: "Horizontal staggered bouncing vector loading circles",
      version: "v1.0.0",
      render: ({ color, size, speed, count }) => (
        <Dots variant="bouncing" size={size / 4} color={color} speed={speed} count={count} />
      ),
      getJSX: ({ color, size, speed, count }) =>
        `<Dots variant="bouncing" size={${Math.round(size / 4)}} color="${color}" speed="${speed}" count={${count}} />`,
    },
    {
      id: "dots-flashing",
      name: "Sequence Flashing Dots",
      family: "Dots",
      variant: "flashing",
      description: "Staggered opacity fade transitions for inline actions",
      version: "v1.0.0",
      render: ({ color, size, speed, count }) => (
        <Dots variant="flashing" size={size / 4} color={color} speed={speed} count={count} />
      ),
      getJSX: ({ color, size, speed, count }) =>
        `<Dots variant="flashing" size={${Math.round(size / 4)}} color="${color}" speed="${speed}" count={${count}} />`,
    },
    {
      id: "dots-chase",
      name: "Staggered Chase Dots",
      family: "Dots",
      variant: "chase",
      description: "Multi-dimensional scale and opacity loop transformations",
      version: "v1.0.0",
      render: ({ color, size, speed, count }) => (
        <Dots variant="chase" size={size / 4} color={color} speed={speed} count={count} />
      ),
      getJSX: ({ color, size, speed, count }) =>
        `<Dots variant="chase" size={${Math.round(size / 4)}} color="${color}" speed="${speed}" count={${count}} />`,
    },

    // Waves
    {
      id: "wave-bars",
      name: "Sound Visualizer Waves",
      family: "Wave",
      variant: "bars",
      description: "Staggered voice bar visualizer scaling dynamically",
      version: "v1.0.0",
      render: ({ color, size, speed, count }) => (
        <Wave variant="bars" size={size} color={color} speed={speed} count={count} />
      ),
      getJSX: ({ color, size, speed, count }) =>
        `<Wave variant="bars" size={${size}} color="${color}" speed="${speed}" count={${count}} />`,
    },
    {
      id: "wave-fluid",
      name: "Floating Fluid Waves",
      family: "Wave",
      variant: "fluid",
      description: "Staggered translation offsets mimicking liquid motions",
      version: "v1.0.0",
      render: ({ color, size, speed, count }) => (
        <Wave variant="fluid" size={size} color={color} speed={speed} count={count} />
      ),
      getJSX: ({ color, size, speed, count }) =>
        `<Wave variant="fluid" size={${size}} color="${color}" speed="${speed}" count={${count}} />`,
    },
    {
      id: "wave-pulse",
      name: "Expanding Pulse Waves",
      family: "Wave",
      variant: "pulse-wave",
      description: "Concentric transparent circles pulsing outwards in unison",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Wave variant="pulse-wave" size={size} color={color} speed={speed} />
      ),
      getJSX: ({ color, size, speed }) =>
        `<Wave variant="pulse-wave" size={${size}} color="${color}" speed="${speed}" />`,
    },
  ];

  // Clipboard copy action
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1800);
  };

  // Filtering cards based on search query
  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(query) ||
      asset.family.toLowerCase().includes(query) ||
      asset.variant.toLowerCase().includes(query) ||
      asset.description.toLowerCase().includes(query)
    );
  });

  // Inject user theme colors dynamically into inline style variables
  const themeVariables = {
    "--theme-bg": bgClr,
    "--theme-card-bg": cardBgClr,
    "--theme-text": textClr,
    "--theme-border": borderClr,
    color: "var(--theme-text)",
  } as React.CSSProperties;

  return (
    <div
      style={themeVariables}
      className="min-h-screen font-sans antialiased bg-[color:var(--theme-bg)] transition-colors duration-300"
    >
      {/* Unity Asset Store style Header */}
      <header
        style={{
          backgroundColor: "var(--theme-card-bg)",
          borderBottomColor: "var(--theme-border)",
        }}
        className="border-b sticky top-0 z-50 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <span className="text-white dark:text-slate-950 font-black text-sm">L</span>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Loading Library</h1>
                <p className={`text-[9px] font-semibold uppercase tracking-wider ${
                  darkMode ? "text-zinc-500" : "text-slate-400"
                }`}>Unity Asset Store Style</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme switcher */}
            <button
              onClick={handleToggleTheme}
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold hover:opacity-90 shadow-sm"
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <>
                  <span className="text-yellow-400">☀️ Light Mode</span>
                </>
              ) : (
                <>
                  <span className="text-slate-600">🌙 Dark Mode</span>
                </>
              )}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="text-xs font-semibold px-4 py-2 rounded-lg border transition-all hover:opacity-90"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Showcase Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Persistent Control Sidebar (Standardized for all cards) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
            }}
            className={`${handwritten.className} border rounded-2xl p-5 shadow-sm transition-all sticky top-24 text-lg tracking-wide`}
          >
            <div
              style={{ borderBottomColor: "var(--theme-border)" }}
              className="border-b pb-4 mb-4"
            >
              <h2 className="text-sm font-bold tracking-tight">Global Parameters</h2>
              <p className="text-[11px] opacity-60 mt-0.5">Adjust all loaded assets together</p>
            </div>

            <div className="flex flex-col gap-5">
              {/* Color Parameter */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold opacity-75">
                  <span>Custom Color</span>
                  <span className="font-mono font-medium text-[10px]">{color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      title={c.name}
                      style={{ backgroundColor: c.value }}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        color === c.value
                          ? "border-slate-900 dark:border-white scale-110 shadow-sm"
                          : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                  <div
                    style={{
                      borderColor: "var(--theme-border)",
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    className="relative flex items-center justify-center w-6 h-6 rounded-full border overflow-hidden"
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="text-[10px] pointer-events-none font-bold">+</span>
                  </div>
                </div>
              </div>

              {/* Dimensions (Size) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold opacity-75">
                  <span>Dimension (Size)</span>
                  <span className="font-mono font-medium text-xs text-sky-600 dark:text-sky-400">{size}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-sky-400"
                />
              </div>

              {/* Speed */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold opacity-75">Timeline Speed</label>
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="grid grid-cols-3 gap-1 p-1 rounded-xl border"
                >
                  {["slow", "normal", "fast"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s as "slow" | "normal" | "fast")}
                      style={{
                        backgroundColor: speed === s ? "var(--theme-card-bg)" : "transparent",
                        color: speed === s ? "var(--theme-text)" : "inherit",
                        borderColor: speed === s ? "var(--theme-border)" : "transparent",
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                        speed === s ? "shadow-sm" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dot & Wave element count */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold opacity-75">
                  <span>Element Count</span>
                  <span className="font-mono font-medium text-xs text-sky-600 dark:text-sky-400">{elementCount}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={elementCount}
                  onChange={(e) => setElementCount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-sky-400"
                />
              </div>

              {/* Skeleton Animation parameter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold opacity-75">Skeleton Shimmer</label>
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="grid grid-cols-3 gap-1 p-1 rounded-xl border"
                >
                  {["shimmer", "pulse", "none"].map((anim) => (
                    <button
                      key={anim}
                      onClick={() => setSkeletonAnimate(anim as "shimmer" | "pulse" | "none")}
                      style={{
                        backgroundColor: skeletonAnimate === anim ? "var(--theme-card-bg)" : "transparent",
                        color: skeletonAnimate === anim ? "var(--theme-text)" : "inherit",
                        borderColor: skeletonAnimate === anim ? "var(--theme-border)" : "transparent",
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all border ${
                        skeletonAnimate === anim ? "shadow-sm" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Theme Color Customizer (Requested feature) */}
              <div
                style={{ borderTopColor: "var(--theme-border)" }}
                className="border-t pt-4 mt-2 flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">UI Customizer</h3>
                  <p className="text-[10px] opacity-55">Paint your own store colors</p>
                </div>

                {/* Canvas Background Color Picker */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold opacity-75">Canvas Background</span>
                  <div
                    style={{ borderColor: "var(--theme-border)" }}
                    className="w-8 h-8 rounded-lg overflow-hidden border relative flex items-center justify-center cursor-pointer bg-slate-100"
                  >
                    <input
                      type="color"
                      value={bgClr}
                      onChange={(e) => setBgClr(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div style={{ backgroundColor: bgClr }} className="w-full h-full" />
                  </div>
                </div>

                {/* Card Background Color Picker */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold opacity-75">Card Background</span>
                  <div
                    style={{ borderColor: "var(--theme-border)" }}
                    className="w-8 h-8 rounded-lg overflow-hidden border relative flex items-center justify-center cursor-pointer bg-slate-100"
                  >
                    <input
                      type="color"
                      value={cardBgClr}
                      onChange={(e) => setCardBgClr(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div style={{ backgroundColor: cardBgClr }} className="w-full h-full" />
                  </div>
                </div>

                {/* Text Color Picker */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold opacity-75">Dashboard Text</span>
                  <div
                    style={{ borderColor: "var(--theme-border)" }}
                    className="w-8 h-8 rounded-lg overflow-hidden border relative flex items-center justify-center cursor-pointer bg-slate-100"
                  >
                    <input
                      type="color"
                      value={textClr}
                      onChange={(e) => setTextClr(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div style={{ backgroundColor: textClr }} className="w-full h-full" />
                  </div>
                </div>

                {/* Border Color Picker */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold opacity-75">Card & UI Borders</span>
                  <div
                    style={{ borderColor: "var(--theme-border)" }}
                    className="w-8 h-8 rounded-lg overflow-hidden border relative flex items-center justify-center cursor-pointer bg-slate-100"
                  >
                    <input
                      type="color"
                      value={borderClr}
                      onChange={(e) => setBorderClr(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div style={{ backgroundColor: borderClr }} className="w-full h-full" />
                  </div>
                </div>

                {/* Reset to Mode defaults */}
                <button
                  onClick={handleResetTheme}
                  style={{
                    borderColor: "var(--theme-border)",
                    backgroundColor: "rgba(0,0,0,0.03)",
                  }}
                  className="w-full py-1.5 rounded-lg text-[10px] font-bold tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-all border uppercase"
                >
                  Reset UI Defaults
                </button>
              </div>

            </div>
          </div>
        </aside>

        {/* Assets Listing Area */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top minimal Search and Meta Info */}
          <div
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
            }}
            className="border rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="relative w-full md:max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none text-xs font-bold">🔍</span>
              <input
                type="text"
                placeholder="Search loader assets (e.g. spinner, pulse, classic)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: "rgba(0,0,0,0.03)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
                className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl border font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold opacity-75">
              <span>Showing {filteredAssets.length} of {assets.length} Package Assets</span>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "var(--theme-card-bg)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all hover:-translate-y-0.5"
                >
                  {/* Live Render Canvas box */}
                  <div
                    style={{
                      borderBottomColor: "var(--theme-border)",
                      backgroundColor: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                    }}
                    className="h-40 flex items-center justify-center p-6 border-b transition-colors relative"
                  >
                    {/* Visual pattern grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                    <div className="scale-105 select-none">
                      {asset.render({
                        color,
                        size,
                        speed,
                        count: elementCount,
                        skeletonAnimate,
                      })}
                    </div>

                    <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      asset.family === "Spinner"
                        ? "bg-sky-500/10 text-sky-500 border border-sky-500/15"
                        : asset.family === "Pulse"
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/15"
                        : asset.family === "Skeleton"
                        ? "bg-slate-500/10 text-slate-500 border border-slate-500/15"
                        : asset.family === "Dots"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                    }`}>
                      {asset.family}
                    </span>
                    <span className="absolute top-3 right-3 text-[9px] font-mono font-medium opacity-50">
                      {asset.version}
                    </span>
                  </div>

                  {/* Asset descriptions & meta details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-sm font-bold tracking-tight hover:text-sky-600 transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-xs leading-relaxed opacity-65">
                        {asset.description}
                      </p>
                    </div>

                    {/* Copy code interactive action */}
                    <button
                      onClick={() =>
                        handleCopy(
                          asset.id,
                          asset.getJSX({
                            color,
                            size,
                            speed,
                            count: elementCount,
                            skeletonAnimate,
                          })
                        )
                      }
                      style={{
                        backgroundColor: copiedId === asset.id ? "" : "rgba(0,0,0,0.03)",
                        borderColor: "var(--theme-border)",
                      }}
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold border tracking-wide transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                        copiedId === asset.id
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {copiedId === asset.id ? (
                        <>
                          <span>✓ Code Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋 Copy React JSX</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="border rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm"
            >
              <span className="text-3xl mb-3">📦</span>
              <h3 className="text-sm font-bold">No Loader Assets Found</h3>
              <p className="text-xs mt-1 max-w-sm mx-auto leading-relaxed opacity-65">
                We couldn&apos;t find any loaders matching your search query &quot;{searchQuery}&quot;. Try modifying your keyword.
              </p>
            </div>
          )}

        </section>

      </div>

      {/* Footer */}
      <footer
        style={{
          borderTopColor: "var(--theme-border)",
          backgroundColor: "var(--theme-card-bg)",
        }}
        className="border-t py-8 mt-16 text-xs font-medium opacity-70"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Loading Library. Scoped CSS Module Packages.</p>
          <div className="flex gap-4">
            <a href="https://github.com" className="hover:text-sky-500 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
