import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EnvelopeGate from './components/EnvelopeGate';
import RsvpChat from './components/RsvpChat';
import HostDashboard from './components/HostDashboard';
import { findGuestByCode } from './utils/guestDb';
import {
  Hero, Countdown, OurStory, Details, Schedule, Travel, DressCode, WeddingParty,
  Registry, FAQ, ThingsToDo, Guestbook, Footer
} from './components/Sections';
import { Gallery } from './components/Gallery';
import type { Palette } from './components/Sections';

// ── Tweakable defaults (persisted by host) ──────────────────
const TWEAKS = {
  "bride": "Nneka",
  "groom": "Opeyemi",
  "nick1": "Til",
  "nick2": "Deen",
  "date": "December 18, 2026",
  "venue": "Abuja",
  "paletteName": "Ivory, Sage & Chocolate",
  "typeSystem": "Wedding Editorial",
  "heroLayout": "split",
  "accents": "playful",
  "guestName": "Guest"
};

// ── Palettes ────────────────────────────────────────────────
const PALETTES: Record<string, Palette> = {
  'Ivory, Sage & Chocolate': { navy: '#3D2314', ivory: '#FFFFF0', ivoryDeep: '#F3EEE2', gold: '#657657', coral: '#9CAF88' },
  'Sage & Terracotta': { navy: '#2B4530', ivory: '#F7F3E9', ivoryDeep: '#EDE4CF', gold: '#8BBDD4', coral: '#C4663E' },
  'Navy & Ivory': { navy: '#16274F', ivory: '#F6EFD9', ivoryDeep: '#EEE4C3', gold: '#E8B04E', coral: '#D7604C' },
  'Midnight & Blush': { navy: '#1A1D3A', ivory: '#FBE8DC', ivoryDeep: '#F3D4C1', gold: '#E89B7A', coral: '#CC5C6A' },
  'Forest & Cream': { navy: '#1F3D2B', ivory: '#F5EFDF', ivoryDeep: '#E8DFC4', gold: '#D9A441', coral: '#C76A4E' },
  'Ink & Rose': { navy: '#111111', ivory: '#F9EDE5', ivoryDeep: '#F2DCD0', gold: '#D4A373', coral: '#E07A6B' },
};

// ── Type systems ────────────────────────────────────────────
const TYPE_SYSTEMS = {
  'Wedding Editorial': {
    serif: "'Cormorant Garamond', serif",
    script: "'Allura', cursive",
    sans: "'Manrope', sans-serif",
  },
  'Serif + Script + Sans': {
    serif: "'DM Serif Display', serif",
    script: "'Caveat', cursive",
    sans: "'DM Sans', sans-serif",
  },
  'Editorial (Fraunces + Space Grotesk)': {
    serif: "'Fraunces', serif",
    script: "'Caveat', cursive",
    sans: "'Space Grotesk', sans-serif",
  },
  'Classic (Playfair + DM Sans)': {
    serif: "'Playfair Display', serif",
    script: "'Caveat', cursive",
    sans: "'DM Sans', sans-serif",
  },
};

// ── Sections registry ───────────────────────────────────────
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Story' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Programme' },
  { id: 'travel', label: 'Travel & Stay' },
  { id: 'todo', label: 'Abuja Guide' },
  { id: 'dress', label: 'Dress Code' },
  { id: 'party', label: 'Wedding Party' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'registry', label: 'Registry' },
  { id: 'faq', label: 'FAQ' },
  { id: 'guestbook', label: 'Notes' },
];

// ── Menu drawer ─────────────────────────────────────────────
interface MenuProps {
  open: boolean;
  onClose: () => void;
  onJump: (id: string) => void;
  palette: Palette;
  onRsvp: () => void;
  onHostClick: () => void;
}

