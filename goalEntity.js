//goalEntity.js

function GoalEntity (top, bottom) {
	this.top = top;
	this.bottom = bottom;

	this.CheckGoal = function (inY) {
		var y = inY;
		if (ARCADE_MODE)
		{
			y = inY + ARCADE_Y_ADJUST;
		}
		if (y > top && y < bottom)
		{
			return true;
		}
		return false;
	}
	this.CheckPost = function (inY) {
		var y = inY;
		if (ARCADE_MODE)
		{
			y = inY + ARCADE_Y_ADJUST;
		}
		if (y < top && y > top - (2 * PIXEL_SIZE))
		{
			return true;
		}
		if (y > bottom && y < bottom + (2 * PIXEL_SIZE))
		{
			return true;
		}
		return false;
	}
}