import { Player } from "./sprites/player.js";
import { EventManager } from "./sprites/eventlistener.js";
import { Level } from "./sprites/level.js";
import { Camera } from "./sprites/camera.js";
import { Background } from "./sprites/background.js"
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const aspectRatio = 16 / 9;
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;





const eventManager = new EventManager();
const tileSize = CANVAS_HEIGHT/20
const rows =40; 
const cols =30;
console.log(cols,rows)
const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT,tileSize);
const player = new Player(eventManager,CANVAS_WIDTH);
const level = new Level(ctx,'../levels/level1.json',tileSize,0,0,cols,rows)
animatelevel();

function animatelevel(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    level.render(0,0);
    requestAnimationFrame(animatelevel);
}

//const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);