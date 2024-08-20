import { EventManager } from "./eventlistener";
export class Player {
   pos:{x:number,y:number}={x:0,y:0};
    x!:number;
    y!:number; 
    xvelocity:number=0;
    yvelocity:number=0;
    private tileSize:number;
    private row:number;
    private col:number;
    private ctx:CanvasRenderingContext2D;
    eventManager:EventManager;
    keyPressed:{[key:string]:boolean}
    constructor(eventManager:EventManager,ctx:CanvasRenderingContext2D,tileSize:number,row:number,col:number){
        this.pos.x =  col*tileSize;
        this.pos.y = row*tileSize;
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
    this.keyPressed[eventdata]=true;
        
    }
  private handleKeyUp(eventdata:string){
    this.keyPressed[eventdata]=false;
        
    }
    private Collide(){
        return(this.eventManager.checkCollision(this.pos,this.tileSize)
        );
    }

    
    
    render(x:number,y:number){
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x,y,this.tileSize,this.tileSize);
    }

    updatey(){ 
    this.pos.y+=this.yvelocity;
     if (this.Collide()){
      this.pos.y-=this.yvelocity;
        this.yvelocity=0;
       if(this.keyPressed.w){
            this.yvelocity=-8;
        }
    }
    else{
        this.yvelocity+=0.4;
    }
    

    

    
} 
       
     updatex(){
           this.pos.x+=this.xvelocity;
           if (this.Collide()){
            this.pos.x-=this.xvelocity;
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
        this.col = Math.floor(this.pos.x/this.tileSize)
    this.row = Math.floor(this.pos.y/this.tileSize)
    }

    render1(){
        this.update();
        this.draw();
    }
    draw(){
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.pos.x,this.pos.y,this.tileSize,this.tileSize);
    }
   
}


class PlayerMovement{

}