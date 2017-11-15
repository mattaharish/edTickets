myApp.service('AccountService', function ($http) {

    var main = this;
    this.baseUrl = "http://localhost:3000";

    this.register = function (data) {

        return $http.post(main.baseUrl + '/register', data);

    }; // end registering user account

    this.login = function (data) {

        return $http.post(main.baseUrl + '/login', data);

    }; //end Login to Account

    this.forgotPassword = function (data) {

        return $http.post(main.baseUrl + '/forgot-password', data);

    }; //end forgot password email intake

    this.verifyUnique = function (data) {

        return $http.get(main.baseUrl + '/verify-unique', {
            params: {
                otp: data
            }
        });
    }; //end verifying unique id

    this.resetPassword = function (data) {

        return $http.post(main.baseUrl + '/reset-password', data);

    }; //end of reset-password

}); //end account service