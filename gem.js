var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
serv.listen(2000);

var sockjs = require('sockjs');
io = sockjs.createServer();
io.installHandlers(serv, {prefix:'/io'});

require('./server/js/db');
require('./server/js/tables');
require('./server/js/calc');

DB = load_db();
new_phrases = false;
//import_wordlist('words_alpha.txt');
SOCKET_LIST = {};

io.on('connection', function(socket){
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;
  console.log('Socket connected: ' + socket.id);
  if(new_phrases){
    socket.write(JSON.stringify({msg:'save_reminder'}));
  }

  socket.on('disconnect', function(reason){
    save_file();
    delete SOCKET_LIST[socket.id];
    console.log('Socket disconnected: ' + socket.id + ' (' + reason + ')');
  })

  socket.on('data',function(string){
    var data = JSON.parse(string);
    if(data.msg == 'phrase'){
      if(isNumber(data.phrase)){
        var list = search_db(Number(data.phrase));
        for(var i in list){
          var res = calculate(list[i]);
          socket.write(JSON.stringify({msg:'res',res:res}))
        }
      } else {
        var res = calculate(data.phrase);
        if(check_db(data.phrase)){
          socket.write(JSON.stringify({msg:'res',res:res}));
        } else {
          socket.write(JSON.stringify({msg:'calc',res:res}));
        }
      }
    } else if(data.msg == 'save'){
      save_to_db(data.phrase);
      socket.write(JSON.stringify({msg:'saved',phrase:data.phrase}));
      if(new_phrases){
        socket.write(JSON.stringify({msg:'save_reminder'}));
      }
    } else if(data.msg == 'save_file'){
      save_file();
      new_phrases = false;
      socket.write(JSON.stringify({msg:'file_saved'}));
    } else if(data.msg == 'random'){
      var random = get_random();
      if(random){
        var res = calculate(random);
        socket.write(JSON.stringify({msg:'res',res:res}));
      }
    }
  })
});
