// Score Conflict
// Copyright Mark Foster and Andrew Strout 2013 - 2014
// All Rights Reserved


var PIXEL_SIZE = 7.5;

var STAGE_WIDTH = 960;
var STAGE_HEIGHT = 480;

var ROUND_OVER_TIME = 100;
var ROUND_START_TIME = 70;



var GM;
var IL;
var RD;
var CL;

var player1Sprite;
var player2Sprite;

var player1Entity;
var player2Entity;

var tut1Sprite;
var tut2Sprite;
var tut1Entity;
var tut2Entity;
var tut1Ball;
var tut2Ball;

var ballEntity;

var groundShape;

var goalEntity;

var goalsToWin = 5;

var currentBG = 0;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

var testCanvas = document.createElement('canvas');
	testCanvas.setAttribute("id", "canvasTest");
	testCanvas.width = canvas.width;
	testCanvas.height = canvas.height;
var testctx = testCanvas.getContext('2d');

var goCanvas = document.createElement('canvas');
	goCanvas.setAttribute("id", "canvasGo");
	goCanvas.width = canvas.width;
	goCanvas.height = canvas.height;
var goctx = goCanvas.getContext('2d');

var player1Score = 0;
var player2Score = 0;

var roundStarting = true;
var roundStartingTimer = 0;

var roundOver = false;
var roundOverTimer = 0;
var slowMotion = 0;

var roundTimer = 0;

var winner = -1;

var inLoadScreen = true;
var inMainMenu = false;
var inGame = false;
var inTutorial = false;
var inSettingsScreen = false;
var inP1Wins = false;
var inP2Wins = false;
var inStageSelect = false;;

var startTutorial = false;

var tutorialStateP1 = 0;
var player1TutMesg = ["Welcome to Score Conflict!"];
var tutorialDelayP1 = 50;
var tutorialStepsP1 = [];
var P1_blocked_a_ball = false;
var P1_dodged_attacks = 0;
var P1ImagesToDraw = [];

var tutorialStateP2 = 0;
var player2TutMesg = ["Welcome to Score Conflict!"];
var tutorialDelayP2 = 50;
var tutorialStepsP2 = [];
var P2_blocked_a_ball = false;
var P2_dodged_attacks = 0;
var P2ImagesToDraw = [];

var ARCADE_Y_ADJUST = 100;

var spritesToLoad = ["SCD_Blocking.png", "SCD_CrashLand.png", "SCD_Dash_Ground.png", "SCD_Down.png", "SCD_Getup.png", "SCD_Hitstun.png", "SCD_Idle.png", "SCD_JumpFalling.png", "SCD_JumpLanding.png", "SCD_JumpRising.png", "SCD_JumpSwitch.png", "SCD_JumpTakeoff.png", "SCD_KickHold.png", "SCD_KickRelease.png", "SCD_KickWindup.png", "SCD_Launched.png", "SCD_Launched02.png", "SCD_PunchCombo.png", "SCD_Trip.png", "SCD_Tripped_02.png", "SCD_WalkRight.png", "SCD_Charging.png", "SCD_Spiking.png", "SCD_Flip.png", "SCD_FlipLandSafe.png", "SCD_DownTurn.png", "SCD_FlipLandTrip.png", "SCD_DashAirDown.png", "SCD_DashAirUp.png", "SCD_DashAirDiagonalUp.png", "SCD_DashAirDiagonalDown.png", "SCD_DashAirNeutral.png", "SCD_DashAirSide.png", "SCD_OnePunchExit.png", "SCD_TwoPunchExit.png", "SCD_ShieldLand.png", "SCD_ShieldDownAir.png", "SCD_HitstunBehind.png", "SCD_KickCancel.png", "SCD_DashAirNeutralShieldStart.png", "SCD_DashAirSideShieldStart.png", "SCD_DashAirUpShieldStart.png", "SCD_DashAirDownShieldStart.png", "SCD_DashAirDiagonalDownShieldStart.png", "SCD_DashAirDiagonalUpShieldStart.png", "SCD_AirPunch.png", "SCD_Counter.png", "SCD_CounterEnd.png", "SCD_SlideTackle.png"];

