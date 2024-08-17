import { EventManager } from "./eventlistener";
export class Player {
    x: number;
    y: number;
    private xvelocity:number=0;
    private yvelocity:number=0;
    private tileSize:number;
    private row:number;
    private col:number;
    private ctx:CanvasRenderingContext2D;
    eventManager:EventManager;
    keyPressed:{[key:string]:boolean}
    constructor(eventManager:EventManager,ctx:CanvasRenderingContext2D,tileSize:number,row:number,col:number){
        this.x =  col*tileSize;
        this.y = row*tileSize;
        this.tileSize = tileSize;
        this.row = row;
        this.col = col;
        this.ctx = ctx;
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
    private Collide(){
        return(this.eventManager.checkCollision(this.col,this.row)||
        this.eventManager.checkCollision(Math.floor((this.x+this.tileSize)/this.tileSize),Math.floor(this.y/this.tileSize))||
        this.eventManager.checkCollision(Math.floor(this.x/this.tileSize),Math.floor((this.y+this.tileSize)/this.tileSize))||
        this.eventManager.checkCollision(Math.floor((this.x+this.tileSize)/this.tileSize),Math.floor((this.y+this.tileSize)/this.tileSize))
        );
    }

   private updatey(){ 
    this.y+=this.yvelocity;
     
     if (this.Collide()){
      this.y-=this.yvelocity;
        this.yvelocity=0;
       if(this.keyPressed.w){
            this.yvelocity=-4;
        }
    }
    else{
        this.yvelocity+=0.2;
    }
    

    

    
} 
       
    private updatex(){
           this.x+=this.xvelocity;
           if (this.Collide()){
            this.x-=this.xvelocity;
            this.xvelocity=0;
            
           }if(this.keyPressed.d){
                this.xvelocity+=1;
            }
            if(this.keyPressed.a){
                this.xvelocity-=1;
            }
           this.xvelocity*=0.9;
    }
    update() {
        this.updatey();
        this.updatex();
        this.col = Math.floor(this.x/this.tileSize)
    this.row = Math.floor(this.y/this.tileSize)
    }

    render(){
        this.update();
        this.draw();
    }
    draw(){
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x,this.y,this.tileSize,this.tileSize);
    }
   
}


class PlayerMovement{

}