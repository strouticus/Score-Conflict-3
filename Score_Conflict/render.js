//render.js
//everything having to do with rendering

var ff = 0;
var rr = 0;

var p1ReticleFade = 0;
var p2ReticleFade = 0;

var p1FireTime = 10;
var p2FireTime = 10;

function FireEffect (x, y, color) {
	this.x = x + Math.random() * PIXEL_SIZE * 8 - PIXEL_SIZE * 4;
	this.y = y - 5;
	this.color = color;
	this.time = 0;
	this.xVel = Math.random() - 0.5;
	this.yVel = -Math.random();
}

//Render constructor, takes imageLoader reference
function Render () {

	this.fireEffectList = [];

	this.RenderFrame = function () {
		this.Clear();
		this.DrawBackground();
		//ctx.drawImage(IL.GetFilteredImage("megaman.png", 0), 0, 0);
		//ctx.drawImage(IL.GetFilteredImage("final_fantasy.png", 0), 0, 100);

		this.DrawGround();
		this.DrawPlayer(player1Sprite);
		this.DrawPlayer(player2Sprite);
		this.DrawBall();
		this.DrawGoals();

		rr += 0.05;
		this.Cursor();

		this.ChargeEffect(player1Sprite, "#FF0000");
		this.ChargeEffect(player2Sprite, "#0000FF");

		
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
		for (var i = 0; i < this.fireEffectList.length; i++)
		{
			this.DrawFireEffect(this.fireEffectList[i]);
		}

		this.KickAimReticle(player1Sprite, "#FF0000");

		if (player2Sprite.linkedEntity.mode == "kickHold")
		{
			p2ReticleFade += 0.1;
			ctx.save();
			ctx.setAlpha(p2ReticleFade);
			this.Crosshair(player2Sprite.GetX() +  player2Sprite.linkedEntity.CheckDirection() * 100 * Math.cos(player2Sprite.linkedEntity.kickAngle), player2Sprite.GetY() - 100 * Math.sin(player2Sprite.linkedEntity.kickAngle), "#0000FF");
			ctx.restore();
		}
		else
		{
			p2ReticleFade = 0;
		}
		
		ctx.drawImage(testCanvas, 0, 0);
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
			ctx.setAlpha(playerSprite.linkedEntity.reticleFade);
			this.Crosshair(playerSprite.GetX() +  playerSprite.linkedEntity.CheckDirection() * 100 * Math.cos(playerSprite.linkedEntity.kickAngle), playerSprite.GetY() - 100 * Math.sin(playerSprite.linkedEntity.kickAngle), color);
			ctx.restore();
		}
		
	}

	this.AddFireEffect = function (playerSprite, color) {
		this.fireEffectList.push(new FireEffect(playerSprite.GetX(), playerSprite.GetY(), color));
	}

	this.DrawGoals = function () {
		
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(0, goalEntity.top, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
		ctx.fillRect(0, goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
		ctx.fillRect(0, goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);

		ctx.fillStyle = "#0000FF";
		ctx.fillRect(960 - 4 * PIXEL_SIZE, goalEntity.top, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
		ctx.fillRect(960 - 4 * PIXEL_SIZE, goalEntity.bottom, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE);
		ctx.fillRect(960 - 2 * PIXEL_SIZE, goalEntity.top, 2 * PIXEL_SIZE, goalEntity.bottom - goalEntity.top);


	}

	this.DrawPlayer = function (playerSprite) {
		var dir = playerSprite.linkedEntity.CheckDirection();
		ctx.save();
		ctx.scale(dir, 1);
		ctx.drawImage(IL.GetFilteredImage(playerSprite.GetImage(), playerSprite.GetFilter()),
			24 * playerSprite.GetFrame(), 0, 24, 24,
			dir * (playerSprite.GetX() - dir * 90), playerSprite.GetY() - 180, 24 * PIXEL_SIZE, 24 * PIXEL_SIZE);
		playerSprite.Tick();
		ctx.restore();
	}

	this.DrawBall = function () {
		ctx.drawImage(IL.GetOtherImage("Ball.png"), 0, 0, 4, 4, ballEntity.x - 2 * PIXEL_SIZE, ballEntity.y - 4 * PIXEL_SIZE, 4 * PIXEL_SIZE, 4 * PIXEL_SIZE);
	}

	this.DrawBackground = function () {
		//ctx.drawImage(IL.GetBackgroundImage("illegal_sky.png"), 0, 0);
		//ctx.drawImage(IL.GetBackgroundImage("blursky.png"), 0, 0);
		ctx.drawImage(IL.GetBackgroundImage("blend.png"), 0, 0);
	}

	this.DrawGround = function () {
		ctx.beginPath();
		ctx.moveTo(groundShape.partArray[0].x, groundShape.partArray[0].y);
		for (var i = 1; i < groundShape.partArray.length; i++)
		{
			ctx.lineTo(groundShape.partArray[i].x, groundShape.partArray[i].y);
		}
		ctx.stroke();
	}

	this.Clear = function () {
		//canvas.width = canvas.width;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.Cursor = function () {
		if (!cursorVisible)
		{
			this.Crosshair(mouseX, mouseY);
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

		//rr += 0.1;
	}

	this.DrawFireEffect = function (fire) {

		ctx.save();

		fire.time ++;

		fire.x += fire.xVel;
		fire.y += fire.yVel;

		

		if (fire.time < 30)
		{
			ctx.setAlpha(fire.time / 30)
		}
		else
		{
			ctx.setAlpha((101 - fire.time) / 70)
		}

		ctx.fillStyle = fire.color;
		ctx.fillRect(fire.x, fire.y, 5, 5);

		if (fire.time > 100)
		{
			this.fireEffectList.splice(this.fireEffectList.indexOf(fire), 1);
		}
		ctx.restore();
	}
}