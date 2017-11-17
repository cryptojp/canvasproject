angular.module('coin-list', [])
.controller("coinController", ['$http', '$scope', function($http, $scope) {
    $scope.charts = [
        { "pair": "BTC-USD", "price": 7000, "change": 300, "pctChange": 3.0 },
        { "pair": "ETH-USD", "price": 300, "change": 3, "pctChange": 3.0 },
        { "pair": "DASH-USD", "price": 300, "change": -20, "pctChange": -5.0 },
        { "pair": "ZEC-USD", "price": 250, "change": 30, "pctChange": 14.0 }
    ];
    
    
    
    $scope.imgUrl = "data:image/png;base64,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";

}]);

