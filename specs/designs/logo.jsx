// Milkround wordmark logo. Theme-aware: reads tokens from `t`.
// Variants:
//   <Logo t={t} variant="full" />   bottle glyph + wordmark (default)
//   <Logo t={t} variant="mark" />   bottle glyph only (for tight spots)
//   <Logo t={t} variant="stamp" />  circular stamp, for splash/avatar
//
// Farmhouse gets the cream-filled bottle with a butter-yellow cap + sage
// cream-line; other themes fall back to the primary color duotone.

function LogoMark({ t, size = 32, tilt = 0 }) {
  const fh = t.key === 'farmhouse';
  const bottleFill = fh ? '#FFFDF7' : t.card;
  const bottleStroke = t.primary;
  const capFill = fh ? (t.butter || '#E9B949') : t.primary;
  const milkLine = fh ? (t.sky || '#6F9DB8') : t.primary;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-label="Milkround"
    >
      {/* Bottle body */}
      <path
        d="M13.5 11.5V9a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2.5l2 3.5v15a3 3 0 0 1-3 3H14.5a3 3 0 0 1-3-3v-15l2-3.5Z"
        fill={bottleFill}
        stroke={bottleStroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Cap / foil */}
      <path
        d="M13.8 9h12.4v-.6a1.4 1.4 0 0 0-1.4-1.4H15.2a1.4 1.4 0 0 0-1.4 1.4Z"
        fill={capFill}
        stroke={bottleStroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* Cream / milk line */}
      <path
        d="M12 19.5c2.4 1.8 5 1.8 7.5 0 2.5-1.8 5.6-1.8 8.5 0"
        stroke={milkLine}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Drop */}
      <circle cx="20" cy="26" r="1.4" fill={t.primary} opacity="0.9" />
    </svg>
  );
}

function Logo({ t, size = 28, variant = 'full', style }) {
  if (variant === 'mark') {
    return <LogoMark t={t} size={size} />;
  }

  if (variant === 'stamp') {
    // Circular stamp — good for splash / auth / avatar
    const fh = t.key === 'farmhouse';
    const ring = fh ? (t.forest || t.primary) : t.primary;
    return (
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: fh ? (t.cream || '#FFF6E0') : t.card,
        border: `1.5px solid ${ring}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}>
        <LogoMark t={t} size={size * 0.7} />
      </div>
    );
  }

  // full: mark + wordmark
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      <LogoMark t={t} size={size} tilt={t.key === 'farmhouse' ? -4 : 0} />
      <span style={{
        fontFamily: t.font,
        fontSize: size * 0.75,
        fontWeight: t.key === 'crisp' ? 600 : 500,
        letterSpacing: t.key === 'editorial' ? -0.4 : -0.3,
        color: t.text,
        fontStyle: t.key === 'editorial' ? 'italic' : 'normal',
      }}>
        Milkround
      </span>
    </div>
  );
}

Object.assign(window, { Logo, LogoMark });
