"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Patrick_Hand } from "next/font/google";
import {
  Spinner,
  Pulse,
  Skeleton,
  Dots,
  Wave,
  Carrot,
  Watermelon,
  CarrotBar,
  AvocadoBar,
  WatermelonBar,
  PineappleBar,
  StrawberryBar,
  GrapeBar,
  Grape,
  LootChest,
  XPBar,
  PotionBrewing,
  WizardSpell,
  DragonFire,
  SwordForging,
  GitCommit,
  TerminalTyping,
  DependencyGraph,
  ApiRequest,
  PlanetOrbit,
  SatelliteSignal,
  RocketAssembly,
} from "../components/loaders";

const handwritten = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Standard preset colors for a clean theme
const PRESET_COLORS = [
  { name: "Carrot Orange", value: "#ff9e43" },
  { name: "Slate Grey", value: "#475569" },
  { name: "Brand Blue", value: "#0284c7" },
  { name: "Emerald Mint", value: "#059669" },
  { name: "Amber Gold", value: "#d97706" },
  { name: "Crimson Red", value: "#dc2626" },
  { name: "Orchid Violet", value: "#7c3aed" },
];

interface LoaderAsset {
  id: string;
  name: string;
  family:
    | "Spinner"
    | "Pulse"
    | "Skeleton"
    | "Dots"
    | "Wave"
    | "Carrot"
    | "Watermelon"
    | "CarrotBar"
    | "AvocadoBar"
    | "WatermelonBar"
    | "PineappleBar"
    | "StrawberryBar"
    | "GrapeBar"
    | "Grape"
    | "LootChest"
    | "XPBar"
    | "PotionBrewing"
    | "WizardSpell"
    | "DragonFire"
    | "SwordForging"
    | "GitCommit"
    | "TerminalTyping"
    | "DependencyGraph"
    | "ApiRequest"
    | "PlanetOrbit"
    | "SatelliteSignal"
    | "RocketAssembly";
  variant: string;
  description: string;
  version: string;
  render: (params: {
    color: string;
    size: number;
    speed: "slow" | "normal" | "fast";
    count: number;
    skeletonAnimate: "shimmer" | "pulse" | "none";
    paused?: boolean;
  }) => React.ReactNode;
}

