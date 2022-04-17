//render.js
//everything having to do with rendering

var ff = 0;
var rr = 0;

var MAX_ZOOM = 2.25;

var DASH_FADE = 10;

//Fire effect that rises and drifts (Charging)
function FireEffect (x, y, color) {
	this.x = x + Math.random() * PIXEL_SIZE * 8 - PIXEL_SIZE * 4;
	this.y = y - 5;
	this.color = color;
	this.time = 0;
	this.xVel = Math.random() - 0.5;
	this.yVel = -Math.random();
}

//Dust effect that drifts (Landing)
function DustEffect (x, y, color) {
	var xRand = Math.random() * PIXEL_SIZE * 8 - PIXEL_SIZE * 4;
	this.x = x + xRand;
	this.y = y - 5;
	this.color = color;
	this.time = 0 + Math.floor(Math.random() * 10);
	this.xVel = xRand / 60;
	this.yVel = (-Math.random()) * 0.2;
}

//Smoke effect that spreads a small amount (Launched)
function SmokeEffect (x, y, color) {
	this.x = x + Math.random() * PIXEL_SIZE * 6 - PIXEL_SIZE * 3;
	this.y = y - 8 * PIXEL_SIZE + Math.random() * PIXEL_SIZE * 6 - PIXEL_SIZE * 3;;
	this.color = color;
	this.time = 0;
	this.xVel = (Math.random() - 0.5) * 0.3;
	this.yVel = (Math.random() - 0.5) * 0.3;
}

function HitEffect (x, y, color, setExpansion, setLifespan) {
	this.x = x;
	this.y = y;
	this.radius = 1;
	this.color = color;
	this.time = 0;
	this.expansion = setExpansion;
	this.rotation = Math.random() * (2 * Math.PI);
	this.rotation2 = Math.random() * Math.PI
	this.rotation3 = Math.random() * -Math.PI
	this.lifespan = setLifespan;
	//this.yVel = Math.random() * 2;
}

function PlayerTrailEffect (sprite) {
	this.x = sprite.GetX();
	this.y = sprite.GetY();
	this.prevX = sprite.prevX;
	this.prevY = sprite.prevY;
	this.time = 0;//20 - Math.max(Math.abs(sprite.linkedEntity.xVel), Math.abs(sprite.linkedEntity.yVel));
	/*if (sprite.linkedEntity.mode != "dashGround")
	{
		this.time = Math.min(30, this.time + 10);
	}*/
	this.lifespan = 30;
	this.image = sprite.GetImage();
	this.filter = sprite.GetFilter();
	this.frame = sprite.GetFrame();
	this.direction = sprite.linkedEntity.direction;
	//this.intensity = Math.sqrt((Math.abs(sprite.linkedEntity.xVel) * Math.abs(sprite.linkedEntity.xVel)) + (Math.abs(sprite.linkedEntity.yVel) * Math.abs(sprite.linkedEntity.yVel))) / 50;
	this.isDashing = (sprite.linkedEntity.mode == "dashGround");
	this.intensity = 0.5;
	sprite.prevX = sprite.GetX();
	sprite.prevY = sprite.GetY();
	this.color = sprite.GetColor();
	this.timeSinceDash = sprite.linkedEntity.timeSinceDash;
	this.timeInDash = sprite.linkedEntity.timeInDash;

}

function BallTrailEffect (isBounce) {
	this.x = ballEntity.x;
	this.y = ballEntity.y;
	this.prevX = ballPrevX;
	this.prevY = ballPrevY;
	this.lifespan = 30;
	this.bounce = isBounce;
	this.time = 0;// - Math.abs(ballEntity.xVel) - Math.abs(ballEntity.yVel);
	this.intensity = Math.sqrt((Math.abs(ballEntity.xVel) * Math.abs(ballEntity.xVel)) + (Math.abs(ballEntity.yVel) * Math.abs(ballEntity.yVel))) / 50;

	if (this.intensity > 0.7)
	{
		this.intensity = 0.7;
	}

	ballPrevX = ballEntity.x;
	ballPrevY = ballEntity.y;
}

function GrassPiece (x, y) {
	this.x = x  + Math.random() * 6 - 3;
	this.y = y  + Math.random() * 2 - 1;
	this.alpha = Math.random() / 2 + 0.3;
	this.color = BlendColors("#234800", "#7D9A1C", Math.random());
	this.angle = Math.random() * 0.4 - 0.2;
}

function DirtPiece (x, y) {
	this.x = x  + Math.random() * 6 - 3;
	this.y = y  + Math.random() * 2 - 1;
	this.alpha = Math.random() / 2 + 0.3;
	this.color = BlendColors("#AD6A20", "#753813", Math.random());
	this.angle = Math.random() * 0.4 - 0.2;
	this.size = Math.random() * 2 + 3;
}


function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

var cameraTest = true;
var cTestDelay = 0;
var scaleX = 1;
var scaleY = 1;
var transX = 480;
var transY = 240;

var tZoom = 0;

var renderDelay = 0;;

var tLeftEdge = 0;
var tRightEdge = 0;

var smoothZoom = 1.25;
var smoothCameraX = -366;
var smoothCameraY = -96;

var shake = 0;
var shakeX = 0;
var shakeY = 0;

//var ballPrevX = STAGE_WIDTH / 2;
var ballPrevX = 1500 / 2;
var ballPrevY = 100;

function DoShake () {
	var angle = Math.random() * 360;
	shakeX = Math.cos(angle);
	shakeY = Math.sin(angle);
	shake = 1;
}