function Menu({ open, onClose, onJump, palette, onRsvp, onHostClick }: MenuProps) {
  const { navy, ivory, gold, coral } = palette;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: '#000',
        opacity: open ? 0.55 : 0, transition: 'opacity 0.35s ease-out',
      }}/>
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '82%', background: navy, color: ivory,
        transform: `translateX(${open ? 0 : 100}%)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '70px 28px 30px',
        display: 'flex', flexDirection: 'column', gap: 4,
        boxShadow: open ? '-10px 0 40px rgba(0,0,0,0.3)' : 'none',
      }}>
        <button
          onClick={onClose} 
          style={{
            position: 'absolute', top: 22, right: 22, background: 'none', border: 'none',
            color: ivory, fontSize: 32, cursor: 'pointer', padding: 0, lineHeight: 1,
            transition: 'transform 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >×</button>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: gold, letterSpacing: 2.4, textTransform: 'uppercase' }}>Til &amp; Deen</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, lineHeight: 1, margin: '5px 0 20px' }}>Wedding menu</div>
        <div className="hide-scroll" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map((s, idx) => (
            <button 
              key={s.id} 
              onClick={() => { onJump(s.id); onClose(); }} 
              className="nav-item"
              style={{
                background: 'none', border: 'none', color: ivory, padding: '12px 0',
                fontFamily: "'DM Serif Display', serif", fontSize: 23,
                textAlign: 'left', cursor: 'pointer', borderBottom: `1px solid ${ivory}12`,
                animationDelay: `${idx * 0.04}s`,
              }}
            >
              {s.label} <span style={{ opacity: 0.3, fontSize: 16, marginLeft: 8 }}>→</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => { onRsvp(); onClose(); }} 
          className="hover-lift"
          style={{
            marginTop: 20, padding: '15px',
            background: coral, color: navy, border: `2.5px solid ${ivory}`, borderRadius: 16,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 0.6, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(196, 102, 62, 0.25)',
          }}
        >RSVP NOW →</button>
        <button
          onClick={() => { onClose(); onHostClick(); }}
          style={{
            background: 'none', border: 'none', color: ivory, opacity: 0.35, fontSize: 10,
            cursor: 'pointer', textAlign: 'center', marginTop: 16, alignSelf: 'center',
            letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif"
          }}
        >
          Host Sign In
        </button>
      </div>
    </div>
  );
}

// ── Top bar (sticky) ────────────────────────────────────────
interface TopBarProps {
  onMenuClick: () => void;
  palette: Palette;
  onRsvp: () => void;
}

function TopBar({ onMenuClick, palette, onRsvp }: TopBarProps) {
  const { navy, ivory, coral } = palette;
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: `${palette.ivory}F0`, backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${navy}12`,
      padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: navy, fontWeight: 500 }}>
          Til <span style={{ fontFamily: "'Caveat', cursive", color: coral }}>&amp;</span> Deen
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: navy, opacity: 0.75, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          18 · 12 · 26
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onRsvp} style={{
          background: palette.navy, color: ivory, border: 'none', padding: '7px 14px', borderRadius: 20,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, cursor: 'pointer',
        }}>RSVP</button>
        <button onClick={onMenuClick} style={{
          background: 'none', border: `1.5px solid ${navy}`, width: 34, height: 34, borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="12" viewBox="0 0 16 12">
            <line x1="0" y1="2" x2="16" y2="2" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="6" x2="16" y2="6" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="10" x2="16" y2="10" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── RSVP sheet ──────────────────────────────────────────────
interface RsvpSheetProps {
  open: boolean;
  onClose: () => void;
  palette: Palette;
  guestName: string;
}

function RsvpSheet({ open, onClose, palette, guestName }: RsvpSheetProps) {
  return (
    <div
      className={open ? 'rsvp-sheet rsvp-sheet--open' : 'rsvp-sheet'}
      style={{
        '--sheet-ivory': palette.ivory,
        '--sheet-chocolate': palette.navy,
      } as React.CSSProperties}
      aria-hidden={!open}
    >
      <button className="rsvp-sheet__backdrop" type="button" onClick={onClose} aria-label="Close RSVP" />
      <aside className="rsvp-sheet__panel" role="dialog" aria-modal="true" aria-label="Wedding RSVP">
        <div className="rsvp-sheet__handle" aria-hidden="true" />
        <button className="rsvp-sheet__close" type="button" onClick={onClose} aria-label="Close RSVP">×</button>
        <div className="rsvp-sheet__content">
          {open && <RsvpChat guestName={guestName} palette={palette}/>}
        </div>
      </aside>
    </div>
  );
}

// ── Tweaks panel (dynamic options controller) ───────────────
interface TweaksPanelProps {
  tweaks: typeof TWEAKS;
  setTweaks: React.Dispatch<React.SetStateAction<typeof TWEAKS>>;
  visible: boolean;
}

function TweaksPanel({ tweaks, setTweaks, visible }: TweaksPanelProps) {
  if (!visible) return null;
  const push = (edits: Partial<typeof TWEAKS>) => {
    setTweaks(t => ({ ...t, ...edits }));
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch { /* optional editor bridge */ }
  };
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      width: 280, maxHeight: '80vh', overflow: 'auto',
      background: '#fff', borderRadius: 14, padding: 14,
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      fontFamily: 'ui-sans-serif, system-ui', fontSize: 12, color: '#111',
    }} className="hide-scroll">
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span>Tweaks</span>
        <span style={{ opacity: 0.5, fontWeight: 400 }}>Nneka &amp; Opeyemi</span>
      </div>
      <Field label="Palette">
        <select value={tweaks.paletteName} onChange={e => push({ paletteName: e.target.value })} style={sel}>
          {Object.keys(PALETTES).map(k => <option key={k}>{k}</option>)}
        </select>
      </Field>
      <Field label="Typography">
        <select value={tweaks.typeSystem} onChange={e => push({ typeSystem: e.target.value })} style={sel}>
          {Object.keys(TYPE_SYSTEMS).map(k => <option key={k}>{k}</option>)}
        </select>
      </Field>
      <Field label="Hero layout">
        <select value={tweaks.heroLayout} onChange={e => push({ heroLayout: e.target.value })} style={sel}>
          <option value="split">Split (photo + type)</option>
          <option value="photo">Full-bleed photo</option>
          <option value="typographic">Typography-forward</option>
        </select>
      </Field>
      <Field label="Accents">
        <select value={tweaks.accents} onChange={e => push({ accents: e.target.value })} style={sel}>
          <option value="playful">Playful (confetti, sparkles)</option>
          <option value="botanical">Botanical (florals, leaves)</option>
          <option value="minimal">Minimal (just dots)</option>
        </select>
      </Field>
      <Field label="Bride name"><input style={inp} value={tweaks.bride} onChange={e => push({ bride: e.target.value })}/></Field>
      <Field label="Groom name"><input style={inp} value={tweaks.groom} onChange={e => push({ groom: e.target.value })}/></Field>
      <Field label="Nickname 1"><input style={inp} value={tweaks.nick1} onChange={e => push({ nick1: e.target.value })}/></Field>
      <Field label="Nickname 2"><input style={inp} value={tweaks.nick2} onChange={e => push({ nick2: e.target.value })}/></Field>
      <Field label="Date"><input style={inp} value={tweaks.date} onChange={e => push({ date: e.target.value })}/></Field>
      <Field label="Venue"><input style={inp} value={tweaks.venue} onChange={e => push({ venue: e.target.value })}/></Field>
      <Field label="Guest name (for preview)"><input style={inp} value={tweaks.guestName} onChange={e => push({ guestName: e.target.value })}/></Field>
    </div>
  );
}

