import React, { useEffect, useState } from 'react';

import React, { useEffect, useState } from 'react';

export default function TypewriterText({ text = '', speed = 24, onAdvance, onComplete }) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timer;
    setDone(false);
    const step = () => {
      i += 1;
      const next = text.slice(0, i);
      setOut(next);
      if (i < text.length) {
        timer = setTimeout(step, Math.max(8, 1000 / speed));
      } else {
        setDone(true);
        onComplete && onComplete();
      }
    };
    step();
    return () => clearTimeout(timer);
  }, [text, speed, onComplete]);

  const handleActivate = (e) => {
    e && e.preventDefault();
    if (!done) {
      setOut(text);
      setDone(true);
      onComplete && onComplete();
    } else {
      onAdvance && onAdvance();
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleActivate(e); }}
      aria-label={done ? 'Next' : 'Skip typewriter'}
      style={{ cursor: 'pointer' }}
    >
      {out}
    </span>
  );
}
