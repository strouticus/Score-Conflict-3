//levels.js


//Add a part with symmetry (Adds two points)
function AddPartSym (x, y)
{
	groundShape.AddPart(x, y);
	groundShape.AddPart(STAGE_WIDTH - x, y);
}

//The classic Basin level. Good for beginners and experts alike.
function SetupLevelBasin () {
	STAGE_WIDTH = 1500
	groundShape = new GroundShape([
		{x:0, y:430},
		{x:1500, y:430}
	]);
	AddPartSym(140, 430);
	AddPartSym(220, 450);
	AddPartSym(270, 455);
	AddPartSym(320, 450);
	AddPartSym(400, 440);
	AddPartSym(450, 430);
	AddPartSym(600, 420);
	AddPartSym(700, 420);

	StartGame();
}

//Crater: A tough level! Players are in for a long tug-of-war game if they can't get the ball out of the center.
function SetupLevelCrater () {
	STAGE_WIDTH = 1200
	groundShape = new GroundShape([
		{x:0, y:360},
		{x:1200, y:360}
	]);
	AddPartSym(120, 360);
	AddPartSym(180, 365);
	AddPartSym(250, 390);
	AddPartSym(370, 430);
	AddPartSym(430, 440);
	AddPartSym(520, 445);

	StartGame();
}

//Mountain: This is a very large level! However, its slopes lend an easy victory to the player who gets an early lead. Making a comeback will be difficult.
function SetupLevelMountain () {
	STAGE_WIDTH = 2000
	groundShape = new GroundShape([
		{x:0, y:420},
		{x:2000, y:420}
	]);
	AddPartSym(180, 420);
	AddPartSym(440, 385);
	AddPartSym(695, 320);
	AddPartSym(840, 285);
	AddPartSym(905, 270);
	AddPartSym(960, 265);

	StartGame();
}

//Now it's on.
function SetupLevelTerminal () {
	STAGE_WIDTH = 1800
	groundShape = new GroundShape([
		{x:0, y:450},
		{x:1800, y:450}
	]);
	AddPartSym(200, 450);
	AddPartSym(205, 445);
	AddPartSym(250, 445);
	AddPartSym(255, 450);
	AddPartSym(870, 450);
	AddPartSym(875, 445);

	StartGame();
}

