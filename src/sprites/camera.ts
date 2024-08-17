export class Camera{
    x:number;
    y:number;
    row:number;
    col:number;
    gridsize:number;
    private width:number;
    private height:number
    constructor(width:number,height:number,gridsize:number){
        this.x=0;
        this.y=0;
        this.row =0;
        this.col =0; 
        this.height=height;
        this.width=width;
        this.gridsize=gridsize;
    }
    update(deltax:number,deltay:number){
        this.x+=deltax;
        this.y+=deltay;
        this.row = Math.floor(this.y/this.gridsize);
        this.col = Math.floor(this.x/this.gridsize);
    }
}
