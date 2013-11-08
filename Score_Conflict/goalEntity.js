//goalEntity.js

function GoalEntity (top, bottom) {
	this.top = top;
	this.bottom = bottom;

	this.CheckGoal = function (y) {
		if (y > top && y < bottom)
		{
			return true;
		}
		return false;
	}
}