var imageReference = {
	idle: "SCD_Idle.png", walking: "SCD_WalkRight.png",
	jumpTakeoff: "SCD_JumpTakeoff.png", jumpRising: "SCD_JumpRising.png", jumpApex: "SCD_JumpSwitch.png", jumpFalling: "SCD_JumpFalling.png", jumpLanding: "SCD_JumpLanding.png",
	blockingGround: "SCD_Blocking.png", blockingAir: "SCD_Blocking.png", dashGround: "SCD_Dash_Ground.png", dashAir: "SCD_Dash_Ground.png", dashAirSide: "SCD_DashAirSide.png", dashAirDiagonalUp: "SCD_DashAirDiagonalUp.png", dashAirDiagonalDown: "SCD_DashAirDiagonalDown.png", dashAirDown: "SCD_DashAirDown.png", dashAirUp: "SCD_DashAirUp.png", dashAirNeutral: "SCD_DashAirNeutral.png",
	kickWindup: "SCD_KickWindup.png", kickHold: "SCD_KickHold.png", kickRelease: "SCD_KickRelease.png",
	punching: "SCD_PunchCombo.png", tripping: "SCD_Trip.png", charging: "SCD_Charging.png", spiking: "SCD_Spiking.png", airPunching: "SCD_AirPunch.png",
	hitstun: "SCD_Hitstun.png", launched: "SCD_Launched.png", crashland: "SCD_CrashLand.png", tripped: "SCD_Tripped_02.png", down: "SCD_Down.png", getup: "SCD_Getup.png",
	flip: "SCD_Flip.png", flipLandSafe: "SCD_FlipLandSafe.png", downTurn: "SCD_DownTurn.png", flipLandTrip: "SCD_FlipLandTrip.png", onePunchExit: "SCD_OnePunchExit.png", twoPunchExit: "SCD_TwoPunchExit.png", shieldLand: "SCD_ShieldLand.png", shieldDownAir: "SCD_ShieldDownAir.png", hitstunBehind: "SCD_HitstunBehind.png", kickCancel: "SCD_KickCancel.png",
	dashAirNeutralShieldStart: "SCD_DashAirNeutralShieldStart.png", dashAirUpShieldStart: "SCD_DashAirUpShieldStart.png", dashAirDownShieldStart: "SCD_DashAirDownShieldStart.png", dashAirSideShieldStart: "SCD_DashAirSideShieldStart.png", dashAirDiagonalDownShieldStart: "SCD_DashAirDiagonalDown.png", dashAirDiagonalUpShieldStart: "SCD_DashAirDiagonalUpShieldStart.png",
	countering: "SCD_Counter.png", counteringEnd: "SCD_CounterEnd.png",
	slideTackling: "SCD_SlideTackle.png",
}

var soundsToLoad = ["SE_ballcontact1.wav", "SE_block1.wav", "SE_charge1.wav", "SE_hit1.wav", "SE_jump1.wav", "SE_landing1.wav", "SE_uppercut1.wav", "SE_knockout1.wav", "SE_score1.wav", "SE_post1.wav", "SE_post2.wav", "SE_post3.wav"];
var soundNames = [];

for (var i = 0; i < soundsToLoad.length; i++) {
	var sName = soundsToLoad[i].slice(3, soundsToLoad[i].length - 4);
	soundNames.push(sName);
	createjs.Sound.registerSound("Audio/SE/" + soundsToLoad[i], sName);
}


