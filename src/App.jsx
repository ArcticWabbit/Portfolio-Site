import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------
// QUICK CONFIG
// -------------
const YOUR_NAME = "Maeen Mirza";
const GITHUB = "https://github.com/ArcticWabbit";
const EMAIL = "mmahin@svsu.edu";
const PHONE = "(989) 372-5691";
const RESUME_URL = "/Mirza_Resume_2025.docx";
// If you host the background in /public/bg.png, set BACKGROUND_URL = "/bg.png"
const BACKGROUND_URL = "/fallen_kingdom_3840x2160.png"; // for local preview you may need to swap to a public URL
const YT_VIDEO_ID = "dQw4w9WgXcQ"; // replace with your demo video id (placeholder)

// Retro pixel font injection (Press Start 2P)
function usePressStartFont() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}

// Konami code listener (↑ ↑ ↓ ↓ ← → ← → B A)
function useKonami(onUnlock) {
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; 
    let ptr = 0;
    const onKey = (e) => {
      const k = e.key;
      if (k === seq[ptr]) {
        ptr++;
        if (ptr === seq.length) { onUnlock(); ptr = 0; }
      } else {
        ptr = k === seq[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onUnlock]);
}

// Tiny Pong game
function PongMiniGame({ open, onClose }) {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width, h = canvas.height;
    // Entities
    const paddleH = 60, paddleW = 8;
    let p1y = (h - paddleH) / 2;
    let p2y = (h - paddleH) / 2;
    let by = h/2, bx = w/2, bvx = 3, bvy = 2, br = 4;
    let anim;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "#00ff90"; // retro phosphor-green
      // Net
      for (let y=0;y<h;y+=10) ctx.fillRect(w/2-1, y, 2, 6);
      // Paddles
      ctx.fillRect(10, p1y, paddleW, paddleH);
      ctx.fillRect(w-10-paddleW, p2y, paddleW, paddleH);
      // Ball
      ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill();
    };

    const step = () => {
      // Simple AI
      p2y += (by - (p2y + paddleH/2)) * 0.05;
      // Physics
      bx += bvx; by += bvy;
      if (by < br || by > h-br) bvy *= -1;
      // Collisions paddles
      if (bx-br < 10+paddleW && by>p1y && by<p1y+paddleH) { bvx = Math.abs(bvx); }
      if (bx+br > w-10-paddleW && by>p2y && by<p2y+paddleH) { bvx = -Math.abs(bvx); }
      // Score reset
      if (bx < 0 || bx > w) { bx = w/2; by = h/2; bvx *= -1; }
      draw();
      anim = requestAnimationFrame(step);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      p1y = Math.max(0, Math.min(h - paddleH, e.clientY - rect.top - paddleH/2));
    };
    canvas.addEventListener("mousemove", onMouseMove);
    setRunning(true);
    anim = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener("mousemove", onMouseMove); setRunning(false); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border-4 border-green-400 rounded-2xl p-4 w-[720px] max-w-full shadow-2xl">
        <div className="flex items-center justify-between text-green-400 font-mono">
          <span>PONG .exe</span>
          <button className="px-3 py-1 border border-green-400 hover:bg-green-400 hover:text-black" onClick={onClose}>EXIT</button>
        </div>
        <div className="mt-3">
          <canvas ref={canvasRef} width={680} height={360} className="w-full"/>
        </div>
        <p className="text-green-400 mt-2 text-xs">Move your mouse to control the left paddle.</p>
      </div>
    </div>
  );
}

// CRT TV frame for YouTube embed
function CRTFrame({ videoId }) {
  return (
    <div className="relative max-w-3xl mx-auto mt-8">
      <div className="aspect-video rounded-[20px] border-8 border-neutral-900 dark:border-neutral-100 bg-black overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        <iframe
          className="w-full h-full" 
          src={`https://www.youtube.com/embed/${videoId}`} 
          title="YouTube video" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_2px)] bg-[length:100%_4px]"></div>
      </div>
      {/* knobs */}
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <div className="h-8 w-8 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow"/>
        <div className="h-8 w-8 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow"/>
      </div>
    </div>
  );
}

// Inventory grid item
function InventoryItem({ label, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-800/60">
      <div className="text-xl">{icon}</div>
      <div className="text-sm">{label}</div>
    </motion.div>
  );
}

// Day/night theme toggle
function DayNightToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed right-4 top-4 z-50 px-4 py-2 rounded-full border border-yellow-500/50 dark:border-blue-400/50 bg-yellow-100/70 dark:bg-blue-900/40 backdrop-blur text-xs"
      aria-label="Toggle day/night"
    >
      {theme === "dark" ? "🌞 Day" : "🌙 Night"}
    </button>
  );
}

// Pixel divider
const PixelRule = () => <div className="my-8 h-2 bg-[repeating-linear-gradient(90deg,_#000_0_2px,_transparent_2px_4px)] dark:bg-[repeating-linear-gradient(90deg,_#fff_0_2px,_transparent_2px_4px)] opacity-30"/>;

