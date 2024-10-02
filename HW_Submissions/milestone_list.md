# Project Milestone, Timeline, Effort Matrix

This is a page that includes tables including tasks, deadlines, and parties responsible for work.

## Table of Contents

1. [Milestones](#milestone)
2. [Timeline](#timeline)
3. [Effort Matrix](#effort-matrix)

## Milestones

| Reference #                    | Name                                            | Description                                                                                                           | Deliverable                                                                 |
| ------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| <a id="milestone-id-1"></a>1   | Client web development completed                | Web access of CSP is complete from UI/UX standpoint and responsive to tablet/pc devices                               | Client is user friendly and relatively free of bugs and accessible via demo |
| <a id="milestone-id-2"></a>2   | Client mobile development completed             | Web access of CSP is complete from UI/UX standpoint and responsive to mobile devices                                  | Client is user friendly and relatively free of bugs and accessible via demo |
| <a id="milestone-id-3"></a>3   | Client connection to firebase                   | Connection is made from client to Firebase to handle proper authentication and database storage                       | Client pulls live data and can be authenticated                             |
| <a id="milestone-id-4"></a>4   | Client connection to custom api                 | Connection is made from client to api to recieve sports related information                                           | Client pulls live data                                                      |
| <a id="milestone-id-5"></a>5   | Client hosted and available publicly            | Client is hosted on firebase and publicly accessible                                                                  | Access to CSP on any device                                                 |
| <a id="milestone-id-6"></a>6   | Finish AI model                                 | AI Predictive model for player performance is complete and working. Information from model can be passed to front-end | AI Model which predicts player performance for a given week                 |
| <a id="milestone-id-7"></a>7   | Webscrapper working for historical data         | BeautifulSoup code can efficeintly scrape data from NCAA website to feed AI model                                     | Working NCAA stats webscrapper                                              |
| <a id="milestone-id-8"></a>8   | FastAPI endpoints made for critical information | All endpoints needed to provide accurate information to the front-end are coded and complete                          | Working NCAA stats webscrapper                                              |
| <a id="milestone-id-9"></a>9   | Host Dataset for historical data                | The dataset containing the information from the NCAA on past seasons is accessible to AI model                        | Dataset with needed information for AI model                                |
| <a id="milestone-id-10"></a>10 | API hosted and available for connection         | FastAPI endpoints are hosted and available for the front end to ping in order to get information                      | Hosted API that is accesible to front-end application                       |

## Timeline

| Task #                    | Task Name                                                                                          | Start Date | Planned Completion Date | Notes                 | Milestone Reference                          |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ---------- | ----------------------- | --------------------- | -------------------------------------------- |
| <a id="task-id-1"></a>1   | Create mobile/web specific components for scoreboard, navigation, player cards, school recognition | 9/23/2024  | 11/1/2024               |                       | [1](#milestone-id-1), [2](#milestone-id-2)   |
| <a id="task-id-2"></a>2   | Define pages, routes, and subroutes/navigation plans                                               | 9/23/2024  | 2/1/2025                | Ongoing               | [1](#milestone-id-1), [2](#milestone-id-2)   |
| <a id="task-id-3"></a>3   | Create login page                                                                                  | 10/15/2024 | 10/31/2024              |                       | [1](#milestone-id-1), [2](#milestone-id-2)   |
| <a id="task-id-4"></a>4   | Create Register page                                                                               | 10/15/2024 | 10/31/2024              |                       | [1](#milestone-id-1), [2](#milestone-id-2)   |
| <a id="task-id-5"></a>5   | Create Forgot Password page                                                                        | 10/15/2024 | 10/31/2024              |                       | [1](#milestone-id-1), [2](#milestone-id-2)   |
| <a id="task-id-6"></a>6   | Connect Firebase to client for authentication and database                                         | 11/1/2024  | 11/15/2024              |                       | [3](#milestone-id-3)                         |
| <a id="task-id-7"></a>7   | Connect api to client                                                                              | 1/1/2025   | 1/1/2025                | local host until expo | [4](#milestone-id-4)                         |
| <a id="task-id-8"></a>8   | Host client on Firebase                                                                            | 3/1/2025   | 3/1/2025                |                       | [5](#milestone-id-5)                         |
| <a id="task-id-9"></a>9   | Create and Host FastAPI Endpoints                                                                  | 9/30/2024  | 12/31/2024              | Ongoing               | [8](#milestone-id-8)                         |
| <a id="task-id-10"></a>10 | Connect Jupyter Notebook to SportsRadar API                                                        | 9/23/2024  | 12/14/2024              | Ongoing               | [8](#milestone-id-8)                         |
| <a id="task-id-11"></a>11 | Host Dataset for Historical Player Data                                                            | 12/14/2024 | 1/1/2025                | Will start after Fall | [7](#milestone-id-7), [9](#milestone-id-9)   |
| <a id="task-id-12"></a>12 | Train Predictive AI Model with Historical Data                                                     | 1/1/2025   | 2/1/2025                | Must have data first  | [6](#milestone-id-6)                         |
| <a id="task-id-13"></a>13 | Clean and Prepare SportsRadar data for Front-End utilization                                       | 9/30/2024  | 12/31/2024              | Ongoing               | [8](#milestone-id-8), [10](#milestone-id-10) |

## Effort Matrix

| Task #            | Task Name                                                                                          | Effort: Juan | Effort: Jordan | Responsible   |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------ | -------------- | ------------- |
| [1](#task-id-1)   | Create mobile/web specific components for scoreboard, navigation, player cards, school recognition | 0%           | 100%           | Jordan Herman |
| [2](#task-id-2)   | Define pages, routes, and subroutes/navigation plans                                               | 0%           | 100%           | Jordan Herman |
| [3](#task-id-3)   | Create login page                                                                                  | 0%           | 100%           | Jordan Herman |
| [4](#task-id-4)   | Create Forgot password page                                                                        | 0%           | 100%           | Jordan Herman |
| [5](#task-id-5)   | Create Register page                                                                               | 0%           | 100%           | Jordan Herman |
| [6](#task-id-6)   | Connect Firebase to client for authentication and database                                         | 0%           | 100%           | Jordan Herman |
| [7](#task-id-7)   | Connect api to client                                                                              | 0%           | 100%           | Jordan Herman |
| [8](#task-id-8)   | Host client on Firebase                                                                            | 0%           | 100%           | Jordan Herman |
| [9](#task-id-9)   | Create and Host FastAPI Endpoints                                                                  | 100%         | 0%             | Juan Alvarado |
| [10](#task-id-10) | Connect Jupyter Notebook to SportsRadar API                                                        | 100%         | 0%             | Juan Alvarado |
| [11](#task-id-11) | Host Dataset for Historical Player Data                                                            | 100%         | 0%             | Juan Alvarado |
| [12](#task-id-12) | Train Predictive AI Model with Historical Data                                                     | 100%         | 0%             | Juan Alvarado |
| [13](#task-id-13) | Clean and Prepare SportsRadar data for Front-End utilization                                       | 100%         | 0%             | Juan Alvarado |

## Quick Links

[Back To Top](#project-milestone-timeline-effort-matrix) \
[Back to ReadMe](/README.md)
