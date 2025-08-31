import React from 'react';
import { useGame } from '../context/GameContext';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

export default function AtmosphereMount() {
  const { state } = useGame();
  const isTouch = useIsTouchDevice();
  const allow = !state.settings.accessibility.reducedMotion && !isTouch;
  if (!allow) return null;
  return React.createElement(require('./GenerativeBackground').default);
}
