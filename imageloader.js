//imageloader.js 
//Loads images, filters them too

function FilterSettings (fromArray, toArray) {
	this.fromArray = fromArray;
	//this.rFromA = [];
	//this.gFromA = [];
	//this.bFromA = [];
	/*for (var i = 0; i < fromArray.length; i++) {
		var color = fromArray[i];
		var r = parseInt(color.slice(1, 3), 16);
		var g = parseInt(color.slice(3, 5), 16);
		var b = parseInt(color.slice(5, 7), 16);
		//this.rFromA.push(r);
		//this.gFromA.push(g);
		//this.bFromA.push(b);
	}*/
	this.toArray = toArray;
	this.rToA = [];
	this.gToA = [];
	this.bToA = [];
	for (var i = 0; i < toArray.length; i++) {
		var color = toArray[i];
		var r = parseInt(color.slice(1, 3), 16);
		var g = parseInt(color.slice(3, 5), 16);
		var b = parseInt(color.slice(5, 7), 16);
		this.rToA.push(r);
		this.gToA.push(g);
		this.bToA.push(b);
	}
}


var versionSettings = [
	new FilterSettings([0, 64, 182, 200, 255], ["#FFFFFF", "#000000", "#B60000", "#00FFFF", "#FF0000"]),
	new FilterSettings([0, 64, 182, 200, 255], ["#FFFFFF", "#000000", "#0000B6", "#00FFFF", "#0000FF"]),
	new FilterSettings([0, 64, 182, 200, 255], ["#FFFFFF", "#000000", "#5C3C3C", "#00FFFF", "#765555"]),
	new FilterSettings([0, 64, 182, 200, 255], ["#FFFFFF", "#000000", "#3C3C5C", "#00FFFF", "#555576"])
	];

var fCanvas = document.createElement('canvas');
	fCanvas.setAttribute("id", "canvasF");
var fctx = fCanvas.getContext('2d');

var successCount = 0;

