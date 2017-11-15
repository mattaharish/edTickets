myApp.controller('SingleTicket', ['$routeParams', '$route', '$location', 'TicketService', function ($routeParams, $route, $location, TicketService) {

    console.log($routeParams.ticketId);
    var main = this;

    this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    this.token = JSON.parse(localStorage.getItem('currentUser')).token;

    console.log("-----" + this.username);

    this.ticketId = $routeParams.ticketId;
    TicketService.getSingleTicket({
        ticketId: main.ticketId,
        token: main.token
    }).then(function successCallback(response) {
        console.log(response);
        main.ticket = response.data.data;
        main.email = response.data.data.email;
    }, function errorCallback(response) {
        console.log(response);
    }); // Get the Ticket Details

    this.changeStatus = function (id) {
        //console.log(data);
        var data = {
            id: id,
            email: main.email,
            token: main.token
        };
        console.log(data);
        TicketService.changeStatus(data).then(function successCallback(response) {
            alert(response.data.message);
            $location.path('/dashboard');
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    }; // Function to change the status of Ticket

    this.deleteTicket = function (data) {
        TicketService.deleteTicket({
            id: data,
            token: main.token
        }).then(function successCallback(response) {
            console.log(response);
            alert(response.data.message);
            $location.path('/dashboard');
        }, function errorCallback(response) {

        });
    }; // Function to delete a ticket

    this.checkAdmin = function (id) {
        if (JSON.parse(localStorage.getItem('currentUser')).username == "admin@edTickets.com") {
            main.adminMessage(id);
        } else {
            main.sendMessage(id);
        }
    } // Function to check whether Logged In user is admin or user

    this.sendMessage = function (id) {
        var data = {
            message: main.message,
            id: id,
            token: main.token
        };
        console.log(data);

        TicketService.sendMessage(data).then(function successCallback(response) {
            console.log(response);
            $route.reload();
        }, function errorCallback(response) {
            console.log(response);
        });
    }; // Function call when admin sends a message

    this.adminMessage = function (id) {
        var data = {
            message: main.message,
            id: id,
            username: main.email,
            token: main.token
        };
        console.log(main.email);

        TicketService.adminMessage(data).then(function successCallback(response) {
            console.log("mmm->");
            console.log(response);
            //$location.path('/ticketView/'+id);
            $route.reload();
        }, function errorCallback(response) {
            console.log(response);
        });
    }; // Function call when admin sends a message

}]);