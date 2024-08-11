export class Level {
    x:number = 0;
    y:number = 0;
    platforms : {[key:number]:Platform}={};
    tileSize:number;
    ctx: CanvasRenderingContext2D;
    camera:{x:number,y:number,w:number,h:number};
    levelArray!:{id:number,type:string,  x: number, y: number, w: number, h: number }[];
    platformArray:{ id:number, type: string, x: number, y: number, w: number, h: number }[]=[];
    
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
                    this.platforms[platform.id] = (new Platform(this.ctx,this.tileSize,platform))
                    this.platformArray.push(platform);
                    this.levelArray.splice(this.levelArray.indexOf(platform),1);
                }
            })
    
        }
    deletePlatforms(){
      Object.entries(this.platforms).forEach(([key,platform]) => {
        const numberKey = parseInt(key, 10); 
        if (platform.x < this.camera.x || platform.x > this.camera.x + this.camera.w
          || platform.y < this.camera.y || platform.y > this.camera.y + this.camera.h
          ){
            const index = this.platformArray.findIndex(element => element.id === numberKey);
           
            this.levelArray.push(this.platformArray[index]);
            this.platformArray.splice(index,1)
            delete this.platforms[numberKey];
          }
        
    }) 
    

    }
    
    update(deltax:number,deltay:number,camerax:number,cameray:number){
        Object.values(this.platforms).forEach(platform => {
            platform.update(deltax,deltay,camerax,cameray);
        })
    }
    }

class Tile{
    x: number;
    y: number;
    width: number; 
    height: number; 
    ctx: CanvasRenderingContext2D;

    img!:HTMLImageElement;
    tile ={
        x:0,
        y:0,
        s:32,
    }
    constructor(ctx: CanvasRenderingContext2D,x: number, y: number,tileSize:number,imgSize:number,tile: {
        x:number,
        y:number, 
    }){ 

        this.x = x*tileSize;
        this.y = y*tileSize;
        this.width = this.height = tileSize;
        this.ctx =ctx;
         
        this.tile.x=tile.x;
        this.tile.y=tile.y;
        this.tile.s=imgSize;

        this.loadTileSet();
        this.draw(this.x,0);

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
    imgSize = 32;
    tileImg ={
        lt :{x:0,y:0},
        t :{x:32,y:0},
        rt :{x:64,y:0},
        lm :{x:0,y:32},
        m :{x:32,y:32},
        rm :{x:64,y:32},
        lb :{x:0,y:64},
        b :{x:32,y:64},
        rb :{x:64,y:64},
    }
    constructor(ctx:CanvasRenderingContext2D,tileSize:number,tiledata:{id:number,type:string,x:number,y:number,w:number,h:number}){
        this.tileSize=tileSize;
        this.x= tiledata.x * this.tileSize;
        this.y= tiledata.y * this.tileSize;
        this.width=tiledata.w  ;
        this.height=tiledata.h;
        this.ctx=ctx;
        
        this.createPlatform();
       

    }

    createPlatform(){
        let x=this.x
        let y = this.y;
        this.createTile(x,y,this.tileImg['lt']);
        x+=this.imgSize; 
        for (let i = 0; i < this.width-2; i++) {
            this.createTile(x,y,this.tileImg['t']);
            x+=this.imgSize;
        }
        this.createTile(x,y,this.tileImg['rt']);
       x=this.x;
       y+=this.imgSize;
        for (let i = 0; i < this.height-2; i++) {
             
            
            this.createTile(x,y,this.tileImg['lm']);
            x+=this.imgSize;
            for (let j = 0; j < this.width-2; j++) {
                this.createTile(x,y,this.tileImg['m']);
                x+=this.imgSize;
            }
            this.createTile(x,y,this.tileImg['rm']);
            x=this.x;
            y+=this.imgSize;
        }
        
        this.createTile(x,y,this.tileImg['lb']);
        x+=this.imgSize;
        for (let i = 0; i < this.width-2; i++) {
           
            this.createTile(x,y,this.tileImg['b']);
             x+=this.imgSize;
        }
        
        this.createTile(x,y,this.tileImg['rb']);
        

    }
    private createTile(x:number,y:number,pos:{x:number,y:number}){
        this.tiles.push(new Tile(this.ctx,x,y,this.tileSize,this.imgSize,pos));
       
this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x,y,this.tileSize-2,this.tileSize-2);
    
    
    }
    update(deltax:number,deltay:number,camerax:number,cameray:number){
        this.tiles.forEach(tile => {
            tile.update(deltax,deltay,camerax,cameray);
        })
    }
}
