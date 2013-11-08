//sprite.js

function Sprite (imageRef, filterNum) {
	//imageRef: object with mode attributes - image names
	//example: {standing:"Standing.png", walking:"Walking.png"}
	this.imageRef = imageRef;
	//filterNum: which imageFilter to use or something
	this.filterNum = filterNum;

	this.currentMode = "walking";

	this.currentFrame = 0;

	this.delay = 2;
	this.timer = 0;

	this.SetMode = function (newMode) {
		this.currentMode = newMode;
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
		if (this.currentFrame > 12 - 1)
		{
			this.currentFrame = 0;
		}
	}
}
