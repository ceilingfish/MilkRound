// Screen 3 — Pick products.
// Default: same order every selected day. User can "split off" a day to
// configure different items just for that day.

const PRODUCTS = [
  { key: 'milk',    name: 'Whole milk',     unit: '1 pint', price: 1.10, icon: 'milk', max: 6 },
  { key: 'semi',    name: 'Semi-skimmed',   unit: '1 pint', price: 1.10, icon: 'semi', max: 6 },
  { key: 'skim',    name: 'Skimmed milk',   unit: '1 pint', price: 1.10, icon: 'skim', max: 6 },
  { key: 'eggs',    name: 'Free-range eggs',unit: 'box of 6', price: 2.40, icon: 'eggs', max: 4 },
  { key: 'butter',  name: 'Salted butter',  unit: '250g',   price: 2.95, icon: 'butter', max: 3 },
  { key: 'yoghurt', name: 'Natural yoghurt',unit: '500g',   price: 2.20, icon: 'yoghurt', max: 4 },
  { key: 'cream',   name: 'Single cream',   unit: '284ml',  price: 1.80, icon: 'cream', max: 3 },
  { key: 'juice',   name: 'Orange juice',   unit: '1 litre',price: 2.60, icon: 'juice', max: 3 },
];

// default starter basket
const DEFAULT_BASKET = { milk: 2, eggs: 1 };

