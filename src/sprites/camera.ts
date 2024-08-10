export class Camera{
    x:number;
    y:number;
    x1:number;
    y1:number;
    private width:number;
    private height:number
    constructor(width:number,height:number){
        this.x=0;
        this.y=0;
        this.x1=width;
        this.y1=height;
        this.height=height;
        this.width=width;
    }
    update(deltax:number,deltay:number){
        this.x+=deltax;
        this.y+=deltay;
        this.x1 = this.x+this.width;
        this.y1 = this.y+this.height;
    }
}
