export class Level {
    x:number = 0;
    y:number = 0;
    platforms : Platform[]=[];
    tileSize:number;
    ctx: CanvasRenderingContext2D;
    camera:{x:number,y:number,w:number,h:number};
    levelArray!:{ id :number ,type: string, x: number, y: number, w: number, h: number }[];
    platformArray:{ id:number, type: string, x: number, y: number, w: number, h: number }[]=[];
    private id:number=0;
    constructor(ctx: CanvasRenderingContext2D,levelPath:string,tileSize:number,camera:{x:number,y:number,w:number,h:number}) {
        this.tileSize = tileSize;
        this.ctx =ctx;
        this.camera = camera;
        this.loadLevel(levelPath);
        
        
    }
    
            
     async loadLevel(levelPath: string) {
         try {
             const response = await fetch(levelPath);
             const levelData = await response.json();
            this.levelArray = Object.values(levelData)[0] as  { id :number ,type: string, x: number, y: number, w: number, h: number }[];
            this.levelArray = this.levelArray.map((element: { id: number; type: string; x: number; y: number; w: number; h: number }, index: number) => ({
        ...element, 
        id: index   
    }));
            console.log(this.levelArray) 
            this.createPlatforms();
         } catch (error) {
             console.error("Error loading level:", error);
         }
     }
    createPlatforms(){
        this.levelArray.forEach(platform =>{
                if (platform.x >= this.camera.x && platform.x <= this.camera.x + this.camera.w
                    && platform.y >= this.camera.y && platform.y <= this.camera.y + this.camera.h
                ) {
                    this.platforms.push(new Platform(this.ctx,this.tileSize,platform))
                    platform.id=this.id;
                    this.platformArray.push(platform);
                }
            })
    
        }
    deletePlatforms(){
        this.platformArray.forEach(platform =>{
            if (!(platform.x >= this.camera.x && platform.x <= this.camera.x + this.camera.w
                && platform.y >= this.camera.y && platform.y <= this.camera.y + this.camera.h)
            )
                 {
                   this.levelArray.splice(this.levelArray.indexOf(platform),1);
                 
                    this.platforms.push(new Platform(this.ctx,this.tileSize,platform))
                    this.platformArray.push(platform);
                }
            })
    

    }
    
    update(deltax:number,deltay:number,camerax:number,cameray:number){
       
    }
    }

class Tile{
    x: number;
    y: number;
    width: number; 
    height: number; 
    ctx: CanvasRenderingContext2D;
    img!:HTMLImageElement;
    tile:{
        x:number,
        y:number,
        s:number,
    }
    constructor(ctx: CanvasRenderingContext2D,x: number, y: number,tileSize:number,tile: {
        x:number,
        y:number,
        s:number
    }){ 

        this.x = x*tileSize;
        this.y = y*tileSize;
        this.width = this.height = tileSize;
        this.ctx =ctx;
        this.draw(this.x,0);
        this.tile =tile;
        this.loadTileSet();

    }
    loadTileSet() {
         this.img = new Image();
        this.img.src ='../assets/grounds/ground.png'
    }
    update(deltax:number,deltay:number ,camerax:number,cameray:number){
        this.x+=deltax;
        this.y+=deltay;
        const rx = this.x-camerax
        const ry = this.y-cameray
            this.draw(rx,ry);
    }
    draw(x:number,y:number){
        this.ctx.drawImage(this.img,this.tile.x,this.tile.y,this.tile.s,this.tile.s,x,y,this.width,this.height);
    }
    }
class Platform{
    x:number;
    y:number;
    tiles:Tile[]=[];
    tileSize:number;
    width:number;
    height:number;
    ctx:CanvasRenderingContext2D;
    tileimages =[
        {
            x:0,
            y:0,
            s:32,
        },
        {
            x:32,
            y:0,
            s:32,
        },
        {
            x:64,
            y:0,
            s:32,
        },
        {
            x:0,
            y:32,
            s:32,
        },
       
    ]
    constructor(ctx:CanvasRenderingContext2D,tileSize:number,tiledata:{id:number,type:string,x:number,y:number,w:number,h:number}){
        this.tileSize=tileSize;
        this.x= tiledata.x * this.tileSize;
        this.y= tiledata.y * this.tileSize;
        this.width=tiledata.w  ;
        this.height=tiledata.h;
        this.ctx=ctx;
        this.createLeftTopPlatform();
        this.createTopPlatform(this.width-2);

    }

    createLeftTopPlatform(){
       const tileImg ={
           x:0,
           y:0,
           s:32,
       } 
        this.tiles.push(new Tile(this.ctx,this.x,this.y,this.tileSize,tileImg));
    } 
    createTopPlatform(width:number){
       const tileImg ={
           x:32,
           y:0,
           s:32,
       } 
        this.tiles.push(new Tile(this.ctx,this.x,this.y,this.tileSize,tileImg));
    }
   
}
