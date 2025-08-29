import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Game States
export const GAME_STATES = {
  TITLE_SCREEN: 'TITLE_SCREEN',
  PROFILE_CREATION: 'PROFILE_CREATION',
  PROFILE_RESULTS: 'PROFILE_RESULTS',
  GAMEPLAY: 'GAMEPLAY'
};

// Scene States
export const SCENES = {
  DASHASHWAMEDH_GHAT: 'DASHASHWAMEDH_GHAT',
  LABYRINTH_GHATS: 'LABYRINTH_GHATS',
  NYAYA_TRIAL: 'NYAYA_TRIAL',
  VAISESIKA_TRIAL: 'VAISESIKA_TRIAL',
  THE_WARDEN: 'THE_WARDEN'
};

// Gunas (Primary Paths)
export const GUNAS = {
  SATTVA: 'SATTVA', // The Sage
  RAJAS: 'RAJAS',   // The Scion
  TAMAS: 'TAMAS'    // The Shadow
};

// Ganas (Temperaments)
export const GANAS = {
  DEVA: 'DEVA',         // The Divine
  MANUSHYA: 'MANUSHYA', // The Human
  RAKSHASA: 'RAKSHASA'  // The Fierce
};

// Initial game state
const initialState = {
  gameState: GAME_STATES.TITLE_SCREEN,
  currentScene: SCENES.DASHASHWAMEDH_GHAT,
  
  // Player Profile
  playerProfile: {
    primaryGuna: null,
    primaryGana: null,
    nakshatra: null,
    rashi: null,
    skills: [],
    surveyAnswers: []
  },
  
  // Game Progress
  gameProgress: {
    completedScenes: [],
    currentObjectives: [],
    solvedPuzzles: [],
    unlockedAreas: []
  },
  
  // Inventory & Journal
  inventory: {
    items: [],
    clues: [],
    notes: []
  },
  
  // Scene-specific state
  sceneData: {
    choices: [],
    currentNarrative: '',
    interactableObjects: [],
    completedInteractions: []
  },
  
  // UI State
  uiState: {
    journalOpen: false,
    activeJournalTab: 'profile',
    showObjectives: false,
    dialogueVisible: false
  },
  
  // Audio/Visual Settings
  settings: {
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    textSpeed: 'normal',
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false
    }
  }
};

// Action types
export const ACTIONS = {
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_CURRENT_SCENE: 'SET_CURRENT_SCENE',
  
  // Profile actions
  SET_SURVEY_ANSWER: 'SET_SURVEY_ANSWER',
  SET_PLAYER_PROFILE: 'SET_PLAYER_PROFILE',
  
  // Progress actions
  COMPLETE_SCENE: 'COMPLETE_SCENE',
  ADD_OBJECTIVE: 'ADD_OBJECTIVE',
  COMPLETE_OBJECTIVE: 'COMPLETE_OBJECTIVE',
  SOLVE_PUZZLE: 'SOLVE_PUZZLE',
  
  // Inventory actions
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  ADD_CLUE: 'ADD_CLUE',
  ADD_NOTE: 'ADD_NOTE',
  
  // Scene actions
  SET_NARRATIVE: 'SET_NARRATIVE',
  ADD_CHOICE: 'ADD_CHOICE',
  CLEAR_CHOICES: 'CLEAR_CHOICES',
  ADD_INTERACTABLE: 'ADD_INTERACTABLE',
  INTERACT_WITH_OBJECT: 'INTERACT_WITH_OBJECT',
  
  // UI actions
  TOGGLE_JOURNAL: 'TOGGLE_JOURNAL',
  SET_JOURNAL_TAB: 'SET_JOURNAL_TAB',
  TOGGLE_OBJECTIVES: 'TOGGLE_OBJECTIVES',
  
  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_STATE: 'LOAD_STATE'
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_GAME_STATE:
      return { ...state, gameState: action.payload };
      
    case ACTIONS.SET_CURRENT_SCENE:
      return { ...state, currentScene: action.payload };
      
    case ACTIONS.SET_SURVEY_ANSWER:
      return {
        ...state,
        playerProfile: {
          ...state.playerProfile,
          surveyAnswers: [...state.playerProfile.surveyAnswers, action.payload]
        }
      };
      
    case ACTIONS.SET_PLAYER_PROFILE:
      return {
        ...state,
        playerProfile: { ...state.playerProfile, ...action.payload }
      };
      
    case ACTIONS.COMPLETE_SCENE:
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          completedScenes: [...state.gameProgress.completedScenes, action.payload]
        }
      };
      
    case ACTIONS.ADD_OBJECTIVE:
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          currentObjectives: [...state.gameProgress.currentObjectives, action.payload]
        }
      };
      
    case ACTIONS.COMPLETE_OBJECTIVE:
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          currentObjectives: state.gameProgress.currentObjectives.filter(
            obj => obj.id !== action.payload
          )
        }
      };
      
    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: [...state.inventory.items, action.payload]
        }
      };
      
    case ACTIONS.ADD_CLUE:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          clues: [...state.inventory.clues, action.payload]
        }
      };
      
    case ACTIONS.SET_NARRATIVE:
      return {
        ...state,
        sceneData: {
          ...state.sceneData,
          currentNarrative: action.payload
        }
      };
      
    case ACTIONS.ADD_CHOICE:
      return {
        ...state,
        sceneData: {
          ...state.sceneData,
          choices: [...state.sceneData.choices, action.payload]
        }
      };
      
    case ACTIONS.CLEAR_CHOICES:
      return {
        ...state,
        sceneData: {
          ...state.sceneData,
          choices: []
        }
      };
      
    case ACTIONS.TOGGLE_JOURNAL:
      return {
        ...state,
        uiState: {
          ...state.uiState,
          journalOpen: !state.uiState.journalOpen
        }
      };
      
    case ACTIONS.SET_JOURNAL_TAB:
      return {
        ...state,
        uiState: {
          ...state.uiState,
          activeJournalTab: action.payload
        }
      };
      
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case ACTIONS.LOAD_STATE:
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}

// Create context
const GameContext = createContext();

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (init) => {
      try {
        const raw = localStorage.getItem('dharmas-cipher-state-v1');
        if (!raw) return init;
        const parsed = JSON.parse(raw);
        return { ...init, ...parsed };
      } catch (e) {
        return init;
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem('dharmas-cipher-state-v1', JSON.stringify(state));
    } catch (e) {
      // ignore persistence errors
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
