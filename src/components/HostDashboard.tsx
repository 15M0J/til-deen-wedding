import React from 'react';
import { getGuests, saveGuests, addGuest, updateGuest, deleteGuest, resetGuests, clearAllGuests, importGuestsFromCsv, type Guest } from '../utils/guestDb';
import { getStoredTables, type TableDefinition } from '../utils/tableDb';
import { toast } from 'react-toastify';
import type { Palette } from './Sections';
import { HostRegistryManager } from './HostRegistryManager';
import { HostSeatingManager } from './HostSeatingManager';
import { HostGalleryManager } from './HostGalleryManager';

interface HostDashboardProps {
  palette: Palette;
  onExit: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function HostDashboard({ palette, onExit }: HostDashboardProps) {
  const { navy, ivory, gold, coral, ivoryDeep } = palette;

  const [dashboardSection, setDashboardSection] = React.useState<'guests' | 'seating' | 'gallery' | 'registry'>('guests');
  const [guests, setGuests] = React.useState<Guest[]>(() => getGuests());
  const [availableTables, setAvailableTables] = React.useState<TableDefinition[]>(() => getStoredTables());
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'ATTENDING' | 'DECLINED' | 'PENDING'>('ALL');
  
  // Modal & Form states
  const [newGuestName, setNewGuestName] = React.useState('');
  const [newGuestCode, setNewGuestCode] = React.useState('');
  const [newMaxGuests, setNewMaxGuests] = React.useState(2);
  const [newGuestTag, setNewGuestTag] = React.useState<Guest['tag']>('FRIEND');
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const [newPhone, setNewPhone] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');

  // Edit guest states
  const [editingGuest, setEditingGuest] = React.useState<Guest | null>(null);
  const [editStatus, setEditStatus] = React.useState<'PENDING' | 'ATTENDING' | 'DECLINED'>('PENDING');
  const [editAttendingCount, setEditAttendingCount] = React.useState(1);
  const [editEvents, setEditEvents] = React.useState<'both' | 'ceremony' | 'reception' | 'none'>('both');
  const [editTag, setEditTag] = React.useState<Guest['tag']>('FRIEND');
  const [editTableNumber, setEditTableNumber] = React.useState('');
  const [editPhone, setEditPhone] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');

  // Load guests initially
  const loadData = React.useCallback(() => {
    setGuests(getGuests());
    setAvailableTables(getStoredTables());
  }, []);

  React.useEffect(() => {
    window.addEventListener('guestDbUpdate', loadData);
    window.addEventListener('tableDbUpdate', loadData);
    return () => {
      window.removeEventListener('guestDbUpdate', loadData);
      window.removeEventListener('tableDbUpdate', loadData);
    };
  }, [loadData]);

  // Sync invitation code as host types guest name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewGuestName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setNewGuestCode(slug);
  };

