import { Player } from "./sprites/player";
import { EventManager } from "./sprites/eventlistener";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const aspectRatio = 16 / 9;
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let initialSpeed =5;
let gameSpeed:number =0;
class Background {
    img: HTMLImageElement;
    src: string;
    x: number;
    speed: number;
    constructor(src: string, speed: number) {
        this.img = new Image();
        this.src = src;
        this.x = 0;
        this.speed = speed;
        this.img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === backgroundLayers.length) {
                animate();
            }
        }

        this.img.src = this.src;

    }
    update() {
        const sw = this.img.width;
        const sh = this.img.height / 2;
        const dw = CANVAS_HEIGHT * sw / sh;
        ctx.drawImage(this.img, 0, sh, sw, sh, this.x, 0, dw, CANVAS_HEIGHT);
        this.x -= gameSpeed * this.speed;
        if (this.x < -dw / 2) {
            this.x = 0;
        }
    }
}



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
    new Background('/backgrounds/layer0.png', 0.2),
    new Background('/backgrounds/layer1.png', 0.3),
    new Background('/backgrounds/layer2.png', 0.4),
    new Background('/backgrounds/layer3.png', 0.5),
    new Background('/backgrounds/layer4.png', 0.6),
    new Background('/backgrounds/layer5.png', 0.7),
    new Background('/backgrounds/layer6.png', 0.8),
    new Background('/backgrounds/layer7.png', 0.9),
    new Background('/backgrounds/layer8.png',1 ),
    new Background('/backgrounds/layer9.png', 1.1),
];
