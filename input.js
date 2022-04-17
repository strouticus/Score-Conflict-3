//input.js

function DoGamepadInput0 () {
	var gamepad0 = navigator.getGamepads()[0];

	var up = gamepad0.buttons[12];
	var down = gamepad0.buttons[13];
	var left = gamepad0.buttons[14];
	var right = gamepad0.buttons[15];
	var attack = gamepad0.buttons[0] || gamepad0.buttons[1];
	var special = gamepad0.buttons[2] || gamepad0.buttons[3];

	if (gamepad0.axes[0] > 0.5)
	{
		right = true;
		left = false;
	}
	if (gamepad0.axes[0] < -0.5)
	{
		right = false;
		left = true;
	}
	if (gamepad0.axes[1] > 0.5)
	{
		down = true;
		up = false;
	}
	if (gamepad0.axes[1] < -0.5)
	{
		down = false;
		up = true;
	}

	/*var btns = [];
	for (var i = 0; i < gamepad0.buttons.length; i++) {
		btns.push("" + gamepad0.buttons[i].value);
	};
	console.log(btns.join(" "));
	*/
	var inputArray = [up.pressed, left.pressed, down.pressed, right.pressed, attack.pressed, special.pressed];
	//console.log("" + inputArray[0] + inputArray[1] + inputArray[2] + inputArray[3] + inputArray[4] + inputArray[5]);
	return inputArray;
}

function DoGamepadInput1 () {
	var gamepad1 = navigator.getGamepads()[1];

	var up = gamepad1.buttons[12];
	var down = gamepad1.buttons[13];
	var left = gamepad1.buttons[14];
	var right = gamepad1.buttons[15];
	var attack = gamepad1.buttons[0] || gamepad1.buttons[1];
	var special = gamepad1.buttons[2] || gamepad1.buttons[3];

	if (gamepad1.axes[0] > 0.5)
	{
		right = true;
		left = false;
	}
	if (gamepad1.axes[0] < -0.5)
	{
		right = false;
		left = true;
	}
	if (gamepad1.axes[1] > 0.5)
	{
		down = true;
		up = false;
	}
	if (gamepad1.axes[1] < -0.5)
	{
		down = false;
		up = true;
	}
	
	var inputArray = [up.pressed, left.pressed, down.pressed, right.pressed, attack.pressed, special.pressed];
	return inputArray;
}




cursorVisible = true;
keyPressedOrder = [];

var mouseX = 0;
var mouseY = 0;

function MousePos (e) {
	if (ARCADE_MODE)
	{
		return;
	}
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
	if (ARCADE_MODE)
	{
		return;
	}
	console.log("x " + e.x + ", y " + e.y);
	ClickEvent();

	/*
	if (inLoadScreen && RD.CheckMenuHover("Play", canvas.width / 2, canvas.height / 2, 50, mouseX, mouseY))
	{
		inLoadScreen = false;
		inMainMenu = true;
	}
	if (inMainMenu && RD.CheckMenuHover("Play", canvas.width / 2, 2 * canvas.height / 6, 50, mouseX, mouseY))
	{
		inMainMenu = false;
		inGame = true;
	}
	*/
	if (!cursorVisible)
	{
		//Do mouse input
		//groundShape.AddPart(mouseX, mouseY);
		//groundShape.AddPart(960 - mouseX, mouseY);
		
		//Canvas position
		//console.log(mouseX + ", " + mouseY);

		//Game position
		//console.log("X: " + ((mouseX / smoothZoom - smoothCameraX)) + ", Y: " + ((mouseY / smoothZoom - smoothCameraY)));
	}
	
}

function ClickEvent () {
	for (var i = 0; i < RD.buttonList.length; i++) {
		if (RD.CheckMenuHover(RD.buttonList[i], mouseX, mouseY))
		{
			RD.buttonList[i].func();
			return;
		}
	};
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
	//console.log(e.keyCode);
	if (e.keyCode == 8)
	{
		//Backspace - prevent going back a page
		e.preventDefault();
	}
	TrackKeyOn(e.keyCode);

	if (ARCADE_MODE)
	{
		//C, V, 0, .
		if (e.keyCode == 67 || e.keyCode == 86 || e.keyCode == 96 || e.keyCode == 110)
		{
			ClickEvent();
		}
	}

	//Esc key
	if (e.keyCode == 27)
	{
		SetupMainMenu();
	}
	return false;

	console.log(e.keyCode);
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

