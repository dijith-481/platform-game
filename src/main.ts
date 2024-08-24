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



const tileSize = CANVAS_HEIGHT/16
const screenCols = Math.ceil(CANVAS_WIDTH/tileSize);
const screenRows = 17;
const rows =32; 
const cols =32;
const gameMap = Array.from({length:rows},()=>Array(cols*2).fill(0));
console.log(cols,rows)
const eventManager = new EventManager(gameMap);
const camera = new Camera(0,tileSize*5);
const player = new Player(eventManager,ctx,tileSize,10,12);
const level = new Level(ctx,eventManager,'../levels/level1.json',gameMap,tileSize,0,0,screenCols,screenRows)


eventManager.subscribe('levelloaded',()=>{
    animatelevel();
})

function animatelevel(){
    ctx.fillStyle = "#ffffff8f";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    gameloop();
    requestAnimationFrame(animatelevel);
}
let flagcamera=false;
function gameloop(){
    let d =0;
    let e = 0;
    if (controller.keys.f){
        display();
    }
    let playerY =  updateY()- camera.y;
    
    let playerX =updateX()-camera.x;
    updateCamera(playerX,playerY)
        
         //camera.x+=playerX-CANVAS_WIDTH+tileSize*8;
    /*if(playerX< tileSize*6){
        flagcamera=true;
        camera.x+=playerX-tileSize*6;
    }
    if (flagcamera && !controller.keys.any){
        camera.x+=5;
    }
    if(playerX<tileSize*12){
        flagcamera=false;
    }*/
       
        d= Math.floor(camera.x/tileSize)
        e = Math.floor(camera.y/tileSize) 
        
    //  player.updatey()

    level.render(-camera.x,-camera.y,d,e);
      player.render(playerX,playerY)
}


function updateCamera(playerX:number,playerY:number){
camera.x+= Math.floor((playerX - tileSize*5)/200)
if (camera.x > player.pos.x - tileSize*2){
    camera.x=player.pos.x - tileSize*2;
}
camera.y+= Math.floor((playerY - tileSize*5)/100)
if (camera.x > player.pos.x - tileSize*2){
    camera.x=player.pos.x - tileSize*2;
}

}

/**
 * Update the Y position of the player.
 *
 * @returns {number} players Y position.
 */
function updateY(){
        player.pos.y+=player.yvelocity;
    
    if (checkCollision(player.pos,'y',Math.sign(player.yvelocity))){
            const sign = Math.sign(player.yvelocity);
            player.pos.y-= player.pos.y%tileSize * Math.sign(player.yvelocity); 
            player.yvelocity=0;
            if(controller.keys.w && sign===1){
                player.yvelocity=-tileSize/3;
            }
        }
        else{
            player.yvelocity+=tileSize/64;
        }
        return player.pos.y
}

/**
 * Update the X position of the player.
 *
 * @returns {number} players X position.
 */
function updateX(){
 player.pos.x+=player.xvelocity;
           if (checkCollision(player.pos,'x',Math.sign(player.xvelocity))){
            player.pos.x-=player.xvelocity
            //player.pos.x%tileSize* Math.sign(player.xvelocity); //set the player x to the nearest empty tile.
            player.xvelocity=0
            
           }if(controller.keys.d){
                player.xvelocity+=tileSize/64;
            }
            if(controller.keys.a){
                player.xvelocity-=tileSize/64;
            }
           player.xvelocity*=0.9;
           return player.pos.x
}
function checkCollision(pos:{x:number,y:number},dir:'x'|'y'|'x1'|'y1',sign:number){
    function collide(x:number,y:number){
        try{
            if(gameMap[y][x]!='0'){
            return true;
        }else{
            return false;
        }}
        catch(error){
            return false;
        }}
    if(dir==='x'){
    if(sign===-1){
        return collide(Math.floor(pos.x/tileSize),Math.floor((pos.y)/tileSize))||
        collide(Math.floor((pos.x)/tileSize),Math.floor((pos.y+tileSize-1)/tileSize)) 

        }
        return collide(Math.floor((pos.x+tileSize-1)/tileSize),Math.floor((pos.y)/tileSize))||
        collide(Math.floor((pos.x+tileSize-1)/tileSize),Math.floor((pos.y+tileSize-1)/tileSize)) 

       

    }
    if(dir==='y'){
        if(sign===-1){
        return collide(Math.floor(pos.x/tileSize),Math.floor((pos.y)/tileSize))||
        collide(Math.floor((pos.x+tileSize-1)/tileSize),Math.floor((pos.y)/tileSize)) 

        }
        return collide(Math.floor(pos.x/tileSize),Math.floor((pos.y+tileSize-1)/tileSize))||
        collide(Math.floor((pos.x+tileSize-1)/tileSize),Math.floor((pos.y+tileSize-1)/tileSize)) 
    } 
}
        
//const camera = new Camera(CANVAS_WIDTH,CANVAS_HEIGHT);
function display(){
    console.log(player.pos.x,player.pos.y,player.pos.x+tileSize,player.pos.y+tileSize)
    let x = Math.floor(player.pos.x/tileSize);
    let y = Math.floor(player.pos.y/tileSize);
    console.log(x,y)
    console.log(gameMap[y][x])
    console.log(x*tileSize,y*tileSize)
    console.log(player.pos.y%tileSize,player.pos.x%tileSize)
    console.log("right:",checkCollision(player.pos,'x',1),"down:",checkCollision(player.pos,'y',1))
    console.log("left:",checkCollision(player.pos,'x',-1),"up:",checkCollision(player.pos,'y',-1))
    console.log("playerX: ",player.pos.x-camera.x)
    console.log("playerY: ",player.pos.y-camera.y)
    console.log("cameray: ",camera.y)
    console.log("cameraX: ",camera.x)

}