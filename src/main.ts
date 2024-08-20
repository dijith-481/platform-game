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
const player = new Player(eventManager,ctx,tileSize,3,6);
const level = new Level(ctx,eventManager,'../levels/level1.json',gameMap,tileSize,0,0,screenCols,screenRows)


eventManager.subscribe('levelloaded',()=>{
    animatelevel();
})

function animatelevel(){
    ctx.fillStyle = "#ffffff3f";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    gameloop();
    requestAnimationFrame(animatelevel);
}
function gameloop(){
    let d =0
    if (controller.keys.f){
        display();
    }
    let playerY =  updateY()- camera.y;
    
    let playerX =updateX()-camera.x; 
    if(playerX>CANVAS_WIDTH-tileSize*8){
         camera.x+=playerX-CANVAS_WIDTH+tileSize*8;
    }
    if(playerX<tileSize*3){
        camera.x+=playerX-tileSize*3;
    }
       
        d= Math.floor(camera.x/tileSize)
     
    //  player.updatey()

    level.render(-camera.x,0,d,0);
      player.render(playerX,playerY)
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
                player.yvelocity=-12;
            }
        }
        else{
            player.yvelocity+=0.4;
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
                player.xvelocity+=1;
            }
            if(controller.keys.a){
                player.xvelocity-=1;
            }
           player.xvelocity*=0.95;
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

}