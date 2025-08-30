import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame, GAME_STATES } from './context/GameContext';
import CursorTrail from './components/CursorTrail';
import NavigatorSigilCursor from './components/NavigatorSigilCursor';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import AudioManager from './components/AudioManager';
import LoadingScreen from './components/LoadingScreen';

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

function App() {
  return (
    <GameProvider>
      <GlobalStyles />
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <div className="app">
            <GameRouter />
          </div>
        </Suspense>
      </ErrorBoundary>
      <CursorTrail />
      <NavigatorSigilCursor />
      <AudioManager />
    </GameProvider>
  );
}

export default App;
