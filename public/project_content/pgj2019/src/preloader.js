
const GameState = { 
    "PRELOADING": 1, "PRELOADED": 2, "LOADING": 3, "RUNNING": 4,
    "LEVELSELECTED": 5, "LEVELPAUSED": 6, "LEVELEND": 7, "LEVELEXIT": 8
};
const ButtonTypes = {
    "NULL" : 1, "NEWGAME": 2, "INSTRUCTIONS": 3, "LOADLEVEL": 4,
    "NEXTLEVEL": 5, "RETRYLEVEL": 6, "LEVELSELECT": 7,
    "SANDBOX": 100
 };

// Display variables
var stage;
var stageWidth = 960;
var stageHeight = 640;
var borderSize;
var tileSize = 32;
var gameScale;

// Preloader variables
var soundRoot = "./lib/sounds/";
var imageRoot = "./lib/images/";
var dialogueRoot = "./data/dialogues/";
var imageManifest;
var soundManifest;
var assetLoader;

var dialogueList = [];
var mapList = [];
var tileList = [];

var assetsLoaded = 0;
var totalMapsLoaded = 0;
var totalMapsInGame = 0;
var totalFilesLoaded = 0;
var totalFilesInGame = 0;

var totalGameManifest;
var loadProgress = 0;
var gameStatus;

var startingMap;

// Asset variables
var dialogueLibrary = {};
var particleEffectLibrary = {};
var backgroundLibrary = {};

var actionLibrary = {};
var controllerData;
var hitBoxData;
var attackData;

var gameAssets = {};
var soundAssets = {};
var mapData = {};
var tileData = {};

// Game global variables
var gameWorld = {};
var gameSaveState = {};
var player;
var currentLevel;
var objectFactory;
var levelSeriesMatrix;

var levelsCompleted = 0;
var ranksAchieved = 0;
var shardsRetrieved = 0;
var spinAttackSize = 60;

// Global vars for relocating the player
var transition = null;
var currentLevelName;
var currentCheckpoint = null;

// UI global vars
var pauseGame;
var unpauseGame;
var currentMenu = null;
var mainMenu;
var levelSelectMenu;

var currentStatement = null;
var currentDialogue = null;
var gameStatsDisplay;
var levelEndDisplay;
var gameScore;

// Sound global vars
var soundPlayer;
var levelTheme;
var soundEffectsOn = true;
var musicOn = true;


$(function() { 
    init(); 
});

function init() {

    stage = new createjs.Stage("gameCanvas", { "antialias" : false });
    createjs.Ticker.framerate = 60;
    gameScale = 1;
    
    imageManifest = [
        {src: "tiles/CoreTileset.png", id: "CoreTileset"},

        {src: "actors/Player.png", id: "Player"}, {src: "actors/Player2.png", id: "Player2"}, {src: "actors/Enemy.png", id: "Enemy"},
        {src: "props/Shard.png", id: "Shard"}, {src: "props/Chalice.png", id: "Chalice"}
    ];
    soundManifest = [
        {src: "Hit.wav", id: "Hit"}
    ];

    mapList = [
        "Stage", "Stage2", "Stage3"
    ];
    tileList = [
        "CoreTileset"
    ];
    levelSeriesMatrix = [];

    dialogueList = [];
    totalMapsInGame = mapList.length;
    for (var i = 0; i < levelSeriesMatrix.length; i++)
        totalMapsInGame += levelSeriesMatrix[i][1];
    
    totalFilesInGame = dialogueList.length + tileList.length + 4; // actionData.json, dialogue.json, particleEffects.json, backgrounds.json
    startingMap = "Stage";
    currentLevelName = startingMap;

    totalGameManifest = imageManifest.length + soundManifest.length + totalFilesInGame + totalMapsInGame;

    assetLoader = new createjs.LoadQueue(false);
    assetLoader.addEventListener("complete", handleAssetsLoaded);
    assetLoader.loadManifest(imageManifest, true, imageRoot);
    
    gameCanvas.setAttribute("tabindex", "0");
    gameCanvas.addEventListener("mouseover", function(event) {
        gameCanvas.focus();
    }, false);
    
    gameCanvas.addEventListener("focusout", function(event) {
        pauseGame = true;
    }, false);
    gameCanvas.addEventListener("focus", function(event) {
        unpauseGame = true;
    }, false);
}


