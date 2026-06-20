import React from 'react';

interface Palette {
  navy: string;
  ivory: string;
  ivoryDeep: string;
  gold: string;
  coral: string;
}

interface EnvelopeGateProps {
  guestName: string;
  onUnlock: () => void;
  palette: Palette;
}

export default function EnvelopeGate({ guestName = 'Dear Guest', onUnlock, palette }: EnvelopeGateProps) {
  const [stage, setStage] = React.useState<'idle' | 'opening' | 'done'>('idle');
  const [animStep, setAnimStep] = React.useState<'closed' | 'splitting' | 'opening-flap' | 'sliding-card' | 'zooming-card' | 'done'>('closed');
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState(false);
  const [mouse, setMouse] = React.useState({ x: 50, y: 50, tiltX: 0, tiltY: 0 });

  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('code')) {
      setTimeout(() => handleOpen(true), 800);
    }
  }, []);

  const isOpen = stage !== 'idle';

  // Track mouse for localized cloth effect
  React.useEffect(() => {
    if (isOpen) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = (e.clientX / innerWidth) * 100;
      const yPct = (e.clientY / innerHeight) * 100;
      // Tilt: -6 to +6 degrees based on mouse offset from center
      const tiltY = ((e.clientX / innerWidth) - 0.5) * 12;
      const tiltX = -((e.clientY / innerHeight) - 0.5) * 8;
      setMouse({ x: xPct, y: yPct, tiltX, tiltY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isOpen]);

  const handleOpen = (skipCheck = false) => {
    if (!skipCheck) {
      if (code.trim().toLowerCase() !== 'tildeen' && code.trim() !== '1812') {
        setErr(true);
        setTimeout(() => setErr(false), 800);
        return;
      }
    }
    
    setStage('opening');
    setAnimStep('splitting');
    
    setTimeout(() => {
      setAnimStep('opening-flap');
    }, 500); 
    
    setTimeout(() => {
      setAnimStep('sliding-card');
    }, 1300); 
    
    setTimeout(() => {
      setAnimStep('zooming-card');
      onUnlock();
    }, 2300); 
    
    setTimeout(() => {
      setAnimStep('done');
      setStage('done');
    }, 3100); 
  };

  const { ivory, ivoryDeep, navy, coral, gold } = palette;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden', zIndex: 100,
      background: navy,
      opacity: (animStep === 'zooming-card' || animStep === 'done') ? 0 : 1,
      transition: 'opacity 0.8s ease-in-out',
      pointerEvents: (animStep === 'zooming-card' || animStep === 'done') ? 'none' : 'auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Woven Fabric Background with 3D cloth tilt */}
      <div style={{
        position: 'absolute',
        inset: -30,
        pointerEvents: 'none',
        zIndex: 2,
        perspective: '800px',
        perspectiveOrigin: `${mouse.x}% ${mouse.y}%`,
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          opacity: isOpen ? 0.05 : 0.2,
          transition: isOpen
            ? 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out'
            : 'opacity 0.3s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: isOpen
            ? 'rotateX(0deg) rotateY(0deg)'
            : `rotateX(${mouse.tiltX}deg) rotateY(${mouse.tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="attirePattern" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Horizontal woven threads */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y}
                  stroke={gold} strokeWidth={y % 20 === 0 ? '0.8' : '0.4'}
                  strokeOpacity={y % 20 === 0 ? 0.7 : 0.35} />
              ))}
              {/* Vertical woven threads */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100"
                  stroke={gold} strokeWidth={x % 20 === 0 ? '0.8' : '0.4'}
                  strokeOpacity={x % 20 === 0 ? 0.7 : 0.35} />
              ))}

              {/* Embroidered diamond motif */}
              <polygon points="50,10 90,50 50,90 10,50" stroke={ivory} strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
              <polygon points="50,20 80,50 50,80 20,50" stroke={coral} strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
              <polygon points="50,30 70,50 50,70 30,50" stroke={ivory} strokeWidth="0.5" fill="none" strokeOpacity="0.3" />

              {/* Center stitch mark */}
              <path d="M47,50 L53,50 M50,47 L50,53" stroke={ivory} strokeWidth="0.8" strokeOpacity="0.5" />

              {/* Corner triangle stitches */}
              <polygon points="0,12 12,0 0,0" stroke={coral} strokeWidth="0.6" fill={coral} fillOpacity="0.08" />
              <polygon points="100,12 88,0 100,0" stroke={coral} strokeWidth="0.6" fill={coral} fillOpacity="0.08" />
              <polygon points="0,88 12,100 0,100" stroke={coral} strokeWidth="0.6" fill={coral} fillOpacity="0.08" />
              <polygon points="100,88 88,100 100,100" stroke={coral} strokeWidth="0.6" fill={coral} fillOpacity="0.08" />

              {/* Small cross-stitch details */}
              <path d="M24,24 L26,26 M26,24 L24,26" stroke={ivory} strokeWidth="0.6" strokeOpacity="0.4" />
              <path d="M74,24 L76,26 M76,24 L74,26" stroke={ivory} strokeWidth="0.6" strokeOpacity="0.4" />
              <path d="M24,74 L26,76 M26,74 L24,76" stroke={ivory} strokeWidth="0.6" strokeOpacity="0.4" />
              <path d="M74,74 L76,76 M76,74 L74,76" stroke={ivory} strokeWidth="0.6" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#attirePattern)" />
        </svg>
        </div>
      </div>

      <div style={{
        perspective: '1200px',
        width: 320,
        height: 220,
        margin: '0 auto 40px',
        position: 'relative',
        transform: isOpen ? 'translateY(110px)' : 'translateY(0) scale(1)',
        transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: ivoryDeep,
          border: `1.5px solid ${navy}30`,
          borderRadius: 8,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          zIndex: 1,
        }} />

        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: 300,
          height: 200,
          borderRadius: 8,
          background: `radial-gradient(circle at 50% 50%, #fff 0%, ${ivory} 100%)`,
          border: `1.8px solid ${navy}`,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.1)',
          padding: '16px 12px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: animStep === 'zooming-card'
            ? 'translateY(-125px) scale(4.2)'
            : animStep === 'sliding-card'
              ? 'translateY(-130px) scale(0.96)'
              : 'translateY(0) scale(0.95)',
          opacity: 1,
          zIndex: (animStep === 'sliding-card' || animStep === 'zooming-card') ? 15 : 5,
          transition: animStep === 'zooming-card'
            ? 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 1.1s cubic-bezier(0.34, 1.3, 0.64, 1), z-index 0s 0.6s',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%2316274f' fill-opacity='0.015' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}>
          <div style={{
            position: 'absolute', inset: 4,
            border: `1px solid ${gold}80`,
            borderRadius: 6,
            pointerEvents: 'none',
          }} />

          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: coral, marginBottom: 2 }}>
            Save the Date
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 23, color: navy, lineHeight: 1.1 }}>
            Nneka &amp; Opeyemi
          </div>
          <div style={{ width: 60, height: 1, background: `${gold}`, margin: '8px 0' }} />
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 1.5, color: navy, textTransform: 'uppercase', opacity: 0.8 }}>
            Abuja · Nigeria
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: coral, marginTop: 4 }}>
            18 · 12 · 2026
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 12, color: navy, opacity: 0.6, marginTop: 6 }}>
            Official Invitation Inside
          </div>
        </div>

        <svg width="320" height="220" viewBox="0 0 320 220" style={{
          position: 'absolute', inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <path d="M0 0 L160 110 L0 220 Z" fill="#F0E8D5" stroke={`${navy}22`} strokeWidth="1.5" />
          <path d="M320 0 L160 110 L320 220 Z" fill="#F0E8D5" stroke={`${navy}22`} strokeWidth="1.5" />
          <path d="M0 220 L160 110 L320 220 Z" fill="#EAE0C7" stroke={`${navy}33`} strokeWidth="1.5" />
        </svg>

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 320,
          height: 110,
          transformOrigin: 'top center',
          transform: (animStep !== 'closed' && animStep !== 'splitting')
            ? 'rotateX(180deg)'
            : 'rotateX(0deg)',
          zIndex: (animStep !== 'closed' && animStep !== 'splitting') ? 2 : 12,
          transition: 'transform 0.9s cubic-bezier(0.5, 0, 0.2, 1), z-index 0s 0.45s',
          transformStyle: 'preserve-3d',
        }}>
          <svg width="320" height="110" viewBox="0 0 320 110" style={{ display: 'block' }}>
            <path d="M0 0 L160 110 L320 0 Z" fill="#EDE4CF" stroke={`${navy}22`} strokeWidth="1.5" />
          </svg>
        </div>

        {animStep === 'closed' && (
          <div
            onClick={() => handleOpen()}
            style={{
              position: 'absolute',
              top: 110,
              left: 160,
              width: 52,
              height: 52,
              transform: 'translate(-50%, -50%)',
              zIndex: 13,
              cursor: 'pointer',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          >
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="23" fill={coral} stroke={navy} strokeWidth="1.5" />
              <circle cx="26" cy="26" r="19" fill="none" stroke={gold} strokeWidth="1.2" strokeDasharray="3 2" />
              <text x="26" y="31" textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="13" fill={navy} fontWeight="bold" letterSpacing="0.2">T&amp;D</text>
            </svg>
          </div>
        )}

        {(animStep === 'splitting' || animStep === 'opening-flap') && (
          <>
            <div style={{
              position: 'absolute',
              top: 84,
              left: 134,
              width: 26,
              height: 52,
              zIndex: 13,
              overflow: 'hidden',
              transform: animStep !== 'splitting'
                ? 'translateX(-60px) translateY(10px) rotate(-35deg) scale(0.7)'
                : 'translateX(0) rotate(0)',
              opacity: animStep !== 'splitting' ? 0 : 1,
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
              pointerEvents: 'none',
            }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ marginLeft: 0 }}>
                <circle cx="26" cy="26" r="23" fill={coral} stroke={navy} strokeWidth="1.5" />
                <circle cx="26" cy="26" r="19" fill="none" stroke={gold} strokeWidth="1.2" strokeDasharray="3 2" />
                <text x="26" y="31" textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="13" fill={navy} fontWeight="bold">T&amp;D</text>
              </svg>
            </div>
            <div style={{
              position: 'absolute',
              top: 84,
              left: 160,
              width: 26,
              height: 52,
              zIndex: 13,
              overflow: 'hidden',
              transform: animStep !== 'splitting'
                ? 'translateX(60px) translateY(10px) rotate(35deg) scale(0.7)'
                : 'translateX(0) rotate(0)',
              opacity: animStep !== 'splitting' ? 0 : 1,
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
              pointerEvents: 'none',
            }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ marginLeft: -26 }}>
                <circle cx="26" cy="26" r="23" fill={coral} stroke={navy} strokeWidth="1.5" />
                <circle cx="26" cy="26" r="19" fill="none" stroke={gold} strokeWidth="1.2" strokeDasharray="3 2" />
                <text x="26" y="31" textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="13" fill={navy} fontWeight="bold">T&amp;D</text>
              </svg>
            </div>
          </>
        )}
      </div>

      <div style={{
        padding: '0 22px',
        zIndex: 20,
        opacity: isOpen ? 0 : 1,
        transform: isOpen ? 'translateY(40px)' : 'translateY(0)',
        transition: 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        pointerEvents: isOpen ? 'none' : 'auto',
        width: '100%',
        maxWidth: 360,
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 28,
          padding: '24px 22px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
          animation: err ? 'shake 0.45s' : 'none',
        }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: gold, marginBottom: 4 }}>
            you're invited,
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: ivory, lineHeight: 1.1, marginBottom: 16 }}>
            {guestName}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: ivory, opacity: 0.6, letterSpacing: 0.5, marginBottom: 14 }}>
            enter your invitation code to open
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
              placeholder="e.g. tildeen"
              style={{
                flex: 1, height: 46, padding: '0 16px',
                border: `1.8px solid ${err ? coral : 'rgba(255,255,255,0.18)'}`,
                borderRadius: 14, outline: 'none',
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                background: 'rgba(255, 255, 255, 0.06)', 
                color: '#fff',
                textAlign: 'center', 
                letterSpacing: 1.5,
                transition: 'all 0.3s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = gold}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
            />
            <button
              onClick={() => handleOpen()}
              style={{
                height: 46, padding: '0 20px',
                background: coral, color: navy, border: 'none', borderRadius: 14,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                letterSpacing: 0.6, cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(196, 102, 62, 0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = '#e27b53';
                target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = coral;
                target.style.transform = 'none';
              }}
            >Open</button>
          </div>
          <div style={{ marginTop: 12, fontFamily: "'Caveat', cursive", fontSize: 15, color: gold, opacity: 0.8 }}>
            hint: try <span style={{ fontWeight: 600, textDecoration: 'underline' }}>tildeen</span> ✨
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: none; }
          15% { transform: translateX(-8px) rotate(-1.5deg); }
          30% { transform: translateX(7px) rotate(1.5deg); }
          45% { transform: translateX(-6px) rotate(-1deg); }
          60% { transform: translateX(5px) rotate(1deg); }
          75% { transform: translateX(-3px); }
        }
      `}</style>
    </div>
  );
}
