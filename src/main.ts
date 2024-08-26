import { Player } from "./sprites/player.js";
import { EventManager } from "./sprites/eventlistener.js";
import { Level } from "./sprites/level.js";
import { Camera } from "./sprites/camera.js";
import { Controller } from "./controller.js";
import { Backgrounds } from "./sprites/background.js"


const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
const controller = new Controller();
const tileSize = CANVAS_HEIGHT / 16
const screenCols = Math.ceil(CANVAS_WIDTH / tileSize)+1;
const screenRows = Math.ceil(CANVAS_HEIGHT / tileSize)+1;
const rows = 32;
const cols = 32;
const gameMap = Array.from({ length: rows }, () => Array(cols * 2).fill(0));
const eventManager = new EventManager(gameMap);
const camera = new Camera(0,0);
const player = new Player(eventManager, ctx, tileSize, 2, 7);
const level = new Level(ctx, eventManager, '../levels/level1.json', gameMap, tileSize, 0, 0, screenCols, screenRows)
const jumpSpeed= tileSize*20/64
const friction =0.9;
const gravity = tileSize/64
const xspeed =tileSize / 64;

let jumpflag =false

eventManager.subscribe('levelloaded', () => {
   requestAnimationFrame(animatelevel); 
})
let gameflag =true;
let life = 5;
let lasttime: number;
function animatelevel(timestamp: number) {
    if (!lasttime) lasttime = timestamp; 
    const deltatime = timestamp - lasttime;
    if (deltatime>=1000/60){
         lasttime = timestamp;
    if (gameflag == false) {
        return;
    }
    ctx.fillStyle = "#0080808f";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameloop();
}
    requestAnimationFrame(animatelevel);
}


function gameloop() {
    let d = 0;
    let e = 0;
    if (controller.keys.f) {
        display();
    }
    let playerY = updateY() - camera.y;
    let playerX = updateX() - camera.x;
    updateCamera(playerX, playerY)
    d = Math.floor(camera.x / tileSize)
    e = Math.floor(camera.y / tileSize)
    level.render(-camera.x, -camera.y, d, e);
    renderplayer(playerX,playerY)
    drawlife()
}

function renderplayer(x:number,y:number){
let jump = Math.floor((player.yvelocity+jumpSpeed)/jumpSpeed*3);
let dir = Math.sign(player.xvelocity)
if (jumpflag){

     player.img.src = 'assets/player/jump.png';
    player.render(x,y,jump+1,dir)
   
 } 
 else{
    let walk = Math.floor(player.pos.x/8)
    walk%=6
    player.img.src = 'assets/player/walk.png';
    player.render(x,y,walk,dir)
 }}


function drawlife(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 10, 10*5, 10);
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(10, 10, 10*life, 10);
}

function updateCamera(playerX: number, playerY: number) {
    camera.x += Math.floor((playerX - CANVAS_WIDTH / 3) / 50)
    camera.y += Math.floor((playerY - CANVAS_HEIGHT / 2) / 50)
    if (camera.x > player.pos.x - tileSize * 2) {
        camera.x = player.pos.x - tileSize * 2;
    }
    else if (playerX > CANVAS_WIDTH * 5 / 6) {
        camera.x += playerX - CANVAS_WIDTH * 5 / 6
    }
}


/**
 * Update the Y position of the player.
 *
 * @returns {number} players Y position.
 */
function updateY() {
    let flag =true
    if (player.yvelocity >tileSize*28/64)
        flag = false
    if (Math.abs(player.yvelocity)> 4*gravity)
    player.pos.y += player.yvelocity;
        const sign = Math.sign(player.yvelocity);
    if (checkCollision(player.pos, 'y', sign)) {
        if (flag == false){
            life-= player.yvelocity/(tileSize*28/64);
            
            console.log(life,tileSize*28/64)
        }jumpflag=false
        if (life <= 0)
            gameflag = false
        if (sign === 1)
             player.pos.y = Math.ceil(player.pos.y / tileSize) * tileSize - player.h 
        else
             player.pos.y = Math.ceil(player.pos.y / tileSize) * tileSize  
        player.yvelocity = 0;
        if (controller.keys.w && sign === 1) {
            jumpflag =true
            player.yvelocity = -jumpSpeed 
        }
    }
    else {
        player.yvelocity +=gravity;
    }
    return player.pos.y
}

