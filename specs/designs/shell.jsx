// Shared building blocks used by all three themes.
// Every component takes `t` (theme tokens). No hard-coded colors.

const PHONE_W = 360;
const PHONE_H = 760;

// ── Phone shell ─────────────────────────────────────────────────────────────
function PhoneScreen({ t, children, style }) {
  const fh = t.key === 'farmhouse';
  return (
    <div
      style={{
        width: PHONE_W,
        height: PHONE_H,
        background: t.bg,
        color: t.text,
        fontFamily: t.fontBody,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {fh && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            `radial-gradient(circle at 88% 6%, ${t.butterSoft || '#F6E4B2'}88, transparent 38%),` +
            `radial-gradient(circle at -5% 18%, ${t.skySoft || '#D5E3EB'}66, transparent 32%),` +
            `radial-gradient(circle at 110% 96%, ${t.terraSoft || '#F1D7C4'}70, transparent 36%)`,
        }} />
      )}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <StatusBar t={t} />
        {children}
      </div>
    </div>
  );
}

function StatusBar({ t }) {
  return (
    <div style={{
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      fontSize: 13,
      fontWeight: 600,
      color: t.statusBar,
      flexShrink: 0,
      letterSpacing: 0.2,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <SignalDots />
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M1 6.5a10 10 0 0 1 14 0M3.5 8.5a7 7 0 0 1 9 0M6 10.2a3 3 0 0 1 4 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="15" height="7" rx="1.2" fill="currentColor"/><rect x="21.5" y="3.5" width="1.5" height="4" rx=".5" fill="currentColor" opacity=".5"/></svg>
      </div>
    </div>
  );
}

function SignalDots() {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 10 }}>
      {[3, 5, 7, 9].map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: 'currentColor', borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function Header({ t, back, right, progress }) {
  return (
    <div style={{ padding: '6px 20px 0', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <div style={{ width: 36 }}>
          {back && (
            <button onClick={back} style={iconBtn(t)} aria-label="Back">
              <IconBack size={20} />
            </button>
          )}
        </div>
        {progress && <ProgressDots t={t} step={progress.step} total={progress.total} />}
        <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
      </div>
    </div>
  );
}

function ProgressDots({ t, step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 18 : 6,
          height: 6,
          borderRadius: 3,
          background: i <= step ? t.primary : t.chipBg,
          transition: 'all 200ms ease',
        }} />
      ))}
    </div>
  );
}

const iconBtn = (t) => ({
  width: 36, height: 36, borderRadius: 18,
  border: 'none', background: 'transparent',
  color: t.text, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

// ── Buttons ─────────────────────────────────────────────────────────────────
function PrimaryBtn({ t, children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: 52,
        borderRadius: t.radius,
        border: 'none',
        background: disabled ? t.chipBg : t.primary,
        color: disabled ? t.textMuted : t.primaryInk,
        fontFamily: t.fontBody,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 0.1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 80ms ease, opacity 120ms ease',
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );
}

function GhostBtn({ t, children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: 48,
        borderRadius: t.radius,
        border: `1px solid ${t.border}`,
        background: 'transparent',
        color: t.text,
        fontFamily: t.fontBody,
        fontSize: 15,
        fontWeight: 500,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Supplier pill ──────────────────────────────────────────────────────────
function SupplierPill({ t, name }) {
  const fh = t.key === 'farmhouse';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 12px 5px 5px',
      background: fh ? (t.cream || t.chipBg) : t.chipBg,
      border: fh ? `1px solid ${t.border}` : 'none',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      color: t.textSoft,
      letterSpacing: 0.2,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 11,
        background: fh ? (t.butter || t.primary) : t.primary,
        color: fh ? t.text : t.primaryInk,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontFamily: t.font, fontWeight: 700,
        border: fh ? `1px solid ${t.primary}22` : 'none',
      }}>{name.split(' ').map((w) => w[0]).slice(0,2).join('')}</span>
      {name}
    </div>
  );
}

Object.assign(window, {
  PhoneScreen, Header, ProgressDots, PrimaryBtn, GhostBtn, SupplierPill, iconBtn,
  PHONE_W, PHONE_H,
});
