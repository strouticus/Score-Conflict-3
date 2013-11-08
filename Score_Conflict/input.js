//input.js

function DoGamepadInput () {
	var gamepad0 = navigator.webkitGetGamepads()[0];

	var up = gamepad0.buttons[12];
	var down = gamepad0.buttons[13];
	var left = gamepad0.buttons[14];
	var right = gamepad0.buttons[15];
	var attack = gamepad0.buttons[1] || gamepad0.buttons[3];
	var special = gamepad0.buttons[0] || gamepad0.buttons[2];
	var inputArray = [up, left, down, right, attack, special];
	return inputArray;
}




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
		groundShape.AddPart(mouseX, mouseY);
		groundShape.AddPart(960 - mouseX, mouseY);
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
	//console.log(keyPressedOrder);
}

function TrackKeyOff (key) {
	for (var i = 0; i < keyPressedOrder.length; i++)
	{
		if (keyPressedOrder[i] == key)
		{
			keyPressedOrder.splice(i, 1);
			//console.log(keyPressedOrder);
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

