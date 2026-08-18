import React from 'react';
import type { SectionProps } from './Sections';
import { FadeInSection, SectionHeader } from './Sections';

export function WeddingParty({ palette }: SectionProps) {
  const { ivory } = palette;
  const groups = [
    {
      title: 'Bridesmaids',
      subtitle: 'Chocolate satin',
      color: '#3D2314',
      ink: '#FFFFF0',
      members: [
        { name: 'Adaeze', role: 'Bridesmaid' },
        { name: 'Chika', role: 'Bridesmaid' },
        { name: 'Praise', role: 'Bridesmaid' },
        { name: 'Saidat', role: 'Bridesmaid' },
        { name: 'Oluwatosin', role: 'Bridesmaid' },
      ],
    },
    {
      title: 'Groomsmen',
      subtitle: 'Sage green',
      color: '#435740',
      ink: '#FFFFF0',
      members: [
        { name: 'Kelechi', role: 'Groomsman' },
        { name: 'Lanre', role: 'Groomsman' },
        { name: 'Bolaji', role: 'Groomsman' },
        { name: 'Dunsin', role: 'Groomsman' },
        { name: 'To be confirmed', role: 'Groomsman' },
      ],
    },
  ];

  return (
    <section style={{ padding: '40px 22px', background: ivory }}>
      <FadeInSection>
        <SectionHeader kicker="our people" title="The wedding party" palette={palette}/>
      </FadeInSection>

      <div className="wedding-party-groups">
        {groups.map((group) => (
          <FadeInSection key={group.title}>
            <div className="wedding-party-group" style={{ '--party-color': group.color, '--party-ink': group.ink } as React.CSSProperties}>
              <header className="wedding-party-group__header">
                <div><span>{group.subtitle}</span><h3>{group.title}</h3></div>
              </header>
              <div className="wedding-party-group__members">
                {group.members.map((member, index) => (
                  <div className="wedding-party-member" key={`${group.title}-${member.name}-${index}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{member.name}</strong><small>{member.role}</small></div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
