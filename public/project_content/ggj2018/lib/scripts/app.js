
var backgroundLoop;
var backgroundSoundID = "Background";

var player;
var powerBar;
var powerAmount;
var maxPower;

var stage;
var stageWidth;
var stageHeight;
var borderSize;

var signalTypes;
var nodes;
var nodeRadius;
var nodeColor;

function init() {

    player = new Player("#FF3333");
    powerAmount = 0;
    maxPower = 500;

    stage = new createjs.Stage("demoCanvas");
    stageWidth = 800;
    stageHeight = 800;
    borderSize = 80;
    
    var numOfSignalTypes = 4;
    signalTypes = [];
    nodes = [];
    nodeRadius = 5;
    nodeColor = "#D3D3D3";
    
    powerBar = new createjs.Shape();
    initializeSignals(numOfSignalTypes);
    initializeNodes(200, 10, numOfSignalTypes);
    
    stage.update();
    stage.enableMouseOver(20);
    createjs.Ticker.addEventListener("tick", updateMap);
    createjs.Ticker.addEventListener("tick", updatePowerAmount);
    createjs.Ticker.addEventListener("tick", updatePowerBar);
    createjs.Ticker.addEventListener("tick", stage);

    loopBackground();
}
function loadSounds(){
    createjs.Sound.registerSound("./lib/sounds/background.mp3", backgroundSoundID);
}
function loopBackground(){
    
    var sound = new Howl({
        src: ['./lib/sounds/background.mp3'],
        loop: true,
        volume: 0.3,
    }).play();

    backgroundLoop = createjs.Sound.play(backgroundSoundID);
}

function updateMap(event){
    
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].updateSignalReception();
        nodes[i].updateSignalInfo();
        nodes[i].updateTransmission();
        nodes[i].checkTransmissionReceived(nodes);
    }

    stage.update();
}
function updatePowerAmount(event) {
    if (powerAmount < maxPower)
        powerAmount += 1;
}
function updatePowerBar(event){

    if (powerAmount < 0)
        powerAmount = 0;

    powerBar.graphics.clear();
    powerBar.graphics.setStrokeStyle(1).beginStroke(player.signalColor).beginFill(player.signalColor)
        .drawRoundRect(borderSize / 2, borderSize / 8, 
        Math.max(5, (powerAmount / maxPower) * (stageWidth - borderSize)), borderSize / 8, 4).endFill();
    stage.addChild(powerBar);
}

function initializeSignals(numOfSignalTypes) {
    for(var i = 0; i < numOfSignalTypes; i++){
        var color = getNewSignalColor(i, numOfSignalTypes);
        var signal = new Signal(i, color);
        signalTypes.push(signal);
    }
}
function getNewSignalColor(index, numOfSignalTypes) {
    var hue = 60 + Math.floor((index + 1) * (200 / numOfSignalTypes));

    return $.Color({
        hue: hue,
        saturation: 0.9,
        lightness: 0.6,
        alpha: 1
    }).toHexString();
}

