var app = angular.module('myapp', ['UserValidation']);

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }









    }
})



app.factory("Users", ["$http", function ($http) {
    return {
        get: function (id) {
            return $http.get("/api/user/" + id);
        },
        create: function (todoData) {
            return $http.post("/api/user", userData);//trả về 1 promise 
        },
        update: function (userData) {
            return $http.put("/api/user", userData);
        },
        delete: function (id) {
            return $http.delete("/api/user/" + id);
        }
    }
}]);
app.controller("validateCtrl", ['$scope', '$http', function ($scope, $http) {
    $scope._id = document.getElementById("_id").innerHTML;
    $scope.message= "";
    $scope.userdata = [];
    $scope.user = $http.get("/api/user/" + $scope._id).then(function (res) {
        $scope.userdata = {
            _id: res.data._id,
            firstname: res.data.local.firstname,
            lastname: res.data.local.lastname,
            email: res.data.local.email,
            password: ""
        };
        

    });


    $scope.updateUser = function (user) {
        $http.put("/api/user", user).then(
            function (err) { console.log(err) },
            function (res) { console.log(res) }

        );

        $scope.message = "Update information successfully";
    }

    $scope.getUser = function (id) {
        return $http.get("/api/user/" + id);
    }
}]);