function ScreenPickProducts({ t, state, setState, onBack, onFinish }) {
  const { voice, supplier } = useCopy();
  const selectedDays = state.days || [];
  const baskets = state.baskets || { all: { ...DEFAULT_BASKET } };
  // "split" days get their own key; others use 'all'
  const splitDays = state.splitDays || [];
  const [activeKey, setActiveKey] = React.useState('all');

  const isSplit = splitDays.length > 0;
  const allDays = selectedDays.filter((d) => !splitDays.includes(d));
  const activeBasket = baskets[activeKey] || { ...DEFAULT_BASKET };

  const updateQty = (pkey, delta) => {
    const product = PRODUCTS.find((p) => p.key === pkey);
    const cur = activeBasket[pkey] || 0;
    const next = Math.max(0, Math.min(product.max, cur + delta));
    const newBasket = { ...activeBasket };
    if (next === 0) delete newBasket[pkey];
    else newBasket[pkey] = next;
    setState((s) => ({ ...s, baskets: { ...baskets, [activeKey]: newBasket } }));
  };

  const splitDay = (dkey) => {
    setState((s) => ({
      ...s,
      splitDays: [...splitDays, dkey],
      baskets: { ...baskets, [dkey]: { ...DEFAULT_BASKET } },
    }));
    setActiveKey(dkey);
  };

  const unsplit = (dkey) => {
    const { [dkey]: _, ...rest } = baskets;
    setState((s) => ({
      ...s,
      splitDays: splitDays.filter((d) => d !== dkey),
      baskets: rest,
    }));
    if (activeKey === dkey) setActiveKey('all');
  };

  const weeklyTotal = React.useMemo(() => {
    let total = 0;
    selectedDays.forEach((dk) => {
      const bKey = splitDays.includes(dk) ? dk : 'all';
      const b = baskets[bKey] || {};
      Object.entries(b).forEach(([pk, q]) => {
        const p = PRODUCTS.find((x) => x.key === pk);
        if (p) total += p.price * q;
      });
    });
    return total;
  }, [baskets, selectedDays, splitDays]);

  const itemCount = Object.values(activeBasket).reduce((a, b) => a + b, 0);

  return (
    <PhoneScreen t={t}>
      <Header t={t} back={onBack} progress={{ step: 2, total: 3 }} />

      <div style={{ padding: '14px 24px 0', flexShrink: 0 }}>
        <SupplierPill t={t} name={state.supplier || supplier.name} />

        <h1 style={{
          fontFamily: t.font, fontSize: 26, lineHeight: 1.15,
          fontWeight: t.key === 'crisp' ? 600 : 500,
          margin: '14px 0 6px', letterSpacing: t.key === 'editorial' ? -0.5 : -0.3,
        }}>
          {voice.productsTitle}
        </h1>
        <p style={{ margin: 0, color: t.textSoft, fontSize: 13, lineHeight: 1.5 }}>
          {isSplit
            ? 'Pick items for the day you\'re editing.'
            : `These items arrive on ${allDays.length > 1 ? 'each of your ' + allDays.length + ' days' : 'your selected day'}.`}
        </p>
      </div>

      <DayTabs
        t={t}
        allDays={allDays}
        splitDays={splitDays}
        active={activeKey}
        setActive={setActiveKey}
        onSplit={splitDay}
        onUnsplit={unsplit}
        selectedDays={selectedDays}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 24px 12px' }}>
        <ProductList t={t} basket={activeBasket} onChange={updateQty} />
      </div>

      <div style={{
        padding: '14px 24px 24px',
        background: t.card,
        borderTop: `1px solid ${t.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: t.textSoft, fontWeight: 500 }}>
            {itemCount === 0 ? 'Empty basket' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} · this delivery`}
          </div>
          <div style={{ fontSize: 12, color: t.textSoft }}>
            <span style={{ fontFamily: t.font, fontSize: 18, color: t.text, fontWeight: 600 }}>
              £{weeklyTotal.toFixed(2)}
            </span>
            <span style={{ marginLeft: 4 }}>/ week</span>
          </div>
        </div>
        <PrimaryBtn t={t} onClick={onFinish} disabled={itemCount === 0 && !isSplit}>
          Start my subscription
        </PrimaryBtn>
      </div>
    </PhoneScreen>
  );
}

// ── Day tabs with split/unsplit ────────────────────────────────────────────
function DayTabs({ t, allDays, splitDays, active, setActive, onSplit, onUnsplit, selectedDays }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dayLabel = (k) => DAYS.find((d) => d.key === k)?.short || k;

  // Tab list: "All days" (if any) + one tab per split day
  const tabs = [];
  if (allDays.length > 0) tabs.push({ key: 'all', label: allDays.length === selectedDays.length ? 'Every day' : allDays.map(dayLabel).join(', ') });
  splitDays.forEach((d) => tabs.push({ key: d, label: DAYS.find((x) => x.key === d)?.long || d, split: true }));

  return (
    <div style={{ padding: '14px 24px 10px', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: `1px solid ${active === tab.key ? t.primary : t.border}`,
              background: active === tab.key ? t.primary : t.card,
              color: active === tab.key ? t.primaryInk : t.text,
              fontFamily: t.fontBody,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {tab.split && <span style={{
              width: 5, height: 5, borderRadius: 3,
              background: active === tab.key ? t.primaryInk : t.accent,
            }} />}
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: `1px dashed ${t.border}`,
            background: 'transparent',
            color: t.textSoft,
            fontFamily: t.fontBody, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <IconSplit size={14} stroke={1.6} />
          Different on a day
        </button>
      </div>

      {menuOpen && (
        <SplitMenu
          t={t}
          selectedDays={selectedDays}
          splitDays={splitDays}
          onSplit={(d) => { onSplit(d); setMenuOpen(false); }}
          onUnsplit={(d) => { onUnsplit(d); setMenuOpen(false); }}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

function SplitMenu({ t, selectedDays, splitDays, onSplit, onUnsplit, onClose }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 5 }} />
      <div style={{
        position: 'absolute', right: 24, top: 50, zIndex: 6,
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        boxShadow: t.shadow === 'none' ? '0 8px 24px rgba(0,0,0,.08)' : t.shadow,
        padding: 8, minWidth: 200,
      }}>
        <div style={{ fontSize: 11, color: t.textMuted, padding: '6px 10px', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Customise a day
        </div>
        {selectedDays.map((dk) => {
          const isSplit = splitDays.includes(dk);
          const label = DAYS.find((d) => d.key === dk)?.long;
          return (
            <button
              key={dk}
              onClick={() => isSplit ? onUnsplit(dk) : onSplit(dk)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 10px', border: 'none', background: 'transparent',
                borderRadius: t.radiusSmall, cursor: 'pointer',
                fontFamily: t.fontBody, fontSize: 14, fontWeight: 500, color: t.text, textAlign: 'left',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = t.chipBg)}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{label}</span>
              <span style={{ fontSize: 12, color: isSplit ? t.accent : t.textMuted, fontWeight: 600 }}>
                {isSplit ? 'Custom ·  remove' : 'Split off'}
              </span>
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
}

// ── Product list with quantity steppers ────────────────────────────────────
function ProductList({ t, basket, onChange }) {
  const fh = t.key === 'farmhouse';
  const rotation = t.accentRotation || [t.primary];
  const tintFor = (idx) => (fh ? rotation[idx % rotation.length] : t.primary);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PRODUCTS.map((p, i) => {
        const qty = basket[p.key] || 0;
        const IconComp = productIcons[p.icon] || IconMilk;
        const Illo = fh ? (window.farmhouseIllos[p.key] || null) : null;
        const tint = tintFor(i);
        return (
          <div key={p.key} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 0',
            borderBottom: i < PRODUCTS.length - 1 ? `1px solid ${t.border}` : 'none',
          }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: t.key === 'crisp' ? 10 : 14,
              background: qty > 0
                ? (fh ? `${tint}22` : t.chipBg)
                : (fh ? t.card : 'transparent'),
              border: fh ? `1px solid ${qty > 0 ? `${tint}55` : t.border}` : (qty > 0 ? 'none' : `1px solid ${t.border}`),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: qty > 0 ? (fh ? tint : t.primary) : (fh ? tint : t.textSoft),
              flexShrink: 0,
              transition: 'all 140ms ease',
              boxShadow: fh && qty > 0 ? '0 1px 0 rgba(74,92,65,.04)' : 'none',
            }}>
              {Illo ? <Illo t={t} size={40} /> : <IconComp size={22} stroke={1.6} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: t.fontBody }}>{p.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                £{p.price.toFixed(2)} · {p.unit}
              </div>
            </div>
            <Stepper t={t} qty={qty} max={p.max} onDec={() => onChange(p.key, -1)} onInc={() => onChange(p.key, +1)} />
          </div>
        );
      })}
    </div>
  );
}

function Stepper({ t, qty, max, onDec, onInc }) {
  const fh = t.key === 'farmhouse';
  const crisp = t.key === 'crisp';

  // Bold, unmistakable +/− glyphs drawn as filled shapes so they read clearly
  // at small sizes on coloured button backgrounds.
  const PlusGlyph = ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="6" y="1" width="2.2" height="12" rx="1.1" fill={color} />
      <rect x="1" y="6" width="12" height="2.2" rx="1.1" fill={color} />
    </svg>
  );
  const MinusGlyph = ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1" y="6" width="12" height="2.2" rx="1.1" fill={color} />
    </svg>
  );

  const btn = (enabled, onClick, Glyph, label) => (
    <button
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      aria-label={label}
      style={{
        width: 30, height: 30,
        borderRadius: crisp ? 6 : 15,
        border: 'none',
        background: enabled ? (crisp ? t.text : t.primary) : t.chipBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: enabled ? 'pointer' : 'not-allowed',
        transition: 'transform 80ms ease',
      }}
      onMouseDown={(e) => enabled && (e.currentTarget.style.transform = 'scale(0.9)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Glyph color={enabled ? t.primaryInk : t.textMuted} />
    </button>
  );

  if (qty === 0) {
    return btn(true, onInc, PlusGlyph, 'Add');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {btn(qty > 0, onDec, MinusGlyph, 'Decrease')}
      <div style={{
        minWidth: 20, textAlign: 'center',
        fontFamily: t.font, fontSize: 18, fontWeight: 600, color: t.text,
      }}>{qty}</div>
      {btn(qty < max, onInc, PlusGlyph, 'Increase')}
    </div>
  );
}

Object.assign(window, { ScreenPickProducts, PRODUCTS });
