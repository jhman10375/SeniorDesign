# Test Plan and Results

This is a page that contains several test cases and the test case matrix for CS+.

## Overall Test Plan

The purpose of this document is to outline our test plan of both the client and server for College Sports Plus. We intend to test components of our clients for both function, input, and appearance to ensure quality of content and undisrupted data input. Our server tests will include stress testing and data manipulation to ensure the server is able to complete tasks and meet the needs of the overall application.

## Test Case Description

| Test #                    | Test ID | Description                                                                                                                                                                               |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="test-id-1"></a>1   | CUL1.1  | Client User Login Test Successful                                                                                                                                                         |
|                           | CUL1.2  | This test will ensure that the client can handle successful login sequence from client and Firebase.                                                                                      |
|                           | CUL1.3  | This test handles a users common login request                                                                                                                                            |
|                           | CUL1.4  | Inputs: Username and password previously established with CSP                                                                                                                             |
|                           | CUL1.5  | Outputs: A successful login and redirect to the home page                                                                                                                                 |
|                           | CUL1.6  | Normal                                                                                                                                                                                    |
|                           | CUL1.7  | Whitebox                                                                                                                                                                                  |
|                           | CUL1.8  | Functional                                                                                                                                                                                |
|                           | CUL1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-2"></a>2   | CUL2.1  | Client User Login Test Unsuccessful                                                                                                                                                       |
|                           | CUL2.2  | This test will ensure that the client can handle login errors from both the client and Firebase.                                                                                          |
|                           | CUL2.3  | This test handles a users common login request                                                                                                                                            |
|                           | CUL2.4  | Inputs: Username and password not previously established with CSP                                                                                                                         |
|                           | CUL2.5  | Outputs: An unsuccessful login and error message displayed                                                                                                                                |
|                           | CUL2.6  | Boundary                                                                                                                                                                                  |
|                           | CUL2.7  | Whitebox                                                                                                                                                                                  |
|                           | CUL2.8  | Functional                                                                                                                                                                                |
|                           | CUL2.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-3"></a>3   | CUR1.1  | Client User Registration Test Unsuccessful                                                                                                                                                |
|                           | CUR1.2  | This test will ensure that the client can handle user registration from both the client and Firebase.                                                                                     |
|                           | CUR1.3  | This test handles a users common registration request                                                                                                                                     |
|                           | CUR1.4  | Inputs: Name, Username, and password not previously established with CSP                                                                                                                  |
|                           | CUR1.5  | Outputs: A successful registration and login redirect                                                                                                                                     |
|                           | CUR1.6  | Normal                                                                                                                                                                                    |
|                           | CUR1.7  | Whitebox                                                                                                                                                                                  |
|                           | CUR1.8  | Functional                                                                                                                                                                                |
|                           | CUR1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-4"></a>4   | CLS1.1  | Client League Search and Join Successful                                                                                                                                                  |
|                           | CLS1.2  | This test will ensure that the client user can successfully find and join a public league.                                                                                                |
|                           | CLS1.3  | This test handles a users common league find and league join request                                                                                                                      |
|                           | CLS1.4  | Inputs: League Name                                                                                                                                                                       |
|                           | CLS1.5  | Outputs: A successful league join from a user                                                                                                                                             |
|                           | CLS1.6  | Normal                                                                                                                                                                                    |
|                           | CLS1.7  | Whitebox                                                                                                                                                                                  |
|                           | CLS1.8  | Functional                                                                                                                                                                                |
|                           | CLS1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-5"></a>5   | CLS2.1  | Client League Search and Join Already Joined Unsuccessful                                                                                                                                 |
|                           | CLS2.2  | This test will ensure that the client user can not rejoin a league already apart of                                                                                                       |
|                           | CLS2.3  | This test handles a users common league find and league join request for a league the user is already apart of                                                                            |
|                           | CLS2.4  | Inputs: League Name                                                                                                                                                                       |
|                           | CLS2.5  | Outputs: An unsuccessful league join from a user                                                                                                                                          |
|                           | CLS2.6  | Normal                                                                                                                                                                                    |
|                           | CLS2.7  | Whitebox                                                                                                                                                                                  |
|                           | CLS2.8  | Functional                                                                                                                                                                                |
|                           | CLS2.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-6"></a>6   | CLS3.1  | Client League Search and Join Private Successful                                                                                                                                          |
|                           | CLS3.2  | This test will ensure that the client user can successfully find and join a private league.                                                                                               |
|                           | CLS3.3  | This test handles a users common league find and league join request for a private league                                                                                                 |
|                           | CLS3.4  | Inputs: League Name, League passcode                                                                                                                                                      |
|                           | CLS3.5  | Outputs: A successful league join from a user                                                                                                                                             |
|                           | CLS3.6  | Normal                                                                                                                                                                                    |
|                           | CLS3.7  | Whitebox                                                                                                                                                                                  |
|                           | CLS3.8  | Functional                                                                                                                                                                                |
|                           | CLS3.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-7"></a>7   | CLS4.1  | Client League Search and Join Private Unsuccessful                                                                                                                                        |
|                           | CLS4.2  | This test will ensure that the client user can not rejoin a league already apart of                                                                                                       |
|                           | CLS4.3  | This test handles a users common league find and league join request for a league the user is already apart of                                                                            |
|                           | CLS4.4  | Inputs: League Name, unregistered League Passcode                                                                                                                                         |
|                           | CLS4.5  | Outputs: An unsuccessful league join from a user                                                                                                                                          |
|                           | CLS4.6  | Boundary                                                                                                                                                                                  |
|                           | CLS4.7  | Whitebox                                                                                                                                                                                  |
|                           | CLS4.8  | Functional                                                                                                                                                                                |
|                           | CLS4.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-8"></a>8   | CLS5.1  | Client League Search League Not Found                                                                                                                                                     |
|                           | CLS5.2  | This test will ensure that the client user receive no results if no league can be found                                                                                                   |
|                           | CLS5.3  | This test handles a users common league find with no results                                                                                                                              |
|                           | CLS5.4  | Inputs: League Name                                                                                                                                                                       |
|                           | CLS5.5  | Outputs: No results                                                                                                                                                                       |
|                           | CLS5.6  | Boundary                                                                                                                                                                                  |
|                           | CLS5.7  | Whitebox                                                                                                                                                                                  |
|                           | CLS5.8  | Functional                                                                                                                                                                                |
|                           | CLS5.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-9"></a>9   | CLC1.1  | Client League Creation Successful                                                                                                                                                         |
|                           | CLC1.2  | This test will ensure that the client user can create a league                                                                                                                            |
|                           | CLC1.3  | This test handles a users common league creation                                                                                                                                          |
|                           | CLC1.4  | Inputs: All necessary league inputs (i.e football requires a minimum of 26 fields)                                                                                                        |
|                           | CLC1.5  | Outputs: A league is successfully created                                                                                                                                                 |
|                           | CLC1.6  | Normal                                                                                                                                                                                    |
|                           | CLC1.7  | Whitebox                                                                                                                                                                                  |
|                           | CLC1.8  | Functional                                                                                                                                                                                |
|                           | CLC1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-10"></a>10 | CLC2.1  | Client League Creation Unsuccessful                                                                                                                                                       |
|                           | CLC2.2  | This test will ensure that the client user can create a league only when inputs are valid and entered entirely (no missed inputs)                                                         |
|                           | CLC2.3  | This test handles a users common league creation                                                                                                                                          |
|                           | CLC2.4  | Inputs: League inputs (i.e football requires a minimum of 26 fields) - some may be missing or invalid                                                                                     |
|                           | CLC2.5  | Outputs: Input specific validation errors displayed                                                                                                                                       |
|                           | CLC2.6  | Boundary                                                                                                                                                                                  |
|                           | CLC2.7  | Whitebox                                                                                                                                                                                  |
|                           | CLC2.8  | Functional                                                                                                                                                                                |
|                           | CLC2.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-11"></a>11 | SLT1.1  | Server Load Testing                                                                                                                                                                       |
|                           | SLT1.2  | The goal of this test is to make sure the server API and connections to the front end can bear the load of the regular user interaction numbers                                           |
|                           | SLT1.3  | The test makes sure the server can respond to several users at once and that a regular number of users requesting data from the server does not overload it                               |
|                           | SLT1.4  | Inputs: Server API Endpoints, users requesting data                                                                                                                                       |
|                           | SLT1.5  | Outputs: Information provided by the server, a functional API                                                                                                                             |
|                           | SLT1.6  | Normal                                                                                                                                                                                    |
|                           | SLT1.7  | Whitebox                                                                                                                                                                                  |
|                           | SLT1.8  | Performance                                                                                                                                                                               |
|                           | SLT1.9  | Integration                                                                                                                                                                               |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-12"></a>12 | AIM1.1  | Artificial Intelligence Model Testing                                                                                                                                                     |
|                           | AIM1.2  | This test will ensure that the AI model used for predicting scores for players outputs seemingly correct statistics for a player’s next game                                              |
|                           | AIM1.3  | The test makes sure that the neural network used to predict scores outputs statistics that are believable and sensible                                                                    |
|                           | AIM1.4  | Inputs: A player ID string, the neural network prediction model                                                                                                                           |
|                           | AIM1.5  | Outputs: Predicted statistics                                                                                                                                                             |
|                           | AIM1.6  | Normal                                                                                                                                                                                    |
|                           | AIM1.7  | Blackbox                                                                                                                                                                                  |
|                           | AIM1.8  | Functional                                                                                                                                                                                |
|                           | AIM1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-13"></a>13 | API1.1  | API Endpoint Testing                                                                                                                                                                      |
|                           | API1.2  | This test will make sure that all of the API endpoints present on the server are working properly under normal conditions, and return information as expected                             |
|                           | API1.3  | This test covers regular operation of all of the API endpoints for both team and player information, for football, basketball, soccer, and baseball                                       |
|                           | API1.4  | Inputs: Server APIs, client requests                                                                                                                                                      |
|                           | API1.5  | Outputs: Valid HTML curl with JSON data.                                                                                                                                                  |
|                           | API1.6  | Normal                                                                                                                                                                                    |
|                           | API1.7  | Whitebox                                                                                                                                                                                  |
|                           | API1.8  | Functional                                                                                                                                                                                |
|                           | API1.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-14"></a>14 | API2.1  | API Endpoint Blank Testing                                                                                                                                                                |
|                           | API2.2  | This test will cover when users send API requests to the server with blank or otherwise invalid inputs to the specific endpoint                                                           |
|                           | API2.3  | This test covers irregular operations of all of the API endpoints, in order to makes sure operation of the server can withstand invalid API requests                                      |
|                           | API2.4  | Inputs: Server APIs, client requests                                                                                                                                                      |
|                           | API2.5  | Outputs: HTML curl with error data.                                                                                                                                                       |
|                           | API2.6  | Abnormal                                                                                                                                                                                  |
|                           | API2.7  | Whitebox                                                                                                                                                                                  |
|                           | API2.8  | Functional                                                                                                                                                                                |
|                           | API2.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |
| <a id="test-id-15"></a>15 | API3.1  | API Endpoint End-of-Season Testing                                                                                                                                                        |
|                           | API3.2  | This test will make sure the server can correctly handle special API cases, like endpoints that get a team’s next game, when there is a season ending, and therefore, no listed next game |
|                           | API3.3  | The test covers an edge case where the client asks for information that is not available to the API                                                                                       |
|                           | API3.4  | Inputs: Server APIs, client requests.                                                                                                                                                     |
|                           | API3.5  | Outputs: HTML curl with error data.                                                                                                                                                       |
|                           | API3.6  | Boundary                                                                                                                                                                                  |
|                           | API3.7  | Whitebox                                                                                                                                                                                  |
|                           | API3.8  | Functional                                                                                                                                                                                |
|                           | API3.9  | Unit                                                                                                                                                                                      |
|                           |         |                                                                                                                                                                                           |

