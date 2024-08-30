import { Player } from "./sprites/player.js";
import { EventManager } from "./sprites/eventlistener.js";
import { Level } from "./sprites/level.js";
import { Camera } from "./sprites/camera.js";
import { Controller } from "./controller.js";


//asks to rotate screen if it is in portrait mode
if (window.innerHeight > window.innerWidth) {
  window.location.href = "rotate.html";
}
const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const eventManager = new EventManager();
const controller = new Controller(eventManager,ctx);


eventManager.subscribe("fullscreen", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
});

const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);
const tileSize = CANVAS_HEIGHT / 16;
const screenCols = Math.ceil(CANVAS_WIDTH / tileSize) + 1;
const screenRows = Math.ceil(CANVAS_HEIGHT / tileSize) + 1;


const gameMap = Array.from({ length: 32 }, () => Array(32 * 5).fill(0));
const camera = new Camera(0, 0);
const player = new Player(eventManager, ctx, tileSize, 24, 7);
const level = new Level(
  ctx,
  eventManager,
  "../levels/level1.json",
  gameMap,
  tileSize,
  0,
  0,
  screenCols,
  screenRows
);
let playerPosScreen={x:0,y:0};

/*
 *game constants
 */
const CAMERA_SMOOTHING = 50;
const CAMERA_OFFSET_X = 2; 
const cameraLookX = CANVAS_WIDTH / 3;
const cameraLookY = CANVAS_HEIGHT / 2;
const jumpSpeed = (tileSize * 20) / 64;
const friction = 0.9;
const gravity = tileSize / 64;
const xspeed = tileSize / 64;
const coinsToWin=100;

//game states and flags
let coinCount = 0;
let gameflag = true;
let life = 10;

let instructiontimer=600;



//start gameloop after loading level.
eventManager.subscribe("levelloaded", () => {
  requestAnimationFrame(gameloop);
});
eventManager.subscribe("gameover", () => {
  gameflag=false;
  eventManager.unsubscribe("gameover", gameover);
  
 gameover(); 

  
});
eventManager.subscribe("victory", () => {
  gameflag=false;
  eventManager.unsubscribe("victory", victory);
  victory();

});
/**
 * gameover screen
 */
function gameover(){
  ctx.fillStyle="#008080a0";
  ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  ctx.font="30px Arial";
  ctx.fillStyle="red";
  ctx.fillText("Game Over",CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2);
  (document.getElementById("up") as HTMLButtonElement).innerHTML="W"
  ctx.fillText("Press W to restart",CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+50);
  ctx.fillText("Score: "+coinCount,CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+100);
  
  
}
/**
 * victory screen
 */
function victory(){
  ctx.fillStyle="#a0facea0";
  ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  ctx.font="30px Arial";
  ctx.fillStyle="red";
  (document.getElementById("up") as HTMLButtonElement).innerHTML="W"
  ctx.fillText("You Won",CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2);
  ctx.fillText("Press w to restart",CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+50);
  ctx.fillText("Score: "+coinCount,CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+100);

  
}

let lasttime: number; //to calculate framerate

/**
 * gameloop function
 * @param {number} timestamp - The current timestamp.
 */
function gameloop(timestamp: number) {
  if (!lasttime) lasttime = timestamp;
    const deltatime = timestamp - lasttime;
  if (deltatime >= 1000 / 60) {
    lasttime = timestamp;
   
    if (player.isDying==false) {
       playerPosScreen = updatePlayerPos();
       updateCamera(playerPosScreen);
    }
    renderBg();
    if (controller.keys.f) {
      display();
    }
    if (instructiontimer>0){
    instructions() 
      instructiontimer--;
    }
    
    level.render(-camera.x, -camera.y, Math.floor(camera.x / tileSize),Math.floor(camera.y / tileSize));
    updatePlayerCostume();
    renderplayer(playerPosScreen);
    renderData();
  }
  if (gameflag) {
  requestAnimationFrame(gameloop);
}}
/**
 * render the background
 * with given color .
 *
 * @returns {void}
 */