const sel = { width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', fontSize: 12, background: '#fff' };
const inp = { ...sel };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

// ── Main App Controller ─────────────────────────────────────
export default function App() {
  const initialHostMode = React.useMemo(() => {
    const code = new URL(window.location.href).searchParams.get('code')?.toLowerCase();
    return code === 'host' || code === '181226';
  }, []);
  const [tweaks, setTweaks] = React.useState(TWEAKS);
  const [unlocked, setUnlocked] = React.useState(initialHostMode);
  const [gateMounted, setGateMounted] = React.useState(!initialHostMode);
  const [menu, setMenu] = React.useState(false);
  const [rsvp, setRsvp] = React.useState(false);
  const [tweakMode, setTweakMode] = React.useState(false);
  const [hostMode, setHostMode] = React.useState(initialHostMode);
  const [resolvedGuestName, setResolvedGuestName] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const guestName = React.useMemo(() => {
    if (resolvedGuestName) return resolvedGuestName;
    try {
      const code = new URL(window.location.href).searchParams.get('code');
      if (code) {
        const match = findGuestByCode(code);
        if (match) return match.name;

        const map: Record<string, string> = { adaeze: 'Adaeze', kola: 'Kola', amina: 'Amina' };
        return map[code.toLowerCase()] || tweaks.guestName;
      }
    } catch { /* fall back to the configured guest label */ }
    return tweaks.guestName;
  }, [resolvedGuestName, tweaks.guestName]);

  const palette = PALETTES[tweaks.paletteName] || PALETTES['Ivory, Sage & Chocolate'];
  const type = TYPE_SYSTEMS[tweaks.typeSystem as keyof typeof TYPE_SYSTEMS] || TYPE_SYSTEMS['Wedding Editorial'];

  // Tweaks messaging protocol
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === '__activate_edit_mode') setTweakMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweakMode(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch { /* optional editor bridge */ }
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Inject type overrides
  React.useEffect(() => {
    const s = document.getElementById('type-overrides') || (() => {
      const el = document.createElement('style');
      el.id = 'type-overrides';
      document.head.appendChild(el);
      return el;
    })();
    s.textContent = `
      .app-scope [style*="DM Serif Display"] { font-family: ${type.serif} !important; }
      .app-scope [style*="Caveat"] { font-family: ${type.script} !important; }
      .app-scope [style*="DM Sans"] { font-family: ${type.sans} !important; }
    `;
  }, [type]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' });
    }
  };

  const isDesktopSplit = vw >= 960;

  const handleHostLogin = () => {
    const code = prompt("Enter Host Passcode:");
    if (code && (code.toLowerCase() === 'host' || code.toLowerCase() === '181226')) {
      setHostMode(true);
      setUnlocked(true);
      setGateMounted(false);
      toast.info(`Logged in as host. Welcome back.`, {
        position: "top-center",
        autoClose: 3000
      });
      const url = new URL(window.location.href);
      url.searchParams.set('code', 'host');
      window.history.replaceState({}, '', url.toString());
    } else if (code) {
      alert("Incorrect passcode.");
    }
  };

  const appContent = hostMode ? (
    <HostDashboard
      palette={palette}
      onExit={() => {
        setHostMode(false);
        setUnlocked(false);
        setGateMounted(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.replaceState({}, '', url.toString());
      }}
    />
  ) : (
    <div style={{ position: 'relative', height: '100%' }}>
      {unlocked && (
        <div 
          ref={isDesktopSplit ? null : scrollRef} 
          className="hide-scroll app-scope" 
          style={{
            height: '100%', 
            overflow: isDesktopSplit ? 'hidden' : 'auto', 
            background: palette.ivory, 
            position: 'relative',
            opacity: unlocked ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        >
          {isDesktopSplit ? (
            <div style={{ display: 'flex', height: '100%', width: '100%' }}>
              <div className="hide-scroll" style={{
                width: '38%',
                height: '100%',
                background: palette.navy,
                color: palette.ivory,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px 28px',
                borderRight: `1.5px solid ${palette.gold}28`,
                boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
                position: 'relative',
                overflowY: 'auto',
                flexShrink: 0,
              }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 14, border: `1px solid ${palette.ivory}18`, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 23, color: palette.ivory, letterSpacing: -0.2 }}>Til &amp; Deen</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: palette.ivory, opacity: 0.65, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>
                      December 18, 2026
                    </div>
                  </div>
                </div>
                <div style={{ margin: '12px 0', textAlign: 'center', position: 'relative', zIndex: 2, padding: '10px 0' }}>
                  <div style={{ 
                    maxWidth: '180px', 
                    maxHeight: '22vh', 
                    margin: '0 auto 16px', 
                    borderRadius: 0,
                    overflow: 'hidden', 
                    border: `1px solid ${palette.ivory}66`,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    aspectRatio: '1/1'
                  }}>
                    <img src="images/couple_hero.png" alt="Nneka & Opeyemi" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: palette.gold, letterSpacing: 2.2, textTransform: 'uppercase' }}>
                    Welcome, {guestName.split(' ')[0]}
                  </div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: palette.ivory, lineHeight: .92, marginTop: 9 }}>
                    Til <span style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: palette.coral }}>&amp;</span> Deen
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: palette.ivory, opacity: 0.75, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 8 }}>
                    Abuja, Nigeria
                  </div>
                </div>
                <div style={{ 
                  position: 'relative', zIndex: 2, 
                  background: 'transparent',
                  borderRadius: 0,
                  border: 'none',
                  padding: 0
                }}>
                  <Countdown palette={palette} />
                </div>
              </div>
              <div 
                ref={scrollRef} 
                className="hide-scroll" 
                style={{
                  flex: 1,
                  height: '100%',
                  overflow: 'auto',
                  background: palette.ivory,
                  position: 'relative',
                }}
              >
                <TopBar onMenuClick={() => setMenu(true)} palette={palette} onRsvp={() => setRsvp(true)}/>
                <div id="sec-story"><OurStory palette={palette}/></div>
                <div id="sec-details"><Details palette={palette}/></div>
                <div id="sec-schedule"><Schedule palette={palette}/></div>
                <div id="sec-travel"><Travel palette={palette}/></div>
                <div id="sec-todo"><ThingsToDo palette={palette}/></div>
                <div id="sec-dress"><DressCode palette={palette}/></div>
                <div id="sec-party"><WeddingParty palette={palette}/></div>
                <div id="sec-gallery"><Gallery palette={palette}/></div>
                <div id="sec-registry"><Registry palette={palette}/></div>
                <div id="sec-faq"><FAQ palette={palette}/></div>
                <div id="sec-guestbook"><Guestbook palette={palette}/></div>
                <Footer palette={palette}/>
              </div>
            </div>
          ) : (
            <>
              <TopBar onMenuClick={() => setMenu(true)} palette={palette} onRsvp={() => setRsvp(true)}/>
              <div id="sec-home"><Hero palette={palette} guestName={guestName} heroLayout={tweaks.heroLayout}/></div>
              <Countdown palette={palette}/>
              <div id="sec-story"><OurStory palette={palette}/></div>
              <div id="sec-details"><Details palette={palette}/></div>
              <div id="sec-schedule"><Schedule palette={palette}/></div>
              <div id="sec-travel"><Travel palette={palette}/></div>
              <div id="sec-todo"><ThingsToDo palette={palette}/></div>
              <div id="sec-dress"><DressCode palette={palette}/></div>
              <div id="sec-party"><WeddingParty palette={palette}/></div>
              <div id="sec-gallery"><Gallery palette={palette}/></div>
              <div id="sec-registry"><Registry palette={palette}/></div>
              <div id="sec-faq"><FAQ palette={palette}/></div>
              <div id="sec-guestbook"><Guestbook palette={palette}/></div>
              <Footer palette={palette}/>
            </>
          )}
        </div>
      )}
      {gateMounted && (
        <EnvelopeGate 
          guestName={guestName} 
          palette={palette} 
          onGuestResolved={(guest) => setResolvedGuestName(guest.name)}
          onHostUnlock={() => {
            setHostMode(true);
            setUnlocked(true);
            setGateMounted(false);
            toast.info(`Logged in as host. Welcome back.`, {
              position: "top-center",
              autoClose: 3000,
              theme: "colored"
            });
          }}
          onUnlock={() => {
            setUnlocked(true);
            setTimeout(() => {
              setGateMounted(false);
            }, 1200); 
          }}
        />
      )}
      <Menu
        open={menu}
        onClose={() => setMenu(false)}
        onJump={jumpTo}
        palette={palette}
        onRsvp={() => setRsvp(true)}
        onHostClick={handleHostLogin}
      />
      <RsvpSheet open={rsvp} onClose={() => setRsvp(false)} palette={palette} guestName={guestName}/>
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: '100%', height: '100%', background: palette.ivory }}>
        {appContent}
      </div>
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweakMode}/>
      <ToastContainer />
    </div>
  );
}