/**
 * Update the X position of the player.
 *
 * @returns {number} players X position.
 */
function updateX() {
    player.pos.x += player.xvelocity;
    const sign =Math.sign(player.xvelocity)
    if (checkCollision(player.pos, 'x', sign)) { 
        if (sign === 1) 
            player.pos.x = Math.ceil((player.pos.x) / tileSize) * tileSize -player.w
        else 
        player.pos.x = Math.ceil(player.pos.x/tileSize)* tileSize  
        player.xvelocity = 0

    } if (controller.keys.d) {
        player.xvelocity +=xspeed 
    }
    if (controller.keys.a) {
        player.xvelocity -= xspeed 
    }
    player.xvelocity *= friction;
    return player.pos.x
}


function isLower(char: string) {
    return char >= 'a' && char <= 'z';
}


/*
 * Checks if the tiles occupied by the player are empty or not.
 *
 * @param pos - The position of the player.
 * @param dir - The direction of movement ('x' or 'y')
 * @param sign - The sign of the movement (-1 or 1).
 * @returns True if a collision occurs, false otherwise.
 */
function checkCollision(pos: { x: number, y: number }, dir: 'x' | 'y' , sign: number) {
    function collide(x: number, y: number) {
       try{
        if(gameMap[y][x]=='#'){
            checkcollected(x,y)
        }
        return isLower(gameMap[y][x]);
    } catch {
        return false;
    }
    }
    if (dir === 'x') {
        if (sign === -1) {
            // checks topleft and bottomleft
            return collide(Math.floor((pos.x) / tileSize), Math.floor((pos.y) / tileSize)) ||
                collide(Math.floor((pos.x) / tileSize), Math.floor((pos.y+player.h-1) / tileSize))
        }
        //checks topright and bottomright
        return collide(Math.floor((pos.x+player.w-1) / tileSize), Math.floor((pos.y) / tileSize)) ||
            collide(Math.floor((pos.x+player.w-1) / tileSize), Math.floor((pos.y+player.h-1) / tileSize))
    }
    if (dir === 'y') {
        if (sign === -1) {
            //checks topleft and topright
            return collide(Math.floor((pos.x) / tileSize), Math.floor((pos.y) / tileSize)) ||
                collide(Math.floor((pos.x+player.w-1) / tileSize), Math.floor((pos.y) / tileSize))
        }
        //checks bottomleft and bottomright
        return collide(Math.floor((pos.x) / tileSize), Math.floor((pos.y+player.h-1) / tileSize)) ||
            collide(Math.floor((pos.x+player.w-1) / tileSize), Math.floor((pos.y+player.h-1) / tileSize))
    }
}


function checkcollected(x:number,y:number){
    if ((player.pos.x >= x * tileSize - player.w &&
        player.pos.x <= x  * tileSize+tileSize/4 &&
        player.pos.y >= y * tileSize-player.h &&
        player.pos.y <= y* tileSize+tileSize/4)
       )
        gameMap[y][x] = '0';
}

function display() {
    console.log(player.pos.x, player.pos.y, player.pos.x + tileSize, player.pos.y + tileSize)
    let x = Math.floor(player.pos.x / tileSize);
    let y = Math.floor(player.pos.y / tileSize);
    console.log(x, y)
    console.log(gameMap[y][x])
    console.log(x * tileSize, y * tileSize)
    console.log(player.pos.y % tileSize, player.pos.x % tileSize)
    console.log("right:", checkCollision(player.pos, 'x', 1), "down:", checkCollision(player.pos, 'y', 1))
    console.log("left:", checkCollision(player.pos, 'x', -1), "up:", checkCollision(player.pos, 'y', -1))
    console.log("playerX: ", player.pos.x - camera.x)
    console.log("playerY: ", player.pos.y - camera.y)
    console.log("cameray: ", camera.y)
    console.log("cameraX: ", camera.x)
    console.log(  x * tileSize , x  * tileSize+tileSize/4 , player.pos.y , y * tileSize ,y* tileSize+tileSize/4)
}