import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGame, ACTIONS } from '../context/GameContext';
import { termByText } from '../data/glossary';

const TermWrap = styled.span`
  position: relative;
  text-decoration: underline dotted rgba(212,175,55,0.7);
  text-underline-offset: 2px;
  cursor: help;
`;

const Tip = styled.div`
  position: absolute;
  left: 0;
  bottom: 125%;
  min-width: 220px;
  max-width: 320px;
  background: rgba(0,0,0,0.92);
  color: #e8c86a;
  border: 1px solid rgba(212,175,55,0.45);
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.6);
  z-index: 50;
  will-change: transform, opacity;
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

  return (
    <TermWrap
      className={className}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-describedby={open ? `${id}-desc` : undefined}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
      ref={ref}
    >
      {def.term}
      {open && (
        <Tip role="dialog" aria-modal="false">
          <TipTitle id={`${id}-title`}>{def.term}</TipTitle>
          <TipBody id={`${id}-desc`}>{def.brief}</TipBody>
        </Tip>
      )}
    </TermWrap>
  );
}
