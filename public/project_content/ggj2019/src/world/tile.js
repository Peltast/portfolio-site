define("Tile", ['BaseObject', 'Point'], function(BaseObject, Point) {

    class Tile extends BaseObject {
        
        constructor(tileLocation, tileSprite, terrains) {
            var passableTerrain = false;
            var passthroughTerrain = false;
            var background = false;

            for (let t = 0; t < terrains.length; t++) {
                if (terrains[t] == null) 
                    continue;
                else { 
                    if (terrains[t].passable)
                        passableTerrain = true;
                    if (terrains[t].passthrough)
                        passthroughTerrain = true;
                    if (terrains[t].background)
                        background = true;
                }
            }

            super(tileLocation, new Point(tileSize, tileSize), passableTerrain);
            
            this.passthrough = passthroughTerrain;
            this.terrains = terrains;
            this.isBackground = background;

            this.spriteContainer = new createjs.Container();
            this.sprite = tileSprite;
            this.spriteContainer.addChild(this.sprite);
            this.spriteContainer.x = Math.round(this.location.X);
            this.spriteContainer.y = Math.round(this.location.Y);
        }

    }

    return Tile;
});