var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(80);

io.set('log level', 1);

//console.log("0");

function handler (req, res) {
  //console.log("1");
  //console.log(req.url);
  //fs.readFile(__dirname + '/index.html',
  //if (req.url == "/favicon.ico")
  if (req.url == "/") req.url = "/index.html";
  fs.readFile(__dirname + "/public" + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  //socket.on('my other event', function (data) {
  //  console.log(data);
  //});
  socket.on('position', function (data) {
    updatePlayer(data);
    //console.log("2");
    //socket.broadcast.emit('position', playerList);
    socket.emit('update', playerList);
  })
  //setInterval(socket.emit, 1000/60, 'update', playerList);
});



var playerList = [];

function Player (id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

function updatePlayer (player) {
  for (var i = 0; i < playerList.length; i++)
  {
    if (playerList[i].id == player.id)
    {
      playerList[i] = player;
      return;
    }
  }
  playerList.push(player);
}