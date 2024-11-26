define("StatsDisplay", ['Point'], function(Point) {

    class StatsDisplay {

        constructor() {

            this.origin = new Point(12, 12);
            this.yMargin = 6;
            this.xMargin = 10;

            this.statsContainer = new createjs.Container();
            
            // this.initiateSoundUI();
        }

        initiateStatDisplay() {
            this.statsContainer.removeChild(
                this.recoveryTimer
            );

            this.recoveryTimer = new createjs.Shape();
            this.recoveryTimer.graphics.beginFill("#ff004d").drawRect(0, 0, stageWidth - 64, 64);
            this.recoveryTimer.x = 32;
            this.recoveryTimer.y = stageHeight - 64;
            this.recoveryTimer.scaleX = 0;

            this.statsContainer.addChild(
                this.recoveryTimer
            );
        }

        initiateSoundUI() {
            var buttonSize = 32;

            var soundBtnImg = new createjs.SpriteSheet({
                "images": [gameAssets["SoundButton"]], "frames": {"width": buttonSize, "height": buttonSize, "regX": 0, "regY": 0, "count": 2}, animations: { on: 0, off: 1 }
            });
            this.soundButton = new createjs.Sprite(soundBtnImg);
            this.soundButton.x = stageWidth - buttonSize * 3.5;
            this.soundButton.y = buttonSize / 2;

            this.soundButton.gotoAndPlay( soundEffectsOn ? "on" : "off");
            this.soundButton.addEventListener("click", function(event) { 
                soundEffectsOn = !soundEffectsOn;
                event.target.gotoAndPlay( soundEffectsOn ? "on" : "off");
            });
            
            var musicBtnImg = new createjs.SpriteSheet({
                "images": [gameAssets["MusicButton"]], "frames": {"width": buttonSize, "height": buttonSize, "regX": 0, "regY": 0, "count": 2}, animations: { on: 0, off: 1 }
            });
            this.musicButton = new createjs.Sprite(musicBtnImg);
            this.musicButton.x = stageWidth - buttonSize * 2;
            this.musicButton.y = buttonSize / 2;

            this.musicButton.gotoAndPlay( musicOn ? "on" : "off");
            this.musicButton.addEventListener("click", function(event) { 
                musicOn = !musicOn; 
                event.target.gotoAndPlay( musicOn ? "on" : "off");

                if (!musicOn)
                    soundPlayer.pause(levelTheme);
                else if (levelTheme)
                    soundPlayer.play(levelTheme);
                else
                    levelTheme = soundPlayer.play();
            });

            this.statsContainer.addChild(this.soundButton, this.musicButton);
        }

        setTextFieldPos(x, y, txt) {
            txt.x = Math.round(x);
            txt.y = Math.round(y);
            txt.shadow = new createjs.Shadow("#453e78", 2, 2, 0);
        }

        updateStats() {
            this.scoreValue.text = gameScore;

            this.collectibleValue.text = player.collectiblesGathered + "/" + currentLevel.numOfCollectibles;

            this.enemyValue.text = (currentLevel.numOfEnemies - currentLevel.enemiesRemaining) + "/" + currentLevel.numOfEnemies;
        }

        updateRecoveryTimer(val, maxVal) {

            this.recoveryTimer.scaleX = val / maxVal;

        }

        
    }

    
    return StatsDisplay;

});