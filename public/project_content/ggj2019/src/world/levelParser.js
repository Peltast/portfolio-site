define("LevelParser", ['Point'], function(Point) {

    class LevelParser {

        constructor(mapName) {
            this.parseData = mapData[mapName];
        }

        getLevelSize() {
            return new Point(this.parseData.width, this.parseData.height);
        }
        getLevelTileLayer() {
            for (let i = 0; i < this.parseData.layers.length; i++) {
                if (this.parseData.layers[i].type = "tilelayer")
                    return this.parseData.layers[i];
            }
            return this.parseData.layers[0];
        }
        getLevelObjectLayer() {
            for (let i = 0; i < this.parseData.layers.length; i++) {
                if (this.parseData.layers[i].type === "objectgroup")
                    return this.parseData.layers[i];
            }
            return null;
        }
        getLevelTileSet() {
            for (let i = 0; i < this.parseData.tilesets.length; i++) {
                var tileset = this.parseData.tilesets[i];
                if (tileset.properties == null)
                    continue;
                if (this.getPropertyValue(tileset.properties, "type") === "tileset")
                    return tileset;
            }
            return this.parseData.tilesets[0]; 
        }
        getLevelTerrains(mapTileSet) {
            var mapTerrains = [];
            for (let i = 0; i < mapTileSet.terrains.length; i++) {
                var terrain = mapTileSet.terrains[i];
                var isPassable = this.getPropertyValue(terrain.properties, "passable");
                var isFatal = this.getPropertyValue(terrain.properties, "fatal");
                var isPassthrough = this.getPropertyValue(terrain.properties, "passthrough");
                var background = this.getPropertyValue(terrain.properties, "background");
                mapTerrains.push(new Terrain(i, terrain.name, isPassable, isFatal, isPassthrough, background));
            }
            return mapTerrains;
        }

        
        getPropertyValue(propertyData, propertyName) {
            for (let i = 0; i < propertyData.length; i++) {
                if (propertyData[i].name === propertyName)
                    return propertyData[i].value;
            }
            return null;
        }
    
    }

    class Terrain {
        constructor(id, name, passable, fatal, passthrough, background) {
            this.id = id;
            this.name = name;
            this.passable = (passable == "true");
            this.fatal = (fatal == "true");
            this.passthrough = (passthrough == "true");
            this.background = background;

            if (this.passable)
                this.sound = soundRoot + this.name + ".mp3";
            else
                this.sound = null;
        }
    }

    return LevelParser;

});