function Init () {
	//Start up
	GM = new GameMusic(["Challenge.ogg", "Magnet.ogg", "Secrets.ogg"]);
	IL = new ImageLoader(spritesToLoad, ["large-Morning.png", "large-Afternoon.png", "large-Evening.png"], ["Ball.png", "360_A.png", "360_B.png", "360_Back_Alt.png", "360_Back.png", "360_Dpad_Down.png", "360_Dpad_Left.png", "360_Dpad_Right.png", "360_Dpad_Up.png", "360_Dpad.png", "360_LB.png", "360_Left_Stick.png", "360_LT.png", "360_RB.png", "360_Right_Stick.png", "360_RT.png", "360_Start_Alt.png", "360_Start.png", "360_X.png", "360_Y.png", "Arcade_Attack.png", "Arcade_AttackHold.png", "Arcade_Down.png", "Arcade_LeftAndRight.png", "Arcade_NoDirection.png", "Arcade_Special.png", "Arcade_Start.png", "Arcade_Up.png", "Arcade_UpAndDown.png"]);
	RD = new Render();
	CL = new Collision();

	//Long flat level
	
	STAGE_WIDTH = 1500
	groundShape = new GroundShape([{x:0, y:460}, {x:1500, y:460}]);

	player1Sprite = new Sprite(imageReference, 0, player1Entity);
	player2Sprite = new Sprite(imageReference, 1, player2Entity);

	player1Entity = new PlayerEntity([87, 65, 83, 68, 67, 86], player1Sprite);
	player2Entity = new PlayerEntity([38, 37, 40, 39, 96, 110], player2Sprite);

	player1Entity.x = STAGE_WIDTH / 2 - 250;
	player2Entity.x = STAGE_WIDTH / 2 + 250;

	player1Entity.direction = "right";
	player2Entity.direction = "left";

	ballEntity = new BallEntity();

	goalEntity = new GoalEntity(100, 300);

	player1Sprite.linkedEntity = player1Entity;
	player2Sprite.linkedEntity = player2Entity;

	player1Entity.linkedSprite = player1Sprite;
	player2Entity.linkedSprite = player2Sprite;

	player1Entity.enemyEntity = player2Entity;
	player2Entity.enemyEntity = player1Entity;

	//Tutorial set up
	tut1Sprite = new Sprite(imageReference, 2, tut1Entity);
	tut2Sprite = new Sprite(imageReference, 3, tut2Entity);
	tut1Entity = new PlayerEntity([0, 0, 0, 0, 0, 0], tut1Sprite);
	tut2Entity = new PlayerEntity([0, 0, 0, 0, 0, 0], tut2Sprite);
	tut1Entity.x = STAGE_WIDTH / 2 - 150;
	tut2Entity.x = STAGE_WIDTH / 2 + 150;
	tut1Ball = new BallEntity();
	tut2Ball = new BallEntity();
	tut1Sprite.linkedEntity = tut1Entity;
	tut2Sprite.linkedEntity = tut2Entity;
	tut1Entity.linkedSprite = tut1Sprite;
	tut2Entity.linkedSprite = tut2Sprite;
	tut1Entity.enemyEntity = player1Entity;
	tut2Entity.enemyEntity = player2Entity;

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	requestAnimFrame(Update);

	player1Entity.controllable = false;
	player2Entity.controllable = false;

	tut1Entity.controllable = false;
	tut2Entity.controllable = false;
	tut1Entity.doAItut = true;
	tut2Entity.doAItut = true;
}

function Player1Goal () {
	roundOver = true;
	winner = 1;
	player1Score ++;
}

function Player2Goal () {
	roundOver = true;
	winner = 2;
	player2Score ++;
}

var fps = 60;
var frameDuration = 1000 / fps;
var accumulatedTime = 0;
var frameOffset = 0;
var lastUpdateTime = 0;
function Update (currentTime) {
	var frameDelta = currentTime - lastUpdateTime;
	
	if (frameDelta > 1000) {
		frameDelta = frameDuration;
	}

	accumulatedTime += frameDelta;

	if (accumulatedTime >= frameDuration) {
		if (inGame)
		{
			InGameUpdate();
		}

		if (inTutorial)
		{
			InTutorialUpdate();
		}

		if (!inGame && ! inTutorial)
		{
			InMenuUpdate();
		}


		accumulatedTime -= frameDuration;
	}

	RD.RenderFrame();

	frameOffset = accumulatedTime / frameDuration;

	lastUpdateTime = currentTime;
	
	requestAnimFrame(Update);

}

