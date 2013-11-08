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


var JUMP_HOLDSPEED = 3.5;
var JUMP_HOLD_DECAY = 0.1;

var DASH_SPEED = 8;

var PUNCH_SPEED = 0.3;

var FLIP_SPEED = 1;

var PUNCH_KNOCKBACK_X_WEAK = 6;
var PUNCH_KNOCKBACK_Y_WEAK = -5;

var PUNCH_KNOCKBACK_X = 50;
var PUNCH_KNOCKBACK_Y = -50;


var KICK_KNOCKBACK_ANGULAR = 10;
var KICK_KNOCKBACK_X = 5;
var KICK_KNOCKBACK_Y = -5;

var KICK_BALL_ANGULAR = 10;
var KICK_BALL_X = 5;
var KICK_BALL_Y = -10;

var SPIKE_KNOCKBACK_X = 0;
var SPIKE_KNOCKBACK_Y = 30;

var BALL_DRIBBLE_X = 5;

var CHARGE_PER_FRAME = 0.02;

var CHARGE_BASE = 1;
var CHARGE_MAX = 4;

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

var ATTACK_TYPE = {WEAK:1, STRONG:2, TRIP:3, SPIKE:4};


//keyInput: 0-Up, 1-Left, 2-Down, 3-Right

function PlayerEntity (keyInput) {
	this.x = 100;
	this.y = 483;
	this.xVel = 0;
	this.yVel = 0;
	this.mode = "idle";
	this.direction = "right";
	this.linkedSprite = undefined;
	this.jumpDecay = 0;
	this.enemyEntity = undefined;

	this.flipSuccess = true;

	this.releasedJump = false;

	this.kickAngle = 0;
	this.kickAngleSwap = false;

	this.charge = CHARGE_BASE;
	this.chargeFlash = false;
	this.fireTime = 10;
	this.reticleFade = 0;

	this.hitOpponent = false;
	this.hitBall = false;

	this.SelfUpdate = function () {
		this.ApplyInput();
		this.HitGround();
		this.ApplyGravity();
		this.MoveByVelocity();
		this.ApplyFriction();
		this.DoBoundaries();
		if (this.InAttack())
		{
			var attackNum = CL.CheckCollision(this, this.enemyEntity, false);
			if (attackNum != 0)
			{
				this.DoAttack(attackNum, this.enemyEntity);
			}
			var attackNumBall = CL.CheckCollision(this, ballEntity, true);
			if (attackNumBall != 0)
			{
				this.DoBallAttack(attackNumBall, ballEntity);
			}
		}
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
		if (this.y < 12 * PIXEL_SIZE)
		{
			this.y = 12 * PIXEL_SIZE;
			this.yVel = Math.abs(this.yVel) * 0.9;
		}
	}
	this.InHitstun = function () {
		switch (this.mode)
		{
			//case "hitstun":
			case "launched":
			case "crashland":
			case "tripped":
			case "down":
			case "getup":
			case "downTurn":
			case "flipLandTrip":
			return true;
			break;
			default:
			return false;
			break;
		}
	}

	this.InAttack = function () {
		switch (this.mode)
		{
			case "kickRelease":
			case "punching":
			case "tripping":
			case "spiking":
			case "blockingGround":
			case "blockingAir":
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

	this.InFlip = function () {
		return (this.mode == "flip");
	}

	this.GetAttacked = function (xPush, yPush, type) {
		//console.log(type);
		if (this.InFlip())
		{
			console.log(this.linkedSprite.currentFrame);
			if (this.linkedSprite.currentFrame >= 9 && (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE))
			{
				this.flipSuccess = false;
			}
			return;
		}
		if (this.InHitstun())
		{
			//Ignore attacks in hitstun, I think?
			return;
		}
		var prevMode = this.mode;
		if (this.InDash())
		{
			if (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE)
			{
				this.mode = "tripped";
			}
			else
			{
				//Immune from non-trip/spike attacks while dashing
				return;
			}
		}
		else if (type == ATTACK_TYPE.WEAK || type == ATTACK_TYPE.SPIKE)
		{
			if (prevMode == "hitstun" && this.linkedSprite.currentFrame > 1)
			{
				prevMode = "not_hitstun";
			}
			this.mode = "hitstun";
		}
		else if (type == ATTACK_TYPE.STRONG)
		{
			this.mode = "launched";
		}
		else if (type == ATTACK_TYPE.TRIP || type == ATTACK_TYPE.SPIKE)
		{
			
		}
		if (this.mode != prevMode)
		{
			this.xVel += xPush;
			this.yVel += yPush;
			this.linkedSprite.SetMode(this.mode);
			if (xPush > 0 && type == ATTACK_TYPE.STRONG)
			{
				this.direction = "right";
			}
			if (xPush < 0 && type == ATTACK_TYPE.STRONG)
			{
				this.direction = "left";
			}
		}
	}

	this.DoAttack = function (attackNum, defender) {
		
		switch (this.mode)
		{
			case "kickRelease":
			//Change based on charge amount
			if (this.hitOpponent)
			{
				return;
			}
			defender.GetAttacked(this.CheckDirection() * (KICK_KNOCKBACK_X + this.charge * KICK_KNOCKBACK_ANGULAR * Math.cos(this.kickAngle)), KICK_KNOCKBACK_Y - this.charge * KICK_KNOCKBACK_ANGULAR * Math.sin(this.kickAngle), ATTACK_TYPE.STRONG);
			this.charge = CHARGE_BASE;

			this.hitOpponent = true;
			break;
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
			case "spiking":
			defender.GetAttacked(SPIKE_KNOCKBACK_X, SPIKE_KNOCKBACK_Y, ATTACK_TYPE.SPIKE);
			break;
		}
	}

	this.DoBallAttack = function (attackNum, ball) {
		switch (this.mode)
		{
			case "kickRelease":
			//Change based on charge amount
			if (this.hitBall)
			{
				return;
			}
			ball.GetAttacked(this.CheckDirection() * (KICK_BALL_X + this.charge * KICK_BALL_ANGULAR * Math.cos(this.kickAngle)), KICK_BALL_Y - this.charge * KICK_BALL_ANGULAR * Math.sin(this.kickAngle), ATTACK_TYPE.STRONG);
			this.charge = CHARGE_BASE;
			this.hitBall = true;
			break;
			case "punching":
			if (attackNum == 1)
			{
				ball.GetAttacked(this.CheckDirection() * PUNCH_KNOCKBACK_X_WEAK, PUNCH_KNOCKBACK_Y_WEAK, ATTACK_TYPE.WEAK);
			}
			if (attackNum == 2)
			{
				ball.GetAttacked(this.CheckDirection() * PUNCH_KNOCKBACK_X, PUNCH_KNOCKBACK_Y, ATTACK_TYPE.STRONG);
			}
			break;
			case "tripping":
			ball.GetAttacked(this.CheckDirection() * BALL_DRIBBLE_X, 0, ATTACK_TYPE.TRIP);
			break;
			case "spiking":
			if (this.hitBall)
			{
				return;
			}
			ball.GetAttacked(SPIKE_KNOCKBACK_X, SPIKE_KNOCKBACK_Y, ATTACK_TYPE.SPIKE);
			this.hitBall = true;
			break;
			case "blockingGround":
			case "blockingAir":
			//ball.GetAttacked(55, 55, ATTACK_TYPE.TRIP);
			ball.GetBlocked(this.direction);
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
			case "blockingGround":
			this.mode = "idle";
			break;
			case "blockingAir":
			this.mode = "jumpFalling";
			break;
			case "kickWindup":
			this.mode = "kickHold";
			break;
			case "kickRelease":
			this.mode = "idle";
			break;
			case "punching":
			this.mode = "idle";
			break;
			case "tripping":
			this.mode = "idle";
			break;
			case "spiking":
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
		}
		return this.mode;
	}

	this.ApplyInput = function () {
		var kArray = [false, false, false, false, false, false];
		for (var i = 0; i < keyPressedOrder.length; i++)
		{
			var key = keyPressedOrder[i];
			for (var j = 0; j < keyInput.length; j++)
			{
				if (key == keyInput[j])
				{
					kArray[j] = true;
				}
			}
		}

		//Testing gamepad support
		if (keyInput[0] == 38 && navigator.webkitGetGamepads()[0])
		{
			kArray = DoGamepadInput();
		}
		//Testing gamepad support

		var UP = kArray[0];
		var LEFT = kArray[1];
		var DOWN = kArray[2];
		var RIGHT = kArray[3];
		var ATTACK = kArray[4];
		var SPECIAL = kArray[5];


		if (this.mode != "kickRelease" && this.mode != "spiking")
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
				if (UP)
				{
					this.mode = "jumpTakeoff";
					this.DoJump();
				}
				else if (DOWN && ATTACK)
				{
					this.mode = "tripping";
				}
				else if (DOWN && SPECIAL)
				{
					this.mode = "charging";
				}
				else if (ATTACK && (LEFT || RIGHT))
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "punching";
				}
				else if (SPECIAL && (LEFT || RIGHT))
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "dashGround";
					this.DoDashGround();
				}
				else if (ATTACK)
				{
					this.mode = "kickWindup";
				}
				else if (SPECIAL)
				{
					this.mode = "blockingGround";
				}
				else if (LEFT || RIGHT)
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "walking";
					this.DoWalk();
				}
			break;
			case "walking":
				if (UP)
				{
					this.mode = "jumpTakeoff";
					this.DoJump();
				}
				else if (DOWN && ATTACK)
				{
					this.mode = "tripping";
				}
				else if (DOWN && SPECIAL)
				{
					this.mode = "charging";
				}
				else if (ATTACK && (LEFT || RIGHT))
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "punching";
				}
				else if (SPECIAL && (LEFT || RIGHT))
				{
					this.CheckTurnaround(LEFT, RIGHT);
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
				if (UP && !this.releasedJump)
				{
					this.DoJumpHold();
				}
				else
				{
					this.releasedJump = true;
				}
				if (this.yVel >= -1)
				{
					this.mode = "jumpApex";
				}
			case "jumpApex":
			case "jumpFalling":
				if (SPECIAL && (!LEFT && !RIGHT))
				{
					this.mode = "blockingAir";
				}
				else if (SPECIAL && (LEFT || RIGHT))
				{
					this.CheckTurnaround(LEFT, RIGHT);
					this.mode = "dashAir";
					this.DoDashAir();
				}
				else if (ATTACK)
				{
					this.mode = "spiking";
				}
				if (this.CheckGrounded())
				{
					this.mode = "jumpLanding";
				}
				else
				{
					this.DoAirMove(LEFT, RIGHT);
				}
			break;
			case "jumpLanding":
				//No es bueno
			break;
			case "blockingGround":
				//no actions to take
			break;
			case "blockingAir":
				//no actions to take
				this.DoBlockAir();
			break;
			case "dashGround":
				//Need to check direction matches current direction
				if (SPECIAL && (LEFT || RIGHT))
				{
					this.DoDashGround();
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
				}
			break;
			case "dashAir":
				//Need to check direction matches current direction
				if (SPECIAL && (LEFT || RIGHT))
				{
					this.DoDashAir();
				}
				else
				{
					this.mode = "jumpFalling";
				}
			break;
			case "kickWindup":
				this.kickAngle = 0;
				this.kickAngleSwap = false;
				//nope
			break;
			case "kickHold":
				
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

				if (!ATTACK)
				{
					this.mode = "kickRelease";
				}
			break;
			case "kickRelease":
				//none
			break;
			case "punching":
				this.DoPunch();
			break;
			case "charging":
			var prevCharge = this.charge;
			this.charge += CHARGE_PER_FRAME;
			if (this.charge > CHARGE_MAX)
			{
				this.charge = CHARGE_MAX;
			}
			if (this.charge >= 4 && prevCharge < 4)
			{
				this.chargeFlash = true;
			}
			console.log(this.charge);
			if (!SPECIAL)
			{
				this.mode = "idle";
			}
			break;
			case "spiking":
				//you cannat zyensse
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
			case "hitstun":
			case "crashland":
			case "getup":
				//lol u ded
			break;
			case "down":
				//Rolling or Standing Up here
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
			break;
			case "flip":
				this.DoFlip();
			break;
			case "flipLandSafe":
			case "flipLandTrip":
			case "downTurn":
				//no
			break;
		}
		if (this.mode != prevMode)
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
	this.DoPunch = function () {
		this.xVel += PUNCH_SPEED * this.CheckDirection();
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
	this.DoDashGround = function () {
		this.xVel = DASH_SPEED * this.CheckDirection();
	}
	this.DoDashAir = function () {
		this.xVel = DASH_SPEED * this.CheckDirection();
		this.yVel = -GRAVITY + 0.1;
	}
	this.DoWalk = function () {
		this.xVel += MOVE_SPEED * this.CheckDirection();
	}
	this.ApplyGravity = function () {
		if (this.CheckGrounded())
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
}