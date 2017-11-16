myApp.controller('AddTicket', ['$location', 'TicketService', '$rootScope', 'Upload', function ($location, TicketService, $rootScope, Upload) {

    var main = this;

    main.token = JSON.parse(localStorage.getItem('currentUser')).token;

    main.addTicket = function () {
        main.checkFile();
    };

    main.checkFile = function () {
        if (main.file) {
            main.upload(main.file);
        } else {
            main.add();
        }
    };

    main.add = function () {

        var data = {
            title: main.title,
            description: main.description,
            filename: main.filename,
            token: main.token
        };
        TicketService.addTicket(data).then(function successCallback(response) {
            console.log(response);
            alert(response.data.message);
            $location.path('/dashboard');
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/user/upload',
            data: {
                file: file
            }
        }).then(function (response) {
            console.log(response);
            main.filename = response.data.data;
            main.add();
        }, function (response) {
            console.log(response);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            main.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

}]);