// Section wrapper
function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 py-12">
      <h2 className='text-2xl md:text-3xl mb-6 font-["Press_Start_2P",_monospace] tracking-wider'>
        {title}
      </h2>
      {children}
    </section>
  );
}


// Experience "level map" item
function LevelItem({ level, title, sub, year }) {
  return (
    <div className="relative pl-10 pb-8">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,.25)]"/>
      <div className="text-sm opacity-70">Lv.{level} · {year}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm opacity-80">{sub}</div>
    </div>
  );
}

export default function App() {
  usePressStartFont();
  const [theme, setTheme] = useState(() => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);

  const [entered, setEntered] = useState(false);
  const [egg, setEgg] = useState(false);
  const [showPong, setShowPong] = useState(false);
  useKonami(() => setEgg(true));

  const skills = useMemo(() => ([
    { label: "Python", icon: "🐍" },
    { label: "Java", icon: "☕" },
    { label: "C", icon: "🧰" },
    { label: "C#", icon: "🎮" },
    { label: "HTML/CSS", icon: "🧱" },
    { label: "SQL", icon: "🗄️" },
    { label: "Git/GitHub", icon: "🌿" },
    { label: "Linux", icon: "🐧" },
    { label: "VS Code", icon: "🧩" },
    { label: "OOP", icon: "🧠" },
    { label: "Databases", icon: "📚" },
    { label: "Tech Support", icon: "🛠️" },
  ]), []);

  const projects = [
    { title: "Art Blog Site", href: "https://www.cinnamongum.art", code: null, year: "2023" },
    { title: "Mario Clone (Clorio)", href: "https://github.com/ArcticWabbit/Clorio", code: "https://github.com/ArcticWabbit/Clorio", year: "2022" },
  ];

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* BACKGROUND HERO */}
      <div className="fixed inset-0 -z-10 opacity-90 dark:opacity-60 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          filter: theme === 'dark' ? 'brightness(0.6) contrast(1.1)' : 'brightness(1)',
        }}/>
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"/>
      </div>

      <DayNightToggle theme={theme} setTheme={setTheme} />

      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/50 dark:bg-neutral-900/40 border-b border-neutral-200/50 dark:border-neutral-700/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="#top" className="font-['Press_Start_2P'] tracking-widest text-xs">MM // PORTFOLIO</a>
          <div className="hidden md:flex gap-4 text-xs">
            {[
              ["About","about"],["Skills","skills"],["Experience","experience"],["Projects","projects"],["Video","video"],["Contact","contact"]
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:underline">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a href={GITHUB} className="hover:underline">GitHub</a>
          </div>
        </div>
      </nav>

      {/* LANDING / START SCREEN */}
      <header id="top" className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-3xl">
          <h1 className="font-['Press_Start_2P'] text-2xl md:text-4xl tracking-widest drop-shadow-lg">
            {YOUR_NAME}
          </h1>
          <p className="mt-4 text-sm md:text-base opacity-90">Retro RPG-themed portfolio • CS Sophomore • Backend/Game-dev curious</p>
          <motion.button
            onClick={() => setEntered(true)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
            className="mt-8 px-6 py-3 border-4 rounded-xl font-['Press_Start_2P'] text-xs bg-amber-100/80 dark:bg-emerald-900/40 border-amber-400/70 dark:border-emerald-400/60 shadow-[0_0_0_4px_rgba(0,0,0,0.2)]"
          >
            ▶ PRESS START
          </motion.button>
          <div className="mt-6 text-xs opacity-70">Use ↑ ↑ ↓ ↓ ← → ← → B A for a secret.</div>
        </motion.div>
      </header>

      <AnimatePresence>
        {entered && (
          <motion.main
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="backdrop-blur-[1px]"
          >
            {/* ABOUT (NPC DIALOG BOX) */}
            <Section id="about" title="About">
              <div className="max-w-3xl mx-auto border-4 rounded-2xl p-4 bg-neutral-100/90 dark:bg-neutral-800/80 border-neutral-900/70 dark:border-neutral-100/60 shadow-[0_0_0_6px_rgba(0,0,0,0.15)]">
                <div className="font-['Press_Start_2P'] text-xs mb-2">NPC: Maeen</div>
                <p className="leading-relaxed text-sm md:text-base">
                  Hey! I’m a Computer Science sophomore who loves turning ideas into little worlds you can click and play with. 
                  I’m aiming for a software/backend role and eventually game dev. I enjoy clean code, tiny details, and building charming interfaces (like this one!).
                </p>
                <div className="mt-3 text-sm opacity-80">Based in Michigan • Email: <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a> • Phone: {PHONE}</div>
              </div>
            </Section>

            <PixelRule />

            {/* SKILLS as inventory */}
            <Section id="skills" title="Skills / Inventory">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.map((s) => <InventoryItem key={s.label} {...s} />)}
              </div>
              <div className="mt-6 text-xs opacity-80">Cert: Harvard CS50 • President’s List (Winter 2024)</div>
            </Section>

            <PixelRule />

            {/* EXPERIENCE as level progression */}
            <Section id="experience" title="Experience / Level Map">
              <div className="relative pl-4">
                <div className="absolute left-3 top-2 bottom-6 w-1 bg-gradient-to-b from-emerald-400/80 to-transparent"/>
                <LevelItem level={3} year="2025–Present" title="Alumni Relations Intern — SVSU" sub="Data QA, content & event ops, reporting" />
                <LevelItem level={2} year="2024–2025" title="IT Support Help Desk — SVSU" sub="Troubleshooting, ticketing, remote support" />
                <LevelItem level={1} year="2023–2024" title="IT Manager — Raz Flour Mills" sub="Network & systems upkeep, team coordination" />
              </div>
            </Section>

            <PixelRule />

            {/* PROJECTS as cartridges */}
            <Section id="projects" title="Projects / Cartridge Shelf">
              <div className="grid sm:grid-cols-2 gap-6">
                {projects.map((p, idx) => (
                  <a key={idx} href={p.href} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative h-48 rounded-2xl border-4 border-neutral-900/80 dark:border-neutral-100/60 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 shadow-[0_8px_0_#1f2937] group-hover:-translate-y-1 transition-transform">
                      <div className="absolute inset-0 p-4 flex flex-col">
                        <div className="text-xs opacity-60">{p.year}</div>
                        <div className="mt-auto font-semibold text-lg">{p.title}</div>
                        <div className="text-xs opacity-70">{p.code ? 'Code & Demo' : 'Live Demo'}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Section>

            <PixelRule />

            {/* VIDEO in CRT */}
            <Section id="video" title="Demo Video">
              <CRTFrame videoId={YT_VIDEO_ID} />
            </Section>

            <PixelRule />

            {/* RESUME + ACHIEVEMENTS */}
            <Section id="resume" title="Treasure Loot">
              <div className="flex flex-col items-center gap-4">
                <a href={RESUME_URL} className="px-6 py-3 border-4 rounded-xl font-['Press_Start_2P'] text-xs bg-amber-100/80 dark:bg-sky-900/40 border-amber-400/70 dark:border-sky-400/60 shadow-[0_0_0_6px_rgba(0,0,0,0.2)]">
                  🧰 Download Resume
                </a>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="px-3 py-2 rounded-xl border border-yellow-400/60 bg-yellow-100/50 text-yellow-900">🏆 President’s List — Winter 2024</div>
                  <div className="px-3 py-2 rounded-xl border border-blue-400/60 bg-blue-100/50 text-blue-900">🎓 CS50 Certificate — Harvard/edX</div>
                  <div className="px-3 py-2 rounded-xl border border-emerald-400/60 bg-emerald-100/50 text-emerald-900">🛡️ OOP & DB foundations</div>
                </div>
              </div>
            </Section>

            <PixelRule />

            {/* CONTACT — message board */}
            <Section id="contact" title="Message Board">
              <div className="max-w-3xl mx-auto border-4 rounded-2xl p-4 bg-neutral-100/90 dark:bg-neutral-800/80 border-neutral-900/70 dark:border-neutral-100/60">
                <form className="grid gap-3">
                  <input className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Your name" />
                  <input className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Email" />
                  <textarea rows={4} className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Quest details…" />
                  <button type="button" onClick={()=>window.location.href=`mailto:${EMAIL}`} className="justify-self-start px-5 py-2 border-4 rounded-xl font-['Press_Start_2P'] text-xs bg-emerald-100/80 dark:bg-emerald-900/40 border-emerald-400/70 dark:border-emerald-400/60">📫 Send</button>
                </form>
                <div className="mt-3 text-xs opacity-70">Or email me directly: <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
              </div>
            </Section>

            {/* EGG */}
            {egg && (
              <Section id="secret" title="Secret Unlocked!">
                <div className="max-w-3xl mx-auto flex flex-col items-start gap-4">
                  <p className="text-sm opacity-90">Konami code discovered. You’ve unlocked the arcade room.</p>
                  <button onClick={()=>setShowPong(true)} className="px-4 py-2 border-4 rounded-xl font-['Press_Start_2P'] text-xs">▶ Launch PONG</button>
                </div>
              </Section>
            )}

            <footer className="py-12 text-center text-xs opacity-70">
              © {new Date().getFullYear()} {YOUR_NAME} · <a className="underline" href={GITHUB}>GitHub</a>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Mini Game Modal */}
      <PongMiniGame open={showPong} onClose={()=>setShowPong(false)} />

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-2 flex gap-3 text-xs">
        {[
          ["About","about"],["Skills","skills"],["XP","experience"],["Work","projects"],["Video","video"],["Contact","contact"]
        ].map(([label, id]) => (
          <a key={id} href={`#${id}`} className="px-2">{label}</a>
        ))}
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
        .font-\\[\"Press Start 2P\",_monospace] { font-family: 'Press Start 2P', monospace; }
        .font-\['Press_Start_2P'] { font-family: 'Press Start 2P', monospace; }
      `}</style>
    </div>
  );
}
