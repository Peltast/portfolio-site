define("Level", ['Point', 'Tile', 'LevelParser'], function(Point, Tile, LevelParser) {

    class Level {

        constructor() {
            this.levelName = "Sandbox";

            this.tiles = [];
            this.player = null;
            this.defaultSpawnPoint = new Point(4, 85);

            this.tileDisplayRange = Math.ceil((stageWidth * 1.5) / tileSize);
            this.tileDisplayAnchor = new Point(0, 0);

            this.levelContainer = new createjs.Container();
            this.levelContainer.snapToPixel = true;
            
            this.actorLayer = new createjs.Container();
            this.parallaxLayer = new createjs.Container();
            this.foregroundLayer = new createjs.Container();
            this.backgroundLayer = new createjs.Container();

            this.levelContainer.addChild(this.backgroundLayer);
            this.levelContainer.addChild(this.parallaxLayer);
            this.levelContainer.addChild(this.foregroundLayer);
            this.levelContainer.addChild(this.actorLayer);

            this.createLevelTiles();
            this.createParallax();
        }
        updateLevel() {
            this.player.updatePlayer();
            this.updateTileDisplay();

            this.parallaxHouse.x = this.parallaxHouseRegion.X - (screenLocation.X * .5);
            this.parallaxHouse.y = this.parallaxHouseRegion.Y - (screenLocation.Y * .15);
            
            this.parallaxMoon.x = this.parallaxMoonRegion.X - (screenLocation.X * .5);
            this.parallaxMoon.y = this.parallaxMoonRegion.Y - (screenLocation.Y * .25);
        }

        updateTileDisplay() {
            var playerCoord = new Point(Math.floor(player.location.X / tileSize), Math.floor(player.location.Y / tileSize));
            var delta = Math.abs(playerCoord.X - this.tileDisplayAnchor.X) + Math.abs(playerCoord.Y - this.tileDisplayAnchor.Y);
            
            if (delta * 2 >= this.tileDisplayRange) {
                this.replaceDisplayTiles(playerCoord);
                this.tileDisplayAnchor = playerCoord;
            }
        }
        replaceDisplayTiles(playerCoord) {
            this.backgroundLayer.removeAllChildren();
            this.foregroundLayer.removeAllChildren();

            for (let y = playerCoord.Y - this.tileDisplayRange; y < playerCoord.Y + this.tileDisplayRange + 1; y++) {
                if (y < 0 || y > this.tiles.length - 1)
                    continue;

                for (let x = playerCoord.X - this.tileDisplayRange; x < playerCoord.X + this.tileDisplayRange + 1; x++) {
                    if (x < 0 || x > this.tiles[y].length - 1)
                        continue;
                    
                    if (this.tiles[y][x].isBackground)
                        this.backgroundLayer.addChild(this.tiles[y][x].spriteContainer);
                    else
                        this.foregroundLayer.addChild(this.tiles[y][x].spriteContainer);
                }
            }
        }

        createParallax() {
            
            var houseSheet = new createjs.SpriteSheet({
                "images": [gameAssets["House"]],
                "frames": {"width": 456, "height": 576, "regX": 0, "regY": 0, "count": 1},
                    animations: {
                        idle: 0
                    }
            });
            this.parallaxHouse = new createjs.Sprite(houseSheet);
            this.parallaxHouse.gotoAndStop("idle");
            this.parallaxLayer.addChild(this.parallaxHouse);
            this.parallaxHouseRegion = new Point(50 * tileSize, 195 * tileSize);

            var moonSheet = new createjs.SpriteSheet({
                "images": [gameAssets["Moon"]],
                "frames": {"width": 450, "height": 474, "regX": 0, "regY": 0, "count": 1},
                    animations: {
                        idle: 0
                    }
            });
            this.parallaxMoon = new createjs.Sprite(moonSheet);
            this.parallaxMoon.gotoAndStop("idle");
            this.parallaxLayer.addChild(this.parallaxMoon);
            this.parallaxMoonRegion = new Point(50 * tileSize, 20 * tileSize);
        }

        createLevelTiles() {

            var levelParser = new LevelParser(this.levelName);

            this.mapSize = levelParser.getLevelSize();
            var tileMap = levelParser.getLevelTileLayer().data;
            var tileSet = levelParser.getLevelTileSet();
            var terrains = levelParser.getLevelTerrains(tileSet);
            var objects = levelParser.getLevelObjectLayer().objects;

            this.initMapObjects(objects);

            var tileSheet = new createjs.SpriteSheet({
                "images": [gameAssets["Tileset"]],
                "frames": {"width": tileSize, "height": tileSize, "regX": 0, "regY": 0}
            });

            for (let y = 0; y < this.mapSize.Y; y++) {
                var tileRow = [];
                for (let x = 0; x < this.mapSize.X; x++) {
                    var tileID = tileMap[x + (y * this.mapSize.X)] - tileSet.firstgid;
                    var tileLocation = new Point(x * tileSize, y * tileSize);

                    var terrainData = tileSet.tiles[tileID + ""];
                    var tileTerrains = [];
                    if (terrainData == null) {
                        console.log("Data for tile " + tileID + " wasn't found in the map tileset.");
                    }
                    else {
                        for (let t = 0; t < terrainData.terrain.length; t++) {
                            tileTerrains.push(terrains[terrainData.terrain[t]]);
                        }
                    }
                    
                    var tileSprite = new createjs.Sprite(tileSheet, tileID);
                    tileSprite.gotoAndStop(tileID);

                    var newTile = new Tile(tileLocation, tileSprite, tileTerrains);
                    tileRow.push(newTile);
                    
                    if (newTile.isBackground)
                        this.backgroundLayer.addChild(newTile.spriteContainer);
                    else
                        this.foregroundLayer.addChild(newTile.spriteContainer);
                }

                this.tiles.push(tileRow);
            }
        }
        initMapObjects(objectList) {
            if (objectList == null) return;
            
            for (let i = 0; i < objectList.length; i++) {
                var objectType = objectList[i].type;
                if (objectType === "PlayerSpawn") {
                        this.mapSpawnPoint = this.getObjectLocation(objectList[i]);
                }
            }
        }
        getObjectLocation(objectData) {
            return new Point(objectData.x / tileSize, (objectData.y - tileSize) / tileSize);
        }

        spawnPlayer(player) {
            this.player = player;
            var spawnLocation = this.mapSpawnPoint ? this.mapSpawnPoint : this.defaultSpawnPoint;
            this.player.location = new Point(spawnLocation.X * tileSize, spawnLocation.Y * tileSize);
            
            this.actorLayer.addChild(this.player.spriteContainer);
        }

        checkObjectCollisions(object, checkPassable = true) {
            var collisions = [];
            collisions = this.addTileCollisions(object, checkPassable, collisions);

            return collisions;
        }
        addTileCollisions(object, checkPassable, collisions) {
            var objectMapCoordinates = new Point(Math.floor(object.location.X / tileSize), Math.floor(object.location.Y / tileSize));

            for (let y = objectMapCoordinates.Y - 4; y < objectMapCoordinates.Y + 4; y++) {
                if (y < 0 || y >= this.tiles.length) continue;
                for (let x = objectMapCoordinates.X - 4; x < objectMapCoordinates.X + 4; x++) {
                    if (x < 0 || x >= this.tiles[y].length) continue;
                    var tile = this.tiles[y][x];
                    
                    if (tile.checkCollision(object, checkPassable))
                        collisions.push(tile);
                }
            }
            return collisions;
        }

    }

    return Level;
});