require(['Player', 'Level', 'Point'], function(Player, Level, Point) {

    $(function() {
        initGame();
    });

    function initGame() {
        createjs.Ticker.addEventListener("tick", updateGame);
    }

    function updateGame() {
        
        if (!gameStarted) {
            if (!finishedLoading())
                return;
            gameStarted = true;
            beginGame();

            return;
        }
        
        updateGameMap();
    }

    function beginGame() {

        currentLevel = new Level();
        player = new Player(new Point(28, 64));
        currentLevel.spawnPlayer(player);
        
        stage.addChild(currentLevel.levelContainer);
        
        addEventListener("keydown", onKeyDown, false);
        addEventListener("keyup", onKeyUp, false);
    }

    function updateGameMap() {

        centerScreen();
        checkPlayerInSpace();

        currentLevel.updateLevel();
        stage.update();
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

        screenLocation = newScreenLocation;
    }

    function checkPlayerInSpace() {
        var spaceThreshold = 125;
        var playerYcoord = Math.floor(player.location.Y / tileSize);
        
        if (!player.isFloating && playerYcoord < spaceThreshold) {

            if (player.isGliding)
                player.setPlayerGlideStop();
            player.setPlayerFloat();
        }
        else if (player.isFloating && playerYcoord > spaceThreshold)
            player.setPlayerFloatStop();
    }


    //#region Input Handling

    function onKeyDown(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {

            case 68: //d
                player.setPlayerDirection("right", true);
                break;
            case 39: //right arrow
                player.setPlayerDirection("right", true);
                break;

            case 65: //a
                player.setPlayerDirection("left", true);
                break;
            case 37: // left arrow
                player.setPlayerDirection("left", true);
                break;
                
            case 13: // enter
                player.setPlayerJump();
                break;
            case 16: // shift
                player.setPlayerJump();
                break;
            case 90: // z
                player.setPlayerJump();
                break;
    
        }
    }
    function onKeyUp(event) {
        
        var keyCode = event.keyCode;
        switch (keyCode) {
            
            case 68: // d
                player.setPlayerDirection("right", false);
                break;
            case 39: //right arrow
                player.setPlayerDirection("right", false);
                break;
                
            case 65: // a
                player.setPlayerDirection("left", false);
                break;
            case 37: // left arrow
                player.setPlayerDirection("left", false);
                break;

            case 13: // enter
                player.releasePlayerJump();
                break;
            case 16: // shift
                player.releasePlayerJump();
                break;
            case 32: // space
                player.releasePlayerJump();
                break;
            case 90: // z
                player.releasePlayerJump();
                break;

            case 69:  // e

                break;
        }
    }

});