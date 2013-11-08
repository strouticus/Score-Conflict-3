//groundShape.js

/*function GroundPart (x, y) {
	this.x = x;
	this.y = y;
}*/

function GroundShape (partArray) {
	this.partArray = partArray;
	

	this.SortPartArray = function () {
		this.partArray.sort(function (a, b) {
			if (a.x > b.x)
				return 1;
			if (a.x < b.x)
				return -1;
			return 0;
		});
	}
	
	this.SortPartArray();

	this.AddPart = function (newX, newY) {
		this.partArray.push({x: newX, y: newY});
		this.SortPartArray();
	}

	this.GetHeightAtX = function (checkX) {
		for (var i = 0; i < this.partArray.length; i++)
		{
			if (this.partArray[i].x > checkX)
			{
				if (i > 0)
				{
					var dist = this.partArray[i].x - this.partArray[i - 1].x;
					var distToPrev = checkX - this.partArray[i - 1].x;
					var distToNext = dist - distToPrev;
					return this.partArray[i - 1].y * (distToNext / dist) + this.partArray[i].y * (distToPrev / dist);
				}
				else
				{
					return this.partArray[i].y;
				}
			}
		}
		return this.partArray[this.partArray.length - 1].y;
	}

	this.GetSlopeAtX = function (checkX) {
		for (var i = 0; i < this.partArray.length; i++)
		{
			if (this.partArray[i].x > checkX)
			{
				if (i > 0)
				{
					return (this.partArray[i].y - this.partArray[i - 1].y) / (this.partArray[i].x - this.partArray[i - 1].x);
				}
				else
				{
					return 0;
				}
			}
		}
		return 0;
	}
}