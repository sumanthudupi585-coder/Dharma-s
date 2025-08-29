import React from 'react';
import { GameProvider, useGame, GAME_STATES } from './context/GameContext';
import CursorTrail from './components/CursorTrail';
import NavigatorSigilCursor from './components/NavigatorSigilCursor';
import TitleScreen from './components/TitleScreen';
import ProfileCreation from './components/ProfileCreation';
import ProfileResults from './components/ProfileResults';
import GameplayScreen from './components/GameplayScreen';
import GlobalStyles from './styles/GlobalStyles';

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
      <div className="app">
        <GameRouter />
      </div>
      <CursorTrail />
      <NavigatorSigilCursor />
    </GameProvider>
  );
}

export default App;
