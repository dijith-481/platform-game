export class Background {
    img: HTMLImageElement;
    src: string;
    x: number;
    speed: number;
    imagesLoaded: number = 0;
    ctx:CanvasRenderingContext2D;
    constructor(src: string, speed: number,ctx:CanvasRenderingContext2D) {
        this.img = new Image();
        this.src = src;
        this.x = 0;
        this.speed = speed;
        this.ctx =ctx;
        this.img.onload = () => {
            this.imagesLoaded++;
            if (this.imagesLoaded === 7) {
               // animate();
            }
        }

        this.img.src = this.src;

    }
    update() {
        const sw = this.img.width;
        const sh = this.img.height / 2;
        const dw = sw* sw / sh;
        this.ctx.drawImage(this.img, 0, sh, sw, sh, this.x, 0, dw, sh);
        this.x -= this.speed;
        if (this.x < -dw / 2) {
            this.x = 0;
        }
    }
}