function initializeNodes(numOfNodes, partitions, numOfSignalTypes){
    
    var signalIndex = 0;
    var minimumDistance = 40;
    var maximumDistance = 80;

    for (var i = 0; i < numOfNodes; i++) {

        var signalType = null;
        if(i < signalTypes.length) {
            signalType = signalTypes[signalIndex];
            signalIndex += 1;
        }

        var nodeLocation = getValidNodePosition(100, 
            (signalType == null ? minimumDistance : minimumDistance * 10),
            (signalType == null ? maximumDistance : maximumDistance * 100));

        var node;
        if (signalType != null)
            node = new Node(nodeRadius * 2, nodeColor, nodeLocation, 120, signalType, 1, 5, 20, true);
        else
            node = new Node(nodeRadius, nodeColor, nodeLocation, 120, signalType);
        
        addNewNode(node);
    }
}
function nodeIsSignalSource(index, numOfNodes, numOfSignalTypes){
    return (index % Math.floor(numOfNodes / numOfSignalTypes) == 0);
}
function getValidNodePosition(numOfTries, minDistance, maxDistance){
    
    var newLocation;
    for (var i = 0; i < numOfTries; i++) {
        
        newLocation = getRandomNodePosition();

        if (nodes.length == 0)
            break;
        else if (isNodePositionValid(newLocation, minDistance, maxDistance))
            break;
    }
    
    return newLocation;
}
function getRandomNodePosition(){
    var randomA = Math.random();
    var randomB = Math.random();
    var xBoundary = (stageWidth / 2) - (borderSize / 2);
    var yBoundary = (stageHeight / 2) - (borderSize / 2);

    xPos = Math.floor(randomB * xBoundary) * Math.cos(2 * Math.PI * randomA / randomB) + stageWidth / 2;
    yPos = Math.floor(randomB * yBoundary) * Math.sin(2 * Math.PI * randomA / randomB) + stageHeight / 2;

    return new Point(xPos, yPos);
}
function isNodePositionValid(newLocation, minDistance, maxDistance){
    
    var outsideMinDistance = true;
    var insideMaxDistance = false;

    for (var j = 0; j < nodes.length; j++) {
        var distanceFromNode = Math.abs(newLocation.xPos - nodes[j].location.xPos) + Math.abs(newLocation.yPos - nodes[j].location.yPos);

        if (distanceFromNode < minDistance)
            outsideMinDistance = false;
        if (distanceFromNode < maxDistance)
            insideMaxDistance = true;
    }

    if (outsideMinDistance && insideMaxDistance)
        return true;
    else
        return false;
}

function addNewNode(node) {

    nodes.push(node);
    stage.addChild(node.circle);
    stage.addChild(node.circleOutline);

    if (node.isSourceNode)
        return;

    node.circle.on("mousedown", function() {
            if (node.signalMemberships.length == 0)
                return;
            if (powerAmount < 100)
                return;
            
            node.circle.scaleX = 1;
            node.circle.scaleY = 1;
            createjs.Tween.removeTweens(node.circle);

            player.selectedNode = node;
            player.selectedNode.setPlayerControl(player);
            powerAmount -= 100;

            createjs.Ticker.removeEventListener("tick", updatePowerAmount);
            createjs.Ticker.removeEventListener("tick", updateMap);
            createjs.Ticker.addEventListener("tick", chargeSignal);
            stage.on("stagemouseup", releaseNode);
    }, false);
    
    node.circle.on("mouseover", function() {
        if (node.signalMemberships.length == 0)
            return;
        
        createjs.Tween.get(node.circle, { loop: true })
            .to({scaleX: 2.5, scaleY: 2.5}, 200, createjs.Ease.circOut)
            .to({scaleX: 1, scaleY: 1}, 200, createjs.Ease.circIn);

    }, false);
    
    node.circle.on("mouseout", function() {
        
        createjs.Tween.removeTweens(node.circle);
        createjs.Tween.get(node.circle, { loop: false })
            .to({scaleX: 1, scaleY: 1}, 600, createjs.Ease.backInOut);

    }, false);
}

function releaseNode(event) {

    var soundName = "./lib/sounds/playerPing" + (Math.ceil(Math.random() * 3)) + ".wav";
    var sound = new Howl({
        src: [soundName],
        volume: (player.signalCharge / 60),
    }).play();

    createjs.Ticker.addEventListener("tick", updateMap);
    createjs.Ticker.addEventListener("tick", updatePowerAmount);
    createjs.Ticker.removeEventListener("tick", chargeSignal);
    
    player.selectedNode.firePlayerSignal(player.signalCharge);
    player.signalCharge = 0;
    player.deselectNode();

    stage.removeEventListener("stagemouseup", releaseNode);
    
}
function chargeSignal(event) {

    var finalChargeSize = player.selectedNode.originalRadius * 3;
    var totalChargeTime = 60;

    if (player.signalCharge < totalChargeTime && powerAmount > 0) {

        powerAmount -= (150 / 60);
        player.signalCharge += 1;
        
        player.selectedNode.radius += (finalChargeSize / totalChargeTime) * (totalChargeTime / (player.signalCharge) / 4);
        player.selectedNode.drawCircle();
    }
}

