//sprite.js

var differentDelays = {jumpTakeoff: 1, jumpLanding: 2, punching: 3, kickRelease: 3, idle: 5, tripped: 3, jumpApex: 2, spiking: 3, flip: 2, downTurn: 3, hitstun: 5}

function Sprite (imageRef, filterNum) {
	//imageRef: object with mode attributes - image names
	//example: {standing:"Standing.png", walking:"Walking.png"}
	this.imageRef = imageRef;
	//filterNum: which imageFilter to use or something
	this.filterNum = filterNum;

	this.linkedEntity = undefined;
 
	this.currentMode = "idle";

	this.currentFrame = 0;
	this.frameCount = 4;

	this.delay = 5;
	this.timer = 0;

	this.x = 0;
	this.y = 0;

	this.SetPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}

	this.GetX = function () {
		return this.linkedEntity.x;
		//return this.x;
	}

	this.GetY = function () {
		return this.linkedEntity.y;
		//return this.y;
	}

	this.SetMode = function (newMode) {
		this.currentMode = newMode;
		this.timer = 0;
		this.currentFrame = 0;
		this.frameCount = IL.GetFrameCount(this.imageRef[newMode]);
		if (differentDelays[newMode])
		{
			this.delay = differentDelays[newMode];
		}
		else
		{
			this.delay = 4;
		}
	}

	this.GetImage = function () {
		return this.imageRef[this.currentMode];
	}

	this.GetFilter = function () {
		return this.filterNum;
	}

	this.GetFrame = function () {
		return this.currentFrame;
	}

	this.Tick = function () {
		this.timer++;
		if (this.timer >= this.delay)
		{
			this.timer = 0;
			this.NextFrame();
		}
	}

	this.NextFrame = function () {
		this.currentFrame++;
		if (this.currentFrame > this.frameCount - 1)
		{
			var newMode = this.linkedEntity.AnimationEnd();
			if (this.currentMode == newMode)
			{
				this.currentFrame = 0;
			}
			else
			{
				this.SetMode(newMode);
			}	
		}
	}
}