  // Add guest submit
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestCode.trim()) {
      toast.error('Please fill in both name and invitation code.');
      return;
    }
    try {
      addGuest(newGuestName, newGuestCode, newMaxGuests, {
        tag: newGuestTag,
        tableNumber: newTableNumber.trim() || undefined,
        phone: newPhone.trim() || undefined,
        email: newEmail.trim() || undefined,
      });
      toast.success(`Guest "${newGuestName}" added successfully.`);
      // Reset form
      setNewGuestName('');
      setNewGuestCode('');
      setNewMaxGuests(2);
      setNewGuestTag('FRIEND');
      setNewTableNumber('');
      setNewPhone('');
      setNewEmail('');
      loadData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to add guest'));
    }
  };

  // Delete guest click
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      deleteGuest(id);
      toast.success(`Guest "${name}" removed.`);
      loadData();
    }
  };

  // Open Edit Modal
  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setEditStatus(guest.status);
    setEditAttendingCount(guest.attendingCount || 1);
    setEditEvents(guest.eventsAttending);
    setEditTag(guest.tag || 'FRIEND');
    setEditTableNumber(guest.tableNumber || '');
    setEditPhone(guest.phone || '');
    setEditEmail(guest.email || '');
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!editingGuest) return;
    try {
      const finalAttendingCount = editStatus === 'ATTENDING' ? editAttendingCount : 0;
      const finalEvents = editStatus === 'ATTENDING' ? editEvents : 'none';

      updateGuest(editingGuest.id, {
        status: editStatus,
        attendingCount: finalAttendingCount,
        eventsAttending: finalEvents,
        tag: editTag,
        tableNumber: editTableNumber.trim() || undefined,
        phone: editPhone.trim() || undefined,
        email: editEmail.trim() || undefined,
      });

      toast.success(`RSVP updated for ${editingGuest.name}`);
      setEditingGuest(null);
      loadData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to update guest'));
    }
  };

  // Reset database click
  const handleResetDb = () => {
    if (window.confirm('WARNING: This will reset the guest list to default demo data. Continue?')) {
      resetGuests();
      toast.success('Database reset to demo values.');
      loadData();
    }
  };

  const handleClearAllDb = () => {
    if (window.confirm('WARNING: This will remove ALL guests from the database so you can start completely empty. Continue?')) {
      clearAllGuests();
      toast.success('Guest database cleared.');
      loadData();
    }
  };

  // Copy personal invite link
  const copyInviteLink = (code: string) => {
    const origin = window.location.origin + window.location.pathname;
    const url = `${origin}?code=${code}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Personalized link copied.');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  };

  // Create Guest Direct Invite Email
  const createGuestInviteEmailUrl = (g: Guest) => {
    const origin = window.location.origin + window.location.pathname;
    const inviteUrl = `${origin}?code=${g.code}`;
    const subject = encodeURIComponent(`Wedding Invitation: Til & Deen · 18 December 2026`);
    const body = encodeURIComponent(
      `Dear ${g.name},\n\n` +
      `We would be delighted to have you celebrate with us on our wedding day!\n\n` +
      `CELEBRATION DETAILS:\n` +
      `Date: Friday, 18 December 2026\n` +
      `Location: The Nest at Guzape Hills, Abuja, Nigeria\n\n` +
      `YOUR INVITATION DETAILS:\n` +
      `Invitation Code: ${g.code}\n` +
      `Seats Reserved: ${g.maxGuests} seat${g.maxGuests > 1 ? 's' : ''}\n\n` +
      `PERSONAL RSVP LINK:\n` +
      `Please open your personalized invitation link below to view the wedding schedule, travel guide, gift registry, and submit your RSVP:\n` +
      `${inviteUrl}\n\n` +
      `With all our love,\nTil & Deen`
    );
    const targetEmail = g.email ? encodeURIComponent(g.email) : '';
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  // Create Guest Direct WhatsApp Share URL
  const createGuestInviteWhatsAppUrl = (g: Guest) => {
    const origin = window.location.origin + window.location.pathname;
    const inviteUrl = `${origin}?code=${g.code}`;
    const text = encodeURIComponent(
      `Dear ${g.name},\n\n` +
      `We would be overjoyed to have you celebrate with us on our wedding day! ✨💍\n\n` +
      `*Til & Deen Wedding*\n` +
      `📅 Friday, 18 December 2026\n` +
      `📍 The Nest at Guzape Hills, Abuja\n` +
      `🎟️ Seats Allocated: ${g.maxGuests} seat${g.maxGuests > 1 ? 's' : ''}\n\n` +
      `Here is your personal invitation & RSVP link:\n` +
      `${inviteUrl}\n\n` +
      `With love,\nTil & Deen`
    );
    const phoneDigits = g.phone ? g.phone.replace(/[^0-9]/g, '') : '';
    return phoneDigits ? `https://wa.me/${phoneDigits}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      if (guests.length === 0) {
        toast.info('No guests available to export.');
        return;
      }
      const headers = [
        'Guest Full Name',
        'Invitation Code',
        'RSVP Status',
        'Seats Allocated',
        'Attending Count',
        'Events Attending',
        'Category / Tag',
        'Table Assignment',
        'Phone',
        'Email',
        'Invitation Link',
        'Last Updated'
      ];
      const origin = window.location.origin + window.location.pathname;
      const rows = guests.map(g => [
        `"${(g.name || '').replace(/"/g, '""')}"`,
        `"${g.code}"`,
        `"${g.status}"`,
        `"${g.maxGuests}"`,
        `"${g.status === 'ATTENDING' ? g.attendingCount : 0}"`,
        `"${g.eventsAttending}"`,
        `"${g.tag || 'FRIEND'}"`,
        `"${(g.tableNumber || '').replace(/"/g, '""')}"`,
        `"${g.phone || ''}"`,
        `"${g.email || ''}"`,
        `"${origin}?code=${g.code}"`,
        `"${new Date(g.updatedAt).toLocaleString()}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', `Nneka_Opeyemi_Wedding_Guests_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Guest directory exported to CSV.');
    } catch {
      toast.error('Failed to export guest list CSV.');
    }
  };

  // Download Sample CSV Template
  const handleDownloadSampleCsv = () => {
    const headers = 'Guest Name,Invitation Code,Seats Allocated,Category,Table Number,Phone,Email';
    const sampleRows = [
      'Adaeze Obi,adaeze,2,BRIDAL_PARTY,Table 1 - Guzape Gold,+2348031234567,adaeze@example.com',
      'Kola Ademola,kola,1,FRIEND,Table 2,+2348029876543,kola@example.com',
      'Amina Bello,amina,3,FAMILY,Table 3,+2348123456789,amina@example.com',
      'Tunde Bakare,tunde,2,VIP,Table 1 - Guzape Gold,+2348055551234,tunde@example.com'
    ];
    const csvContent = [headers, ...sampleRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nneka_Opeyemi_Wedding_Guest_Template.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Sample Excel/CSV template downloaded.');
  };

  // Import CSV spreadsheet
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          toast.error('The uploaded CSV file is empty.');
          return;
        }
        const result = importGuestsFromCsv(text);
        if (result.imported > 0) {
          toast.success(`Imported ${result.imported} guests successfully.`);
          loadData();
        } else {
          toast.error('No valid guest records found in the uploaded file.');
        }
      } catch {
        toast.error('Failed to parse uploaded CSV spreadsheet.');
      }
    };
  };

  // Compute analytics
  const metrics = React.useMemo(() => {
    const total = guests.length;
    const attendingGroups = guests.filter(g => g.status === 'ATTENDING');
    const declinedGroups = guests.filter(g => g.status === 'DECLINED');
    const pendingGroups = guests.filter(g => g.status === 'PENDING');

    const confirmedAttendingTotal = attendingGroups.reduce((acc, g) => acc + (g.attendingCount || 0), 0);
    const totalInvitedCapacity = guests.reduce((acc, g) => acc + (g.maxGuests || 1), 0);
    const declinedTotalCount = declinedGroups.reduce((acc, g) => acc + (g.maxGuests || 1), 0);
    const pendingTotalCount = pendingGroups.reduce((acc, g) => acc + (g.maxGuests || 1), 0);

    const respondedCount = attendingGroups.length + declinedGroups.length;
    const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;

    const ceremonyOnlyCount = attendingGroups.filter(g => g.eventsAttending === 'ceremony').reduce((acc, g) => acc + g.attendingCount, 0);
    const receptionOnlyCount = attendingGroups.filter(g => g.eventsAttending === 'reception').reduce((acc, g) => acc + g.attendingCount, 0);
    const bothCount = attendingGroups.filter(g => g.eventsAttending === 'both').reduce((acc, g) => acc + g.attendingCount, 0);

    return {
      guestsCount: total,
      totalInvitedCapacity,
      confirmedAttendingTotal,
      declinedTotalCount,
      pendingTotalCount,
      responseRate,
      ceremonyOnlyCount,
      receptionOnlyCount,
      bothCount
    };
  }, [guests]);

  // Filtered list
  const filteredGuests = React.useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = 
        g.name.toLowerCase().includes(search.toLowerCase()) || 
        g.code.toLowerCase().includes(search.toLowerCase()) ||
        (g.email && g.email.toLowerCase().includes(search.toLowerCase())) ||
        (g.tableNumber && g.tableNumber.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = statusFilter === 'ALL' || g.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [guests, search, statusFilter]);

  return (
    <div 
      className="h-full pb-12 transition-all duration-300 relative overflow-y-auto" 
      style={{ 
        backgroundColor: ivoryDeep, 
        color: navy, 
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <header 
        className="relative py-5 px-5 overflow-hidden z-10" 
        style={{ 
          borderBottom: `1.5px solid ${navy}`, 
          background: 'rgba(255, 255, 255, 0.55)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs" 
              style={{ 
                backgroundColor: coral, 
                color: ivory, 
                border: `1.5px solid ${navy}`,
                fontFamily: "'DM Serif Display', serif"
              }}
            >
              T&nbsp;D
            </div>
            <div>
              <div 
                style={{ 
                  fontFamily: "'Caveat', cursive", 
                  fontSize: 16, 
                  color: gold, 
                  lineHeight: 1,
                  display: 'inline-block'
                }}
              >
                Nneka &amp; Opeyemi · 18 Dec 2026
              </div>
              <h1 
                className="text-xl sm:text-2xl font-bold tracking-tight" 
                style={{ 
                  fontFamily: "'DM Serif Display', serif", 
                  color: navy,
                  marginTop: 1
                }}
              >
                Host Control Room
              </h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition duration-300 border hover-lift cursor-pointer"
              style={{ 
                borderColor: navy,
                borderWidth: '1.2px',
                color: navy,
                background: 'rgba(255, 255, 255, 0.7)',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Download Excel (CSV)
            </button>
            
            <label 
              className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition duration-300 border hover-lift cursor-pointer"
              style={{ 
                borderColor: navy,
                borderWidth: '1.2px',
                color: navy,
                background: 'rgba(255, 255, 255, 0.7)',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Upload Excel (CSV)
              <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
            </label>

            <button 
              onClick={handleDownloadSampleCsv}
              className="px-3 py-1.5 text-[10.5px] font-semibold tracking-wider rounded-full transition duration-300 hover:underline cursor-pointer bg-transparent border-none"
              style={{ 
                color: gold,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Sample Template
            </button>

            <button 
              onClick={onExit}
              className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full hover-lift shadow-xs transition duration-300 cursor-pointer ml-1"
              style={{ 
                backgroundColor: coral, 
                color: ivory, 
                border: `1.2px solid ${navy}`,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Exit Dashboard →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-5 mt-5 sm:mt-6 relative z-10">
        
        {/* Section Pill Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl border bg-white/70 shadow-xs flex-wrap justify-center gap-1" style={{ borderColor: navy }}>
            <button
              onClick={() => setDashboardSection('guests')}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{
                background: dashboardSection === 'guests' ? navy : 'transparent',
                color: dashboardSection === 'guests' ? ivory : navy,
              }}
            >
              Guest List &amp; RSVPs
            </button>
            <button
              onClick={() => setDashboardSection('seating')}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{
                background: dashboardSection === 'seating' ? navy : 'transparent',
                color: dashboardSection === 'seating' ? ivory : navy,
              }}
            >
              Seating Chart &amp; Tables
            </button>
            <button
              onClick={() => setDashboardSection('gallery')}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{
                background: dashboardSection === 'gallery' ? navy : 'transparent',
                color: dashboardSection === 'gallery' ? ivory : navy,
              }}
            >
              Photo Gallery &amp; Media
            </button>
            <button
              onClick={() => setDashboardSection('registry')}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{
                background: dashboardSection === 'registry' ? navy : 'transparent',
                color: dashboardSection === 'registry' ? ivory : navy,
              }}
            >
              Gift Wishlist &amp; Reservations
            </button>
          </div>
        </div>

        {dashboardSection === 'registry' ? (
          <HostRegistryManager palette={palette} />
        ) : dashboardSection === 'seating' ? (
          <HostSeatingManager palette={palette} />
        ) : dashboardSection === 'gallery' ? (
          <HostGalleryManager palette={palette} />
        ) : (
          <>
            {/* Quick Analytics Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              
              {/* Card 1: Response Rate */}
              <div 
                className="rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover-lift bg-white" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                  padding: '4px',
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
                    Response Rate
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                      {metrics.responseRate}%
                    </span>
                    <span className="text-[11px] font-medium opacity-65">responded</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 mt-3 overflow-hidden" style={{ backgroundColor: `${navy}08` }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${metrics.responseRate}%`, backgroundColor: coral }} 
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Confirmed Attending */}
              <div 
                className="rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover-lift bg-white" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                  padding: '4px',
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
                    Confirmed Attending
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: '#2B4530' }}>
                      {metrics.confirmedAttendingTotal}
                    </span>
                    <span className="text-[11px] font-medium opacity-65">guests</span>
                  </div>
                  <p className="text-[9.5px] opacity-55 mt-3 font-bold tracking-wide uppercase" style={{ color: navy }}>
                    Of {metrics.totalInvitedCapacity} capacity
                  </p>
                </div>
              </div>

              {/* Card 3: Declined */}
              <div 
                className="rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover-lift bg-white" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                  padding: '4px',
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
                    Cannot Attend
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: coral }}>
                      {metrics.declinedTotalCount}
                    </span>
                    <span className="text-[11px] font-medium opacity-65">declined</span>
                  </div>
                  <p className="text-[9.5px] opacity-55 mt-3 font-bold tracking-wide uppercase" style={{ color: navy }}>
                    Released seats
                  </p>
                </div>
              </div>

              {/* Card 4: Awaiting RSVP */}
              <div 
                className="rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover-lift bg-white" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                  padding: '4px',
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
                    Awaiting RSVP
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: gold }}>
                      {metrics.pendingTotalCount}
                    </span>
                    <span className="text-[11px] font-medium opacity-65">pending</span>
                  </div>
                  <p className="text-[9.5px] opacity-55 mt-3 font-bold tracking-wide uppercase" style={{ color: navy }}>
                    Follow-up pending
                  </p>
                </div>
              </div>
            </section>

            {/* Event Breakdown & Add Guest Form */}
            <section className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 mb-6">
              
              {/* Event breakdown card */}
              <div 
                className="md:col-span-3 shadow-xs flex flex-col justify-between bg-white rounded-2xl p-1" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: 14,
                  padding: '18px 20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 
                      className="text-base font-bold flex items-center gap-2"
                      style={{ 
                        fontFamily: "'DM Serif Display', serif", 
                        color: navy 
                      }}
                    >
                      Event Attendance Breakdown
                    </h3>
                    <p className="text-[11px] opacity-60 mt-0.5 mb-4">Confirmed counts across celebration events.</p>
                    
                    <div className="grid grid-cols-3 gap-3 text-center mt-2">
                      <div className="p-3 rounded-xl border" style={{ backgroundColor: `${gold}08`, borderColor: `${gold}30`, borderWidth: '1px' }}>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider opacity-75" style={{ color: '#886d30' }}>Ceremony</span>
                        <p className="text-xl font-bold mt-1" style={{ fontFamily: "'DM Serif Display', serif", color: '#886d30' }}>{metrics.ceremonyOnlyCount}</p>
                      </div>
                      
                      <div className="p-3 rounded-xl border" style={{ backgroundColor: `${coral}08`, borderColor: `${coral}30`, borderWidth: '1px' }}>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider opacity-75" style={{ color: coral }}>Reception</span>
                        <p className="text-xl font-bold mt-1" style={{ fontFamily: "'DM Serif Display', serif", color: coral }}>{metrics.receptionOnlyCount}</p>
                      </div>
                      
                      <div className="p-3 rounded-xl border" style={{ backgroundColor: `${navy}08`, borderColor: `${navy}30`, borderWidth: '1px' }}>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider opacity-75" style={{ color: navy }}>Both</span>
                        <p className="text-xl font-bold mt-1" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>{metrics.bothCount}</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="mt-4 p-3 rounded-xl text-xs flex flex-col sm:flex-row justify-between items-center gap-2" 
                    style={{ 
                      backgroundColor: `${navy}04`,
                      color: navy
                    }}
                  >
                    <span className="text-[11px]">Database: <strong>{metrics.guestsCount}</strong> groups.</span>
                    <div className="flex gap-2 items-center text-[11px]">
                      <button 
                        onClick={handleResetDb}
                        className="font-bold cursor-pointer transition hover:opacity-80 underline"
                        style={{ color: gold }}
                      >
                        Reset Demo
                      </button>
                      <span className="opacity-30">|</span>
                      <button 
                        onClick={handleClearAllDb}
                        className="font-bold cursor-pointer transition hover:opacity-80 underline text-red-600"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Invitation Card */}
              <div 
                className="md:col-span-2 shadow-xs flex flex-col justify-between bg-white rounded-2xl p-1" 
                style={{ 
                  border: `1.5px solid ${navy}`,
                }}
              >
                <div style={{
                  border: `1px solid ${gold}80`,
                  borderRadius: 14,
                  padding: '16px 18px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 
                      className="text-base font-bold"
                      style={{ 
                        fontFamily: "'DM Serif Display', serif", 
                        color: navy 
                      }}
                    >
                      Create Invitation Link
                    </h3>
                    <p className="text-[11px] opacity-60 mt-0.5 mb-3">Add guest and generate tracking link.</p>
                    
                    <form onSubmit={handleAddGuest} className="flex flex-col gap-2.5">
                      <div>
                        <label 
                          className="text-[9.5px] uppercase tracking-wider font-bold block"
                          style={{ color: gold }}
                        >
                          Guest Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Adaeze Obi"
                          value={newGuestName}
                          onChange={handleNameChange}
                          className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg bg-white"
                          style={{ 
                            border: `1.2px solid ${navy}`,
                            color: navy,
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label 
                            className="text-[9.5px] uppercase tracking-wider font-bold block"
                            style={{ color: gold }}
                          >
                            Code *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="adaeze"
                            value={newGuestCode}
                            onChange={e => setNewGuestCode(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg bg-white"
                            style={{ 
                              border: `1.2px solid ${navy}`,
                              color: navy,
                            }}
                          />
                        </div>
                        <div>
                          <label 
                            className="text-[9.5px] uppercase tracking-wider font-bold block"
                            style={{ color: gold }}
                          >
                            Seats
                          </label>
                          <select
                            value={newMaxGuests}
                            onChange={e => setNewMaxGuests(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg cursor-pointer bg-white"
                            style={{ 
                              border: `1.2px solid ${navy}`,
                              color: navy,
                            }}
                          >
                            <option value={1}>1 seat</option>
                            <option value={2}>2 seats</option>
                            <option value={3}>3 seats</option>
                            <option value={4}>4 seats</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label 
                            className="text-[9.5px] uppercase tracking-wider font-bold block"
                            style={{ color: gold }}
                          >
                            Tag
                          </label>
                          <select
                            value={newGuestTag}
                            onChange={e => setNewGuestTag(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg cursor-pointer bg-white"
                            style={{ 
                              border: `1.2px solid ${navy}`,
                              color: navy,
                            }}
                          >
                            <option value="FRIEND">Friend</option>
                            <option value="FAMILY">Family</option>
                            <option value="VIP">VIP</option>
                            <option value="BRIDAL_PARTY">Bridal Party</option>
                            <option value="GROOMSMEN">Groomsmen</option>
                            <option value="COLLEAGUE">Colleague</option>
                          </select>
                        </div>
                        <div>
                          <label 
                            className="text-[9.5px] uppercase tracking-wider font-bold block"
                            style={{ color: gold }}
                          >
                            Table (opt)
                          </label>
                          <select
                            value={newTableNumber}
                            onChange={e => setNewTableNumber(e.target.value)}
                            className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg cursor-pointer bg-white"
                            style={{ 
                              border: `1.2px solid ${navy}`,
                              color: navy,
                            }}
                          >
                            <option value="">Open Seating</option>
                            {availableTables.map(t => (
                              <option key={t.id} value={t.name}>
                                {t.name} ({t.capacity} seats)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label 
                          className="text-[9.5px] uppercase tracking-wider font-bold block"
                          style={{ color: gold }}
                        >
                          Email (opt)
                        </label>
                        <input
                          type="email"
                          placeholder="guest@example.com"
                          value={newEmail}
                          onChange={e => setNewEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 border mt-0.5 focus:outline-none focus:border-gold text-xs rounded-lg bg-white"
                          style={{ 
                            border: `1.2px solid ${navy}`,
                            color: navy,
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider mt-1 transition-all duration-300 hover-lift shadow-xs cursor-pointer"
                        style={{ 
                          backgroundColor: navy, 
                          color: ivory,
                          border: `1.2px solid ${navy}`,
                          fontFamily: "'DM Sans', sans-serif"
                        }}
                      >
                        Generate Invitation Link
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* Guest List Table */}
            <section 
              className="bg-white shadow-xs rounded-2xl p-1" 
              style={{ 
                border: `1.5px solid ${navy}`,
              }}
            >
              <div style={{
                border: `1px solid ${gold}80`,
                borderRadius: 14,
                padding: '18px 16px'
              }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                  <div>
                    <h3 
                      className="text-lg font-bold"
                      style={{ 
                        fontFamily: "'DM Serif Display', serif", 
                        color: navy 
                      }}
                    >
                      Guest Directory
                    </h3>
                    <p className="text-[11px] opacity-60 mt-0.5">Search, filter, email invitations, and manage RSVP states.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 items-center flex-wrap">
                    {/* Search Bar */}
                    <input
                      type="text"
                      placeholder="Search name, code, email..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="px-3 py-1.5 border focus:outline-none focus:border-gold text-xs rounded-full bg-white"
                      style={{ 
                        border: `1.2px solid ${navy}`,
                        color: navy,
                        minWidth: '200px'
                      }}
                    />

                    {/* Status Filters */}
                    <div 
                      className="flex gap-1 p-0.5 rounded-full border bg-white" 
                      style={{ borderColor: navy }}
                    >
                      {(['ALL', 'ATTENDING', 'DECLINED', 'PENDING'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setStatusFilter(f)}
                          className="px-2.5 py-0.5 font-semibold transition-all duration-200 cursor-pointer text-[10px]"
                          style={{
                            borderRadius: 12,
                            fontFamily: "'DM Sans', sans-serif",
                            backgroundColor: statusFilter === f ? navy : 'transparent',
                            color: statusFilter === f ? ivory : navy,
                            border: 'none',
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {/* CSV Export Button */}
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="px-3 py-1 rounded-full font-bold text-[10.5px] uppercase tracking-wider transition-all duration-200 hover-lift shadow-xs cursor-pointer"
                      style={{
                        backgroundColor: gold,
                        color: navy,
                        border: `1.2px solid ${navy}`,
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                    >
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: `${navy}20`, border: `1.2px solid ${navy}` }}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: `1.2px solid ${navy}`, backgroundColor: `${navy}04` }}>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: navy }}>Guest &amp; Code</th>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: navy }}>Tag &amp; Table</th>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: navy }}>RSVP Status</th>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: navy }}>Attendance</th>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold" style={{ color: navy }}>Invite Actions</th>
                        <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-center" style={{ color: navy }}>Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: `${navy}20` }}>
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 opacity-60 italic text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            No wedding guests match the search filters.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g, idx) => (
                          <tr 
                            key={g.id} 
                            className="transition duration-150"
                            style={{ backgroundColor: idx % 2 === 0 ? '#fff' : `${navy}02` }}
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                                {g.name}
                              </div>
                              <div 
                                className="font-mono text-[10.5px]" 
                                style={{ 
                                  color: gold, 
                                  fontWeight: 600
                                }}
                              >
                                code: {g.code}
                              </div>
                              {g.email && <div className="text-[10px] opacity-60 mt-0.5">{g.email}</div>}
                            </td>
                            <td className="py-2.5 px-3">
                              {g.tag && (
                                <span className="inline-block px-1.5 py-0.2 rounded text-[9.5px] font-bold border" style={{ background: `${gold}15`, color: navy, borderColor: `${navy}20` }}>
                                  {g.tag}
                                </span>
                              )}
                              {g.tableNumber && (
                                <div className="text-[10.5px] font-medium opacity-70 mt-0.5">
                                  {g.tableNumber}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {(() => {
                                const badge = {
                                  ATTENDING: { bg: '#2B453012', text: '#2B4530', border: '#2B4530', label: 'Attending' },
                                  DECLINED: { bg: '#C4663E10', text: '#C4663E', border: '#C4663E', label: 'Declined' },
                                  PENDING: { bg: '#E8B04E12', text: '#886D30', border: '#E8B04E', label: 'Pending' }
                                }[g.status];
                                return (
                                  <span 
                                    style={{
                                      display: 'inline-block',
                                      padding: '3px 8px',
                                      borderRadius: 10,
                                      fontSize: '9.5px',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      letterSpacing: 0.5,
                                      backgroundColor: badge.bg,
                                      color: badge.text,
                                      border: `1.2px solid ${badge.border}`,
                                      fontFamily: "'DM Sans', sans-serif"
                                    }}
                                  >
                                    {badge.label}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="py-2.5 px-3">
                              {g.status === 'ATTENDING' ? (
                                <div style={{ fontFamily: "'DM Sans', sans-serif", color: navy, fontSize: '11.5px' }}>
                                  <span className="font-bold">{g.attendingCount} / {g.maxGuests}</span>
                                  <span className="mx-1 text-gray-300">|</span>
                                  <span className="font-semibold capitalize opacity-85">
                                    {g.eventsAttending === 'both' ? 'Both Events' : `${g.eventsAttending}`}
                                  </span>
                                </div>
                              ) : g.status === 'DECLINED' ? (
                                <span className="opacity-45 line-through italic text-[11px]">
                                  Declined ({g.maxGuests} seats)
                                </span>
                              ) : (
                                <span className="opacity-60 italic text-[11px]">
                                  Awaiting ({g.maxGuests} seats)
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex gap-1.5 flex-wrap items-center">
                                <button
                                  onClick={() => copyInviteLink(g.code)}
                                  className="px-2 py-0.5 text-[10.5px] border rounded-md transition-all duration-200 hover:bg-gray-100 cursor-pointer font-bold bg-white"
                                  style={{ border: `1px solid ${navy}`, color: navy }}
                                >
                                  Copy Link
                                </button>
                                <a
                                  href={`/?code=${g.code}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 text-[10.5px] border rounded-md transition-all duration-200 hover:bg-gray-100 text-center flex items-center justify-center cursor-pointer font-bold bg-white no-underline"
                                  style={{ border: `1px solid ${navy}`, color: navy }}
                                >
                                  Preview
                                </a>
                                <a
                                  href={createGuestInviteWhatsAppUrl(g)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 text-[10.5px] border rounded-md transition-all duration-200 hover:bg-emerald-50 text-center flex items-center justify-center cursor-pointer font-extrabold no-underline"
                                  style={{ border: `1px solid #1f513b`, background: '#25D36622', color: '#165b38' }}
                                  title="Send invitation via WhatsApp"
                                >
                                  WhatsApp
                                </a>
                                <a
                                  href={createGuestInviteEmailUrl(g)}
                                  className="px-2 py-0.5 text-[10.5px] border rounded-md transition-all duration-200 hover:bg-amber-50 text-center flex items-center justify-center cursor-pointer font-extrabold no-underline"
                                  style={{ border: `1px solid ${navy}`, background: coral, color: navy }}
                                  title={g.email ? `Email invite to ${g.email}` : 'Draft email invite'}
                                >
                                  Email Invite
                                </a>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex justify-center items-center gap-1">
                                <button
                                  onClick={() => openEditModal(g)}
                                  className="text-[11px] font-bold px-1.5 py-0.5 text-blue-700 hover:underline transition duration-200 cursor-pointer bg-transparent border-none"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(g.id, g.name)}
                                  className="text-[11px] font-bold px-1.5 py-0.5 text-red-700 hover:underline transition duration-200 cursor-pointer bg-transparent border-none"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Manual RSVP Edit Modal */}
      {editingGuest && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ position: 'fixed', zIndex: 100 }}
        >
          <div 
            onClick={() => setEditingGuest(null)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(22, 39, 79, 0.45)', 
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }} 
          />
          
          <div 
            className="rounded-2xl shadow-2xl flex flex-col gap-4 relative z-10 animate-scale-in" 
            style={{ 
              backgroundColor: ivoryDeep, 
              border: `1.5px solid ${navy}`,
              borderRadius: 20,
              padding: '6px',
              width: '100%', 
              maxWidth: '420px', 
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(22, 39, 79, 0.15)'
            }}
          >
            <div style={{
              border: `1px solid ${gold}80`,
              borderRadius: 16,
              padding: '18px 20px'
            }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                    Edit Guest Details
                  </h4>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
                    {editingGuest.name} ({editingGuest.code})
                  </div>
                </div>
                <button 
                  onClick={() => setEditingGuest(null)}
                  className="text-xl font-bold cursor-pointer opacity-60 hover:opacity-100 border-none bg-transparent transition"
                  style={{ color: navy, outline: 'none' }}
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    RSVP Status
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {(['PENDING', 'ATTENDING', 'DECLINED'] as const).map(s => {
                      const selected = editStatus === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEditStatus(s)}
                          className="py-1.5 text-xs font-bold rounded-lg transition duration-200 cursor-pointer"
                          style={{
                            backgroundColor: selected ? navy : '#fff',
                            color: selected ? ivory : navy,
                            border: `1.2px solid ${navy}`,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {editStatus === 'ATTENDING' && (
                  <>
                    <div>
                      <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                        Attending Seats
                      </label>
                      <select
                        value={editAttendingCount}
                        onChange={e => setEditAttendingCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                        style={{ border: `1.2px solid ${navy}`, color: navy }}
                      >
                        {Array.from({ length: editingGuest.maxGuests }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                        Attending Events
                      </label>
                      <select
                        value={editEvents}
                        onChange={e => setEditEvents(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                        style={{ border: `1.2px solid ${navy}`, color: navy }}
                      >
                        <option value="both">Both Ceremony &amp; Reception</option>
                        <option value="ceremony">Ceremony Only</option>
                        <option value="reception">Reception Only</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                      Tag
                    </label>
                    <select
                      value={editTag}
                      onChange={e => setEditTag(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                      style={{ border: `1.2px solid ${navy}`, color: navy }}
                    >
                      <option value="FRIEND">Friend</option>
                      <option value="FAMILY">Family</option>
                      <option value="VIP">VIP</option>
                      <option value="BRIDAL_PARTY">Bridal Party</option>
                      <option value="GROOMSMEN">Groomsmen</option>
                      <option value="COLLEAGUE">Colleague</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                      Table Assignment
                    </label>
                    <select
                      value={editTableNumber}
                      onChange={e => setEditTableNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                      style={{ border: `1.2px solid ${navy}`, color: navy }}
                    >
                      <option value="">Open Seating (No Table)</option>
                      {availableTables.map(t => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.capacity} seats)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setEditingGuest(null)}
                  className="flex-1 py-2 text-xs uppercase font-bold border rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
                  style={{ 
                    border: `1.2px solid ${navy}`,
                    color: navy,
                    background: 'transparent'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 text-xs uppercase font-bold rounded-lg text-white transition-all duration-300 hover-lift shadow-xs cursor-pointer"
                  style={{ 
                    backgroundColor: navy, 
                    color: ivory,
                    border: `1.2px solid ${navy}`,
                  }}
                >
                  Save Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
