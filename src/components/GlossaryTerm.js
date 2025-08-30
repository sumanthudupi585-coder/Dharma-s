import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGame, ACTIONS } from '../context/GameContext';
import { termByText } from '../data/glossary';

const TermWrap = styled.span`
  position: relative;
  text-decoration: underline dotted rgba(212,175,55,0.7);
  text-underline-offset: 3px;
  cursor: help;
  color: #ffd95e;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  &:hover, &:focus {
    color: #ffd700;
    text-decoration-color: #ffd700;
  }
`;

const Tip = styled.div`
  position: absolute;
  left: 0;
  bottom: 125%;
  min-width: 240px;
  max-width: 360px;
  background: linear-gradient(145deg, rgba(0,0,0,0.95), rgba(10,10,10,0.98));
  color: #e8c86a;
  border: 1px solid rgba(212,175,55,0.55);
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.7), 0 0 18px rgba(212,175,55,0.2);
  z-index: 2000;
  will-change: transform, opacity;
  transform: translateY(-6px);
  animation: tooltipIn 160ms ease-out;

  &::after {
    content: '';
    position: absolute;
    left: 18px;
    top: 100%;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(10,10,10,0.98) transparent transparent transparent;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
  }

  @keyframes tooltipIn {
    from { opacity: 0; transform: translateY(0); }
    to { opacity: 1; transform: translateY(-6px); }
  }
`;

const TipTitle = styled.div`
  font-family: var(--font-display);
  font-weight: 700;
  margin-bottom: 4px;
  color: #ffd700;
`;

const TipBody = styled.div`
  font-family: var(--font-primary);
  font-size: 0.92rem;
  line-height: 1.4;
  color: #b8941f;
`;

export default function GlossaryTerm({ term, className }) {
  const id = useId();
  const { dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const def = termByText(term);

  useEffect(() => {
    if (!def) return;
    dispatch({ type: ACTIONS.ADD_GLOSSARY_TERM, payload: { id: def.id, term: def.term, brief: def.brief } });
  }, [def, dispatch]);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  if (!def) return <span className={className}>{term}</span>;

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  return (
    <TermWrap
      className={`is-interactive ${className || ''}`}
      role="button"
      aria-haspopup="tooltip"
      aria-expanded={open}
      aria-describedby={open ? `${id}-desc` : undefined}
      aria-controls={open ? `${id}-tip` : undefined}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
      onKeyDown={onKey}
      ref={ref}
    >
      {def.term}
      {open && (
        <Tip id={`${id}-tip`} role="tooltip">
          <TipTitle id={`${id}-title`}>{def.term}</TipTitle>
          <TipBody id={`${id}-desc`}>{def.brief}</TipBody>
        </Tip>
      )}
    </TermWrap>
  );
}
