import React from 'react';

interface Palette {
  navy: string;
  ivory: string;
  ivoryDeep: string;
  gold: string;
  coral: string;
}

interface RsvpChatProps {
  guestName: string;
  palette: Palette;
}

interface Message {
  from: 'til' | 'you';
  text: string;
}

interface AnswerData {
  attending?: 'yes' | 'no';
  guests?: string;
  meal?: string;
  diet?: string;
  song?: string;
}

// ── Lightweight Canvas Particle Confetti ──
function CanvasConfetti({ active }: { active: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      alpha: number;
      decay: number;
      tiltAngle: number;
      tiltSpeed: number;
    }> = [];
    const colors = ['#C4663E', '#8BBDD4', '#E8B04E', '#16274F', '#2B4530'];
    
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 600;
    
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.82,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.75) * 16 - 6,
        r: Math.random() * 4.5 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        tiltAngle: Math.random() * 360,
        tiltSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive++;
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; 
        p.vx *= 0.97; 
        p.alpha -= p.decay;
        p.tiltAngle += p.tiltSpeed;
        
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      });
      
      if (alive > 0) {
        animationId = requestAnimationFrame(render);
      }
    };
    
    render();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  
  if (!active) return null;
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', inset: 0, 
        width: '100%', height: '100%', 
        pointerEvents: 'none', zIndex: 100 
      }} 
    />
  );
}

