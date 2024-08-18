export class Camera{
    x:number =0;
    y:number=0;
    update(deltax:number,deltay:number){
        this.x-=deltax;
        this.y=deltay;
    }
}
