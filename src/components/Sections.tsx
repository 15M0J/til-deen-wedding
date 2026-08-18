import React from 'react';
import { Squiggle, Underline, Sparkle, Dot, Heart } from './Accents';

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
  objectPosition?: string;
  customSrc?: string;
}

interface SectionHeaderProps {
  kicker: string;
  title: string;
  palette: Palette;
  accent?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface SectionProps {
  palette: Palette;
}

interface HeroProps extends SectionProps {
  guestName: string;
  heroLayout: string;
}

// ── Fade In On Scroll Wrapper ──
export function FadeInSection({ children }: FadeInSectionProps) {
  const [isVisible, setVisible] = React.useState(() => typeof IntersectionObserver === 'undefined');
  const domRef = React.useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
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
export function PlaceholderImg({ label, ratio = '4/5', palette, rotate = 0, objectPosition, customSrc }: PlaceholderImgProps) {
  const { navy, ivoryDeep } = palette;
  
  const imageMap: Record<string, { src: string; pos?: string }> = {
    'couple photo': { src: 'images/gallery/moment_57.jpeg', pos: 'center 20%' },
    'nneka & opeyemi · full-bleed couple photo': { src: 'images/gallery/moment_57.jpeg', pos: 'center 20%' },
    'first date': { src: 'images/gallery/moment_01.jpeg', pos: 'center 18%' },
    'first meeting': { src: 'images/gallery/moment_01.jpeg', pos: 'center 18%' },
    'sea life date': { src: 'images/gallery/moment_01.jpeg', pos: 'center 18%' },
    'engagement': { src: 'images/gallery/moment_58.jpeg', pos: 'center 40%' },
    'the proposal': { src: 'images/gallery/moment_51.jpeg', pos: 'center 20%' },
    'everyday walks': { src: 'images/gallery/moment_50.jpeg', pos: 'center 25%' },
    'walks & treats': { src: 'images/gallery/moment_50.jpeg', pos: 'center 25%' },
    'travels': { src: 'images/gallery/moment_08.jpeg', pos: 'center 20%' },
    'divine timing': { src: 'images/gallery/moment_37.jpeg', pos: 'center 15%' },
    'us': { src: 'images/gallery/moment_37.jpeg', pos: 'center 15%' },
    'our love story': { src: 'images/gallery/moment_58.jpeg', pos: 'center 40%' },
    'celebration': { src: 'images/gallery/moment_27.jpeg', pos: 'center 25%' },
    'celebration & venue': { src: 'images/gallery/moment_27.jpeg', pos: 'center 25%' },
    'family': { src: 'images/gallery/moment_27.jpeg', pos: 'center 25%' },
  };

  const resolvedKey = Object.keys(imageMap).find(k => 
    k.toLowerCase() === label.toLowerCase() || 
    label.toLowerCase().includes(k.toLowerCase())
  );
  const matched = resolvedKey ? imageMap[resolvedKey] : null;
  const imgSrc = customSrc || matched?.src || null;
  const finalPos = objectPosition || matched?.pos || 'center 20%';

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
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: finalPos,
            display: 'block' 
          }} 
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
      <div aria-hidden="true" style={{ opacity: 0.08, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 28, letterSpacing: 4, transform: 'rotate(-18deg)' }}>
        TIL · DEEN
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
  const { navy, ivory, ivoryDeep, gold, coral } = palette;

