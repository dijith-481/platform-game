import { EventManager } from "./eventlistener";
export class Player {
  pos: { x: number; y: number } = { x: 0, y: 0 };
  renderpos: { x: number; y: number } = { x: 0, y: 0 };
  dir: number = 1;
  currentCostume!: { x: number; y: number; cols: number };
  costumes = {
    hurt: { x: 0, y: 2, cols: 4 },
    walk: { x: 0, y: 0, cols: 6 },
    jump: { x: 0, y: 1, cols: 8 },
    death: { x: 0, y: 3, cols: 8 },
    jumpdust: { x: 0, y: 5, cols: 6 },
    walkdust: { x: 0, y: 4, cols: 6 },
  };
  w: number;
  h: number;
  isHurt: boolean = false;
  isJumping: boolean = false;
  jumppos = { x: 0, y: 0 };
  jumpposScreen = { x: 0, y: 0 };
  walkdust: {
    x: number;
    y: number;
    timer: number;
    costumeNo: number;
    screenX: number;
    screenY: number;
  }[] = [];
  walkTimer: number = 0;
  jumpTimer: number = 0;
  isDying: boolean = false;
  deathTimer: number = 0;
  hurtTimer: number = 0;
  xvelocity: number = 0;
  yvelocity: number = 0;
  img: HTMLImageElement;
  private tileSize: number;
  private row: number;
  private col: number;
  private ctx: CanvasRenderingContext2D;
  eventManager: EventManager;
  constructor(
    eventManager: EventManager,
    ctx: CanvasRenderingContext2D,
    tileSize: number,
    row: number,
    col: number
  ) {
    this.pos.x = col * tileSize;
    this.pos.y = row * tileSize;
    this.tileSize = tileSize;
    this.w = (tileSize * 18) / 64;
    this.h = (tileSize * 48) / 64;
    this.row = row;
    this.col = col;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = "assets/player/player.png";
    this.eventManager = eventManager;
  }
  //render the player
  render(
    x: number,
    y: number,
    costumex: number,
    dir: number,
    cameraX: number,
    cameraY: number
  ) {
    this.dir = dir = dir ? dir : 1;
    this.ctx.save();
    this.renderpos.x = dir * (x + this.w / 2) - this.tileSize / 2;
    this.renderpos.y = y - this.tileSize + this.h;
    this.ctx.scale(dir, 1);
    this.costumes.walk.x = costumex;
    this.updatePlayerPos(cameraX, cameraY);
    this.ctx.drawImage(
      this.img,
      this.currentCostume.x * 32,
      this.currentCostume.y * 32,
      32,
      32,
      this.renderpos.x,
      this.renderpos.y,
      this.tileSize,
      this.tileSize
    );
    this.ctx.restore();
  }
  //update the player pos to render costumes correctly
  updatePlayerPos(cameraX: number, cameraY: number) {
    this.walkdust.forEach((dust) => {
      dust.screenX =
        this.dir * (dust.x - cameraX + this.w / 2) - this.tileSize / 2;
      dust.screenY = dust.y - cameraY - this.tileSize + this.h;
      this.ctx.drawImage(
        this.img,
        dust.costumeNo * 32,
        this.costumes.walkdust.y * 32,
        32,
        32,
        dust.screenX,
        dust.screenY,
        this.tileSize,
        this.tileSize
      );
      dust.timer++;
      dust.costumeNo = Math.floor(dust.timer / this.costumes.walkdust.cols*3);
      if (dust.timer > this.costumes.walkdust.cols*3  ) {
        this.walkdust.splice(this.walkdust.indexOf(dust), 1);
      }
    });
    if (this.isDying) {
      this.currentCostume = this.costumes.death;
      this.currentCostume.x = Math.floor(this.deathTimer / 4);
      this.currentCostume.x %= this.currentCostume.cols;
      if (this.deathTimer < this.currentCostume.cols * 4-1){
         this.deathTimer++;
                  setTimeout(() => {
           this.eventManager.broadcast("gameover", "gameover");
         }, 1000);
      } 

      
    
      
    }
     else if (this.isHurt) {
      this.currentCostume = this.costumes.hurt;
      this.currentCostume.x = Math.floor(this.hurtTimer / 2);
      this.hurtTimer++;
      this.currentCostume.x %= this.currentCostume.cols;
      if (this.hurtTimer > this.currentCostume.cols * 4) {
        this.hurtTimer = 0;
        this.isHurt = false;
      }
    } else if (this.yvelocity > (this.tileSize * 8) / 64) {
      this.currentCostume = this.costumes.jump;
      this.currentCostume.x = 6;
    } else if (this.isJumping) {
      this.currentCostume = this.costumes.jump;
      this.currentCostume.x = Math.floor(
        ((this.yvelocity + (this.tileSize * 20) / 64) * 6) /
          ((this.tileSize * 20) / 64)
      );
      this.jumpTimer++;
      this.currentCostume.x %= this.currentCostume.cols;
      this.costumes.jumpdust.x = Math.floor(this.jumpTimer / 8);
      this.ctx.drawImage(
        this.img,
        this.costumes.jumpdust.x * 32,
        this.costumes.jumpdust.y * 32,
        32,
        32,
        this.jumpposScreen.x,
        this.jumpposScreen.y,
        this.tileSize,
        this.tileSize
      );
    } else if (Math.round(this.xvelocity) != 0) {
       if(this.walkdust.length==0 || Math.abs(this.pos.x - this.walkdust[this.walkdust.length - 1].x)>=Math.abs(this.xvelocity)*4) {
        this.walkdust.push({
          x: this.pos.x,
          y: this.pos.y,
          timer: 0,
          costumeNo: 0,
          screenX: 0,
          screenY: 0,
        });
      } 

       

      this.walkTimer++;
      this.currentCostume = this.costumes.walk;
      this.currentCostume.x %= this.currentCostume.cols;
    } else {
      this.currentCostume = this.costumes.walk;
      this.currentCostume.x = 0;
    }
  }
}

