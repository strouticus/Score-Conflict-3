//collisions.js

function Collision () {

	this.CheckCollision = function(attacker, defender, isBall) {

		if (Math.abs(attacker.x - defender.x) > 24 * PIXEL_SIZE || Math.abs(attacker.y - defender.y) > 24 * PIXEL_SIZE)
		{
			return 0;
		}

		var attackerFrame = IL.GetHitbox(imageReference[attacker.linkedSprite.currentMode])[attacker.linkedSprite.currentFrame];
		

		//var defenderFrame = IL.GetHurtbox(imageReference[defender.mode])[defender.linkedSprite.currentFrame];
		//var realDistX = (defender.x - attacker.x);
		//var realDistY = (defender.y - attacker.y);

		var realDistX = (attacker.x - defender.x);
		var realDistY = (attacker.y - defender.y);
		
		var pixDistX = Math.floor(realDistX / PIXEL_SIZE);
		var pixDistY = Math.floor(realDistY / PIXEL_SIZE);

		for (var i = 0; i < attackerFrame.length; i++) {
			for (var j = 0; j < attackerFrame[i].length; j++) {
				var hitNum = (attacker.direction == "right") ? (attackerFrame[i][j]) : (attackerFrame[23 - i][j]);
				//if ((attacker.direction == "right" && attackerFrame[i][j] != 0) || (attacker.direction == "left" && attackerFrame[23 - i][j] != 0))
				if (hitNum != 0)
				{
					//console.log(hitNum);
					if (isBall)
					{
						var hit = this.CheckBallXY(i + pixDistX, j + pixDistY, ballEntity);
						if (hit)
						{
							//console.log("walrus punch");
							attacker.hitType = hitNum;
							return hitNum;
						}
					}
					else
					{
						var hit = this.CheckDefenderXY(i + pixDistX, j + pixDistY, defender);
						//testctx.fillStyle = "#FF00FF";
						//testctx.fillRect(attacker.x + (i - 12) * PIXEL_SIZE, attacker.y + (j - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
						if (hit)
						{
							//console.log("walrus punch");
							//testctx.fillStyle = "#00FF00";
							//testctx.fillRect(attacker.x + (i - 12) * PIXEL_SIZE, attacker.y + (j - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
							//console.log(hitNum);
							attacker.collisionX = attacker.x + (i - 12) * PIXEL_SIZE;
							attacker.collisionY = attacker.y + (j - 24) * PIXEL_SIZE + (2 * PIXEL_SIZE);
							attacker.hitType = hitNum;
							return hitNum;
						}
					}
				}
			}
		}
		return 0;
	}

	this.CheckDefenderXY = function(x, y, defender) {
		//testctx.fillStyle = "#00CC00";
		//testctx.fillRect(defender.x + (x - 12) * PIXEL_SIZE, defender.y + (y - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
		if ((x >= 0 && x <= 23) && (y >= 0 && y <= 23))
		{
			var hurtbox = IL.GetHurtbox(imageReference[defender.mode])
			if (hurtbox) {
				var hurtFrame = defender.linkedSprite.currentFrame;
				if (hurtFrame >= hurtbox.length)
				{
					hurtFrame = hurtbox.length - 1;
				}
				var defenderFrame = hurtbox[hurtFrame];
				
				if ((defender.direction == "right" && defenderFrame[x][y] == 1) || (defender.direction == "left" && defenderFrame[23 - x][y] == 1))
				{
					//testctx.fillRect(defender.x + (x - 12) * PIXEL_SIZE, defender.y + (y - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
					return true;
				}
			}
		}
		return false;
	}

	this.CheckBallXY = function(xAt, y, ball) {
		//testctx.fillStyle = "#00FF00";
		var x = xAt;// - 2;
		//testctx.fillRect(ball.x + (x - 12) * PIXEL_SIZE, ball.y + (y - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
		if ((x >= 0 && x <= 23) && (y >= 0 && y <= 23))
		{
			var ballFrame = ball.hurtBox;
			
			if (ballFrame[x][y] == 1)
			{
				//testctx.fillRect(ball.x + (xAt - 12) * PIXEL_SIZE, ball.y + (y - 24) * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
				return true;
			}
		}
		return false;
	}
}