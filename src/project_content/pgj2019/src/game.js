require( 
    ['Point', 'Level', 'LevelParser', 'ObjectFactory', 'Player', 'StatsDisplay'], 
    function(Point, Level, LevelParser, ObjectFactory, Player, StatsDisplay) {

    $(function() {
        gameStatus = GameState.PRELOADING;
        initGame();
    });

    var preloader;
    var gameBG;
    var gameArea;
    var gameUI;
    var pauseScreen;

    function initGame() {
        createjs.Ticker.addEventListener("tick", updateGame);

        loadGame();

        addPreloader(loadProgress, totalGameManifest);
    }

    function loadGame() {
        gameSaveState = localStorage.getItem("pj2019SaveState");
        if (!gameSaveState)
            gameSaveState = {};
        else
            gameSaveState = JSON.parse(gameSaveState);
    }
    function saveGame() {
        var saveData = JSON.stringify(gameSaveState);
        localStorage.setItem("pj2019SaveState", saveData);
    }

    function addPreloader(progress, destination) {
        preloader = new LoadBar(progress, destination);
        stage.addChild(preloader.loadBarContainer);
    }
    function removePreloader(p) {
        if (stage.contains(p.loadBarContainer))
            stage.removeChild(p.loadBarContainer);
    }
    function updatePreloader(progress) {
        preloader.updateBarProgress(progress);
        stage.update();
    }
        
    function updateGame() {
        if (!finishedLoading()) {
            updatePreloader(totalMapsLoaded + totalFilesLoaded + assetsLoaded);
            return;
        }
        else if (gameStatus === GameState.PRELOADING) {
            gameStatus = GameState.LOADING;
            mapDataKeys = Object.keys(mapData);
        }
        else if (gameStatus === GameState.LOADING) {
            if (totalMapsParsed < mapDataKeys.length)
                loadWorld();
            else
                launchLevel();
        }
        
        else if (gameStatus === GameState.RUNNING) {
            
            if (unpauseGame) {
                pauseGame = false;
                unpauseGame = false;
                if (gameUI)
                    gameUI.removeChild(pauseScreen);
            }
            else if (pauseGame && gameUI) {
                if (!gameUI.contains(pauseScreen))
                    gameUI.addChild(pauseScreen);
            }
            
            else
                updateGameMap();
        }

        stage.update();
    }
    
    var totalMapsParsed = -1;
    var mapDataKeys;
    function loadWorld() {

        if (totalMapsParsed < 0) {
            beginLoadingWorld();
            totalMapsParsed = 0;
        }
        
        var areaName = mapDataKeys[totalMapsParsed];
        var area = createLevel(areaName);
        gameWorld[areaName] = area;

        area.loadLevelProgress(gameSaveState[areaName]);

        totalMapsParsed += 1;
        updatePreloader(totalMapsParsed);
    }
    function beginLoadingWorld() {
        addPreloader(totalMapsParsed, mapDataKeys.length);

        controllerData = actionLibrary["ControllerData"];
        hitBoxData = actionLibrary["HitboxData"];
        attackData = actionLibrary["AttackData"];
        objectFactory = new ObjectFactory(this.name);
        player = new Player();
    }
    function createLevel(mapName) {
        console.log("PARSING MAP " + mapName);

        var levelParser = new LevelParser(mapName);
        
        var mapSize = levelParser.getLevelSize();
        var tileLayer = levelParser.getLevelTileLayer();
        var objectLayer = levelParser.getLevelObjectLayer();
        var mapTileSet = levelParser.getLevelTileSets();
        var mapProperties = levelParser.getCustomProperties();
        
        return new Level(tileLayer.data, objectLayer.objects, mapSize, mapTileSet, mapName, mapProperties);
    }

    function clearGameState() {
        if (currentLevel) {
            currentLevel.resetLevel();
            removeCurrentLevel();

            removeEventListener("keydown", onKeyDown);
            removeEventListener("keyup", onKeyUp);
            stage.removeChild(gameBG);
            stage.removeChild(gameArea);
            stage.removeChild(gameUI);
        }
        if (levelSelectMenu) {
            if (stage.contains(levelSelectMenu.menuContainer))
                stage.removeChild(levelSelectMenu.menuContainer);
        }

        removePreloader(preloader);

        if (mainMenu) {
            stage.removeChild(mainMenu.sceneContainer);
            stage.removeChild(mainMenu.menuContainer);
        }

        transition = null;
    }

    function launchLevel() {

        clearGameState();
        
        // if (!soundPlayer) {
        //     soundPlayer = new Howl({
        //         src: [soundRoot + soundAssets["GreenMountains"]], loop: true, volume: 0.5
        //     });
        // }
        // if (!levelTheme && musicOn) {
        //     levelTheme = soundPlayer.play();
        // }
        
        gameBG = new createjs.Shape();
        gameBG.graphics.beginFill("#000000").drawRect(0, 0, stageWidth, stageHeight);
        gameArea = new createjs.Container();
        gameUI = createUI();

        stage.addChild(gameBG, gameArea, gameUI);

        var startLevel = gameWorld[startingMap];
        startLevel.spawnPlayer(player, startLevel.levelSpawn.location);
        setLevel(startLevel);
        
        addEventListener("keydown", onKeyDown);
        addEventListener("keyup", onKeyUp);

        gameStatus = GameState.RUNNING;
    }
    function createUI() {
        gameUI = new createjs.Container();
        
        pauseScreen = new createjs.Shape();
        pauseScreen.graphics.beginFill("#000000").drawRect(0, 0, stageWidth, stageHeight);
        pauseScreen.alpha = 0.5;

        gameStatsDisplay = new StatsDisplay();
        gameStatsDisplay.initiateStatDisplay();
        gameUI.addChild(gameStatsDisplay.statsContainer);

        // healthBar = new HealthBar();
        // gameUI.addChild(healthBar.healthBarContainer);

        return gameUI;
    }

    function setLevel(level) {
        if (currentLevel != null) {
            if (gameArea.contains(currentLevel.levelContainer)) {
                removeCurrentLevel();
            }
        }
        if (currentLevel !== level)
            level.startUpLevel();

        currentLevel = level;
        currentLevel.levelContainer.scale = gameScale;
        
        player.collectiblesGathered = 0;
        player.highestCombo = 0;
        gameScore = 0;
        shardsRetrieved = 0;
        player.isHoldingShard = false;

        if (!(gameArea.contains(level.levelContainer)))
            gameArea.addChild(level.levelContainer);
    }
    function removeCurrentLevel() {
        currentLevel.cleanUpLevel();
        gameArea.removeChild(currentLevel.levelContainer);
        currentLevel = null;
    }

    function updateGameMap() {
        if (transition !== null)
            changeLevels();

        if (currentLevel) {
            checkScreenwrap();
            centerScreen();
            currentLevel.updateLevel();
        }
    }
    
    function resetCurrentLevel() {
        shardsRetrieved = 0;
        player.isHoldingShard = false;
        gameArea.removeChild(currentLevel.levelContainer);
        currentLevel.createLevel();
        currentLevel.spawnPlayer(player, currentLevel.levelSpawn.location);
        setLevel(currentLevel);
    }
    
    function changeLevels() {
        var newMap;
        if (currentLevelName == "Stage")
            newMap = "Stage2";
        else if (currentLevelName == "Stage2")
            newMap = "Stage3";
        
        var newLevel = gameWorld[newMap];
        
        if (!newLevel)
            return;
        if (newLevel != currentLevel) {
            currentLevel.removeActor(player);
        }

        newLevel.spawnPlayer(player, newLevel.levelSpawn.location);
        setLevel(newLevel);
        currentLevelName = newMap;
        transition = null;

        player.respawnToAlive();
    }

    function centerScreen() {
        var totalMapSize = new Point(currentLevel.mapSize.X * tileSize * gameScale, currentLevel.mapSize.Y * tileSize * gameScale);
        var newScreenLocation = new Point(0, 0);
    
        if (totalMapSize.X < stageWidth)
            newScreenLocation.X = (stageWidth / 2) - (totalMapSize.X / 2) / gameScale;
        else {
            newScreenLocation.X = (stageWidth / 2) - (player.location.X + player.size.X / 2) * gameScale;
    
            if (newScreenLocation.X > 0)
                newScreenLocation.X = 0;
            else if (player.location.X * gameScale + (player.size.X / 2) + (stageWidth / 2) > totalMapSize.X)
                newScreenLocation.X = stageWidth - totalMapSize.X;
        }
        
        if (totalMapSize.Y < stageHeight)
            newScreenLocation.Y = (stageHeight / 2) - (totalMapSize.Y / 2) / gameScale;
        else {
            newScreenLocation.Y = (stageHeight / 2 ) - (player.location.Y + player.size.Y / 2) * gameScale;
    
            if (newScreenLocation.Y > 0)
                newScreenLocation.Y = 0;
            else if (player.location.Y * gameScale + (player.size.Y / 2) + (stageHeight / 2) > totalMapSize.Y)
                newScreenLocation.Y = stageHeight - totalMapSize.Y;
        }
    
        currentLevel.levelContainer.x = Math.round(newScreenLocation.X);
        currentLevel.levelContainer.y = Math.round(newScreenLocation.Y);
        currentLevel.screenPosition = newScreenLocation;
    }
    function checkScreenwrap() {
        var totalMapSize = new Point(currentLevel.mapSize.X * tileSize * gameScale, currentLevel.mapSize.Y * tileSize * gameScale);

        if (currentLevel.levelScreenWrap) {

            if (player.location.X >= totalMapSize.X)
                player.location.X = player.size.X;
            else if (player.location.X + player.size.X <= 0)
                player.location.X = totalMapSize.X - player.size.X;

            if (player.location.Y >= totalMapSize.Y)
                player.location.Y = player.size.Y;
            else if (player.location.Y + player.size.Y <= 0)
                player.location.Y = totalMapSize.Y - player.size.Y;
        }
        else {
            
            if (player.location.X + player.size.X >= totalMapSize.X)
                player.location.X = totalMapSize.X - player.size.X;
            else if (player.location.X <= 0)
                player.location.X = 0;

            if (player.location.Y + player.size.Y >= totalMapSize.Y) {
                player.location.Y = totalMapSize.Y - player.size.Y;
            }
            else if (player.location.Y <= 0)
                player.location.Y = 0;
        }
    }
    
    //#region Input Handling

    function onKeyDown(event) {
        var keyCode = event.keyCode;
        
        if (gameStatus === GameState.RUNNING) {

            if (keyCode == 68 || keyCode == 39)             // d || right arrow
                player.setActorDirection("right", true);
            else if (keyCode == 65 || keyCode == 37)        // a || left arrow
                player.setActorDirection("left", true);
            if (keyCode == 87 || keyCode == 38)             // w || up arrow
                player.setActorDirection("up", true);
            if (keyCode == 83 || keyCode == 40)             // s || down arrow
                player.setActorDirection("down", true);

            else if (isAttackKey(keyCode))
                player.attackHold();
        }

    }
    function onKeyUp(event) {
        var keyCode = event.keyCode;
        
        if (gameStatus === GameState.RUNNING) {

            if (keyCode == 68 || keyCode == 39)             // d || right arrow
                player.setActorDirection("right", false);
            else if (keyCode == 65 || keyCode == 37)        // a || left arrow
                player.setActorDirection("left", false);
            if (keyCode == 87 || keyCode == 38)             // w || up arrow
                player.setActorDirection("up", false);
            if (keyCode == 83 || keyCode == 40)             // s || down arrow
                player.setActorDirection("down", false);
                
            else if (isAttackKey(keyCode))
                player.attackRelease();

            else if (keyCode == 82)     //  r
                resetCurrentLevel();

            else if (keyCode == 84)     //  t
                currentLevel.toggleHitboxDisplay();
        }
    }

    function isAttackKey(keyCode) {
        return (keyCode == 32 || keyCode == 74 || keyCode == 69 || keyCode == 90);  //  space || j || e || z
    }


    class LoadBar {

        constructor(progress, destination) {
            this.progress = progress;
            this.destination = destination;

            this.barWidth = Math.round(stageWidth * .7);
            this.barHeight = 32;

            this.createBar();
        }
        createBar() {
            this.loadBarContainer = new createjs.Container();
            
            this.barBG = new createjs.Shape();
            this.barBG.graphics.beginFill("#272744").drawRect(0, 0, this.barWidth, this.barHeight);
            this.barOutline = new createjs.Shape();
            this.barOutline.graphics.setStrokeStyle(2).beginStroke("#fbf5ef").drawRect(0, 0, this.barWidth, this.barHeight);
            this.barBG.x = this.barOutline.x = Math.round(stageWidth / 2 - this.barWidth / 2);
            this.barBG.y = this.barOutline.y = Math.round(stageHeight * 0.6);
            
            this.barProgress = new createjs.Shape();
            this.barProgress.graphics.beginFill("#6dffe4").drawRect(0, 0, this.barWidth - 16, this.barHeight - 16);
            this.barProgress.x = this.barOutline.x + 8;
            this.barProgress.y = this.barOutline.y + 8;
            
            this.barFill = new createjs.Shape();
            this.barFill.graphics.beginFill("#6dffe4").drawRect(0, 0, this.barWidth - 16, this.barHeight - 16);
            this.barFill.x = this.barOutline.x + 8;
            this.barFill.y = this.barOutline.y + 8;
            this.barFill.mask = this.barProgress;

            this.percentText = new createjs.Text(Math.round(100 * this.progress / this.destination) + "%", "32px Equipment", "#6dffe4")
            this.progressText = new createjs.Text( "(" + this.progress + " / " + this.destination + ")", "24px Equipment", "#6dffe4");

            this.percentText.x = Math.round(stageWidth / 2 - this.percentText.getMeasuredWidth() / 2);
            this.progressText.x = this.percentText.x + this.percentText.getMeasuredWidth() + 30;
            this.percentText.y = this.barBG.y - this.percentText.getMeasuredLineHeight() - 20;
            this.progressText.y = this.percentText.y + Math.round(this.percentText.getMeasuredLineHeight() - this.progressText.getMeasuredLineHeight());

            this.loadBarContainer.addChild(this.percentText, this.progressText, this.barBG, this.barOutline, this.barProgress);
            this.updateBarProgress(this.progress);
        }

        updateBarProgress(newProgress) {
            this.progress = newProgress;

            this.barProgress.scaleX = this.progress / this.destination;
            this.percentText.text = Math.round(100 * this.progress / this.destination) + "%";
            this.progressText.text = "(" + this.progress + " / " + this.destination + ")";
        }
    }

});