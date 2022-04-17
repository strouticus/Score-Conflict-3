//button.js


function MenuButton (message, x, y, shape, fontSize, state, func) {
	this.message = message;
	this.x = x;
	this.y = y;
	this.shape = shape;
	this.fontSize = fontSize;
	this.state = state;
	this.func = func;

	ctx.save();
	ctx.font = "" + this.fontSize + "px lowrider";
	this.buttonLength = ctx.measureText(message).width + 42;
	this.buttonHeight = fontSize + 42;
	ctx.restore();
}






/* 
**************************************
*          BUTTON FUNCTIONS          *
**************************************
*/

function SetupMainMenu () {
	inLoadScreen = false;
	inSettingsScreen = false;
	inMainMenu = true;
	inP1Wins = false;
	inP2Wins = false;
	inStageSelect = false;
	inTutorial = false;
	inGame = false;
	
	RD.ClearButtonList();

	//RD.AddButton("Play", canvas.width / 2, 2 * canvas.height / 6, "square", 50, StartGame);
	RD.AddButton("Play", canvas.width / 2, 2 * canvas.height / 5, "square", 50, SetupStageSelectScreen);
	RD.AddButton("Tutorial", canvas.width / 2, 3 * canvas.height / 5, "square", 50, StartTutorial);
	RD.AddButton("Settings", canvas.width / 2, 4 * canvas.height / 5, "square", 50, SetupSettingsScreen);

	if (ARCADE_MODE)
	{
		RD.AddButton("Quit", canvas.width / 8, 4 * canvas.height / 5, "square", 50, QuitGame);
	}
	
	GM.PlaySong("Magnet.ogg");
};

function QuitGame() {
	window.close();
}

function SetupStageSelectScreen() {
	inMainMenu = false;
	inStageSelect = true;

	RD.ClearButtonList();

	RD.AddButton("Basin", (canvas.width / 5) * 1, 1 * canvas.height / 2, "square", 25, SetupLevelBasin);
	RD.AddButton("Crater", (canvas.width / 5) * 2, 1 * canvas.height / 2, "square", 25, SetupLevelCrater);
	RD.AddButton("Mountain", (canvas.width / 5) * 3, 1 * canvas.height / 2, "square", 25, SetupLevelMountain);
	RD.AddButton("Terminal", (canvas.width / 5) * 4, 1 * canvas.height / 2, "square", 25, SetupLevelTerminal);

	RD.AddButton("Main Menu", canvas.width / 2, 4 * canvas.height / 5, "square", 40, SetupMainMenu);
}

function SetupSettingsScreen() {
	inMainMenu = false;
	inSettingsScreen = true;

	RD.ClearButtonList();

	RD.AddButton(">", (canvas.width / 2) + 60, 2 * canvas.height / 5, "square", 20, AddGoal);
	RD.AddButton("<", (canvas.width / 2) - 60, 2 * canvas.height / 5, "square", 20, SubtractGoal);

	RD.AddButton("Main Menu", canvas.width / 2, 4 * canvas.height / 5, "square", 50, SetupMainMenu);

}

function SetupP1Wins() {
	inP1Wins = true;

	RD.ClearButtonList();

	RD.AddButton("Main Menu", canvas.width / 2, 4 * canvas.height / 5, "square", 50, SetupMainMenu);
}

function SetupP2Wins() {
	inP2Wins = true;

	RD.ClearButtonList();

	RD.AddButton("Main Menu", canvas.width / 2, 4 * canvas.height / 5, "square", 50, SetupMainMenu);
}

function StartGame () {
	inMainMenu = false;
	inSettingsScreen = false;
	inStageSelect = false;
	inGame = true;

	RD.ClearButtonList();

	player1Score = 0;
	player2Score = 0;

	if (currentBG == 2)
	{
		currentBG = 0;
	}
	else
	{
		currentBG++;
	}

	//STAGE_WIDTH = 1500;

	player1Entity.enemyEntity = player2Entity;
	player2Entity.enemyEntity = player1Entity;
	player1Entity.ballTarget = ballEntity;
	player2Entity.ballTarget = ballEntity;

	player1Entity.ResetSelf();
	player2Entity.ResetSelf();
	ballEntity.ResetSelf();

	player1Entity.x = STAGE_WIDTH / 2 - 250;
	player2Entity.x = STAGE_WIDTH / 2 + 250;

	player1Entity.y = 460;
	player2Entity.y = 460;

	player1Entity.direction = "right";
	player2Entity.direction = "left";

	roundOverTimer  = 0;
	roundOver = false;

	roundStarting = true;

	player1Entity.controllable = false;
	player2Entity.controllable = false;

	roundTimer = 0;
	RD.AddManyGrassPieces(STAGE_WIDTH / 5);
	RD.AddManyDirtPieces(STAGE_WIDTH / 5);

	GM.PlaySong("Challenge.ogg");
}

function StartTutorial() {
	inMainMenu = false;
	inTutorial = true;

	tutorialStateP1 = 0;
	tutorialStateP2 = 0;
	startTutorial = true;

	player1Entity.enemyEntity = tut1Entity;
	player2Entity.enemyEntity = tut2Entity;
	player1Entity.ballTarget = tut1Ball;
	player2Entity.ballTarget = tut2Ball;
	tut1Entity.ballTarget = tut1Ball;
	tut2Entity.ballTarget = tut2Ball;

	player1TutMesg = ["Welcome to Score Conflict!"];
	player2TutMesg = ["Welcome to Score Conflict!"];

	player1Entity.x = 100;
	tut1Entity.x = 200;
	tut1Ball.x = 225;

	player2Entity.x = 800;
	tut2Entity.x = 700;
	tut2Ball.x = 675;

	STAGE_WIDTH = 900;
	groundShape = new GroundShape([
		{x:0, y:450},
		{x:1800, y:450}
	]);

	RD.ClearButtonList();

	if (!ARCADE_MODE)
	{
		RD.AddButton("Main Menu", canvas.width / 2, 30, "square", 20, SetupMainMenu);
	}

	RD.AddManyGrassPieces(STAGE_WIDTH / 5);
	RD.AddManyDirtPieces(STAGE_WIDTH / 5);

	GM.PlaySong("Magnet.ogg");

	roundTimer = 50;
	roundstartingTimer = 0;
	roundStarting = false;
	roundOverTimer  = 0;
	roundOver = false;
	player1Entity.controllable = true;
	player2Entity.controllable = true;
	player1Entity.ResetSelf();
	player2Entity.ResetSelf();
}

function AddGoal() {
	if (goalsToWin < 500)
	{
		goalsToWin++;
	}
}

function SubtractGoal() {
	if (goalsToWin > 1)
	{
		goalsToWin--;
	}
}
