export class Camera{
    x:number;
    y:number;
    constructor(x:number,y:number){
        this.x=x;
        this.y=y;
    }
    update(deltax:number,deltay:number){
        this.x-=deltax;
        this.y=deltay;
    }
}
