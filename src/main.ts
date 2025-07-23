import './style.css';
import { initialize } from './initialize';
import { gameState as gameStateSingleton } from './GameState';

initialize(document.body, gameStateSingleton);
