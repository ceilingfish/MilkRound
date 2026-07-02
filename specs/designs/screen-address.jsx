// Screen 1.5 — Delivery address.
// Between sign-in and pick-days. Confirms location so we can show correct
// day availability and catch out-of-range customers early.
//
// Two moods:
//  - In range  → shows confirmed card with a little stop-list on a map,
//                "Continue" unlocks.
//  - Out of range → friendly "not quite" state with "notify me" option.

// Mock postcode lookup — for demo, postcodes starting with "BS" are in range,
// "OX" is out of range, anything else is in range by default.
const SAMPLE_ADDRESSES = [
  { line1: '14 Orchard Lane', line2: 'Clifton',         postcode: 'BS8 2AB', inRange: true,  eta: 'Mon–Sat before 7am' },
  { line1: '42 Long Ashton',  line2: 'North Somerset',  postcode: 'BS41 9LS', inRange: true,  eta: 'Mon, Wed, Fri before 7am' },
  { line1: '7 Jericho Road',  line2: 'Oxford',          postcode: 'OX1 2BN', inRange: false, eta: null },
];

function ScreenAddress({ t, state, setState, onBack, onContinue }) {
  const { voice, supplier } = useCopy();
  const [query, setQuery] = React.useState(state.addressQuery || '');
  const [picked, setPicked] = React.useState(state.address || null);
  const [mode, setMode] = React.useState(state.address ? 'confirmed' : 'search'); // search | results | confirmed

  // Filter sample list for autocomplete feel
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().replace(/\s/g, '');
    return SAMPLE_ADDRESSES.filter((a) =>
      (a.postcode + a.line1 + a.line2).toLowerCase().replace(/\s/g, '').includes(q)
    );
  }, [query]);

  const pick = (addr) => {
    setPicked(addr);
    setMode('confirmed');
    setState((s) => ({ ...s, address: addr, addressQuery: query }));
  };

  const reset = () => {
    setPicked(null);
    setMode('search');
    setQuery('');
    setState((s) => ({ ...s, address: null, addressQuery: '' }));
  };

  const canContinue = picked && picked.inRange;

  return (
    <PhoneScreen t={t}>
      <Header t={t} back={onBack} progress={{ step: 0, total: 3 }} />

      <div style={{ padding: '14px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <SupplierPill t={t} name={state.supplier || supplier.name} />

        <h1 style={{
          fontFamily: t.font, fontSize: 28, lineHeight: 1.15,
          fontWeight: t.key === 'crisp' ? 600 : 500,
          margin: '16px 0 6px', letterSpacing: t.key === 'editorial' ? -0.5 : -0.3,
        }}>
          {voice.addressTitle}
        </h1>
        <p style={{ margin: 0, color: t.textSoft, fontSize: 14, lineHeight: 1.5 }}>
          {voice.addressSub}
        </p>

        <div style={{ marginTop: 22, flex: 1, overflow: 'auto', paddingBottom: 20 }}>
          {mode !== 'confirmed' && (
            <AddressSearch t={t} query={query} setQuery={setQuery} results={results} onPick={pick} />
          )}
          {mode === 'confirmed' && picked && picked.inRange && (
            <ConfirmedCard
              t={t}
              address={picked}
              onChange={reset}
              onContinue={onContinue}
              onEdit={(updated) => {
                setPicked(updated);
                setState((s) => ({ ...s, address: updated }));
              }}
            />
          )}
          {mode === 'confirmed' && picked && !picked.inRange && (
            <OutOfRangeCard t={t} address={picked} onChange={reset} supplier={state.supplier} />
          )}
        </div>
      </div>
    </PhoneScreen>
  );
}

function AddressSearch({ t, query, setQuery, results, onPick }) {
  return (
    <div>
      {/* Search field */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: t.card,
        border: `1.5px solid ${t.border}`,
        borderRadius: t.radius,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start typing your address or postcode"
          autoFocus
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            color: t.text, fontSize: 15, fontFamily: t.fontBody,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ border: 'none', background: 'transparent', color: t.textMuted, cursor: 'pointer', padding: 4 }}>
            <IconClose size={14} stroke={2} />
          </button>
        )}
      </div>

      {/* "or" divider + use location */}
      {!query && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            margin: '4px 0 14px',
            fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.4,
          }}>
            <div style={{ flex: 1, height: 1, background: t.border }} />
            <span>OR</span>
            <div style={{ flex: 1, height: 1, background: t.border }} />
          </div>
          <button
            onClick={() => { onPick(SAMPLE_ADDRESSES[0]); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '12px 14px',
              background: t.card,
              border: `1.5px solid ${t.border}`,
              borderRadius: t.radius,
              cursor: 'pointer', fontFamily: t.fontBody,
              color: t.text, fontSize: 14, fontWeight: 600,
              textAlign: 'left',
              transition: 'border-color 120ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = t.primary)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = t.border)}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: `${t.sky || t.primary}22`, color: t.sky || t.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div>Use my current location</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2, fontWeight: 500 }}>
                We'll only use this for delivery
              </div>
            </div>
            <IconChevron size={16} style={{ color: t.textMuted }} />
          </button>
        </div>
      )}

      {/* Results */}
      {query && (
        <div style={{ marginTop: 10 }}>
          {results.length === 0 && (
            <div style={{
              padding: '18px 14px', textAlign: 'center',
              color: t.textMuted, fontSize: 13,
              background: t.card, border: `1px dashed ${t.border}`, borderRadius: t.radius,
            }}>
              No matches — try a postcode like <span style={{ color: t.text, fontWeight: 600 }}>BS8 2AB</span> or <span style={{ color: t.text, fontWeight: 600 }}>OX1 2BN</span>
            </div>
          )}
          {results.map((a) => (
            <AddressRow key={a.postcode} t={t} address={a} onClick={() => onPick(a)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddressRow({ t, address, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 14px',
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: t.radiusSmall,
        marginBottom: 6,
        cursor: 'pointer', fontFamily: t.fontBody, textAlign: 'left',
        transition: 'all 120ms ease',
      }}
      onMouseOver={(e) => (e.currentTarget.style.borderColor = t.primary)}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = t.border)}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 16,
        background: `${t.terracotta || t.primary}22`, color: t.terracotta || t.primary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{address.line1}</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
          {address.line2} · {address.postcode}
        </div>
      </div>
      <IconChevron size={14} style={{ color: t.textMuted }} />
    </button>
  );
}

function ConfirmedCard({ t, address, onChange, onEdit, onContinue }) {
  const { supplier } = useCopy();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({
    flat:     address.flat     || '',
    line1:    address.line1    || '',
    line2:    address.line2    || '',
    postcode: address.postcode || '',
    notes:    address.notes    || '',
  });

  // Keep draft in sync if address prop changes (e.g. picking a different result)
  React.useEffect(() => {
    setDraft({
      flat:     address.flat     || '',
      line1:    address.line1    || '',
      line2:    address.line2    || '',
      postcode: address.postcode || '',
      notes:    address.notes    || '',
    });
  }, [address]);

  const save = () => {
    onEdit({ ...address, ...draft });
    setEditing(false);
  };
  const saveAndContinue = () => {
    onEdit({ ...address, ...draft });
    setEditing(false);
    if (onContinue) onContinue();
  };

  return (
    <div style={{
      background: t.card,
      border: `1.5px solid ${t.primary}`,
      borderRadius: t.radius,
      overflow: 'hidden',
      boxShadow: t.shadow,
    }}>
      <MapSketch t={t} />
      <div style={{ padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            background: `${t.primary}1A`,
            color: t.primary,
            borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
          }}>
            <IconCheck size={12} stroke={2.6} /> In range
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {!editing && (
              <button onClick={() => setEditing(true)} style={linkBtn(t)}>Edit</button>
            )}
            <button onClick={onChange} style={linkBtn(t)}>
              {editing ? 'Start over' : 'Change'}
            </button>
          </div>
        </div>

        {!editing && (
          <>
            <div style={{ fontFamily: t.font, fontSize: 18, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>
              {draft.flat && <span style={{ color: t.textSoft, fontWeight: 500 }}>{draft.flat}, </span>}
              {draft.line1}
            </div>
            <div style={{ fontSize: 13, color: t.textSoft, marginTop: 2 }}>
              {draft.line2} · {draft.postcode}
            </div>
            {draft.notes && (
              <div style={{
                marginTop: 12, padding: '10px 12px',
                background: t.cream || t.chipBg,
                borderRadius: t.radiusSmall,
                fontSize: 12, color: t.textSoft, lineHeight: 1.5,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span><span style={{ color: t.text, fontWeight: 600 }}>Note for {supplier.first}:</span> {draft.notes}</span>
              </div>
            )}
            <div style={{
              marginTop: 12, padding: '10px 12px',
              background: t.cream || t.chipBg,
              borderRadius: t.radiusSmall,
              fontSize: 12, color: t.textSoft,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span><span style={{ color: t.text, fontWeight: 600 }}>{supplier.first}</span> delivers here {address.eta}</span>
            </div>
            {onContinue && (
              <button onClick={onContinue} style={{
                marginTop: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', padding: '13px',
                background: t.primary, border: 'none',
                borderRadius: t.radius, cursor: 'pointer',
                color: t.primaryInk, fontFamily: t.fontBody, fontSize: 15, fontWeight: 600,
                boxShadow: t.shadow,
              }}>
                Continue <IconChevron size={16} />
              </button>
            )}
          </>
        )}

        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field t={t} label="Flat / unit (optional)" value={draft.flat}
              onChange={(v) => setDraft({ ...draft, flat: v })} placeholder="e.g. Flat 2" />
            <Field t={t} label="House number & street" value={draft.line1}
              onChange={(v) => setDraft({ ...draft, line1: v })} />
            <Field t={t} label="Area / town" value={draft.line2}
              onChange={(v) => setDraft({ ...draft, line2: v })} />
            <Field t={t} label="Postcode" value={draft.postcode}
              onChange={(v) => setDraft({ ...draft, postcode: v.toUpperCase() })} />
            <Field t={t} label="Delivery notes (optional)" value={draft.notes}
              onChange={(v) => setDraft({ ...draft, notes: v })}
              placeholder="e.g. Leave in the side porch, mind the cat"
              multiline />

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => setEditing(false)} style={{
                flex: 1, padding: '11px 12px',
                background: 'transparent', border: `1.5px solid ${t.border}`,
                borderRadius: t.radius, cursor: 'pointer',
                color: t.text, fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
              }}>Cancel</button>
              <button onClick={save} style={{
                flex: 1, padding: '11px 12px',
                background: t.primary, border: 'none',
                borderRadius: t.radius, cursor: 'pointer',
                color: t.primaryInk, fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
              }}>Save</button>
            </div>
            {onContinue && (
              <button onClick={saveAndContinue} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', padding: '12px',
                background: 'transparent', border: 'none',
                cursor: 'pointer',
                color: t.primary, fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
              }}>
                Save and continue <IconChevron size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Small helpers
const linkBtn = (t) => ({
  border: 'none', background: 'transparent', cursor: 'pointer',
  color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 600,
  padding: 0,
});

function Field({ t, label, value, onChange, placeholder, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
        color: t.textMuted, textTransform: 'uppercase',
        marginBottom: 4, paddingLeft: 2,
      }}>{label}</div>
      <Tag
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 2 : undefined}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 12px',
          background: t.bg,
          border: `1.5px solid ${t.border}`,
          borderRadius: t.radiusSmall,
          color: t.text, fontSize: 14, fontFamily: t.fontBody,
          outline: 'none', resize: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = t.primary)}
        onBlur={(e) => (e.currentTarget.style.borderColor = t.border)}
      />
    </label>
  );
}

function OutOfRangeCard({ t, address, onChange, supplier }) {
  return (
    <div style={{
      background: t.card,
      border: `1.5px solid ${t.terracotta || '#C97B4A'}`,
      borderRadius: t.radius,
      overflow: 'hidden',
      boxShadow: t.shadow,
    }}>
      <div style={{
        height: 120, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${t.terraSoft || '#F1D7C4'}, ${t.butterSoft || '#F6E4B2'})`,
      }}>
        {/* Pin far from route */}
        <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
          <path d="M0 70 Q 80 40 150 70 T 300 80" stroke={t.primary} strokeWidth="2" strokeDasharray="4 5" fill="none" opacity=".45" />
          <circle cx="60"  cy="66" r="5" fill={t.primary} />
          <circle cx="140" cy="68" r="5" fill={t.primary} />
          <circle cx="220" cy="76" r="5" fill={t.primary} />
          {/* Customer pin, far off route */}
          <g transform="translate(255 22)">
            <circle r="16" fill={t.card} />
            <path d="M0 -10 C -6 -10 -9 -6 -9 -1 c 0 6 9 14 9 14 s 9 -8 9 -14 c 0 -5 -3 -9 -9 -9 Z" fill={t.terracotta || '#C97B4A'} />
            <circle cy="-2" r="3" fill={t.card} />
          </g>
        </svg>
      </div>
      <div style={{ padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            background: `${t.terracotta || '#C97B4A'}1C`,
            color: t.terracotta || '#C97B4A',
            borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
          }}>
            Out of range
          </div>
          <button onClick={onChange} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 600,
          }}>Try another</button>
        </div>
        <div style={{ fontFamily: t.font, fontSize: 18, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>
          Sorry, {supplier || 'Adam'} doesn't cover {address.postcode} yet.
        </div>
        <div style={{ fontSize: 13, color: t.textSoft, marginTop: 6, lineHeight: 1.5 }}>
          We'll let you know as soon as the route expands. No spam — just a quick note if things change.
        </div>
        <button style={{
          marginTop: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '12px',
          background: 'transparent',
          border: `1.5px solid ${t.primary}`,
          borderRadius: t.radius,
          cursor: 'pointer',
          color: t.primary, fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
        }}>
          Notify me when it's available
        </button>
      </div>
    </div>
  );
}

// Small stylised map sketch — sage route with the customer pin on it
function MapSketch({ t }) {
  return (
    <div style={{ height: 130, background: t.key === 'farmhouse' ? (t.skySoft || '#D5E3EB') : t.chipBg, position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 130" preserveAspectRatio="none">
        {/* Soft fields */}
        <path d="M0 80 Q 80 100 160 85 T 300 90 L 300 130 L 0 130 Z" fill={t.key === 'farmhouse' ? (t.butterSoft || '#F6E4B2') : t.card} opacity=".5" />
        {/* Route */}
        <path d="M 10 90 Q 80 40 160 70 T 290 50" stroke={t.primary} strokeWidth="2.5" strokeDasharray="5 5" fill="none" />
        {/* Other stops */}
        <circle cx="40"  cy="78" r="4" fill={t.primary} opacity=".55" />
        <circle cx="110" cy="62" r="4" fill={t.primary} opacity=".55" />
        <circle cx="220" cy="58" r="4" fill={t.primary} opacity=".55" />
        {/* Customer pin */}
        <g transform="translate(160 68)">
          <circle r="18" fill={t.card} stroke={t.primary} strokeWidth="1.5" />
          <path d="M0 -10 C -6 -10 -9 -6 -9 -1 c 0 6 9 14 9 14 s 9 -8 9 -14 c 0 -5 -3 -9 -9 -9 Z" fill={t.terracotta || t.primary} />
          <circle cy="-2" r="3" fill={t.card} />
        </g>
      </svg>
    </div>
  );
}

Object.assign(window, { ScreenAddress, SAMPLE_ADDRESSES });