function ResetLevel () {

}

function SetStageWidth (newWidth) {
	STAGE_WIDTH = newWidth;
	groundShape.AddPart(newWidth, 460);
}

function CursorUp () {
	if (keyPressedOrder.indexOf(87) != -1 || keyPressedOrder.indexOf(38) != -1)
	{
		return true;
	}
	return false;
}

function CursorDown () {
	if (keyPressedOrder.indexOf(83) != -1 || keyPressedOrder.indexOf(40) != -1)
	{
		return true;
	}
	return false;
}

function CursorLeft () {
	if (keyPressedOrder.indexOf(65) != -1 || keyPressedOrder.indexOf(37) != -1)
	{
		return true;
	}
	return false;
}

function CursorRight () {
	if (keyPressedOrder.indexOf(68) != -1 || keyPressedOrder.indexOf(39) != -1)
	{
		return true;
	}
	return false;
}


var arcadeCursorX = canvas.width / 2;
var arcadeCursorY = canvas.height / 2;

function InMenuUpdate () {
	if (ARCADE_MODE)
	{
		if (CursorUp())
		{
			arcadeCursorY -= 10;
		}
		if (CursorDown())
		{
			arcadeCursorY += 10;
		}
		if (CursorLeft())
		{
			arcadeCursorX -= 10;
		}
		if (CursorRight())
		{
			arcadeCursorX += 10;
		}

		if (arcadeCursorX < 5)
		{
			arcadeCursorX = 5;
		}
		if (arcadeCursorX > canvas.width - 5)
		{
			arcadeCursorX = canvas.width - 5;
		}
		if (arcadeCursorY < 5)
		{
			arcadeCursorY = 5;
		}
		if (arcadeCursorY > canvas.height - 5)
		{
			arcadeCursorY = canvas.height - 5;
		}


		mouseX = (mouseX * 9 + arcadeCursorX) * 0.1;
		mouseY = (mouseY * 9 + arcadeCursorY) * 0.1;
	}
}

function InTutorialUpdate () {
	if (startTutorial)
	{
		player1Entity.controllable = true;
		player2Entity.controllable = true;
		tut1Entity.controllable = true;
		tut2Entity.controllable = true;
	}

	player1Entity.SelfUpdate();
	player2Entity.SelfUpdate();
	tut1Entity.SelfUpdate();
	tut2Entity.SelfUpdate();
	tut1Ball.SelfUpdate();
	tut2Ball.SelfUpdate();

	if (player1Entity.x > STAGE_WIDTH / 2 - 5)
	{
		player1Entity.x = STAGE_WIDTH / 2 - 5;
	}
	if (tut1Entity.x > STAGE_WIDTH / 2 - 5)
	{
		tut1Entity.x = STAGE_WIDTH / 2 - 5;
	}
	if (tut1Ball.x > STAGE_WIDTH / 2 - 5)
	{
		tut1Ball.x = STAGE_WIDTH / 2 - 5;
		tut1Ball.xVel = - Math.abs(tut1Ball.xVel)
	}
	if (player2Entity.x < STAGE_WIDTH / 2 + 5)
	{
		player2Entity.x = STAGE_WIDTH / 2 + 5;
	}
	if (tut2Entity.x < STAGE_WIDTH / 2 + 5)
	{
		tut2Entity.x = STAGE_WIDTH / 2 + 5;
	}
	if (tut2Ball.x < STAGE_WIDTH / 2 + 5)
	{
		tut2Ball.x = STAGE_WIDTH / 2 + 5;
		tut2Ball.xVel = Math.abs(tut2Ball.xVel)
	}

	//player1TutMesg = GetTutorialString(tutorialStateP1);
	//player2TutMesg = GetTutorialString(tutorialStateP2);

	if (TutorialWaitState(tutorialStateP1))
	{
		if (tutorialDelayP1 > 0)
		{
			tutorialDelayP1 --;
		}
		else
		{
			TutorialNextStateP1();
		}
	}
	else
	{
		for (var i = tutorialStepsP1.length - 1; i >= 0; i--) {
			if (!!tutorialStepsP1[i]())
			{
				tutorialStepsP1.splice(i, 1);
			}
		}
		if (tutorialStepsP1.length == 0)
		{
			TutorialNextStateP1();
		}
	}
	if (TutorialWaitState(tutorialStateP2))
	{
		if (tutorialDelayP2 > 0)
		{
			tutorialDelayP2 --;
		}
		else
		{
			TutorialNextStateP2();
		}
	}
	else
	{
		for (var i = tutorialStepsP2.length - 1; i >= 0; i--) {
			if (!!tutorialStepsP2[i]())
			{
				tutorialStepsP2.splice(i, 1);
			}
		}
		if (tutorialStepsP2.length == 0)
		{
			TutorialNextStateP2();
		}
	}
}

