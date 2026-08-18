import React from 'react';
import { findGuestByCode, updateGuest, type Guest } from '../utils/guestDb';

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

type EventChoice = 'both' | 'ceremony' | 'reception' | 'none';
type RsvpStep = 'attendance' | 'party' | 'events' | 'review' | 'complete';

interface AnswerData {
  attending?: 'yes' | 'no';
  guestsCount: number;
  eventsAttending: EventChoice;
}

const EVENT_LABELS: Record<EventChoice, string> = {
  both: 'Ceremony & reception',
  ceremony: 'Ceremony only',
  reception: 'Reception only',
  none: 'Not attending',
};

function getGuest(guestName: string): Guest {
  const code = new URL(window.location.href).searchParams.get('code') || '';
  const guest = findGuestByCode(code);
  if (guest) return guest;

  return {
    id: 'temp',
    name: guestName || 'Honoured Guest',
    code: 'preview',
    maxGuests: 2,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    updatedAt: '',
  };
}

export default function RsvpChat({ guestName, palette }: RsvpChatProps) {
  const activeGuest = React.useMemo(() => getGuest(guestName), [guestName]);
  const hasExistingResponse = activeGuest.status !== 'PENDING';
  const [step, setStep] = React.useState<RsvpStep>(hasExistingResponse ? 'review' : 'attendance');
  const [answers, setAnswers] = React.useState<AnswerData>({
    attending: activeGuest.status === 'ATTENDING' ? 'yes' : activeGuest.status === 'DECLINED' ? 'no' : undefined,
    guestsCount: activeGuest.attendingCount || (activeGuest.maxGuests === 1 ? 1 : 0),
    eventsAttending: activeGuest.eventsAttending,
  });
  const [saving, setSaving] = React.useState(false);

  const { navy: chocolate, ivory, ivoryDeep, gold: deepSage, coral: sage } = palette;
  const firstName = activeGuest.name.split(' ')[0];

  const flow: RsvpStep[] = [
    'attendance',
    ...(activeGuest.maxGuests > 1 ? ['party' as RsvpStep] : []),
    'events',
    'review',
  ];
  const progressIndex = step === 'complete' ? flow.length : Math.max(0, flow.indexOf(step));

  const chooseAttendance = (attending: 'yes' | 'no') => {
    if (attending === 'no') {
      setAnswers({ attending, guestsCount: 0, eventsAttending: 'none' });
      setStep('review');
      return;
    }

    setAnswers((current) => ({
      ...current,
      attending,
      guestsCount: activeGuest.maxGuests === 1 ? 1 : Math.max(current.guestsCount, 1),
      eventsAttending: current.eventsAttending === 'none' ? 'both' : current.eventsAttending,
    }));
    setStep(activeGuest.maxGuests === 1 ? 'events' : 'party');
  };

  const saveResponse = () => {
    if (!answers.attending) return;
    setSaving(true);

    window.setTimeout(() => {
      if (activeGuest.id !== 'temp') {
        updateGuest(activeGuest.id, answers.attending === 'yes'
          ? {
              status: 'ATTENDING',
              attendingCount: Math.min(Math.max(answers.guestsCount, 1), activeGuest.maxGuests),
              eventsAttending: answers.eventsAttending === 'none' ? 'both' : answers.eventsAttending,
            }
          : {
              status: 'DECLINED',
              attendingCount: 0,
              eventsAttending: 'none',
            });
      } else {
        localStorage.setItem('tildeen_rsvp_preview', JSON.stringify(answers));
      }
      setSaving(false);
      setStep('complete');
    }, 420);
  };

  const goBack = () => {
    if (step === 'party') setStep('attendance');
    if (step === 'events') setStep(activeGuest.maxGuests > 1 ? 'party' : 'attendance');
    if (step === 'review') {
      setStep(answers.attending === 'yes' ? 'events' : 'attendance');
    }
  };

  const choiceStyle = {
    '--rsvp-chocolate': chocolate,
    '--rsvp-ivory': ivory,
    '--rsvp-ivory-deep': ivoryDeep,
    '--rsvp-sage': sage,
    '--rsvp-sage-deep': deepSage,
  } as React.CSSProperties;

  return (
    <div className="rsvp-experience" style={choiceStyle}>
      <header className="rsvp-experience__header">
        <div>
          <p>Til &amp; Deen · Wedding RSVP</p>
          <h2>{firstName}, we would love to celebrate with you.</h2>
        </div>
      </header>

      {step !== 'complete' && (
        <div className="rsvp-progress" aria-label={`Step ${Math.min(progressIndex + 1, flow.length)} of ${flow.length}`}>
          {flow.map((item, index) => (
            <span
              key={item}
              className={index <= progressIndex ? 'rsvp-progress__step rsvp-progress__step--active' : 'rsvp-progress__step'}
            />
          ))}
        </div>
      )}

      <main className="rsvp-experience__body">
        {step === 'attendance' && (
          <section className="rsvp-panel rsvp-panel--enter">
            <span className="rsvp-panel__eyebrow">Your response</span>
            <h3>Will you be joining us?</h3>
            <p className="rsvp-panel__lead">
              Your invitation has space reserved for up to {activeGuest.maxGuests} {activeGuest.maxGuests === 1 ? 'guest' : 'guests'}.
            </p>
            <div className="rsvp-choice-grid">
              <button type="button" className="rsvp-choice" onClick={() => chooseAttendance('yes')}>
                <span className="rsvp-choice__icon" aria-hidden="true">✓</span>
                <strong>Joyfully accepts</strong>
                <small>Yes, I’ll be there</small>
              </button>
              <button type="button" className="rsvp-choice" onClick={() => chooseAttendance('no')}>
                <span className="rsvp-choice__icon rsvp-choice__icon--outline" aria-hidden="true">×</span>
                <strong>Regretfully declines</strong>
                <small>I won’t be able to attend</small>
              </button>
            </div>
          </section>
        )}

        {step === 'party' && (
          <section className="rsvp-panel rsvp-panel--enter">
            <span className="rsvp-panel__eyebrow">Your party</span>
            <h3>How many seats should we reserve?</h3>
            <p className="rsvp-panel__lead">Please include yourself in the total.</p>
            <div className="rsvp-number-grid">
              {Array.from({ length: activeGuest.maxGuests }, (_, index) => index + 1).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={answers.guestsCount === count ? 'rsvp-number rsvp-number--selected' : 'rsvp-number'}
                  aria-pressed={answers.guestsCount === count}
                  onClick={() => {
                    setAnswers((current) => ({ ...current, guestsCount: count }));
                    window.setTimeout(() => setStep('events'), 180);
                  }}
                >
                  <strong>{count}</strong>
                  <span>{count === 1 ? 'guest' : 'guests'}</span>
                </button>
              ))}
            </div>
            <button type="button" className="rsvp-back" onClick={goBack}>← Back</button>
          </section>
        )}

        {step === 'events' && (
          <section className="rsvp-panel rsvp-panel--enter">
            <span className="rsvp-panel__eyebrow">The celebration</span>
            <h3>Which events will you attend?</h3>
            <p className="rsvp-panel__lead">Select the option that best describes your plans.</p>
            <div className="rsvp-event-list">
              {([
                ['both', 'The full celebration', 'Ceremony and reception'],
                ['ceremony', 'The ceremony', 'Wedding ceremony only'],
                ['reception', 'The reception', 'Dinner and celebration only'],
              ] as const).map(([value, title, detail]) => (
                <button
                  key={value}
                  type="button"
                  className={answers.eventsAttending === value ? 'rsvp-event rsvp-event--selected' : 'rsvp-event'}
                  aria-pressed={answers.eventsAttending === value}
                  onClick={() => {
                    setAnswers((current) => ({ ...current, eventsAttending: value }));
                    window.setTimeout(() => setStep('review'), 180);
                  }}
                >
                  <span><strong>{title}</strong><small>{detail}</small></span>
                  <i aria-hidden="true">{answers.eventsAttending === value ? '✓' : '→'}</i>
                </button>
              ))}
            </div>
            <button type="button" className="rsvp-back" onClick={goBack}>← Back</button>
          </section>
        )}

        {step === 'review' && (
          <section className="rsvp-panel rsvp-panel--enter">
            <span className="rsvp-panel__eyebrow">Please confirm</span>
            <h3>{answers.attending === 'yes' ? 'Everything look right?' : 'We’ll miss you, ' + firstName + '.'}</h3>
            <p className="rsvp-panel__lead">
              {answers.attending === 'yes'
                ? 'Review your response before we add it to the guest list.'
                : 'Thank you for letting us know. Please confirm your response below.'}
            </p>

            <dl className="rsvp-summary">
              <div><dt>Guest</dt><dd>{activeGuest.name}</dd></div>
              <div><dt>Response</dt><dd>{answers.attending === 'yes' ? 'Attending' : 'Unable to attend'}</dd></div>
              {answers.attending === 'yes' && (
                <>
                  <div><dt>Party size</dt><dd>{answers.guestsCount} of {activeGuest.maxGuests} reserved</dd></div>
                  <div><dt>Events</dt><dd>{EVENT_LABELS[answers.eventsAttending]}</dd></div>
                </>
              )}
            </dl>

            <button type="button" className="rsvp-primary" disabled={saving} onClick={saveResponse}>
              {saving ? 'Saving your response…' : 'Confirm RSVP'}
            </button>
            <button type="button" className="rsvp-back rsvp-back--center" onClick={() => setStep('attendance')}>Edit response</button>
          </section>
        )}

        {step === 'complete' && (
          <section className="rsvp-panel rsvp-panel--complete rsvp-panel--enter">
            <div className="rsvp-complete-mark" aria-hidden="true">✓</div>
            <span className="rsvp-panel__eyebrow">Response received</span>
            <h3>{answers.attending === 'yes' ? `We can’t wait to see you, ${firstName}.` : `Thank you for letting us know, ${firstName}.`}</h3>
            <p className="rsvp-panel__lead">
              {answers.attending === 'yes'
                ? `We’ve reserved ${answers.guestsCount} ${answers.guestsCount === 1 ? 'seat' : 'seats'} for ${EVENT_LABELS[answers.eventsAttending].toLowerCase()}.`
                : 'Your response has been saved. You’ll be with us in spirit.'}
            </p>
            <div className="rsvp-date-lockup">
              <span>Friday</span><strong>18</strong><span>December 2026</span>
            </div>
            <button type="button" className="rsvp-secondary" onClick={() => setStep('attendance')}>Update my response</button>
          </section>
        )}
      </main>

      <footer className="rsvp-experience__footer">Nneka &amp; Opeyemi · Abuja, Nigeria · 18 December 2026</footer>
    </div>
  );
}
