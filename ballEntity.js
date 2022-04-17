//ballEntity.js

var BALL_GRAVITY = 1;
var BALL_FRICTION_X = 0.97;
var BALL_FRICTION_Y = 0.97;

var BOUNCE_CUTOFF = 2;


function BallEntity () {
	this.x = STAGE_WIDTH / 2;
	this.y = 100;
	this.xVel = 0;
	this.yVel = 0;
	this.hurtBox = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
	this.isHeld = false;
	this.heldBy = undefined;
	this.attackInvincibilityTimer = 0;
	this.wasThrown = false;
	this.throwerEntity = undefined

	this.ResetSelf = function () {
		this.x = STAGE_WIDTH / 2;
		this.y = 100;
		this.xVel = 0;
		this.yVel = 0;

		this.isHeld = false;
	}

	this.SelfUpdate = function () {
		if (this.isHeld) {
			this.updateHoldPosition();
		} else {
			this.HitGround();
			this.ApplyGravity();
			this.MoveByVelocity();
			this.ApplyAirFriction();
			this.GetPickedUp(player1Entity);
			this.GetPickedUp(player2Entity);
		}
		this.DoBoundaries();

		if (this.attackInvincibilityTimer > 0) {
			this.attackInvincibilityTimer -= 1;
		}

		if (this.isHeld) {
			this.wasThrown = false;
		}
	}

	this.GetAttacked = function (xPush, yPush, type) {
		//console.log(type);
		if (this.attackInvincibilityTimer <= 0) {
			this.xVel += xPush;
			this.yVel += yPush;
			if (type == ATTACK_TYPE.TRIP)
			{
				this.xVel = xPush;
			}
		}
	}

	this.GetBlocked = function (direction) {
		if (direction == "left")
		{
			this.xVel = -Math.abs(this.xVel);
		}
		else if (direction == "right")
		{
			this.xVel = Math.abs(this.xVel);
		}
	}

	this.GetBlockedWeak = function (direction) {
		if (direction == "left")
		{
			this.xVel = -Math.abs(this.xVel) * 0.1;
		}
		else if (direction == "right")
		{
			this.xVel = Math.abs(this.xVel) * 0.1;
		}
	}

	this.updateHoldPosition = function () {
		this.xVel = 0;
		this.yVel = 0;
		this.x = this.heldBy.x + (this.heldBy.CheckDirection() * 20);
		this.y = this.heldBy.y - 30;
	}

	this.HitGround = function () {
		if (this.CheckGrounded())
		{
			if (this.wasThrown) {
				console.info("Ball hit ground after being wasThrougn");
			}
			this.wasThrown = false;
			//console.log(this.GetVelocity());
			if (this.GetVelocity() <= BOUNCE_CUTOFF)
			{
				//some sort of stop
				//this.xVel *= 0.01;
				//this.yVel *= 0.01;
				//console.log("No bounce");
				this.DoBounce();
			}
			else if (this.yVel < 1)
			{
				this.DoBounce();
			}
			else
			{
				var bounceSound = createjs.Sound.play("ballcontact1");
				bounceSound.volume = (this.GetVelocity() / 50);
				this.DoBounce();
			}
			
			/*if (this.yVel > 0)
			{
				if (this.yVel < BOUNCE_CUTOFF)
				{
					this.yVel = 0;
					this.ApplyGroundFriction();
				}
				else
				{
					
					//this.yVel = -Math.abs(this.yVel) * BALL_FRICTION_Y;
					//this.xVel += groundShape.GetSlopeAtX(this.x) * Math.abs(this.yVel);
				}
			}*/
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

	this.ApplyGravity = function () {
		if (this.CheckGrounded())
		{
			return;
		}
		this.yVel += BALL_GRAVITY;
	}

	this.MoveByVelocity = function () {
		this.x += this.xVel;
		this.y += this.yVel;
	}

	this.ApplyAirFriction = function () {
		this.xVel *= BALL_FRICTION_X;
		this.yVel *= BALL_FRICTION_Y;
	}

	this.DoBoundaries = function () {
		if (!this.isHeld) {
			if (this.CheckLeftEdge())
			{
				this.x = 0;
				this.xVel = Math.abs(this.xVel) * 0.9;
				console.log("Top: " + (this.y - (4 * PIXEL_SIZE)) + " Bottom:" + this.y);
				if (goalEntity.CheckGoal(this.y) || goalEntity.CheckGoal(this.y - (4 * PIXEL_SIZE)))
				{
					RD.AddBallBounceEffect();
					console.log("Goal on left edge!");
					Player2Goal();
					createjs.Sound.play("score1");
				}
				else if (goalEntity.CheckPost(this.y) || goalEntity.CheckPost(this.y - (4 * PIXEL_SIZE)))
				{
					createjs.Sound.play("post3");
					RD.AddBallBounceEffect();
				}
				else
				{
					RD.AddBallBounceEffect();
					var bounceSound = createjs.Sound.play("ballcontact1");
					bounceSound.volume = (this.GetVelocity() / 50);
				}
			}
			if (this.CheckRightEdge())
			{
				this.x = STAGE_WIDTH;
				this.xVel = -Math.abs(this.xVel) * 0.9;
				if (goalEntity.CheckGoal(this.y) || goalEntity.CheckGoal(this.y - (4 * PIXEL_SIZE)))
				{
					RD.AddBallBounceEffect();
					console.log("Goal on right edge!");
					Player1Goal();
					createjs.Sound.play("score1");
				}
				else if (goalEntity.CheckPost(this.y) || goalEntity.CheckPost(this.y - (4 * PIXEL_SIZE)))
				{
					createjs.Sound.play("post3");
					RD.AddBallBounceEffect();
				}
				else
				{
					RD.AddBallBounceEffect();
					var bounceSound = createjs.Sound.play("ballcontact1");
					bounceSound.volume = (this.GetVelocity() / 50);
				}
			}
			/*if (this.y < 0)
			{
				this.y = 0;
				this.yVel = Math.abs(this.yVel) * 0.9;
				createjs.Sound.play("ballcontact1");
			}*/
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
	this.GetAngle = function () {
		return Math.atan2(this.yVel, this.xVel);
	}
	this.GetVelocity = function () {
		return Math.sqrt(this.xVel * this.xVel + this.yVel * this.yVel);
	}
	this.DoBounce = function () {
		if (this.yVel > 1)
		{
			if (this.GetVelocity() >= BOUNCE_CUTOFF)
			{
				RD.AddBallBounceEffect();
			}	
		}
		var velocity = this.GetVelocity() * 0.95;
		var ballAngle = this.GetAngle();
		var groundAngle = groundShape.GetAngleAtX(this.x);
		var newAngle = - ballAngle + groundAngle;
		this.xVel = Math.cos(newAngle) * velocity;
		this.yVel = Math.sin(newAngle) * velocity;
	}
	this.ApplyGroundFriction = function () {
		this.xVel = 0;
	}

	this.GetPickedUp = function (playerEntity) {
		if (!this.isHeld) {
			if (playerEntity.CanPickupBall()) {
				var yDiff = (this.y - playerEntity.y);
				if (yDiff > -100 && yDiff < 10)
				{
					if (Math.abs(this.x - playerEntity.x) < 30)
					{
						this.isHeld = true;
						this.heldBy = playerEntity;
						playerEntity.isHoldingBall = true;
						playerEntity.ballBeingHeld = this;
					}
				}
			}
		}
	}
}