function renderBg(){
    ctx.fillStyle = "#0080808f";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * update the player position by calling the updateX and updateY functions
 * returns the new position of the player.
 * @modifies player.pos.x - Updates the player's X position based on X velocity and collision
 * @modifies player.pos.y -Updates the player's Y position based on Y velocity and collision
 * @modifies player.xvelocity -Updates the player's X velocity based on friction and keypress
 * @modifies player.yvelocity -Updates the player's Y velocity based on gravity and keypress
 * @returns {{x: number, y: number}} players relative position to camera.
 */
function updatePlayerPos(){
  /**
     * Update the Y position of the player.
     * @modifies player.pos.y - Updates the player's Y position based on Y velocity and collision.
     * @modifies player.yvelocity - Updates the player's Y velocity based on gravity and keypress.
     * @returns {number} UPdated players Y position.
  */
  function updateY() {
    if (player.yvelocity>=tileSize*2/3)
      player.isDying = true;
    if (Math.abs(player.yvelocity) > 4 * gravity)
      player.pos.y += player.yvelocity;
    const sign = Math.sign(player.yvelocity);
    if (checkCollision(player.pos, "y", sign)) {
    if (player.yvelocity > (tileSize*25) / 64) 
      {player.isHurt = true;
        life-= Math.floor((2** (player.yvelocity/((tileSize*25)/64)))/2);
      }
      player.isJumping = false;
      if (life <= 0 ) player.isDying = true;
      if (sign === 1)
        player.pos.y = Math.ceil(player.pos.y / tileSize) * tileSize - player.h;
      else player.pos.y = Math.ceil(player.pos.y / tileSize) * tileSize;
      player.yvelocity = 0;
      if (controller.keys.w && sign === 1) {
        player.jumpTimer=0
       player.isJumping = true;
       player.jumppos.x = player.pos.x;
       player.jumppos.y = player.pos.y;
        player.yvelocity = -jumpSpeed;
      }
    } else {
      player.yvelocity += gravity;
    }
    return player.pos.y;
  }

  /**
   * Update the X position of the player.
   *@modifies player.pos.x - Updates the player's X position based on X velocity and collision.
   *@modifies player.xvelocity - Updates the player's X velocity based on friction and keypress.
   * @returns {number} players X position.
   */
  function updateX() {
    player.pos.x += player.xvelocity;
    const sign = Math.sign(player.xvelocity);
    if (checkCollision(player.pos, "x", sign)) {
      if (sign === 1)
        player.pos.x = Math.ceil(player.pos.x / tileSize) * tileSize - player.w;
      else player.pos.x = Math.ceil(player.pos.x / tileSize) * tileSize;
      player.xvelocity = 0;
    }
    if (controller.keys.d) {
      player.xvelocity += xspeed;
    }
    if (controller.keys.a) {
      player.xvelocity -= xspeed;
    }
    player.xvelocity *= friction;
    return player.pos.x;
  }
  return { 'x':updateX() - camera.x,'y':updateY() - camera.y };
}


/**
 * Updates the camera position to follow the player, with smoothing and 
 * boundary checks to ensure the player remains within the visible area.
 * The camera's position is adjusted based on the player's position 
 * relative to the center and edges of the canvas.
 *
 * @param {object} playerPosition - The current position of the player.
 * @param {number} playerPosition.x - The x-coordinate of the player.
 * @param {number} playerPosition.y - The y-coordinate of the player.
 * @modifies camera - Updates the camera object's x and y properties.
 */
function updateCamera(pos: { x: number; y: number }) {
  camera.x += Math.floor((pos.x - cameraLookX) / CAMERA_SMOOTHING);
  camera.y += Math.floor((pos.y - cameraLookY) / CAMERA_SMOOTHING);
  if (camera.x > player.pos.x - tileSize * CAMERA_OFFSET_X) {
    camera.x = player.pos.x - tileSize * CAMERA_OFFSET_X;
  } else if (pos.x > CANVAS_WIDTH - tileSize*CAMERA_OFFSET_X) {
    camera.x += pos.x - (CANVAS_WIDTH - tileSize*CAMERA_OFFSET_X);
  }
}


/**
 * Renders the player sprite on the canvas.
 *
 * @param {number} x - The x-coordinate of the player's position.
 * @param {number} y - The y-coordinate of the player's position.
 * @modifies ctx - Updates the canvas context with the player sprite.
 */
function renderplayer(pos: { x: number; y: number }) {
  //update
  let dir = Math.sign(player.xvelocity);
    player.render(pos.x, pos.y, Math.floor(player.pos.x/4), dir,camera.x,camera.y);
}

/**
 * Renders the game data on the canvas.
 *
 * @modifies ctx - Updates the canvas context with the game data.
 */
function renderData() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(10, 10, 10 * 5, 10);
  level.tiles.get('#')?.render(CANVAS_WIDTH/2,10,0)
  ctx.font = "15px Arial";
  ctx.fillText(coinCount.toString(), CANVAS_WIDTH/2+25, 22);
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(10, 10, 10 * life/2, 10);
}

/*
 *updates playerJump costume While Jumping.
 *
 */
