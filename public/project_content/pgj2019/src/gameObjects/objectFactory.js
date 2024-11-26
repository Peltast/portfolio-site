define("ObjectFactory", [

        'Point', 'Tile', 'Prop', 'Enemy', 'Transition', 'EnemySpawnPoint', 'ParticleSystem', 'PaintArea',
        'Collectible', 'ReactiveProp', 'Shard'
    ], 

    function(
        Point, Tile, Prop, Enemy, Transition, EnemySpawnPoint, ParticleSystem, PaintArea,
        Collectible, ReactiveProp, Shard
    ) {

    var npcList = {

        "wisp": {
            "sprite": "Wisp",
            "frames": {"width": 40, "height": 64, "regX": 0, "regY": 0, "count": 8},
            "animations": { idle: [0, 7, "idle", .16] }, "defaultAnimation": "idle", "randomStart": true,
            "spriteCollision": new Point(24, 24), "spriteSize": new Point(40, 64), "spritePos": new Point(8,40),
            "particleEffects": ["WispEffect"],
            "spiritLevel": 10
        },
        "checkpoint": {
            "spiritLevel": 20,
            "sprite": "CheckpointSpirit",
            "frames": {"width": 40, "height": 64, "regX": 0, "regY": 0, "count" : 53},
            "animations": {
                inactive: [0, 7, "inactive", .2],
                activeCenter: [8, 15, "activeCenter", .1],
                activeSlightLeft: [16, 23, "activeSlightLeft", .1],
                activeLeft: [24, 31, "activeLeft", .1],
                activeSlightRight: [32, 39, "activeSlightRight", .1],
                activeRight: [40, 47, "activeRight", .1],
                activate: [48, 52, "activeCenter", .4]
            },
            "defaultAnimation": "inactive", "active": false,
            "spriteCollision": new Point(24, 24), "spriteSize": new Point(40, 64), "spritePos": new Point(8, 40)
        },
        
        "mainEnemy": {
            "sprite": "Enemy", "damageOnTouch": true, "behavior": "Homing", "controller": "enemyController",
            "frames": { "width": 32, "height": 32, "regX": 0, "regY": 0, "count": 1 },
            "animations": {
                idle: 0
            },
            "defaultAnimation": "leftIdle", "deathAnimation": "Death", "deathTimer": 30,
            "spriteCollision": new Point(26, 26), "spriteSize": new Point(32, 32), "spritePos": new Point(18, 18)
        },
        "Shard": {
            "type": "shard", "passable": true, "sprite": "Shard", "controller": "default",
            "animations": { idle: 0 }, "defaultAnimation": "idle", "frames": {"width": 32, "height": 32, "regX": 0, "regY": 0, "count": 1},
            "spriteCollision": new Point(32, 32), "spriteSize": new Point(32, 32), "spritePos": new Point(0, 0)
        },

        "sleepingEnemy": {
            "sprite": "SleepingEnemy", "damageOnTouch": true, "behavior": "Stationary", "controller": "default",
            "frames": { "width": 44, "height": 36, "regX": 0, "regY": 0, "count": 12 },
            "animations": {
                left: [0, 3, "leftIdle", .05], right: [4, 7, "rightIdle", .05],
                leftDeath: [8, 9, "leftDeath", .2], rightDeath: [10, 11, "rightDeath", .2]
            },
            "defaultAnimation": "leftIdle", "deathAnimation": "Death", "deathTimer": 30,
            "spriteCollision": new Point(26, 20), "spriteSize": new Point(44, 36), "spritePos": new Point(8, 12)
        }


    }

    var objectList = 
    {

        "Chalice": {
            "type": "chalice", "passable": true,
            "sprite": "Chalice", "animations": {idle: 0 }, "defaultAnimation": "idle",
            "frames": {"width": 32, "height": 32, "regX": 0, "regY": 0, "count": 4 },
            "spriteCollision": new Point(32, 32), "spriteSize": new Point(32, 32), "spritePos": new Point(0, 0)
        },

        "NPCWall": {
            "type": "default", "passable": true, "visible": false, "npcWall": true,
            "sprite": "Player", "animations": { "idle": 0 }, "defaultAnimation": "idle",
            "frames": {"width": 32, "height": 32, "regX": 0, "regY": 0}
        },

        "Jidan": {
            "type": "collectible", "passable": true,
            "sprite": "Jidan", "animations": { idle: [0, 5, "idle", .15 ] }, "defaultAnimation": "idle",
            "frames": {"width": 32, "height": 32, "regX": 0, "regY": 0},
            "spriteCollision": new Point(16, 24), "spriteSize": new Point(32, 32), "spritePos": new Point(0, 0)
        }

    }

    class ObjectFactory {

        constructor() {
            this.test = true;
        }

        createTile(location, tileSheet, tileID, terrains) {
            
            var tileData = {};
            tileData["terrains"] = terrains;

            for (let i = 0; i < terrains.length; i++) {
                var terrainData = terrains[i];
                if (!terrainData)
                    continue;

                if (!tileData["passable"])
                    tileData["passable"] = this.getMapProperty(terrainData.properties, "passable") == "true";
                if (!tileData["fatal"])
                    tileData["fatal"] = this.getMapProperty(terrainData.properties, "fatal") == "true";
                
                tileData = this.getTileProperties(tileData, terrainData, 
                    ["fakeTerrain", "realTerrain", "fakeSprite", "spriteData", "animation", "fakeAnimation", "spriteAlpha", "fakeAlpha"]);
            }

            if (tileData["spriteData"])
                tileData["spriteData"] = this.getSpriteDataFromString(tileData["spriteData"]);
            if (tileData["fakeSprite"])
                tileData["fakeSpriteData"] = this.getSpriteDataFromString(tileData["fakeSprite"]);

            var tile = new Tile(location, tileSheet, tileID, tileData);
            return tile;
        }
        getTileProperties(tileData, terrainData, propertyNames) {
            for (let i = 0; i < propertyNames.length; i++) {
                var property = propertyNames[i];
                if (!tileData[property])
                    tileData[property] = this.getMapProperty(terrainData.properties, property);
            }
            return tileData;
        }
        
        createObject(objectMapData) {
            var objectType = this.getObjectProperty(objectMapData, {}, "type", "string", objectMapData.type);

            if (objectList[objectType] != null)
                return this.createPropObject(objectMapData);

            else if (objectType === "Prop")
                return this.createPropObject(objectMapData);
            else if (objectType === "EnemySpawn")
                return this.createNewEnemy(objectMapData);
            else if (objectType === "EnemySpawnPoint")
                return this.createNewEnemySpawn(objectMapData);
            else if (objectType === "Shard")
                return this.createNewShard(objectMapData);
            else if (objectType === "PaintArea")
                return this.createNewPaintArea(objectMapData);
            else if (objectType === "Transition")
                return this.createNewTransition(objectMapData);
        }

        createPropObject(objectMapData) {
            var location = this.getObjectLocation(objectMapData);
            var size = new Point(objectMapData.width, objectMapData.height);
            var propType = objectMapData.type;

            var prop = this.constructPropFromData(objectMapData, location, size, propType);
            return prop;
        }
        constructPropFromData(objectMapData, location, size, propType) {
            var newProp = null;
            var objectListData = objectList[propType];
            
            var spriteData = this.getSpriteData(objectMapData, objectListData);
            var dialogueName = this.getObjectProperty(objectMapData, objectListData, "dialogue", "string", "");
            var propData = this.getObjectData(objectMapData, objectListData, [
                "type", "visible", "fakeType", "fakeAnimation", "passable", "sound", "fatal", "zPos", 
                "parallaxDistX", "parallaxDistY", "foreground", "background", "particleEffects",
                "npcWall", "orientation"
            ]);

            propData["dialogue"] = dialogueName ? dialogueLibrary[dialogueName] : null;
            size = spriteData["spriteCollision"] ? spriteData["spriteCollision"] : size;
            propData = this.attachParticleEffects(propData);
            propData = this.attachFakeObjectData(propData);

            if (spriteData["spriteImage"] == null)
                console.log("ERROR: No image '" + spriteData["spriteSheetImg"] + "' found for prop '" + propType + "'");
            else if (propData["type"] === "collectible") {
                newProp = new Collectible(location, size, propData["passable"], spriteData, propData);
            }
            else if (propData["type"] === "reactive") {
                newProp = new ReactiveProp(location, size, propData["passable"], spriteData, propData);
            }
            else {
                newProp = new Prop(location, size, propData["passable"], spriteData, propData);
            }

            return newProp;
        }

        createNewEnemy(enemyMapData) {
            var enemyType = this.getMapProperty(enemyMapData.properties, "enemyType");
            if (!enemyType)
                return;
            var enemyListData = npcList[enemyType];

            var enemyData = this.getObjectData(enemyMapData, enemyListData, [ 
                "damageOnTouch", "behavior", "controller", "orientation", "defaultAnimation", "deathAnimation", "deathTimer",
                "horizontal", "startDirection", "origin"
                ]
            );
            var spriteData = this.getSpriteData(enemyMapData, enemyListData);

            var newEnemy = new Enemy(spriteData["spriteCollision"], spriteData, enemyData);
            newEnemy.location = this.getObjectLocation(enemyMapData);
            if (enemyData["origin"])
                newEnemy.location.add(enemyData["origin"]);

            return newEnemy;
        }
        createMainEnemy(location) {
            var enemyListData = npcList["mainEnemy"];
            
            var enemyData = this.getObjectData({}, enemyListData, [
                "damageOnTouch", "behavior", "controller", "orientation", "defaultAnimation", "deathAnimation", "deathTimer",
                "horizontal", "startDirection", "origin"
                ]
            );
            var spriteData = this.getSpriteData({}, enemyListData);

            var newEnemy = new Enemy(spriteData["spriteCollision"], spriteData, enemyData);
            newEnemy.location = location;
            return newEnemy;
        }

        createNewEnemySpawn(spawnMapData) {
            
            var spawnLocation = this.getObjectLocation(spawnMapData);
            return new EnemySpawnPoint(spawnLocation, new Point(1,1), true, {}, {}, "mainEnemy");
        }

        createNewShard(shardMapData) {
            var shardListData = npcList["Shard"];

            var shardData = this.getObjectData(shardMapData, shardListData, [ 
                "damageOnTouch", "behavior", "controller", "orientation", "defaultAnimation", "deathAnimation", "deathTimer",
                "horizontal", "startDirection", "origin"
                ]
            );
            var spriteData = this.getSpriteData(shardMapData, shardListData);

            var newShard = new Shard(spriteData["spriteCollision"], spriteData, shardData);
            newShard.location = this.getObjectLocation(shardMapData);
            if (shardData["origin"])
                newShard.location.add(shardData["origin"]);

            return newShard;
        }
        
        attachParticleEffects(objectData) {
            if (!objectData["particleEffects"])
                return objectData;

            var effectNames = objectData["particleEffects"];
            if (effectNames === "null") {
                objectData["particleEffects"] = [];
            }
            else {
                var effects = [];
                for (let i = 0; i < effectNames.length; i++) {
                    effects.push(new ParticleSystem(effectNames[i]));
                }
                objectData["particleEffects"] = effects;
            }

            return objectData;
        }
        attachFakeObjectData(objectData) {
            if (!objectData["fakeType"])
                return objectData;

            var fakeType = objectData["fakeType"];
            var fakeData = (fakeType in npcList) ? npcList[fakeType] : objectList[fakeType];
            if (!fakeData)
                return objectData;

            var fakeSpriteData = this.getSpriteData({}, fakeData, new Point(32,32));
            objectData["fakeSpriteData"] = fakeSpriteData;
            if (objectData["fakeAnimation"])
                fakeSpriteData["fakeAnimation"] = objectData["fakeAnimation"];
            
            return objectData;
        }
        
        createNewPaintArea(paintMapData) {
            var areaLocation = new Point(paintMapData.x, paintMapData.y);
            var areaSize = new Point(paintMapData.width, paintMapData.height);
            var areaCellSize = this.getMapProperty(paintMapData.properties, "cellSize");
            var areaStartColor = this.getMapProperty(paintMapData.properties, "startColor");
            var areaEndColor = this.getMapProperty(paintMapData.properties, "endColor");
            var areaStartAlpha = this.getMapProperty(paintMapData.properties, "startAlpha", 1);
            var areaEndAlpha = this.getMapProperty(paintMapData.properties, "endAlpha", 1);
            var brushKey = this.getMapProperty(paintMapData.properties, "paintbrush", "");
            var foreground = this.getMapProperty(paintMapData.properties, "foreground", false);
            
            var newPaintArea = new PaintArea
                (areaLocation, areaSize, areaCellSize, areaStartColor, areaEndColor, areaStartAlpha, areaEndAlpha, brushKey, foreground);
            return newPaintArea;
        }
        createNewTransition(transitionMapData) {
            var objectListData = objectList["Wormhole"];
            var spriteData = this.getSpriteData({}, objectListData);

            var destinationMap = this.getMapProperty(transitionMapData.properties, "destination");
            var destinationLocation = this.parsePointValue(this.getMapProperty(transitionMapData.properties, "destinationLocation", "0,0"));
            destinationLocation = new Point(destinationLocation.X * tileSize, destinationLocation.Y * tileSize);
            var newTransition = new Transition(this.getObjectLocation(transitionMapData), new Point(tileSize, tileSize), destinationMap, destinationLocation, spriteData);

            return newTransition;
        }

        getSpriteData(mapData, listData, defaultSpriteSize = "") {
            var spriteData = {};

            spriteData["spriteSheetImg"] = this.getObjectProperty(mapData, listData, "sprite");
            spriteData["spriteSize"] = this.getObjectProperty(mapData, listData, "spriteSize", "point", defaultSpriteSize);
            spriteData["spriteCollision"] = this.getObjectProperty(mapData, listData, "spriteCollision", "point", defaultSpriteSize);
            spriteData["spritePosition"] = this.getObjectProperty(mapData, listData, "spritePos", "point");
            spriteData["animations"] = this.getObjectProperty(mapData, listData, "animations");
            spriteData["defaultAnimation"] = this.getObjectProperty(mapData, listData, "defaultAnimation");
            spriteData["fakeAnimation"] = this.getObjectProperty(mapData, listData, "fakeAnimation");
            spriteData["frames"] = this.getObjectProperty(mapData, listData, "frames");
            spriteData["randomStart"] = this.getObjectProperty(mapData, listData, "randomStart");
            spriteData["spriteImage"] = gameAssets[spriteData["spriteSheetImg"]];

            return spriteData;
        }
        getSpriteDataFromString(spriteName) {
            var spriteData = npcList[spriteName] ? npcList[spriteName] : objectList[spriteName];

            if (spriteData)
                return this.getSpriteData({}, spriteData);
            else   
                return {};
        }

        getObjectData(mapData, listData, propertyList) {
            var objectData = {};
            
            for (let i = 0; i < propertyList.length; i++) {
                var propertyName = propertyList[i];
                objectData[propertyName] = this.getObjectProperty(mapData, listData, propertyName);
            }

            return objectData;
        }
        getObjectProperty(mapData, listData, propertyName, propertyType = "", defaultValue = "") {
            var value = null;

            if (listData) {
                if (listData[propertyName] != null) {
                    value = listData[propertyName];
                }
            }

            var mapValue = this.getMapProperty(mapData.properties, propertyName, null);
            if (mapValue) {
                value = mapValue;

                if (propertyType === "point")
                    value = this.parsePointValue(mapValue != null ? mapValue : "0,0");
            }
            
            return value != null ? value : defaultValue;
        }

        getObjectLocation(objectData) {
            return new Point(objectData.x, objectData.y - tileSize);
        }
        getMapProperty(propertyData, propertyName, defaultVal) {
            if (!propertyData)
                return defaultVal;

            for (let i = 0; i < propertyData.length; i++) {
                if (propertyData[i].name === propertyName)
                    return propertyData[i].value;
            }
            return defaultVal;
        }
        parsePointValue(pointStr) {
            if (pointStr == null)
                return new Point(0, 0);
            if (pointStr.indexOf(',') < 0)
                return new Point(0, 0);

            var pointVals = pointStr.split(',');
            var pointX = parseInt(pointVals[0]);
            var pointY = parseInt(pointVals[1]);

            if (isNaN(pointX) || isNaN(pointY))
                return new Point(0, 0);
            else
                return new Point(pointX, pointY);
        }
    
    }


    return ObjectFactory;

});