function finishedLoading() {
    return (
        (totalMapsLoaded >= totalMapsInGame) && 
        (totalFilesLoaded >= totalFilesInGame) && 
        (dialogueLibrary != null && particleEffectLibrary != null && backgroundLibrary != null) &&
        (assetsLoaded >= imageManifest.length + soundManifest.length)
    );
}

function handleAssetsLoaded(event) {
    for (let i = 0; i < imageManifest.length; i++) {
        console.log("Loaded asset: " + imageManifest[i].id);
        gameAssets[imageManifest[i].id] = assetLoader.getResult(imageManifest[i].id);
        assetsLoaded += 1;
    }
    
    for (let s = 0; s < levelSeriesMatrix.length; s++) {
        var series = levelSeriesMatrix[s];
        loadMapSeries(series[0], series[1]);
    }

    for (let j = 0; j < mapList.length; j++) {
        loadMap(mapList[j]);
    }
    for (let t = 0; t < tileList.length; t++) {
        loadTileset(tileList[t]);
    }

    loadFile("./data/actionData.json?v=", actionLibrary);
    loadFile("./data/particleEffects.json?v=", particleEffectLibrary);
    loadFile("./data/backgrounds.json?v=", backgroundLibrary);
    loadFile("./data/dialogue.json?v=", dialogueLibrary);
    for (let d = 0; d < dialogueList.length; d++) {
        loadFile(dialogueRoot + dialogueList[d], dialogueLibrary);
    }

    loadSounds();
}
function loadSounds() {
    for (let j = 0; j < soundManifest.length; j++) {
        soundAssets[soundManifest[j].id] = soundManifest[j].src + "?v=" + Math.round(1000 * Math.random(1000));
        var sound = new Howl({
            src: [soundRoot + soundAssets[soundManifest[j].id]],
            loop: true,
            volume: 0,
            stereo: 0
        });
        sound.once('load', function() {
            console.log("Loaded asset: " + soundManifest[j].src);
            assetsLoaded += 1;
        });
    }
}

function loadFile(filePath, fileLibrary) {
    $.getJSON(filePath + ".json?v=" +  (new Date()).getTime(), function(data) {
        Object.assign(fileLibrary, data);
        totalFilesLoaded += 1;
    })
    .fail(function() {
        totalFilesLoaded += 1;
        console.log(filePath + " failed to load"); 
    });
}
function loadMapSeries(seriesNum, numOfLevels) {
    for (var i = 1; i <= numOfLevels; i++) {
        var mapName = getLevelName(seriesNum, i);
        loadMap(mapName);
    }
}
function loadMap(mapName) {
    $.getJSON("./lib/maps/" + mapName + ".json?v=" +  (new Date()).getTime(), function(data) {
        totalMapsLoaded += 1;
        mapData[mapName] = data;
    })
    .fail(function() {
        totalMapsLoaded += 1;
        console.log(mapName + " failed to load"); 
    });
}
function loadTileset(tilesetName) {
    $.getJSON("./lib/tiles/" + tilesetName + ".json?v=" +  (new Date()).getTime(), function(data) {
        totalFilesLoaded += 1;
        tileData[tilesetName] = data;
    })
    .fail(function() {
        totalFilesLoaded += 1;
        console.log(tilesetName + " failed to load");
    });
}

function getLevelName(seriesNum, levelNum) {
    return "Stage_" + seriesNum + "_" + levelNum;
}
function getMapSeries(mapName) {
    if (mapName.indexOf("Stage_") == 0)
        return parseInt(mapName[6]);
}
function getMapLevel(mapName) {
    if (mapName.indexOf("Stage_") == 0)
        return parseInt(mapName[8]);
}