//render.js
//everything having to do with rendering

var ff = 0;
var rr = 0;

//Render constructor, takes imageLoader reference
function Render (IL) {
	this.RenderFrame = function () {
		this.Clear();
		this.DrawBackground();
		//ctx.drawImage(IL.GetFilteredImage("megaman.png", 0), 0, 0);
		//ctx.drawImage(IL.GetFilteredImage("final_fantasy.png", 0), 0, 100);

		this.DrawPlayer(player1Sprite);
		this.DrawPlayer(player2Sprite);
		this.Cursor();
	}

	this.DrawPlayer = function (playerSprite) {
		ctx.drawImage(IL.GetFilteredImage(playerSprite.GetImage(), playerSprite.GetFilter()), 24 * playerSprite.GetFrame(), 0, 24, 24, mouseX, mouseY, 24 * 7.5, 24 * 7.5);
		playerSprite.Tick();
	}

	this.DrawBackground = function () {
		ctx.drawImage(IL.GetBackgroundImage("illegal_sky.png"), 0, 0);
	}

	this.Clear = function () {
		//canvas.width = canvas.width;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.Cursor = function () {
		if (!cursorVisible)
		{
			ctx.save();
			ctx.translate(mouseX, mouseY);
			ctx.rotate(rr);

			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(0, 0 - 7);
			ctx.lineTo(7, 0);
			ctx.lineTo(0, 7);
			ctx.lineTo(- 7, 0);
			ctx.lineTo(0, - 7);

			ctx.moveTo(0, - ff);
			ctx.lineTo(ff, 0);
			ctx.lineTo(0, ff);
			ctx.lineTo(- ff, 0);
			ctx.lineTo(0, - ff);

			ctx.stroke();
			
			ctx.restore();
			ff -= 0.2;
			if (ff <= -6)
			{
				ff = 6;
				//return;
			}
			rr += 0.1;
		}
	}
}