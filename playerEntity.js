//playerEntity.js

var GRAVITY = 1.3;

var FRICTION_X = 0.85;
var FRICTION_Y = 0.9;

var FRICTION_CUTOFF_X = 15;
var FRICTION_CUTOFF_Y = 10;

var FRICTION_X_2 = 0.9;
var FRICTION_Y_2 = 0.9;

var MOVE_SPEED = 0.75;
var AIR_MOVE_SPEED = 0.65;
var JUMP_SPEED = 20;

var LAUNCHED_SPEED = 0.5;


var JUMP_HOLDSPEED = 2.8;
var JUMP_HOLD_DECAY = 0.1;

var DASH_SPEED = 8;
var DASH_SPEED_SLOW = 10;
var DASH_SPEED_AIR = 6;
var DASH_SPEED_AIR_SLOW = 10;

var PUNCH_SPEED = 0.5;

var FLIP_SPEED = 1;

var PUNCH_KNOCKBACK_X_WEAK = 6;
var PUNCH_KNOCKBACK_Y_WEAK = 2;

var PUNCH_KNOCKBACK_X = 50;
var PUNCH_KNOCKBACK_Y = -50;

var PUNCH_BALL_STRONG_X = 5;
var PUNCH_BALL_STRONG_Y = -4;

var PUNCH_KNOCKBACK_X_WEAK_BALL = 1.5;
var PUNCH_KNOCKBACK_Y_WEAK_BALL = 0;

var AIR_PUNCH_KNOCKBACK_X = 18;
var AIR_PUNCH_KNOCKBACK_Y = -15;


var KICK_KNOCKBACK_ANGULAR = 10;
var KICK_KNOCKBACK_X = 5;
var KICK_KNOCKBACK_Y = 5;

var KICK_BALL_FORCE = 30;

var SPIKE_KNOCKBACK_X = 0;
var SPIKE_KNOCKBACK_Y = 30;

var BALL_DRIBBLE_X = 5;

var CHARGE_PER_FRAME = 0.02;

var CHARGE_BASE = 1;
var CHARGE_MAX = 4;

var PSYCHIC_BLAST_X = 50;
var PSYCHIC_BLAST_Y = -25;

var SLIDE_TACKLE_KNOCKBACK_X = 25;
var SLIDE_TACKLE_KNOCKBACK_Y = -15;

var SLIDE_TACKLE_BALL_KNOCKBACK_X = 10;
var SLIDE_TACKLE_BALL_KNOCKBACK_Y = -5;

var SLIDE_TACKLE_X_VEL = 18;
var SLIDE_TACKLE_CONSTANT_X_VEL = 1.1;
var SLIDE_TACKLE_AIR_Y_VEL = -5;



/*
var imageReference = {
	idle: "SCD_Idle.png", walking: "SCD_WalkRight.png",
	jumpTakeoff: "SCD_JumpTakeoff.png", jumpRising: "SCD_JumpRising.png", jumpApex: "SCD_JumpSwitch.png", jumpFalling: "SCD_JumpFalling.png", jumpLanding: "SCD_JumpLanding.png",
	blockingGround: "SCD_Blocking.png", blockingAir: "SCD_Blocking.png", dashGround: "SCD_Dash_Ground.png", dashAir: "SCD_Dash_Ground.png",
	kickWindup: "SCD_KickWindup.png", kickHold: "SCD_KickHold.png", kickRelease: "SCD_KickRelease.png",
	punching: "SCD_PunchCombo.png", tripping: "SCD_Trip.png", charging: "SCD_Charging.png", spiking: "SCD_Spiking.png",
	hitstun: "SCD_Hitstun.png", launched: "SCD_Launched.png", crashland: "SCD_CrashLand.png", tripped: "SCD_Tripped_02.png", down: "SCD_Down.png", getup: "SCD_Getup.png",
	flip: "SCD_Flip.png", flipLandSafe: "SCD_FlipLandSafe.png", downTurn: "SCD_DownTurn.png", flipLandTrip: "SCD_FlipLandTrip.png"
}
*/

var ATTACK_TYPE = {WEAK:1, STRONG:2, TRIP:3, SPIKE:4, AIR_PUNCH:5, PSYCHIC_BLAST:6, SLIDE_TACKLE:7};


//keyInput: 0-Up, 1-Left, 2-Down, 3-Right

