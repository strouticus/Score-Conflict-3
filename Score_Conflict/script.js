// Score Conflict
// Copyright Mark Foster and Andrew Strout 2013
// All Rights Reserved

var GM;
var IL;
var RD;

var player1Sprite;
var player2Sprite;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');
ctx.webkitImageSmoothingEnabled = false;

function Init () {
	//Start up
	GM = new GameMusic(["scorn_flontift.ogg", "song2.ogg"]);
	IL = new ImageLoader(["megaman.png", "final_fantasy.png"], ["illegal_sky.png"])
	RD = new Render(IL);

	player1Sprite = new Sprite({walking:"megaman.png", punching:"final_fantasy.png"}, 0);
	player2Sprite = new Sprite({walking:"megaman.png", punching:"final_fantasy.png"}, 1);
	player1Sprite.SetMode("punching");

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

function Update () {
	RD.RenderFrame();
	requestAnimFrame(Update);
}