function updatePlayerCostume(){
 player.jumpposScreen.x=player.dir*(player.jumppos.x-camera.x+player.w/2)-tileSize/2;
        player.jumpposScreen.y=player.jumppos.y-camera.y-tileSize+player.h;
}



/*
 * Checks if a character is a alphabet letter.
 *
 * @param char - The character to check.
 * @returns True if the character is a alphabet letter, false otherwise.
 */
function isalphabet(char: string) {
  return char >= "A" && char <= "z";
}

/*
 * Checks if the tiles occupied by the player are empty or not.
 *
 * @param pos - The position of the player.
 * @param dir - The direction of movement ('x' or 'y')
 * @param sign - The sign of the movement (-1 or 1).
 * @returns True if a collision occurs, false otherwise.
 */
function checkCollision(
  pos: { x: number; y: number },
  dir: "x" | "y",
  sign: number
) {
  function collide(x: number, y: number) {
    try {
      if (gameMap[y][x] == "#") {
        checkcollected(x, y);
      }
      return isalphabet(gameMap[y][x]);
    } catch {
      return false;
    }
  }
  if (dir === "x") {
    if (sign === -1) {
      // checks topleft and bottomleft
      return (
        collide(Math.floor(pos.x / tileSize), Math.floor(pos.y / tileSize)) ||
        collide(
          Math.floor(pos.x / tileSize),
          Math.floor((pos.y + player.h - 1) / tileSize)
        )
      );
    }
    //checks topright and bottomright
    return (
      collide(
        Math.floor((pos.x + player.w - 1) / tileSize),
        Math.floor(pos.y / tileSize)
      ) ||
      collide(
        Math.floor((pos.x + player.w - 1) / tileSize),
        Math.floor((pos.y + player.h - 1) / tileSize)
      )
    );
  }
  if (dir === "y") {
    if (sign === -1) {
      //checks topleft and topright
      return (
        collide(Math.floor(pos.x / tileSize), Math.floor(pos.y / tileSize)) ||
        collide(
          Math.floor((pos.x + player.w - 1) / tileSize),
          Math.floor(pos.y / tileSize)
        )
      );
    }
    //checks bottomleft and bottomright
    return (
      collide(
        Math.floor(pos.x / tileSize),
        Math.floor((pos.y + player.h - 1) / tileSize)
      ) ||
      collide(
        Math.floor((pos.x + player.w - 1) / tileSize),
        Math.floor((pos.y + player.h - 1) / tileSize)
      )
    );
  }
}
/*
 * check if player collected coin.
 *
 * @param x - The x-coordinate of the coin.
 * @param y - The y-coordinate of the coin.
 * @modifies coinCount - Updates the coin count.
 */
function checkcollected(x: number, y: number) {
  if (
    player.pos.x >= x * tileSize - player.w &&
    player.pos.x <= x * tileSize + tileSize / 3 &&
    player.pos.y >= y * tileSize - player.h &&
    player.pos.y <= y * tileSize + tileSize / 3
  ) {
    coinCount++;
    if (coinCount>=coinsToWin){
      setTimeout(() => {
        eventManager.broadcast('victory','victory')
      }, 1000);
    }
    gameMap[y][x] = "0";
  }
}

function instructions(){
  ctx.font="20px Arial";
  ctx.fillStyle="white";
  ctx.textAlign="center";
  ctx.fillText("Use WAD to move Collect atleast 100 coins to win",CANVAS_WIDTH/2,CANVAS_HEIGHT/4)
}

/*
 * just a function to display the player position in the console.
 */
function display() {
  console.log(
    player.pos.x,
    player.pos.y,
    player.pos.x + tileSize,
    player.pos.y + tileSize
  );
  let x = Math.floor(player.pos.x / tileSize);
  let y = Math.floor(player.pos.y / tileSize);
  console.log(x, y);
  console.log(gameMap[y][x]);
  console.log(x * tileSize, y * tileSize);
  console.log(player.pos.y % tileSize, player.pos.x % tileSize);
  console.log(
    "right:",
    checkCollision(player.pos, "x", 1),
    "down:",
    checkCollision(player.pos, "y", 1)
  );
  console.log(
    "left:",
    checkCollision(player.pos, "x", -1),
    "up:",
    checkCollision(player.pos, "y", -1)
  );
  console.log("playerX: ", player.pos.x - camera.x);
  console.log("playerY: ", player.pos.y - camera.y);
  console.log("cameray: ", camera.y);
  console.log("cameraX: ", camera.x);
  console.log(
    x * tileSize,
    x * tileSize + tileSize / 4,
    player.pos.y,
    y * tileSize,
    y * tileSize + tileSize / 4
  );
}

