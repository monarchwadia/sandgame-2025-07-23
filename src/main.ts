import './style.css';
import { withWebGLCanvas } from './WebGLCanvas';
import type { GameState } from './types';

const gameState: GameState = {};
withWebGLCanvas(document.body, gameState);
