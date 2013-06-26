// Score Conflict 2
// Copyright Mark Foster and Andrew Strout 2013
// All Rights Reserved

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

var mouseX = 0;
var mouseY = 0;

var image = new Image();
image.src = "SC_Idle.png";

var ready = false;

function Init () {
	ready = true;
	
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

function Render () {
	Clear();
	timer++;
	if (timer > 5)
	{
		timer = 0;
		frame++;
		if (frame == 4) frame = 0;
	}
	

	ctx.drawImage(image, 24 * frame, 0, 24, 24, 100, 100, 24, 24);
}







function MousePos (e) {
	mouseX = e.clientX - 8;
	mouseY = e.clientY - 8;
}