  if (heroLayout === 'photo') {
    return (
      <section style={{ position: 'relative', padding: '32px 22px 40px', background: ivory, overflow: 'hidden' }}>
        
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: navy, opacity: 0.8, transform: 'rotate(-2deg)' }}>
          welcome, {guestName.split(' ')[0]}!
        </div>
        <div style={{ marginTop: 18, position: 'relative' }}>
          <PlaceholderImg 
            label="Til & Deen" 
            customSrc="images/gallery/moment_57.jpeg" 
            objectPosition="center 20%" 
            ratio="4/5" 
            palette={palette}
          />
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
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: navy, lineHeight: .92, marginTop: 7 }}>
            Til <span style={{ fontFamily: "'Caveat', cursive", fontSize: 31, color: coral }}>&amp;</span> Deen
          </div>
        </div>
      </section>
    );
  }

  if (heroLayout === 'typographic') {
    return (
      <section style={{ background: ivory, padding: '70px 22px 50px', position: 'relative', overflow: 'hidden' }}>

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
    <section style={{ background: ivory, padding: '44px 22px 38px', position: 'relative', overflow: 'hidden' }}>

      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: gold, fontWeight: 700,
        letterSpacing: 2.2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12
      }}>
        Welcome, {guestName.split(' ')[0]}
      </div>
      <div style={{ textAlign: 'center', margin: '0 auto 24px', maxWidth: 520 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: navy, opacity: 0.62, letterSpacing: 1.8, textTransform: 'uppercase' }}>
          Together with their families
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(42px, 10vw, 66px)', color: navy, lineHeight: 0.88, letterSpacing: -2, marginTop: 12 }}>
          Til <span style={{ fontFamily: "'Caveat', cursive", color: gold, fontSize: '.62em', display: 'inline-block', margin: '0 3px' }}>&amp;</span> Deen
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: navy, opacity: 0.78, marginTop: 16 }}>
          invite you to celebrate their wedding
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ position: 'absolute', inset: '14px -8px -10px 14px', background: coral, opacity: 0.55, borderRadius: 4 }} />
        <div style={{ position: 'relative', border: `1px solid ${navy}35`, overflow: 'hidden', borderRadius: 4, aspectRatio: '16/11', background: ivoryDeep }}>
          <img
            src="images/gallery/moment_57.jpeg"
            alt="Nneka and Opeyemi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, padding: '34px 18px 14px',
            background: `linear-gradient(transparent, ${navy}D9)`, color: ivory,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12
          }}>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.75 }}>Friday</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22 }}>18 December 2026</div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', textAlign: 'right' }}>
              Abuja<br/>Nigeria
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 26, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: navy, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.62 }}>
        Scroll to discover the celebration
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
  const target = new Date('2026-12-18T00:00:00+01:00');
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const { navy, ivoryDeep, gold, coral } = palette;
  const units = [
    { value: d, label: 'Days' },
    { value: h, label: 'Hours' },
    { value: m, label: 'Minutes' },
    { value: s, label: 'Seconds' },
  ];

  return (
    <section
      className="wedding-countdown"
      style={{
        '--countdown-ink': navy,
        '--countdown-paper': ivoryDeep,
        '--countdown-sage': coral,
        '--countdown-sage-deep': gold,
      } as React.CSSProperties}
    >
      <div className="wedding-countdown__heading">
        <span>Until we say “I do”</span>
        <strong>Til &amp; Deen</strong>
      </div>
      <div className="wedding-countdown__units" aria-label={`${d} days, ${h} hours, ${m} minutes and ${s} seconds until the wedding`}>
        {units.map((unit) => (
          <div className="wedding-countdown__unit" key={unit.label}>
            <strong>{String(unit.value).padStart(2, '0')}</strong>
            <span>{unit.label}</span>
          </div>
        ))}
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
    { 
      chapter: '01', 
      year: 'Jan - Mar 2024', 
      title: 'Divine Timing', 
      body: 'I arrived in England on Jan 23rd—the same day Deen got the news that he passed his job interview. Exactly a month later, on Feb 23rd, he received his official offer, setting the stage for us to meet on March 23rd.', 
      imgLabel: 'Divine Timing',
      imgSrc: 'images/gallery/moment_40.jpeg',
      objectPosition: 'center 20%'
    },
    { 
      chapter: '02', 
      year: 'Mar 23, 2024', 
      title: 'Sea Life & A Tour Guide', 
      body: 'A friend\'s double-date brought us together. Deen said, "Tell her to bring her beautiful friend too" — and that was me! We walked the city centre and visited Sea Life, where Deen became my personal tour guide.', 
      imgLabel: 'Sea Life Date',
      imgSrc: 'images/gallery/moment_01.jpeg',
      objectPosition: 'center 18%'
    },
    { 
      chapter: '03', 
      year: 'Spring - Sept 2024', 
      title: '"Привет" & Consistent Walks', 
      body: 'Deen messaged in Russian (knowing I studied in Ukraine) and consistently waited to walk me home from school with treats. Soon, we discovered we share a birth month—him on the 15th and me on the 5th!', 
      imgLabel: 'Walks & Treats',
      imgSrc: 'images/gallery/moment_50.jpeg',
      objectPosition: 'center 25%'
    },
    { 
      chapter: '04', 
      year: 'Present Day', 
      title: 'A Beautiful Journey', 
      body: 'What started as a chance meeting, a city-centre walk, and a trip to Sea Life has become a beautiful love story. We smile looking at where we started and thank God for how it all began.', 
      imgLabel: 'Our Love Story',
      imgSrc: 'images/gallery/moment_58.jpeg',
      objectPosition: 'center 40%'
    },
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
                  fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: navy,
                  flexShrink: 0, position: 'relative', zIndex: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                {b.chapter}
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
                <PlaceholderImg 
                  label={b.imgLabel} 
                  customSrc={b.imgSrc}
                  objectPosition={b.objectPosition}
                  ratio="4/3" 
                  palette={palette} 
                />
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
    const location = "The Nest at Guzape Hills, Abuja, Nigeria";
    const start = "20261218";
    const end = "20261219";
    
    let url: string;
    if (type === 'google') {
      url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } else if (type === 'yahoo') {
      url = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(title)}&st=${start}&et=${end}&desc=${encodeURIComponent(details)}&in_loc=${encodeURIComponent(location)}`;
    } else if (type === 'outlook') {
      url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=2026-12-18&enddt=2026-12-19&allday=true&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } else {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Til meets Deen//Wedding//EN
BEGIN:VEVENT
UID:tildeenwedding2026@nneka-opeyemi.com
DTSTAMP:20260617T000000Z
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
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
    <section style={{ background: ivoryDeep, padding: '40px 22px', position: 'relative', overflow: 'visible', zIndex: showCal ? 5 : 'auto' }}>
      
      <FadeInSection>
        <SectionHeader kicker="the details" title="When & where" palette={palette}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ marginBottom: 18 }}>
          <PlaceholderImg 
            label="The Nest at Guzape Hills · Abuja" 
            customSrc="images/venue.png"
            objectPosition="center 30%"
            ratio="16/9" 
            palette={palette} 
          />
        </div>

        <div style={{
          background: ivory, border: `1.8px solid ${navy}`, borderRadius: 20, padding: '22px 18px',
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0 10px 30px rgba(22, 45, 90, 0.05)',
        }}>
          <DetailRow palette={palette} icon="DEC" label="DATE" primary="Friday, December 18th" secondary="2026" accent={coral}/>
          <div style={{ height: 1, background: `${navy}12` }}/>
          <DetailRow palette={palette} icon="ABJ" label="VENUE" primary="The Nest at Guzape Hills" secondary="Guzape Hills, Abuja" accent={gold}/>
          <div style={{ height: 1, background: `${navy}12` }}/>
          <div style={{ padding: '7px 4px 2px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 9, fontWeight: 700, color: gold, letterSpacing: 1.8, textTransform: 'uppercase' }}>Full programme</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: navy, marginTop: 4 }}>The timings will be revealed later.</div>
          </div>
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
            Save the date <span style={{ transform: showCal ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>→</span>
          </button>
          
          {showCal && (
            <div className="glass-card" style={{
              position: 'relative', left: 0, right: 0, marginTop: 8,
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
  
  return (
    <section style={{ padding: '40px 22px', background: palette.ivory }}>
      <FadeInSection>
        <SectionHeader kicker="the day of" title="Programme" palette={palette}
          accent={<Squiggle color={coral} w={100}/>}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ padding: '38px 24px', border: `1px solid ${navy}35`, background: palette.ivoryDeep, textAlign: 'center' }}>
          <div style={{ width: 42, height: 1, margin: '0 auto 17px', background: gold }}/>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 9, fontWeight: 700, color: gold, letterSpacing: 2, textTransform: 'uppercase' }}>To be revealed</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 31, color: navy, lineHeight: 1, marginTop: 9 }}>The order of the day is still under wraps.</div>
          <p style={{ maxWidth: 390, margin: '13px auto 0', fontFamily: "'Manrope', sans-serif", fontSize: 12, color: navy, opacity: .72, lineHeight: 1.65 }}>
            We will share the full programme with our guests closer to the celebration.
          </p>
        </div>
      </FadeInSection>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TRAVEL
// ─────────────────────────────────────────────────────────────
export { Travel, TravelCard } from './TravelAndStay';

// ─────────────────────────────────────────────────────────────
// DRESS CODE
// ─────────────────────────────────────────────────────────────
export function DressCode({ palette }: SectionProps) {
  const { navy, ivory, coral } = palette;
  const [selectedSide, setSelectedSide] = React.useState<string | null>(null);

  const groups = [
    {
      id: 'bride',
      label: 'The Bride',
      desc: 'Bridal ivory',
      colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Sage Detail', hex: '#9CAF88' }],
      details: "Nneka's look is centred on clean bridal ivory, finished with restrained sage greenery and soft natural florals.",
    },
    {
      id: 'groom',
      label: 'The Groom',
      desc: 'Sand, taupe & chocolate',
      colors: [{ name: 'Sand / Taupe', hex: '#CBBBA4' }, { name: 'Chocolate', hex: '#3D2314' }],
      details: "Opeyemi's look is a warm sand or taupe three-piece suit with chocolate-brown accessories, an ivory boutonnière, and a touch of sage greenery.",
    },
    {
      id: 'bridesmaids',
      label: 'Bridesmaids',
      desc: 'Chocolate satin & ivory florals',
      colors: [{ name: 'Chocolate', hex: '#3D2314' }, { name: 'Ivory', hex: '#FFFFF0' }],
      details: 'The bridesmaids will wear rich chocolate-brown satin, paired with understated jewellery and soft ivory florals.',
    },
    {
      id: 'groomsmen',
      label: 'Groomsmen',
      desc: 'Sage, ivory & champagne',
      colors: [{ name: 'Sage Green', hex: '#9CAF88' }, { name: 'Champagne', hex: '#CBBBA4' }],
      details: 'The groomsmen will wear soft sage suits with white shirts, ivory or champagne ties, brown shoes, and simple ivory boutonnieres.',
    },
  ];

  return (
    <section style={{ padding: '40px 22px', background: ivory, position: 'relative', overflow: 'hidden' }}>
      
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
            Formal attire, <span style={{ color: coral }}>earthy elegance</span>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: navy, opacity: 0.8, marginTop: 10, lineHeight: 1.55 }}>
            Our celebration is built around ivory, sage green, and chocolate brown, with warm taupe and champagne details. Tap each look to see the wedding-party styling direction.
          </div>
          <div style={{
            marginTop: 14, padding: '14px 16px', background: navy,
            border: `1px solid ${navy}`, borderRadius: 0,
            fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 700, color: ivory, lineHeight: 1.5,
            letterSpacing: .4, textAlign: 'center'
          }}>
            Guest note: please reserve white and ivory exclusively for the bride.
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
export { WeddingParty } from './WeddingParty';

// ─────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────
export { Registry, type WishlistItem, DEFAULT_WISHLIST } from './Registry';

// ─────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────
export function Gallery({ palette }: SectionProps) {
  const tilts = [-3.5, 3, -2, 2.5, -3, 2];
  const labels = ['first date', 'engagement', 'travels', 'celebration', 'us', 'the proposal'];
  
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
    { q: 'Is there parking?', a: 'Valet parking is complimentary at The Nest at Guzape Hills. Uber and Bolt also drop off directly at the main entrance.' },
    { q: 'When will the timings be shared?', a: 'The full programme will be revealed closer to the celebration. We will make sure every invited guest receives it.' },
    { q: 'Can I share photos?', a: 'Please! Tag #TilMeetsDeen. We will let guests know if any part of the day is unplugged.' },
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
export { ThingsToDo } from './ThingsToDo';

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
    } catch { /* fall back to the sample guestbook entries */ }
    return [
      { id: 1, name: 'Auntie Remi', msg: "Can't wait to dance and celebrate at your wedding my darlings.", color: coral, likes: 8, rot: -2 },
      { id: 2, name: 'Tunde', msg: 'Best man reporting for duty. The toast will be legendary.', color: gold, likes: 14, rot: 3 },
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
    try { localStorage.setItem('tildeen_guestbook', JSON.stringify(updated)); } catch { /* local persistence is best-effort */ }
    setName(''); setMsg('');
  };

  const handleLike = (id: number) => {
    const updated = entries.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e);
    setEntries(updated);
    try { localStorage.setItem('tildeen_guestbook', JSON.stringify(updated)); } catch { /* local persistence is best-effort */ }
  };

  const insertPreset = (presetText: string) => {
    setMsg(presetText);
  };

  const presets = [
    "So happy for you both!",
    "Can't wait to celebrate!",
    "Wishing you a lifetime of love and joy!",
    "Heartfelt blessings on your new journey!"
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
            value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write a note for Til &amp; Deen..."
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
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, lineHeight: .92, marginTop: 8, letterSpacing: -1 }}>
        Til <span style={{ fontFamily: "'Caveat', cursive", color: coral, fontSize: 30 }}>&amp;</span> Deen
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, opacity: 0.6, marginTop: 20, letterSpacing: 2 }}>
        #TILMEETSDEEN · 18 · 12 · 2026
      </div>
    </section>
  );
}