class Node {

    constructor(radius, color, location, frequency, signal, transmissionSpeed = .5, signalStrength = 1, signalResistance = 10, isSourceNode = false) {
        
        this.isSourceNode = isSourceNode;
        this.originalRadius = this.radius = radius;
        this.transmissionRadius = radius;
        this.location = location;

        this.originalFrequency = frequency;
        this.frequency = frequency;
        this.transmissionCounter = 0;

        this.originalTransmissionSpeed = this.transmissionSpeed = transmissionSpeed;
        this.originalSignalStrength = this.signalStrength = signalStrength;
        this.isPlayerSignal = false;

        this.signalMemberships = [];
        this.signalOutput = [];
        this.signalResistance = signalResistance;
        this.signalReceptionFrequency = 20;
        this.signalReceptionCounter = 0;

        if (signal != null) {
            signal.strength = this.signalStrength;
            this.addSignalMembership(signal);
            this.color = signal.Color;
        }
        else
            this.color = color;
        
        this.circle = new createjs.Shape();
        this.circleOutline = new createjs.Shape();
        this.drawCircle();
        this.drawOutline();
    }
    drawCircle(){
        this.circle.graphics.clear();
        this.circle.graphics.beginFill(this.color).drawCircle(0, 0, this.radius).endFill();
        this.circle.x = this.location.xPos;
        this.circle.y = this.location.yPos;
    }
    drawOutline(){
        var tempColor = this.color;
        if (this.isPlayerSignal)
            tempColor = player.signalColor;

        this.circleOutline.graphics.clear();
        this.circleOutline.graphics.setStrokeStyle(this.signalStrength / 2);
        this.circleOutline.graphics.beginStroke(tempColor).drawCircle(0, 0, this.transmissionRadius).endFill();
        this.circleOutline.x = this.location.xPos;
        this.circleOutline.y = this.location.yPos;
    }

    addSignalMembership(signal){
        if(signal.strength < this.signalResistance / 10)
            return;
        if (this.signalMemberships == null)
            this.signalMemberships = [];

        this.signalMemberships.push(signal);

        if (this.signalMemberships.length > this.signalResistance)
            this.signalMemberships.splice(0, this.signalMemberships.length  - this.signalResistance);
    }

    updateSignalReception() {
        if (this.signalReceptionCounter > 0)
            this.signalReceptionCounter -= 1;
    }
    updateTransmission() {
        if (this.signalMemberships.length == 0) 
            return;

        this.transmissionCounter += 1;
        if (this.circleOutline.alpha >= 0.0)
            this.sendTransmission();

        if (this.transmissionCounter > this.frequency) {
            if (this.isPlayerSignal) 
                this.revertFromPlayerSignal();    
            this.resetTransmission();
        }
    }
    revertFromPlayerSignal(){
        this.transmissionStrength = this.originalTransmissionStrength;
        this.transmissionSpeed = this.originalTransmissionSpeed;
        this.isPlayerSignal = false;
    }
    sendTransmission() {
        this.transmissionRadius += this.transmissionSpeed;
        this.circleOutline.alpha -= .01;
        this.drawOutline();
    }
    resetTransmission() {

        this.transmissionCounter = 0;
        this.transmissionRadius = this.radius;
        this.circleOutline.alpha = 1;
        this.drawOutline();
    }

