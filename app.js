var url = require('url'),
    express = require('express'),
    fs = require('fs'),
    short = require('short'),
    app = express.createServer(),
    port = process.env.PORT || 8080;
/*    host = process.env.VCAP_APP_HOST || 'localhost',
    domain = "http://"+host; */

var keylength=7;

if(process.env.VCAP_APPLICATION) {
  var vcapapp = JSON.parse(process.env.VCAP_APPLICATION);
  var uri = vcapapp['uris'][0];
}

if(process.env.VCAP_SERVICES){
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var dbcreds = services['mongodb'][0].credentials;
    if(dbcreds){
      short.connect("mongodb://"+dbcreds.username+":"+dbcreds.password+"@"+dbcreds.host+":"+dbcreds.port+"/"+dbcreds.db);
    }
} else {
  short.connect("mongodb://localhost/short");
}

app.get('/api/*', function (req, res) {
  if (req.url === '/favicon.ico') {
    return;
  }
  var URL = req.url.slice(5),
      options = {length: keylength};
  short.generate(URL, options, function (error, shortURL) {
    if (error) {
      console.error(error);
    }
    else {
      var tinyUrl = ["https://",uri, "/", shortURL.hash].join("");
      console.log(["URL is ", shortURL.URL, " ", tinyUrl].join(""));
      res.end(tinyUrl);
    }
  });
});


app.get('/', function(req, res){
  if (req.url === '/favicon.ico') { return; }
    fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
});

app.use(express.static(__dirname + '/static'));

var re = new RegExp("^\/.{"+keylength+"}$");
app.get(re, function (req, res) {
  if (req.url === '/favicon.ico') { return; }
  var visitor = req.connection.remoteAddress,
      hash = req.url.slice(1),
      options = {visitor: visitor};
  short.retrieve(hash, options, function (error, shortURLObject) {
    if (error) {console.error(error);
    } else {
      if (shortURLObject) {
        res.redirect(shortURLObject.URL, 302);
      }
      else {
        res.send('URL not found!', 404);
        res.end();
      }
    }
  });
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});

/* EOF */
