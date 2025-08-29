import React, { Suspense, lazy } from 'react';
import { GameProvider, useGame, GAME_STATES } from './context/GameContext';
import CursorTrail from './components/CursorTrail';
import NavigatorSigilCursor from './components/NavigatorSigilCursor';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';

const TitleScreen = lazy(() => import('./components/TitleScreen'));
const ProfileCreation = lazy(() => import('./components/ProfileCreation'));
const ProfileResults = lazy(() => import('./components/ProfileResults'));
const GameplayScreen = lazy(() => import('./components/GameplayScreen'));

function GameRouter() {
  const { state } = useGame();
  
  switch (state.gameState) {
    case GAME_STATES.TITLE_SCREEN:
      return <TitleScreen />;
    case GAME_STATES.PROFILE_CREATION:
      return <ProfileCreation />;
    case GAME_STATES.PROFILE_RESULTS:
      return <ProfileResults />;
    case GAME_STATES.GAMEPLAY:
      return <GameplayScreen />;
    default:
      return <TitleScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GlobalStyles />
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: '2rem', color: '#d4af37' }}>Loading…</div>}>
          <div className="app">
            <GameRouter />
          </div>
        </Suspense>
      </ErrorBoundary>
      <CursorTrail />
      <NavigatorSigilCursor />
    </GameProvider>
  );
}

export default App;