## Test Case Matrix

| Test #            | Test ID             | Normal/AB | Black/Whitebox | Funct/Perform | Unit/Integr |
| ----------------- | ------------------- | --------- | -------------- | ------------- | ----------- |
| [1](#test-id-1)   | [CUL1](#test-id-1)  | Normal    | Whitebox       | Functional    | Unit        |
| [2](#test-id-2)   | [CUL2](#test-id-2)  | Boundary  | Whitebox       | Functional    | Unit        |
| [3](#test-id-3)   | [CUR1](#test-id-3)  | Normal    | Whitebox       | Functional    | Unit        |
| [4](#test-id-4)   | [CLS1](#test-id-4)  | Normal    | Whitebox       | Functional    | Unit        |
| [5](#test-id-5)   | [CLS2](#test-id-5)  | Normal    | Whitebox       | Functional    | Unit        |
| [6](#test-id-6)   | [CLS3](#test-id-6)  | Boundary  | Whitebox       | Functional    | Unit        |
| [7](#test-id-7)   | [CLS4](#test-id-7)  | Normal    | Whitebox       | Functional    | Unit        |
| [8](#test-id-8)   | [CLS5](#test-id-8)  | Boundary  | Whitebox       | Functional    | Unit        |
| [9](#test-id-9)   | [CLC1](#test-id-9)  | Normal    | Whitebox       | Functional    | Unit        |
| [10](#test-id-10) | [CLC2](#test-id-10) | Boundary  | Whitebox       | Functional    | Unit        |
| [11](#test-id-11) | [SLT1](#test-id-11) | Normal    | Whitebox       | Performance   | Unit        |
| [12](#test-id-12) | [AIM1](#test-id-12) | Normal    | Blackbox       | Functional    | Integration |
| [13](#test-id-13) | [API1](#test-id-13) | Normal    | Whitebox       | Functional    | Unit        |
| [14](#test-id-14) | [API2](#test-id-14) | Abnormal  | Whitebox       | Functional    | Unit        |
| [15](#test-id-15) | [API3](#test-id-15) | Boundary  | Whitebox       | Functional    | Unit        |

## Quick Links

[Back To Top](#test-plan-and-results) \
[Back to ReadMe](/README.md)
