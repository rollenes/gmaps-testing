var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8011);

function handler (req, res) {

    console.log(req.url);

    var fileToLoad = (req.url == '/airplane.gif') ? '/airplane.gif' : '/simple.html';

    fs.readFile(
        __dirname + fileToLoad,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end(err);
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}

function airplane() {
    var id = Math.random();
    var lat = 50;
    var lng = 19;

    this.move = function() {

        var latChange = Math.random() / 400;
        var lngChange = Math.random() / 400;

        if (Math.random() > 0.5) {
            latChange *= -1;
        }

        if (Math.random() > 0.5) {
            lngChange *= -1;
        }

        setInterval(function(){
            lat += latChange;
            lng += lngChange;

        }, 500);
    };

    this.getId = function() {
        return id;
    };

    this.getPosition = function() {
        return {lat: lat, lng: lng};
    };
};

function airplanes() {
    var airplanes = [];

    this.add = function(airplane) {
        airplanes.push(airplane);
        airplane.move();
    }

    this.getAll = function(){
        return airplanes;
    }
}

var airplanes = new airplanes();

io.on('connection', function (socket) {

    var a = new airplane();

    setInterval(function(){
        var all = {};

        airplanes.getAll().forEach(function(air){
            all[air.getId()] = air.getPosition();
        });

        socket.emit('all', all);
    }, 1000);

    airplanes.add(a);
});