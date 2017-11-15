myApp.controller('mainCtrl', ['$location', '$rootScope', 'TicketService', function ($location, $rootScope, TicketService) {

    var main = this;
    //var user = localStorage.getItem('username');
    this.tickets = '';
    this.status = '';
    this.search = '';

    main.username = JSON.parse(localStorage.getItem('currentUser')).username;
    console.log(main.username);

    main.token = JSON.parse(localStorage.getItem('currentUser')).token;
    console.log(main.token);

    this.add = function () {
        $location.path('/addTicket');
        //alert("Matta");
    };

    this.open = function () {
        main.status = "open";
    };

    this.close = function () {
        main.status = "close";
    };

    this.all = function () {
        main.status = '';
    };

    this.userTickets = function () {
        TicketService.getUserTickets(main.token).then(function successCallback(response) {
            console.log(response.data.data);
            main.tickets = response.data.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    this.allTickets = function () {
        TicketService.allTickets(main.token).then(function successCallback(response) {
            main.tickets = response.data.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    if (JSON.parse(localStorage.getItem('currentUser')).username == "admin@edTickets.com") {
        main.allTickets();
        main.admin = true;
    } else {
        main.userTickets();
        main.admin = false;
    }

}]);