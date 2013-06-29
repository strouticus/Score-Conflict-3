// Score Conflict 2
// Copyright Mark Foster and Andrew Strout 2013
// All Rights Reserved

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');
ctx.webkitImageSmoothingEnabled = false;

var mouseX = 0;
var mouseY = 0;

var image = new Image();
image.src = "SC_PunchCombo.png";

var ready = false;

var backgroundImages = [];
var characterImages = ["SC_Idle"];
var levelImages = [];

var imageSources = [];

var loadi = 0;
for (loadi = 0; loadi < backgroundImages.length; loadi++)
{
	imageSources.push("Images/Background/" + backgroundImages[loadi] + ".png");
}
for (loadi = 0; loadi < characterImages.length; loadi++)
{
	imageSources.push("Images/Character/" + characterImages[loadi] + ".png");
}
for (loadi = 0; loadi < levelImages.length; loadi++)
{
	imageSources.push("Images/Level/" + levelImages[loadi] + ".png");
}

var images = [];
var filteredImages = [];

var fCanvas = document.createElement('canvas');
fCanvas.setAttribute("id", "canvasF");
var fctx = fCanvas.getContext('2d');

for (var i = 0; i < imageSources.length; i += 1) {
	images.push(new Image());
	images[i].src = imageSources[i];
}

function GetBackgroundImage (name)
{return imageSources.indexOf("Images/Background/" + name + ".png");}

function GetCharacterImage (name)
{return imageSources.indexOf("Images/Character/" + name + ".png");}

function GetLevelImage (name)
{return imageSources.indexOf("Images/Level/" + name + ".png");}

function GetSNum (name)
{
	return imageSources.indexOf(name);
}


// This isn't going to work yet! for Adv it worked under the assumption
// that the images it would proccess had only white or transparent pixels
// and the resulting images were only monocolored with transparent
function FilteredImage (name)
{
	// name: name of image file (from imageSources array)
	this.name = name;
	// base image (from images array)
	this.base = images[GetSNum(name)];
	// add this to filteredImages at correct location
	filteredImages[GetSNum(name)] = this;
	// Image manipulation stuff
	fCanvas.width = this.base.width;
	fCanvas.height = this.base.height;
	fctx.drawImage(this.base, 0, 0);
	//var imgData = fctx.getImageData(0, 0, this.base.width, this.base.height);
	//var d = imgData.data;
	// colors: the array to access to use the filtered images
	this.colors = [];
	
	// GetColor(): Function to get a color-shifted version of an image. saves to colors[] for future use.
	this.GetColor = function (color)
	{
		var num = parseInt("0x" + color.slice(1, 7));
		if (this.colors[num] != undefined)
		{
			//Debug("Bonus!");
			return this.colors[num];
		}
		var r = parseInt(color.slice(1, 3), 16);
		var g = parseInt(color.slice(3, 5), 16);
		var b = parseInt(color.slice(5, 7), 16);

		fCanvas.width = this.base.width;
		fCanvas.height = this.base.height;
		fctx.drawImage(this.base, 0, 0);
		var imgData = fctx.getImageData(0, 0, this.base.width, this.base.height);
		var d = imgData.data;

		var nColor = document.createElement('canvas');
		//this.colors.push(color);
		nColor.width = this.base.width;
		nColor.height = this.base.height;
		var cctx = nColor.getContext('2d');

		for (var i = 0; i < d.length; i+=4)
		{
			if (d[i] != 0)
			{
				// Fix it here!
				d[i] = r;
				d[i+1] = g;
				d[i+2] = b;
			}
		}
		imgData.data = d;
		cctx.putImageData(imgData, 0, 0);
		this.colors[num] = nColor;
		return this.colors[num];
	}
}


function Init () {
	ready = true;
	SetUpRender();
	// Render and update loop
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	requestAnimFrame(Update);

}
function SetUpRender () {
	for (var im = 0; im < imageSources.length; im ++)
	{
		new FilteredImage(imageSources[im]);
	}
}


function Update () {
	if (!ready)
	{
		return;
	}
	//Control();
	//Action();
	Render();
	requestAnimFrame(Update);
};

function Clear () {
	// Clear screen
	ctx.clearRect(0, 0, 600, 600);
	//canvas.width = canvas.width;
}

var timer = 0;
var frame = 0;

var playerID = Math.floor(Math.random() * 10000);

function Render () {
	Clear();
	timer++;
	if (timer > 2)
	{
		timer = 0;
		frame++;
		if (frame == 33) frame = 0;
	}
	ctx.save();
	ctx.translate(mouseX, mouseY);
	ctx.drawImage(image, 24 * frame, 0, 24, 24, -96, -96, 192, 192);
	ctx.restore();

	for (var i = 0; i < playerList.length; i++)
	{
		ctx.save();
		ctx.translate(playerList[i].x, playerList[i].y);
		ctx.drawImage(image, 24 * frame, 0, 24, 24, -96, -96, 192, 192);
		ctx.restore();
	}
	

	socket.emit('position', {x:mouseX, y:mouseY, id:playerID});
}

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

function RandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}



function MousePos (e) {
	mouseX = e.clientX - 8;
	mouseY = e.clientY - 8;
	/*socket.emit('position', {x:mouseX, y:mouseY, id:0});*/
}