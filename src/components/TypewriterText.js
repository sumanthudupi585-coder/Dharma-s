import React, { useEffect, useState } from 'react';

export default function TypewriterText({ text = '', speed = 24 }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0;
    let raf;
    const step = () => {
      i += 1;
      setOut(text.slice(0, i));
      if (i < text.length) raf = setTimeout(step, 1000 / speed);
    };
    step();
    return () => clearTimeout(raf);
  }, [text, speed]);
  return <span>{out}</span>;
}
