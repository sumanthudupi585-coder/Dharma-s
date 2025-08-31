import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame, GAME_STATES } from './context/GameContext';
import CursorTrail from './components/CursorTrail';
import NavigatorSigilCursor from './components/NavigatorSigilCursor';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import AudioManager from './components/AudioManager';
import LoadingScreen from './components/LoadingScreen';
import CornerMenu from './components/CornerMenu';
import { useIsTouchDevice } from './hooks/useIsTouchDevice';
import OrientationNotice from './components/OrientationNotice';

const TitleScreen = lazy(() => import('./components/TitleScreen'));
const ProfileCreation = lazy(() => import('./components/ProfileCreation'));
const ProfileResults = lazy(() => import('./components/ProfileResults'));
const GameplayScreen = lazy(() => import('./components/GameplayScreen'));

function GameRouter() {
  const variants = {
    initial: { opacity: 0, filter: 'blur(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' }
  };
  const { state } = useGame();
  
  const key = state.gameState;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} initial="initial" animate="animate" exit="exit" variants={variants} transition={{ duration: 0.4 }}>
        {state.gameState === GAME_STATES.TITLE_SCREEN && <TitleScreen />}
        {state.gameState === GAME_STATES.PROFILE_CREATION && <ProfileCreation />}
        {state.gameState === GAME_STATES.PROFILE_RESULTS && <ProfileResults />}
        {state.gameState === GAME_STATES.GAMEPLAY && <GameplayScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function ClassSync() {
  const { state } = useGame();
  React.useEffect(() => {
    const b = document.body;
    if (!b) return;
    b.classList.toggle('large-text', !!state.settings.accessibility.largeText);
    b.classList.toggle('force-reduced-motion', !!state.settings.accessibility.reducedMotion);
    b.classList.toggle('high-contrast', !!state.settings.accessibility.highContrast);
  }, [state.settings.accessibility.largeText, state.settings.accessibility.reducedMotion, state.settings.accessibility.highContrast]);
  return null;
}

function EffectsMount() {
  const { state } = useGame();
  const isTouch = useIsTouchDevice ? useIsTouchDevice() : false;
  const allowTrail = (state.settings.effects?.cursorTrail !== false) && !state.settings.accessibility.reducedMotion && !isTouch;
  return (
    <>
      {allowTrail && <CursorTrail />}
      {!isTouch && <NavigatorSigilCursor />}
      <AudioManager />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GlobalStyles />
      <ClassSync />
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <div className="app">
            <GameRouter />
            <CornerMenu />
          </div>
          <OrientationNotice />
        </Suspense>
      </ErrorBoundary>
      <EffectsMount />
    </GameProvider>
  );
}

export default App;
