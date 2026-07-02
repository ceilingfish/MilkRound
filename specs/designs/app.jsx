// App entry — three design directions x four onboarding screens on a canvas.
// Reads Tweaks values to reshape focus, supplier persona, and copy voice.

function OnboardingFlow({ theme, initialStep = 0, supplier }) {
  const t = window.themes[theme];
  const [step, setStep] = React.useState(initialStep);
  const [state, setState] = React.useState({
    code: '',
    supplier: supplier.name,
    address: null,
    addressQuery: '',
    days: ['mon', 'wed', 'fri'],
    baskets: { all: { milk: 2, eggs: 1 } },
    splitDays: [],
  });

  // Keep the supplier name in sync when the tweak changes.
  React.useEffect(() => {
    setState((s) => ({ ...s, supplier: supplier.name }));
  }, [supplier.name]);

  const screens = [
    <ScreenSignIn       key="s" t={t} state={state} setState={setState} onContinue={() => setStep(1)} />,
    <ScreenAddress      key="a" t={t} state={state} setState={setState} onBack={() => setStep(0)} onContinue={() => setStep(2)} />,
    <ScreenPickDays     key="d" t={t} state={state} setState={setState} onBack={() => setStep(1)} onContinue={() => setStep(3)} />,
    <ScreenPickProducts key="p" t={t} state={state} setState={setState} onBack={() => setStep(2)} onFinish={() => setStep(4)} />,
    <DoneScreen         key="o" t={t} state={state} onReset={() => setStep(0)} />,
  ];
  return screens[step];
}

function DoneScreen({ t, state, onReset }) {
  return (
    <PhoneScreen t={t}>
      <Header t={t} />
      <div style={{ flex: 1, padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: t.primary, color: t.primaryInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22,
        }}>
          <IconCheck size={36} stroke={2.4} />
        </div>
        <h1 style={{ fontFamily: t.font, fontSize: 28, margin: '0 0 10px', fontWeight: t.key === 'crisp' ? 600 : 500, letterSpacing: -0.3 }}>
          You're set up.
        </h1>
        <p style={{ margin: 0, color: t.textSoft, fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>
          First delivery from {state.supplier} is on Monday. We'll send a reminder the evening before.
        </p>
        <div style={{ marginTop: 28, width: '100%' }}>
          <GhostBtn t={t} onClick={onReset}>Restart demo</GhostBtn>
        </div>
      </div>
    </PhoneScreen>
  );
}

// Renders a non-interactive snapshot at a given step. Clicking focuses the
// artboard where the flow can be driven end-to-end.
function Snapshot({ theme, step, supplier }) {
  return <OnboardingFlow theme={theme} initialStep={step} supplier={supplier} />;
}

// ── Canvas composition ─────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const supplier = SUPPLIERS[tweaks.supplier] || SUPPLIERS.adam;

  const dir = { key: 'farmhouse', ...window.themes.farmhouse };

  const STEPS = [
    { key: 'signin',   label: '1 · Sign in', step: 0 },
    { key: 'address',  label: '2 · Address', step: 1 },
    { key: 'days',     label: '3 · Pick days', step: 2 },
    { key: 'products', label: '4 · Pick products', step: 3 },
  ];

  return (
    <TweakCtx.Provider value={{ voice: tweaks.voice, supplierKey: tweaks.supplier }}>
      <DesignCanvas>
        <DCSection id="onboarding" title="Onboarding" subtitle="New customer sign-up flow">
          {STEPS.map((s) => (
            <DCArtboard
              key={s.key}
              id={`onboarding-${s.key}`}
              label={`${s.label}`}
              width={PHONE_W}
              height={PHONE_H}
            >
              <Snapshot theme={dir.key} step={s.step} supplier={supplier} />
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Persona" />
        <TweakRadio
          label="Supplier"
          value={tweaks.supplier}
          options={[
            { value: 'adam',  label: 'Adam' },
            { value: 'rosie', label: 'Rosie' },
            { value: 'ben',   label: 'Ben' },
          ]}
          onChange={(v) => setTweak('supplier', v)}
        />
        <div style={{
          fontSize: 10.5, color: 'rgba(41,38,27,.55)',
          padding: '0 2px', marginTop: -4, lineHeight: 1.4,
        }}>
          {supplier.name} · {supplier.hint}
        </div>

        <TweakSection label="Copy" />
        <TweakRadio
          label="Voice"
          value={tweaks.voice}
          options={[
            { value: 'warm',      label: 'Warm' },
            { value: 'plain',     label: 'Plain' },
            { value: 'editorial', label: 'Editorial' },
          ]}
          onChange={(v) => setTweak('voice', v)}
        />
        <div style={{
          fontSize: 10.5, color: 'rgba(41,38,27,.55)',
          padding: '0 2px', marginTop: -4, lineHeight: 1.4, fontStyle: 'italic',
        }}>
          “{VOICES[tweaks.voice].addressTitle}”
        </div>
      </TweaksPanel>
    </TweakCtx.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
