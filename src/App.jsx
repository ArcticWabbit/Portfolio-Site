import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dither from './components/Dither';
import Noise from './components/Noise';
import ASCIIText from './components/ASCIIText';

// -------------
// QUICK CONFIG
// -------------
const YOUR_NAME = "Maeen Mirza";
const GITHUB = "https://github.com/ArcticWabbit";
const EMAIL = "mmahin@svsu.edu";
const PHONE = "(989) 372-5691";
const RESUME_URL = "/Mirza_Resume_2025.docx";
const YT_VIDEO_ID = "dQw4w9WgXcQ"; // replace with demo video id

// Konami code listener
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

// Pong mini-game
function PongMiniGame({ open, onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width, h = canvas.height;
    const paddleH = 60, paddleW = 8;
    let p1y = (h - paddleH) / 2;
    let p2y = (h - paddleH) / 2;
    let by = h/2, bx = w/2, bvx = 3, bvy = 2, br = 4;
    let anim;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "#00ff90";
      for (let y=0;y<h;y+=10) ctx.fillRect(w/2-1, y, 2, 6);
      ctx.fillRect(10, p1y, paddleW, paddleH);
      ctx.fillRect(w-10-paddleW, p2y, paddleW, paddleH);
      ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill();
    };

    const step = () => {
      p2y += (by - (p2y + paddleH/2)) * 0.05;
      bx += bvx; by += bvy;
      if (by < br || by > h-br) bvy *= -1;
      if (bx-br < 10+paddleW && by>p1y && by<p1y+paddleH) { bvx = Math.abs(bvx); }
      if (bx+br > w-10-paddleW && by>p2y && by<p2y+paddleH) { bvx = -Math.abs(bvx); }
      if (bx < 0 || bx > w) { bx = w/2; by = h/2; bvx *= -1; }
      draw();
      anim = requestAnimationFrame(step);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      p1y = Math.max(0, Math.min(h - paddleH, e.clientY - rect.top - paddleH/2));
    };
    canvas.addEventListener("mousemove", onMouseMove);
    anim = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(anim); canvas.removeEventListener("mousemove", onMouseMove); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border-4 border-[var(--brand)] rounded-2xl p-4 w-[720px] max-w-full shadow-2xl">
        <div className="flex items-center justify-between text-[var(--brand)] font-mono">
          <span>PONG .exe</span>
          <button className="px-3 py-1 border border-[var(--brand)] hover:bg-[var(--brand)] hover:text-black" onClick={onClose}>EXIT</button>
        </div>
        <div className="mt-3">
          <canvas ref={canvasRef} width={680} height={360} className="w-full"/>
        </div>
        <p className="font-body text-body">Move your mouse to control the left paddle.</p>
      </div>
    </div>
  );
}

// CRT frame
function CRTFrame({ videoId }) {
  return (
    <div className="relative max-w-3xl mx-auto mt-8">
      <div className="aspect-video rounded-[20px] border-8 border-neutral-900 dark:border-neutral-100 
             bg-black overflow-hidden relative
             shadow-[inset_0_0_40px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.5)] 
             transform scale-[1.01] perspective-[600px] rotate-x-[1deg]">
        {/* YouTube video */}
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Noise overlay */}
        <Noise
          patternSize={200}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={8}
        />

        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_2px)] bg-[length:100%_4px]"></div>
      </div>
    </div>
  );
}

// Inventory item
function InventoryItem({ label, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-800/60 font-body"
    >
      <div className="text-xl">{icon}</div>
      <div className="text-lg">{label}</div>
    </motion.div>
  );
}

const PixelRule = () => <div className="my-8 h-2 bg-[repeating-linear-gradient(90deg,_#000_0_2px,_transparent_2px_4px)] dark:bg-[repeating-linear-gradient(90deg,_#fff_0_2px,_transparent_2px_4px)] opacity-30"/>;

function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 py-12">
      <h2 className='font-pixel text-heading mb-6 tracking-wider text-[var(--brand)]'>
        {title}
      </h2>
      {children}
    </section>
  );
}

function LevelItem({ level, title, sub, year }) {
  return (
    <div className="relative pl-10 pb-8 font-body">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[var(--brand)] shadow-[0_0_0_4px_rgba(26,120,109,.25)]"/>
      <div className="text-sm opacity-70">Lv.{level} · {year}</div>
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-lg opacity-80">{sub}</div>
    </div>
  );
}

