import './style.css';
import { withWebGLCanvas } from './withWebGLCanvas';
import { gameState as gameStateSingleton } from './GameState';

withWebGLCanvas(document.body, gameStateSingleton);
