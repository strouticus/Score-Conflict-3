//ballEntity.js

var BALL_GRAVITY = 1;
var BALL_FRICTION_X = 0.97;
var BALL_FRICTION_Y = 0.97;

var BOUNCE_CUTOFF = 2;



function BallEntity () {
	this.x = 480;
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

	this.SelfUpdate = function () {
		this.HitGround();
		this.ApplyGravity();
		this.MoveByVelocity();
		this.ApplyFriction();
		this.DoBoundaries();
	}

	this.GetAttacked = function (xPush, yPush, type) {
		//console.log(type);
		this.xVel += xPush;
		this.yVel += yPush;
		if (type == ATTACK_TYPE.TRIP)
		{
			this.xVel = xPush;
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

	this.HitGround = function () {
		if (this.CheckGrounded())
		{
			if (this.yVel > 0)
			{
				if (this.yVel < BOUNCE_CUTOFF)
				{
					this.yVel = 0;
				}
				else
				{
					this.yVel = -Math.abs(this.yVel) * BALL_FRICTION_Y;
					this.xVel += groundShape.GetSlopeAtX(this.x) * Math.abs(this.yVel);
				}
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

	this.ApplyFriction = function () {
		this.xVel *= BALL_FRICTION_X;
		this.yVel *= BALL_FRICTION_Y;
	}

	this.DoBoundaries = function () {
		if (this.CheckLeftEdge())
		{
			this.x = 0;
			this.xVel = Math.abs(this.xVel) * 0.9;
			if (goalEntity.CheckGoal(this.y))
			{
				console.log("Goal on left edge!");
			}
		}
		if (this.CheckRightEdge())
		{
			this.x = STAGE_WIDTH;
			this.xVel = -Math.abs(this.xVel) * 0.9;
			if (goalEntity.CheckGoal(this.y))
			{
				console.log("Goal on right edge!");
			}
		}
		if (this.y < 0)
		{
			this.y = 0;
			this.yVel = Math.abs(this.yVel) * 0.9;
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
}