function TutorialNextStateP1 () {
	tutorialStateP1 ++;
	tutorialDelayP1 = 50;
	GetTutorialState(tutorialStateP1, 1, player1Entity, tut1Ball, tut1Entity);
}

function TutorialNextStateP2 () {
	tutorialStateP2 ++;
	tutorialDelayP2 = 50;
	GetTutorialState(tutorialStateP2, 2, player2Entity, tut2Ball, tut2Entity);
}

function TutorialWaitState (tState) {
	if (tState == 0 || tState == 4 || tState == 7 || tState == 14 || tState == 16)
	{
		return true;
	}
	return false;
}

function GetTutorialState (tState, playerNum, playerRef, ballRef, dummyRef) {
	var tStrings = ["error"];
	var tImages = [];
	var tSteps = [function () {return false;}];
	switch (tState)
	{
		case 0:
		//0 wait
		tStrings = ["Welcome to Score Conflict!"];
		break;
		case 1:
		//1
		tStrings = ["Use <Left> and <Right> to move!"];
		tImages = ["360_Left_Stick.png", "360_Dpad_Left.png", "360_Dpad_Right.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "walking" && playerRef.direction == "right")
			{
				return true;
			}
		}, function () {
			if (playerRef.mode == "walking" && playerRef.direction == "left")
			{
				return true;
			}
		}];

		break;
		case 2:
		//2
		tStrings = ["Jump with <Up>!"];
		tImages = ["360_Left_Stick.png", "360_Dpad_Up.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Up.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "jumpLanding")
			{
				return true;
			}
		}];
		break;
		case 3:
		//3
		tStrings = ["Try kicking this", 
					"ball with <Attack>."];
		tImages = ["360_A.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Attack.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "kickRelease")
			{
				return true;
			}
		}, function () {
			if (Math.abs(ballRef.xVel) > 10)
			{
				return true;
			}
		}];
		break;
		case 4:
		//4 wait
		tStrings = ["That didn't go very far..."];
		break;
		case 5:
		//5
		tStrings = ["Charge up with",
					"<Down> and <Special>!"];
		tImages = ["360_Dpad_Down.png", "360_X.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Down.png", "Arcade_Special.png"];
		}
		tSteps = [function () {
			if (playerRef.charge > 2)
			{
				return true;
			}
		}];
		break;
		case 6:
		//6
		tStrings = ["Now kick the ball again!"];
		tImages = ["360_A.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Attack.png"];
		}
		tSteps = [function () {
			if (Math.abs(ballRef.xVel) > 15)
			{
				return true;
			}
		}];
		break;
		case 7:
		//7 wait
		tStrings = ["While holding <Attack>,",
					"you can aim the kick",
					"with <Up> and <Down>."];
		tImages = ["360_A.png", "360_Dpad_Up.png", "360_Dpad_Down.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_AttackHold.png", "Arcade_UpAndDown.png"];
		}
		if (playerNum == 1)
		{
			tutorialDelayP1 = 200;
		}
		if (playerNum == 2)
		{
			tutorialDelayP2 = 200;
		}
		break;
		case 8:
		//8 enemyGoal
		tStrings = ["Try kicking the ball",
					"into the opponent's goal!",
					"(Hold <Attack>, aim <Up>)"];
		tImages = ["360_A.png", "360_Dpad_Up.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_AttackHold.png", "Arcade_Up.png"];
		}
		tSteps = [function () {
			if (playerNum == 1 && player1Entity.charge < 2)
			{
				player1Entity.charge += 0.05;
			}
			if (playerNum == 2 && player2Entity.charge < 2)
			{
				player2Entity.charge += 0.05;
			}
			if (ballRef.y > goalEntity.top && ballRef.y < goalEntity.bottom)
			{
				if (playerNum == 1)
				{
					if (ballRef.x > STAGE_WIDTH / 2 - 10)
					{
						return true;
					}
				}
				if (playerNum == 2)
				{
					if (ballRef.x < STAGE_WIDTH / 2 + 10)
					{
						return true;
					}
				}
			}
		}];
		break;
		case 9:
		//9
		tStrings = ["Score!",
					"Punch this training dummy.",
					"<Side> and <Attack>"];
		tImages = ["360_Dpad_Left.png", "360_Dpad_Right.png", "360_A.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png", "Arcade_Attack.png"];
		}
		dummyRef.y = 0;
		tSteps = [function () {
			if (playerRef.mode == "punching")
			{
				return true;
			}
		}, function () {
			if (dummyRef.mode == "hitstun")
			{
				return true;
			}
		}];
		break;
		case 10:
		//10
		tStrings = ["Hold <Side> and <Attack>",
					"to do a combo!", 
					"(Three punches! Wow!)"];
		tImages = ["360_Dpad_Left.png", "360_Dpad_Right.png", "360_A.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png", "Arcade_AttackHold.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "punching" && playerRef.linkedSprite.GetFrame() >= 15)
			{
				return true;
			}
		}, function () {
			if (dummyRef.mode == "crashland")
			{
				return true;
			}
		}];
		break;
		case 11:
		//11
		tStrings = ["Cool! Next up is blocking.",
					"Use <Special>!"];
		tImages = ["360_X.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Special.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "blockingGround")
			{
				return true;
			}
		}];
		break;
		case 12:
		//12 ownGoal
		tStrings = ["Okay, the training dummy",
					"is aiming for your goal.",
					"Jump up and block its shot!",
					"(<Special> in mid-air)"];
		tImages = ["360_X.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Up.png", "Arcade_Special.png"];
		}
		P1_blocked_a_ball = false;
		P2_blocked_a_ball = false;
		tSteps = [function () {
			if (playerRef.mode == "dashAir")
			{
				return true;
			}
		}, function () {
			if (playerNum == 1 && P1_blocked_a_ball)
			{
				return true;
			}
			if (playerNum == 2 && P2_blocked_a_ball)
			{
				return true;
			}
		}];
		break;
		case 13:
		//13
		tStrings = ["Now try dashing.",
					"<Side> and <Special> on the ground."];
		tImages = ["360_Dpad_Left.png", "360_Dpad_Right.png", "360_X.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png", "Arcade_Special.png"];
		}
		tSteps = [function () {
			if (playerRef.mode == "dashGround")
			{
				return true;
			}
		}];
		break;
		case 14:
		//14 wait
		tStrings = ["Dashing is much faster",
					"but you can get tripped!"];
		if (playerNum == 1)
		{
			tutorialDelayP1 = 180;
		}
		if (playerNum == 2)
		{
			tutorialDelayP2 = 180;
		}
		break;
		case 15:
		//15
		tStrings = ["Try tripping the training dummy.",
					"<Down> and <Attack>."];
		tImages = ["360_Dpad_Down.png", "360_A.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Down.png", "Arcade_Attack.png"];
		}
		tSteps = [function () {
			if (dummyRef.mode == "tripped")
			{
				return true;
			}
		}];
		break;
		case 16:
		//16 wait
		tStrings = ["If you fall you can flip back up!",
					"<Left> or <Right> from knocked down.",
					"(You might be tripped again though!)"];
		tImages = ["360_Dpad_Left.png", "360_Dpad_Right.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png"];
		}
		if (playerNum == 1)
		{
			tutorialDelayP1 = 220;
		}
		if (playerNum == 2)
		{
			tutorialDelayP2 = 220;
		}
		break;
		case 17:
		//17
		tStrings = ["You're invincible while dashing!",
					"Dodge these attacks by",
					"dashing through them!"];
		tImages = ["360_Dpad_Left.png", "360_Dpad_Right.png", "360_X.png"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_LeftAndRight.png", "Arcade_Special.png"];
		}
		P1_dodged_attacks = 0;
		P2_dodged_attacks = 0;
		tSteps = [function () {
			if (dummyRef.mode == "punching" && playerRef.mode == "dashGround")
			{
				if (Math.abs(dummyRef.x - playerRef.x) < 10)
				{
					if (playerNum == 1)
					{
						P1_dodged_attacks ++;
						player1TutMesg = ["Nice dodging! Keep it up!"];
						if (P1_dodged_attacks > 5)
						{
							return true;
						}
					}
					if (playerNum == 2)
					{
						P2_dodged_attacks ++;
						player2TutMesg = ["Nice dodging! Keep it up!"];
						if (P2_dodged_attacks > 5)
						{
							return true;
						}
					}
				}
			}
		}];
		break;
		case 18:
		//18 done - wait for other player
		tStrings = ["That's all!",
					"Good luck!"];
		if (ARCADE_MODE)
		{
			tImages = ["Arcade_Start.png"];
		}
		tSteps = [function () {
			return false;
		}];
		break;
	}
	if (playerNum == 1)
	{
		player1TutMesg = tStrings;
		P1ImagesToDraw = tImages;
		tutorialStepsP1 = tSteps;
	}
	if (playerNum == 2)
	{
		player2TutMesg = tStrings;
		P2ImagesToDraw = tImages;
		tutorialStepsP2 = tSteps;
	}
}

