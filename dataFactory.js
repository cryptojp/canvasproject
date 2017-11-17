angular.module('coin-list', [])
.factory('chartUtil', ['$http', function chartUtilFactory($http) {
    var chartData = {};
    chartData.getHistoFromAPI = function(fsym, tsym) {
        var url = "https://min-api.cryptocompare.com/data/histominute?fsym=" + fsym + "&tsym=" + tsym + "&limit=1440&&e=CCCAGG";
        return $http.get(url);
    };
    return chartData;
}]);