// Tweak configuration — the data behind the Tweaks panel.
// Expressive dials that reshape the feel of the design, not pixel tweaks.

// Supplier personas: different names give the product a different personality.
// Each persona has a display name used across all screens (supplier pill,
// confirmation cards, delivery copy etc.)
const SUPPLIERS = {
  adam:  { name: 'Adam Cartwright',   first: 'Adam',  hint: 'The archetypal dairy farmer' },
  rosie: { name: 'Rosie Nye',         first: 'Rosie', hint: 'Small-batch, family-run vibes' },
  ben:   { name: 'Ben Hartwell',      first: 'Ben',   hint: 'Young, direct, modern' },
};

// Voice: same layouts, very different words. Swaps the big headlines on each
// screen so the deck reads warm / plain / editorial.
const VOICES = {
  warm: {
    signInTitle:   'Hello there.',
    signInSub:     'Pop in the code from your welcome card and we\'ll get you set up.',
    addressTitle:  'Where are we heading?',
    addressSub:    'Your delivery address helps us work out which days we can reach you.',
    daysTitle:     'Which days work for you?',
    daysSub:       'Tap the days you\'d like a delivery. You can change this later.',
    productsTitle: 'Pick your essentials.',
    productsSub:   'Choose what turns up each time. We\'ll keep it coming.',
  },
  plain: {
    signInTitle:   'Sign in',
    signInSub:     'Enter the code on your welcome card to connect to your supplier.',
    addressTitle:  'Delivery address',
    addressSub:    'We use this to check availability and delivery days in your area.',
    daysTitle:     'Delivery days',
    daysSub:       'Select the days you want deliveries. You can change this anytime.',
    productsTitle: 'Choose your products',
    productsSub:   'Pick what you\'d like on your regular order.',
  },
  editorial: {
    signInTitle:   'Begin with your code.',
    signInSub:     'Each welcome card carries a key to your supplier\'s round.',
    addressTitle:  'The doorstep.',
    addressSub:    'Tell us where the milk should land, and we\'ll find the route.',
    daysTitle:     'A weekly rhythm.',
    daysSub:       'Choose the days that suit you. A routine, not a rigid promise.',
    productsTitle: 'The standing order.',
    productsSub:   'What lands on the step, week after week.',
  },
};

// Context for screens to read current tweak values without prop-drilling.
const TweakCtx = React.createContext({ voice: 'warm', supplierKey: 'adam' });

// Helper for screens: pull live copy + supplier based on current tweaks.
function useCopy() {
  const { voice, supplierKey } = React.useContext(TweakCtx);
  return {
    voice: VOICES[voice] || VOICES.warm,
    supplier: SUPPLIERS[supplierKey] || SUPPLIERS.adam,
  };
}

Object.assign(window, { SUPPLIERS, VOICES, TweakCtx, useCopy });
