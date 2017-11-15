myApp.controller('userCtrl', ['$location', '$rootScope', 'AccountService', 'jwtHelper', function ($location, $rootScope, AccountService, jwtHelper) {

    var main = this;

    this.loginMessage = "Login To Your Account";
    this.registerMessage = "Create An Account";
    this.changedPassword = "Enter New Password";
    this.uniqueMessage = "Enter Unique String";
    this.error = "";
    this.firstname = "";
    this.lastname = "";
    this.email = "";
    this.mobile = "";
    this.password = "";
    this.response = "";
    this.registerForm = "";
    this.otp = "";
    this.check = "";
    this.newPassword = "";
    this.newPassword1 = "";
    $rootScope.show = false;
    this.closeButton = "";

    this.register = function () {

        console.log(main.email);

        var data = {
            firstname: main.firstname,
            lastname: main.lastname,
            email: main.email,
            mobile: main.mobile,
            password: main.password
        };

        AccountService.register(data).then(function successCallback(response) {
            console.log(response.data.error);
            console.log(response.data.message);
            main.error = response.data.error;
            main.registerMessage = response.data.message;

        }, function errorCallback(response) {
            alert("Some error Occured");
        });
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.mobile = "";
        this.password = "";

    }; // end register module

    this.login = function () {
        var temp = main.email;
        var data = {
            email: main.email,
            password: main.password
        };

        AccountService.login(data).then(function successCallback(response) {
                main.error = response.data.error;
                console.log(response.data);
                main.loginMessage = response.data.message;
                if (response.data.error) {
                    console.log("Matta-- Error");
                } else {
                    main.closeButton = response.data.error;
                    $rootScope.show = true;
                    var tkn = {
                        username: temp,
                        token: response.data.token
                    };
                    console.log(tkn);
                    var userinfo = jwtHelper.decodeToken(response.data.token);
                    console.log("mmmmmmmm--");
                    console.log(userinfo);
                    localStorage.setItem('username', userinfo.firstname + ' ' + userinfo.lastname);
                    localStorage.setItem('currentUser', JSON.stringify(tkn));
                    $location.path('/dashboard');
                    //console.log("Entered-->");
                }
                //console.log(response);
            },
            function errorCallback(response) {
                alert("Some Error Occured!!");
            });

        this.email = "";
        this.password = "";

    }; // end Login Module

    this.lostPassword = function () {
        console.log(main.email);
        var data = {
            email: main.email
        };

        AccountService.forgotPassword(data).then(function successCallback(response) {
            console.log(response.data);
            main.email = "";
        }, function errorCallback(response) {
            console.log(data);
        });

    }; //forgot password mail intake

    this.verifyUnique = function () {
        var otp = main.otp;
        AccountService.verifyUnique(otp).then(function successCallback(response) {
            console.log(response.data);
            main.check = response.data.error;
            console.log(main.check);
            main.uniqueMessage = response.data.message;
            main.otp = "";
        }, function errorCallback(response) {
            console.log(response.data);
        });
        //main.otp = "";
    }; //OTP verification

    this.resetPassword = function () {
        if (this.newPassword != this.newPassword1) {
            console.log(main.newPassword);
            console.log(main.newPassword1);
            alert("Password Didn't Macth!");
            main.newPassword = "";
            main.newPassword1 = "";
        } else {
            var data = {
                password: main.newPassword
            };
            AccountService.resetPassword(data).then(function successCallback(response) {
                console.log(response);
                main.changedPassword = response.data.message;
                main.newPassword = "";
                main.newPassword1 = "";
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    }; // Reset Password Function

    this.logout = function () {
        alert("You are now Logged Out");
        localStorage.removeItem('currentUser');
        console.log(localStorage.getItem('currentUser'));
        localStorage.removeItem('username');
        $rootScope.show = false;
        $location.path('/');
    }; // Logout clearing Local Storage

}]); // end controller