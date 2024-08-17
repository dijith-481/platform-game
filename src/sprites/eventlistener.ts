export class EventManager{
    map:string[][]
    listeners:{[key:string]:Function[]};
    keys:{[key:string]:boolean};
    constructor(map:string[][]){
        this.listeners ={};
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        }
       this.map =map;
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
                this.broadcast('keydown',e.key);
                 const intervalId = setInterval(() => {
        }, 100);
        window.addEventListener('keyup', (upevent) => {
            if (upevent.key == e.key) {
                this.keys[e.key] = false;
                this.broadcast('keyup',e.key);
                clearInterval(intervalId);
            }
        })
            }
            
        })
        
    }
    checkCollision(x:number,y:number){
        try{
            if(this.map[y][x]){
            return true;
        }else{
            return false;
        }}
        catch(error){
            return false;
        }}
        
       
    }



