export class EventManager{
    listeners:{[key:string]:Function[]};
    keys:{[key:string]:boolean};
    constructor(){
        this.listeners ={};
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        }
        this.addEventListeners();
    }
    subscribe(eventName:string,callback:Function){
        if(!this.listeners[eventName]){
            this.listeners[eventName]=[];
        }
        this.listeners[eventName].push(callback);
    }
    unsubscribe(eventName:string,callback:Function){
        if(this.listeners[eventName]){
            this.listeners[eventName]=this.listeners[eventName].filter(listener=>listener!==callback);
        }
    }
    broadcast(eventName:string,data:string){
        if(this.listeners[eventName]){
            this.listeners[eventName].forEach(callback=>callback(data));
        }
    }
    addEventListeners() {
        window.addEventListener('keydown', e => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
                this.broadcast(e.key,e.key);
                 const intervalId = setInterval(() => {
        }, 100);
        window.addEventListener('keyup', (upevent) => {
            if (upevent.key == e.key) {
                this.keys[e.key] = false;
                this.broadcast(e.key,e.key);
                clearInterval(intervalId);
            }
        })
            }
            
        })
        
    }
}

export class Collisions{
    objectA:any;
    objectB:any;
    constructor(objectA:any,objectB:any){
        this.objectA=objectA;
        this.objectB=objectB;
    }
    checkCollision(){

       
        return (this.objectA.x+this.objectA.width>this.objectB.x ||
        this.objectA.x<this.objectB.x+this.objectB.width ||
        this.objectA.y+this.objectA.height<this.objectB.y ||
        this.objectA.y>this.objectB.y+this.objectB.height );
    }

}
