import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { Colors } from '../../theme';

interface IlloProps {
  size?: number;
}

const c = Colors;

export function IlloMilkWhole({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z" fill={c.cream} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z" fill={c.primary} stroke={c.textPrimary} strokeWidth={1.1} strokeLinejoin="round" />
      <Rect x={14} y={20} width={12} height={8} rx={1} fill={c.surface} stroke={c.textPrimary} strokeWidth={1} />
      <Path d="M16 23h8M16 25.5h5" stroke={c.textPrimary} strokeWidth={0.9} strokeLinecap="round" opacity={0.7} />
    </Svg>
  );
}

export function IlloMilkSemi({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z" fill={c.cream} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z" fill={c.sky} stroke={c.textPrimary} strokeWidth={1.1} strokeLinejoin="round" />
      <Rect x={14} y={20} width={12} height={8} rx={1} fill={c.surface} stroke={c.textPrimary} strokeWidth={1} />
      <Path d="M16 23h8M16 25.5h5" stroke={c.textPrimary} strokeWidth={0.9} strokeLinecap="round" opacity={0.7} />
    </Svg>
  );
}

export function IlloMilkSkim({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M14 11V8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11l1.8 2.8v16.4a2.2 2.2 0 0 1-2.2 2.2H14.4a2.2 2.2 0 0 1-2.2-2.2V13.8Z" fill={c.cream} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M14.2 8.3h11.6v-.7a1.2 1.2 0 0 0-1.2-1.2h-9.2a1.2 1.2 0 0 0-1.2 1.2Z" fill={c.berry} stroke={c.textPrimary} strokeWidth={1.1} strokeLinejoin="round" />
      <Rect x={14} y={20} width={12} height={8} rx={1} fill={c.surface} stroke={c.textPrimary} strokeWidth={1} />
      <Path d="M16 23h8M16 25.5h5" stroke={c.textPrimary} strokeWidth={0.9} strokeLinecap="round" opacity={0.7} />
    </Svg>
  );
}

export function IlloEggs({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M5 22a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" fill={c.terracotta} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      {[10, 16, 22, 28].map((cx) => (
        <Ellipse key={cx} cx={cx} cy={20} rx={3} ry={4} fill={c.cream} stroke={c.textPrimary} strokeWidth={1} />
      ))}
      <Path d="M5 26h30" stroke={c.textPrimary} strokeWidth={0.8} opacity={0.5} />
    </Svg>
  );
}

export function IlloButter({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Rect x={7} y={16} width={26} height={14} rx={1.5} fill={c.butter} stroke={c.textPrimary} strokeWidth={1.2} />
      <Path d="M7 22h26" stroke={c.textPrimary} strokeWidth={0.8} opacity={0.4} />
      <Rect x={12} y={14} width={16} height={18} rx={1} fill={c.surface} stroke={c.textPrimary} strokeWidth={1.1} />
      <Path d="M15 18h10M15 22h8M15 26h6" stroke={c.textPrimary} strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

export function IlloYoghurt({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M11 14h18l-1.4 16a2 2 0 0 1-2 1.8H14.4a2 2 0 0 1-2-1.8Z" fill={c.surface} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Rect x={10} y={12} width={20} height={3} rx={1} fill={c.berry} stroke={c.textPrimary} strokeWidth={1.1} />
      <Rect x={13} y={19} width={14} height={7} rx={1} fill={c.butterSoft} stroke={c.textPrimary} strokeWidth={1} />
      <Path d="M15 22.5h10" stroke={c.textPrimary} strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

export function IlloCream({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M15 11V9a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2l1.4 2v17a2 2 0 0 1-2 2H15.6a2 2 0 0 1-2-2V13Z" fill={c.cream} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M15.2 8.6h9.6v-.5a1 1 0 0 0-1-1h-7.6a1 1 0 0 0-1 1Z" fill={c.primary} stroke={c.textPrimary} strokeWidth={1} />
      <Rect x={14.5} y={19} width={11} height={8} rx={1} fill={c.primary} />
      <Path d="M16.5 22h7M16.5 24.5h4.5" stroke={c.cream} strokeWidth={0.9} strokeLinecap="round" />
    </Svg>
  );
}

export function IlloJuice({ size = 36 }: IlloProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M14 10V7.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V10l1.6 3v17.5a2 2 0 0 1-2 2H14.4a2 2 0 0 1-2-2V13Z" fill={c.terracotta} stroke={c.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M14.4 7.2h11.2v-.5a1 1 0 0 0-1-1h-9.2a1 1 0 0 0-1 1Z" fill={c.butter} stroke={c.textPrimary} strokeWidth={1} />
      <Circle cx={20} cy={22} r={4.2} fill={c.butter} stroke={c.textPrimary} strokeWidth={1} />
      <Path d="M20 18v8M16 22h8M17 19l6 6M17 25l6-6" stroke={c.textPrimary} strokeWidth={0.7} opacity={0.7} />
    </Svg>
  );
}

// Map from product key to illustration component
export const productIllustrations: Record<string, React.FC<IlloProps>> = {
  milk: IlloMilkWhole,
  semi: IlloMilkSemi,
  skim: IlloMilkSkim,
  eggs: IlloEggs,
  butter: IlloButter,
  yoghurt: IlloYoghurt,
  cream: IlloCream,
  juice: IlloJuice,
};
