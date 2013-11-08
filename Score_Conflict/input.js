//input.js

cursorVisible = true;
keyPressedOrder = [];

var mouseX = 0;
var mouseY = 0;

function MousePos (e) {
	mouseX = e.clientX - 8;
	mouseY = e.clientY - 8;
	if (cursorVisible)
	{
		cursorVisible = false;
		document.getElementById("game_canvas").style.cursor = "none";
		//Debug("Backup cursro hide")
	}
}

function hoverOn (e) {
	document.getElementById("game_canvas").style.cursor = "none";
	//Debug("Hover On");
	cursorVisible = false;
}

function hoverOff (e) {
	document.getElementById("game_canvas").style.cursor = "";
	//Debug("hover Off");
	cursorVisible = true;
}

window.addEventListener('mousedown', DoMouseDown, true);

// Mouse down event
function DoMouseDown (e) {
	if (!cursorVisible)
	{
		//Do mouse input
	}
	
}

window.addEventListener('keypress', DoKeyPress, true);
window.addEventListener('keydown', DoKeyDown, true);
window.addEventListener('keyup', DoKeyUp, true);

// Character input function
function DoKeyPress (e) {
	//nothing
}

function TrackKeyOn (key) {
	for (var i = 0; i < keyPressedOrder.length; i++)
	{
		if (keyPressedOrder[i] == key)
		{
			return;
		}
	}
	//put key at front of list: most recently pressed
	keyPressedOrder.unshift(key);
}

function TrackKeyOff (key) {
	for (var i = 0; i < keyPressedOrder.length; i++)
	{
		if (keyPressedOrder[i] == key)
		{
			keyPressedOrder.splice(i, 1);
			return;
		}
	}
}

// Key Down event:
// Does key input (sets booleans to true)
// Prevents Back key from going back a page
function DoKeyDown (e) {
	if (e.keyCode == 8)
	{
		//Backspace - prevent going back a page
		e.preventDefault();
	}
	TrackKeyOn(e.keyCode);
	/*if (e.keyCode == 87)
	{
		TrackKeyOn("w");
		wKey = true;
		return;
	}*/
	//Debug(e.keyCode);
}

// Key Up event:
// Does key input (sets booleans to false)
function DoKeyUp (e) {
	TrackKeyOff(e.keyCode);
	/*if (e.keyCode == 87)
	{
		TrackKeyOff("w");
		//wKey = false;
		return;
	}*/
}

