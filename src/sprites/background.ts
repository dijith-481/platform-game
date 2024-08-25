 class Background {
    img: HTMLImageElement;
    x: number;
    speed: number;
    imagesLoaded: number = 0;
    ctx:CanvasRenderingContext2D;
    constructor(src: string, speed: number,ctx:CanvasRenderingContext2D) {
        this.img = new Image();
        this.x = 0;
        this.speed = speed;
        this.ctx =ctx;
        this.img.src = src;

    }
    update() {
        const sw = this.img.width;
        const sh = this.img.height;
        const dw = sw* sw / sh;
        this.ctx.drawImage(this.img, 0, 0, sw, sh, this.x, 0, dw, sh);
        this.x -= this.speed;
        if (this.x < -dw / 2) {
            this.x = 0;
        }
    }
}

export class Backgrounds{
    backgrounds:Background[]=[];
    ctx:CanvasRenderingContext2D;
    constructor(ctx:CanvasRenderingContext2D){
        this.ctx=ctx;
        this.createBackground();
    }
    update(){
        this.backgrounds.forEach(background => {
            background.update();
        });
    }
createBackground(){
    this.backgrounds.push(new Background('../assets/backgrounds/02.png',1,this.ctx));
    //this.backgrounds.push(new Background('../assets/backgrounds/03.png',2,this.ctx));
    //this.backgrounds.push(new Background('../assets/backgrounds/04.png',3,this.ctx));
    //this.backgrounds.push(new Background('../assets/backgrounds/05.png',4,this.ctx));
    //this.backgrounds.push(new Background('../assets/backgrounds/06.png',5,this.ctx));
}
}
