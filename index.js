var express    = require('express');
var cons       = require('consolidate');
var Handlebars = require('handlebars');
var faker      = require('faker');
var _          = require('lodash');
var fs         = require('fs');

var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);


app.engine('hbs', cons.handlebars); 
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var articleView = Handlebars.compile(fs.readFileSync(__dirname+'/views/article.hbs', 'utf8'));

//  ____   ___  _   _ _____ _____ ____
// |  _ \ / _ \| | | |_   _| ____/ ___|
// | |_) | | | | | | | | | |  _| \___ \
// |  _ <| |_| | |_| | | | | |___ ___) |
// |_| \_\\___/ \___/  |_| |_____|____/

app.get('/', function(req, res){
  res.render('home', {
    title: 'Progressive Page Demo'
  });
});


//  ____   ___   ____ _  _______ _____ ____
// / ___| / _ \ / ___| |/ / ____|_   _/ ___|
// \___ \| | | | |   | ' /|  _|   | | \___ \
//  ___) | |_| | |___| . \| |___  | |  ___) |
// |____/ \___/ \____|_|\_\_____| |_| |____/

function startArticleFeed(socket) {
  return setInterval(function(){
    console.log("Sending article");

    var contentObj = {
      heading : faker.lorem.words(),
      body    : faker.lorem.paragraph()
    };

    var articleString = articleView(contentObj);

    socket.emit('article', {
      html : articleString
    });

  }, _.random(750,3000) );
}

io.on('connection', function(socket){
  console.log('Connection Started!');

  var interval = startArticleFeed(socket);
  
  socket.on('disconnect', function(){
    console.log("Disconnect!");
    //Cleanup the interval
    clearInterval(interval);
  });
});


//  ____  _____ ______     _______ ____
// / ___|| ____|  _ \ \   / / ____|  _ \
// \___ \|  _| | |_) \ \ / /|  _| | |_) |
//  ___) | |___|  _ < \ V / | |___|  _ <
// |____/|_____|_| \_\ \_/  |_____|_| \_\

http.listen(3000, function(){
  console.log('listening on *:3000');
});