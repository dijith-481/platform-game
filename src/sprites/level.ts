export class Level {
    MAP_WIDTH = 100;
    MAP_HEIGHT = 100;
    x:number = 0;
    y:number = 0;
    width:number;
    height:number; 
    tiles: Tile[] = [];
    tileSize:number;
    ctx: CanvasRenderingContext2D;
    levelArray!:number[][];
    tileimages: HTMLImageElement[] = [];
    constructor(ctx: CanvasRenderingContext2D,width:number,height:number,levelPath:string) {
        this.width = width;
        this.height = height;
        this.tileSize = height/20;
        this.ctx =ctx;
        this.loadTileImages();
        this.loadLevel(levelPath);
        
        
    }
    loadTileImages() {
        const images =['../assets/grounds/1.png',
                        '../assets/grounds/2.png',
                        '../assets/grounds/3.png',
                        '../assets/grounds/4.png',
                        '../assets/grounds/5.png',
                        '../assets/grounds/6.png',
                        '../assets/grounds/7.png',
                        '../assets/grounds/8.png',
                        '../assets/grounds/9.png',
                        '../assets/grounds/10.png',
                        '../assets/grounds/11.png',
                        '../assets/grounds/12.png',
                        '../assets/grounds/13.png',
        ]
        for (let i = 0; i < images.length; i++) {
            const image = new Image();
            image.src = images[i];
            this.tileimages[i] = image;
        }
    }
            
     async loadLevel(levelPath: string) {
         try {
             const response = await fetch(levelPath);
             const levelData = await response.json();
            this.levelArray = Object.values(levelData)[0] as number[][];
            console.log(this.levelArray) 
        this.createTiles();
         } catch (error) {
             console.error("Error loading level:", error);
         }
     }
    createTiles(){
        for (let i = 0; i < this.levelArray.length; i++) {
            for (let j = 0; j < this.levelArray[i].length; j++) {
                if(this.levelArray[i][j]==0)continue;
                console.log(this.levelArray[i][j])
                const img = this.tileimages[this.levelArray[i][j]-1];
                const tile = new Tile(this.ctx,img,j,i,this.tileSize);
                this.tiles.push(tile);
            }
        }
    }
    update(deltax:number,deltay:number,camerax:number,cameray:number){
        this.tiles.forEach(tile => {
            tile.update(deltax,deltay,camerax,cameray);
        });
    }
    }

class Tile{
    x: number;
    y: number;
    width: number; 
    height: number; 
    ctx: CanvasRenderingContext2D;
    img:HTMLImageElement;
    constructor(ctx: CanvasRenderingContext2D,img:HTMLImageElement,x: number, y: number,tileSize:number){ 

        this.x = x*tileSize;
        this.y = y*tileSize;
        this.width = this.height = tileSize;
        this.ctx =ctx;
        this.img=img

    }
    update(deltax:number,deltay:number ,camerax:number,cameray:number){
        this.x+=deltax;
        this.y+=deltay;
        const rx =camerax-this.x;
        const ry =cameray-this.y;
            this.draw(rx,ry);
    }
    draw(x:number,y:number){
        this.ctx.drawImage(this.img,x,y,this.width,this.height);
    }
    }