//Constructor for ImageLoaders
function ImageLoader (spriteSrcArray, backgroundSrcArray, otherSrcArray) {
	this.spriteImageArray = [];
	this.filteredImageArray = [];
	this.hitboxArray = [];
	this.hurtboxArray = [];

	for (var i = 0; i < spriteSrcArray.length; i++)
	{
		var image = new Image();
		this.spriteImageArray.push(image);
		image.addEventListener("load", function() {
			successCount += 1;
		}, false);
		image.src = "Images/Sprites/" + spriteSrcArray[i];

		var filteredImage = {versions:[]};
		this.filteredImageArray.push(filteredImage);
	}

	this.GetFrameCount = function (imgName) {
		return (this.spriteImageArray[spriteSrcArray.indexOf(imgName)].width / 24);
	}

	this.GetHitbox = function (imageName) {
		var index = spriteSrcArray.indexOf(imageName);
		if (index == -1)
		{
			console.log("GetHitbox failed because bad imageName probably. tried " + imageName);
			return;
		}
		var hitbox = this.hitboxArray[index];
		if (hitbox)
		{
			//Already created, just return the cache'd one
			return hitbox;
		}
		var baseImage = this.spriteImageArray[index];

		fCanvas.width = baseImage.width;
		fCanvas.height = baseImage.height;
		fctx.drawImage(baseImage, 0, 0);
		var imgData = fctx.getImageData(0, 0, baseImage.width, baseImage.height);
		var d = imgData.data;


		var newHitbox = [];
		var frameCount = this.GetFrameCount(imageName);
		//debugger;
		for (var i = 0; i < frameCount; i++) {
			newHitbox[i] = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
		}

		for (var i = 0; i < d.length; i+=4)
		{
			var frame = Math.floor(((i / 4) % (frameCount * 24)) / 24);
			//var column = (i / 4) % (frameCount * 24) - (frame * 24);
			var column = (i / 4) % (24);
			var row = Math.floor((i / 4) / (frameCount * 24));
			//debugger;
			if (d[i+1] == 0)
			{
				newHitbox[frame][column][row] = 0;
			}
			if (d[i+1] == 128)
			{
				newHitbox[frame][column][row] = 1;
			}
			if (d[i+1] == 255)
			{
				newHitbox[frame][column][row] = 2;
			}
		}
		this.hitboxArray[index] = newHitbox;
		return newHitbox;
	}

	this.GetHurtbox = function (imageName) {
		var index = spriteSrcArray.indexOf(imageName);
		if (index == -1)
		{
			console.log("GetHurtbox failed because bad imageName prollyur");
			return;
		}
		var hurtbox = this.hurtboxArray[index];
		if (hurtbox)
		{
			//Already created, just return the cache'd one
			return hurtbox;
		}
		var baseImage = this.spriteImageArray[index];

		fCanvas.width = baseImage.width;
		fCanvas.height = baseImage.height;
		fctx.drawImage(baseImage, 0, 0);
		var imgData = fctx.getImageData(0, 0, baseImage.width, baseImage.height);
		var d = imgData.data;


		var newHurtbox = [];
		var frameCount = this.GetFrameCount(imageName);
		for (var i = 0; i < frameCount; i++) {
			newHurtbox[i] = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
		}

		for (var i = 0; i < d.length; i+=4)
		{
			var frame = Math.floor(((i / 4) % (frameCount * 24)) / 24);
			var column = (i / 4) % (24);
			var row = Math.floor((i / 4) / (frameCount * 24));
			if (d[i+2] == 255)
			{
				newHurtbox[frame][column][row] = 0;
			}
			if (d[i+2] == 0)
			{
				newHurtbox[frame][column][row] = 1;
			}
		}
		this.hurtboxArray[index] = newHurtbox;
		return newHurtbox;
	}

	//Returns the index of the filter in versionSettings
	//My example for a green dude is: IL.AddCustomFilter(["#FF0000", "#B60000"], ["#00FF00", "#00B600"]);
	//Orange guy? IL.AddCustomFilter(["#FF0000", "#B60000"], ["#FF7000", "#B64F00"]);
	this.AddCustomFilter = function (fromArray, toArray) {
		versionSettings.push(new FilterSettings(fromArray, toArray));
		return versionSettings.length - 1;
	}

	this.GetFilteredImage = function (imageName, versionNum) {
		var index = spriteSrcArray.indexOf(imageName);
		if (index == -1 || !versionSettings[versionNum])
		{
			console.log("GetFilteredImage failed because bad imageName or maybe bad versionNum, who knows");
			return;
		}
		var filteredImage = this.filteredImageArray[index];
		if (filteredImage[versionNum])
		{
			//Already created, just return the cache'd one
			return filteredImage[versionNum];
		}
		var fSettings = versionSettings[versionNum];
		var baseImage = this.spriteImageArray[index];

		fCanvas.width = baseImage.width;
		fCanvas.height = baseImage.height;
		fctx.drawImage(baseImage, 0, 0);
		var imgData = fctx.getImageData(0, 0, baseImage.width, baseImage.height);
		var d = imgData.data;

		var nColor = document.createElement('canvas');
		
		nColor.width = baseImage.width;
		nColor.height = baseImage.height;
		var cctx = nColor.getContext('2d');

		for (var i = 0; i < d.length; i+=4)
		{
			for (var j = 0; j < fSettings.fromArray.length; j++)
			{
				if (d[i] == fSettings.fromArray[j])
				{
					if (d[i] == 0)
					{
						//Transparent
						d[i+3] = 0;
					}
					else
					{
						d[i] = fSettings.rToA[j];
						d[i+1] = fSettings.gToA[j];
						d[i+2] = fSettings.bToA[j];
					}
					break;
				}
				/*
				if (d[i] == fSettings.rFromA[j] && d[i+1] == fSettings.gFromA[j] & d[i+2] == fSettings.bFromA[j])
				{
					d[i] = fSettings.rToA[j];
					d[i+1] = fSettings.gToA[j];
					d[i+2] = fSettings.bToA[j];
				}
				*/
			}
		}
		imgData.data = d;
		cctx.putImageData(imgData, 0, 0);

		filteredImage[versionNum] = nColor;
		return nColor;

		//this.colors[num] = nColor;
		//return this.colors[num];
	}


	this.backgroundImageArray = [];
	for (var i = 0; i < backgroundSrcArray.length; i++)
	{
		var image = new Image();
		this.backgroundImageArray.push(image);
		image.addEventListener("load", function() {
			successCount += 1;
		}, false);

		image.src = "Images/Backgrounds/" + backgroundSrcArray[i];
	}

	this.GetBackgroundImage = function (imageName) {
		var index = backgroundSrcArray.indexOf(imageName);
		var img = this.backgroundImageArray[index];
		if (img)
		{
			return this.backgroundImageArray[index];
		}
		else
		{
			console.log("GetBackgroundImage failed, bad imageName probably");
		}
	}

	this.otherImageArray = [];
	for (var i = 0; i < otherSrcArray.length; i++)
	{
		var image = new Image();
		this.otherImageArray.push(image);
		image.addEventListener("load", function() {
			successCount += 1;
		}, false);
		image.src = "Images/Other/" + otherSrcArray[i];
	}

	this.GetOtherImage = function (imageName) {
		var index = otherSrcArray.indexOf(imageName);
		var img = this.otherImageArray[index];
		if (img)
		{
			return this.otherImageArray[index];
		}
		else
		{
			console.log("GetOtherImage failed, bad imageName probably");
			console.log(imageName);
		}
	}

	this.IsLoaded = function () {
		return (successCount == spriteSrcArray.length + backgroundSrcArray.length + otherSrcArray.length);
	}
}