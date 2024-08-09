"use strict";
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
class Player {
    constructor() {
        this.xvelocity = 0;
        this.yvelocity = 0;
        this.playerxvelocity = 0;
        this.endPos = CANVAS_WIDTH * 4 / 8;
        this.startPos = CANVAS_WIDTH / 16;
        this.playerMovementArea = this.endPos - this.startPos;
        this.x = 0;
        this.y = 400;
        this.playerSpeed = 0;
        this.keys = {
            w: 0,
            a: 0,
            s: 0,
            d: 0,
        };
        this.addEventListeners();
    }
    updateVelocity(key) {
        if (key == 'w' && this.y == 400) {
            this.yvelocity = -25;
        }
        if (key == 'a' && this.xvelocity > -5) {
            this.xvelocity -= 0.5;
        }
        if (key == 'd' && this.xvelocity < 100) {
            this.xvelocity += 0.5;
            this.playerxvelocity = this.xvelocity * 0.995;
            console.log('df');
        }
    }
    updateY() {
        this.y += this.yvelocity;
        if (this.y > 400) {
            this.y = 400;
            this.yvelocity = 0;
        }
        else {
            if (this.y < 0) {
                this.y = 0;
            }
            this.yvelocity += 1;
        }
    }
    updatex() {
        const playermovedis = (this.x - this.startPos) / this.playerMovementArea;
        const sin = Math.sin(playermovedis * Math.PI / 2);
        const cos = Math.cos(playermovedis * Math.PI / 2) / 2;
        this.playerSpeed = -initialSpeed * sin + this.playerxvelocity * cos;
        const drag = 0.995;
        this.xvelocity *= drag;
        this.playerxvelocity *= 0.9 * drag;
        console.log(this.xvelocity);
    }
    updateGameSpeed() {
        const playermovedis = (this.x - this.startPos) / this.playerMovementArea;
        const sin = Math.sin(playermovedis * Math.PI / 2) * 3 / 2;
        gameSpeed = initialSpeed + this.xvelocity * sin;
    }
    update() {
        this.updateY();
        this.updatex();
        this.updateGameSpeed();
        this.x += this.playerSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 100, 100);
    }
    addEventListeners() {
        window.addEventListener('keydown', e => {
            if (e.key in this.keys) {
                const intervalId = setInterval(() => {
                    this.updateVelocity(e.key);
                }, 100);
                window.addEventListener('keyup', (upevent) => {
                    if (upevent.key == e.key) {
                        clearInterval(intervalId);
                    }
                });
            }
        });
    }
}
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
const player = new Player();
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
//# sourceMappingURL=main.js.map