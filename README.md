# edTickets, A Ticket based Support System
https://glacial-hamlet-67352.herokuapp.com

## Assumption

* Please signup with email as '**admin@edTickets.com**' to get the admin access of this system.

## Project Description

```
Support is an essential feature for any platform, and dedicated support is best approach in case you are 
really concerned about the user experience of your platform. The Aim of the project is to create an 
online ticket based support system, just like the one present on edwisor.com which should be usable by 
any kind of platform to get support queries from their users and resolve them.
```

## Features

	1) Login

	2) Signup
        ~ A welcome mail is sent on successful signup.
        ~ Password is encrypted with 'bcrypt' module.

	3) Ticket Raising panel - User facing 
		~ A view to create a ticket.
		~ A view to display all queries raised by the user with filter options like to display only open queries/ close queries/ all queries.
        ~ Search functionality is enabled in dashboard view. 
		~ A view to show the details of a particular query.
		~ This view contains file download feature and one can download the files attached by the user.
		~ A Chat box that establishes a direct communication between admin and user.
		~ This view has the option to set the status of the ticket to "close", "delete" option is also present in this view. 

	4) Ticket Resolution panel - Admin facing
		~ A view to display tickets by all users with their name and status of the ticket. There are buttons to filter through the status of ticket and search functionality is enabled in this view.
		~ A view to show the details of a particular query.
		~ This view contains file download feature and one can download the files attached by the user.
		~ A Chat box that establishes a direct communication between admin and user.
		~ This view has the option to set the status of the ticket to ‘open’ or ‘closed’ depending on whether the query is resolved or not.

	5) Additional Features
        ~ A welcome mail is sent on successful signup.
		~ When the status of ticket is altered an email noticaion is sent to both admon and user.
		~ When the person receives a message or the admin receives the reply, an email notification is sent to that particular user.
		~ For the sake of simplicity, treated the Admin as a user of the system. No special backend for admin.
        ~ Uploading file feature

	6) Security
		~ Secured with JWT.
		~ Default JWT expiry time is set to 30 minutes.

	7) Single page application.

    8) Forgot password.
        ~ An OTP string is sent to email to reset password

## Extra features

	1) File Upload functionality using ng-file-upload (frontend) and multer (backend)
	2) File Download functionality.
    3) Reset password with an OTP string. 


### Prerequisites

	1) Nodejs
	2) Mongodb
	3) NPM

### Installing

Setting up the local server

** Note :
    ~ Start mongo server before running the application.
    ~ Update your username and pass for sending emails in "app -> config -> config.js".

```
1) Unzip the file
2) Open the command prompt in the unzipped folder.
3) Run command npm install
4) Run command : node app.js, in your terminal
5) let the server start
```

Getting started

```
1) Visit http://localhost:3000 on your browser
2) Click on signin at top navbar then choose register account.
3) As you are new user, click on "add question" button in dashboard view to rasie a ticket.
```

## How to use

```
User facing :
	1) Create an account and login with correct credentials.
	2) After logging in, user will be able to view all the tickets he has created.
	3) User can filter tickets based on which are open or closed also search for ticket.
	4) While creating a ticket an user can upload any file upto 20 MB that best describes his query. 
	5) Clicking on a particular ticket, it will open the query view which shows the complete query details.
	6) Users can download the file uploaded by him, at the time of query creation.
	7) User will be able to reply to messages and send message using chatbox.
	8) User can reset password securely if he forgets it.

Admin facing :
	1) Admin must signup with email "admin@edTickets.com"
	2) After logging in, admin will be able to view all the tickets that has been created on the support system.
	3) Admin can filter tickets based on which are open or closed also search for ticket. 
	4) Clicking on a particular ticket will open the query view where admin can see details of query.
	5) Admin can download the file uploaded by him, at the time of query creation.
	6) Admin will be able to reply to the query using chatbox.
	7) Admin can reset password securely if he forgets it.
```

## Built With

* Angular Js
* Node Js
* Postman
* Visual Stuido Code

## Authors

* **Harish Matta** 
