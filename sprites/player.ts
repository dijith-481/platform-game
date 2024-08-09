import { EventManager } from "./eventlistener";
export class Player {
    x: number;
    y: number;
    playerSpeed:number;
    private xvelocity:number=0;
    private yvelocity:number=0;
    private playerxvelocity:number=0;
    private endPos:number;
    private startPos:number; 
    private playerMovementArea:number
     width:number=100;
    height:number=100
    eventManager:EventManager;
    constructor(eventManager:EventManager,canvasWidth:number){
        this.x =  0;
        this.y = 400;
        this.playerSpeed =0;    
        this.endPos=canvasWidth*4/8;
        this.startPos=canvasWidth/16;
        this.playerMovementArea=this.endPos-this.startPos;
        this.eventManager = eventManager;

        this.eventManager.subscribe('w',this.handleMovementUp.bind(this));
        this.eventManager.subscribe('s',this.handleMovementDown.bind(this));
        this.eventManager.subscribe('a',this.handleMovementLeft.bind(this));
        this.eventManager.subscribe('d',this.handleMovementRight.bind(this));
    }
    private handleMovementUp(){
       this.yvelocity = -25;
       
    }
   private handleMovementDown(){
        
    }
   private handleMovementLeft(){
        
    }
   private handleMovementRight(){
        
    }
   private updatey(){
    
    this.y+=this.yvelocity;
    this.yvelocity*=0.99;
   } 
       
    private updatex(){
           const playermovedis = (this.x-this.startPos)/this.playerMovementArea
           const sin = Math.sin(playermovedis*Math.PI/2)
           const cos = Math.cos(playermovedis*Math.PI/2)/2
         this.playerSpeed =    this.playerxvelocity*cos;
         const drag =0.995;
         this.xvelocity*=drag
         this.playerxvelocity*=0.9*drag
        console.log(this.xvelocity)
    }
    update() {
        this.updatex();
    }
   
}


class PlayerMovement{

}