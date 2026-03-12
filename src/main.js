import './style.css'
import { drawBoard, drawPieces } from './rendering.js'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function animate() {
    drawBoard(ctx);
    drawPieces(ctx);
    requestAnimationFrame(animate);
}

animate();
