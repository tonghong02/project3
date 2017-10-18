var app = angular.module('restapp', ['UserValidation']);

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.restForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
})



app.factory("Rests", ["$http", function ($http) {
    return {
        get: function (id) {
            return $http.get("/api/rest/" + id);
        },
        create: function (todoData) {
            return $http.post("/api/rest/", restData);
        },
        update: function (restData) {
            return $http.put("/api/rest/", restData);
        },
        delete: function (id) {
            return $http.delete("/api/rest/" + id);
        }
    }
}]);
app.controller("validateCtrl", ['$scope', '$http', function ($scope, $http) {
    $scope._id = document.getElementById("_id").innerHTML;
    $scope.message= "";
    $scope.restdata = [];
    $scope.rest = $http.get("/api/rest/" + $scope._id).then(function (res) {
        $scope.restdata = {
            _id: res.data._id,
            name: res.data.local.name,
            phone: res.data.local.phone,
            email: res.data.local.email,
            password: ""
        };
        

    });


    $scope.updateRest = function (rest) {
        $http.put("/api/rest/", rest).then(
            function (err) { console.log(err) },
            function (res) { console.log(res) }

        );

        $scope.message = "Update information successfully";
    }

    $scope.getRest = function (id) {
        return $http.get("/api/rest/" + id);
    }
}]);