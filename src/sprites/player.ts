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
    keyPressed:{[key:string]:boolean}
    constructor(eventManager:EventManager,canvasWidth:number){
        this.x =  0;
        this.y = 400;
        this.playerSpeed =0;    
        this.endPos=canvasWidth*4/8;
        this.startPos=canvasWidth/16;
        this.playerMovementArea=this.endPos-this.startPos;
        this.eventManager = eventManager;
        this.keyPressed={
            a:false,
            s:false,
            w:false,
            d:false
        }
        this.addEventListeners();
    }
    private addEventListeners(){

        this.eventManager.subscribe('keyup',(eventdata:string)=>{
                this.handleKeyUp(eventdata)});
        this.eventManager.subscribe('keydown',(eventdata:string)=>{
                this.handleKeyDown(eventdata)});
    }
 
   private handleKeyDown(eventdata:string){
    console.log(eventdata)
    this.keyPressed[eventdata]=true;
        
    }
  private handleKeyUp(eventdata:string){
    console.log(eventdata)
    this.keyPressed[eventdata]=false;
        
    }

   private updatey(){
    
    this.y+=this.yvelocity;
    
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