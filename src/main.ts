import { Player } from "./sprites/player.js";
import { EventManager } from "./sprites/eventlistener.js";
import { Level } from "./sprites/level.js";
import { Camera } from "./sprites/camera.js";
import { Controller } from "./controller.js";
import { Background } from "./sprites/background.js"
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const aspectRatio = 16 / 9;
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const controller =new Controller();



const tileSize = CANVAS_HEIGHT/20
const screenCols = Math.ceil(CANVAS_WIDTH/tileSize)+1;
const screenRows = 21;
const rows =32; 
const cols =32;
const gameMap = Array.from({length:rows},()=>Array(cols*2).fill(0));
console.log(cols,rows)
const eventManager = new EventManager(gameMap);
const camera = new Camera();
const player = new Player(eventManager,ctx,tileSize,4,5);

const level = new Level(ctx,eventManager,'../levels/level1.json',gameMap,tileSize,0,0,screenCols,screenRows)
eventManager.subscribe('levelloaded',()=>{
    animatelevel();
})

function animatelevel(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    level.render(0,0);
    gameloop();
    requestAnimationFrame(animatelevel);
}
function gameloop(){
        player.pos.y+=player.yvelocity;
    let playerY = player.updateGravity(checkCollision(player.pos),controller.keys.w) - camera.y;
    let playerX = player.updateXmovement(checkCollision(player.pos),controller.keys.d,controller.keys.a)- camera.x;
    console.log(player.yvelocity)
    if (playerX > CANVAS_WIDTH*3/4) {
        camera.x = playerX - CANVAS_WIDTH*3/4;
        playerX = CANVAS_WIDTH*3/4;
      }
    //  player.updatey()
      player.render(playerX,player.pos.y)
}


function checkCollision(pos:{x:number,y:number}){
    const x = Math.floor(pos.x/tileSize);
    const y = Math.floor(pos.y/tileSize)+2;
        try{
            if(gameMap[y][x]!='0'){
            return true;
        }else{
            return false;
        }}
        catch(error){
            return false;
        }}
//const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);