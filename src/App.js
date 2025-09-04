import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame, GAME_STATES } from './context/GameContext';
import CursorTrail from './components/CursorTrail';
import NavigatorSigilCursor from './components/NavigatorSigilCursor';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import AudioManager from './components/AudioManager';
import LoadingScreen from './components/LoadingScreen';
import InkDissolve from './components/InkDissolve';
import AtmosphereMount from './components/AtmosphereMount';
import { useIsTouchDevice } from './hooks/useIsTouchDevice';
import OrientationNotice from './components/OrientationNotice';
import MasterLayout from './ui/layout/MasterLayout';
import CornerMenu from './components/CornerMenu';

const TitleScreen = lazy(() => import('./components/TitleScreen'));
const ProfileCreation = lazy(() => import('./components/ProfileCreation'));
const ProfileResults = lazy(() => import('./components/ProfileResults'));
const GameplayScreen = lazy(() => import('./components/GameplayScreen'));

function GameRouter() {
  const isTouch = require('./hooks/useIsTouchDevice').useIsTouchDevice();
  const variants = {
    initial: { opacity: 0, filter: 'blur(8px) contrast(0.9)' },
    animate: { opacity: 1, filter: 'blur(0px) contrast(1)' },
    exit: { opacity: 0, filter: 'blur(10px) contrast(0.85)' },
  };
  const { state } = useGame();

  const key = state.gameState;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.4 }}
      >
        {state.gameState === GAME_STATES.TITLE_SCREEN && (
          <MasterLayout showHeader={false} showFooter={false}>
            <TitleScreen />
          </MasterLayout>
        )}
        {state.gameState === GAME_STATES.PROFILE_CREATION && (
          <MasterLayout>
            <ProfileCreation />
          </MasterLayout>
        )}
        {state.gameState === GAME_STATES.PROFILE_RESULTS && (
          <MasterLayout>
            <ProfileResults />
          </MasterLayout>
        )}
        {state.gameState === GAME_STATES.GAMEPLAY && (
          <MasterLayout>
            <GameplayScreen />
            <CornerMenu />
          </MasterLayout>
        )}
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
  }, [
    state.settings.accessibility.largeText,
    state.settings.accessibility.reducedMotion,
    state.settings.accessibility.highContrast,
  ]);
  return null;
}

function EffectsMount() {
  const { state } = useGame();
  const isTouch = useIsTouchDevice();
  const allowTrail =
    state.settings.effects?.cursorTrail !== false &&
    !state.settings.accessibility.reducedMotion &&
    !isTouch;
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
            <AtmosphereMount />
            <GameRouter />
            <InkDissolve />
          </div>
          <OrientationNotice />
        </Suspense>
      </ErrorBoundary>
      <EffectsMount />
      {/* Global achievement toasts */}
      {/**/}
      {React.createElement(require('./components/AchievementsToast').default)}
    </GameProvider>
  );
}

export default App;
