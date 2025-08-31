import React from 'react';
import React from 'react';
import styled from 'styled-components';
import { SCENES } from '../context/GameContext';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const Title = styled.div`
  font-family: var(--font-display);
  color: #ffd700;
  font-size: var(--fs-sm);
  text-align: center;
  margin-bottom: 6px;
`;

const Map = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const Node = styled.button`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 8px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(15,15,15,0.95));
  border: 1px solid ${p => p.$active ? '#ffd700' : 'rgba(212,175,55,0.5)'};
  color: #e8c86a;
  border-radius: 10px;
  padding: 8px 10px;
  min-height: 44px;
  touch-action: manipulation;
  cursor: pointer;
  text-align: left;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.$done ? 'linear-gradient(145deg, #d4af37, #ffd700)' : 'transparent'};
  border: 1px solid #d4af37;
`;

const Label = styled.span`
  font-family: var(--font-primary);
`;

const Status = styled.span`
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: ${p => p.$active ? '#000' : '#b8941f'};
  background: ${p => p.$active ? 'linear-gradient(145deg, #d4af37, #ffd700)' : 'transparent'};
  padding: 2px 6px;
  border-radius: 8px;
`;

const sceneLabels = {
  [SCENES.DASHASHWAMEDH_GHAT]: 'Dashashwamedh Ghat',
  [SCENES.LABYRINTH_GHATS]: 'Labyrinth of the Ghats',
  [SCENES.NYAYA_TRIAL]: 'Nyāya Trial',
  [SCENES.VAISESIKA_TRIAL]: 'Vaiśeṣika Trial',
  [SCENES.THE_WARDEN]: 'The Warden'
};

function SceneProgressMap({ scenes, current, completed, onSelect }) {
  const completedIdx = completed
    .map((s) => scenes.indexOf(s))
    .filter((i) => i >= 0);
  const maxCompleted = completedIdx.length ? Math.max(...completedIdx) : -1;
  const allowIndex = Math.min(maxCompleted + 1, scenes.length - 1);

  return (
    <Wrap>
      <Title>Journey Map</Title>
      <Map>
        {scenes.map((s, idx) => {
          const active = s === current;
          const done = completed.includes(s);
          const allowed = idx <= allowIndex;
          return (
            <Node
              key={s}
              className={allowed ? 'is-interactive' : 'is-disabled'}
              $active={active}
              onClick={() => allowed && onSelect && onSelect(s)}
              aria-current={active ? 'page' : undefined}
              aria-disabled={allowed ? undefined : 'true'}
              disabled={!allowed}
            >
              <Dot $done={done} aria-hidden />
              <Label>{sceneLabels[s] || s}</Label>
              <Status $active={active}>{active ? 'Current' : done ? 'Done' : ''}</Status>
            </Node>
          );
        })}
      </Map>
    </Wrap>
  );
}

export default React.memo(SceneProgressMap);
