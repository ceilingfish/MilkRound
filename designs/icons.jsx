// Simple line icons. Stroke uses currentColor so themes control the tint.

const Icon = ({ children, size = 22, stroke = 1.6, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

const IconMilk = (p) => (
  <Icon {...p}>
    <path d="M9 3h6" />
    <path d="M9 3v3l-2 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-2-3V3" />
    <path d="M7 12h10" />
  </Icon>
);

const IconEgg = (p) => (
  <Icon {...p}>
    <path d="M12 3c-3.5 0-6 5-6 10a6 6 0 0 0 12 0c0-5-2.5-10-6-10Z" />
  </Icon>
);

const IconButter = (p) => (
  <Icon {...p}>
    <path d="M3 14h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M5 14V10l3-3h8l3 3v4" />
    <path d="M9 7V5h6v2" />
  </Icon>
);

const IconYoghurt = (p) => (
  <Icon {...p}>
    <path d="M6 7h12l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" />
    <path d="M6 7V5h12v2" />
    <path d="M10 11v6M14 11v6" />
  </Icon>
);

const IconCheese = (p) => (
  <Icon {...p}>
    <path d="M3 12 12 5l9 7v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <circle cx="9" cy="15" r=".8" fill="currentColor" />
    <circle cx="14" cy="17" r=".8" fill="currentColor" />
    <circle cx="16" cy="13" r=".8" fill="currentColor" />
  </Icon>
);

const IconBread = (p) => (
  <Icon {...p}>
    <path d="M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3H6a2 2 0 0 1-2-2Z" />
    <path d="M10 12v4M14 12v4" />
  </Icon>
);

const IconJuice = (p) => (
  <Icon {...p}>
    <path d="M7 7h10l-1 13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" />
    <path d="M9 4h6l1 3H8Z" />
  </Icon>
);

const IconCream = (p) => (
  <Icon {...p}>
    <path d="M8 4h8v3l1 2v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9l1-2Z" />
    <path d="M9 11h6" />
  </Icon>
);

const IconQR = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
  </Icon>
);

const IconChevron = (p) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

const IconBack = (p) => (
  <Icon {...p}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);

const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

const IconMinus = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

const IconCheck = (p) => (
  <Icon {...p}>
    <path d="m5 12 5 5L20 7" />
  </Icon>
);

const IconSplit = (p) => (
  <Icon {...p}>
    <path d="M6 3v6l-3 3 3 3v6" />
    <path d="M18 3v6l3 3-3 3v6" />
    <path d="M9 12h6" />
  </Icon>
);

const IconFlashlight = (p) => (
  <Icon {...p}>
    <path d="M6 3h12l-2 4H8Z" />
    <path d="M8 7v4l4 10 4-10V7" />
  </Icon>
);

const IconClose = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

// Map product key -> icon component
const productIcons = {
  milk: IconMilk,
  semi: IconMilk,
  skim: IconMilk,
  eggs: IconEgg,
  butter: IconButter,
  yoghurt: IconYoghurt,
  cheese: IconCheese,
  bread: IconBread,
  juice: IconJuice,
  cream: IconCream,
};

Object.assign(window, {
  Icon,
  IconMilk, IconEgg, IconButter, IconYoghurt, IconCheese, IconBread, IconJuice, IconCream,
  IconQR, IconChevron, IconBack, IconPlus, IconMinus, IconCheck, IconSplit, IconFlashlight, IconClose,
  productIcons,
});
