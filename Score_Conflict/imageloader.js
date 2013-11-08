//imageloader.js 
//Loads images, filters them too

function FilterSettings (fromArray, toArray) {
	this.fromArray = fromArray;
	this.rFromA = [];
	this.gFromA = [];
	this.bFromA = [];
	for (var i = 0; i < fromArray.length; i++) {
		var color = fromArray[i];
		var r = parseInt(color.slice(1, 3), 16);
		var g = parseInt(color.slice(3, 5), 16);
		var b = parseInt(color.slice(5, 7), 16);
		this.rFromA.push(r);
		this.gFromA.push(g);
		this.bFromA.push(b);
	}
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


var versionSettings = [new FilterSettings([], []), new FilterSettings(["#FF0000", "#B60000"], ["#0000FF", "#0000B6"])];



var fCanvas = document.createElement('canvas');
	fCanvas.setAttribute("id", "canvasF");
var fctx = fCanvas.getContext('2d');



//Constructor for ImageLoaders
function ImageLoader (spriteSrcArray, backgroundSrcArray) {
	this.spriteImageArray = [];
	this.filteredImageArray = [];
	for (var i = 0; i < spriteSrcArray.length; i++)
	{
		var image = new Image();
		this.spriteImageArray.push(image);
		image.src = "Images/Sprites/" + spriteSrcArray[i];

		var filteredImage = {versions:[]};
		this.filteredImageArray.push(filteredImage);
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
				if (d[i] == fSettings.rFromA[j] && d[i+1] == fSettings.gFromA[j] & d[i+2] == fSettings.bFromA[j])
				{
					d[i] = fSettings.rToA[j];
					d[i+1] = fSettings.gToA[j];
					d[i+2] = fSettings.bToA[j];
				}
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
}