export class Controller{
    keys:{[key:string]:boolean};
    constructor(){
        this.keys={
            w:false,
            a:false,
            s:false,
            d:false,
            f:false,
            any:false
        }
        this.addEventListeners();
    }
addEventListeners() {
        window.addEventListener('keydown', e => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
                this.keys['any'] =true
        window.addEventListener('keyup', (upevent) => {
            if (upevent.key == e.key) {
                this.keys[e.key] = false;
                this.keys['any'] =false;
            }
        })
            }
            
        })
        
    }
}
