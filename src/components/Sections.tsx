import React from 'react';
import { 
  Squiggle, Underline, Floral, Leaf, Sparkle, Dot, Heart 
} from './Accents';

export interface Palette {
  navy: string;
  ivory: string;
  ivoryDeep: string;
  gold: string;
  coral: string;
}

interface FadeInSectionProps {
  children: React.ReactNode;
}

interface PlaceholderImgProps {
  label: string;
  ratio?: string;
  palette: Palette;
  rotate?: number;
}

interface SectionHeaderProps {
  kicker: string;
  title: string;
  palette: Palette;
  accent?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface SectionProps {
  palette: Palette;
}

interface HeroProps extends SectionProps {
  guestName: string;
  heroLayout: string;
}

// ── Fade In On Scroll Wrapper ──
export function FadeInSection({ children }: FadeInSectionProps) {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);
  
  return (
    <div
      ref={domRef}
      className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
}

// ── Upgraded Image Card ──
export function PlaceholderImg({ label, ratio = '4/5', palette, rotate = 0 }: PlaceholderImgProps) {
  const { navy, ivoryDeep, gold } = palette;
  
  const imageMap: Record<string, string> = {
    'couple photo': 'images/couple_hero.png',
    'Til & Deen · full-bleed couple photo': 'images/couple_hero.png',
    'first date': 'images/lagos_coffee.png',
    'engagement': 'images/zuma_rock_proposal.png',
    'the proposal': 'images/zuma_rock_proposal.png',
    'travels': 'images/travels.png',
    'us': 'images/couple_hero.png',
    'family': 'images/venue.png',
  };

  const resolvedKey = Object.keys(imageMap).find(k => 
    k.toLowerCase() === label.toLowerCase() || 
    label.toLowerCase().includes(k.toLowerCase())
  );
  const imgSrc = resolvedKey ? imageMap[resolvedKey] : null;

  if (imgSrc) {
    return (
      <div 
        className="hover-lift"
        style={{
          aspectRatio: ratio,
          borderRadius: 14,
          border: `1.8px solid ${navy}`,
          overflow: 'hidden',
          position: 'relative',
          transform: `rotate(${rotate}deg)`,
          boxShadow: '0 10px 25px rgba(22, 45, 90, 0.12)',
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
          background: ivoryDeep,
        }}
      >
        <img 
          src={imgSrc} 
          alt={label} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, rgba(22, 39, 79, 0.25) 0%, transparent 60%)`,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          padding: '4px 10px', borderRadius: 8,
          border: `1px solid ${navy}18`,
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
          color: navy, textTransform: 'uppercase', letterSpacing: 0.6
        }}>
          {label}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      aspectRatio: ratio, background: ivoryDeep,
      border: `1.8px solid ${navy}`, borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Serif Display', serif",
      fontSize: 16, color: navy,
      transform: `rotate(${rotate}deg)`,
      textAlign: 'center', padding: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ opacity: 0.12, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Floral color={gold} size={130} />
      </div>
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </div>
  );
}

// ── Redesigned Section Header ──
export function SectionHeader({ kicker, title, palette, accent, align = 'left' }: SectionHeaderProps) {
  const { navy, gold } = palette;
  return (
    <div style={{ marginBottom: 24, textAlign: align }}>
      <div style={{
        fontFamily: "'Caveat', cursive", fontSize: 26, color: gold,
        transform: 'rotate(-1.5deg)', display: 'inline-block', whiteSpace: 'nowrap',
        letterSpacing: 1,
      }}>{kicker}</div>
      <div style={{
        fontFamily: "'DM Serif Display', serif", fontSize: 36, color: navy,
        lineHeight: 1.05, letterSpacing: -0.6, marginTop: 4,
      }}>{title}</div>
      {accent && <div style={{ marginTop: 8, display: align === 'center' ? 'flex' : 'block', justifyContent: 'center' }}>{accent}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO — Floating animation leaves
// ─────────────────────────────────────────────────────────────
export function Hero({ palette, guestName, heroLayout }: HeroProps) {
  const { navy, ivory, gold, coral } = palette;

  const floatLeafStyle = (delay: string): React.CSSProperties => ({
    position: 'absolute',
    opacity: 0.35,
    animation: 'floatLeaf 7s infinite ease-in-out',
    animationDelay: delay,
    pointerEvents: 'none',
  });

  const leafStyleBlock = (
    <style>{`
      @keyframes floatLeaf {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-12px) rotate(8deg); }
      }
    `}</style>
  );

  if (heroLayout === 'photo') {
    return (
      <section style={{ position: 'relative', padding: '32px 22px 40px', background: ivory, overflow: 'hidden' }}>
        {leafStyleBlock}
        <div style={{ ...floatLeafStyle('0s'), top: 20, right: 10 }}><Leaf color={coral} size={65} /></div>
        <div style={{ ...floatLeafStyle('2s'), bottom: 100, left: -10, transform: 'rotate(45deg)' }}><Leaf color={gold} size={75} /></div>
        
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: navy, opacity: 0.8, transform: 'rotate(-2deg)' }}>
          welcome, {guestName.split(' ')[0]}!
        </div>
        <div style={{ marginTop: 18, position: 'relative' }}>
          <PlaceholderImg label="Til &amp; Deen · full-bleed couple photo" ratio="4/5" palette={palette}/>
          <div style={{
            position: 'absolute', bottom: -12, right: -6, background: coral, borderRadius: '50%',
            width: 70, height: 70, border: `2px solid ${navy}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            transform: 'rotate(-8deg)', fontFamily: "'DM Sans', sans-serif", color: navy,
            boxShadow: '0 8px 16px rgba(196, 102, 62, 0.3)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2 }}>DEC</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, lineHeight: 1 }}>18</div>
            <div style={{ fontSize: 7, letterSpacing: 0.5, fontWeight: 600 }}>2026</div>
          </div>
        </div>
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: gold, transform: 'rotate(-2deg)' }}>the wedding of</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: navy, lineHeight: 1.05, marginTop: 4 }}>
            Til <span style={{ fontFamily: "'Caveat', cursive", fontSize: 38, color: coral }}>&amp;</span> Deen
          </div>
        </div>
      </section>
    );
  }

  if (heroLayout === 'typographic') {
    return (
      <section style={{ background: ivory, padding: '70px 22px 50px', position: 'relative', overflow: 'hidden' }}>
        {leafStyleBlock}
        <div style={{ position: 'absolute', top: 30, left: -24, opacity: 0.35 }}><Floral color={gold} size={110}/></div>
        <div style={{ position: 'absolute', bottom: 50, right: -15, opacity: 0.35, transform: 'rotate(-30deg)' }}><Leaf color={coral} size={90}/></div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: gold, transform: 'rotate(-3deg)', marginBottom: 8 }}>we're getting married!</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 88, color: navy, lineHeight: 0.8, letterSpacing: -3 }}>
            Til
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 68, color: coral, lineHeight: 0.8, margin: '-4px 0' }}>
            &amp;
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 88, color: navy, lineHeight: 0.8, letterSpacing: -3, marginBottom: 26 }}>
            Deen
          </div>
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
            <Dot color={navy} size={6}/>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: navy, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>
              18 · 12 · 2026
            </div>
            <Dot color={navy} size={6}/>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: navy, opacity: 0.65, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>
            Abuja, Nigeria
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: ivory, padding: '36px 22px 36px', position: 'relative', overflow: 'hidden' }}>
      {leafStyleBlock}
      <div style={{ ...floatLeafStyle('1s'), top: 10, right: -10, transform: 'rotate(-20deg)' }}><Leaf color={gold} size={70} /></div>
      
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: navy, opacity: 0.8, transform: 'rotate(-2deg)' }}>
        welcome, {guestName.split(' ')[0]}!
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginTop: 18, alignItems: 'center' }}>
        <PlaceholderImg label="couple photo" ratio="3/4" palette={palette} rotate={-2.5}/>
        <div style={{ paddingLeft: 4 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, color: navy, lineHeight: 0.9, letterSpacing: -1.2 }}>
            Til<br/>
            <span style={{ fontFamily: "'Caveat', cursive", color: coral, fontSize: 36, display: 'inline-block', transform: 'rotate(-5deg) translateY(-2px)' }}>&amp;</span><br/>
            Deen
          </div>
        </div>
      </div>
      <div style={{ 
        marginTop: 28, paddingTop: 20, 
        borderTop: `1.8px dashed ${navy}28`, 
        display: 'flex', justifyContent: 'space-between', 
        fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
        color: navy, letterSpacing: 2, textTransform: 'uppercase' 
      }}>
        <span>18 Dec 2026</span>
        <span style={{ color: gold }}>·</span>
        <span>Abuja, NG</span>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────────────────────────
