/*
 *eventManager to handle game events and broadcast it.
 *
 */
export class EventManager{
    
    listeners:{[key:string]:Function[]};
    constructor(){
        this.listeners ={};
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
   
    
        
       
    }



