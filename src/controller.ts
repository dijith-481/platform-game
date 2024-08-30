import { EventManager } from "./sprites/eventlistener";

/**
 * Controller class to handle keyboard and touch input.
 */
export class Controller{
    eventManager:EventManager;
    keys:{[key:string]:boolean};
    reload:boolean=false;
    isTouch:boolean=true;
    ctx:CanvasRenderingContext2D;
    constructor(eventManager:EventManager,ctx:CanvasRenderingContext2D){
        this.keys={
            w:false,
            a:false,
            s:false,
            d:false,
            f:false,
            any:false
        }
        this.ctx=ctx;
        this.eventManager=eventManager;
        this.eventManager.subscribe("gameover",()=>{
          this.reload =true;
            
        })
        this.eventManager.subscribe("victory",()=>{
          this.reload =true;
            
        })
        this.addEventListeners();
    }


addEventListeners() {
const upButton = document.getElementById('up');
    const rightButton = document.getElementById('right');
    const leftButton = document.getElementById('left');
    const fullscreenButton = document.getElementById('fullscreen');
     const handleButton = (key: string, isDown: boolean) => {
    if (key == 'w' && isDown && this.reload) {
     location.reload()
    }
      if (key in this.keys) {

        this.keys[key] = isDown;
        this.keys['any'] = isDown;
      }
    };
    if ( 'ontouchstart' in window || navigator.maxTouchPoints > 0){
     
if (upButton){
        upButton.addEventListener('touchstart', () => handleButton.call(this, 'w', true));  
    upButton.addEventListener('touchend', () => handleButton.call(this, 'w', false));
        }
        if(rightButton){
    rightButton.addEventListener('touchstart', () => handleButton.call(this, 'd', true));
    rightButton.addEventListener('touchend', () => handleButton.call(this, 'd', false));
        }
        if(leftButton){
    leftButton.addEventListener('touchstart', () => handleButton.call(this, 'a', true));
    leftButton.addEventListener('touchend', () => handleButton.call(this, 'a', false));
        }
        if(fullscreenButton){
        fullscreenButton.addEventListener('touchstart', () => {
          this.eventManager.broadcast('fullscreen','fullscreen'); 
        });
    }
}
    else{
        if(upButton)
        upButton.style.display="none";
    if(rightButton)
        rightButton.style.display="none";
    if(leftButton)
        leftButton.style.display="none";
    
    if(fullscreenButton)
        fullscreenButton.style.display="none";
    }
        window.addEventListener('keydown', (e) => handleButton.call(this,e.key,true));
        window.addEventListener('keyup', (e) => handleButton.call(this,e.key,false));
        
    }


   
    }
