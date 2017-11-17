var chart = require("ccc-spark-chart.js");
var common = require("ccc-static.js");
var request = require("request");
var asyncNode = require("async");
var jimp = require("jimp");
var fs = require("fs");
var coinList = ['BTC', 'ETH', 'XMR', 'TAGR', 'LTC'];
var interval = process.argv[2] * 60000;
var chartPoints;
var canvasWidth = 120;
var canvasHeight = 35;
var canvasBackgroundColor = "white";
var canvasLineColor = "red";

if (process.argv.length < 3) {
    console.log('Enter how frequently the charts should be drawn (in minutes)');
    return;
}

var drawChart = function() {
    asyncNode.eachSeries(coinList, function(coin, addedCoin) {
        var url = "https://min-api.cryptocompare.com/data/histominute?fsym=" + coin + "&tsym=USD&limit=240&&e=CCCAGG";
        request({
            url: url
            
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Fetching Data');
                var data = JSON.parse(body);
                chartPoints = data.Data;
                chart.drawChart(coin, 'USD', chartPoints, canvasWidth, canvasHeight, canvasBackgroundColor, canvasLineColor, function(canvas) {

                    chart.saveToFile(coin, jimp, canvas, function(err) {
                        if (err) {
                            console.log('Could not save to file' + err);
                        }
                        else {
                            console.log('Successfully saved spark chart for ' + coin);
                            addedCoin();
                        }
                    });
                });
            }
        });
    }, function(err) {
        if (err) {
            console.log('Error performming async loop - ' + err);
        }
    });
};

setInterval(drawChart, interval);

