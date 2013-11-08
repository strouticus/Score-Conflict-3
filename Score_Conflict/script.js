// Score Conflict
// Copyright Mark Foster and Andrew Strout 2013
// All Rights Reserved

var PIXEL_SIZE = 7.5;

var STAGE_WIDTH = 960;
var STAGE_HEIGHT = 480;

var GM;
var IL;
var RD;
var CL;

var player1Sprite;
var player2Sprite;

var player1Entity;
var player2Entity;

var ballEntity;

var groundShape;

var goalEntity;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

var testCanvas = document.createElement('canvas');
	testCanvas.setAttribute("id", "canvasTest");
	testCanvas.width = canvas.width;
	testCanvas.height = canvas.height;
var testctx = testCanvas.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;

var spritesToLoad = ["SCD_Blocking.png", "SCD_CrashLand.png", "SCD_Dash_Ground.png", "SCD_Down.png", "SCD_Getup.png", "SCD_Hitstun.png", "SCD_Idle.png", "SCD_JumpFalling.png", "SCD_JumpLanding.png", "SCD_JumpRising.png", "SCD_JumpSwitch.png", "SCD_JumpTakeoff.png", "SCD_KickHold.png", "SCD_KickRelease.png", "SCD_KickWindup.png", "SCD_Launched.png", "SCD_Launched02.png", "SCD_PunchCombo.png", "SCD_Trip.png", "SCD_Tripped_02.png", "SCD_WalkRight.png", "SCD_Charging.png", "SCD_Spiking.png", "SCD_Flip.png", "SCD_FlipLandSafe.png", "SCD_DownTurn.png", "SCD_FlipLandTrip.png"];

var imageReference = {
	idle: "SCD_Idle.png", walking: "SCD_WalkRight.png",
	jumpTakeoff: "SCD_JumpTakeoff.png", jumpRising: "SCD_JumpRising.png", jumpApex: "SCD_JumpSwitch.png", jumpFalling: "SCD_JumpFalling.png", jumpLanding: "SCD_JumpLanding.png",
	blockingGround: "SCD_Blocking.png", blockingAir: "SCD_Blocking.png", dashGround: "SCD_Dash_Ground.png", dashAir: "SCD_Dash_Ground.png",
	kickWindup: "SCD_KickWindup.png", kickHold: "SCD_KickHold.png", kickRelease: "SCD_KickRelease.png",
	punching: "SCD_PunchCombo.png", tripping: "SCD_Trip.png", charging: "SCD_Charging.png", spiking: "SCD_Spiking.png",
	hitstun: "SCD_Hitstun.png", launched: "SCD_Launched.png", crashland: "SCD_CrashLand.png", tripped: "SCD_Tripped_02.png", down: "SCD_Down.png", getup: "SCD_Getup.png",
	flip: "SCD_Flip.png", flipLandSafe: "SCD_FlipLandSafe.png", downTurn: "SCD_DownTurn.png", flipLandTrip: "SCD_FlipLandTrip.png"
}

function Init () {
	//Start up
	GM = new GameMusic(["scorn_flontift.ogg", "song2.ogg"]);
	IL = new ImageLoader(spritesToLoad, ["illegal_sky.png", "blursky.png", "blend.png"], ["Ball.png"])
	RD = new Render();
	CL = new Collision();

	groundShape = new GroundShape([{x:0, y:460}, {x:960, y:460}]);

	player1Sprite = new Sprite(imageReference, 0, player1Entity);
	player2Sprite = new Sprite(imageReference, 1, player2Entity);

	player1Entity = new PlayerEntity([87, 65, 83, 68, 67, 86], player1Sprite);
	player2Entity = new PlayerEntity([38, 37, 40, 39, 96, 110], player2Sprite);

	player1Entity.x = 100;
	player2Entity.x = 860;
	player2Entity.direction = "left";
	keyPressedOrder.push(110);

	ballEntity = new BallEntity();

	goalEntity = new GoalEntity(50, 300);

	player1Sprite.linkedEntity = player1Entity;
	player2Sprite.linkedEntity = player2Entity;

	player1Entity.linkedSprite = player1Sprite;
	player2Entity.linkedSprite = player2Sprite;

	player1Entity.enemyEntity = player2Entity;
	player2Entity.enemyEntity = player1Entity;

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	requestAnimFrame(Update);

	
}


function Update () {
	requestAnimFrame(Update);

	slowMotion = 0;
	player1Entity.SelfUpdate();
	player2Entity.SelfUpdate();
	ballEntity.SelfUpdate();


	RD.RenderFrame();

}