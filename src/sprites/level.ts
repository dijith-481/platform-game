import { EventManager } from "./eventlistener";
export class Level {
  private x: number = 0;
  private y: number = 0;
  private load = 0;
  private screenRows: number;
  eventManager: EventManager;
  screenCols: number;
  tileSize: number;
  ctx: CanvasRenderingContext2D;
  cameraX: number;
  cameraY: number;
  coinSkin = new Image();
  levelArray!: [number[], string[]][];
  tileset = new Image();
  map!: string[][];
  tiles: Map<string, Tile> = new Map();

  private coinskinpos = 0;
  constructor(
    ctx: CanvasRenderingContext2D,
    eventManager: EventManager,
    levelPath: string,
    map: string[][],
    tileSize: number,
    cameraX: number,
    cameraY: number,
    screenCols: number,
    screenRows: number,
  ) {
    this.tileSize = tileSize;
    this.ctx = ctx;
    this.cameraX = cameraX;
    this.cameraY = cameraY;
    this.screenCols = screenCols;
    this.screenRows = screenRows;
    this.map = map;
    this.eventManager = eventManager;
    this.tileset.src = "../assets/grounds/ground.png";
    this.coinSkin.src = "../assets/collectables/coin.png";
    this.tileset.onload = () => {
      this.loading();
    };
    const mapString = localStorage.getItem("map");
    if (mapString) {
      console.log("Map loaded from localStorage.");
      this.loading();
    } else {
      console.warn("No map found in localStorage.");
      this.loadLevelData(levelPath);
    }
    this.createCommonTiles();
  }
  /**
   * @private
   * @memberof Level
   * keep track of if level is loaded.
   */
  private loading() {
    this.load++;
    if (this.load === 3) {
      this.eventManager.broadcast("levelloaded", "levelloaded");
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
  loadMapItems() {
    console.log(this.map);
    this.levelArray.forEach((element) => {
      console.log(element);
      this.loadItemtoMap(element[1], element[0][0], element[0][1]);
    });
    this.loading();
    const mapString = JSON.stringify(this.map);
    localStorage.setItem("map", mapString);
  }

  loadItemtoMap(item: string[], y: number, x: number) {
    item.forEach((element, yindex) => {
      const row = element.split("");

      row.forEach((tile, xindex) => {
        this.map[yindex + y][xindex + x] = tile;
      });
    });
  }
  /*
   *create tiles used in the game.
   *
   */
  createCommonTiles() {
    this.tiles.set(
      "a",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "a"),
    );
    this.tiles.set(
      "b",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "b"),
    );
    this.tiles.set(
      "c",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "c"),
    );
    this.tiles.set(
      "d",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "d"),
    );
    this.tiles.set(
      "e",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "e"),
    );
    this.tiles.set(
      "f",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "f"),
    );
    this.tiles.set(
      "g",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "g"),
    );
    this.tiles.set(
      "h",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "h"),
    );
    this.tiles.set(
      "i",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "i"),
    );
    this.tiles.set(
      "j",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "j"),
    );
    this.tiles.set(
      "k",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "k"),
    );
    this.tiles.set(
      "l",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "l"),
    );
    this.tiles.set(
      "m",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "m"),
    );
    this.tiles.set(
      "n",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "n"),
    );
    this.tiles.set(
      "o",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "o"),
    );
    this.tiles.set(
      "p",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "p"),
    );
    this.tiles.set(
      "q",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "q"),
    );
    this.tiles.set(
      "r",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "r"),
    );
    this.tiles.set(
      "s",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "s"),
    );
    this.tiles.set(
      "t",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "t"),
    );
    this.tiles.set(
      "u",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "u"),
    );
    this.tiles.set(
      "v",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "v"),
    );
    this.tiles.set(
      "w",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "w"),
    );
    this.tiles.set(
      "x",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "x"),
    );
    this.tiles.set(
      "y",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "y"),
    );
    this.tiles.set(
      "z",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "z"),
    );
    this.tiles.set(
      "#",
      new Tile(this.ctx, this.coinSkin, 16, this.tileSize / 2, "#"),
    );
    this.tiles.set(
      "A",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "A"),
    );
    this.tiles.set(
      "B",
      new Tile(this.ctx, this.tileset, 32, this.tileSize, "B"),
    );
    this.loading();
  }
  /*
   *update and render  map.
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   *
   */
  render(x: number, y: number, w: number, h: number) {
    for (let i = h; i < this.screenRows + h; i++) {
      for (let j = w; j < this.screenCols + w; j++) {
        try {
          if (this.map[i][j] == "#") {
            this.tiles
              .get(this.map[i][j])
              ?.render(
                x + j * this.tileSize,
                y + i * this.tileSize,
                Math.floor(this.coinskinpos),
              );
          } else
            this.tiles
              .get(this.map[i][j])
              ?.render(x + j * this.tileSize, y + i * this.tileSize);
        } catch (error) {}
      }
    }
    this.coinskinpos += 0.2;
    this.coinskinpos %= 5;
  }
}

/*
 *create tiles used in the game.
 *
 */
class Tile {
  x!: number;
  y!: number;
  colx!: number;
  coly!: number;
  tilesize: number;
  imgsize: number;
  ctx: CanvasRenderingContext2D;
  img!: HTMLImageElement;
  tile: { x: number; y: number } = { x: 0, y: 0 };
  tileData: { [key: string]: [number, number] } = {
    a: [5, 6],
    b: [0, 1],
    c: [13, 15],
    d: [12, 4],
    e: [1, 1],
    f: [11, 8],
    g: [15, 13],
    h: [9, 12],
    i: [15, 15],
    j: [13, 8],
    k: [6, 0],
    l: [11, 10],
    m: [0, 7],
    n: [3, 10],
    o: [3, 4],
    p: [4, 8],
    q: [3, 6],
    r: [14, 1],
    s: [15, 11],
    t: [1, 7],
    u: [13, 10],
    v: [11, 11],
    w: [9, 6],
    x: [3, 13],
    y: [4, 0],
    z: [7, 10],
    A: [15, 4],
    B: [3, 15],
    "#": [0, 0],
    $: [0, 0],
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    tileset: HTMLImageElement,
    imgsize: number,
    tileSize: number,
    tile: string,
  ) {
    this.imgsize = imgsize;
    this.colx = this.tileData[tile][1];
    this.coly = this.tileData[tile][0];
    this.tile.x = this.colx * this.imgsize;
    this.tile.y = this.tileData[tile][0] * this.imgsize;
    this.tilesize = tileSize;
    this.ctx = ctx;
    this.img = tileset;
  }

  render(x: number, y: number, colx = this.colx, coly = this.coly) {
    this.ctx.drawImage(
      this.img,
      colx * this.imgsize,
      coly * this.imgsize,
      this.imgsize,
      this.imgsize,
      x,
      y,
      this.tilesize,
      this.tilesize,
    );
  }
}
