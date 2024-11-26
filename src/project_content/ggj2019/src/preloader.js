
var stage;
var stageWidth = 640;
var stageHeight = 480;
var tileSize = 32;
var gameScale = 1;
var screenLocation;

var assetLoader;
var assetsLoaded = 0;
var soundRoot = "./lib/sounds/";
var imageRoot = "./lib/images/";
var imageManifest;
var soundManifest;
var mapList;
var totalMapsLoaded = 0;
var gameAssets;

var gameStarted = false;
var currentLevel;
var player;

$(function() {
    init();
});

function init() {
    
    stage = new createjs.Stage("gameCanvas", { "antialias" : false });
    createjs.Ticker.framerate = 60;

    imageManifest = [
        {src: "Tileset.png", id: "Tileset"},
        {src: "Player.png", id: "Player"},
        {src: "Glide.png", id: "Glide"},

        {src: "House.png", id: "House"},
        {src: "Moon.png", id: "Moon"}
    ];
    soundManifest = [

    ];
    mapList = [
        'Sandbox', 'Glidebox'
    ];
    
    gameAssets = {};
    mapData = {};
    
    assetLoader = new createjs.LoadQueue(false);
    assetLoader.addEventListener("complete", handleAssetsLoaded);
    assetLoader.loadManifest(imageManifest, true, imageRoot);

    gameCanvas.setAttribute("tabindex", "0");
    gameCanvas.addEventListener("mouseover", function(event) {
        gameCanvas.focus();
    }, false);
}

function finishedLoading() {
    return (
        (totalMapsLoaded >= mapList.length) && 
        (assetsLoaded >= imageManifest.length + soundManifest.length)
    );
}

function handleAssetsLoaded(event) {
    for (let i = 0; i < imageManifest.length; i++) {
        gameAssets[imageManifest[i].id] = assetLoader.getResult(imageManifest[i].id);
        assetsLoaded += 1;
    }

    for (let j = 0; j < mapList.length; j++) {
        loadMap(mapList[j]);
    }
}

function loadSounds() {
    for (let j = 0; j < soundManifest.length; j++) {
        var sound = new Howl({
            src: [soundRoot + soundManifest[j].src],
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


