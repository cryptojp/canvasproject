const Canvas = require('canvas');
const d3 = require("d3");
const fs = require("fs");
const request = require("request");
const asyncNode = require('async');
const server = require('http').createServer(handler),
    port = process.env.PORT || 6969,
    ip = process.env.IP || "0.0.0.0";


var fsym = process.argv[0];
var tsym = process.argv[1];

server.listen(port, ip, function(err, res) {
    if (err) { console.log(err) }
    console.log('Listening to port: ' + port + ' and IP: ' + ip);
});
var timeout = 4000;


function handler(req, res) {
    console.log('request start');
    res.writeHead(200);

    getHistoData("BTC", "USD", function(chartPoints) {
        var canvas = drawCanvas(chartPoints);
        res.end(canvas.toBuffer());
    });
}

var drawCanvas = function(chartPoints) {
    var canvas = new Canvas(150, 30);
    var margin = { top: 0, right: 10, bottom: 5, left: 10 }
    var ctx = canvas.getContext('2d');
    var high = chartPoints.high;
    var low = chartPoints.low;
    var close = chartPoints.close;
    var open = chartPoints.open;
    var color = "rgb(200, 200, 200)";
    var textColor = "rgb(100,100,100)";
    
    
    
    
    /*

    var xScale = d3.scaleLinear()
        .range([10, 140])
        .domain([low, high]);

    var yScale = d3.scaleLinear()
        .range([(canvas.height) / 2, (canvas.height) / 2])
        .domain([open, close])

    var lineGenerator = d3.line()
        .x(function(d) {
            return xScale(d.close);
        })
        .y(function(d) {
            return yScale(d);
        })
        .context(ctx);

    var candleLine = function() {
        ctx.beginPath();
        lineGenerator(chartPoints);
        ctx.lineWidth = "1.5";
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }
    /*
        ctx.moveTo(50, (canvas.height) / 2);
        ctx.lineTo(120, (canvas.height) / 2);

    // Canvas
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grey Line
    ctx.beginPath();
    ctx.moveTo(10, (canvas.height) / 2);
    ctx.lineTo(140, (canvas.height) / 2);
    ctx.lineWidth = "1";
    ctx.strokeStyle = color;
    ctx.stroke();

    // Grey text
    ctx.textAlign = "left";
    ctx.fillStyle = textColor;
    ctx.textBaseline = "top";
    ctx.font = "bold 7px sans-serif";
    ctx.fillText(low, 10, 20);

    ctx.textAlign = "right";
    ctx.fillStyle = textColor;
    ctx.textBaseline = "top";
    ctx.font = "bold 7px sans-serif";
    ctx.fillText(high, 140, 20);
    
    candleLine();*/

    return canvas;
};


var getHistoData = function(fsym, tsym, callback) {
    var chartPoints;
    var url = "https://min-api.cryptocompare.com/data/histoday?fsym=" + fsym + "&tsym=" + tsym + "&limit=1&&e=CCCAGG";

    request({
        url: url,
        timeout: timeout
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var parsedResponse = JSON.parse(body);
            }
            catch (e) {
                console.log('error getting cryptodata:' + e + 'for url: ' + url);
            }
            callback(parsedResponse.Data[0]);
        }
    });
};