export default function Home() {
  // Global settings in the Sidebar
  const [color, setColor] = useState<string>("#ff9e43");
  const [forceColor, setForceColor] = useState<boolean>(false);
  const [size, setSize] = useState<number>(40);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [elementCount, setElementCount] = useState<number>(5);
  const [skeletonAnimate, setSkeletonAnimate] = useState<"shimmer" | "pulse" | "none">("shimmer");
  const [playOnHover, setPlayOnHover] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  // Interactive UI Theme customizer colors
  const [darkMode] = useState<boolean>(false);
  const [bgClr, setBgClr] = useState<string>("#f8fafc");
  const [cardBgClr, setCardBgClr] = useState<string>("#ffffff");
  const [textClr, setTextClr] = useState<string>("#0f172a");
  const [borderClr, setBorderClr] = useState<string>("#e2e8f0");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const getAssetCategory = (family: string): string => {
    if (family === "Spinner" || family === "Pulse") return "Classic";
    if (family === "Dots" || family === "Wave") return "Dots & Waves";
    if (family === "Skeleton") return "Skeletons";
    if (family === "LootChest" || family === "XPBar") return "Gaming";
    if (family === "GitCommit" || family === "TerminalTyping" || family === "DependencyGraph" || family === "ApiRequest") return "Coding";
    if (family === "PotionBrewing" || family === "WizardSpell" || family === "DragonFire" || family === "SwordForging") return "Fantasy";
    if (family === "PlanetOrbit" || family === "SatelliteSignal" || family === "RocketAssembly") return "Space";
    if (family === "Carrot" || family === "Watermelon" || family === "Grape" || family.endsWith("Bar")) return "Fruits";
    return "Classic";
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

  // All asset variants mapped for display
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
    },

    // Carrot (Playful custom dynamic anim)
    {
      id: "carrot-nibble",
      name: "Interactive Nibble Carrot",
      family: "Carrot",
      variant: "nibble",
      description: "Playful neumorphic interactive carrot with active eating loops & falling crumbs",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Carrot size={size} color={forceColor ? color : "#ff9e43"} speed={speed} variant="nibble" biteColor={cardBgClr} />
      ),
    },
    {
      id: "carrot-bunny",
      name: "Bunny Chomp Carrot",
      family: "Carrot",
      variant: "bunny",
      description: "Extremely cute interactive animation where a hungry bunny pops up to chomp the carrot down",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Carrot size={size} color={forceColor ? color : "#ff9e43"} speed={speed} variant="bunny" biteColor={cardBgClr} />
      ),
    },

    // Watermelon (Playful fruit anim)
    {
      id: "watermelon-chomp",
      name: "Juicy Watermelon Chomp",
      family: "Watermelon",
      variant: "chomp",
      description: "Interactive watermelon slice getting eaten with flying seeds & juice drops",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Watermelon size={size} color={forceColor ? color : "#ef4444"} speed={speed} variant="chomp" biteColor={cardBgClr} />
      ),
    },
    {
      id: "watermelon-slice",
      name: "Spinning Melon Slice",
      family: "Watermelon",
      variant: "slice",
      description: "Rotating watermelon slice with pulsing seeds and dripping juice animation",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Watermelon size={size} color={forceColor ? color : "#ef4444"} speed={speed} variant="slice" biteColor={cardBgClr} />
      ),
    },
    {
      id: "grape-nibble",
      name: "Interactive Nibble Grape",
      family: "Grape",
      variant: "nibble",
      description: "Delightful grape cluster getting eaten 2-3 at a time with custom worrying/shocked expressions & particle physics. Click to bite!",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <Grape size={size} color={forceColor ? color : "#7a38d6"} speed={speed} biteColor={cardBgClr} />
      ),
    },
    // Fruit Progress Bars
    {
      id: "fruitbar-carrot",
      name: "Carrot Loading Bar",
      family: "CarrotBar",
      variant: "carrot",
      description: "Adorable claymorphic loading bar with repeating orange stripes and a bouncing carrot character thumb. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <CarrotBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "fruitbar-avocado",
      name: "Avocado Loading Bar",
      family: "AvocadoBar",
      variant: "avocado",
      description: "Super cute avocado loading bar with repeating light green stripes and a smiling pear-shaped avocado thumb. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <AvocadoBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "fruitbar-watermelon",
      name: "Watermelon Loading Bar",
      family: "WatermelonBar",
      variant: "watermelon",
      description: "Yummy watermelon progress bar textured with dark seed drops and a smiling melon slice thumb. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <WatermelonBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "fruitbar-pineapple",
      name: "Pineapple Loading Bar",
      family: "PineappleBar",
      variant: "pineapple",
      description: "Sunny pineapple loading bar featuring a gold criss-cross lattice and a spiky crowned pineapple thumb. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <PineappleBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "fruitbar-strawberry",
      name: "Strawberry Loading Bar",
      family: "StrawberryBar",
      variant: "strawberry",
      description: "Sweet strawberry progress bar with tiny yellow seeds and a blushing red strawberry thumb character. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <StrawberryBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "fruitbar-grape",
      name: "Grape Loading Bar",
      family: "GrapeBar",
      variant: "grape",
      description: "Tasty purple grape bunch loading bar with diagonal stripes and a smiling lavender grape thumb. Fully interactive!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <GrapeBar speed={speed} interactive={true} />
      ),
    },
    {
      id: "gaming-loot-chest",
      name: "Legendary Loot Chest",
      family: "LootChest",
      variant: "chest",
      description: "Interactive treasure chest that wiggles during loading and bursts open with coins and starry gems at 100%!",
      version: "v1.0.0",
      render: ({ size, speed }) => (
        <LootChest size={size * 2} speed={speed} interactive={true} />
      ),
    },
    {
      id: "gaming-xp-bar",
      name: "RPG Level Up XP Bar",
      family: "XPBar",
      variant: "xp",
      description: "Retro glowing experience bar featuring interactive levels, experience counters, level-up milestones, and starry sparkles!",
      version: "v1.0.0",
      render: ({ speed }) => (
        <XPBar speed={speed} interactive={true} showLabels={true} />
      ),
    },
    // Fantasy
    {
      id: "fantasy-wizard-spell",
      name: "Wizard Spell",
      family: "WizardSpell",
      variant: "spell",
      description: "A magical rune circle draws itself while glowing symbols rotate around it.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <WizardSpell size={size * 1.6} speed={speed} color={color} />
      ),
    },
    {
      id: "fantasy-dragon-fire",
      name: "Dragon Fire",
      family: "DragonFire",
      variant: "fire",
      description: "A dragon breathes fire that gradually fills a progress bar.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <DragonFire size={size * 1.4} speed={speed} fireColor={color} interactive={true} />
      ),
    },
    {
      id: "fantasy-sword-forging",
      name: "Sword Forging",
      family: "SwordForging",
      variant: "forge",
      description: "A sword is forged step-by-step: heating, hammering, cooling, and polishing.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <SwordForging size={size * 1.4} speed={speed} accentColor={color} interactive={true} />
      ),
    },
    {
      id: "fantasy-potion-brewing",
      name: "Potion Brewing",
      family: "PotionBrewing",
      variant: "potion",
      description: "A cauldron fills with glowing liquid while magical bubbles and sparks emerge.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <PotionBrewing size={size * 1.8} speed={speed} potionColor={color} interactive={true} />
      ),
    },
    // Coding
    {
      id: "coding-git-commit",
      name: "Git Commit Loader",
      family: "GitCommit",
      variant: "commit",
      description: "Commit nodes illuminate one by one as changes are processed.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <GitCommit size={size * 1.6} speed={speed} color={color} interactive={true} />
      ),
    },
    {
      id: "coding-terminal-typing",
      name: "Terminal Typing",
      family: "TerminalTyping",
      variant: "terminal",
      description: "A terminal automatically types commands while progress increases.",
      version: "v1.0.0",
      render: ({ speed }) => (
        <TerminalTyping speed={speed} interactive={true} />
      ),
    },
    {
      id: "coding-dependency-graph",
      name: "Dependency Graph",
      family: "DependencyGraph",
      variant: "graph",
      description: "Nodes and connections progressively appear, simulating package resolution.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <DependencyGraph size={size * 1.7} speed={speed} color={color} interactive={true} />
      ),
    },
    {
      id: "coding-api-request",
      name: "API Request Loader",
      family: "ApiRequest",
      variant: "api",
      description: "Data packets travel between servers, visualizing network communication.",
      version: "v1.0.0",
      render: ({ color, size, speed }) => (
        <ApiRequest size={size * 1.6} speed={speed} color={color} interactive={true} />
      ),
    },
    {
      id: "space-planet-orbit",
      name: "Solar Planet Orbit",
      family: "PlanetOrbit",
      variant: "orbit",
      description: "Mathematical cosmic orbit showing a glowing sun, a blue planet, and an orbiting moon that completes circles relative to progress!",
      version: "v1.0.0",
      render: ({ size, speed, paused }) => (
        <PlanetOrbit size={size * 1.8} speed={speed} paused={paused} interactive={true} />
      ),
    },
    {
      id: "space-satellite-signal",
      name: "Telemetry Satellite Signal",
      family: "SatelliteSignal",
      variant: "signal",
      description: "Futuristic satellite dish pulsing expanding glowing telemetry wave arcs outward, bobbing gracefully with data progress!",
      version: "v1.0.0",
      render: ({ size, speed, paused }) => (
        <SatelliteSignal size={size * 1.7} speed={speed} paused={paused} interactive={true} />
      ),
    },
    {
      id: "space-rocket-assembly",
      name: "Modular Rocket Assembly",
      family: "RocketAssembly",
      variant: "rocket",
      description: "Spacecraft segments that fly together and snap-assemble step-by-step. Ignites thrusters and blasts off into space at 100%!",
      version: "v1.0.0",
      render: ({ size, speed, paused }) => (
        <RocketAssembly size={size * 1.6} speed={speed} paused={paused} interactive={true} />
      ),
    },
  ];

  // Filtering cards based on search query and category
  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      asset.name.toLowerCase().includes(query) ||
      asset.family.toLowerCase().includes(query) ||
      asset.variant.toLowerCase().includes(query) ||
      asset.description.toLowerCase().includes(query);

    const assetCategory = getAssetCategory(asset.family);
    const matchesCategory = selectedCategory === "All" || assetCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Paginate cards
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // Conditional sidebar flags based on categories
  const showColor = selectedCategory === "All" || selectedCategory === "Classic" || selectedCategory === "Dots & Waves" || selectedCategory === "Fruits" || selectedCategory === "Gaming" || selectedCategory === "Coding" || selectedCategory === "Fantasy" || selectedCategory === "Space";
  const showForceColor = selectedCategory === "All" || selectedCategory === "Fruits" || selectedCategory === "Gaming" || selectedCategory === "Space";
  const showSpeed = selectedCategory === "All" || selectedCategory === "Classic" || selectedCategory === "Dots & Waves" || selectedCategory === "Fruits" || selectedCategory === "Gaming" || selectedCategory === "Coding" || selectedCategory === "Fantasy" || selectedCategory === "Space";
  const showElementCount = selectedCategory === "All" || selectedCategory === "Dots & Waves";
  const showSkeleton = selectedCategory === "All" || selectedCategory === "Skeletons";

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
      <style>{`
        .paused-animations * {
          animation-play-state: paused !important;
          transition: none !important;
        }
      `}</style>
      {/* Minimalist Asset Store style Header */}
      <header
        style={{
          backgroundColor: "var(--theme-card-bg)",
          borderBottomColor: "var(--theme-border)",
        }}
        className="border-b sticky top-0 z-50 backdrop-blur-md transition-colors w-full"
      >
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Loading Library logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Loading Library</h1>
                <p className={`text-[9px] font-semibold uppercase tracking-wider ${
                  darkMode ? "text-zinc-500" : "text-slate-400"
                }`}>Component Asset Store</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Help/Guide Button */}
            <button
              onClick={() => setShowGuide(true)}
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="px-3 py-2 rounded-lg border transition-all hover:opacity-90 shadow-sm flex items-center gap-1.5 text-xs font-semibold active:scale-95"
              title="How to Use"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-sans">How to use</span>
            </button>

            {/* GitHub Project Button */}
            <a
              href="https://github.com/nanda-kshr/LoaderKit"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="w-9 h-9 rounded-lg border transition-all hover:opacity-90 shadow-sm flex items-center justify-center active:scale-95"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Showcase Layout */}
      <div className="w-full flex flex-col lg:flex-row relative min-h-[calc(100vh-73px)]">
        
        {/* Persistent Control Sidebar (Standardized for all cards) */}
        <aside
          style={{
            backgroundColor: "var(--theme-card-bg)",
            borderColor: "var(--theme-border)",
          }}
          className={`${handwritten.className} w-full lg:w-[350px] lg:fixed lg:left-0 lg:top-[73px] lg:bottom-0 lg:z-30 lg:overflow-y-auto lg:border-r lg:border-t-0 lg:border-b-0 lg:border-l-0 lg:rounded-none p-6 lg:p-8 lg:shadow-none transition-all text-lg tracking-wide border rounded-2xl shadow-sm m-6 lg:m-0`}
        >
          <div
            style={{ borderBottomColor: "var(--theme-border)" }}
            className="border-b pb-4 mb-4"
          >
            <h2 className="text-2xl font-black tracking-wider uppercase text-sky-600 dark:text-sky-400">Global Parameters</h2>
            <p className="text-xs opacity-70 mt-1">Adjust all loaded assets together</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Color Parameter */}
            {showColor && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-bold opacity-80">
                  <span>Custom Color</span>
                  <span className="font-mono font-bold text-xs">{color}</span>
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
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="text-xs pointer-events-none font-black">+</span>
                  </div>
                </div>
              </div>
            )}

            {/* Force Color Toggle */}
            {showForceColor && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="forceColor"
                  checked={forceColor}
                  onChange={(e) => setForceColor(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                />
                <label
                  htmlFor="forceColor"
                  className="text-sm font-bold opacity-80 cursor-pointer select-none"
                >
                  Force custom color
                </label>
                <div className="group relative cursor-help text-xs opacity-50 flex items-center justify-center w-4 h-4 rounded-full border border-current font-sans font-bold">
                  i
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-950 text-white text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity leading-normal z-50 shadow-xl border border-slate-800 font-sans text-center font-semibold"
                  >
                    Even changes the fruits loading colors
                  </div>
                </div>
              </div>
            )}

            {/* Dimensions (Size) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-bold opacity-80">
                <span>Dimension (Size)</span>
                <span className="font-mono font-bold text-sm text-sky-600 dark:text-sky-400">{size}px</span>
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
            {showSpeed && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Timeline Speed</label>
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
                      className={`py-1 rounded-lg text-sm font-bold capitalize transition-all border ${
                        speed === s ? "shadow-sm" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dot & Wave element count */}
            {showElementCount && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-bold opacity-80">
                  <span>Element Count</span>
                  <span className="font-mono font-bold text-sm text-sky-600 dark:text-sky-400">{elementCount}</span>
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
            )}

            {/* Skeleton Animation parameter */}
            {showSkeleton && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Skeleton Shimmer</label>
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
                      className={`py-1 rounded-lg text-xs font-bold capitalize transition-all border ${
                        skeletonAnimate === anim ? "shadow-sm" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* General Playback Settings */}
            <div
              style={{ borderTopColor: "var(--theme-border)" }}
              className="border-t pt-4 mt-2 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold opacity-80">Play on Hover</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={playOnHover}
                    onChange={(e) => setPlayOnHover(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>
            </div>
          </div>

            {/* Dynamic Theme Color Customizer */}
            <div
              style={{ borderTopColor: "var(--theme-border)" }}
              className="border-t pt-4 mt-2 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-2xl font-black tracking-wider uppercase text-sky-600 dark:text-sky-400">UI Customizer</h3>
                <p className="text-xs opacity-70">Paint your own store colors</p>
              </div>

              {/* Canvas Background Color Picker */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold opacity-80">Canvas Background</span>
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
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold opacity-80">Card Background</span>
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
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold opacity-80">Dashboard Text</span>
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
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold opacity-80">Card & UI Borders</span>
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
                className="w-full py-1.5 rounded-lg text-xs font-bold tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-all border uppercase"
              >
                Reset UI Defaults
              </button>
            </div>

        </aside>

        {/* Assets Listing Area */}
        <main className="flex-1 w-full lg:ml-[350px] p-6 lg:p-8 flex flex-col gap-6">
          
          {/* Top minimal Search and Meta Info */}
          <div
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
            }}
            className="border rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="relative w-full md:max-w-md flex items-center">
              <span className="absolute left-3.5 opacity-55 pointer-events-none text-xs font-bold font-sans">Search</span>
              <input
                type="text"
                placeholder="loaders (e.g. spinner, pulse)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "rgba(0,0,0,0.03)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
                className="w-full text-xs py-2.5 pl-14 pr-4 rounded-xl border font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold opacity-75">
              <span>Showing {filteredAssets.length} of {assets.length} Package Assets</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {["All", "Classic", "Dots & Waves", "Skeletons", "Fruits", "Gaming", "Coding", "Space"].map((cat) => {
              const count = assets.filter(a => cat === "All" || getAssetCategory(a.family) === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  style={{
                    backgroundColor: selectedCategory === cat ? "var(--theme-text)" : "var(--theme-card-bg)",
                    color: selectedCategory === cat ? "var(--theme-card-bg)" : "var(--theme-text)",
                    borderColor: "var(--theme-border)",
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    selectedCategory === cat ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-60 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          {filteredAssets.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onMouseEnter={() => setHoveredCardId(asset.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
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
                      className="h-32 flex items-center justify-center p-6 border-b transition-colors relative overflow-hidden"
                    >
                      {/* Visual pattern grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                      <div className={`scale-105 select-none w-full h-full flex items-center justify-center ${
                        playOnHover && hoveredCardId !== asset.id ? "paused-animations" : ""
                      }`}>
                        {asset.render({
                          color,
                          size,
                          speed,
                          count: elementCount,
                          skeletonAnimate,
                          paused: playOnHover && hoveredCardId !== asset.id,
                        })}
                      </div>
                    </div>

                    {/* Asset details */}
                    <div className="p-4 flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold tracking-tight truncate flex-1">
                          {asset.name}
                        </h3>
                        
                        {/* GitHub Folder redirection */}
                        <a
                          href={`https://github.com/nanda-kshr/LoaderKit/tree/main/components/loaders/${asset.family}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`View ${asset.family} folder on GitHub`}
                          style={{
                            borderColor: "var(--theme-border)",
                            backgroundColor: "rgba(0,0,0,0.02)",
                          }}
                          className="w-7 h-7 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-sky-600 active:scale-95 flex items-center justify-center font-sans"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Minimalist Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 border-t pt-6" style={{ borderTopColor: "var(--theme-border)" }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    style={{
                      borderColor: "var(--theme-border)",
                      backgroundColor: "rgba(0,0,0,0.02)",
                      color: "var(--theme-text)",
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                      currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>←</span>
                    <span className="font-sans">Previous</span>
                  </button>
                  <span className="text-xs font-bold opacity-75 font-sans">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    style={{
                      borderColor: "var(--theme-border)",
                      backgroundColor: "rgba(0,0,0,0.02)",
                      color: "var(--theme-text)",
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                      currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="font-sans">Next</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
              className="border rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm"
            >
              <h3 className="text-sm font-bold">No Loader Assets Found</h3>
              <p className="text-xs mt-1 max-w-sm mx-auto leading-relaxed opacity-65">
                We couldn&apos;t find any loaders matching your search query &quot;{searchQuery}&quot;. Try modifying your keyword.
              </p>
            </div>
          )}

          {/* Footer */}
          <footer
            style={{
              borderTopColor: "var(--theme-border)",
              backgroundColor: "var(--theme-card-bg)",
            }}
            className="border-t py-8 mt-16 text-xs font-medium opacity-70 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
              <p>© 2026 Loading Library.</p>
              <div className="flex items-center gap-2">
                <span>Made with ♥ by</span>
                <a
                  href="https://github.com/nanda-kshr"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Nandakishore
                </a>
                <span>•</span>
                <a
                  href="https://github.com/nanda-kshr/LoaderKit"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-500 transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </footer>

        </main>

      </div>

      {/* Dynamic Integration Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text)",
            }}
            className="w-full max-w-lg border rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 gap-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderBottomColor: "var(--theme-border)" }}>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>Quick Start Guide</span>
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 font-extrabold transition-all active:scale-90"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-5 text-xs font-medium leading-relaxed">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-sky-600 dark:text-sky-400 text-sm">Step 1: Get the Code</h3>
                <p className="opacity-80">
                  Click the arrow (<code>→</code>) button next to any loader name on the cards to open its specific subdirectory on GitHub. Simply copy the React component and its <code>.module.css</code> file.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-sky-600 dark:text-sky-400 text-sm">Step 2: Import & Use</h3>
                <p className="opacity-80">
                  Drop both files in a directory of your choice inside your project, and import the loader like standard:
                </p>
                <pre className="bg-black/5 dark:bg-white/5 border p-3 rounded-lg font-mono text-[10px] whitespace-pre-wrap leading-normal" style={{ borderColor: "var(--theme-border)" }}>
                  {`import Spinner from "./components/loaders/Spinner";\n\nexport default function Page() {\n  return <Spinner variant="ring" size={40} color="#0284c7" />;\n}`}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              Let&apos;s build!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