function PlayerEntity (keyInput) {
	this.keyInput = keyInput
	this.doAI = false;
	this.doAI2 = false;
	this.doAItut = false;

	this.eggo = 0;
	this.eggoWait = false;
	this.chargeSound;
	this.x = 100;
	this.y = 483;
	this.xVel = 0;
	this.yVel = 0;
	this.mode = "idle";
	this.direction = "right";
	this.linkedSprite = undefined;
	this.jumpDecay = 0;
	this.enemyEntity = undefined;
	this.ballTarget = ballEntity;
	this.hasDoubleJump = true;
	
	this.isHoldingBall = false;
	this.ballBeingHeld = undefined;

	this.flipSuccess = true;

	this.releasedJump = true;
	this.releasedUp = true;
	this.releasedAttack = true;
	this.releasedSpecial = true;

	this.charge = CHARGE_BASE;
	this.chargeFlash = false;
	this.fireTime = 10;
	this.reticleFade = 0;

	this.hitOpponent = false;
	this.hitBall = false;

	this.health = 3;
	this.knockedOut = false;

	this.energy = 10;

	this.hasHitGround = false;

	this.controllable = true;

	this.hitContact = false;

	this.collisionX = 0;
	this.collisionY = 0;

	this.hitType = 0;

	this.prevX = 0;
	this.prevY = 0;

	this.timeSinceDash = 1000;
	this.timeInDash = 1000;

	this.slowTimer = 0;

	this.holdingUp = false;
	this.holdingDown = false;

	this.ResetSelf = function () {
		//this.chargeSound;
		//this.x = 100;
		//this.y = 483;
		this.xVel = 0;
		this.yVel = 0;
		this.mode = "idle";
		//this.direction = "right";
		//this.linkedSprite = undefined;
		this.jumpDecay = 0;
		//this.enemyEntity = undefined;
		this.flipSuccess = true;
		this.releasedJump = true;
		this.releasedUp = true;
		this.releasedAttack = true;
		this.releasedSpecial = true;
		this.charge = CHARGE_BASE;
		this.chargeFlash = false;
		this.fireTime = 10;
		this.reticleFade = 0;
		this.hitOpponent = false;
		this.hitBall = false;
		this.health = 3;
		this.knockedOut = false;
		this.energy = 10;
		this.hasHitGround = false;
		this.linkedSprite.SetMode(this.mode);
		this.isHoldingBall = false;
	}


	this.SelfUpdate = function () {
		if (this == player1Entity)
		{
			//console.log("Mode: " + this.mode + ", Sprite Mode: " + this.linkedSprite.currentMode);
			//console.log(this.linkedSprite.currentFrame);
		}
		if (this.slowTimer > 0)
		{
			MOVE_SPEED = 0.5;
			this.slowTimer--;
		}
		else
		{
			MOVE_SPEED = 0.75;
		}
		if (this.controllable)
		{
			this.ApplyInput();
		}
		if (this.mode === "slideTackling") {
			this.xVel += (this.CheckDirection() * SLIDE_TACKLE_CONSTANT_X_VEL);
		}
		this.HitGround();
		this.ApplyGravity();
		if (this.mode === "kickWindup") {
			this.xVel *= 0.95;
			this.yVel *= 0.95;
		}
		this.MoveByVelocity();
		this.ApplyFriction();
		this.DoBoundaries();
		if (this.InAttack())
		{
			if (this.InPlayerAttack())
			{
				var attackNum = CL.CheckCollision(this, this.enemyEntity, false);
				if (attackNum != 0)
				{
					this.DoAttack(attackNum, this.enemyEntity);
				}
			}

			if (this.mode === "kickRelease") {
				this.DoBallAttack(undefined, this.ballTarget);
			} else {
				var attackNumBall = CL.CheckCollision(this, this.ballTarget, true);
				if (attackNumBall != 0)
				{
					this.DoBallAttack(attackNumBall, this.ballTarget);
				}
			}
			
		}

		this.linkedSprite.Tick();

		this.timeSinceDash ++;
		this.timeInDash ++;
	}
	this.DoBoundaries = function () {
		if (this.CheckLeftEdge())
		{
			this.x = 0;
			this.xVel = Math.abs(this.xVel) * 0.9;
			if (this.mode == "launched")
			{
				this.direction = "right";
			}
		}
		if (this.CheckRightEdge())
		{
			this.x = STAGE_WIDTH;
			this.xVel = -Math.abs(this.xVel) * 0.9;
			if (this.mode == "launched")
			{
				this.direction = "left";
			}
		}
		/*if (this.y < 12 * PIXEL_SIZE)
		{
			this.y = 12 * PIXEL_SIZE;
			this.yVel = Math.abs(this.yVel) * 0.9;
		}*/
	}
	this.InHitstun = function () {
		switch (this.mode)
		{
			//case "hitstun":
			case "launched":
			case "crashland":
			case "tripped":
			case "down":
			case "downTurn":
			case "flipLandTrip":
			return true;
			break;
			default:
			return false;
			break;
			case "getup":
			return (this.linkedSprite.GetFrame() < 3)
			break;
		}
	}

	this.InAttack = function () {
		switch (this.mode)
		{
			case "kickRelease":
			case "punching":
			case "tripping":
			case "slideTackling":
			case "airPunching":
			case "blockingGround":
			case "blockingAir":
			case "dashAir":
			case "dashAirShieldStart":
			case "countering":
			return true;
			break;
			default:
			return false;
			break;
		}
	}

	this.InPlayerAttack = function () {
		switch (this.mode)
		{
			case "punching":
			case "tripping":
			case "slideTackling":
			case "airPunching":
			return true;
			break;
			default:
			return false;
			break;
		}
	}

	this.InDash = function () {
		switch (this.mode)
		{
			case "dashGround":
			case "dashAir":
			return true;
			break;
			default:
			return false;
			break;
		}
	}

	this.CanPickupBall = function () {
		switch (this.mode) {
			case "idle":
			case "walking":
			case "jumpRising":
			case "jumpFalling":
			return true;
			break;
			default:
			return false;
			break;
		}
	}

	this.InFlip = function () {
		return (this.mode == "flip");
	}
	//Returns boolean: true if hit was successful
	this.GetAttacked = function (xPush, yPush, type) {
		//console.log(type);
		var success = false;
		var prevMode = this.mode;
		if (type === ATTACK_TYPE.PSYCHIC_BLAST) {
			DoShake();
			this.mode = "launched";
			// this.LoseLargeHealth();
			success = true;
			if (this.isHoldingBall) {
				this.isHoldingBall = false;
				this.ballBeingHeld.isHeld = false;
				this.ballBeingHeld.attackInvincibilityTimer = 30;
				if (xPush > 0) {
					this.ballBeingHeld.xVel = -5;
				} else {
					this.ballBeingHeld.xVel = 5;
				}
				this.ballBeingHeld.yVel = -15;
			}
		}
		else if (this.mode === "countering") {
			console.info("PSYCHIC BLAST");
			if (this.enemyEntity.x > this.x) {
				this.enemyEntity.GetAttacked(PSYCHIC_BLAST_X, PSYCHIC_BLAST_Y, ATTACK_TYPE.PSYCHIC_BLAST);
			} else {
				this.enemyEntity.GetAttacked(-PSYCHIC_BLAST_X, PSYCHIC_BLAST_Y, ATTACK_TYPE.PSYCHIC_BLAST);
			}

			return false;
		}
		else if (this.InFlip())
		{
			//console.log(this.linkedSprite.currentFrame);
			if (this.linkedSprite.currentFrame >= 9 && (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE))
			{
				if (this.flipSuccess)
				{
					// this.LoseSmallHealth();
					success = true;
				}
				this.flipSuccess = false;
			}
			return success;
		}
		else if (this.InHitstun())
		{
			//Ignore attacks in hitstun, I think?
			return success;
		}
		else if (this.InDash())
		{
			if (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE)
			{
				this.mode = "tripped";
				// this.LoseSmallHealth();
				success = true;
			}
			else
			{
				//Immune from non-trip/spike attacks while dashing
				return success;
			}
		}
		else if (type == ATTACK_TYPE.WEAK || type == ATTACK_TYPE.SPIKE)
		{
			console.info("WEAK");
			if (prevMode == "hitstun" && this.linkedSprite.currentFrame > 1)
			{
				prevMode = "not_hitstun";
				// this.LoseSmallHealth();
				success = true;
			}
			else
			{
				if (this.mode != "hitstun" || this.linkedSprite.currentFrame > 1)
				{
					// this.LoseSmallHealth();
					success = true;
				}
			}
			this.mode = "hitstun";
			if ((xPush > 0 && this.direction == "right") || (xPush < 0 && this.direction == "left"))
			{
				this.linkedSprite.SetMode("hitstunBehind");
			}
			else
			{
				this.linkedSprite.SetMode("hitstun");
			}
		}
		else if (type === ATTACK_TYPE.AIR_PUNCH) {
			this.mode = "hitstun";
			if ((xPush > 0 && this.direction == "right") || (xPush < 0 && this.direction == "left"))
			{
				console.info("Hit from behind!");
				this.linkedSprite.SetMode("hitstunBehind");
			}
			else
			{
				console.info("Hit from front!");
				this.linkedSprite.SetMode("hitstun");
			}
			success = true;
			if (this.isHoldingBall) {
				this.isHoldingBall = false;
				this.ballBeingHeld.isHeld = false;
				this.ballBeingHeld.attackInvincibilityTimer = 30;
				if (xPush > 0) {
					this.ballBeingHeld.xVel = -5;
				} else {
					this.ballBeingHeld.xVel = 5;
				}
				this.ballBeingHeld.yVel = -15;
			}
		}
		else if (type === ATTACK_TYPE.SLIDE_TACKLE) {
			DoShake();
			this.mode = "launched";
			success = true;
			if (this.isHoldingBall) {
				this.isHoldingBall = false;
				this.ballBeingHeld.isHeld = false;
				this.ballBeingHeld.attackInvincibilityTimer = 30;
				if (xPush > 0) {
					this.ballBeingHeld.xVel = -5;
				} else {
					this.ballBeingHeld.xVel = 5;
				}
				this.ballBeingHeld.yVel = -15;
			}
		}
		else if (type == ATTACK_TYPE.STRONG)
		{
			//shake += 3;
			DoShake();
			this.mode = "launched";
			// this.LoseLargeHealth();
			success = true;
			if (this.isHoldingBall) {
				this.isHoldingBall = false;
				this.ballBeingHeld.isHeld = false;
				this.ballBeingHeld.attackInvincibilityTimer = 30;
				if (xPush > 0) {
					this.ballBeingHeld.xVel = -5;
				} else {
					this.ballBeingHeld.xVel = 5;
				}
				this.ballBeingHeld.yVel = -15;
			}
		}
		else if (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE)
		{
			
		}
		if (this.mode != prevMode)
		{
			this.xVel += xPush;
			this.yVel += yPush;
			this.linkedSprite.SetMode(this.mode);
			if (xPush > 0 && (type == ATTACK_TYPE.STRONG || type === ATTACK_TYPE.PSYCHIC_BLAST || type === ATTACK_TYPE.SLIDE_TACKLE))
			{
				this.direction = "right";
			}
			if (xPush < 0 && (type == ATTACK_TYPE.STRONG || type === ATTACK_TYPE.PSYCHIC_BLAST || type === ATTACK_TYPE.SLIDE_TACKLE))
			{
				this.direction = "left";
			}
		}
		if (success && this.chargeSound && prevMode == "charging")
		{
			this.chargeSound.pause();
		}

		if (success)
		{
			this.hitContact = true;
		}
		return success;
	}

	this.DoAttack = function (attackNum, defender) {
		
		switch (this.mode)
		{
			// case "kickRelease":
			// //Change based on charge amount
			// if (this.hitOpponent)
			// {
			// 	return;
			// }
			// var result = defender.GetAttacked(this.CheckDirection() * (KICK_KNOCKBACK_X + this.charge * KICK_KNOCKBACK_ANGULAR * Math.cos(this.kickAngle)), -KICK_KNOCKBACK_Y - this.charge * KICK_KNOCKBACK_ANGULAR * Math.sin(this.kickAngle), ATTACK_TYPE.STRONG);
			// // If the hit was successful (for example, enemy is not prone)
			// if (result)
			// {
			// 	this.charge = CHARGE_BASE;
			// }

			// this.hitOpponent = true;
			// break;
			case "punching":
			if (attackNum == 1)
			{
				defender.GetAttacked(this.CheckDirection() * PUNCH_KNOCKBACK_X_WEAK, PUNCH_KNOCKBACK_Y_WEAK, ATTACK_TYPE.WEAK);
			}
			if (attackNum == 2)
			{
				defender.GetAttacked(this.CheckDirection() * PUNCH_KNOCKBACK_X, PUNCH_KNOCKBACK_Y, ATTACK_TYPE.STRONG);
			}
			break;
			case "tripping":
			defender.GetAttacked(0, 0, ATTACK_TYPE.TRIP);
			break;
			case "slideTackling":
			defender.GetAttacked(this.CheckDirection() * SLIDE_TACKLE_KNOCKBACK_X, SLIDE_TACKLE_KNOCKBACK_Y, ATTACK_TYPE.SLIDE_TACKLE);
			break;
			case "spiking":
			defender.GetAttacked(SPIKE_KNOCKBACK_X, SPIKE_KNOCKBACK_Y, ATTACK_TYPE.SPIKE);
			break;
			case "airPunching":
			defender.GetAttacked(this.CheckDirection() * AIR_PUNCH_KNOCKBACK_X, AIR_PUNCH_KNOCKBACK_Y, ATTACK_TYPE.AIR_PUNCH);
			break;
		}
	}

	this.DoBallAttack = function (attackNum, ball) {
		switch (this.mode)
		{
			case "kickRelease":
			if (this.hitBall)
			{
				return;
			}
			this.isHoldingBall = false;
			this.ballBeingHeld.isHeld = false;
			var kickAngle = Math.PI / 4;
			if (!this.CheckGrounded()) {
				kickAngle = Math.PI / 8;
				if (this.holdingUp) {
					kickAngle += (Math.PI / 8);
				}
				if (this.holdingDown) {
					kickAngle -= (Math.PI / 4);
				}
			} else {
				if (this.holdingUp) {
					kickAngle += (Math.PI / 8);
				}
				if (this.holdingDown) {
					kickAngle -= (Math.PI / 8);
				}
			}
			ball.GetAttacked(this.CheckDirection() * (KICK_BALL_FORCE * Math.cos(kickAngle)), -(KICK_BALL_FORCE * Math.sin(kickAngle)), ATTACK_TYPE.STRONG);
			this.hitBall = true;
			ball.wasThrown = true;
			ball.throwerEntity = this;
			break;
			case "punching":
			if (attackNum == 1)
			{
				ball.GetAttacked(this.CheckDirection() * PUNCH_KNOCKBACK_X_WEAK_BALL, PUNCH_KNOCKBACK_Y_WEAK_BALL, ATTACK_TYPE.WEAK);
			}
			if (attackNum == 2)
			{
				ball.GetAttacked(this.CheckDirection() * PUNCH_BALL_STRONG_X, PUNCH_BALL_STRONG_Y, ATTACK_TYPE.STRONG);
			}
			break;
			case "tripping":
			ball.GetAttacked(this.CheckDirection() * BALL_DRIBBLE_X, 0, ATTACK_TYPE.TRIP);
			break;
			case "slideTackling":
			if (this.hitBall)
			{
				return;
			}
			ball.GetAttacked(this.CheckDirection() * SLIDE_TACKLE_BALL_KNOCKBACK_X, SLIDE_TACKLE_BALL_KNOCKBACK_Y, ATTACK_TYPE.SLIDE_TACKLE);
			this.hitBall = true;
			console.info("Slide tackle on ball");
			break;
			case "spiking":
			if (this.hitBall)
			{
				return;
			}
			ball.GetAttacked(SPIKE_KNOCKBACK_X, SPIKE_KNOCKBACK_Y, ATTACK_TYPE.SPIKE);
			this.hitBall = true;
			break;
			case "airPunching":
			if (this.hitBall)
			{
				return;
			}
			ball.GetAttacked(this.CheckDirection() * AIR_PUNCH_KNOCKBACK_X, AIR_PUNCH_KNOCKBACK_Y, ATTACK_TYPE.AIR_PUNCH);
			this.hitBall = true;
			break;
			case "blockingGround":
			case "blockingAir":
			case "dashAir":
			//ball.GetAttacked(55, 55, ATTACK_TYPE.TRIP);
			if (this.charge > CHARGE_BASE)
			{
				ball.GetBlocked(this.direction);
			}
			else
			{
				if (Math.abs(ball.xVel) > 0.5)
				{
					this.xVel += ball.xVel * 1.5;
					this.mode = "shieldDownAir";
				}
				
				ball.GetBlockedWeak(this.direction);
			}
			if (inTutorial)
			{
				//console.log("Blocked a ball!")
				if (this == player1Entity)
				{
					P1_blocked_a_ball = true;
				}
				if (this == player2Entity)
				{
					P2_blocked_a_ball = true;
				}
			}
			break;
			case "countering":
				if (!ball.isHeld) {
					ball.isHeld = true;
					ball.heldBy = this;
					this.isHoldingBall = true;
					this.ballBeingHeld = ball;
					if (ball.wasThrown && ball.throwerEntity !== this) {
						// PSYCHIC BLAST
						console.info("PSYCHIC BLAST");
						if (this.enemyEntity.x > this.x) {
							this.enemyEntity.GetAttacked(PSYCHIC_BLAST_X, PSYCHIC_BLAST_Y, ATTACK_TYPE.PSYCHIC_BLAST);
						} else {
							this.enemyEntity.GetAttacked(-PSYCHIC_BLAST_X, PSYCHIC_BLAST_Y, ATTACK_TYPE.PSYCHIC_BLAST);
						}
					}
					if (this.CheckGrounded()) {
						this.mode = "idle";
					} else {
						this.mode = "jumpFalling";
					}
					this.linkedSprite.SetMode(this.mode);
				}
			break;
		}
	}

	this.CheckTurnaround = function (leftBool, rightBool) {
		if (leftBool && !rightBool)
		{
			this.direction = "left";
		}
		if (rightBool && !leftBool)
		{
			this.direction = "right";
		}
	}

	this.AnimationEnd = function () {
		switch (this.mode)
		{
			case "jumpTakeoff":
			this.mode = "jumpRising";
			break;
			case "jumpApex":
			this.mode = "jumpFalling";
			break;
			case "jumpLanding":
			this.mode = "idle";
			break;
			case "shieldLand":
			this.mode = "idle";
			break;
			case "blockingGround":
			this.mode = "idle";
			break;
			case "blockingAir":
			this.mode = "jumpFalling";
			break;
			case "kickWindup":
			// this.mode = "kickHold";
			this.mode = "kickRelease";
			break;
			case "kickRelease":
			this.mode = "idle";
			break;
			case "kickCancel":
			this.mode = "idle";
			break;
			case "punching":
			this.mode = "idle";
			break;
			case "tripping":
			this.mode = "idle";
			break;
			case "slideTackling":
			this.mode = "crashland";
			break;
			case "spiking":
			this.mode = "jumpFalling";
			break;
			case "airPunching":
			this.mode = "jumpFalling";
			break;
			case "hitstun":
			this.mode = "idle";
			break;
			case "crashland":
			this.mode = "down";
			break;
			case "tripped":
			this.mode = "down";
			break;
			case "getup":
			this.mode = "idle";
			break;
			case "flip":
			if (this.flipSuccess)
			{
				this.mode = "flipLandSafe";
			}
			else
			{
				this.mode = "flipLandTrip";
				this.flipSuccess = true;
			}
			break;
			case "flipLandSafe":
			this.mode = "idle";
			break;
			case "flipLandTrip":
			this.mode = "down";
			break;
			case "downTurn":
			this.mode = "flip";
			this.direction = (this.direction == "right") ? "left" : "right";
			break;
			case "onePunchExit":
			this.mode = "idle";
			break;
			case "twoPunchExit":
			this.mode = "idle";
			break;
			case "dashAirShieldStart":
			this.mode = "dashAir";
			break;
			case "shieldDownAir":
			if (this.hasHitGround)
			{
				this.mode = "idle";
				this.hasHitGround = false;
			}
			else
			{
				this.mode = "jumpFalling";
			}
			break;
			case "countering":
			this.mode = "counteringEnd";
			break;
			case "counteringEnd":
			if (this.CheckGrounded()) {
				this.mode = "idle";
			} else {
				this.mode = "jumpFalling";
			}
		}
		return this.mode;
	}

	this.ApplyInput = function () {
		var kArray = [false, false, false, false, false, false];


		//Silly AI
		var tempKI;
		if (this.doAI2)
		{
			tempKI = this.keyInput;
			this.keyInput = this.enemyEntity.keyInput;
		}
		//Silly AI

		for (var i = 0; i < keyPressedOrder.length; i++)
		{
			var key = keyPressedOrder[i];
			for (var j = 0; j < this.keyInput.length; j++)
			{
				if (key == this.keyInput[j])
				{
					kArray[j] = true;
				}
			}
		}


		//Silly AI cleanup
		if (this.doAI2)
		{
			this.keyInput = tempKI;
			var tempK = kArray[1];
			kArray[1] = kArray[3];
			kArray[3] = tempK;
		}
		//Silly AI cleanup

		//Gamepad support
		if (this == player1Entity && navigator.getGamepads()[0])
		{
			kArray = DoGamepadInput0();
		}
		if (this == player2Entity && navigator.getGamepads()[1])
		{
			kArray = DoGamepadInput1();
		}
		


		//Testing FUCKING WII U SUPPORT OMG
		if (!!window.wiiu)
		{
			var wiiUstate = window.wiiu.gamepad.update();
			if (wiiUstate.tpTouch == 1)
			{
				this.y -= 5;
			}
		}
		//Testing FUCKING WII U SUPPORT OMG


		var UP = kArray[0];
		var LEFT = kArray[1];
		var DOWN = kArray[2];
		var RIGHT = kArray[3];
		var ATTACK = kArray[4];
		var SPECIAL = kArray[5];

		this.holdingUp = UP;
		this.holdingDown = DOWN;

		//***TUTORIAL AI***
		if (this.doAItut)
		{
			UP = false; DOWN = false; LEFT = false; RIGHT = false; ATTACK = false; SPECIAL = false;
			var stateNum = 0;
			var playerTutNum = 0;
			if (this == tut1Entity)
			{
				stateNum = tutorialStateP1;
				playerTutNum = 1;
			}
			if (this == tut2Entity)
			{
				stateNum = tutorialStateP2;
				playerTutNum = 2
			}

			//Hide training dummy before ready
			if (stateNum <= 8)
			{
				this.y = -400;
			}

			//Aiming for goal
			if (stateNum == 12)
			{
				//Setup
				var walkTo = 0;
				var faceDir = "";
				if (playerTutNum == 1)
				{
					walkTo = 400;
					var faceDir = "left";
				}
				if (playerTutNum == 2)
				{
					walkTo = 500;
					var faceDir = "right";
				}
				//Logic
				if (this.x > walkTo + 10)
				{
					LEFT = true;
				}
				else if (this.x < walkTo - 10)
				{
					RIGHT = true;
				}
				else if (this.direction == "left" && faceDir == "right")
				{
					LEFT = true;
				}
				else if (this.direction == "right" && faceDir == "left")
				{
					RIGHT = true;
				}
				else if (this.mode == "idle" && this.releasedAttack)
				{
					ATTACK = true;
					this.ballTarget.x = this.x;
					this.ballTarget.y = this.y;
					this.ballTarget.xVel = 0;
					this.ballTarget.yVel = 0;
				}
				else if (this.mode == "kickHold" && this.kickAngle <= 0.80)
				{
					this.charge = 2.4;
					ATTACK = true;
					UP = true;
				}
				else
				{
					//Kick the ball
				}
			}


			//Dash back and forth
			if (stateNum == 15)
			{
				//Setup
				var dashLeft = 50;
				var dashRight = 850;
				if (playerTutNum == 1)
				{
					dashLeft = 50;
					dashRight = 400
				}
				if (playerTutNum == 2)
				{
					dashLeft = 500;
					dashRight = 850
				}
				//Logic
				if (this.mode == "idle" && this.releasedSpecial)
				{
					SPECIAL = true;
					if (Math.random() > 0.5)
					{
						LEFT = true;
					}
					else
					{ 
						RIGHT = true;
					}
					if (this.x < dashLeft + 20)
					{
						LEFT = false;
						RIGHT = true;
					}
					if (this.x > dashRight - 20)
					{
						LEFT = true;
						RIGHT = false;
					}
				}
				if (this.mode == "dashGround" && (this.x > dashLeft && this.x < dashRight))
				{
					SPECIAL = true;
					LEFT = true;
					RIGHT = true;
				}
			}

			//Punch at the player
			if (stateNum == 17)
			{
				//Setup
				var walkTo = this.enemyEntity.x;
				//Logic
				if (this.mode == "punching")
				{
					ATTACK = true;
				}
				else if (this.x > walkTo + 60)
				{
					LEFT = true;
				}
				else if (this.x < walkTo - 60)
				{
					RIGHT = true;
				}
				else
				{
					if (this.releasedAttack)
					{
						ATTACK = true;
					}
					if (this.x > walkTo)
					{
						LEFT = true;
					}
					if (this.x < walkTo)
					{
						RIGHT = true;
					}
				}
				
			}



			//Get up from attacks
			if (this.mode == "down")
			{
				UP = true;
			}

			//Flip up in state 16
			if (stateNum == 16)
			{
				UP = false;
				LEFT = true;
			}

			/*if (this.mode == "idle")
			{
				ATTACK = true;
			}
			if (this.mode == "kickHold")
			{
				ATTACK = false;
			}*/
		}

		//Prevent flying into space
		if (this.y < -300 && UP)
		{
			this.eggo = 0;
			this.yVel += 100;
			this.mode = "launched";
			this.linkedSprite.SetMode(this.mode);
			DoShake();
			shake = 1;
			for (var eggsplode = 0; eggsplode < 180; eggsplode++) {
				RD.fireEffectList.push({x:this.x, y:this.y, color:"#FFFF00", time:50 + Math.random() * 20, xVel:Math.cos(eggsplode) * 5 * Math.random(), yVel:Math.sin(eggsplode) * 5 * Math.random()});
			}
		}


		//***AI***
		if (this.doAI)
		{
			var goalDir = "right";
			var goalPos = STAGE_WIDTH;
			var dirNum = 1;
			if (this == player2Entity)
			{
				goalDir = "left";
				goalPos = 0;
				dirNum = -1;
			}

			UP = false; DOWN = false; LEFT = false; RIGHT = false; ATTACK = false; SPECIAL = false;
			
			if (this.mode == "kickHold")
			{
				if (this.kickAngle <= 0.85)
				{
					ATTACK = true;
					UP = true;
				}
			}
			else if (this.mode == "down")
			{
				UP = true;
			}
			else if (this.charge < 1.5)
			{
				if (this.releasedSpecial || this.mode == "charging")
				{
					DOWN = true; SPECIAL = true;
				}
			}
			else if (this.mode == "charging" && this.charge < 2.9)
			{
				DOWN = true; SPECIAL = true;
			}
			else if (Math.abs(this.x - (this.ballTarget.x - dirNum * 15)) > 25)
			{
				if (this.ballTarget.x - dirNum * 15 > this.x)
				{
					RIGHT = true;
				}
				else
				{
					LEFT = true;
				}
				if ((Math.abs(this.x - this.enemyEntity.x) > 80 || this.enemyEntity.mode != "tripping") && (this.releasedSpecial || this.mode == "dashGround"))
				{
					//Dash when safe to do so
					SPECIAL = true;
				}
			}
			else if (this.direction != goalDir)
			{
				if (goalDir == "right")
				{
					RIGHT = true;
				}
				else
				{
					LEFT = true;
				}
			}
			else if (Math.abs(goalPos - this.ballTarget.x) < 300)
			{
				if (this.releasedAttack)
				{
					ATTACK = true;
				}
			}
			else
			{
				if (this.releasedAttack)
				{
					ATTACK = true; DOWN = true;
				}
			}
		}

		if (UP || LEFT || DOWN || RIGHT || ATTACK || SPECIAL)
		{
			this.eggoWait = false;
		}
		//EASTER EGGO OF KONAMI CODEO
		var nextEggo = false;
		switch (this.eggo)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 9:
			case 11:
			case 13:
			case 15:
			case 17:
			nextEggo = (!UP && !LEFT && !DOWN && !RIGHT && !ATTACK && !SPECIAL);// -
			if (!nextEggo)
			{
				this.eggoWait = true;
			}
			break;
			case 0:
			case 2:
			nextEggo = (UP && !LEFT && !DOWN && !RIGHT && !ATTACK && !SPECIAL);//up up
			break;
			case 4:
			case 6:
			nextEggo = (!UP && !LEFT && DOWN && !RIGHT && !ATTACK && !SPECIAL);//down down
			break;
			case 8:
			case 12:
			nextEggo = (!UP && LEFT && !DOWN && !RIGHT && !ATTACK && !SPECIAL);//left (right) left
			break;
			case 10:
			case 14:
			nextEggo = (!UP && !LEFT && !DOWN && RIGHT && !ATTACK && !SPECIAL);//right (left) right
			break;
			case 16:
			nextEggo = (!UP && !LEFT && !DOWN && !RIGHT && !ATTACK && SPECIAL);//b
			break;
			case 18:
			nextEggo = (!UP && !LEFT && !DOWN && !RIGHT && ATTACK && !SPECIAL);//a
			break;
			case 19:
			console.log("konami code");
			this.eggo = 0;
			this.yVel -= 100;
			this.mode = "launched";
			this.linkedSprite.SetMode(this.mode);
			DoShake();
			shake = 8;
			for (var eggsplode = 0; eggsplode < 180; eggsplode++) {
				RD.fireEffectList.push({x:this.x, y:this.y, color:"#FFFF00", time:50 + Math.random() * 20, xVel:Math.cos(eggsplode) * 5 * Math.random(), yVel:Math.sin(eggsplode) * 5 * Math.random()});
			}
			break;
		}
		if (nextEggo)
		{
			this.eggo ++;
			this.eggoWait = true;
		}
		else if (this.eggoWait == false)
		{
			this.eggo = 0;
		}
		
		


		if (this.mode != "kickRelease" && this.mode != "spiking" && this.mode !== "airPunching" && this.mode !== "slideTackling")
		{
			this.hitBall = false;
			this.hitOpponent = false;
		}
		//console.log("UP:" + UP + ", DOWN:" + DOWN + ", LEFT:" + LEFT + ", RIGHT:" + RIGHT + ", ATTACK:" + ATTACK + ", SPECIAL:" + SPECIAL);
		var prevMode = this.mode;
		switch (this.mode)
		{
			case "idle":
				//Can change to: walking, jumping, blocking, kick windup, charge, trip, dash, punch
				if (!this.releasedUp && !UP)
				{
					this.releasedUp = true;
				}
				if (!this.releasedAttack && !ATTACK)
				{
					this.releasedAttack = true;
				}
				if (!this.releasedSpecial && !SPECIAL)
				{
					this.releasedSpecial = true;
				}
				if (UP && this.releasedUp)
				{
					this.releasedUp = false;
					this.mode = "jumpTakeoff";
					this.DoJump();
					createjs.Sound.play("jump1");
				}
				else if (DOWN && ATTACK && this.releasedAttack)
				{
					this.releasedAttack = false;
					// this.mode = "tripping";
					this.mode = "slideTackling";
					this.DoSlideTackle();
				}
				// else if (DOWN && SPECIAL && this.releasedSpecial)
				// {
				// 	this.releasedSpecial = false;
				// 	this.mode = "charging";
				// 	if (this.charge == CHARGE_BASE)
				// 	{
				// 		this.chargeSound = createjs.Sound.play("charge1");
				// 		this.chargeSound.volume = 0.5;
				// 	}
				// 	else if (this.charge == CHARGE_MAX)
				// 	{

				// 	}
				// 	else
				// 	{
				// 		this.chargeSound.resume();
				// 	}
				// }
				else if (ATTACK && (LEFT || RIGHT) && this.releasedAttack)
				{
					this.releasedAttack = false;
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "punching";

				}
				else if (SPECIAL && (LEFT || RIGHT) && this.releasedSpecial)
				{
					this.releasedSpecial = false;
					this.CheckTurnaround(LEFT, RIGHT);
					this.timeInDash = 0;
					this.mode = "dashGround";
					this.DoDashGround();
				}
				else if (ATTACK && this.releasedAttack && this.isHoldingBall)
				{
					this.releasedAttack = false;
					this.mode = "kickWindup";
				}
				else if (SPECIAL && this.releasedSpecial)
				{
					this.releasedSpecial = false;
					this.mode = "countering";
					createjs.Sound.play("block1");
				}
				else if (LEFT || RIGHT)
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "walking";
					this.DoWalk();
				}
			break;
			case "walking":
				if (!this.releasedUp && !UP)
				{
					this.releasedUp = true;
				}
				if (!this.releasedAttack && !ATTACK)
				{
					this.releasedAttack = true;
				}
				if (!this.releasedSpecial && !SPECIAL)
				{
					this.releasedSpecial = true;
				}
				if (UP && this.releasedUp)
				{
					this.releasedUp = false;
					this.mode = "jumpTakeoff";
					this.DoJump();
					createjs.Sound.play("jump1");
				}
				else if (DOWN && ATTACK && this.releasedAttack)
				{
					this.releasedAttack = false;
					// this.mode = "tripping";
					this.mode = "slideTackling";
					this.DoSlideTackle();
				}
				// else if (DOWN && SPECIAL && this.releasedSpecial)
				// {
				// 	this.releasedSpecial = false;
				// 	this.mode = "charging";
				// 	if (this.charge == CHARGE_BASE)
				// 	{
				// 		this.chargeSound = createjs.Sound.play("charge1");
				// 		this.chargeSound.volume = 0.5;
				// 	}
				// 	else if (this.charge == CHARGE_MAX)
				// 	{

				// 	}
				// 	else
				// 	{
				// 		this.chargeSound.resume();
				// 	}
				// }
				else if (ATTACK && (LEFT || RIGHT) && this.releasedAttack)
				{
					this.releasedAttack = false;
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "punching";
				}
				else if (SPECIAL && (LEFT || RIGHT) && this.releasedSpecial)
				{
					this.releasedSpecial = false;
					this.CheckTurnaround(LEFT, RIGHT);
					this.timeInDash = 0;
					this.mode = "dashGround";
					this.DoDashGround();
				}
				else if (LEFT || RIGHT)
				{
					this.CheckTurnaround(LEFT, RIGHT);
					//Continue Walking
					this.DoWalk();
				}
				else if (!LEFT && !RIGHT)
				{
					this.mode = "idle";
				}
			break;
			case "jumpTakeoff":
				//Can't do shit
				if (UP)
				{
					this.DoJumpHold();
				}
				this.releasedJump = false;
				this.DoAirMove(LEFT, RIGHT);
			break;
			case "jumpRising":
				if (this.yVel >= -1)
				{
					this.mode = "jumpApex";
				}
				if (UP)
				{
					this.DoJumpHold();
				}
			case "jumpApex":
			case "jumpFalling":
				this.CheckTurnaround(LEFT, RIGHT);
				if (UP && !this.releasedJump)
				{
					// this.DoJumpHold();
				}
				else
				{
					this.releasedJump = true;
				}
				if (!this.releasedAttack && !ATTACK)
				{
					this.releasedAttack = true;
				}
				if (!this.releasedSpecial && !SPECIAL)
				{
					this.releasedSpecial = true;
				}
				/*
				if (SPECIAL && (!LEFT && !RIGHT && !UP && !DOWN) && this.releasedSpecial)
				{
					this.releasedSpecial = false;
					this.mode = "blockingAir";
					createjs.Sound.play("block1");
				}
				*/
				if (SPECIAL && (LEFT || RIGHT) && this.releasedSpecial)
				{
					this.releasedSpecial = false;
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "dashAir";
					// this.linkedSprite.SetMode("dashAirNeutralShieldStart");
					this.DoDashAir(kArray, true);
				}
				else if (SPECIAL && this.releasedSpecial) {
					this.releasedSpecial = false;
					this.mode = "countering";
				}
				else if (this.hasDoubleJump && UP && this.releasedJump)
				{
					console.info("double jumped");
					this.releasedUp = false;
					this.mode = "jumpTakeoff";
					this.DoJump();
					this.hasDoubleJump = false;
					createjs.Sound.play("jump1");
				}
				else if (ATTACK && DOWN && this.releasedAttack) {
					this.releasedAttack = false;
					this.mode = "slideTackling";
					this.DoSlideTackle();
				}
				else if (ATTACK && (LEFT || RIGHT) && this.releasedAttack)
				{
					this.releasedAttack = false;
					this.mode = "airPunching";
				}
				else if (ATTACK && this.releasedAttack && this.isHoldingBall)
				{
					this.releasedAttack = false;
					this.mode = "kickWindup";
				}
				if (this.CheckGrounded())
				{
					this.mode = "jumpLanding";
					createjs.Sound.play("landing1");
				}
				else
				{
					this.DoAirMove(LEFT, RIGHT);
				}
			break;
			case "jumpLanding":
				if (!this.releasedUp && !UP)
				{
					this.releasedUp = true;
				}
				if (!this.releasedAttack && !ATTACK)
				{
					this.releasedAttack = true;
				}
				if (!this.releasedSpecial && !SPECIAL)
				{
					this.releasedSpecial = true;
				}
			break;
			case "shieldLand":
			break;
			case "shieldDownAir":
			if (!this.releasedAttack && !ATTACK)
				{
					this.releasedAttack = true;
				}
				if (!this.releasedSpecial && !SPECIAL)
				{
					this.releasedSpecial = true;
				}
				if (this.CheckGrounded())
				{
					if (!this.hasHitGround)
					{
						this.hasHitGround = true;
						createjs.Sound.play("landing1");
						this.linkedSprite.SwapMode("shieldLand");
					}
				}
				/*
				else
				{
					this.DoAirMove(LEFT, RIGHT);
				}
				*/
			break;
			case "blockingGround":
				//no actions to take
				this.LoseCharge();
			break;
			case "countering":
				// no actions to take
				this.DoCounter();
			break;
			case "blockingAir":
				//no actions to take
				this.DoBlockAir();
				this.LoseCharge();
			break;
			case "dashGround":
				//Need to check direction matches current direction
				if (SPECIAL && (LEFT || RIGHT))
				{
					this.DoDashGround();
					this.LoseSmallCharge();
				}
				else
				{
					if (LEFT || RIGHT)
					{
						this.CheckTurnaround(LEFT, RIGHT);
						this.mode = "walking";
					}
					else
					{
						this.mode = "idle";
					}
					this.timeSinceDash = 0;
				}
			break;
			case "dashAirShieldStart":
				if (SPECIAL)
				{
					this.DoDashAir(kArray, true);
					this.LoseCharge();
				}
				else
				{
					this.mode = "jumpFalling";
				}

				if (this.CheckGrounded())
				{
					this.mode = "jumpLanding";
					createjs.Sound.play("landing1");
				}
			break;
			case "dashAir":
				//Need to check direction matches current direction
				if (SPECIAL)// && (LEFT || RIGHT || UP || DOWN))
				{
					this.DoDashAir(kArray, false);
					this.LoseCharge();
				}
				else
				{
					this.mode = "jumpFalling";
				}

				if (this.CheckGrounded())
				{
					this.mode = "jumpLanding";
					createjs.Sound.play("landing1");
				}
			break;
			case "kickWindup":
				// this.kickAngle = 0;
				// this.kickAngleSwap = false;
				//nope
			break;
			case "kickHold":

				/*
				
				if (this.kickAngleSwap)
				{
					this.kickAngle -= 0.05;
				}
				else
				{
					this.kickAngle += 0.05;
				}
				if (this.kickAngle > Math.PI / 2)
				{
					this.kickAngleSwap = true;
				}
				if (this.kickAngle < 0)
				{
					this.kickAngleSwap = false;
				}

				*/

				if (UP)
				{
					this.kickAngle += 0.05;
				}
				if (DOWN)
				{
					this.kickAngle -= 0.05;
				}
				if (this.kickAngle > Math.PI / 2)
				{
					this.kickAngle = Math.PI / 2;
				}
				if (this.kickAngle < 0)
				{
					this.kickAngle = 0;
				}

				if (!ATTACK)
				{
					this.mode = "kickRelease";
				}
				if (SPECIAL)
				{
					this.mode = "kickCancel";
				}
			break;
			case "kickRelease":
			case "kickCancel":
				//none
			break;
			case "punching":
				this.DoPunch(ATTACK);
				if (this.linkedSprite.GetFrame() == 3 && !ATTACK)
				{
					this.mode = "onePunchExit";
				}
				if (this.linkedSprite.GetFrame() == 11 && !ATTACK)
				{
					this.mode = "twoPunchExit";
				}
			break;
			case "charging":
			var prevCharge = this.charge;
			this.charge += CHARGE_PER_FRAME;
			if (this.charge > CHARGE_MAX)
			{
				this.charge = CHARGE_MAX;
				this.chargeSound.stop();
			}
			if (this.charge >= 4 && prevCharge < 4)
			{
				this.chargeFlash = true;
			}
			//console.log(this.charge);
			if (!SPECIAL)
			{
				this.chargeSound.pause();
				this.mode = "idle";
			}
			break;
			case "spiking":
				//you cannat zyensse
			break;
			case "airPunching":
				//you cayn zyensse
				if (UP && !this.releasedJump)
				{
					this.DoJumpHold();
				}
				else
				{
					this.releasedJump = true;
				}

				if (this.CheckGrounded())
				{
					this.mode = "jumpLanding";
					createjs.Sound.play("landing1");
				}
				else
				{
					this.DoAirMove(LEFT, RIGHT);
				}
			break;
			case "launched":
			if (this.CheckGrounded() && this.yVel > 0)
			{
				this.mode = "crashland";
			}
			else
			{
				this.DoLaunched();
			}
			break;
			case "tripped":
			case "crashland":
			case "getup":
				//lol u ded
			break;
			case "hitstun":

			break;
			case "down":
				//Rolling or Standing Up here
				if (this.health <= 0 && !this.knockedOut)
				{
					this.knockedOut = true;
					createjs.Sound.play("knockout1");
				}
				if (this.knockedOut)
				{
					this.health += 0.05;
					if (this.health >= 3)
					{
						this.health = 3;
						this.knockedOut = false;
					}
				}
				else
				{
					if (UP)
					{
						this.mode = "getup";
					}
					else if (this.direction == "left")
					{
						if (LEFT)
						{
							//roll left
							this.mode = "flip";
						}
						if (RIGHT)
						{
							//turn right then flip
							this.mode = "downTurn";
						}
					}
					else if (this.direction == "right")
					{
						if (LEFT)
						{
							//turn left then flip
							this.mode = "downTurn";
						}
						if (RIGHT)
						{
							//roll right
							this.mode = "flip";
						}
					}
				}
			break;
			case "flip":
				this.DoFlip();
			break;
			case "flipLandSafe":
			case "flipLandTrip":
			case "downTurn":
				//no
			break;
			case "onePunchExit":
			case "twoPunchExit":
			// nuthin
			break;
		}
		if (this.mode != prevMode && this.mode != "dashAir" && this.mode != "hitstun" && this.mode != "dashAirShieldStart")
		{
			this.linkedSprite.SetMode(this.mode);
		}
	}
	this.DoLaunched = function () {
		this.xVel += LAUNCHED_SPEED * this.CheckDirection();
	}
	this.DoFlip = function () {
		this.xVel += FLIP_SPEED * this.CheckDirection();
	}
	this.DoPunch = function (attackButton) {
		if (this.linkedSprite.currentMode == "punching")
		{
			if (this.linkedSprite.GetFrame() >= 2 && this.linkedSprite.GetFrame() <= 4)
			{
				this.xVel += PUNCH_SPEED * this.CheckDirection();
			}
			if (this.linkedSprite.GetFrame() >= 6 && this.linkedSprite.GetFrame() <= 10)
			{
				this.xVel += PUNCH_SPEED * 0.75 * this.CheckDirection();
			}
			if (this.linkedSprite.GetFrame() >= 14 && this.linkedSprite.GetFrame() <= 20)
			{
				this.xVel += PUNCH_SPEED * this.CheckDirection();
			}
			
			
		}

	}
	this.DoJump = function () {
		this.yVel -= JUMP_SPEED; 
		this.jumpDecay = 0;
	}
	this.DoJumpHold = function () {
		this.jumpDecay += JUMP_HOLD_DECAY;
		this.yVel -= JUMP_HOLDSPEED - this.jumpDecay;
	}
	this.DoAirMove = function (leftBool, rightBool)
	{
		if (leftBool)
		{
			this.xVel -= AIR_MOVE_SPEED;
		}
		if (rightBool)
		{
			this.xVel += AIR_MOVE_SPEED;
		}
	}
	this.DoBlockAir = function () {
		this.yVel = -GRAVITY + 0.1;
	}
	this.DoCounter = function () {
		this.yVel *= 0.9;
	}
	this.DoDashGround = function () {
		var tempDashSpeed = DASH_SPEED;
		if (this.charge <= CHARGE_BASE)
		{
			tempDashSpeed = DASH_SPEED_SLOW;
		}
		this.xVel = tempDashSpeed * this.CheckDirection();

		if (this.isHoldingBall) {
			this.ballBeingHeld.isHeld = false;
			this.isHoldingBall = false;
		}
	}
	this.DoDashAir = function (keyArray, isShieldUp) {
		var tempDashSpeed = DASH_SPEED;
		if (this.charge <= CHARGE_BASE)
		{
			tempDashSpeed = DASH_SPEED_SLOW;
		}
		this.xVel = tempDashSpeed * this.CheckDirection();
		this.yVel -= GRAVITY * 0.85;

		if (this.isHoldingBall) {
			this.ballBeingHeld.isHeld = false;
			this.isHoldingBall = false;
		}
		// var UP = keyArray[0];
		// var LEFT = keyArray[1];
		// var DOWN = keyArray[2];
		// var RIGHT = keyArray[3];

		// var tempDashSpeed = DASH_SPEED_AIR;
		// if (this.charge <= CHARGE_BASE)
		// {
		// 	tempDashSpeed = DASH_SPEED_AIR_SLOW;
		// }

		// if (UP)
		// {
		// 	this.yVel = -GRAVITY + 0.1 - (tempDashSpeed * 0.6);
		// }
		// else if (DOWN)
		// {
		// 	this.yVel = GRAVITY + (tempDashSpeed * 0.6);
		// }
		// else
		// {
		// 	this.yVel = -GRAVITY + 0.1;
		// }

		// if ((LEFT && (this.CheckDirection() == -1)) || (RIGHT && (this.CheckDirection() == 1)))
		// {
		// 	this.xVel = tempDashSpeed * this.CheckDirection();
		// }
		// else
		// {
		// 	this.xVel = 0;
		// }

		// if (UP)
		// {
		// 	if ((LEFT && (this.CheckDirection() == -1)) || (RIGHT && (this.CheckDirection() == 1)))
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirDiagonalUpShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirDiagonalUp");
		// 		}
		// 	}
		// 	else
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirUpShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirUp");
		// 		}
		// 	}
		// }
		// else if (DOWN)
		// {
		// 	if ((LEFT && (this.CheckDirection() == -1)) || (RIGHT && (this.CheckDirection() == 1)))
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirDiagonalDownShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirDiagonalDown");
		// 		}
		// 	}
		// 	else
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirDownShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirDown");
		// 		}
		// 	}
		// }
		// else
		// {
		// 	if ((LEFT && (this.CheckDirection() == -1)) || (RIGHT && (this.CheckDirection() == 1)))
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirSideShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirSide");
		// 		}
		// 	}
		// 	else
		// 	{
		// 		if (isShieldUp)
		// 		{
		// 			this.linkedSprite.SwapMode("dashAirNeutralShieldStart");
		// 		}
		// 		else
		// 		{
		// 			this.linkedSprite.SetMode("dashAirNeutral");
		// 		}
		// 	}
		// }

		// if (this.isHoldingBall) {
		// 	this.ballBeingHeld.isHeld = false;
		// 	this.isHoldingBall = false;
		// }


	}
	this.DoSlideTackle = function () {
		this.xVel += (this.CheckDirection() * SLIDE_TACKLE_X_VEL);
		if (!this.CheckGrounded()) {
			this.yVel += SLIDE_TACKLE_AIR_Y_VEL;
		}
		if (this.isHoldingBall) {
			this.ballBeingHeld.isHeld = false;
			this.isHoldingBall = false;
		}
	}
	this.DoWalk = function () {
		this.xVel += MOVE_SPEED * this.CheckDirection();
	}
	this.ApplyGravity = function () {
		if (this.CheckGrounded() || this.mode === "kickWindup" || this.mode === "countering")
		{
			return;
		}
		this.yVel += GRAVITY;
	}
	this.MoveByVelocity = function () {
		this.x += this.xVel;
		this.y += this.yVel;
	}
	this.ApplyFriction = function () {
		this.xVel *= FRICTION_X;
		this.yVel *= FRICTION_Y;
		if (Math.abs(this.xVel) > FRICTION_CUTOFF_X)
		{
			this.xVel *= FRICTION_X_2;
		}
		if (Math.abs(this.yVel) > FRICTION_CUTOFF_Y)
		{
			this.yVel *= FRICTION_Y_2;
		}
	}
	this.HitGround = function () {
		if (this.CheckGrounded())
		{
			if (this.yVel > 0)
			{
				this.yVel = 0;
			}
			if (this.y > STAGE_HEIGHT)
			{
				//Needs ground shape code stuff
				this.y = STAGE_HEIGHT;
			}
			if (this.y > groundShape.GetHeightAtX(this.x))
			{
				this.y = groundShape.GetHeightAtX(this.x);
			}
			this.hasDoubleJump = true;
		}
	}
	this.CheckGrounded = function () {
		if (this.y > STAGE_HEIGHT)
		{
			return true;
		}
		else if (this.y > groundShape.GetHeightAtX(this.x))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	this.CheckLeftEdge = function () {
		if (this.x < 0)
		{
			return true;
		}
		return false;
	}
	this.CheckRightEdge = function () {
		if (this.x > STAGE_WIDTH)
		{
			return true;
		}
		return false;
	}

	this.CheckDirection = function () {
		//YOU CANT EVEN RAED THIS
		return (this.direction == "right") ? 1 : -1; 
	}

	this.LoseLargeHealth = function () {
		this.health = Math.ceil(this.health - 1);
		createjs.Sound.play("uppercut1");
	}

	this.LoseSmallHealth = function () {
		this.health = this.health - 0.1;
		createjs.Sound.play("hit1");
	}

	this.LoseCharge = function () {
		this.charge -= 0.01
		

		if (this.charge <= CHARGE_BASE)
		{
			this.charge = CHARGE_BASE;
			//this.mode = "tripped";
			//this.linkedSprite.SetMode(this.mode);
		}
	}

	this.LoseSmallCharge = function () {
		this.charge -= 0.007
		

		if (this.charge <= CHARGE_BASE)
		{
			this.charge = CHARGE_BASE;
			//this.mode = "tripped";
			//this.linkedSprite.SetMode(this.mode);
		}
	}
}