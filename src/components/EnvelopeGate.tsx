import React from 'react';
import { findGuestByCode, type Guest } from '../utils/guestDb';
import { Floral, Leaf } from './Accents';

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
  onHostUnlock?: () => void;
  onGuestResolved?: (guest: Guest) => void;
  palette: Palette;
}

type GateStage = 'closed' | 'opening' | 'revealed' | 'leaving';

export default function EnvelopeGate({
  guestName,
  onUnlock,
  onHostUnlock,
  onGuestResolved,
  palette,
}: EnvelopeGateProps) {
  const initialGuest = React.useMemo(() => {
    try {
      const code = new URL(window.location.href).searchParams.get('code') || '';
      return findGuestByCode(code);
    } catch {
      return undefined;
    }
  }, []);

  const [stage, setStage] = React.useState<GateStage>('closed');
  const [code, setCode] = React.useState('');
  const [resolvedGuest, setResolvedGuest] = React.useState<Guest | undefined>(initialGuest);
  const [bypassName, setBypassName] = React.useState('');
  const [error, setError] = React.useState('');
  const timers = React.useRef<number[]>([]);
  const gateRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const displayName = resolvedGuest?.name || bypassName || guestName || 'Honoured Guest';
  const hasInvitation = Boolean(resolvedGuest || bypassName);

  const later = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
  };

  const openEnvelope = () => {
    if (stage !== 'closed' || !hasInvitation) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    gateRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setStage('opening');
    later(() => setStage('revealed'), 1650);
  };

  const resolveCode = (event: React.FormEvent) => {
    event.preventDefault();
    const inputCode = code.trim().toLowerCase();

    if (!inputCode) {
      setError('Please enter the invitation code from your message.');
      return;
    }

    if (inputCode === 'host' || inputCode === '181226') {
      onHostUnlock?.();
      return;
    }

    const match = findGuestByCode(inputCode);
    const isPreviewCode = inputCode === 'tildeen' || inputCode === '1812';

    if (!match && !isPreviewCode) {
      setError('We could not find that invitation. Check the code and try again.');
      return;
    }

    setError('');
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (match) {
      setResolvedGuest(match);
      onGuestResolved?.(match);
      const url = new URL(window.location.href);
      url.searchParams.set('code', match.code);
      window.history.replaceState({}, '', url.toString());
    } else {
      setBypassName(guestName && guestName !== 'Guest' ? guestName : 'Honoured Guest');
    }

    later(() => {
      setStage('opening');
      later(() => setStage('revealed'), 1650);
    }, 180);
  };

  const enterInvitation = () => {
    setStage('leaving');
    later(onUnlock, 120);
  };

  const { navy: chocolate, ivory, ivoryDeep, gold: deepSage, coral: sage } = palette;

  return (
    <div
      ref={gateRef}
      className={`invitation-gate invitation-gate--${stage}`}
      style={{
        '--invite-ivory': ivory,
        '--invite-ivory-deep': ivoryDeep,
        '--invite-sage': sage,
        '--invite-sage-deep': deepSage,
        '--invite-chocolate': chocolate,
      } as React.CSSProperties}
    >
      <div className="invitation-gate__grain" aria-hidden="true" />
      <div className="invitation-gate__frame" aria-hidden="true" />

      <header className="invitation-gate__masthead">
        <span className="invitation-gate__wordmark">Til <i>&amp;</i> Deen</span>
        <span className="invitation-gate__eyebrow">Nneka &amp; Opeyemi&nbsp;&nbsp;·&nbsp;&nbsp;Abuja</span>
      </header>

      <main className="invitation-gate__main">
        <p className="invitation-gate__kicker">
          {hasInvitation ? `A private invitation for ${displayName}` : 'A private wedding invitation'}
        </p>
        <h1 className="invitation-gate__title">
          You are invited<br />to our wedding.
        </h1>

        <div className="invitation-envelope-scene" aria-live="polite">
          <div className="invitation-envelope-shadow" aria-hidden="true" />
          <div className="invitation-envelope">
            <div className="invitation-envelope__back" />

            <article className="invitation-card" aria-label={`Wedding invitation for ${displayName}`}>
              <div className="invitation-card__corner invitation-card__corner--tl" aria-hidden="true" />
              <div className="invitation-card__corner invitation-card__corner--tr" aria-hidden="true" />
              <div className="invitation-card__corner invitation-card__corner--bl" aria-hidden="true" />
              <div className="invitation-card__corner invitation-card__corner--br" aria-hidden="true" />

              <span className="invitation-card__personalisation">Specially Inviting {displayName}</span>
              <span className="invitation-card__families">The Families of Opiti &amp; Jimoh</span>
              <span className="invitation-card__request">
                request the honour of your presence at the celebration of the marriage of their children
              </span>

              <div className="invitation-card__couple">
                <span className="invitation-card__name">Nneka Opiti</span>
                <span className="invitation-card__connector"><em>&amp;</em></span>
                <span className="invitation-card__name">Opeyemi Jimoh</span>
              </div>

              <span className="invitation-card__rule" />

              <div className="invitation-card__date-lockup">
                <span>Friday</span>
                <b>18</b>
                <span>December<small>2026</small></span>
              </div>

              <span className="invitation-card__place">Abuja, Nigeria</span>
            </article>

            <div className="invitation-envelope__front invitation-envelope__front--left" />
            <div className="invitation-envelope__front invitation-envelope__front--right" />
            <div className="invitation-envelope__front invitation-envelope__front--bottom" />
            <div className="invitation-envelope__flap" />
            <button
              className="invitation-envelope__seal"
              type="button"
              onClick={openEnvelope}
              disabled={!hasInvitation || stage !== 'closed'}
              aria-label={hasInvitation ? `Open invitation for ${displayName}` : 'Enter your invitation code below'}
            >
              <span>T&nbsp;D</span>
            </button>
          </div>
        </div>

        <div className="invitation-gate__controls">
          {stage === 'revealed' ? (
            <button className="invitation-card__enter" type="button" onClick={enterInvitation}>
              Enter the wedding website <span aria-hidden="true">→</span>
            </button>
          ) : hasInvitation ? (
            <>
              <button className="invitation-gate__open" type="button" onClick={openEnvelope}>
                Open your invitation
              </button>
              <span className="invitation-gate__hint">Tap the seal or the button to begin</span>
            </>
          ) : (
            <form className="invitation-code" onSubmit={resolveCode} noValidate>
              <label htmlFor="invitation-code">Enter your invitation code</label>
              <div className="invitation-code__row">
                <input
                  id="invitation-code"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Your private code"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'invitation-code-error' : undefined}
                />
                <button type="submit">Continue</button>
              </div>
              <p id="invitation-code-error" className="invitation-code__message" role="alert">
                {error || 'You’ll find this code in the invitation message we sent you.'}
              </p>
            </form>
          )}
        </div>
      </main>

      <footer className="invitation-gate__footer">
        <span>Friday, 18 December 2026</span>
        <span aria-hidden="true">·</span>
        <span>Abuja, Nigeria</span>
      </footer>
    </div>
  );
}
