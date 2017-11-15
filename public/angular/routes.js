myApp.config(['$routeProvider', '$locationProvider', 'jwtInterceptorProvider', function ($routeProvider, $locationProvider, $rootScope, jwtInterceptorProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/landing-page.html'
        })
        .when('/dashboard', {
            templateUrl: '/views/Dashboard.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    if (localStorage.getItem('currentUser')) {

                        var token = JSON.parse(localStorage.getItem('currentUser')).token;

                        if (jwtHelper.isTokenExpired(token)) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {

                            $rootScope.show = true;
                            //$location.path('/dashboard');
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            },
            controller: 'mainCtrl',
            controllerAs: 'main'
        })
        .when('/ticketView/:ticketId', {
            templateUrl: '/views/Ticket_Single_View.html',
            controller: 'SingleTicket',
            controllerAs: 'single',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    if (localStorage.getItem('currentUser')) {

                        var token = JSON.parse(localStorage.getItem('currentUser')).token;

                        if (jwtHelper.isTokenExpired(token)) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {

                            $rootScope.show = true;
                            //$location.path('/ticketView/:ticketId');
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            }
        })
        .when('/addTicket', {
            templateUrl: '/views/Add_Query.html',
            controller: 'AddTicket',
            controllerAs: 'add',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    if (localStorage.getItem('currentUser')) {

                        var token = JSON.parse(localStorage.getItem('currentUser')).token;

                        if (jwtHelper.isTokenExpired(token)) {
                            alert("Token Expired :(");
                            $location.path('/');
                            $rootScope.show = false;
                        } else {

                            $rootScope.show = true;
                            //$location.path('/ticketView/:ticketId');
                        }

                    } else {
                        $location.path('/');
                        $rootScope.show = false;
                    }
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

}]);