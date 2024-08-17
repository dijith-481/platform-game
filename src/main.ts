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





const tileSize = CANVAS_HEIGHT/20
const rows =40; 
const cols =30;
const gameMap = Array.from({length:cols},()=>Array(rows).fill(0));
console.log(cols,rows)
const eventManager = new EventManager(gameMap);
const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT,tileSize);
const player = new Player(eventManager,ctx,tileSize,4,5);

const level = new Level(ctx,eventManager,'../levels/level1.json',gameMap,tileSize,0,0,cols,rows)
//animatelevel();
eventManager.subscribe('levelloaded',()=>{
    //level.render(0,0)
    animatelevel();
})

function animatelevel(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    level.render(0,0);
    player.render();
    requestAnimationFrame(animatelevel);
}

//const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);