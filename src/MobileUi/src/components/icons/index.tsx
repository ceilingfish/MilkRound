import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  stroke?: number;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 22,
  color = 'currentColor',
  stroke = 1.6,
  children,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </Svg>
);

export const IconMilk = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M9 3h6" />
    <Path d="M9 3v3l-2 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-2-3V3" />
    <Path d="M7 12h10" />
  </Icon>
);

export const IconEgg = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M12 3c-3.5 0-6 5-6 10a6 6 0 0 0 12 0c0-5-2.5-10-6-10Z" />
  </Icon>
);

export const IconButter = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M3 14h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <Path d="M5 14V10l3-3h8l3 3v4" />
    <Path d="M9 7V5h6v2" />
  </Icon>
);

export const IconYoghurt = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M6 7h12l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" />
    <Path d="M6 7V5h12v2" />
    <Path d="M10 11v6M14 11v6" />
  </Icon>
);

export const IconJuice = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M7 7h10l-1 13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" />
    <Path d="M9 4h6l1 3H8Z" />
  </Icon>
);

export const IconCream = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M8 4h8v3l1 2v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9l1-2Z" />
    <Path d="M9 11h6" />
  </Icon>
);

export const IconChevron = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="m9 6 6 6-6 6" />
  </Icon>
);

export const IconBack = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="m15 6-6 6 6 6" />
  </Icon>
);

export const IconCheck = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="m5 12 5 5L20 7" />
  </Icon>
);

export const IconClose = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const IconSearch = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Circle cx={11} cy={11} r={7} />
    <Path d="m20 20-3.5-3.5" />
  </Icon>
);

export const IconLocation = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
    <Circle cx={12} cy={9} r={2.5} />
  </Icon>
);

export const IconTarget = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Circle cx={12} cy={12} r={3} />
    <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
);

export const IconClock = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 7v5l3 2" />
  </Icon>
);

export const IconNote = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

export const IconSplit = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M6 3v6l-3 3 3 3v6" />
    <Path d="M18 3v6l3 3-3 3v6" />
    <Path d="M9 12h6" />
  </Icon>
);

export const IconFlashlight = ({ size, color, stroke }: IconProps) => (
  <Icon size={size} color={color} stroke={stroke}>
    <Path d="M6 3h12l-2 4H8Z" />
    <Path d="M8 7v4l4 10 4-10V7" />
  </Icon>
);

// Map from product iconName to icon component
export const productIconMap: Record<string, React.FC<IconProps>> = {
  milk: IconMilk,
  semi: IconMilk,
  skim: IconMilk,
  eggs: IconEgg,
  butter: IconButter,
  yoghurt: IconYoghurt,
  juice: IconJuice,
  cream: IconCream,
  'milk-bottle': IconMilk,
};
