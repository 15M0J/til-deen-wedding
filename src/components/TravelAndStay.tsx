import React from 'react';
import type { Palette, SectionProps } from './Sections';
import { FadeInSection, SectionHeader } from './Sections';

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

export function TravelCard({ palette, tag, title, subtitle, accent, starred, linkText, linkUrl }: TravelCardProps) {
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
      {starred && (
        <div style={{
          position: 'absolute', top: -8, right: 14, background: navy, color: ivory,
          fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, fontWeight: 800,
          letterSpacing: 1, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase',
          boxShadow: '0 2px 6px rgba(22, 45, 90, 0.2)',
        }}>
          5-Star Luxury
        </div>
      )}
    </div>
  );
}

export function Travel({ palette }: SectionProps) {
  const { navy, gold, coral, ivoryDeep } = palette;
  const [activeTab, setActiveTab] = React.useState<'stay' | 'fly' | 'climate'>('stay');

  const tabStyle = (tabName: 'stay' | 'fly' | 'climate'): React.CSSProperties => ({
    flex: 1, padding: '12px 6px', border: 'none', background: 'none',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
    color: activeTab === tabName ? navy : `${navy}60`,
    cursor: 'pointer', transition: 'all 0.3s',
    borderBottom: activeTab === tabName ? `3px solid ${coral}` : `1px solid ${navy}18`,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8,
  });

  return (
    <section style={{ padding: '40px 22px', background: ivoryDeep }}>
      <FadeInSection>
        <SectionHeader kicker="getting here" title="Travel & stay" palette={palette}/>
      </FadeInSection>

      <FadeInSection>
        <div style={{ display: 'flex', marginBottom: 20, overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 2 }} className="hide-scroll">
          <button onClick={() => setActiveTab('stay')} style={{ ...tabStyle('stay'), minWidth: 'max-content' }}>Hotels</button>
          <button onClick={() => setActiveTab('fly')} style={{ ...tabStyle('fly'), minWidth: 'max-content' }}>Flights &amp; Rides</button>
          <button onClick={() => setActiveTab('climate')} style={{ ...tabStyle('climate'), minWidth: 'max-content' }}>Climate &amp; Tips</button>
        </div>
      </FadeInSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {activeTab === 'stay' && (
          <>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="LUXURY" title="The Wells Carlton Hotel" 
                subtitle="5-star luxury &amp; rooftop skyline views · Asokoro/Guzape border (~5 mins to venue)" accent={coral} starred
                linkText="View on Google Maps" linkUrl="https://maps.google.com/?q=The+Wells+Carlton+Hotel+Abuja"
              />
            </FadeInSection>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="MID-RANGE" title="Hawthorn Suites by Wyndham" 
                subtitle="Spacious suites, pool &amp; great block rates · Area 11 / Garki (~7 mins to venue)" accent={gold}
                linkText="View on Google Maps" linkUrl="https://maps.google.com/?q=Hawthorn+Suites+by+Wyndham+Abuja"
              />
            </FadeInSection>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="BUDGET" title="Villa Picasso Boutique Hotel" 
                subtitle="Modern, clean, quiet &amp; cost-effective · Area 11 / Garki (~8 mins to venue)" accent={coral}
                linkText="View on Google Maps" linkUrl="https://maps.google.com/?q=Villa+Picasso+Hotel+Abuja"
              />
            </FadeInSection>
          </>
        )}

        {activeTab === 'fly' && (
          <>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="FLY IN" title="Nnamdi Azikiwe Airport (ABV)" 
                subtitle="Approximately 40–45 mins drive directly to Guzape Hills via the Airport Expressway." accent={gold}
                linkText="Airport directions map" linkUrl="https://maps.google.com/?q=Nnamdi+Azikiwe+International+Airport"
              />
            </FadeInSection>
            <FadeInSection>
              <TravelCard 
                palette={palette} tag="RIDES" title="Uber &amp; Bolt in Abuja" 
                subtitle="Uber and Bolt operate seamlessly across Abuja. Direct drop-off at The Nest at Guzape Hills gates (₦2,000–₦3,500 avg from hotels)." accent={coral}
              />
            </FadeInSection>
          </>
        )}

        {activeTab === 'climate' && (
          <FadeInSection>
            <TravelCard 
              palette={palette} tag="WEATHER" title="December in Guzape Hills" 
              subtitle="Warm, sunny afternoons (~30°C / 86°F) and crisp, cool, breezy hilltop evenings (~18°C / 64°F). We recommend packing a light evening jacket or shawl!" accent={gold}
            />
          </FadeInSection>
        )}
      </div>
    </section>
  );
}
