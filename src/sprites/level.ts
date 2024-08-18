
import { EventManager } from "./eventlistener";
type tile = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j';
export class Level {
    x:number = 0;
    y:number = 0;
    load =0;
    screenRows:number;
    eventManager:EventManager;
    screenCols:number;
    tileSize:number;
    ctx: CanvasRenderingContext2D;
    cameraX:number;
    cameraY:number;
    levelArray!:[number[], string[]][];
    tileset = new Image();
    map!:tile[][];
    tiles:Map<tile,Tile> = new Map();
    
    constructor(ctx: CanvasRenderingContext2D,eventManager:EventManager,levelPath:string,map:tile[][],tileSize:number,cameraX:number,cameraY:number,screenCols:number,screenRows:number) {
        this.tileSize = tileSize;
        this.ctx =ctx;
        this.cameraX = cameraX;
        this.cameraY= cameraY;
        this.screenCols =screenCols;
        this.screenRows = screenRows;
        this.map =map;
        this.eventManager = eventManager;
        this.tileset.src = '../assets/grounds/ground.png';
        this.tileset.onload = () => {
            this.loading();
        } 
        this.loadLevelData(levelPath);
        this.createCommonTiles()
        
        
    }
    private loading(){
        this.load++;
        if (this.load === 3){
            this.eventManager.broadcast('levelloaded','levelloaded');
        }
    }
     async loadLevelData(levelPath: string) {
         try {
             const response = await fetch(levelPath);
             const levelData = await response.json();
            this.levelArray = Object.values(levelData);
            this.loadMapItems();
         } catch (error) {
             console.error("Error loading level:", error);
         }
     }
    loadMapItems(){
        console.log(this.map)
        this.levelArray.forEach(element =>{
            this.loadItemtoMap(element[1],element[0][0],element[0][1]);
        })
        this.loading();
    }
    
    
    loadItemtoMap(item:string[],y:number,x:number){

        item.forEach((element,yindex) => {
            const row = element.split("") as tile[];

            row.forEach((tile,xindex) => {
                this.map[yindex+y][xindex+x]=tile;
            })
        });
    }
   createCommonTiles(){
    this.tiles.set('a',new Tile(this.ctx,this.tileset,this.tileSize,'a'));
    this.tiles.set('b',new Tile(this.ctx,this.tileset,this.tileSize,'b'));
    this.tiles.set('c',new Tile(this.ctx,this.tileset,this.tileSize,'c'));
    this.tiles.set('d',new Tile(this.ctx,this.tileset,this.tileSize,'d'));
    this.tiles.set('e',new Tile(this.ctx,this.tileset,this.tileSize,'e'));
    this.tiles.set('f',new Tile(this.ctx,this.tileset,this.tileSize,'f'));
    this.tiles.set('g',new Tile(this.ctx,this.tileset,this.tileSize,'g'));
    this.tiles.set('h',new Tile(this.ctx,this.tileset,this.tileSize,'h'));
    this.tiles.set('i',new Tile(this.ctx,this.tileset,this.tileSize,'i'));
    this.tiles.set('j',new Tile(this.ctx,this.tileset,this.tileSize,'j'));
    this.loading();
} 
   render(x:number,y:number){
    for(let i=0;i<this.screenRows;i++){
        for(let j=0;j<this.screenCols;j++){
            this.tiles.get(this.map[i][j])?.render(x+j*this.tileSize,y+i*this.tileSize);
        }
    }
  
    }}
    
    

class Tile{
    
    x!: number;
    y!: number;
    tilesize:number;
    imgsize=32;
    ctx: CanvasRenderingContext2D;
    img!:HTMLImageElement;
    tile:{x:number,y:number}={x:0,y:0};
    tileData ={
        'a':[0,0],
        'b':[0,1],
        'c':[0,2],
        'd':[1,0],
        'e':[1,1],
        'f':[1,2],
        'g':[2,0],
        'h':[2,1],
        'i':[2,2],
        'j':[6,2]
    }

    constructor(ctx: CanvasRenderingContext2D,tileset:HTMLImageElement,tileSize:number,tile:tile){
        this.tile.x = this.tileData[tile][1]*this.imgsize;
        this.tile.y = this.tileData[tile][0]*this.imgsize;
        this.tilesize=tileSize;
        this.ctx=ctx;
        this.img=tileset;
    }
   
   
    render(x:number,y:number){
        this.ctx.drawImage(this.img,this.tile.x,this.tile.y,this.imgsize,this.imgsize,x,y,this.tilesize,this.tilesize);
        
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
       // this.tiles.push(new Tile(this.ctx,x,y,this.tileSize,this.imgSize,pos));
       
this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x,y,this.tileSize-2,this.tileSize-2);
    
    
    }
    update(deltax:number,deltay:number,camerax:number,cameray:number){
        this.tiles.forEach(tile => {
        //    tile.update(deltax,deltay,camerax,cameray);
        })
    }
}