"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./sprites/player");
const eventlistener_1 = require("./sprites/eventlistener");
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const aspectRatio = 16 / 9;
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let initialSpeed = 5;
let gameSpeed = 0;
class Background {
    constructor(src, speed) {
        this.img = new Image();
        this.src = src;
        this.x = 0;
        this.speed = speed;
        this.img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === backgroundLayers.length) {
                animate();
            }
        };
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
const eventManager = new eventlistener_1.EventManager();
const player = new player_1.Player(eventManager, CANVAS_WIDTH);
const backgroundLayers = [
    new Background('/backgrounds/layer0.png', 0.2),
    new Background('/backgrounds/layer1.png', 0.3),
    new Background('/backgrounds/layer2.png', 0.4),
    new Background('/backgrounds/layer3.png', 0.5),
    new Background('/backgrounds/layer4.png', 0.6),
    new Background('/backgrounds/layer5.png', 0.7),
    new Background('/backgrounds/layer6.png', 0.8),
    new Background('/backgrounds/layer7.png', 0.9),
    new Background('/backgrounds/layer8.png', 1),
    new Background('/backgrounds/layer9.png', 1.1),
];
//# sourceMappingURL=main.js.map