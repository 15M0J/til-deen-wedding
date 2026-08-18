import React from 'react';
import type { SectionProps } from './Sections';
import { FadeInSection, SectionHeader } from './Sections';
import { Squiggle } from './Accents';
import {
  getWishlist,
  reserveWishlistItem,
  type WishlistItem,
  DEFAULT_WISHLIST,
  getCustomGifts,
  addCustomGiftPledge,
  type CustomGiftPledge,
} from '../utils/registryDb';
export { type WishlistItem, DEFAULT_WISHLIST };
import { toast } from 'react-toastify';

export function Registry({ palette }: SectionProps) {
  const { navy, gold, coral, ivoryDeep, ivory } = palette;
  const [activeTab, setActiveTab] = React.useState<'wishlist' | 'cash' | 'custom'>('wishlist');
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>(() => getWishlist());
  const [customGifts, setCustomGifts] = React.useState<CustomGiftPledge[]>(() => getCustomGifts());

  // Modal reservation state
  const [reservingItem, setReservingItem] = React.useState<WishlistItem | null>(null);
  const [guestNameInput, setGuestNameInput] = React.useState('');
  const [guestEmailInput, setGuestEmailInput] = React.useState('');
  const [isAnonymousReservation, setIsAnonymousReservation] = React.useState(false);

  // Custom Gift Modal state
  const [showCustomGiftModal, setShowCustomGiftModal] = React.useState(false);
  const [customGuestName, setCustomGuestName] = React.useState('');
  const [customGuestEmail, setCustomGuestEmail] = React.useState('');
  const [isAnonymousCustom, setIsAnonymousCustom] = React.useState(false);
  const [customGiftTitle, setCustomGiftTitle] = React.useState('');
  const [customGiftMessage, setCustomGiftMessage] = React.useState('');

  const loadData = React.useCallback(() => {
    setWishlist(getWishlist());
    setCustomGifts(getCustomGifts());
  }, []);

  React.useEffect(() => {
    window.addEventListener('registry_updated', loadData);
    window.addEventListener('custom_gifts_updated', loadData);
    return () => {
      window.removeEventListener('registry_updated', loadData);
      window.removeEventListener('custom_gifts_updated', loadData);
    };
  }, [loadData]);

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } else {
      toast.info(`${label}: ${text}`);
    }
  };

  const createStoreItemEmailUrl = (item: WishlistItem, userEmail: string) => {
    const currentWebsiteUrl = window.location.href;
    const subject = encodeURIComponent(`Gift Reserved: ${item.title} · Nneka & Opeyemi's Wedding`);
    const body = encodeURIComponent(
      `Hello!\n\n` +
      `Thank you for reserving "${item.title}" for Nneka & Opeyemi's Wedding (18 December 2026).\n\n` +
      `WHERE TO PURCHASE THIS GIFT:\n` +
      (item.url ? `Store Link: ${item.url}\n\n` : `Store / Voucher: Available in-store or online at your preferred retailer.\n\n`) +
      `WEDDING WEBSITE:\n` +
      `You can return to the wedding website anytime here:\n${currentWebsiteUrl}\n\n` +
      `WEDDING DAY GIFT TABLE:\n` +
      `Physical boxed gifts will be received at the secure Gift Station at The Nest at Guzape Hills, Abuja on the wedding day.\n\n` +
      `With our warmest regards,\nNneka Opiti & Opeyemi Jimoh`
    );
    return `mailto:${encodeURIComponent(userEmail)}?subject=${subject}&body=${body}`;
  };

  const createExperienceEmailUrl = (item: WishlistItem, userEmail: string) => {
    const currentWebsiteUrl = window.location.href;
    const subject = encodeURIComponent(`Contribution Details: ${item.title} · Nneka & Opeyemi's Wedding`);
    const body = encodeURIComponent(
      `Hello!\n\n` +
      `Thank you for contributing towards "${item.title}" for Nneka & Opeyemi's Wedding (18 December 2026).\n\n` +
      `Here are the payment options for your contribution:\n\n` +
      `NAIRA DIRECT BANK TRANSFER:\n` +
      `Bank: Guaranty Trust Bank (GTBank)\n` +
      `Account Name: Muyideen Jimoh\n` +
      `Account Number: 0157951636\n\n` +
      `INTERNATIONAL (USD / GBP / EUR / PAYPAL):\n` +
      `PayPal Pool: https://www.paypal.com/pool/9rNISKnCNI?sr=accr\n` +
      `PayPal Email: tildeenjimoh@gmail.com\n\n` +
      `WEDDING WEBSITE:\n` +
      `${currentWebsiteUrl}\n\n` +
      `With our warmest regards,\nNneka Opiti & Opeyemi Jimoh`
    );
    return `mailto:${encodeURIComponent(userEmail)}?subject=${subject}&body=${body}`;
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservingItem) return;

    if (!isAnonymousReservation && !guestNameInput.trim()) {
      toast.error('Please enter your name or check "Give anonymously".');
      return;
    }

    if (!guestEmailInput.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    const finalName = isAnonymousReservation ? (guestNameInput.trim() || 'A Well-Wisher') : guestNameInput.trim();
    const result = reserveWishlistItem(
      reservingItem.id,
      finalName,
      guestEmailInput.trim(),
      isAnonymousReservation
    );

    if (result.success) {
      if (reservingItem.category === 'EXPERIENCE') {
        window.location.href = createExperienceEmailUrl(reservingItem, guestEmailInput.trim());
        toast.success(`Thank you, ${finalName}! Contribution confirmed. Payment details sent to your email.`, { autoClose: 5000 });
      } else {
        window.location.href = createStoreItemEmailUrl(reservingItem, guestEmailInput.trim());
        toast.success(`Thank you, ${finalName}! "${reservingItem.title}" reserved. Store link sent to your email.`, { autoClose: 5000 });
      }

      setWishlist(getWishlist());
      setReservingItem(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleConfirmCustomGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGiftTitle.trim()) {
      toast.error('Please describe your gift.');
      return;
    }

    if (!isAnonymousCustom && !customGuestName.trim()) {
      toast.error('Please enter your name or check "Give anonymously".');
      return;
    }

    if (!customGuestEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    const finalName = isAnonymousCustom ? (customGuestName.trim() || 'A Well-Wisher') : customGuestName.trim();
    addCustomGiftPledge(
      finalName,
      customGiftTitle.trim(),
      customGuestEmail.trim(),
      isAnonymousCustom,
      customGiftMessage.trim()
    );

    toast.success(`Thank you, ${finalName}! Your custom gift pledge has been noted.`, { autoClose: 5000 });
    setCustomGifts(getCustomGifts());
    setShowCustomGiftModal(false);
  };

  const tabStyle = (tabName: 'cash' | 'wishlist' | 'custom'): React.CSSProperties => ({
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
        <SectionHeader kicker="celebrate with us" title="Wedding registry" palette={palette}
          accent={<Squiggle color={gold} w={100}/>}/>
      </FadeInSection>
      
      <FadeInSection>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: navy, opacity: 0.82, marginBottom: 18, lineHeight: 1.55 }}>
          Your presence and prayers are the greatest gifts. If you wish to honour us with a gift or contribute towards our new journey, convenient options are provided below.
        </div>
      </FadeInSection>

      <FadeInSection>
        <div style={{ display: 'flex', marginBottom: 20, gap: 2, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="hide-scroll">
          <button onClick={() => setActiveTab('wishlist')} style={{ ...tabStyle('wishlist'), minWidth: 'max-content' }}>Wishlist Items</button>
          <button onClick={() => setActiveTab('cash')} style={{ ...tabStyle('cash'), minWidth: 'max-content' }}>Cash &amp; Transfers</button>
          <button onClick={() => setActiveTab('custom')} style={{ ...tabStyle('custom'), minWidth: 'max-content' }}>Custom / Off-List</button>
        </div>
      </FadeInSection>

      {/* WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {wishlist.map((item) => {
            const isUnlimited = !!item.isUnlimited;
            const isFullyClaimed = !isUnlimited && item.reservedBy.length >= item.maxReservations;
            const remainingSlots = item.maxReservations - item.reservedBy.length;

            return (
              <FadeInSection key={item.id}>
                <div
                  className="glass-card hover-lift"
                  style={{
                    background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16,
                    padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 8px 20px rgba(22, 45, 90, 0.03)', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 800,
                        letterSpacing: 1.2, color: navy, background: item.category === 'EXPERIENCE' ? coral : item.category === 'KITCHEN' ? '#E8C5A0' : gold,
                        padding: '3px 8px', borderRadius: 6, border: `1.2px solid ${navy}`, textTransform: 'uppercase'
                      }}>
                        {item.category}
                      </span>
                      {item.price && (
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                          color: navy, opacity: 0.8
                        }}>
                          {item.price}
                        </span>
                      )}
                    </div>

                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                      color: isFullyClaimed ? '#991b1b' : '#166534',
                      background: isFullyClaimed ? '#fee2e2' : '#dcfce7',
                      padding: '3px 8px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 0.5
                    }}>
                      {isFullyClaimed
                        ? 'Reserved'
                        : isUnlimited
                        ? (item.reservedBy.length > 0 ? `${item.reservedBy.length} Contributed` : 'Available')
                        : item.reservedBy.length > 0
                        ? `${remainingSlots} Remaining`
                        : 'Available'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: 68, height: 68, objectFit: 'cover', borderRadius: 10,
                          border: `1.2px solid ${navy}`, flexShrink: 0, background: '#fff'
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17.5, color: navy, lineHeight: 1.25 }}>
                        {item.title}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.75, marginTop: 4, lineHeight: 1.4 }}>
                        {item.note}
                      </div>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11.5,
                            fontWeight: 700, color: navy, marginTop: 7, textDecoration: 'none',
                            borderBottom: `1.5px solid ${navy}`, paddingBottom: 1
                          }}
                        >
                          Where to Buy / Store Link →
                        </a>
                      )}
                    </div>
                  </div>

                  {!isFullyClaimed ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReservingItem(item);
                        setGuestNameInput('');
                        setGuestEmailInput('');
                        setIsAnonymousReservation(false);
                      }}
                      style={{
                        marginTop: 2, padding: '9px 14px', background: navy, color: ivory,
                        border: 'none', borderRadius: 8, fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: '0 2px 8px rgba(22, 45, 90, 0.12)'
                      }}
                    >
                      {isUnlimited
                        ? (item.category === 'EXPERIENCE' ? 'Contribute to this Experience' : item.title.includes('Gift Card') ? 'Reserve / Pledge a Gift Card' : 'Reserve this Gift')
                        : item.maxReservations > 1
                        ? `Pledge to this Gift (${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} left)`
                        : 'Reserve this Gift'}
                    </button>
                  ) : (
                    <div style={{
                      textAlign: 'center', fontSize: 12, fontWeight: 700, color: navy, opacity: 0.6,
                      padding: '6px', fontFamily: "'DM Sans', sans-serif"
                    }}>
                      Reserved — Thank you
                    </div>
                  )}
                </div>
              </FadeInSection>
            );
          })}

          {/* Quick link to custom gift */}
          <FadeInSection>
            <div
              className="glass-card hover-lift"
              style={{
                background: '#fff', border: `1.8px dashed ${navy}`, borderRadius: 16,
                padding: '18px 16px', textAlign: 'center', marginTop: 10
              }}
            >
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: navy }}>
                Have something special in mind not on this list?
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.75, margin: '6px 0 14px' }}>
                We would be delighted! Let us know what you are planning so we can anticipate it.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowCustomGiftModal(true);
                  setCustomGuestName('');
                  setCustomGuestEmail('');
                  setIsAnonymousCustom(false);
                  setCustomGiftTitle('');
                  setCustomGiftMessage('');
                }}
                style={{
                  padding: '9px 20px', background: coral, color: navy, border: `1.5px solid ${navy}`,
                  borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Pledge a Custom Gift
              </button>
            </div>
          </FadeInSection>
        </div>
      )}

      {/* CASH & TRANSFERS TAB */}
      {activeTab === 'cash' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Naira GTBank Card */}
          <FadeInSection>
            <div 
              className="glass-card hover-lift"
              style={{
                background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16,
                padding: '20px 18px', position: 'relative',
                boxShadow: '0 8px 24px rgba(22, 45, 90, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
                  letterSpacing: 1.5, textTransform: 'uppercase', color: navy,
                  background: coral, padding: '4px 8px', borderRadius: 6, border: `1.2px solid ${navy}`
                }}>
                  NIGERIA (NAIRA)
                </span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: navy, opacity: 0.7 }}>
                  Direct Bank Transfer
                </span>
              </div>

              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy, lineHeight: 1.2 }}>
                Guaranty Trust Bank (GTBank)
              </div>

              <div style={{ margin: '12px 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: navy }}>
                  <span style={{ opacity: 0.65 }}>Account Name:</span>
                  <strong>Muyideen Jimoh</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: navy }}>
                  <span style={{ opacity: 0.65 }}>Account Number:</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 1 }}>0157951636</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy('0157951636', 'GTBank Account Number')}
                style={{
                  width: '100%', padding: '10px 16px', background: navy, color: ivory,
                  border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(22, 45, 90, 0.15)'
                }}
              >
                Copy Account Number (0157951636)
              </button>
            </div>
          </FadeInSection>

          {/* International PayPal Card */}
          <FadeInSection>
            <div 
              className="glass-card hover-lift"
              style={{
                background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16,
                padding: '20px 18px', position: 'relative',
                boxShadow: '0 8px 24px rgba(22, 45, 90, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
                  letterSpacing: 1.5, textTransform: 'uppercase', color: navy,
                  background: gold, padding: '4px 8px', borderRadius: 6, border: `1.2px solid ${navy}`
                }}>
                  INTERNATIONAL (USD / GBP / EUR)
                </span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: navy, opacity: 0.7 }}>
                  PayPal Pool
                </span>
              </div>

              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy, lineHeight: 1.2 }}>
                PayPal Money Pool &amp; Diaspora Gifts
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.75, margin: '8px 0 14px', lineHeight: 1.45 }}>
                For our friends and family gifting from abroad via Credit Card, Debit Card, or PayPal.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href="https://www.paypal.com/pool/9rNISKnCNI?sr=accr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%', padding: '11px 16px', background: coral, color: navy,
                    border: `1.8px solid ${navy}`, borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(22, 45, 90, 0.08)', transition: 'all 0.2s'
                  }}
                >
                  Send via PayPal Pool →
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy('tildeenjimoh@gmail.com', 'PayPal Email')}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'transparent', color: navy,
                    border: `1.2px solid ${navy}40`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  Copy Email: tildeenjimoh@gmail.com
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      )}

      {/* CUSTOM / OFF-LIST GIFTS TAB */}
      {activeTab === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FadeInSection>
            <div
              className="glass-card"
              style={{
                background: ivory, border: `1.8px solid ${navy}`, borderRadius: 16,
                padding: '20px 18px', boxShadow: '0 8px 24px rgba(22, 45, 90, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy }}>
                  Surprise &amp; Custom Gifts
                </h3>
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: navy, opacity: 0.8, lineHeight: 1.5, marginBottom: 16 }}>
                Have a unique gift, artwork, family heirloom, or personal item in mind that isn't on our registry list? We would be deeply touched!
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowCustomGiftModal(true);
                  setCustomGuestName('');
                  setCustomGuestEmail('');
                  setIsAnonymousCustom(false);
                  setCustomGiftTitle('');
                  setCustomGiftMessage('');
                }}
                style={{
                  width: '100%', padding: '12px 18px', background: coral, color: navy,
                  border: `1.8px solid ${navy}`, borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 12px rgba(22, 45, 90, 0.08)'
                }}
              >
                Tell Us About Your Custom Gift
              </button>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${navy}18`, fontSize: 12, color: navy, opacity: 0.75, textAlign: 'center' }}>
                <em>Physical gifts will also be lovingly received at the secure Gift Station at The Nest at Guzape Hills on the wedding day.</em>
              </div>
            </div>
          </FadeInSection>
        </div>
      )}

      {/* MODAL: Reservation Form */}
      {reservingItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px'
        }}>
          <div style={{
            background: ivory, border: `2px solid ${navy}`, borderRadius: 20,
            padding: '22px 18px', maxWidth: 440, width: '100%', maxHeight: '92vh', overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
                  letterSpacing: 1.2, color: navy, background: gold, padding: '3px 8px', borderRadius: 6
                }}>
                  RESERVE GIFT
                </span>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy, marginTop: 8, lineHeight: 1.2 }}>
                  {reservingItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReservingItem(null)}
                style={{
                  background: 'none', border: 'none', fontSize: 22, color: navy,
                  cursor: 'pointer', padding: 4, lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.8, marginBottom: 14 }}>
              {reservingItem.category === 'EXPERIENCE'
                ? 'Enter your details below to pledge to this experience. Payment details will be sent directly to your email.'
                : 'Enter your details below to reserve this gift. The store purchase link will be sent directly to your email.'}
            </p>

            <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Your Name (or Family Name)
                </label>
                <input
                  type="text"
                  placeholder={isAnonymousReservation ? "Anonymous Well-Wisher" : "e.g. Adaeze Obi"}
                  value={guestNameInput}
                  disabled={isAnonymousReservation}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: isAnonymousReservation ? '#f3f4f6' : '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymousReservation}
                  onChange={(e) => setIsAnonymousReservation(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: navy, cursor: 'pointer' }}
                />
                <label htmlFor="anonCheck" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: navy, cursor: 'pointer', fontWeight: 600 }}>
                  Give anonymously (Only Nneka &amp; Opeyemi will know)
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adaeze@example.com"
                  value={guestEmailInput}
                  onChange={(e) => setGuestEmailInput(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setReservingItem(null)}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent',
                    border: `1.5px solid ${navy}`, borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: navy, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '10px', background: coral,
                    border: `1.5px solid ${navy}`, borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800, color: navy, cursor: 'pointer'
                  }}
                >
                  {reservingItem.category === 'EXPERIENCE' ? 'Confirm Contribution' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Custom / Off-List Gift */}
      {showCustomGiftModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px'
        }}>
          <div style={{
            background: ivory, border: `2px solid ${navy}`, borderRadius: 20,
            padding: '22px 18px', maxWidth: 440, width: '100%', maxHeight: '92vh', overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
                  letterSpacing: 1.2, color: navy, background: coral, padding: '3px 8px', borderRadius: 6
                }}>
                  OFF-LIST GIFT PLEDGE
                </span>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: navy, marginTop: 8, lineHeight: 1.2 }}>
                  Your Custom Gift Idea
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomGiftModal(false)}
                style={{
                  background: 'none', border: 'none', fontSize: 22, color: navy,
                  cursor: 'pointer', padding: 4, lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: navy, opacity: 0.8, marginBottom: 14 }}>
              Let Nneka &amp; Opeyemi know what surprise or personal gift you are planning so they can anticipate it with joy.
            </p>

            <form onSubmit={handleConfirmCustomGift} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Your Name (or Family Name)
                </label>
                <input
                  type="text"
                  placeholder={isAnonymousCustom ? "Anonymous Well-Wisher" : "e.g. Lanre & Praise"}
                  value={customGuestName}
                  disabled={isAnonymousCustom}
                  onChange={(e) => setCustomGuestName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: isAnonymousCustom ? '#f3f4f6' : '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="anonCustomCheck"
                  checked={isAnonymousCustom}
                  onChange={(e) => setIsAnonymousCustom(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: navy, cursor: 'pointer' }}
                />
                <label htmlFor="anonCustomCheck" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: navy, cursor: 'pointer', fontWeight: 600 }}>
                  Pledge anonymously
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. guest@example.com"
                  value={customGuestEmail}
                  onChange={(e) => setCustomGuestEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Gift Description / Idea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Framed Art piece / Dinnerware set / Custom surprise"
                  value={customGiftTitle}
                  onChange={(e) => setCustomGiftTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: navy, marginBottom: 4 }}>
                  Optional Note / Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bringing this in person to the wedding celebration!"
                  value={customGiftMessage}
                  onChange={(e) => setCustomGiftMessage(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${navy}`, background: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: navy, outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCustomGiftModal(false)}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent',
                    border: `1.5px solid ${navy}`, borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: navy, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '10px', background: coral,
                    border: `1.8px solid ${navy}`, borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800, color: navy, cursor: 'pointer'
                  }}
                >
                  Notify the Couple
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
