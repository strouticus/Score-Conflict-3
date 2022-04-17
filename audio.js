//audio.js
//Play songs and effects

var currentSong = "";

//Constructor for GameMusic
function GameMusic (srcArray) {
	this.songArray = [];
	for (var i = 0; i < srcArray.length; i++) {
		var song = new Audio();
		this.songArray.push(song);
		song.src = "Audio/BGM/" + srcArray[i];
		song.pause();
	}
	this.PauseAll = function () {
		for (var i = 0; i < this.songArray.length; i++)
		{
			this.songArray[i].pause();
		}
	}
	this.PlaySong = function (songName, loop) {
		if (songName == currentSong)
		{
			return;
		}
		this.PauseAll();
		var song = this.songArray[srcArray.indexOf(songName)];
		if (song)
		{
			song.currentTime = 0;
			song.play();
			if (!song.loop)
			{
				song.loop = true;
				song.addEventListener('ended', function () {
					this.currentTime = 0;
					this.play();
				}, false);
			}
			currentSong = songName;
		}
		else
		{
			console.log("GameMusic.PlaySong() Error: invalid songName")
		}

	}
}