export default function App() {
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
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <Dither
          waveColor={[0, 0.7, 0.55]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={8}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />

        <motion.div
          initial={false} // don’t animate on mount
          animate={{ width: entered ? "60%" : "47%" }} // expand on Start
          transition={{ duration: 0 }}
          className="absolute inset-y-0 left-0 bg-black dark:bg-neutral-900 left-mask"
        />
</div>

      {/* NAV */}
{/* NAV */}
<nav className="sticky top-0 z-40 backdrop-blur bg-white/50 dark:bg-neutral-900/40 border-b border-neutral-200/50 dark:border-neutral-700/50">
  <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
    {/* Brand stays Pixel */}
    <a href="#top" className="font-pixel tracking-widest text-sm text-[var(--brand)]">
      MM // PORTFOLIO
    </a>

    {/* Desktop Nav links */}
    <div className="hidden md:flex gap-4 text-base font-body">
      {[
        ["About","about"],["Skills","skills"],["Experience","experience"],
        ["Projects","projects"],["Video","video"],["Contact","contact"]
      ].map(([label, id]) => (
        <a key={id} href={`#${id}`} className="hover:text-[var(--brand)]">
          {label}
        </a>
      ))}
    </div>

    {/* GitHub link */}
    <div className="flex items-center gap-3 text-base font-body">
      <a href={GITHUB} className="hover:text-[var(--brand)]">GitHub</a>
    </div>
  </div>
</nav>


      {/* LANDING */}
      <header id="top" className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
          >
          <div className="relative mx-auto w-[600px] h-44">
            <ASCIIText
              text={YOUR_NAME}
              enableWaves={true}
              asciiFontSize={3}   // tweak for density
              textFontSize={50}
            />
          </div>

          <p className="font-body text-body opacity-90 -mt-6">
            Programmer • CS Major • Human
          </p>

          <div className="mt-8 h-16 flex justify-center items-center">
            <AnimatePresence>
              {!entered && (
                <>
                  {/* Start button */}
                  <motion.button
                    onClick={() => setEntered(true)}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-4 rounded-xl font-pixel text-xs text-[var(--brand)] border-[var(--brand)] shadow-[0_0_0_4px_rgba(0,0,0,0.2)]"
                  >
                    ▶ PRESS START
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {entered && (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="backdrop-blur-[1px]">
            
            {/* ABOUT */}
      <Section id="about" title="About">
        <div className="relative max-w-3xl mx-auto border-4 rounded-2xl p-4 
                        bg-neutral-100/90 dark:bg-neutral-800/80 
                        border-neutral-900/70 dark:border-neutral-100/60 
                        shadow-[0_0_0_6px_rgba(0,0,0,0.15)] overflow-hidden">

          {/* Noise overlay */}
          <Noise patternSize={200} patternAlpha={8} />

          {/* Content */}
          <div className="relative z-10">
            <div className="font-pixel text-heading mb-6 tracking-wider text-[var(--brand)]">NPC: Maeen</div>
            <p className="font-body text-body">
              Hey! I’m a Computer Science sophomore who loves making projects that are as fun to use as they are to build. 
              I’m aiming for a software/backend role and eventually game dev. I enjoy clean code, attention to detail, and building charming interfaces (like this one!).
            </p>
            <div className="mt-3 text-sm opacity-80">
              Based in Michigan • Email: <a className="underline text-[var(--brand)]" href={`mailto:${EMAIL}`}>{EMAIL}</a> • Phone: {PHONE}
            </div>
          </div>
        </div>
      </Section>

            <PixelRule />

            {/* SKILLS */}
            <Section id="skills" title="Skills / Inventory">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.map((s) => <InventoryItem key={s.label} {...s} />)}
              </div>
            </Section>

            <PixelRule />

            {/* EXPERIENCE */}
            <Section id="experience" title="Experience / Level Map">
              <div className="relative pl-4">
                <div className="absolute left-3 top-2 bottom-6 w-1 bg-gradient-to-b from-[var(--brand)]/80 to-transparent"/>
                <LevelItem level={3} year="2025–Present" title="Alumni Relations Intern — SVSU" sub="Data QA, content & event ops, reporting" />
                <LevelItem level={2} year="2024–2025" title="IT Support Help Desk — SVSU" sub="Troubleshooting, ticketing, remote support" />
                <LevelItem level={1} year="2023–2024" title="IT Manager — Raz Flour Mills" sub="Network & systems upkeep, team coordination" />
              </div>
            </Section>

            <PixelRule />

            {/* PROJECTS */}
<Section id="projects" title="Projects / Cartridge Shelf">
  <div className="grid sm:grid-cols-2 gap-6">
    {projects.map((p, idx) => (
      <a key={idx} href={p.href} target="_blank" rel="noreferrer" className="group block">
        <div
          className="relative h-48 rounded-2xl border-4 border-neutral-900/80 dark:border-neutral-100/60 
                     shadow-[0_8px_0_#1f2937] group-hover:-translate-y-1 transition-transform font-body 
                     overflow-hidden"
          style={{
            backgroundImage: `url(/cartridge.webp)`, // put cartridge.webp in /public
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >

            {/* Noise overlay */}
            <Noise patternAlpha={8} />

          <div className="absolute inset-0 bg-black/40 flex flex-col p-4">
            <div className="text-base opacity-60">{p.year}</div>
            <div className="mt-auto font-semibold text-xl">{p.title}</div>
            <div className="text-xs opacity-70">{p.code ? "Code & Demo" : "Live Demo"}</div>
          </div>
        </div>
      </a>
    ))}
  </div>
</Section>


            <PixelRule />

            {/* VIDEO */}
            <Section id="video" title="Demo Video">
              <CRTFrame videoId={YT_VIDEO_ID} />
            </Section>

            <PixelRule />

            {/* RESUME */}
<Section id="resume" title="Treasure Loot">
  <div className="flex flex-col items-center gap-6">
    {/* Download Resume Button */}
    <a
      href={RESUME_URL}
      className="px-8 py-4 border-4 rounded-2xl font-pixel text-sm md:text-base 
                 border-[var(--brand)] text-[var(--brand)] 
                 shadow-[0_0_0_6px_rgba(0,0,0,0.2)] 
                 hover:bg-[var(--brand)] hover:text-white transition"
    >
      🧰 Download Resume
    </a>

    {/* Achievement Badges */}
    <div className="grid sm:grid-cols-3 gap-3 text-sm font-body">
      <div className="px-4 py-2 rounded-xl border-[var(--brand)] bg-[var(--color-brand)] text-[var(--brand)] shadow-[0_0_0_6px_rgba(0,0,0,0.2)]">
        🏆 President’s List — Winter 2024
      </div>
      <div className="px-4 py-2 rounded-xl border-[var(--brand)] bg-[var(--color-brand)] text-[var(--brand)] 
                 shadow-[0_0_0_6px_rgba(0,0,0,0.2)]">
        🎓 CS50 Certificate — Harvard/edX
      </div>
      <div className="px-4 py-2 rounded-xl border-[var(--brand)] bg-[var(--color-brand)] text-[var(--brand)] 
                 shadow-[0_0_0_6px_rgba(0,0,0,0.2)]">
        🛡️ OOP & DB foundations
      </div>
    </div>
  </div>
</Section>


            <PixelRule />

            {/* CONTACT */}
            <Section id="contact" title="Message Board">
              <div className="max-w-3xl mx-auto border-4 rounded-2xl p-4 bg-neutral-100/90 dark:bg-neutral-800/80 border-neutral-900/70 dark:border-neutral-100/60">
                <form className="grid gap-3">
                  <input className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Your name" />
                  <input className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Email" />
                  <textarea rows={4} className="px-3 py-2 rounded-lg bg-white/70 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-700" placeholder="Quest details…" />
                  <button type="button" onClick={()=>window.location.href=`mailto:${EMAIL}`} className="justify-self-start px-5 py-2 border-4 rounded-xl font-pixel text-xs border-[var(--brand)] text-[var(--brand)]">📫 Send</button>
                </form>
                <div className="mt-3 text-xs opacity-70">
                  Or email me directly: <a className="underline text-[var(--brand)]" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
            </Section>

            {/* EGG */}
            {egg && (
              <Section id="secret" title="Secret Unlocked!">
                <div className="max-w-3xl mx-auto flex flex-col items-start gap-4">
                  <p className="font-body text-body opacity-90">Konami code discovered. You’ve unlocked the arcade room.</p>
                  <button onClick={()=>setShowPong(true)} className="px-4 py-2 border-4 rounded-xl font-pixel text-xs border-[var(--brand)] text-[var(--brand)]">▶ Launch PONG</button>
                </div>
              </Section>
            )}

            <footer className="py-12 text-center text-xs opacity-70">
              © {new Date().getFullYear()} {YOUR_NAME} · <a className="underline hover:text-[var(--brand)]" href={GITHUB}>GitHub</a>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Mini Game */}
      <PongMiniGame open={showPong} onClose={()=>setShowPong(false)} />

{/* Mobile Nav */}
<div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 
                backdrop-blur bg-white/60 dark:bg-neutral-900/60 
                border border-neutral-200 dark:border-neutral-700 
                rounded-full px-3 py-2 flex gap-3 text-base font-body">
  {[
    ["About","about"],["Skills","skills"],["XP","experience"],
    ["Work","projects"],["Video","video"],["Contact","contact"]
  ].map(([label, id]) => (
    <a key={id} href={`#${id}`} className="px-2 hover:text-[var(--brand)]">
      {label}
    </a>
  ))}
</div>

      <style>{`
        html { scroll-behavior: smooth; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      `}</style>
    </div>
  );
}
