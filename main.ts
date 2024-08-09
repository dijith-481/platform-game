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
class Player {
    x: number;
    y: number;
    playerSpeed:number;
    private xvelocity:number=0;
    private yvelocity:number=0;
    private playerxvelocity:number=0;
    private endPos:number=CANVAS_WIDTH*4/8;
    private startPos =CANVAS_WIDTH/16;
    private playerMovementArea:number=this.endPos-this.startPos;
     width:number=100;
    height:number=100

   keys:{[key:string]:number}
    constructor() {
        this.x =  0;
        this.y = 400;
        this.playerSpeed =0;    
        this.keys = {
            w: 0,
            a: 0,
            s: 0,
            d: 0,
        }
        this.addEventListeners();
    }
    updateVelocity(key:string){
        if (key=='w' && this.y==400){
            
            this.yvelocity =-25;
        }
        if (key=='s'){
            this.height=50;
        }
        
        if (key=='a' ){
           this.xvelocity =Math.floor(this.xvelocity*0.95)
           initialSpeed =Math.floor(initialSpeed*0.6) 
        }
        if (key=='d' && this.xvelocity<100){
            this.xvelocity +=0.5;
            this.playerxvelocity=this.xvelocity*0.995;
            console.log('df')
        }
    }
       
       private updateY(){
        this.y += this.yvelocity;
        if (this.y > 400) {
            this.y = 400;
            this.yvelocity=0;
        }
        else{
            if (this.y<0){
            this.y=0;
            }
            this.yvelocity += 1;
        }

    }
    private updatex(){
           const playermovedis = (this.x-this.startPos)/this.playerMovementArea
           const sin = Math.sin(playermovedis*Math.PI/2)
           const cos = Math.cos(playermovedis*Math.PI/2)/2
         this.playerSpeed = -initialSpeed *sin+   this.playerxvelocity*cos;
         const drag =0.995;
         this.xvelocity*=drag
         this.playerxvelocity*=0.9*drag
        console.log(this.xvelocity)
    }
    private updateGameSpeed(){
        initialSpeed<5?initialSpeed+=0.1:initialSpeed;
        const playermovedis = (this.x-this.startPos)/this.playerMovementArea
           const sin = Math.sin(playermovedis*Math.PI/2)*3/2
        gameSpeed = initialSpeed   +this.xvelocity*sin
    }
   
    update() {
        this.updateY();
        this.updatex();
        this.updateGameSpeed();
        this.x += this.playerSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height
        );



    }
    private addEventListeners() {
        window.addEventListener('keydown', e => {
            if (e.key in this.keys) {
                
                 const intervalId = setInterval(() => {
            this.updateVelocity(e.key);
        }, 100);
        window.addEventListener('keyup', (upevent) => {
            if (upevent.key == e.key) {
                clearInterval(intervalId);
            }
        })
            }
            
        })
        
    }
}
class Events{
    listeners=[]
    
}
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