//Render constructor, takes imageLoader reference
function Render () {

	this.fireEffectList = [];
	this.dustEffectList = [];
	this.smokeEffectList = [];
	this.hitEffectList = [];
	this.trailEffectList = [];
	this.ballTrailEffectList = [];
	this.buttonList = [];

	this.grassList = [];
	this.dirtList = [];
	//this.goalMessageTimer = 0;
	//this.goalBar1 = 0;

	this.RenderFrame = function () {
		if (canvas.width != window.innerWidth || canvas.height != window.innerHeight)
		{
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;
		}
		this.Clear();

		rr += 0.05;
		

		var loaded = IL.IsLoaded();
		if (loaded != true)
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(100, 100, successCount * 3, 50);
			return;
		}
		else if (inLoadScreen)
		{
			//Play button
			this.ClearButtonList();
			this.AddButton("Play", canvas.width / 2, canvas.height / 2, "square", 50, SetupMainMenu);
			this.DrawAllButtons();
			this.Cursor();
			return;
		}
		else if (inMainMenu)
		{
			//Play button
			this.DrawBackground();

			//this.ClearButtonList();

			this.DrawGameText("Score Conflict", "lowrider", 100, "#FF0000", canvas.width / 2, 1 * canvas.height / 6 + 10);

			//this.AddButton("Play", canvas.width / 2, 2 * canvas.height / 6, "square", 50, StartGame);
			//this.AddButton("Tutorial", canvas.width / 2, 3 * canvas.height / 6, "square", 50, StartTutorial);

			//this.DrawGameText("Goals to Win:", "lowrider", 50, "#000000", canvas.width / 2, 4 * canvas.height / 5 + 5);

			//this.DrawGameText("" + goalsToWin, "lowrider", 50, "#000000", canvas.width / 2, (4 * canvas.height / 5) + 70);

			this.DrawAllButtons();
			this.Cursor();
			return;
		}
		else if (inSettingsScreen)
		{
			this.DrawBackground();

			this.DrawGameText("Goals to Win:", "lowrider", 50, "#000000", canvas.width / 2, (2 * canvas.height / 5) - 50);

			this.DrawGameText("" + goalsToWin, "lowrider", 50, "#000000", canvas.width / 2, (2 * canvas.height / 5) + 15);

			this.DrawAllButtons();
			this.Cursor();
			return;
		}
		else if (inP1Wins)
		{
			this.DrawBackground();

			this.DrawGameText("P1 Wins!", "lowrider", 200, player1Sprite.GetColor(), canvas.width / 2, canvas.height / 2);

			this.DrawAllButtons();
			this.Cursor();
			return;
		}
		else if (inP2Wins)
		{
			this.DrawBackground();

			this.DrawGameText("P2 Wins!", "lowrider", 200, player2Sprite.GetColor(), canvas.width / 2, canvas.height / 2);

			this.DrawAllButtons();
			this.Cursor();
			return;
		}
		else if (inStageSelect)
		{
			this.DrawBackground();

			this.DrawGameText("Select Stage", "lowrider", 80, "#000000", canvas.width / 2, canvas.height / 4);

			this.DrawAllButtons();
			this.Cursor();
			return;
		}

		this.DrawBackground();

		ctx.save();
		testctx.save();

		if (cameraTest)
		{

			var MIN_ZOOM = canvas.width / STAGE_WIDTH;
			//var rightEdge = Math.min(STAGE_WIDTH, Math.max(ballEntity.x, player1Sprite.GetX(), player2Sprite.GetX()) + 50);
			//var leftEdge = Math.max(0, Math.min(ballEntity.x, player1Sprite.GetX(), player2Sprite.GetX()) - 50);
			var leftEdge;
			var rightEdge;
			if (ballEntity.x < (STAGE_WIDTH / 4))
			{
				leftEdge = 0;
			}
			else
			{
				leftEdge = Math.max(0, Math.min(ballEntity.x, player1Sprite.GetX(), player2Sprite.GetX()) - 75);
			}
			if (STAGE_WIDTH - ballEntity.x < (STAGE_WIDTH / 4))
			{
				rightEdge = STAGE_WIDTH;
			}
			else
			{
				rightEdge = Math.min(STAGE_WIDTH, Math.max(ballEntity.x, player1Sprite.GetX(), player2Sprite.GetX()) + 75);
			}
			
			var topEdge;
			var bottomEdge;

			topEdge = Math.min(ballEntity.y, player1Sprite.GetY(), player2Sprite.GetY()) - 75;
			//topEdge = STAGE_HEIGHT - 710;
			//topEdge = 0;
			bottomEdge = Math.min(canvas.height, Math.max(ballEntity.y, player1Sprite.GetY(), player2Sprite.GetY()) + 75);
			bottomEdge = STAGE_HEIGHT;
			
			//var followX = ((ballEntity.x + player1Sprite.GetX() + player2Sprite.GetX()) / 3);
			var followX = ((leftEdge + rightEdge) / 2);
			//var followY = ((ballEntity.y + player1Sprite.GetY() + player2Sprite.GetY()) / 3);
			var followY = ((topEdge + bottomEdge) / 2);

			var horizontalHalf = Math.max((rightEdge - followX), (followX - leftEdge));

			var screenWidth = Math.min(STAGE_WIDTH, (horizontalHalf * 2));
			
			var verticalHalf = Math.max((bottomEdge - followY), (followY - topEdge));

			var screenHeight = verticalHalf * 2;
			
			//while (rightEdge - leftEdge < (canvas.width / MAX_ZOOM))
			//{
			//	leftEdge -= 1;
			//	rightEdge += 1;
			//}
			//if (rightEdge == STAGE_WIDTH)
			//{
			//	leftEdge = Math.min(rightEdge - 770, leftEdge);
			//}

			/*
			if (leftEdge >= STAGE_WIDTH - (canvas.width / MAX_ZOOM))
			{
				leftEdge = STAGE_WIDTH - (canvas.width / MAX_ZOOM);
			}
			*/

			tLeftEdge = leftEdge;
			tRightEdge = rightEdge;
			var horizZoom = canvas.width / screenWidth;
			var vertZoom = canvas.height / screenHeight;
			var zoom = Math.min(horizZoom, vertZoom, MAX_ZOOM);
			var zoom = Math.max(zoom, MIN_ZOOM);
			//console.log(zoom);
			tZoom = zoom;

			smoothZoom = (smoothZoom * 9 + zoom) / 10;
			ctx.scale(smoothZoom, smoothZoom);
			testctx.scale(smoothZoom, smoothZoom);

			//ctx.translate(-leftEdge, (480 - (480 * zoom)) / zoom);
			var cameraX = (-followX + ((canvas.width / 2) / zoom));
			var cameraY = (-followY + ((canvas.height / 2) / zoom));

			if (cameraY - (canvas.height / zoom) < -STAGE_HEIGHT)
			{
				cameraY -= ((cameraY - (canvas.height / zoom) + STAGE_HEIGHT));
			}

			if (cameraX - (canvas.width / zoom) < -STAGE_WIDTH)
			{
				cameraX -= ((cameraX - (canvas.width / zoom) + STAGE_WIDTH));
			}

			if (cameraX > 0)
			{
				//console.log("Camera is wrong! x: " + cameraX);
				cameraX = 0;
			}

			smoothCameraX = (smoothCameraX * 9 + cameraX) / 10;
			smoothCameraY = (smoothCameraY * 9 + cameraY) / 10;

			if (shake > 0)
			{
				shake -= 0.1;
				smoothCameraX += shakeX * Math.sin(shake * 10) * 10;
				smoothCameraY += shakeY * Math.sin(shake * 10) * 10;
			}

			ctx.translate(smoothCameraX, smoothCameraY);
			testctx.translate(smoothCameraX, smoothCameraY);

			
			//ctx.translate(transX - (player1Sprite.GetX() + player2Sprite.GetX()) / 2 , 0/*transY - (player1Sprite.GetY() + player2Sprite.GetY()) / 2*/);


			//ctx.translate(transX - (ballEntity.x + player1Sprite.GetX() + player2Sprite.GetX()) / 3, 0);
			//scaleX = Math.abs(player1Sprite.GetX() - player2Sprite.GetX()) / 480;
			//scaleY = Math.abs(player1Sprite.GetY() - player2Sprite.GetY()) / 240;
			//ctx.scale(scaleX, scaleY);
		}
		else
		{
			/*
			cTestDelay ++;
			if (cTestDelay > 10)
			{
				cameraTest = true;
			}
			*/

		}

		//ctx.drawImage(IL.GetFilteredImage("megaman.png", 0), 0, 0);
		//ctx.drawImage(IL.GetFilteredImage("final_fantasy.png", 0), 0, 100);




		this.ChargeEffect(player1Sprite, player1Sprite.GetColor());
		this.ChargeEffect(player2Sprite, player2Sprite.GetColor());

		if (player1Entity.mode == "jumpLanding" || player1Entity.mode == "flipLandSafe")
		{
			if (player1Entity.linkedSprite.GetFrame() <= 1)
			{
				for (var i = 0; i < 3; i++)
				{
					this.AddDustEffect(player1Entity);
				}
			}
		}
		if (player1Entity.mode == "crashland")
		{
			if (player1Entity.linkedSprite.GetFrame() <= 1)
			{
				for (var i = 0; i < 25; i++)
				{
					this.AddCrashDustEffect(player1Entity);
				}
			}
		}
		if (player1Entity.mode == "tripped" && player1Sprite.GetFrame() == 9)
		{
			for (var i = 0; i < 15; i++)
			{
				this.AddCrashDustEffect(player1Entity);
			}
		}
		if (player1Entity.mode == "flipLandTrip" && player1Sprite.GetFrame() == 4)
		{
			for (var i = 0; i < 15; i++)
			{
				this.AddCrashDustEffect(player1Entity);
			}
		}
		if (player2Entity.mode == "jumpLanding" || player2Entity.mode == "flipLandSafe")
		{
			if (player2Entity.linkedSprite.GetFrame() <= 1)
			{
				for (var i = 0; i < 3; i++)
				{
					this.AddDustEffect(player2Entity);
				}
			}
		}
		if (player2Entity.mode == "tripped" && player2Sprite.GetFrame() == 9)
		{
			for (var i = 0; i < 15; i++)
			{
				this.AddCrashDustEffect(player2Entity);
			}
		}
		if (player2Entity.mode == "flipLandTrip" && player2Sprite.GetFrame() == 4)
		{
			for (var i = 0; i < 15; i++)
			{
				this.AddCrashDustEffect(player2Entity);
			}
		}
		if (player2Entity.mode == "crashland")
		{
			if (player2Entity.linkedSprite.GetFrame() <= 1)
			{
				for (var i = 0; i < 25; i++)
				{
					this.AddCrashDustEffect(player2Entity);
				}
			}
		}
		if (player1Entity.mode == "launched")
		{
			this.AddSmokeEffect(player1Entity);
			this.AddSmokeEffect(player1Entity);
			this.AddSmokeEffect(player1Entity);
			this.AddSmokeEffect(player1Entity);
		}
		if (player2Entity.mode == "launched")
		{
			this.AddSmokeEffect(player2Entity);
			this.AddSmokeEffect(player2Entity);
			this.AddSmokeEffect(player2Entity);
			this.AddSmokeEffect(player2Entity);
		}


		/*if (player2Sprite.linkedEntity.charge > 2)
		{
			p2FireTime -= Math.floor(player2Sprite.linkedEntity.charge - 1);
			if (p2FireTime < 0)
			{
				p2FireTime += 10;
				this.AddFireEffect(player2Sprite, "#0000FF");
			}
			if (player2Sprite.linkedEntity.chargeFlash)
			{
				for (var i = 0; i < 45; i++)
				{
					this.AddFireEffect(player2Sprite, "#0000FF");
				}
				player2Sprite.linkedEntity.chargeFlash = false;
			}
		}*/

		this.KickAimReticle(player1Sprite, player1Sprite.GetColor());
		this.KickAimReticle(player2Sprite, player2Sprite.GetColor());

		if (player2Entity.hitContact == true)
		{
			this.AddHitEffect(player1Entity);
			player2Entity.hitContact = false;
		}

		if (player1Entity.hitContact == true)
		{
			this.AddHitEffect(player2Entity);
			player1Entity.hitContact = false;
		}

		if (player1Entity.mode == "dashGround" || player1Entity.mode == "dashAir" || player1Entity.mode != "launched")
		{
			this.AddTrailEffect(player1Sprite);
		}
		if (player2Entity.mode == "dashGround" || player2Entity.mode == "dashAir" || player2Entity.mode != "launched")
		{
			this.AddTrailEffect(player2Sprite);
		}
		this.AddBallTrailEffect();

		for (var i = this.trailEffectList.length - 1; i >= 0; i--) {
			this.DrawPlayerTrailEffect(this.trailEffectList[i])
		}
		for (var i = this.ballTrailEffectList.length - 1; i >= 0; i--) {
			this.DrawBallTrailEffect(this.ballTrailEffectList[i])
		}

		this.DrawPlayer(player1Sprite);
		this.DrawPlayer(player2Sprite);
		if (inTutorial)
		{
			this.DrawPlayer(tut1Sprite);
			this.DrawPlayer(tut2Sprite);
		}
		this.DrawBall();
		this.DrawGoals();
		this.DrawGround();
		
		for (var i = this.fireEffectList.length - 1; i >= 0; i--) {
			this.DrawFireEffect(this.fireEffectList[i]);
		}
		for (var i = this.dustEffectList.length - 1; i >= 0; i--) {
			this.DrawDustEffect(this.dustEffectList[i]);
		}
		for (var i = this.smokeEffectList.length - 1; i >= 0; i--) {
			this.DrawSmokeEffect(this.smokeEffectList[i]);
		}
		for (var i = this.hitEffectList.length - 1; i >= 0; i--) {
			this.DrawHitEffect(this.hitEffectList[i]);
		}

		for (var i = this.grassList.length - 1; i >= 0; i--) {
			this.DrawGrassPiece(this.grassList[i]);
		}
		for (var i = this.dirtList.length - 1; i >= 0; i--) {
			this.DrawDirtPiece(this.dirtList[i]);
		}


		//ctx.drawImage(testCanvas, 0, 0);

		//ctx.fillText("angle at mouse: " + groundShape.GetAngleAtX(mouseX), 50, 50);

		if (inTutorial)
		{
			this.DrawTutorialBarrier();
		}


		ctx.restore();
		testctx.restore();


		this.Cursor();

		this.DrawChargeMeters();
		this.DrawHealthMeters();
		//this.DrawEnergyMeters();

		if (roundOver)
		{
			if (winner == 1)
			{
				//this.DrawGameText("Goal!", "lowrider", 200, player1Sprite.GetColor(), 200, 280);
				this.GoalMessage(player1Sprite.GetColor());
			}
			else
			{
				this.GoalMessage(player2Sprite.GetColor());
			}
		}
		if (roundStarting)
		{
			this.RoundStartMessage();
		}

		if (!roundStarting && roundTimer < 30)
		{
			goctx.save();
			if (roundTimer > 20){
				goctx.globalAlpha = (1 - (roundTimer - 20) / 10);
			}
			//this.DrawGoText("GO!", "lowrider", 256, "#800080", 0, 256);
			this.DrawGoText("GO!", "lowrider", 256, "#800080", canvas.width / 2, canvas.height - canvas.height / 2.5);
			//this.DrawGameText("GO!", "lowrider", 256, "#800080", canvas.width / 2, canvas.height - canvas.height / 2.5);
			//this.DrawGameText("GO!", "lowrider", 200, "#800080", canvas.width / 2 / scaleRatio, (canvas.height - canvas.height / 2.5) / scaleRatio);
			goctx.restore();

			ctx.save();

			var scaleRatio = 10;

			if (roundTimer <= 9)
			{
				scaleRatio -= roundTimer;
			}
			else
			{
				scaleRatio = 1;
			}

			ctx.scale(scaleRatio, scaleRatio);
			ctx.drawImage(goCanvas, 0 - ((canvas.width / 2 * scaleRatio) - (canvas.width / 2)) / scaleRatio, 0 - ((canvas.height / 2 * scaleRatio) - (canvas.height / 2)) / scaleRatio);
			//ctx.drawImage(goCanvas, -240, -120);
			ctx.restore();
		}
		if (inGame)
		{
			this.DrawGameText(player1Score, "govtagent", 60, player1Sprite.GetColor(), canvas.width / 2 - 60, 50);
			this.DrawGameText(player2Score, "govtagent", 60, player2Sprite.GetColor(), canvas.width / 2 + 60, 50);
			this.DrawGameText("-", "govtagent", 60, "#000000", canvas.width / 2, 50);
		}
		if (inTutorial)
		{
			for (var i = 0; i < player1TutMesg.length; i++)
			{
				this.DrawGameText(player1TutMesg[i], "govtagent", 30, "#000000", canvas.width / 4, 90 + i * 30);
			}
			for (var i = 0; i < player2TutMesg.length; i++)
			{
				this.DrawGameText(player2TutMesg[i], "govtagent", 30, "#000000", 3 * canvas.width / 4, 90 + i * 30);
			}

			for (var i = 0; i < P1ImagesToDraw.length; i++)
			{
				ctx.save();
				if (ARCADE_MODE)
				{
					ctx.translate(((i + 1) * ((canvas.width / 2) / (P1ImagesToDraw.length + 1))) - 78, (70 + (player1TutMesg.length) * 30));
				}
				else
				{
					ctx.translate(((i + 1) * ((canvas.width / 2) / (P1ImagesToDraw.length + 1))) - 50, (70 + (player1TutMesg.length) * 30));
				}
				ctx.scale(0.75, 0.75);
				ctx.drawImage(IL.GetOtherImage(P1ImagesToDraw[i]), 0, 0);
				ctx.restore();
			}

			for (var i = 0; i < P2ImagesToDraw.length; i++)
			{
				ctx.save();
				if (ARCADE_MODE)
				{
					ctx.translate( (canvas.width / 2) + ((i + 1) * ((canvas.width / 2) / (P2ImagesToDraw.length + 1))) - 78, (70 + (player2TutMesg.length) * 30));
				}
				else
				{
					ctx.translate( (canvas.width / 2) + ((i + 1) * ((canvas.width / 2) / (P2ImagesToDraw.length + 1))) - 50, (70 + (player2TutMesg.length) * 30));
				}
				ctx.scale(0.75, 0.75);
				ctx.drawImage(IL.GetOtherImage(P2ImagesToDraw[i]), 0, 0);
				ctx.restore();
			}

			this.DrawAllButtons();
		}
	}

	this.DrawTutorialBarrier = function () {
		ctx.save();
		ctx.fillStyle = "#8000A0";
		ctx.gloablAlpha = (Math.abs(Math.sin(rr)));
		ctx.fillRect(STAGE_WIDTH / 2 - 5, -500, 10, 500 + STAGE_HEIGHT);
		ctx.restore();
	}

	this.DrawChargeMeters = function () {
		ctx.save();

		var p1Percent = (player1Sprite.linkedEntity.charge - 1) / 3;
		var p1MeterWidth = 200 * p1Percent;
		var meterHeight = 2 * PIXEL_SIZE;
		var p1Color = player1Sprite.GetColor();

		var offset = 10;

		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 8;
		
		var emptyGradient = ctx.createLinearGradient(0, offset, 0, offset + meterHeight);
		emptyGradient.addColorStop(0, BlendColors("#CCCCCC", "#FFFFFF", 0.0));
		emptyGradient.addColorStop(0.2, BlendColors("#CCCCCC", "#FFFFFF", 0.5));
		emptyGradient.addColorStop(0.45, BlendColors("#CCCCCC", "#000000", 0.3));
		emptyGradient.addColorStop(0.8, BlendColors("#CCCCCC", "#FFFFFF", 0.0));
		ctx.fillStyle = emptyGradient;
		ctx.save();
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
      	ctx.shadowOffsetX = 2;
      	ctx.shadowOffsetY = 2;
		ctx.strokeRect(offset, offset, 200, meterHeight);
		ctx.restore();
		ctx.fillRect(offset, offset, 200, meterHeight);

		var p1Gradient = ctx.createLinearGradient(0, offset, 0, offset + meterHeight);
		p1Gradient.addColorStop(0, BlendColors(p1Color, "#FFFFFF", 0.0));
		p1Gradient.addColorStop(0.2, BlendColors(p1Color, "#FFFFFF", 0.5));
		p1Gradient.addColorStop(0.45, BlendColors(p1Color, "#000000", 0.3));
		p1Gradient.addColorStop(0.8, BlendColors(p1Color, "#FFFFFF", 0.0));
		ctx.fillStyle = p1Gradient;
		ctx.fillRect(offset, offset, p1MeterWidth, meterHeight);

		var p2Percent = (player2Sprite.linkedEntity.charge - 1) / 3;
		var p2MeterWidth = 200 * p2Percent;
		var p2Color = player2Sprite.GetColor();
		
		ctx.fillStyle = emptyGradient;
		ctx.save();
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
      	ctx.shadowOffsetX = 2;
      	ctx.shadowOffsetY = 2;
		ctx.strokeRect(canvas.width - 200 - offset, offset, 200, meterHeight);
		ctx.restore();
		ctx.fillRect(canvas.width - 200 - offset, offset, 200, meterHeight);

		var p2Gradient = ctx.createLinearGradient(0, offset, 0, offset + meterHeight);
		p2Gradient.addColorStop(0, BlendColors(p2Color, "#FFFFFF", 0.0));
		p2Gradient.addColorStop(0.2, BlendColors(p2Color, "#FFFFFF", 0.5));
		p2Gradient.addColorStop(0.45, BlendColors(p2Color, "#000000", 0.3));
		p2Gradient.addColorStop(0.8, BlendColors(p2Color, "#FFFFFF", 0.0));
		ctx.fillStyle = p2Gradient;
		ctx.fillRect(canvas.width - p2MeterWidth - offset, offset, p2MeterWidth, meterHeight);

		this.DrawLightningBolt(20, 20, offset + 200 + 10, offset + meterHeight / 2);
		this.DrawLightningBolt(20, 20, canvas.width - offset - 200 - 6, offset + meterHeight / 2);

		ctx.restore();
	}

	this.DrawHealthMeters = function () {
		ctx.save();

		var p1Percent = (player1Sprite.linkedEntity.health) / 3;
		var p1MeterWidth = 200 * p1Percent;
		var meterHeight = 2 * PIXEL_SIZE;

		var offset = 10;

		var p1Color = BlendColors(player1Sprite.GetColor(), "#FFFFFF", Math.abs(Math.sin(rr / 3) / 4));

		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 8;

		var emptyGradient = ctx.createLinearGradient(0, 4 * PIXEL_SIZE + offset, 0, meterHeight + 4 * PIXEL_SIZE + offset);
		emptyGradient.addColorStop(0, BlendColors("#CCCCCC", "#FFFFFF", 0.0));
		emptyGradient.addColorStop(0.2, BlendColors("#CCCCCC", "#FFFFFF", 0.5));
		emptyGradient.addColorStop(0.45, BlendColors("#CCCCCC", "#000000", 0.3));
		emptyGradient.addColorStop(0.8, BlendColors("#CCCCCC", "#FFFFFF", 0.0));
		ctx.fillStyle = emptyGradient;
		ctx.save();
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
      	ctx.shadowOffsetX = 2;
      	ctx.shadowOffsetY = 2;
		ctx.strokeRect(offset, 4 * PIXEL_SIZE + offset, 200, meterHeight);
		ctx.restore();
		ctx.fillRect(offset, 4 * PIXEL_SIZE + offset, 200, meterHeight);
		

		var p1Gradient = ctx.createLinearGradient(0, 4 * PIXEL_SIZE + offset, 0, meterHeight + 4 * PIXEL_SIZE + offset);
		p1Gradient.addColorStop(0, BlendColors(p1Color, "#FFFFFF", 0.0));
		p1Gradient.addColorStop(0.2, BlendColors(p1Color, "#FFFFFF", 0.5));
		p1Gradient.addColorStop(0.45, BlendColors(p1Color, "#000000", 0.3));
		p1Gradient.addColorStop(0.8, BlendColors(p1Color, "#FFFFFF", 0.0));
		ctx.fillStyle = p1Gradient;
		ctx.fillRect(offset, 4 * PIXEL_SIZE + offset, p1MeterWidth, meterHeight);

		var p2Percent = (player2Sprite.linkedEntity.health) / 3;
		var p2MeterWidth = 200 * p2Percent;
		var p2Color = player2Sprite.GetColor();
		
		ctx.fillStyle = emptyGradient;
		ctx.save();
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
      	ctx.shadowOffsetX = 2;
      	ctx.shadowOffsetY = 2;
      	ctx.strokeRect(canvas.width - 200 - offset, 4 * PIXEL_SIZE + offset, 200, meterHeight);
		ctx.restore();
		ctx.fillRect(canvas.width - 200 - offset, 4 * PIXEL_SIZE + offset, 200, meterHeight);

		var p2Gradient = ctx.createLinearGradient(0, 4 * PIXEL_SIZE + offset, 0, meterHeight + 4 * PIXEL_SIZE + offset);
		p2Gradient.addColorStop(0, BlendColors(p2Color, "#FFFFFF", 0.0));
		p2Gradient.addColorStop(0.2, BlendColors(p2Color, "#FFFFFF", 0.5));
		p2Gradient.addColorStop(0.45, BlendColors(p2Color, "#000000", 0.3));
		p2Gradient.addColorStop(0.8, BlendColors(p2Color, "#FFFFFF", 0.0));
		ctx.fillStyle = p2Gradient;
		ctx.fillRect(canvas.width - p2MeterWidth - offset, 4 * PIXEL_SIZE + offset, p2MeterWidth, meterHeight);

		this.DrawHeart(20, 20, offset + 200 - 1, 4 * PIXEL_SIZE + offset - 1);
		this.DrawHeart(20, 20, canvas.width - offset - 200 - 15, 4 * PIXEL_SIZE + offset - 1);

		ctx.restore();

	}

	this.DrawHeart = function (width, height, x, y) {
		var w = width;
		var h = height;
		
		ctx.save();

		ctx.translate(x, y);

		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeWeight = 3;
		ctx.lineWidth = 8;
		ctx.fillStyle = "#FF0000";
		var d = Math.min(w, h);
		var k = 0;

		ctx.beginPath();
		
		ctx.moveTo(k, k + d / 4);
		ctx.quadraticCurveTo(k, k, k + d / 4, k);
		ctx.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
		ctx.quadraticCurveTo(k + d / 2, k, k + d * 3/4, k);
		ctx.quadraticCurveTo(k + d, k, k + d, k + d / 4);
		ctx.quadraticCurveTo(k + d, k + d / 2, k + d * 3/4, k + d * 3/4);
		ctx.lineTo(k + d / 2, k + d);
		ctx.lineTo(k + d / 4, k + d * 3/4);
		ctx.quadraticCurveTo(k, k + d / 2, k, k + d / 4);
		ctx.closePath();

		ctx.save();
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
		ctx.fill();
		ctx.restore();

		ctx.restore();

	}

	this.DrawLightningBolt = function(width, height, x, y)
	{
		var w = width;
		var h = height;
		var hw = width / 2;
		var hh = height / 2;

		ctx.save();

		ctx.strokeStyle = "#FFFFFF";
		//ctx.strokeWeight = 3;
		ctx.lineWidth = 6;
		ctx.fillStyle = "#FFFF00";

		ctx.beginPath();

		ctx.moveTo(x, y);
		ctx.moveTo(x + (hw / 2), y - hh);
		ctx.lineTo(x - hw, y + (h * 0.07));
		ctx.lineTo(x, y + (h * 0.07));
		ctx.lineTo(x - (hw / 2), y + hh);
		ctx.lineTo(x + hw, y - (h * 0.07));
		ctx.lineTo(x, y - (h * 0.07));
		ctx.closePath();

		ctx.save();
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
		ctx.fill();
		ctx.restore();


		ctx.restore();

	}

	this.DrawEnergyMeters = function () {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(0, 6 * PIXEL_SIZE, 200 * ((player1Sprite.linkedEntity.energy) / 10), 2 * PIXEL_SIZE);
		ctx.fillStyle = "#000000";
		ctx.fillRect(200, 6 * PIXEL_SIZE, 5, 2 * PIXEL_SIZE);

		ctx.fillStyle = "#0000FF";
		ctx.fillRect(canvas.width - 200 * ((player2Sprite.linkedEntity.energy) / 10), 6 * PIXEL_SIZE, 200 * ((player2Sprite.linkedEntity.energy) / 10), 2 * PIXEL_SIZE);
		ctx.fillStyle = "#000000";
		ctx.fillRect(canvas.width - 205, 6 * PIXEL_SIZE, 5, 2 * PIXEL_SIZE);
	}

	this.ChargeEffect = function (playerSprite, color) {
		if (playerSprite.linkedEntity.charge > 2)
		{
			playerSprite.linkedEntity.fireTime -= Math.floor(playerSprite.linkedEntity.charge - 1);
			if (playerSprite.linkedEntity.fireTime < 0)
			{
				playerSprite.linkedEntity.fireTime += 10;
				this.AddFireEffect(playerSprite, color);
			}
			if (playerSprite.linkedEntity.chargeFlash)
			{
				for (var i = 0; i < 45; i++)
				{
					this.AddFireEffect(playerSprite, color);
				}
				playerSprite.linkedEntity.chargeFlash = false;
			}
			
		}
	}

	this.KickAimReticle = function (playerSprite, color) {
		if (playerSprite.linkedEntity.mode == "kickHold")
		{
			playerSprite.linkedEntity.reticleFade += 0.1;
			if (playerSprite.linkedEntity.reticleFade > 1)
			{
				playerSprite.linkedEntity.reticleFade = 1;
			}
		}
		else
		{
			playerSprite.linkedEntity.reticleFade -= 0.1;
			if (playerSprite.linkedEntity.reticleFade < 0)
			{
				playerSprite.linkedEntity.reticleFade = 0
			}
		}
		if (playerSprite.linkedEntity.reticleFade > 0.1)
		{
			ctx.save();
			ctx.globalAlpha = (playerSprite.linkedEntity.reticleFade);
			this.Crosshair(playerSprite.GetX() +  playerSprite.linkedEntity.CheckDirection() * 100 * Math.cos(playerSprite.linkedEntity.kickAngle), playerSprite.GetY() - 100 * Math.sin(playerSprite.linkedEntity.kickAngle), color);
			ctx.restore();
		}
	}

	this.AddFireEffect = function (playerSprite, color) {
		this.fireEffectList.push(new FireEffect(playerSprite.GetX(), playerSprite.GetY(), color));
	}

	this.AddDustEffect = function (playerEntity) {
		this.dustEffectList.push(new DustEffect(playerEntity.x, playerEntity.y, "#BBBB99"));
	}

	this.AddCrashDustEffect = function (playerEntity) {
		this.dustEffectList.push(new DustEffect(playerEntity.x + (30 * playerEntity.CheckDirection()), playerEntity.y, "#BBBB99"));
	}

	this.AddSmokeEffect = function (playerEntity) {
		this.smokeEffectList.push(new SmokeEffect(playerEntity.x, playerEntity.y, "#777777"));
	}

	this.AddHitEffect = function (playerEntity) {
		if (playerEntity.mode == "punching")
		{	
			if (playerEntity.hitType == ATTACK_TYPE.WEAK)
			{
				this.hitEffectList.push(new HitEffect(playerEntity.x + (50 * playerEntity.CheckDirection()), playerEntity.y - 50, "#FFFF00", 3, 15));		
			}
			else if (playerEntity.hitType == ATTACK_TYPE.STRONG)
			{
				this.hitEffectList.push(new HitEffect(playerEntity.x + (50 * playerEntity.CheckDirection()), playerEntity.y - 50, "#FFFF00", 3, 20));	
			}
		}
		else if (playerEntity.mode == "tripping")
		{
			this.hitEffectList.push(new HitEffect(playerEntity.x + (50 * playerEntity.CheckDirection()), playerEntity.y, playerEntity.linkedSprite.GetColor(), 4, 10));	
		}
		//this.hitEffectList.push(new HitEffect(playerEntity.collisionX, playerEntity.collisionY, color, expansion, lifespan));
	}

	this.AddTrailEffect = function (playerSprite) {
		this.trailEffectList.push(new PlayerTrailEffect(playerSprite));
	}
	this.AddBallTrailEffect = function () {
		this.ballTrailEffectList.push(new BallTrailEffect(false));
	}
	this.AddBallBounceEffect = function () {
		this.ballTrailEffectList.push(new BallTrailEffect(true));
	}

	this.AddManyGrassPieces = function (amount) {
		this.grassList = [];
		for (var i = 0; i < amount; i++) {
			var x = Math.random() * STAGE_WIDTH;
			this.AddGrassPiece(x, groundShape.GetHeightAtX(x));
		}
	}

	this.AddGrassPiece = function (x, y) {
		this.grassList.push(new GrassPiece(x, y));
	}

	this.AddManyDirtPieces = function (amount) {
		this.dirtList = [];
		for (var i = 0; i < amount; i++) {
			var x = Math.random() * STAGE_WIDTH;
			var y = groundShape.GetHeightAtX(x) + Math.random() * (STAGE_HEIGHT - groundShape.GetHeightAtX(x));
			this.AddDirtPiece(x, y);
		}
	}

	this.AddDirtPiece = function (x, y) {
		this.dirtList.push(new DirtPiece(x, y));
	}

	this.AddButton = function (message, x, y, shape, fontSize, func) {
		this.buttonList.push(new MenuButton(message, x, y, shape, fontSize, "up", func));
	}

	this.ClearButtonList = function () {
		this.buttonList.length = 0;
	}

	this.DrawGoals = function () {
		var yAdjust = 0;
		if (ARCADE_MODE)
		{
			yAdjust = ARCADE_Y_ADJUST;
		}
		if (inGame)
		{
			ctx.fillStyle = player1Sprite.GetColor();
			ctx.fillRect(0, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
			ctx.fillRect(0, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
			ctx.fillRect(0, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);

			ctx.fillStyle = player2Sprite.GetColor();
			ctx.fillRect(STAGE_WIDTH - 4 * PIXEL_SIZE, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
			ctx.fillRect(STAGE_WIDTH - 4 * PIXEL_SIZE, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
			ctx.fillRect(STAGE_WIDTH - 2 * PIXEL_SIZE, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);
		}
		if (inTutorial)
		{
			if (tutorialStateP1 == 8)
			{
				//P1's enemygoal
				ctx.fillStyle = player2Sprite.GetColor();
				ctx.fillRect(STAGE_WIDTH / 2 - 4 * PIXEL_SIZE, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH / 2 - 4 * PIXEL_SIZE, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH / 2 - 2 * PIXEL_SIZE, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);
			}
			if (tutorialStateP1 == 12)
			{
				//P1's owngoal
				ctx.fillStyle = player1Sprite.GetColor();
				ctx.fillRect(0, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(0, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(0, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);
			}
			if (tutorialStateP2 == 8)
			{
				//P2's enemygoal
				ctx.fillStyle = player1Sprite.GetColor();
				ctx.fillRect(STAGE_WIDTH / 2, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH / 2, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH / 2, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);
			}
			if (tutorialStateP2 == 12)
			{
				//P2's owngoal
				ctx.fillStyle = player2Sprite.GetColor();
				ctx.fillRect(STAGE_WIDTH - 4 * PIXEL_SIZE, -yAdjust + goalEntity.top - (2 * PIXEL_SIZE), 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH - 4 * PIXEL_SIZE, -yAdjust + goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
				ctx.fillRect(STAGE_WIDTH - 2 * PIXEL_SIZE, -yAdjust + goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);
			}
		}

	}

	this.DrawPlayer = function (playerSprite) {
		var dir = playerSprite.linkedEntity.CheckDirection();
		ctx.save();
		ctx.scale(dir, 1);
		ctx.drawImage(IL.GetFilteredImage(playerSprite.GetImage(), playerSprite.GetFilter()),
			24 * playerSprite.GetFrame(), 0, 24, 24,
			dir * (playerSprite.GetX() - dir * 90), playerSprite.GetY() - 180, 24 * PIXEL_SIZE, 24 * PIXEL_SIZE);
		// playerSprite.Tick();
		ctx.restore();
		ctx.save();
		if (playerSprite.linkedEntity.doAI)
		{
			ctx.font = "12px sans-serif";
			ctx.fillText("AI", playerSprite.GetX() - 6, playerSprite.GetY() - 100);
		}
		ctx.restore();
	}

	this.DrawBall = function () {
		if (inTutorial)
		{
			ctx.drawImage(IL.GetOtherImage("Ball.png"), 0, 0, 4, 4, tut1Ball.x - 2 * PIXEL_SIZE, tut1Ball.y - 4 * PIXEL_SIZE, 4 * PIXEL_SIZE, 4 * PIXEL_SIZE);
			ctx.drawImage(IL.GetOtherImage("Ball.png"), 0, 0, 4, 4, tut2Ball.x - 2 * PIXEL_SIZE, tut2Ball.y - 4 * PIXEL_SIZE, 4 * PIXEL_SIZE, 4 * PIXEL_SIZE);
		}
		else
		{
			//In Game
			ctx.drawImage(IL.GetOtherImage("Ball.png"), 0, 0, 4, 4, ballEntity.x - 2 * PIXEL_SIZE, ballEntity.y - 4 * PIXEL_SIZE, 4 * PIXEL_SIZE, 4 * PIXEL_SIZE);
		}
	}

	this.DrawBackground = function () {
		//ctx.drawImage(IL.GetBackgroundImage("illegal_sky.png"), 0, 0);
		//ctx.drawImage(IL.GetBackgroundImage("blursky.png"), 0, 0);
		if (currentBG == 0)
		{
			ctx.drawImage(IL.GetBackgroundImage("large-Morning.png"), 0, 0);	
		}
		else if (currentBG == 1)
		{
			ctx.drawImage(IL.GetBackgroundImage("large-Afternoon.png"), 0, 0);	
		}
		else if (currentBG == 2)
		{
			ctx.drawImage(IL.GetBackgroundImage("large-Evening.png"), 0, 0);	
		}
		
	}

	this.DrawGround = function () {
		ctx.save();
		ctx.beginPath();
		var yAdjust = 0;
		if (ARCADE_MODE)
		{
			yAdjust = ARCADE_Y_ADJUST;
		}
		ctx.moveTo(groundShape.partArray[0].x, groundShape.partArray[0].y - yAdjust);
		for (var i = 1; i < groundShape.partArray.length; i++)
		{
			ctx.lineTo(groundShape.partArray[i].x, groundShape.partArray[i].y - yAdjust);
		}
		ctx.strokeStyle = "#50710E";//Grass color
		ctx.lineWidth = 6;
		ctx.stroke();
		ctx.lineTo(STAGE_WIDTH, STAGE_HEIGHT);
		ctx.lineTo(0, STAGE_HEIGHT);
		ctx.fillStyle = "#5f2c11";//Ground color
		ctx.fill();
		ctx.restore();
	}

	this.Clear = function () {
		//canvas.width = canvas.width;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		goctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.Cursor = function () {
		if (ARCADE_MODE)
		{
			if (!inGame && !inTutorial)
			{
				this.Crosshair(mouseX, mouseY);
			}
		}
		else
		{
			if (!cursorVisible)
			{
				this.Crosshair(mouseX, mouseY);
			}
		}
		return;

		if (!cursorVisible)
		{
			ctx.save();
			ctx.translate(mouseX, mouseY);
			ctx.rotate(rr);

			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.arc(0, 0, 2 * PIXEL_SIZE, 0, 2 * Math.PI);
			ctx.moveTo(0, 1 * PIXEL_SIZE);
			ctx.lineTo(0, 3 * PIXEL_SIZE);
			ctx.moveTo(0, -1 * PIXEL_SIZE);
			ctx.lineTo(0, -3 * PIXEL_SIZE);
			ctx.moveTo(1 * PIXEL_SIZE, 0);
			ctx.lineTo(3 * PIXEL_SIZE, 0);
			ctx.moveTo(-1 * PIXEL_SIZE, 0);
			ctx.lineTo(-3 * PIXEL_SIZE, 0);

			ctx.lineWidth = 0.5 * PIXEL_SIZE;
			ctx.stroke();
			ctx.restore();

			rr += 0.1;
		}


		return;


		if (!cursorVisible)
		{
			ctx.save();
			ctx.translate(mouseX, mouseY);
			ctx.rotate(rr);

			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(0, 0 - 7);
			ctx.lineTo(7, 0);
			ctx.lineTo(0, 7);
			ctx.lineTo(- 7, 0);
			ctx.lineTo(0, - 7);

			ctx.moveTo(0, - ff);
			ctx.lineTo(ff, 0);
			ctx.lineTo(0, ff);
			ctx.lineTo(- ff, 0);
			ctx.lineTo(0, - ff);

			ctx.stroke();
			
			ctx.restore();
			ff -= 0.2;
			if (ff <= -6)
			{
				ff = 6;
				//return;
			}
			rr += 0.1;
		}
	}

	this.Crosshair = function (x, y, color) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rr);

		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(0, 0, 2 * PIXEL_SIZE, 0, 2 * Math.PI);
		ctx.moveTo(0, 1 * PIXEL_SIZE);
		ctx.lineTo(0, 3 * PIXEL_SIZE);
		ctx.moveTo(0, -1 * PIXEL_SIZE);
		ctx.lineTo(0, -3 * PIXEL_SIZE);
		ctx.moveTo(1 * PIXEL_SIZE, 0);
		ctx.lineTo(3 * PIXEL_SIZE, 0);
		ctx.moveTo(-1 * PIXEL_SIZE, 0);
		ctx.lineTo(-3 * PIXEL_SIZE, 0);

		ctx.lineWidth = 0.5 * PIXEL_SIZE;
		ctx.stroke();



		ctx.restore();
		
		
	}

	this.DrawFireEffect = function (fire) {
		ctx.save();
		fire.time ++;
		fire.x += fire.xVel;
		fire.y += fire.yVel;
		if (fire.time < 30)
		{
			ctx.globalAlpha = (fire.time / 30);
		}
		else
		{
			ctx.globalAlpha = ((101 - fire.time) / 70);
		}
		ctx.fillStyle = fire.color;
		ctx.fillRect(fire.x, fire.y, 5, 5);
		if (fire.time > 100)
		{
			this.fireEffectList.splice(this.fireEffectList.indexOf(fire), 1);
		}
		ctx.restore();
	}

	this.DrawDustEffect = function (dust) {
		ctx.save();
		dust.time ++;
		dust.x += dust.xVel;
		dust.y += dust.yVel;
		dust.yVel *= 0.99
		if (dust.time < 5)
		{
			ctx.globalAlpha = (dust.time / 5)
			dust.xVel *= 1.05
		}
		else
		{
			ctx.globalAlpha = ((51 - dust.time) / 45)
			dust.xVel *= 0.99
		}
		ctx.fillStyle = dust.color;
		ctx.fillRect(dust.x, dust.y, 5, 5);
		if (dust.time > 50)
		{
			this.dustEffectList.splice(this.dustEffectList.indexOf(dust), 1);
		}
		ctx.restore();
	}

	this.DrawSmokeEffect = function (smoke) {
		ctx.save();
		smoke.time ++;
		smoke.x += smoke.xVel;
		smoke.y += smoke.yVel;
		if (smoke.time < 5)
		{
			ctx.globalAlpha = (smoke.time / 5)
		}
		else
		{
			ctx.globalAlpha = ((31 - smoke.time) / 25)
			smoke.xVel *= 0.99
			smoke.yVel *= 0.99
		}
		ctx.fillStyle = smoke.color;
		ctx.fillRect(smoke.x, smoke.y, 5, 5);
		if (smoke.time > 30)
		{
			this.smokeEffectList.splice(this.smokeEffectList.indexOf(smoke), 1);
		}
		ctx.restore();
	}

	this.DrawHitEffect = function (hitEffect) {
		ctx.save();

		ctx.translate(hitEffect.x, hitEffect.y);
		ctx.rotate(hitEffect.rotation);

		hitEffect.time ++;

		//hitEffect.x += hitEffect.xVel;
		//hitEffect.y += hitEffect.yVel;

		hitEffect.radius += hitEffect.expansion;

		ctx.save();

		if (hitEffect.time < 5)
		{
			ctx.globalAlpha = (hitEffect.time / 5);
			//ctx.globalAlpha = (1);
		}
		if (hitEffect.time >= hitEffect.lifespan)
		{
			ctx.globalAlpha = (0);
		}
		else
		{
			ctx.globalAlpha = (((hitEffect.lifespan + 1) - hitEffect.time) / hitEffect.lifespan)
		}

		ctx.strokeStyle = hitEffect.color;
		ctx.beginPath();
		ctx.arc(0, 0, hitEffect.radius, 0, 2 * Math.PI);
		ctx.lineWidth = 0.5 * PIXEL_SIZE;
		ctx.stroke();

		ctx.restore();

		ctx.save();

		if (hitEffect.time < 5)
		{
			ctx.globalAlpha = (hitEffect.time / 5);
			//ctx.globalAlpha = (1);
		}
		if (hitEffect.time >= hitEffect.lifespan)
		{
			ctx.globalAlpha = (0);
		}
		else
		{
			ctx.globalAlpha = (((hitEffect.lifespan + 1) - hitEffect.time) / hitEffect.lifespan)
		}

		ctx.strokeStyle = hitEffect.color;
		ctx.beginPath();
		var start = 5 + ((hitEffect.expansion + 2) * hitEffect.time) - 30;
		if (start < 5)
		{
			start = 5;
		}
		ctx.moveTo(0, start);
		ctx.lineTo(0, 0 + ((hitEffect.expansion + 2) * hitEffect.time));

		ctx.lineWidth = 0.5 * PIXEL_SIZE;
		ctx.stroke();

		ctx.save();

		ctx.rotate(hitEffect.rotation2);

		ctx.strokeStyle = hitEffect.color;
		ctx.beginPath();
		var start = 5 + ((hitEffect.expansion + 2) * hitEffect.time) - 30;
		if (start < 5)
		{
			start = 5;
		}
		ctx.moveTo(0, start);
		ctx.lineTo(0, 0 + ((hitEffect.expansion + 2) * hitEffect.time));

		ctx.lineWidth = 0.5 * PIXEL_SIZE;
		ctx.stroke();

		ctx.restore();

		ctx.save();

		ctx.rotate(hitEffect.rotation3);

		ctx.strokeStyle = hitEffect.color;
		ctx.beginPath();
		var start = 5 + ((hitEffect.expansion + 2) * hitEffect.time) - 30;
		if (start < 5)
		{
			start = 5;
		}
		ctx.moveTo(0, start);
		ctx.lineTo(0, 0 + ((hitEffect.expansion + 2) * hitEffect.time));

		ctx.lineWidth = 0.5 * PIXEL_SIZE;
		ctx.stroke();

		ctx.restore();

		ctx.restore();


		if (hitEffect.time > hitEffect.lifespan)
		{
			this.hitEffectList.splice(this.hitEffectList.indexOf(hitEffect), 1);
		}



		ctx.restore();
	}

	this.DrawGrassPiece = function(grassPiece) {
		ctx.save();
		ctx.translate(grassPiece.x, grassPiece.y);
		ctx.rotate(grassPiece.angle);
		ctx.globalAlpha = (grassPiece.alpha);
		ctx.fillStyle = grassPiece.color;
		ctx.fillRect(0, -8, 5, 10);
		ctx.restore();
	}

	//***
	this.DrawDirtPiece = function(dirtPiece) {
		ctx.save();
		ctx.translate(dirtPiece.x, dirtPiece.y);
		ctx.rotate(dirtPiece.angle);
		ctx.globalAlpha = (dirtPiece.alpha);
		ctx.fillStyle = dirtPiece.color;
		ctx.fillRect(- dirtPiece.size / 2, - dirtPiece.size / 2, dirtPiece.size, dirtPiece.size);
		ctx.restore();
	}

	this.DrawGameText = function (message, font, size, color, x, y)
	{

		ctx.save();

		ctx.font = "" + size + "px " + font;
		ctx.fillStyle = color;

		ctx.save();

		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 2;
      	ctx.shadowOffsetX = size / 20;
      	ctx.shadowOffsetY = size / 20;
      	ctx.textAlign = "center";
		ctx.fillText(message, x, y);

		ctx.restore();

		ctx.shadowColor = "#000000";
      	ctx.shadowBlur = 0;
      	ctx.shadowOffsetX = size / 40;
      	ctx.shadowOffsetY = size / 40;
		ctx.strokeStyle = "#FFFFFF";
		var lineWeight = (size / 13);
		/*
		if (lineWeight > 20)
		{
			lineWeight = 19;
		}
		*/
		ctx.lineWidth = lineWeight;
		ctx.textAlign = "center";
		ctx.strokeText(message, x, y);

		ctx.restore();
	}

	this.CheckMenuHover = function (button, mX, mY) {
		ctx.save();
		ctx.font = "" + button.fontSize + "px lowrider";
		var buttonLength = ctx.measureText(button.message).width + 42;
		var buttonHeight = button.fontSize + 42;
		ctx.restore();

		var withinX = false;
		var withinY = false;
		if (button.x - buttonLength / 2 < mX && button.x + button.buttonLength / 2 > mX)
		{
			withinX = true;
		}
		if (button.y - button.buttonHeight / 2 < mY && button.y + button.buttonHeight / 2 > mY)
		{
			withinY = true;
		}
		if (withinX && withinY)
		{
			return true;
		}
		return false;
	}

	this.DrawMenuButton = function (button) 	{
		ctx.save();

		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 12;

		ctx.save();

		ctx.font = "" + button.fontSize + "px lowrider";

		var buttonLength = ctx.measureText(button.message).width + 30;
		var buttonHeight = button.fontSize + 30;

		ctx.restore();

		var xPos = button.x - (buttonLength / 2);
		var yPos = button.y - (buttonHeight / 2);

		ctx.beginPath();
		ctx.moveTo(xPos, yPos);
		ctx.lineTo(xPos + buttonLength, yPos);
		if (button.shape == "round")
		{
			ctx.arc(xPos + buttonLength, yPos + buttonHeight / 2, buttonHeight / 2, 1.5 * Math.PI, 0.5 * Math.PI);
		}
		else
		{
			ctx.lineTo(xPos + buttonLength, yPos + buttonHeight);
		}
		ctx.lineTo(xPos, yPos + buttonHeight);
		if (button.shape == "round")
		{
			ctx.arc(xPos, yPos + buttonHeight / 2, buttonHeight / 2, 0.5 * Math.PI, 1.5 * Math.PI);
		}
		else
		{
			ctx.lineTo(xPos, yPos);
		}

		ctx.closePath();

		ctx.stroke();

		if (button.state == "up")
		{
			var lowerGradient = ctx.createLinearGradient(xPos, yPos, xPos, yPos + buttonHeight);
			lowerGradient.addColorStop(1, "#0A0A0A");
			lowerGradient.addColorStop(0, "#464545");
			ctx.fillStyle = lowerGradient;	
		}
		else if (button.state == "down")
		{
			var lowerGradient = ctx.createLinearGradient(xPos, yPos, xPos, yPos + buttonHeight);
			lowerGradient.addColorStop(0, "#0A0A0A");
			lowerGradient.addColorStop(1, "#292929");
			ctx.fillStyle = lowerGradient;	
		}
		else if (button.state == "hover")
		{
			var lowerGradient = ctx.createLinearGradient(xPos, yPos, xPos, yPos + buttonHeight);
			lowerGradient.addColorStop(0, "#FABE07");
			lowerGradient.addColorStop(1, "#755902");
			ctx.fillStyle = lowerGradient;
		}

		
		ctx.fill();

		ctx.restore();

		ctx.save();

		if (button.state == "down")
		{
			this.DrawGameText(button.message, "lowrider", button.fontSize, "#000000", button.x, button.y + ((button.fontSize / 3 ) + 3));
			
		}
		else if (button.state == "hover")
		{
			this.DrawGameText(button.message, "lowrider", button.fontSize, "#FABE07", button.x, button.y + (button.fontSize / 3));
		}
		else
		{
			this.DrawGameText(button.message, "lowrider", button.fontSize, "#000000", button.x, button.y + (button.fontSize / 3));
		}


		ctx.restore();

		ctx.save();

		ctx.beginPath();

		var insideButtonLength = buttonLength - 8;
		var insideButtonHeight = buttonHeight - 8;
		var newXPos = xPos + 4;
		var newYPos = yPos + 4;

		ctx.moveTo(newXPos, newYPos);
		ctx.lineTo(newXPos + insideButtonLength, newYPos);
		if (button.shape == "round")
		{
			ctx.arc(newXPos + insideButtonLength, newYPos + insideButtonHeight / 2, insideButtonHeight / 2, 1.5 * Math.PI, 0.5 * Math.PI);
		}
		else
		{
			ctx.lineTo(newXPos + insideButtonLength, newYPos + insideButtonHeight);
		}
		ctx.lineTo(newXPos, newYPos + insideButtonHeight);
		if (button.shape == "round")
		{
			ctx.arc(newXPos, newYPos + insideButtonHeight / 2, insideButtonHeight / 2, 0.5 * Math.PI, 1.5 * Math.PI);
		}
		else
		{
			ctx.lineTo(newXPos, newYPos);
		}

		var upperGradient = ctx.createLinearGradient(newXPos, newYPos, newXPos, newYPos + insideButtonHeight);
		upperGradient.addColorStop(0, "rgba(255, 255, 255, 0.75");
		upperGradient.addColorStop(0.5, "transparent");
		ctx.fillStyle = upperGradient;
		
		if (button.state == "up")
		{
			ctx.fill();
			
		}

		ctx.restore();
	}

	this.DrawAllButtons = function () {
		for (var i = 0; i < this.buttonList.length; i++) {
			if (this.CheckMenuHover(this.buttonList[i], mouseX, mouseY))
			{
				this.buttonList[i].state = "hover";
			}
			else
			{
				this.buttonList[i].state = "up";
			}
			this.DrawMenuButton(this.buttonList[i]);
		};
	}

	this.DrawGoText = function (message, font, size, color, x, y)
	{
		goctx.save();

		goctx.font = "" + size + "px " + font;
		goctx.fillStyle = color;

		goctx.save();

		goctx.shadowColor = "#000000";
      	goctx.shadowBlur = 2;
      	goctx.shadowOffsetX = size / 20;
      	goctx.shadowOffsetY = size / 20;
      	goctx.textAlign = "center";
		goctx.fillText(message, x, y);

		goctx.restore();

		goctx.shadowColor = "#000000";
      	goctx.shadowBlur = 0;
      	goctx.shadowOffsetX = size / 40;
      	goctx.shadowOffsetY = size / 40;
		goctx.strokeStyle = "#FFFFFF";
		var lineWeight = (size / 13);
		/*
		if (lineWeight > 20)
		{
			lineWeight = 19;
		}
		*/
		goctx.lineWidth = lineWeight;
		goctx.textAlign = "center";
		goctx.strokeText(message, x, y);

		goctx.restore();
	}

	this.GoalMessage = function (color)
	{
		if (roundOverTimer >= ROUND_OVER_TIME)
		{
			return;
		}
		ctx.save();

		ctx.globalAlpha = 0.2;
		ctx.fillStyle = color;

		var sizeFraction;
		if (roundOverTimer <= 15)
		{
			sizeFraction = (roundOverTimer / 15);
		}
		else if (roundOverTimer > ROUND_OVER_TIME)
		{
			sizeFraction = 0;
		}
		else if (roundOverTimer >= (ROUND_OVER_TIME - 15))
		{
			sizeFraction = Math.abs(ROUND_OVER_TIME - roundOverTimer) / 15;
		}
		else
		{
			sizeFraction = 1;
		}

		var smallBarHeight = canvas.height / 15 * sizeFraction;
		var largeBarHeight = canvas.height / 6 * sizeFraction;
		ctx.fillRect(0, canvas.height / 3 - (smallBarHeight / 2), canvas.width, smallBarHeight);
		ctx.fillRect(0, canvas.height / 1.8 - (largeBarHeight / 2), canvas.width, largeBarHeight);

		ctx.restore();

		var goalMessageX = 100 * Math.tan(((roundOverTimer / ROUND_OVER_TIME) * Math.PI) + (Math.PI / 2) - 0.01) + (canvas.width / 2);
		this.DrawGameText("Goal!", "lowrider", 200, color, goalMessageX, canvas.height - canvas.height / 2.5);
		//roundOverTimer ++;
	}

	this.RoundStartMessage = function ()
	{
		
		if (roundStartingTimer >= ROUND_START_TIME / 2)
		{
			ctx.save();

			var scaleRatio;
			if (roundStartingTimer > ROUND_START_TIME)
			{
				scaleRatio = 0;
			}
			else if ((roundStartingTimer - ROUND_START_TIME / 2) <= 6)
			{
				scaleRatio = (roundStartingTimer - ROUND_START_TIME / 2) / 6;
			}
			else if (roundStartingTimer >= (ROUND_START_TIME - 6))
			{
				scaleRatio = Math.abs( (ROUND_START_TIME - roundStartingTimer) / 6);
			}
			else
			{
				scaleRatio = 1;
			}

			ctx.scale(1, scaleRatio);
			this.DrawGameText("SET", "lowrider", 175, player2Sprite.GetColor(), canvas.width / 2, ((canvas.height - canvas.height / 2.5 - (75 * (1 - scaleRatio))) / scaleRatio));

			ctx.restore();
		}
		else
		{
			ctx.save();

			var scaleRatio;
			if (roundStartingTimer > ROUND_START_TIME / 2)
			{
				scaleRatio = 0;
			}
			else if (roundStartingTimer <= 6)
			{
				scaleRatio = roundStartingTimer / 6;
			}
			else if (roundStartingTimer >= ((ROUND_START_TIME / 2) - 6))
			{
				scaleRatio = Math.abs( ((ROUND_START_TIME / 2) - roundStartingTimer) / 6);
			}
			else
			{
				scaleRatio = 1;
			}

			ctx.scale(1, scaleRatio);
			if (!inTutorial)
			{
				this.DrawGameText("READY", "lowrider", 150, player1Sprite.GetColor(), canvas.width / 2, ((canvas.height - canvas.height / 2.5 - (75 * (1 - scaleRatio))) / scaleRatio));
			}

			ctx.restore();
		}
	}

	/*
	this.DrawPlayerTrailEffect = function (trail) {
		var dir = (trail.direction == "left") ? -1 : 1;
		ctx.save();
		ctx.globalAlpha = (0.2 - trail.time / 150);
		ctx.scale(dir, 1);
		ctx.drawImage(IL.GetFilteredImage(trail.image, trail.filter),
			24 * trail.frame, 0, 24, 24,
			dir * (trail.x - dir * 90), trail.y - 180, 24 * PIXEL_SIZE, 24 * PIXEL_SIZE);
		ctx.restore();
		trail.time ++;
		if (trail.time > 30)
		{
			this.trailEffectList.splice(this.trailEffectList.indexOf(trail), 1);
		}
	}
	*/
	this.DrawPlayerTrailEffect = function (trail) {
		
		var dir = (trail.direction == "left") ? -1 : 1;
		var topX;
		var bottomX;
		var topY;
		var bottomY;
		var prevTopX;
		var prevBottomX;
		var prevTopY;
		var prevBottomY;
		
		ctx.save();

		if (!trail.isDashing)
		{
			if (trail.timeSinceDash > DASH_FADE)
			{
				this.trailEffectList.splice(this.trailEffectList.indexOf(trail), 1);
				ctx.restore();
				return;
			}
			else
			{
				topX = trail.x;// + (2 * PIXEL_SIZE * dir);
				bottomX = trail.x;
				topY = trail.y - (12 * PIXEL_SIZE);// + (0.1 * PIXEL_SIZE * trail.timeSinceDash);
				bottomY = trail.y - (2 * PIXEL_SIZE);// - (0.1 * PIXEL_SIZE * trail.timeSinceDash);
				if (trail.timeSinceDash <= 1)
				{
					prevTopX = trail.prevX;
					//prevTopX = trail.prevX + (2 * PIXEL_SIZE * dir);
				}
				else
				{
					prevTopX = trail.prevX;
				}
				prevBottomX = trail.prevX;
				prevTopY = trail.prevY - (12 * PIXEL_SIZE);// + (0.1 * PIXEL_SIZE * (trail.timeSinceDash - 1));
				prevBottomY = trail.prevY - (2 * PIXEL_SIZE);// - (0.1 * PIXEL_SIZE * (trail.timeSinceDash - 1));
				ctx.globalAlpha = ((trail.intensity * ((DASH_FADE - trail.timeSinceDash) / DASH_FADE)) - (trail.intensity * ((DASH_FADE - trail.timeSinceDash) / DASH_FADE) * (trail.time / trail.lifespan)));
			}
		}
		else
		{
			topX = trail.x;// + (2 * PIXEL_SIZE * dir);
			bottomX = trail.x;
			topY = trail.y - (12 * PIXEL_SIZE);
			bottomY = trail.y - (2 * PIXEL_SIZE);
			prevTopX = trail.prevX;// + (2 * PIXEL_SIZE * dir);
			prevBottomX = trail.prevX;
			prevTopY = trail.prevY - (12 * PIXEL_SIZE);
			prevBottomY = trail.prevY - (2 * PIXEL_SIZE);
			if (trail.timeInDash <= 4)
			{
				ctx.globalAlpha = ((trail.intensity * (trail.timeInDash / 4)) - (trail.intensity * (trail.timeInDash / 4) * (trail.time / trail.lifespan)));
			}
			else
			{
				ctx.globalAlpha = (trail.intensity - (trail.intensity * (trail.time / trail.lifespan)));
				
			}
		}


		ctx.beginPath();

		ctx.moveTo(topX, topY);
		ctx.lineTo(prevTopX, prevTopY);
		ctx.lineTo(prevBottomX, prevBottomY);
		ctx.lineTo(bottomX, bottomY);
		ctx.lineTo(topX, topY);

		ctx.closePath();

		ctx.fillStyle = trail.color;
		//ctx.fillStyle = RandomColor();
		ctx.fill();
		ctx.restore();
		trail.time ++;
		if (trail.time > trail.lifespan)
		{
			this.trailEffectList.splice(this.trailEffectList.indexOf(trail), 1);
		}
	}


	this.DrawBallTrailEffect = function (trail) {

		var ballRightX = trail.x + 2 * PIXEL_SIZE;
		var ballLeftX = trail.x - 2 * PIXEL_SIZE;
		var ballTopY = trail.y - 4 * PIXEL_SIZE;
		var ballBottomY = trail.y;

		var prevRightX = trail.prevX + 2 * PIXEL_SIZE;
		var prevLeftX = trail.prevX - 2 * PIXEL_SIZE;
		var prevTopY = trail.prevY - 4 * PIXEL_SIZE;
		var prevBottomY = trail.prevY;

		ctx.save();
		//ctx.globalAlpha = (0.2);
		//ctx.globalAlpha = (0.2 - trail.time / 150);
		ctx.globalAlpha = (trail.intensity - (trail.intensity * (trail.time / trail.lifespan)));
		//ctx.drawImage(IL.GetOtherImage("Ball.png"), 0, 0, 4, 4, trail.x - 2 * PIXEL_SIZE, trail.y - 4 * PIXEL_SIZE, 4 * PIXEL_SIZE, 4 * PIXEL_SIZE);
		ctx.beginPath();

		if (trail.x >= trail.prevX)
		{
			if (trail.y >= trail.prevY)
			{
				ctx.moveTo(ballLeftX, ballBottomY);
				ctx.lineTo(ballLeftX, ballTopY);
				ctx.lineTo(ballRightX, ballTopY);
				ctx.lineTo(prevRightX, prevTopY);
				ctx.lineTo(prevLeftX, prevTopY);
				ctx.lineTo(prevLeftX, prevBottomY);
				ctx.lineTo(ballLeftX, ballBottomY);
			}
			else if (trail.y < trail.prevY)
			{
				ctx.moveTo(ballRightX, ballBottomY);
				ctx.lineTo(prevRightX, prevBottomY);
				ctx.lineTo(prevLeftX, prevBottomY);
				ctx.lineTo(prevLeftX, prevTopY);
				ctx.lineTo(ballLeftX, ballTopY);
				ctx.lineTo(ballLeftX, ballBottomY);
				ctx.lineTo(ballRightX, ballBottomY);
			}
		}
		else
		{
			if (trail.y >= trail.prevY)
			{
				ctx.moveTo(ballRightX, ballBottomY);
				ctx.lineTo(ballRightX, ballTopY);
				ctx.lineTo(ballLeftX, ballTopY);
				ctx.lineTo(prevLeftX, prevTopY);
				ctx.lineTo(prevRightX, prevTopY);
				ctx.lineTo(prevRightX, prevBottomY);
				ctx.lineTo(ballRightX, ballBottomY);
			}
			else if (trail.y < trail.prevY)
			{
				ctx.moveTo(ballLeftX, ballBottomY);
				ctx.lineTo(prevLeftX, prevBottomY);
				ctx.lineTo(prevRightX, prevBottomY);
				ctx.lineTo(prevRightX, prevTopY);
				ctx.lineTo(ballRightX, ballTopY);
				ctx.lineTo(ballRightX, ballBottomY);
				ctx.lineTo(ballLeftX, ballBottomY);
			}
		}

		ctx.closePath();

		ctx.fillStyle = "#F0F000";
		//ctx.fillStyle = RandomColor();
		ctx.fill();

		if (trail.bounce)
		{
			ctx.beginPath();
			ctx.moveTo(ballLeftX, ballBottomY);
			ctx.lineTo(ballRightX, ballBottomY);
			ctx.lineTo(ballRightX, ballTopY);
			ctx.lineTo(ballLeftX, ballTopY);
			ctx.lineTo(ballLeftX, ballBottomY);
			ctx.closePath();
			ctx.fill();
		}

		ctx.restore();
		trail.time ++;
		if (trail.time > trail.lifespan)
		{
			this.ballTrailEffectList.splice(this.ballTrailEffectList.indexOf(trail), 1);
		}
	}
}

function RandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

// Blend two colors together.
// weight is 1 if completely color2, 0.5 if halfway between 1 and 2
function BlendColors (color1, color2, weight)
{
	var r1 = parseInt(color1.slice(1, 3), 16);
	var g1 = parseInt(color1.slice(3, 5), 16);
	var b1 = parseInt(color1.slice(5, 7), 16);
	var r2 = parseInt(color2.slice(1, 3), 16);
	var g2 = parseInt(color2.slice(3, 5), 16);
	var b2 = parseInt(color2.slice(5, 7), 16);
	var oWeight = 1 - weight;
	var rm = Math.round(r1 * oWeight + r2 * weight);
	var rms = rm.toString(16)
	rms = (rms.length == 1) ? "0" + rms : rms
	var gm = Math.round(g1 * oWeight + g2 * weight);
	var gms = gm.toString(16)
	gms = (gms.length == 1) ? "0" + gms : gms
	var bm = Math.round(b1 * oWeight + b2 * weight);
	var bms = bm.toString(16)
	bms = (bms.length == 1) ? "0" + bms : bms
	return "#" + rms + gms + bms;
}