function InGameUpdate () {
	if (roundOver)
	{
		roundOverTimer ++;
		if (roundOverTimer >= ROUND_OVER_TIME)
		{
			if (player1Score >= goalsToWin)
			{
				inGame = false;

				SetupP1Wins();

			}
			if (player2Score >= goalsToWin)
			{
				inGame = false;

				SetupP2Wins();
			}

			player1Entity.ResetSelf();
			player2Entity.ResetSelf();
			ballEntity.ResetSelf();

			player1Entity.x = STAGE_WIDTH / 2 - 250;
			player2Entity.x = STAGE_WIDTH / 2 + 250;

			player1Entity.y = 460;
			player2Entity.y = 460;

			player1Entity.direction = "right";
			player2Entity.direction = "left";

			roundOverTimer  = 0;
			roundOver = false;

			roundStarting = true;

			player1Entity.controllable = false;
			player2Entity.controllable = false;

			roundTimer = 0;
		}
		slowMotion ++;
		if (slowMotion >= 1)
		{
			slowMotion = 0;
			//return;
		}
	}
	if (roundStarting)
	{
		roundStartingTimer ++;
		if (roundStartingTimer >= ROUND_START_TIME)
		{
			roundStartingTimer = 0;
			roundStarting = false;
			player1Entity.controllable = true;
			player2Entity.controllable = true;
		}
		ballEntity.y = 150;
		ballEntity.yVel = 0;
	}
	else
	{
		roundTimer += 1;
	}
	player1Entity.SelfUpdate();
	player2Entity.SelfUpdate();
	ballEntity.SelfUpdate();
}