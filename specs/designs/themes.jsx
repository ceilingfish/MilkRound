// Three visual directions for the Milkround customer app.
// Each theme defines tokens; components read them via props.

const themes = {
  farmhouse: {
    key: 'farmhouse',
    name: 'Farmhouse',
    blurb: 'Cream + sage, with butter, terracotta & sky accents.',
    font: "'Fraunces', 'Georgia', serif",
    fontBody: "'Nunito Sans', 'Inter', system-ui, sans-serif",
    bg: '#F7F1E3',
    card: '#FFFDF7',
    border: 'rgba(74, 92, 65, 0.14)',
    text: '#2C3A2A',
    textSoft: '#6B7A65',
    textMuted: '#9AA396',
    primary: '#4A7C59',
    primaryInk: '#FFFDF7',
    accent: '#C97B4A',
    chipBg: '#EFE6CF',
    chipActive: '#4A7C59',
    chipActiveInk: '#FFFDF7',
    focusRing: 'rgba(74,124,89,.35)',
    shadow: '0 1px 0 rgba(74,92,65,.04), 0 8px 24px rgba(74,92,65,.06)',
    radius: 18,
    radiusSmall: 12,
    statusBar: '#2C3A2A',
    headerAccent: "linear-gradient(180deg, #F7F1E3 0%, #FFFDF7 100%)",
    // Extended palette
    butter:     '#E9B949', // warm butter yellow
    butterSoft: '#F6E4B2',
    terracotta: '#C97B4A',
    terraSoft:  '#F1D7C4',
    sky:        '#6F9DB8', // a milk-morning blue
    skySoft:    '#D5E3EB',
    berry:      '#A84D5A', // rare pop
    cream:      '#FFF6E0',
    forest:     '#2E4B33', // deeper green for emphasis
    // Accent rotation for day badges / product tiles
    accentRotation: ['#4A7C59', '#E9B949', '#C97B4A', '#6F9DB8', '#A84D5A', '#2E4B33', '#7A8B5A'],
  },
};

window.themes = themes;
