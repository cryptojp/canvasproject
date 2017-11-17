var Canvas = require('canvas');
var spark = require('ccc-spark-chart.js');
var d3 = require("d3");
var request = require("request");
var asyncNode = require("async");
var app = require('http').createServer(handler),
	port = process.env.PORT || 6969,
	ip = process.env.IP || "0.0.0.0";

app.listen(port, ip, function(err, res) {
	if (err) {
		console.log('Could not create server - ' + err);
	}
	console.log('Listening to port: ' + port + ' and IP: ' + ip);
});

var getHistoData = function(fsym, tsym, callback) {
	var url = "https://min-api.cryptocompare.com/data/histominute?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym=" + fsym + "&limit=1440&tryConversion=false&tsym=" + tsym + "&apiKey=06wizdV5zS0deMVQSIzXX";
	request({
		url: url
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var parsedResponse = JSON.parse(body);
			}
			catch (e) {
				console.log('error getting cryptodata' + e + ' url ' + url);
			}
			callback(parsedResponse.Data);
		}
	});
};

function handler(req, res) {
	var fsym = process.argv[2];
	var tsym = process.argv[3];
	console.log('Creating a chart for: ' + fsym + '-' + tsym);

	var chartPoints = [];
	asyncNode.series([
		function(histoCallDone) {
			getHistoData(fsym, tsym, function(data) {
				chartPoints = data;
				histoCallDone();
			});
		}
	], function(err) {
		if (err) {
			console.log("Error performing the function" + err);
		}
		var canvas = spark.drawChart(fsym, tsym, chartPoints, 240, 70, 'white', 'red');
		res.writeHead(200, {
			'Content-Type': 'image/png'
		});
		console.log((canvas.toBuffer()));
		console.log(canvas.toDataURL());
		res.end(canvas.toBuffer());
	});
}