    receiveTransmission(signalValues) {
        var signalSum = 0;
        if (this.isPlayerSignal)
            return;

        if (this.signalReceptionCounter > 0)
            return;
        else
            this.signalReceptionCounter = this.signalReceptionFrequency;

        var hasPlayerSignal = false;
        for (var i = 0; i < signalValues.length; i++) {
            var signal = signalValues[i];

            if(signal.id == player.signal.id)
                hasPlayerSignal = true;
            signalSum += signalValues[i].strength;
            this.addSignalMembership(signal);
        }

        if (signalValues.length > 1 && !this.isSourceNode){
            this.frequency = this.originalFrequency / (signalValues.length * 2);
            this.circleOutline.alpha /= signalValues.length;
        }

        if (Math.random() > .95 && hasPlayerSignal) {
            var soundName = "./lib/sounds/ping" + (Math.ceil(Math.random() * 3)) + ".wav";
            var sound = new Howl({
                src: [soundName],
                volume: .05,
            }).play();
        }

        this.updateSignalType();
    }
    updateSignalType(){
        var blendedColor = this.getBlendedSignalColors();
        if (blendedColor != null)
            this.color = blendedColor;
        
        this.drawCircle();
        this.drawOutline();
    }
    getBlendedSignalColors() {
        var compiledSignalVals = {};
        for (var i = 0; i < this.signalMemberships.length; i++) {
            var signal = this.signalMemberships[i];
            
            if (compiledSignalVals[signal.color] == null)
                compiledSignalVals[signal.color] = 0;
            compiledSignalVals[signal.color] += signal.strength;
        }

        var totalColorList = [];
        for (var color in compiledSignalVals) {
            
            for (var i = 0; i < this.signalMemberships.length; i++) {
                if(this.signalMemberships[i].color == color){

                    for (var j = 0; j < compiledSignalVals[color]; j++){
                        totalColorList.push($.Color(color));
                    }
                }
            }
        }
        return Color_mixer.mix(totalColorList);
    }
    
    updateSignalInfo(){
        this.signalOutput = this.compileSignalTransmission();
    }
    checkTransmissionReceived(nodes){
        if (this.signalMemberships.length == 0) return;
        
        for (var j = 0; j < nodes.length; j++) {
            var otherNode = nodes[j];
            if (this === otherNode)
                continue;

            var xDelta = this.location.xPos - otherNode.location.xPos;
            var yDelta = this.location.yPos - otherNode.location.yPos;
            var radialDist = this.transmissionRadius + otherNode.radius;

            if (Math.pow(xDelta, 2) + Math.pow(yDelta, 2) <= Math.pow(radialDist, 2)) {
                otherNode.receiveTransmission(this.signalOutput);
            }
        }
    }
    compileSignalTransmission() {

        var totalSignalStrength = 0;
        var compiledSignalVals = {};
        var transmissions = [];
        for (var i = 0; i < this.signalMemberships.length; i++) {
            var signal = this.signalMemberships[i];
            
            if (compiledSignalVals[signal.color] == null)
                compiledSignalVals[signal.color] = 0;
            compiledSignalVals[signal.color] += signal.strength;
            totalSignalStrength += signal.strength;
        }

        for (var compColor in compiledSignalVals) {
            if (compiledSignalVals[compColor] < totalSignalStrength / 4)
                continue;

            var tempSignal;
            for (var i = 0; i < this.signalMemberships.length; i++){
                if (this.signalMemberships[i].color == compColor){
                    tempSignal = this.signalMemberships[i];
                    tempSignal.strength = this.signalStrength;
                    transmissions.push(tempSignal);
                    break;
                }
            }
        }

        return transmissions;
    }

    setPlayerControl(player){
        this.signalMemberships = [];
        this.color = player.signalColor;
        this.drawCircle();
        this.drawOutline();
    }

    firePlayerSignal(charge) {
        
        this.signalStrength = this.originalSignalStrength * Math.max(1, charge / 20);
        player.signal.strength = this.signalStrength;
        this.addSignalMembership(player.signal);
        this.color = player.signalColor;
        this.radius = this.originalRadius;
        this.drawCircle();

        this.resetTransmission();
        this.isPlayerSignal = true;
        this.frequency = this.originalFrequency;
        this.transmissionSpeed = this.originalTransmissionSpeed * Math.max(1, (charge / 20));
    }

}

class Signal {
    
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.strength = 1;
    }
    get Color(){
        return this.color;
    }
}

class Point {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

class Player{
    constructor(signalColor) {
        this.signal = new Signal(100, signalColor);
        this.signalColor = signalColor;
        this.selectedNode = null;
        this.signalCharge = 0;
    }

    deselectNode(){
        if (this.selectedNode != null) {
            this.selectedNode.radius = this.selectedNode.originalRadius;
            this.selectedNode.drawCircle();

            this.selectedNode = null;
        }
    }
}

