// Screen 1 — Sign in with QR or code.
// Simple, unfussy. QR scanner is a visual suggestion (a camera-style frame
// with a pulsing reticle) — tapping "I have a code instead" switches to
// a 6-box code input that auto-advances and lights up when complete.

function ScreenSignIn({ t, state, setState, onContinue }) {
  const [mode, setMode] = React.useState('scan'); // 'scan' | 'code'
  const [code, setCode] = React.useState(state.code || '');
  const [error, setError] = React.useState(null);
  const inputRefs = React.useRef([]);

  const handleCodeChange = (i, v) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = code.padEnd(6, ' ').split('');
    next[i] = digit || ' ';
    const joined = next.join('').trimEnd();
    setCode(joined);
    setError(null);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const submit = () => {
    if (code.replace(/\s/g, '').length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    // "Invalid" demo: any code starting with 0 fails (to show the error state)
    if (code.startsWith('0')) {
      setError('That was not recognised as a valid supplier.');
      return;
    }
    setState((s) => ({ ...s, code, supplier: 'Adam Cartwright' }));
    onContinue();
  };

  return (
    <PhoneScreen t={t}>
      <Header t={t} />
      <div style={{ padding: '12px 28px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Brand mark */}
        <div style={{ marginBottom: 28 }}>
          <Logo t={t} size={34} variant="full" />
        </div>

        <h1 style={{
          fontFamily: t.font, fontSize: 30, lineHeight: 1.1,
          fontWeight: t.key === 'crisp' ? 600 : 500,
          margin: '0 0 10px', letterSpacing: t.key === 'editorial' ? -0.5 : -0.4,
        }}>
          {mode === 'scan' ? 'Scan your welcome card' : 'Enter your code'}
        </h1>
        <p style={{ margin: 0, color: t.textSoft, fontSize: 14, lineHeight: 1.5 }}>
          {mode === 'scan'
            ? 'Your milkman sent you a QR code. Point the camera at it to get started.'
            : 'Type the 6-digit code from your welcome card.'}
        </p>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
          {mode === 'scan' ? <QRViewfinder t={t} /> : <CodeInput t={t} code={code} onChange={handleCodeChange} onKey={handleKey} refs={inputRefs} error={!!error} />}
        </div>

        {error && (
          <div style={{
            background: '#FDECEC',
            color: '#A33',
            border: '1px solid #F4C6C6',
            borderRadius: t.radiusSmall,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 12,
          }}>{error}</div>
        )}

        {mode === 'code' && (
          <PrimaryBtn t={t} onClick={submit} disabled={code.replace(/\s/g, '').length !== 6}>
            Continue
          </PrimaryBtn>
        )}

        <button onClick={() => { setMode(mode === 'scan' ? 'code' : 'scan'); setError(null); }} style={{
          marginTop: 14, background: 'transparent', border: 'none',
          color: t.primary, fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', padding: 12,
          textDecoration: t.key === 'crisp' ? 'underline' : 'none',
          textUnderlineOffset: 3,
        }}>
          {mode === 'scan' ? 'I have a code instead' : 'Scan QR code instead'}
        </button>
      </div>
    </PhoneScreen>
  );
}

function QRViewfinder({ t }) {
  return (
    <div style={{
      width: 240, height: 240,
      borderRadius: t.radius,
      background: t.key === 'crisp' ? '#1a1a1a' : '#1a2420',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Mock camera feed — subtle gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.08), transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,255,255,.05), transparent 60%)',
      }} />

      {/* Corner brackets */}
      {[{top:20,left:20,b:'r',r:'b'},{top:20,right:20,b:'l',r:'b'},{bottom:20,left:20,b:'r',r:'t'},{bottom:20,right:20,b:'l',r:'t'}].map((pos, i) => {
        const { b, r, ...coord } = pos;
        return (
          <div key={i} style={{
            position: 'absolute', width: 32, height: 32,
            borderColor: t.primaryInk,
            borderStyle: 'solid',
            borderWidth: 0,
            [`border${r === 't' ? 'Top' : 'Bottom'}Width`]: 3,
            [`border${b === 'r' ? 'Right' : 'Left'}Width`]: 3,
            borderRadius: r === 't' ? (b === 'r' ? '0 4px 0 0' : '4px 0 0 0') : (b === 'r' ? '0 0 4px 0' : '0 0 0 4px'),
            ...coord,
          }} />
        );
      })}

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 24, right: 24, height: 2,
        background: `linear-gradient(90deg, transparent, ${t.primary}, transparent)`,
        animation: 'mrScan 2.4s ease-in-out infinite',
        boxShadow: `0 0 12px ${t.primary}`,
      }} />

      {/* Flashlight button */}
      <button style={{
        position: 'absolute', bottom: 16, right: 16,
        width: 34, height: 34, borderRadius: 17,
        background: 'rgba(255,255,255,.14)', border: 'none',
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconFlashlight size={16} stroke={1.6} />
      </button>
    </div>
  );
}

function CodeInput({ t, code, onChange, onKey, refs, error }) {
  const chars = code.padEnd(6, ' ').split('').slice(0, 6);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={c.trim()}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          inputMode="numeric"
          maxLength={1}
          style={{
            width: 44, height: 56,
            borderRadius: t.radiusSmall,
            border: `1.5px solid ${error ? '#D97070' : c.trim() ? t.primary : t.border}`,
            background: t.card,
            color: t.text,
            fontFamily: t.font,
            fontSize: 26, fontWeight: 600,
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 120ms ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = t.primary)}
          onBlur={(e) => (e.target.style.borderColor = error ? '#D97070' : c.trim() ? t.primary : t.border)}
        />
      ))}
    </div>
  );
}

Object.assign(window, { ScreenSignIn });
