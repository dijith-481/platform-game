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
let initialSpeed =5;
let gameSpeed:number =0;




let imagesLoaded = 0;

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    animatePlayer();


    requestAnimationFrame(animate);
}

function animatePlayer() {
    player.update();
}
const eventManager = new EventManager();

const player = new Player(eventManager,CANVAS_WIDTH);
;
const tileSize = CANVAS_HEIGHT/20
const level = new Level(ctx,'../levels/level1.json',tileSize,{x:0,y:0,w:CANVAS_WIDTH,h:CANVAS_HEIGHT})
//animatelevel();

function animatelevel(){
   // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    requestAnimationFrame(animatelevel);
}
//const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);