export function Countdown({ palette }: SectionProps) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date('2026-12-18T16:00:00+01:00');
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const { navy, ivory, gold } = palette;

  const dial = (num: number, label: string, maxVal: number) => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(num, maxVal) / maxVal) * circ;
    
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1,
        position: 'relative'
      }}>
        <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="64" height="64" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
            <circle cx="32" cy="32" r={r} fill="none" stroke={`${ivory}12`} strokeWidth="2.5" />
            <circle 
              cx="32" 
              cy="32" 
              r={r} 
              fill="none" 
              stroke={gold} 
              strokeWidth="2.5" 
              strokeDasharray={circ} 
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 20, color: ivory, lineHeight: 1,
            paddingTop: 1.5,
          }}>
            {String(num).padStart(2, '0')}
          </div>
        </div>
        <div style={{ 
          fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700,
          color: ivory, opacity: 0.65, letterSpacing: 1.5, textTransform: 'uppercase', 
          marginTop: 8 
        }}>{label}</div>
      </div>
    );
  };

  return (
    <section style={{ 
      background: `linear-gradient(135deg, ${navy} 0%, #1e3323 100%)`, 
      padding: '28px 20px', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div style={{ position: 'absolute', top: -10, left: -10, opacity: 0.15 }}><Floral color={gold} size={90}/></div>
      <div style={{ 
        fontFamily: "'Caveat', cursive", fontSize: 22, color: gold, 
        textAlign: 'center', transform: 'rotate(-0.5deg)', marginBottom: 14,
        letterSpacing: 0.5,
      }}>counting down to our I do's...</div>
      
      <div className="glass-card" style={{ 
        display: 'flex', 
        padding: '16px 12px 14px', 
        borderRadius: 20, 
        gap: 6,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {dial(d, 'days', 365)}
        {dial(h, 'hours', 24)}
        {dial(m, 'mins', 60)}
        <div className="pulse-heart" style={{ display: 'flex', flex: 1 }}>
          {dial(s, 'secs', 60)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// OUR STORY
// ─────────────────────────────────────────────────────────────
export function OurStory({ palette }: SectionProps) {
  const { navy, gold, coral, ivory } = palette;
  const beats = [
    { year: '2019', title: 'A chance hello', body: 'Nneka spilled coffee on Opeyemi at a Lagos co-working space. He insisted on paying for the shirt. She insisted on dinner.', imgLabel: 'first date', emoji: '☕' },
    { year: '2021', title: 'Long-distance love', body: 'Abuja to London and back. Thirty-six flights. One very patient dog.', imgLabel: 'travels', emoji: '✈️' },
    { year: '2024', title: 'The proposal', body: 'Sunset at Zuma Rock. A ring hidden in a jollof takeaway box. We said yes before the rice even got cold.', imgLabel: 'the proposal', emoji: '💍' },
    { year: '2026', title: "We're here!", body: 'And we cannot wait to eat, cry, and dance with you all in Abuja.', imgLabel: 'us', emoji: '🎉' },
  ];
  
  return (
    <section style={{ padding: '40px 22px', background: ivory }}>
      <FadeInSection>
        <SectionHeader kicker="our story" title="How it happened" palette={palette}
          accent={<Underline color={gold} w={140}/>}/>
      </FadeInSection>
      
      <div style={{ position: 'relative', marginTop: 14 }}>
        <div style={{ 
          position: 'absolute', left: 19, top: 10, bottom: 10, width: 2, 
          borderLeft: `2.5px dashed ${gold}`, opacity: 0.85 
        }}/>
        
        {beats.map((b, i) => (
          <FadeInSection key={i}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, position: 'relative' }}>
              <div 
                className="hover-lift"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: i % 2 ? coral : gold, 
                  border: `2px solid ${navy}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, position: 'relative', zIndex: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                {b.emoji}
              </div>
              
              <div className="glass-card hover-lift" style={{ 
                flex: 1, 
                borderRadius: 16, 
                padding: '16px',
                background: '#fff',
                border: `1px solid ${navy}12`,
                boxShadow: '0 8px 20px rgba(22, 45, 90, 0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: gold, fontWeight: 700 }}>{b.year}</div>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy, lineHeight: 1.15, marginTop: 3 }}>
                  {b.title}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: navy, opacity: 0.8, lineHeight: 1.5, marginTop: 8, marginBottom: 12 }}>
                  {b.body}
                </div>
                <PlaceholderImg label={b.imgLabel} ratio="16/9" palette={palette} />
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// DETAILS
// ─────────────────────────────────────────────────────────────
export function Details({ palette }: SectionProps) {
  const { navy, ivory, gold, coral, ivoryDeep } = palette;
  const [showCal, setShowCal] = React.useState(false);

  const handleCalendarClick = (type: string) => {
    const title = "Nneka & Opeyemi's Wedding";
    const details = "We are so excited to celebrate our wedding day with you! Official details, travel tips, and RSVP can be found on our wedding invitation website.";
    const location = "The Wings Event Centre, Asokoro, Abuja, Nigeria";
    const start = "20261218T160000";
    const end = "20261219T010000"; 
    
    let url = '';
    if (type === 'google') {
      url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } else if (type === 'yahoo') {
      url = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(title)}&st=${start}&et=${end}&desc=${encodeURIComponent(details)}&in_loc=${encodeURIComponent(location)}`;
    } else if (type === 'outlook') {
      url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } else {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Til meets Deen//Wedding//EN
BEGIN:VEVENT
UID:tildeenwedding2026@nneka-opeyemi.com
DTSTAMP:20260617T000000Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'til_deen_wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowCal(false);
      return;
    }
    window.open(url, '_blank');
    setShowCal(false);
  };

  return (
    <section style={{ background: ivoryDeep, padding: '40px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 24, right: -12, opacity: 0.25 }}><Floral color={navy} size={90}/></div>
      
      <FadeInSection>
        <SectionHeader kicker="the details" title="When & where" palette={palette}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ marginBottom: 18 }}>
          <PlaceholderImg label="family" ratio="16/9" palette={palette} />
        </div>

        <div style={{
          background: ivory, border: `1.8px solid ${navy}`, borderRadius: 20, padding: '22px 18px',
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0 10px 30px rgba(22, 45, 90, 0.05)',
        }}>
          <DetailRow palette={palette} icon="📅" label="DATE" primary="Friday, December 18th" secondary="2026" accent={coral}/>
          <div style={{ height: 1, background: `${navy}12` }}/>
          <DetailRow palette={palette} icon="🕓" label="CEREMONY" primary="4:00 PM" secondary="Arrival from 3:30 PM" accent={gold}/>
          <div style={{ height: 1, background: `${navy}12` }}/>
          <DetailRow palette={palette} icon="🎊" label="RECEPTION" primary="6:30 PM — late" secondary="Dinner, dancing, dessert" accent={coral}/>
          <div style={{ height: 1, background: `${navy}12` }}/>
          <DetailRow palette={palette} icon="📍" label="VENUE" primary="The Wings Event Centre" secondary="Asokoro, Abuja" accent={gold}/>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div style={{ position: 'relative', marginTop: 16 }}>
          <button 
            onClick={() => setShowCal(!showCal)}
            className="hover-lift"
            style={{
              width: '100%', padding: '15px',
              background: navy, color: ivory, border: 'none', borderRadius: 16,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14.5,
              letterSpacing: 0.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 20px rgba(22, 39, 79, 0.25)',
              transition: 'all 0.3s',
            }}
          >
            Add to calendar <span style={{ transform: showCal ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>→</span>
          </button>
          
          {showCal && (
            <div className="glass-card" style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
              borderRadius: 16, overflow: 'hidden', zIndex: 30,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
              border: `1.5px solid ${navy}18`,
              background: '#fff',
            }}>
              {['google', 'apple', 'outlook', 'yahoo'].map(type => (
                <button 
                  key={type}
                  onClick={() => handleCalendarClick(type)}
                  style={{
                    padding: '14px', background: 'none', border: 'none', borderBottom: `1px solid ${navy}08`,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: navy, fontWeight: 600,
                    textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${gold}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{type === 'apple' ? 'Apple iCal' : type}</span>
                  <span style={{ opacity: 0.45 }}>+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </FadeInSection>
    </section>
  );
}

interface DetailRowProps {
  palette: Palette;
  icon: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
}

function DetailRow({ palette, icon, label, primary, secondary, accent }: DetailRowProps) {
  const { navy } = palette;
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{
        width: 46, height: 46, borderRadius: 14, background: accent,
        border: `1.8px solid ${navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: navy, opacity: 0.55, letterSpacing: 1.5 }}>{label}</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: navy, lineHeight: 1.15, marginTop: 2 }}>{primary}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: navy, opacity: 0.7, marginTop: 2 }}>{secondary}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────────────────────────
export function Schedule({ palette }: SectionProps) {
  const { navy, gold, coral } = palette;
  const events = [
    { time: '3:30 PM', title: 'Guest arrival & welcome drinks', place: 'The Wings · Main Lawn', tag: 'Arrival' },
    { time: '4:00 PM', title: 'Ceremony begins', place: 'Garden Pavilion', tag: 'Ceremony' },
    { time: '5:00 PM', title: 'Cocktail hour & photos', place: 'Terrace', tag: 'Cocktails' },
    { time: '6:30 PM', title: 'Reception & dinner', place: 'Grand Ballroom', tag: 'Dinner' },
    { time: '8:00 PM', title: 'First dance', place: 'Ballroom', tag: 'Party' },
    { time: '9:30 PM', title: 'Cake cutting', place: 'Ballroom', tag: 'Celebration' },
    { time: '10:00 PM', title: 'Afrobeats till late 🕺', place: 'Ballroom & patio', tag: 'Dance' },
    { time: '1:00 AM', title: 'Last dance', place: 'Everywhere', tag: 'Farewell' },
  ];
  
  return (
    <section style={{ padding: '40px 22px', background: palette.ivory }}>
      <FadeInSection>
        <SectionHeader kicker="the day of" title="Schedule" palette={palette}
          accent={<Squiggle color={coral} w={100}/>}/>
      </FadeInSection>
      
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        {events.map((e, i) => (
          <FadeInSection key={i}>
            <div 
              className="hover-lift"
              style={{
                display: 'flex', gap: 16, padding: '18px 14px',
                borderBottom: i < events.length - 1 ? `1px dashed ${navy}22` : 'none',
                borderRadius: 12,
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(22, 45, 90, 0.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: 72, flexShrink: 0 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: navy, lineHeight: 1 }}>
                  {e.time.split(' ')[0]}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: navy, opacity: 0.55, letterSpacing: 1, marginTop: 2 }}>
                  {e.time.split(' ')[1]}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, color: navy, fontWeight: 600, lineHeight: 1.3 }}>
                    {e.title}
                  </span>
                  <span style={{
                    fontSize: 8.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
                    background: i % 2 ? `${coral}18` : `${gold}22`,
                    color: i % 2 ? coral : navy,
                    padding: '2px 6px', borderRadius: 4,
                  }}>{e.tag}</span>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.65, marginTop: 3 }}>
                  {e.place}
                </div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TRAVEL
// ─────────────────────────────────────────────────────────────
export function Travel({ palette }: SectionProps) {
  const { navy, gold, coral, ivoryDeep } = palette;
  const [activeTab, setActiveTab] = React.useState<'stay' | 'fly' | 'transport'>('stay');

  const tabStyle = (tabName: 'stay' | 'fly' | 'transport'): React.CSSProperties => ({
    flex: 1, padding: '12px 6px', border: 'none', background: 'none',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700,
    color: activeTab === tabName ? navy : `${navy}60`,
    cursor: 'pointer', transition: 'all 0.3s',
    borderBottom: activeTab === tabName ? `3px solid ${coral}` : `1px solid ${navy}18`,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1,
  });

  return (
    <section style={{ padding: '40px 22px', background: ivoryDeep }}>
      <FadeInSection>
        <SectionHeader kicker="getting here" title="Travel & stay" palette={palette}/>
      </FadeInSection>

      <FadeInSection>
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <button onClick={() => setActiveTab('stay')} style={tabStyle('stay')}>Hotels</button>
          <button onClick={() => setActiveTab('fly')} style={tabStyle('fly')}>Flights</button>
          <button onClick={() => setActiveTab('transport')} style={tabStyle('transport')}>Transit</button>
        </div>
      </FadeInSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {activeTab === 'stay' && (
          <>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="STAY" title="Transcorp Hilton Abuja" 
                subtitle="Exclusive block rate · use code TILDEEN" accent={coral} starred
                linkText="Book Special Rate" linkUrl="https://www.hilton.com"
              />
            </FadeInSection>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="STAY" title="The Envoy Hotel" 
                subtitle="Boutique Luxury · 10 min drive from venue" accent={gold}
                linkText="Visit Website" linkUrl="https://theenvoyhotel.com"
              />
            </FadeInSection>
          </>
        )}

        {activeTab === 'fly' && (
          <FadeInSection>
            <TravelCard 
              palette={palette} tag="FLY IN" title="Nnamdi Azikiwe International" 
              subtitle="ABV airport code · Approximately 45 mins cab drive to Asokoro hotels." accent={gold}
              linkText="Directions map" linkUrl="https://maps.google.com"
            />
          </FadeInSection>
        )}

        {activeTab === 'transport' && (
          <FadeInSection>
            <TravelCard 
              palette={palette} tag="GET AROUND" title="Wedding Shuttle service" 
              subtitle="Shuttles depart from Transcorp & The Envoy at 3:00 PM & 3:15 PM sharp." accent={coral}
            />
          </FadeInSection>
        )}
      </div>
    </section>
  );
}

interface TravelCardProps {
  palette: Palette;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  starred?: boolean;
  linkText?: string;
  linkUrl?: string;
}

function TravelCard({ palette, tag, title, subtitle, accent, starred, linkText, linkUrl }: TravelCardProps) {
  const { navy, ivory } = palette;
  return (
    <div 
      className="glass-card hover-lift"
      style={{
        background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16, padding: '16px 14px',
        display: 'flex', gap: 16, alignItems: 'center', position: 'relative',
        boxShadow: '0 8px 20px rgba(22, 45, 90, 0.03)',
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 12, background: accent, border: `1.8px solid ${navy}`,
        fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: navy, fontWeight: 800,
        letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', lineHeight: 1.1, padding: 4, flexShrink: 0,
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
      }}>{tag}</div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: navy, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.75, marginTop: 4, lineHeight: 1.4 }}>{subtitle}</div>
        {linkUrl && (
          <a 
            href={linkUrl} target="_blank" rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 700,
              color: accent === '#8BBDD4' ? navy : accent, marginTop: 8, textDecoration: 'none',
              borderBottom: `1.5px solid currentColor`, paddingBottom: 1
            }}
          >
            {linkText} →
          </a>
        )}
      </div>
      {starred && <Sparkle color={accent} size={15} style={{ position: 'absolute', top: 10, right: 12 }}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DRESS CODE
// ─────────────────────────────────────────────────────────────
export function DressCode({ palette }: SectionProps) {
  const { navy, ivory, coral } = palette;
  const [selectedSide, setSelectedSide] = React.useState<string | null>(null);

  const groups = [
    {
      id: 'bride',
      label: "Bride's Side",
      desc: "Dusty rose pink & ivory",
      colors: [{ name: 'Dusty Rose', hex: '#C98FA0' }, { name: 'Ivory', hex: '#F7F3E9' }],
      details: "Nneka's guests are requested to celebrate in dusty rose and warm ivory. Think lace wrappers, silk garments, flowy linen fabrics, or elegant suit accents.",
    },
    {
      id: 'groom',
      label: "Groom's Side",
      desc: "Emerald green & ivory",
      colors: [{ name: 'Emerald', hex: '#2E7B5A' }, { name: 'Ivory', hex: '#F7F3E9' }],
      details: "Opeyemi's guests are invited to dress in rich emerald green and ivory. Gele overlays, cap detailing, and tailored trads/suits are highly welcomed.",
    },
    {
      id: 'bridesmaids',
      label: 'Bridesmaids',
      desc: 'Ice blue & ivory',
      colors: [{ name: 'Ice Blue', hex: '#8BBDD4' }, { name: 'Ivory', hex: '#F7F3E9' }],
      details: "Our bridesmaid coordinate will be in ice blue satin and lace textures with matching ivory accessories.",
    },
    {
      id: 'groomsmen',
      label: 'Groomsmen',
      desc: 'Charcoal & blue',
      colors: [{ name: 'Charcoal', hex: '#4A4A5A' }, { name: 'Blue', hex: '#4A76B8' }],
      details: "Our groomsmen will stand sharp in charcoal grey suits, paired with ice-blue shirts or ties.",
    },
  ];

  return (
    <section style={{ padding: '40px 22px', background: ivory, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 30, right: -20, opacity: 0.3 }}><Leaf color={navy} size={75}/></div>
      
      <FadeInSection>
        <SectionHeader kicker="what to wear" title="Dress code" palette={palette}
          accent={<Underline color={coral} w={120}/>}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{
          background: palette.ivoryDeep, border: `1.8px solid ${navy}`, borderRadius: 20, padding: '22px 20px', marginBottom: 18,
          boxShadow: '0 8px 25px rgba(22, 45, 90, 0.03)',
        }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 25, color: navy, lineHeight: 1.15 }}>
            Formal attire, <span style={{ color: coral }}>celebratory</span> colors
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: navy, opacity: 0.8, marginTop: 10, lineHeight: 1.55 }}>
            Think garden-party meets gala. Aso ebi colors below represent family & wedding party — guests are welcome to wear any luxury jewel tone.
          </div>
          <div style={{
            marginTop: 14, padding: '12px 14px', background: '#fff',
            border: `1.5px dashed ${navy}28`, borderRadius: 12,
            fontFamily: "'Caveat', cursive", fontSize: 18, color: navy, lineHeight: 1.25,
            textAlign: 'center'
          }}>
            please avoid → white, cream, or all-black
          </div>
        </div>
      </FadeInSection>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {groups.map(g => (
          <FadeInSection key={g.id}>
            <div 
              onClick={() => setSelectedSide(selectedSide === g.id ? null : g.id)}
              className="polaroid-card swatch-glow"
              style={{
                background: '#fff', border: selectedSide === g.id ? `2px solid ${coral}` : `1.8px solid ${navy}18`,
                borderRadius: 16, padding: '16px 12px',
                cursor: 'pointer',
                boxShadow: selectedSide === g.id ? '0 12px 30px rgba(196,102,62,0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: navy, marginBottom: 2 }}>{g.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: navy, opacity: 0.55, marginBottom: 12 }}>{g.desc}</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {g.colors.map(c => (
                  <div key={c.name} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1/1', borderRadius: '50%',
                      background: c.hex, border: `1.5px solid ${navy}22`,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), 0 3px 8px rgba(0,0,0,0.08)',
                    }}/>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: navy, opacity: 0.7, marginTop: 5, fontWeight: 500 }}>{c.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

      {selectedSide && (
        <FadeInSection>
          <div style={{
            marginTop: 16, padding: '16px 18px', background: `${palette.gold}15`,
            border: `1.5px solid ${palette.gold}`, borderRadius: 16,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: navy, lineHeight: 1.5,
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedSide(null)}
              style={{
                position: 'absolute', top: 8, right: 12, background: 'none', border: 'none',
                color: navy, fontSize: 18, cursor: 'pointer', fontWeight: 'bold'
              }}
            >×</button>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, marginBottom: 6, color: navy }}>
              Styling Suggestions:
            </div>
            {groups.find(g => g.id === selectedSide)?.details}
          </div>
        </FadeInSection>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// WEDDING PARTY
// ─────────────────────────────────────────────────────────────
export function WeddingParty({ palette }: SectionProps) {
  const { navy, ivoryDeep, ivory } = palette;
  const bridesmaidColor = '#8BBDD4';
  const groomsmanColor = '#4A4A5A';
  const party = [
    { name: 'Chiamaka', role: 'Maid of Honor', side: 'T' },
    { name: 'Zainab', role: 'Bridesmaid', side: 'T' },
    { name: 'Amara', role: 'Bridesmaid', side: 'T' },
    { name: 'Funmi', role: 'Bridesmaid', side: 'T' },
    { name: 'Tunde', role: 'Best Man', side: 'D' },
    { name: 'Kola', role: 'Groomsman', side: 'D' },
    { name: 'Seun', role: 'Groomsman', side: 'D' },
    { name: 'Rashid', role: 'Groomsman', side: 'D' },
  ];
  return (
    <section style={{ padding: '40px 22px', background: ivory }}>
      <FadeInSection>
        <SectionHeader kicker="our people" title="The wedding party" palette={palette}/>
      </FadeInSection>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {party.map((p, i) => (
          <FadeInSection key={i}>
            <div 
              className="hover-lift"
              style={{
                border: `1.8px solid ${navy}`, borderRadius: 16,
                background: p.side === 'T' ? ivoryDeep : '#fff',
                padding: '12px 10px', display: 'flex', gap: 12, alignItems: 'center',
                boxShadow: '0 4px 12px rgba(22, 45, 90, 0.03)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: p.side === 'T' ? bridesmaidColor : groomsmanColor, border: `1.8px solid ${navy}`,
                flexShrink: 0,
                backgroundImage: `repeating-linear-gradient(45deg, transparent 0 4px, ${navy}12 4px 5px)`,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15.5, color: navy, lineHeight: 1.1 }}>{p.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: navy, opacity: 0.55, marginTop: 4, letterSpacing: 0.5 }}>{p.role}</div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────
export function Registry({ palette }: SectionProps) {
  const { navy, ivory, gold, coral, ivoryDeep } = palette;
  const items = [
    { name: 'Honeymoon fund', sub: 'Santorini or bust 🌅', accent: coral },
    { name: 'Home & kitchen', sub: 'via Williams Sonoma', accent: gold },
    { name: 'Nigerian charity', sub: 'Slum2School Africa', accent: coral },
  ];
  return (
    <section style={{ padding: '40px 22px', background: ivoryDeep }}>
      <FadeInSection>
        <SectionHeader kicker="if you insist" title="Registry" palette={palette}
          accent={<Squiggle color={gold} w={100}/>}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, opacity: 0.8, marginBottom: 18, lineHeight: 1.55 }}>
          Your presence is the real gift — but if you'd like to contribute, here are a few options.
        </div>
      </FadeInSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, i) => (
          <FadeInSection key={i}>
            <div 
              className="glass-card hover-lift"
              style={{
                background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16,
                padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(22, 45, 90, 0.03)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: it.accent, border: `1.8px solid ${navy}`, flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: navy, lineHeight: 1.15 }}>{it.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.7, marginTop: 3 }}>{it.sub}</div>
              </div>
              <div style={{ fontSize: 18, color: navy, fontWeight: 'bold' }}>→</div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────
export function Gallery({ palette }: SectionProps) {
  const tilts = [-3.5, 3, -2, 2.5, -3, 2];
  const labels = ['first date', 'engagement', 'travels', 'family', 'us', 'the proposal'];
  
  return (
    <section style={{ padding: '40px 22px', background: palette.ivory }}>
      <FadeInSection>
        <SectionHeader kicker="moments" title="Photo gallery" palette={palette}/>
      </FadeInSection>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {labels.map((l, i) => (
          <FadeInSection key={i}>
            <div className="polaroid-card" style={{
              padding: '10px 10px 20px',
              borderRadius: 4,
              transform: `rotate(${tilts[i]}deg)`,
            }}>
              <PlaceholderImg label={l} ratio="1/1" palette={palette}/>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
export function FAQ({ palette }: SectionProps) {
  const { navy, gold, ivoryDeep } = palette;
  const qs = [
    { q: 'Can I bring a plus one?', a: 'Our venue has a strict guest list, so plus ones are only invited if named on your RSVP.' },
    { q: 'Are kids welcome?', a: 'We love your little ones, but this will be an adult-only celebration (babies in arms under 12 months welcome).' },
    { q: 'Is there parking?', a: 'Valet parking is complimentary at The Wings. Shuttle service also runs from our partner hotels.' },
    { q: "What if I'm late to the ceremony?", a: 'Doors close at 4:00 PM sharp. Please aim to arrive by 3:45 PM. Late-comers can join at the reception.' },
    { q: 'Will the ceremony be outdoors?', a: 'Yes — in the garden pavilion. Weather contingency is a covered terrace. Dress for the warm Harmattan breeze.' },
    { q: 'Can I share photos?', a: 'Please! Tag #TilMeetsDeen. We are unplugged for the ceremony only.' },
  ];
  const [open, setOpen] = React.useState(0);
  
  return (
    <section style={{ padding: '40px 22px', background: ivoryDeep }}>
      <FadeInSection>
        <SectionHeader kicker="good to know" title="FAQ" palette={palette}/>
      </FadeInSection>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {qs.map((it, i) => (
          <FadeInSection key={i}>
            <div style={{
              borderTop: `1.8px solid ${navy}`,
              borderBottom: i === qs.length - 1 ? `1.8px solid ${navy}` : 'none',
              padding: '16px 0',
            }}>
              <button 
                onClick={() => setOpen(open === i ? -1 : i)} 
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left',
                  padding: 0
                }}
              >
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: navy, lineHeight: 1.25 }}>{it.q}</span>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', border: `1.8px solid ${navy}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: navy, flexShrink: 0,
                  background: open === i ? gold : 'transparent',
                  transition: 'all 0.3s'
                }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{ 
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: navy, opacity: 0.85, 
                  lineHeight: 1.55, marginTop: 12, paddingRight: 24,
                  animation: 'fadeInText 0.3s ease-out',
                }}>{it.a}</div>
              )}
            </div>
          </FadeInSection>
        ))}
      </div>
      <style>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// THINGS TO DO (NEARBY)
// ─────────────────────────────────────────────────────────────
export function ThingsToDo({ palette }: SectionProps) {
  const { navy, gold, coral } = palette;
  const spots = [
    { name: 'Zuma Rock', cat: 'NATURE', note: 'Iconic monolith — where Deen proposed', accent: coral },
    { name: 'Jabi Lake Mall', cat: 'SHOP', note: 'Retail & rooftop cafés', accent: gold },
    { name: 'Millennium Park', cat: 'STROLL', note: 'Biggest park in Abuja', accent: coral },
    { name: 'Nike Art Gallery', cat: 'CULTURE', note: 'Five floors of Nigerian art', accent: gold },
    { name: 'Bujumbura Kitchen', cat: 'EAT', note: 'Our favourite jollof spot', accent: coral },
  ];
  return (
    <section style={{ padding: '40px 22px', background: palette.ivory }}>
      <FadeInSection>
        <SectionHeader kicker="stick around" title="Things to do in Abuja" palette={palette}/>
      </FadeInSection>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {spots.map((s, i) => (
          <FadeInSection key={i}>
            <div 
              className="hover-lift"
              style={{
                border: `1.8px solid ${navy}`, borderRadius: 16, padding: '14px 16px',
                display: 'flex', gap: 14, alignItems: 'center',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(22, 45, 90, 0.02)',
              }}
            >
              <div style={{
                width: 56, fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: navy,
                fontWeight: 800, letterSpacing: 1.5, textAlign: 'center',
                background: s.accent, borderRadius: 8, padding: '7px 4px', border: `1.5px solid ${navy}`,
                flexShrink: 0,
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
              }}>{s.cat}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17.5, color: navy, lineHeight: 1.15 }}>{s.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.7, marginTop: 3 }}>{s.note}</div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// GUESTBOOK
// ─────────────────────────────────────────────────────────────
interface GuestbookEntry {
  id: number;
  name: string;
  msg: string;
  color: string;
  likes: number;
  rot: number;
}

export function Guestbook({ palette }: SectionProps) {
  const { navy, ivory, gold, coral, ivoryDeep } = palette;
  const [entries, setEntries] = React.useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tildeen_guestbook');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, name: 'Auntie Remi', msg: "Can't wait to dance at your wedding my darlings 💃", color: coral, likes: 8, rot: -2 },
      { id: 2, name: 'Tunde', msg: 'Best man reporting for duty. The toast will be LEGENDARY.', color: gold, likes: 14, rot: 3 },
      { id: 3, name: 'Grandma', msg: 'May your love be as long as our family line.', color: coral, likes: 6, rot: -1.5 },
    ];
  });
  const [name, setName] = React.useState('');
  const [msg, setMsg] = React.useState('');

  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    const newEntry: GuestbookEntry = {
      id: Date.now(),
      name: name.trim(),
      msg: msg.trim(),
      color: entries.length % 2 ? gold : coral,
      likes: 0,
      rot: (Math.random() * 6) - 3,
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    try { localStorage.setItem('tildeen_guestbook', JSON.stringify(updated)); } catch (e) {}
    setName(''); setMsg('');
  };

  const handleLike = (id: number) => {
    const updated = entries.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e);
    setEntries(updated);
    try { localStorage.setItem('tildeen_guestbook', JSON.stringify(updated)); } catch (e) {}
  };

  const insertPreset = (presetText: string) => {
    setMsg(presetText);
  };

  const presets = [
    "So happy for you! 🎉",
    "Can't wait to party! 🥂",
    "Wishing you a lifetime of love! 💖",
    "Best wishes on your journey! ✨"
  ];

  return (
    <section style={{ padding: '40px 22px', background: ivoryDeep }}>
      <FadeInSection>
        <SectionHeader kicker="leave a note" title="Guestbook" palette={palette}
          accent={<Heart color={coral} size={20} style={{ display: 'block' }}/>}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ 
          background: ivory, border: `1.8px solid ${navy}`, borderRadius: 20, padding: 16, marginBottom: 20,
          boxShadow: '0 8px 25px rgba(22, 45, 90, 0.04)',
        }}>
          <input
            value={name} onChange={e => setName(e.target.value)} placeholder="your name"
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: navy,
              padding: '8px 0', borderBottom: `1.5px dashed ${navy}28`,
            }}
          />
          <textarea
            value={msg} onChange={e => setMsg(e.target.value)} placeholder="write a note for Til &amp; Deen..."
            rows={2}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontFamily: "'Caveat', cursive", fontSize: 20, color: navy,
              padding: '10px 0 0', resize: 'none', lineHeight: 1.3
            }}
          />
          
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 14px' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => insertPreset(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)', border: `1px solid ${navy}18`,
                  padding: '5px 10px', borderRadius: 20,
                  fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: navy, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = '#fff';
                  target.style.borderColor = gold;
                }}
                onMouseLeave={e => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = 'rgba(255,255,255,0.7)';
                  target.style.borderColor = `${navy}18`;
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            onClick={submit} 
            className="hover-lift"
            style={{
              width: '100%', padding: '12px', background: navy, color: ivory, border: 'none', borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(22, 39, 79, 0.15)',
            }}
          >Sign the book →</button>
        </div>
      </FadeInSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {entries.map((e) => (
          <FadeInSection key={e.id}>
            <div 
              className="polaroid-card"
              style={{
                background: '#fff', 
                borderRadius: 4, 
                padding: '16px 16px 12px',
                borderLeft: `5px solid ${e.color}`,
                transform: `rotate(${e.rot || 0}deg)`,
                position: 'relative'
              }}
            >
              <div style={{ 
                fontFamily: "'Caveat', cursive", fontSize: 21, color: navy, 
                lineHeight: 1.35, paddingBottom: 12, borderBottom: `1px dashed ${navy}12` 
              }}>
                "{e.msg}"
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: 10
              }}>
                <div style={{ 
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 700, 
                  color: navy, opacity: 0.65, letterSpacing: 1.2, textTransform: 'uppercase' 
                }}>
                  — {e.name}
                </div>
                
                <button
                  onClick={() => handleLike(e.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: coral, fontWeight: 600,
                    padding: '4px 8px', borderRadius: 12,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${coral}12`}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Heart color={coral} size={13} filled={e.likes > 0} />
                  <span>{e.likes}</span>
                </button>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
export function Footer({ palette }: SectionProps) {
  const { navy, ivory, gold, coral } = palette;
  return (
    <section style={{
      background: `linear-gradient(180deg, ${navy} 0%, #151d17 100%)`, 
      color: ivory, padding: '48px 22px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 20, left: 20, opacity: 0.4 }}><Sparkle color={gold} size={16}/></div>
      <div style={{ position: 'absolute', top: 30, right: 24, opacity: 0.3 }}><Sparkle color={coral} size={11}/></div>
      <div style={{ position: 'absolute', bottom: 60, left: 30, opacity: 0.3 }}><Dot color={gold} size={5}/></div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: gold, transform: 'rotate(-2deg)' }}>with so much love,</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, lineHeight: 1, marginTop: 6, letterSpacing: -1 }}>
        Til <span style={{ fontFamily: "'Caveat', cursive", color: coral, fontSize: 34 }}>&amp;</span> Deen
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, opacity: 0.6, marginTop: 20, letterSpacing: 2 }}>
        #TILMEETSDEEN · 18 · 12 · 2026
      </div>
    </section>
  );
}
