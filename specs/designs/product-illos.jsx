// Illustrated, multi-colour product icons for the Farmhouse theme.
// Designed to sit in a ~44×44 tile. Use from theme palette so they harmonise:
//   t.butter, t.sky, t.terracotta, t.primary, t.cream, t.berry, t.forest
// Each takes { t, size } — size defaults 36.

function ProductIllo({ t, size = 36, children, viewBox = '0 0 40 40' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Milk bottle — whole (sage cap)
function IlloMilkWhole({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z"
            fill={t.cream || '#FFF6E0'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z"
            fill={t.primary} stroke={t.text} strokeWidth="1.1" strokeLinejoin="round" />
      {/* Label */}
      <rect x="14" y="20" width="12" height="8" rx="1" fill={t.card} stroke={t.text} strokeWidth="1" />
      <path d="M16 23h8M16 25.5h5" stroke={t.text} strokeWidth="0.9" strokeLinecap="round" opacity=".7" />
    </ProductIllo>
  );
}

// Semi-skimmed — sky-blue cap
function IlloMilkSemi({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z"
            fill={t.cream || '#FFF6E0'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z"
            fill={t.sky || '#6F9DB8'} stroke={t.text} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="14" y="20" width="12" height="8" rx="1" fill={t.card} stroke={t.text} strokeWidth="1" />
      <path d="M16 23h8M16 25.5h5" stroke={t.text} strokeWidth="0.9" strokeLinecap="round" opacity=".7" />
    </ProductIllo>
  );
}

// Skimmed — berry/red cap
function IlloMilkSkim({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z"
            fill={t.cream || '#FFF6E0'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z"
            fill={t.berry || '#A84D5A'} stroke={t.text} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="14" y="20" width="12" height="8" rx="1" fill={t.card} stroke={t.text} strokeWidth="1" />
      <path d="M16 23h8M16 25.5h5" stroke={t.text} strokeWidth="0.9" strokeLinecap="round" opacity=".7" />
    </ProductIllo>
  );
}

// Egg carton (half-dozen) — kraft box with 6 eggs
function IlloEggs({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M5 22a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
            fill={t.terracotta || '#C97B4A'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      {[10, 16, 22, 28].map((cx) => (
        <ellipse key={cx} cx={cx} cy="20" rx="3" ry="4" fill={t.cream || '#FFF6E0'} stroke={t.text} strokeWidth="1" />
      ))}
      <path d="M5 26h30" stroke={t.text} strokeWidth="0.8" opacity=".5" />
    </ProductIllo>
  );
}

// Butter — gold block, wrapped in paper
function IlloButter({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <rect x="7" y="16" width="26" height="14" rx="1.5" fill={t.butter || '#E9B949'} stroke={t.text} strokeWidth="1.2" />
      {/* Wrap fold */}
      <path d="M7 22h26" stroke={t.text} strokeWidth="0.8" opacity=".4" />
      {/* Paper wrap */}
      <rect x="12" y="14" width="16" height="18" rx="1" fill={t.card} stroke={t.text} strokeWidth="1.1" />
      <path d="M15 18h10M15 22h8M15 26h6" stroke={t.text} strokeWidth="0.8" strokeLinecap="round" opacity=".6" />
    </ProductIllo>
  );
}

// Yoghurt — pot with purple/berry lid
function IlloYoghurt({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M11 14h18l-1.4 16a2 2 0 0 1-2 1.8H14.4a2 2 0 0 1-2-1.8Z"
            fill={t.card} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="10" y="12" width="20" height="3" rx="1" fill={t.berry || '#A84D5A'} stroke={t.text} strokeWidth="1.1" />
      {/* Label strap */}
      <rect x="13" y="19" width="14" height="7" rx="1" fill={t.butterSoft || '#F6E4B2'} stroke={t.text} strokeWidth="1" />
      <path d="M15 22.5h10" stroke={t.text} strokeWidth="0.9" strokeLinecap="round" opacity=".6" />
    </ProductIllo>
  );
}

// Single cream — short bottle with sage label
function IlloCream({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M15 11V9a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2l1.4 2v17a2 2 0 0 1-2 2H15.6a2 2 0 0 1-2-2V13Z"
            fill={t.cream || '#FFF6E0'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M15.2 8.6h9.6v-.5a1 1 0 0 0-1-1h-7.6a1 1 0 0 0-1 1Z" fill={t.primary} stroke={t.text} strokeWidth="1" />
      <rect x="14.5" y="19" width="11" height="8" rx="1" fill={t.primary} />
      <path d="M16.5 22h7M16.5 24.5h4.5" stroke={t.cream || '#FFF6E0'} strokeWidth="0.9" strokeLinecap="round" />
    </ProductIllo>
  );
}

// Orange juice — bottle with orange slice label
function IlloJuice({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M14 10V7.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V10l1.6 3v17.5a2 2 0 0 1-2 2H14.4a2 2 0 0 1-2-2V13Z"
            fill={t.terracotta || '#C97B4A'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14.4 7.2h11.2v-.5a1 1 0 0 0-1-1h-9.2a1 1 0 0 0-1 1Z" fill={t.butter || '#E9B949'} stroke={t.text} strokeWidth="1" />
      {/* Orange slice label */}
      <circle cx="20" cy="22" r="4.2" fill={t.butter || '#E9B949'} stroke={t.text} strokeWidth="1" />
      <path d="M20 18v8M16 22h8M17 19l6 6M17 25l6-6" stroke={t.text} strokeWidth="0.7" opacity=".7" />
    </ProductIllo>
  );
}

// Cheese — wedge with holes
function IlloCheese({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M6 24 20 10l14 14v6a1.5 1.5 0 0 1-1.5 1.5h-25A1.5 1.5 0 0 1 6 30Z"
            fill={t.butter || '#E9B949'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 24h28" stroke={t.text} strokeWidth="0.9" opacity=".55" />
      <circle cx="14" cy="27" r="1.3" fill={t.card} stroke={t.text} strokeWidth="0.8" />
      <circle cx="22" cy="26" r="1" fill={t.card} stroke={t.text} strokeWidth="0.8" />
      <circle cx="27" cy="28" r="1.2" fill={t.card} stroke={t.text} strokeWidth="0.8" />
    </ProductIllo>
  );
}

// Bread — loaf
function IlloBread({ t, size }) {
  return (
    <ProductIllo t={t} size={size}>
      <path d="M7 22a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v1a2.5 2.5 0 0 1-2.5 2.5H29v5.5a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1V25.5H9.5A2.5 2.5 0 0 1 7 23Z"
            fill={t.terracotta || '#C97B4A'} stroke={t.text} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14 21v4M20 21v4M26 21v4" stroke={t.text} strokeWidth="0.9" strokeLinecap="round" opacity=".55" />
    </ProductIllo>
  );
}

// Map used by screen-products when the theme is Farmhouse.
const farmhouseIllos = {
  milk: IlloMilkWhole,
  semi: IlloMilkSemi,
  skim: IlloMilkSkim,
  eggs: IlloEggs,
  butter: IlloButter,
  yoghurt: IlloYoghurt,
  cream: IlloCream,
  juice: IlloJuice,
  cheese: IlloCheese,
  bread: IlloBread,
};

Object.assign(window, {
  IlloMilkWhole, IlloMilkSemi, IlloMilkSkim,
  IlloEggs, IlloButter, IlloYoghurt, IlloCream, IlloJuice, IlloCheese, IlloBread,
  farmhouseIllos,
});
