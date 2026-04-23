// Screen 2 — Pick delivery days.
// Supplier availability: some days unavailable (greyed out).
// Selecting at least one day enables Continue.

const DAYS = [
  { key: 'mon', short: 'Mon', long: 'Monday', available: true },
  { key: 'tue', short: 'Tue', long: 'Tuesday', available: true },
  { key: 'wed', short: 'Wed', long: 'Wednesday', available: true },
  { key: 'thu', short: 'Thu', long: 'Thursday', available: false },
  { key: 'fri', short: 'Fri', long: 'Friday', available: true },
  { key: 'sat', short: 'Sat', long: 'Saturday', available: true },
  { key: 'sun', short: 'Sun', long: 'Sunday', available: false },
];

function ScreenPickDays({ t, state, setState, onBack, onContinue }) {
  const { voice, supplier } = useCopy();
  const selected = state.days || [];

  const toggle = (dk) => {
    const day = DAYS.find((d) => d.key === dk);
    if (!day.available) return;
    const next = selected.includes(dk) ? selected.filter((x) => x !== dk) : [...selected, dk];
    setState((s) => ({ ...s, days: next }));
  };

  return (
    <PhoneScreen t={t}>
      <Header t={t} back={onBack} progress={{ step: 1, total: 3 }} />

      <div style={{ padding: '14px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SupplierPill t={t} name={state.supplier || supplier.name} />

        <h1 style={{
          fontFamily: t.font, fontSize: 28, lineHeight: 1.15,
          fontWeight: t.key === 'crisp' ? 600 : 500,
          margin: '16px 0 8px', letterSpacing: t.key === 'editorial' ? -0.5 : -0.3,
        }}>
          {voice.daysTitle}
        </h1>
        <p style={{ margin: 0, color: t.textSoft, fontSize: 14, lineHeight: 1.5 }}>
          {voice.daysSub}
        </p>

        <div style={{ marginTop: 24, flex: 1, overflow: 'auto' }}>
          <DaysList t={t} selected={selected} onToggle={toggle} />
          <UnavailableNote t={t} />
        </div>
      </div>

      <div style={{ padding: '16px 24px 28px', background: t.bg, borderTop: `1px solid ${t.border}` }}>
        <SelectedSummary t={t} selected={selected} />
        <PrimaryBtn t={t} onClick={onContinue} disabled={selected.length === 0}>
          Continue
          <IconChevron size={16} style={{ marginLeft: 6, verticalAlign: -3 }} />
        </PrimaryBtn>
      </div>
    </PhoneScreen>
  );
}

function DaysList({ t, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {DAYS.map((d, idx) => {
        const isSel = selected.includes(d.key);
        const disabled = !d.available;
        const fh = t.key === 'farmhouse';
        const rotation = t.accentRotation || [t.primary];
        const tint = fh ? rotation[idx % rotation.length] : t.primary;
        return (
          <button
            key={d.key}
            onClick={() => onToggle(d.key)}
            disabled={disabled}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              borderRadius: t.radius,
              border: `1.5px solid ${isSel ? tint : t.border}`,
              background: disabled ? 'transparent' : (isSel ? (fh ? `${tint}14` : (t.key === 'crisp' ? '#F4F4F4' : t.chipBg)) : t.card),
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              textAlign: 'left',
              fontFamily: t.fontBody,
              transition: 'all 140ms ease',
              boxShadow: isSel && t.shadow !== 'none' ? t.shadow : 'none',
            }}
          >
            <DayBadge t={t} day={d.short} selected={isSel} disabled={disabled} index={idx} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{d.long}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                {disabled ? 'Not available in your area' : 'Delivered before 7am'}
              </div>
            </div>
            {isSel && (
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: tint, color: fh && tint === t.butter ? t.text : t.primaryInk,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconCheck size={14} stroke={2.4} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function DayBadge({ t, day, selected, disabled, index = 0 }) {
  // Farmhouse cycles through palette colors for each day
  const fh = t.key === 'farmhouse';
  const rotation = t.accentRotation || [t.primary];
  const tint = fh ? rotation[index % rotation.length] : t.primary;
  return (
    <div style={{
      width: 44, height: 44,
      borderRadius: t.key === 'crisp' ? 8 : 22,
      background: selected ? tint : (fh ? `${tint}1F` : t.chipBg),
      color: selected ? (fh && tint === t.butter ? t.text : t.primaryInk) : (fh ? tint : t.textSoft),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: t.font,
      fontSize: 13, fontWeight: 600,
      letterSpacing: 0.3,
      flexShrink: 0,
      transition: 'all 140ms ease',
    }}>
      {day}
    </div>
  );
}

function UnavailableNote({ t }) {
  return (
    <div style={{
      marginTop: 16,
      padding: '12px 14px',
      background: t.key === 'crisp' ? '#F8F8F8' : t.chipBg + '88',
      border: `1px dashed ${t.border}`,
      borderRadius: t.radiusSmall,
      fontSize: 12,
      color: t.textSoft,
      lineHeight: 1.5,
    }}>
      Thursdays and Sundays aren't available in your area yet. We'll let you know when they open up.
    </div>
  );
}

function SelectedSummary({ t, selected }) {
  if (selected.length === 0) {
    return (
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 12, textAlign: 'center' }}>
        Pick at least one day to continue
      </div>
    );
  }
  const names = DAYS.filter((d) => selected.includes(d.key)).map((d) => d.short);
  return (
    <div style={{ fontSize: 13, color: t.textSoft, marginBottom: 12, textAlign: 'center' }}>
      <span style={{ color: t.text, fontWeight: 600 }}>{selected.length} {selected.length === 1 ? 'day' : 'days'} selected</span>
      <span style={{ color: t.textMuted }}>{'  ·  '}</span>
      {names.join(', ')}
    </div>
  );
}

Object.assign(window, { ScreenPickDays, DAYS });