// ── Main Conversational RSVP Chat Component ──
export default function RsvpChat({ guestName, palette }: RsvpChatProps) {
  const { navy, ivory, gold, coral, ivoryDeep } = palette;
  
  const [messages, setMessages] = React.useState<Message[]>([
    { from: 'til', text: `Hi ${guestName.split(' ')[0]}! We're so glad you're here 💙` },
    { from: 'til', text: 'Can you make it to our big day?' },
  ]);
  const [step, setStep] = React.useState<'attending' | 'guests' | 'meal' | 'diet' | 'song' | 'done' | 'done-no'>('attending');
  const [answers, setAnswers] = React.useState<AnswerData>({});
  const [typing, setTyping] = React.useState(false);
  const [celebrate, setCelebrate] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, typing]);

  const addUser = (text: string) => setMessages(m => [...m, { from: 'you', text }]);
  
  const addTil = (text: string, delay = 750) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: 'til', text }]);
    }, delay);
  };

  const submit = (key: keyof AnswerData, value: string, label?: string) => {
    addUser(label || value);
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);

    if (key === 'attending') {
      if (value === 'no') {
        try { localStorage.setItem('tildeen_rsvp', JSON.stringify(nextAnswers)); } catch (e) {}
        addTil("We'll miss you, but thank you for letting us know ❤️");
        setTimeout(() => addTil("We'll be sure to send you photos after the big day!"), 1400);
        setStep('done-no');
        return;
      }
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3500);

      addTil('Yay! We are thrilled to hear that! How many guests in your party (including you)?');
      setStep('guests');
    } else if (key === 'guests') {
      addTil('Excellent. What would you prefer for dinner?');
      setStep('meal');
    } else if (key === 'meal') {
      addTil('Got it. Any allergies or dietary requirements we should pass to the chef?');
      setStep('diet');
    } else if (key === 'diet') {
      addTil("Lastly, what's one song that will absolutely make you hit the dance floor? 🕺");
      setStep('song');
    } else if (key === 'song') {
      try { localStorage.setItem('tildeen_rsvp', JSON.stringify(nextAnswers)); } catch (e) {}
      addTil("Perfect! We've recorded your RSVP successfully. See you in Abuja on December 18th ✨");
      setTimeout(() => addTil('Dress code, venue schedules & travel info are all in the menu above.'), 1500);
      setStep('done');
    }
  };

  const bubbleStyle = (from: 'til' | 'you'): React.CSSProperties => ({
    alignSelf: from === 'you' ? 'flex-end' : 'flex-start',
    background: from === 'you' ? navy : '#fff',
    color: from === 'you' ? ivory : navy,
    border: from === 'you' ? 'none' : `1px solid ${navy}12`,
    borderRadius: 20,
    borderBottomRightRadius: from === 'you' ? 4 : 20,
    borderBottomLeftRadius: from === 'til' ? 4 : 20,
    padding: '12px 16px',
    maxWidth: '82%',
    fontFamily: "'DM Sans', sans-serif", 
    fontSize: 14.5, 
    lineHeight: 1.45,
    boxShadow: from === 'you' 
      ? '0 4px 10px rgba(22, 39, 79, 0.12)' 
      : '0 2px 8px rgba(0,0,0,0.03)',
    transform: 'scale(1)',
    animation: 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15)',
  });

  const chipRow = (opts: Array<{ value: string; label: string }>, key: keyof AnswerData) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: 2 }}>
      {opts.map(o => (
        <button key={o.value} onClick={() => submit(key, o.value, o.label)}
          className="hover-lift"
          style={{
            padding: '10px 16px', borderRadius: 24,
            border: `1.8px solid ${navy}`, background: '#fff', color: navy,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 8px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.background = navy;
            target.style.color = ivory;
          }}
          onMouseLeave={e => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.background = '#fff';
            target.style.color = navy;
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  const TextInput = ({ itemKey, placeholder }: { itemKey: keyof AnswerData; placeholder: string }) => {
    const [val, setVal] = React.useState('');
    return (
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <input
          value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && val.trim()) submit(itemKey, val.trim()); }}
          placeholder={placeholder}
          style={{
            flex: 1, height: 44, padding: '0 16px',
            border: `1.8px solid ${navy}28`, borderRadius: 22, outline: 'none',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: '#fff', color: navy,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = navy}
          onBlur={e => e.currentTarget.style.borderColor = `${navy}28`}
        />
        <button
          onClick={() => val.trim() && submit(itemKey, val.trim())}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: navy, color: ivory, border: 'none', cursor: 'pointer',
            fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(22, 39, 79, 0.15)',
          }}
        >→</button>
      </div>
    );
  };

  const steps = [
    { id: 'attending', label: 'RSVP' },
    { id: 'guests', label: 'Guests' },
    { id: 'meal', label: 'Meal' },
    { id: 'diet', label: 'Diet' },
    { id: 'song', label: 'Song' }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: ivoryDeep, position: 'relative' }}>
      
      <CanvasConfetti active={celebrate} />

      <div style={{
        padding: '16px 18px', borderBottom: `1px solid ${navy}12`,
        background: ivory, display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 4px 12px rgba(22, 45, 90, 0.02)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', background: coral, border: `2px solid ${navy}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Serif Display', serif", fontSize: 15, color: navy, fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>T&amp;D</div>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: navy, letterSpacing: -0.2 }}>Nneka &amp; Opeyemi</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: navy, opacity: 0.6, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
            <span style={{ width: 6.5, height: 6.5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}/>
            online · awaiting your response
          </div>
        </div>
      </div>

      {currentStepIndex !== -1 && (
        <div style={{
          background: ivory, padding: '8px 18px 10px', display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: `1px solid ${navy}08`, position: 'relative', zIndex: 5,
        }}>
          {steps.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{
                  height: 3.5, borderRadius: 2,
                  background: isCompleted ? gold : isActive ? coral : `${navy}12`,
                  transition: 'background 0.4s ease',
                }} />
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700,
                  color: isActive ? coral : isCompleted ? navy : `${navy}45`,
                  textAlign: 'center', letterSpacing: 0.2,
                  transition: 'color 0.4s ease',
                }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div ref={scrollRef} className="hide-scroll" style={{
        flex: 1, overflow: 'auto', padding: 18,
        display: 'flex', flexDirection: 'column', gap: 12,
        backgroundImage: `radial-gradient(${navy}08 1.2px, transparent 1.2px)`,
        backgroundSize: '16px 16px',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={bubbleStyle(m.from)}>{m.text}</div>
        ))}
        {typing && (
          <div style={{ ...bubbleStyle('til'), display: 'flex', gap: 4, padding: '12px 18px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: navy,
                opacity: 0.4, animation: `blink 1.4s infinite ${i * 0.2}s`,
              }}/>
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '14px 18px 24px', background: ivory,
        borderTop: `1.8px solid ${navy}08`,
        boxShadow: '0 -4px 12px rgba(22, 45, 90, 0.02)',
        position: 'relative', zIndex: 10,
      }}>
        {step === 'attending' && chipRow([
          { value: 'yes', label: "Yes, I'll be there! 🎉" },
          { value: 'no', label: "Sadly, I can't make it" },
        ], 'attending')}
        {step === 'guests' && chipRow([
          { value: '1', label: 'Just myself' },
          { value: '2', label: '2 guests' },
          { value: '3', label: '3 guests' },
          { value: '4', label: '4 guests' },
        ], 'guests')}
        {step === 'meal' && chipRow([
          { value: 'jollof', label: '🍚 Jollof Rice (Spiced)' },
          { value: 'grilled', label: '🔥 Grilled Protein / Sides' },
          { value: 'veg', label: '🥗 Garden Vegetarian' },
        ], 'meal')}
        {step === 'diet' && (
          <>
            {chipRow([{ value: 'none', label: 'No dietary restrictions' }], 'diet')}
            <div style={{ marginTop: 8 }}>
              <TextInput itemKey="diet" placeholder="or type details (e.g. vegan, nut allergy)..." />
            </div>
          </>
        )}
        {step === 'song' && (
          <TextInput itemKey="song" placeholder="Type a song title & artist..." />
        )}
        {(step === 'done' || step === 'done-no') && (
          <div style={{
            textAlign: 'center', padding: '6px 0',
            fontFamily: "'Caveat', cursive", fontSize: 24, color: navy,
            fontWeight: 700,
          }}>
            ✨ we'll see you soon! ✨
          </div>
        )}
      </div>

      <style>{`
        @keyframes bubblePop {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes blink {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
