myApp.service('TicketService', function ($http) {

    var main = this;
    //var token = JSON.parse(localStorage.getItem('currentUser')).token;
    //console.log(token);

    this.baseURL = "http://localhost:3000/";

    this.getUserTickets = function (token) {
        return $http.get(main.baseURL + 'user/tickets', {
            headers: {
                'x-access-token': token
            }
        });
    };

    this.getSingleTicket = function (data) {
        return $http.get(main.baseURL + 'user/ticket/' + data.ticketId, {
            headers: {
                'x-access-token': data.token
            }
        });
    };

    this.addTicket = function (data) {

        return $http.post(main.baseURL + 'user/create', data, {
            headers: {
                'x-access-token': data.token
            }
        });
    };

    this.changeStatus = function (data) {
        console.log(data);
        var email = {
            email: data.email
        };
        return $http.post(main.baseURL + 'user/ticket/statuschange/' + data.id, email,{
            headers: {
                'x-access-token': data.token
            }
        });
    };

    this.deleteTicket = function (data) {
        return $http.delete(main.baseURL + 'user/deleteticket/' + data.id, {
            headers: {
                'x-access-token': data.token
            }
        });
    };

    this.sendMessage = function (data) {
        var message = {
            message: data.message
        };

        return $http.post(main.baseURL + 'user/message/' + data.id, message, {
            headers: {
                'x-access-token': data.token
            }
        });
    };

    this.allTickets = function (token) {
        return $http.get(main.baseURL + 'user/admin/tickets', {
            headers: {
                'x-access-token': token
            }
        });
    };

    this.adminMessage = function (data) {
        var message = {
            message: data.message,
            username: data.username
        };

        return $http.post(main.baseURL + 'user/admin/message/' + data.id, message, {
            headers: {
                'x-access-token': data.token
            }
        });
    };

});