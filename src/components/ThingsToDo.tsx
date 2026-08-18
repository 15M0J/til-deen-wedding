import type { SectionProps } from './Sections';
import { FadeInSection, SectionHeader } from './Sections';

export function ThingsToDo({ palette }: SectionProps) {
  const { navy, gold, coral } = palette;
  const spots = [
    { name: 'Guzape Hilltop Sunset', cat: 'SCENIC', note: 'Breathtaking panoramic sunset view overlooking Abuja, right beside the venue.', accent: coral },
    { name: 'The Grill City', cat: 'GRILL', note: 'Abuja’s iconic open-air charcoal-grilled fish, suya, and asun for a relaxed evening bite.', accent: gold },
    { name: 'Thought Pyramid Art Centre', cat: 'CULTURE', note: 'Contemporary African art gallery, sculpture garden, and tranquil outdoor café in Wuse II.', accent: coral },
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
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: navy, lineHeight: 1.15 }}>{s.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.75, marginTop: 3 }}>{s.note}</div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
