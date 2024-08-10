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
    animateBg();
    animatePlayer();


    requestAnimationFrame(animate);
}
function animateBg() {
    backgroundLayers.forEach(layer => {
        layer.update();
    });
}
function animatePlayer() {
    player.update();
}
const eventManager = new EventManager();

const player = new Player(eventManager,CANVAS_WIDTH);
const backgroundLayers: Background[] = [
    new Background('/backgrounds/layer0.png', 0.2,ctx),
    new Background('/backgrounds/layer1.png', 0.3,ctx),
    new Background('/backgrounds/layer2.png', 0.4,ctx),
    new Background('/backgrounds/layer3.png', 0.5,ctx),
    new Background('/backgrounds/layer4.png', 0.6,ctx),
    new Background('/backgrounds/layer5.png', 0.7,ctx),
    new Background('/backgrounds/layer6.png', 0.8,ctx),
    new Background('/backgrounds/layer7.png', 0.9,ctx),
    new Background('/backgrounds/layer8.png',1 ,ctx),
    new Background('/backgrounds/layer9.png', 1.1,ctx),
];
const level = new Level(ctx,CANVAS_WIDTH,CANVAS_HEIGHT,'../levels/level1.json')
animatelevel();

function animatelevel(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    level.update(0,0,0,0);
    requestAnimationFrame(animatelevel);
}
const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);