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

| Task #                    | Task Name                                                                                             | Start Date | Planned Completion Date | Notes                 | Milestone Reference                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- | ----------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| <a id="task-id-1"></a>1   | Create mobile/web specific components for scoreboard, navigation, player cards, school recognition    | 9/23/2024  | 10/15/2024              | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-2"></a>2   | Define pages, routes, and subroutes/navigation plans                                                  | 9/23/2024  | 2/1/2025                | Ongoing/In Progress   | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-3"></a>3   | Create Mobile Header, Navigation                                                                      | 10/15/2024 | 10/15/2024              | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-4"></a>4   | Create Mobile Scoreboard Renderer, Custom, League, Information                                        | 10/15/2024 | 11/1/2024               | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-5"></a>5   | Create League Landing Page and Navigation                                                             | 10/15/2024 | 11/1/2024               | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-6"></a>6   | Create League Models for players, athletes                                                            | 10/15/2024 | 11/1/2024               | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-7"></a>7   | Create League player page                                                                             | 10/15/2024 | 11/1/2024               | Done                  | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-8"></a>8   | Create League draft workflow                                                                          | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-9"></a>9   | Create League draft landing page/picking page                                                         | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-10"></a>10 | Create League draft queue system ui/ux                                                                | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-11"></a>11 | Create League draft selections                                                                        | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-12"></a>12 | Create League draft pick and queue workflows                                                          | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-13"></a>13 | Create League draft my team view                                                                      | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-14"></a>14 | Create League draft league view                                                                       | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-15"></a>15 | Create League draft player modal/dialog                                                               | 11/10/2024 | 12/1/2024               | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-16"></a>16 | Create League my team view                                                                            | 10/15/2024 | 12/1/2024               | Almost Done           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-17"></a>17 | Create League available players view                                                                  | 12/1/2024  | 1/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-18"></a>18 | Create League game and game history view                                                              | 12/1/2024  | 1/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-19"></a>19 | Create League draft results view                                                                      | 11/17/2024 | 12/1/2024               | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-20"></a>20 | Create League settings models and services                                                            | 12/1/2024  | 1/1/2025                | In Progress           | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-21"></a>21 | Create League settings edit and view-only view                                                        | 12/1/2024  | 1/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-22"></a>22 | Create add league page similar to league settings but for a new league                                | 12/1/2024  | 1/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-23"></a>23 | Finalize search league with search bar (maybe filter options?)                                        | 11/17/2024 | 12/1/2024               | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-24"></a>24 | Update user service to work with authentications and data pulls                                       | 1/1/2025   | 2/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-25"></a>25 | Research firestore queries and implement small data pulls through nested ids and document/collections | 1/1/2025   | 2/1/2025                | Backlog               | [3](#milestone-id-3)                                                                   |
| <a id="task-id-26"></a>26 | Create account page to manage account                                                                 | 12/1/2024  | 1/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-27"></a>27 | Create login page                                                                                     | 11/17/2024 | 12/1/2024               | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-28"></a>28 | Create register page                                                                                  | 11/17/2024 | 1/1/2024                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-29"></a>29 | Create forgot password page                                                                           | 11/17/2024 | 12/1/2024               | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-30"></a>30 | Create reset passward page                                                                            | 11/17/2024 | 12/1/2024               | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-31"></a>31 | Create basic conection with firebase                                                                  | 12/1/2024  | 1/1/2025                | Backlog               | [3](#milestone-id-3)                                                                   |
| <a id="task-id-32"></a>32 | Create basic connection with fastAPI localy                                                           | 10/15/2024 | 11/15/2024              | Done                  | [4](#milestone-id-4)                                                                   |
| <a id="task-id-33"></a>33 | Create environment replacements for dev and prod (api links and firebase projects specificially)      | 10/15/2024 | 11/15/2024              | Done                  | [1](#milestone-id-1), [2](#milestone-id-2), [3](#milestone-id-3), [4](#milestone-id-4) |
| <a id="task-id-34"></a>34 | Create firebase dl services and extensions for consistent data manipulation                           | 1/1/2025   | 2/1/2025                | Backlog               | [3](#milestone-id-3)                                                                   |
| <a id="task-id-35"></a>35 | Create fastapi dl services and extensions for consistent data manipulation                            | 1/1/2025   | 2/1/2024                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2), [4](#milestone-id-4)                       |
| <a id="task-id-36"></a>36 | Host client on firebase and reserve url                                                               | 2/15/2025  | 3/1/2025                | Backlog               | [5](#milestone-id-5)                                                                   |
| <a id="task-id-37"></a>37 | Develop firebase rules for firestore                                                                  | 2/15/2025  | 3/1/2025                | Backlog               | [3](#milestone-id-3)                                                                   |
| <a id="task-id-38"></a>38 | Write help page for leagues                                                                           | 3/15/2025  | 4/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-39"></a>39 | Write credit page for 3rd parties and data policies                                                   | 3/15/2025  | 4/1/2025                | Backlog               | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-40"></a>40 | Clean up UI/UX for simplest user experience                                                           | 10/15/2024 | 4/1/2025                | Ongoing/In Progress   | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-41"></a>41 | Clean up code and look for potential abstractions and duplicate code                                  | 10/15/2024 | 4/1/2025                | Ongoing/In Progress   | [1](#milestone-id-1), [2](#milestone-id-2)                                             |
| <a id="task-id-42"></a>42 | Create and Host FastAPI Endpoints                                                                     | 9/30/2024  | 12/31/2024              | Ongoing               | [8](#milestone-id-8)                                                                   |
| <a id="task-id-43"></a>43 | Connect Jupyter Notebook to SportsRadar API                                                           | 9/23/2024  | 12/14/2024              | Ongoing               | [8](#milestone-id-8)                                                                   |
| <a id="task-id-44"></a>44 | Host Dataset for Historical Player Data                                                               | 12/14/2024 | 1/1/2025                | Will start after Fall | [7](#milestone-id-7), [9](#milestone-id-9)                                             |
| <a id="task-id-45"></a>45 | Train Predictive AI Model with Historical Data                                                        | 1/1/2025   | 2/1/2025                | Must have data first  | [6](#milestone-id-6)                                                                   |
| <a id="task-id-46"></a>46 | Clean and Prepare SportsRadar data for Front-End utilization                                          | 9/30/2024  | 12/31/2024              | Ongoing               | [8](#milestone-id-8), [10](#milestone-id-10)                                           |

## Effort Matrix

| Task #            | Task Name                                                                                             | Effort: Juan | Effort: Jordan | Responsible   |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------ | -------------- | ------------- |
| [1](#task-id-1)   | Create mobile/web specific components for scoreboard, navigation, player cards, school recognition    | 0%           | 100%           | Jordan Herman |
| [2](#task-id-2)   | Define pages, routes, and subroutes/navigation plans                                                  | 0%           | 100%           | Jordan Herman |
| [3](#task-id-3)   | Create Mobile Header, Navigation                                                                      | 0%           | 100%           | Jordan Herman |
| [4](#task-id-4)   | Create Mobile Scoreboard Renderer, Custom, League, Information                                        | 0%           | 100%           | Jordan Herman |
| [5](#task-id-5)   | Create League Landing Page and Navigation                                                             | 0%           | 100%           | Jordan Herman |
| [6](#task-id-6)   | Create League Models for players, athletes                                                            | 0%           | 100%           | Jordan Herman |
| [7](#task-id-7)   | Create League player page                                                                             | 0%           | 100%           | Jordan Herman |
| [8](#task-id-8)   | Create League draft workflow                                                                          | 0%           | 100%           | Jordan Herman |
| [9](#task-id-9)   | Create League draft landing page/picking page                                                         | 0%           | 100%           | Jordan Herman |
| [10](#task-id-10) | Create League draft queue system ui/ux                                                                | 0%           | 100%           | Jordan Herman |
| [11](#task-id-11) | Create League draft selections                                                                        | 0%           | 100%           | Jordan Herman |
| [12](#task-id-12) | Create League draft pick and queue workflows                                                          | 0%           | 100%           | Jordan Herman |
| [13](#task-id-13) | Create League draft my team view                                                                      | 0%           | 100%           | Jordan Herman |
| [14](#task-id-14) | Create League draft league view                                                                       | 0%           | 100%           | Jordan Herman |
| [15](#task-id-15) | Create League draft player modal/dialog                                                               | 0%           | 100%           | Jordan Herman |
| [16](#task-id-16) | Create League my team view                                                                            | 0%           | 100%           | Jordan Herman |
| [17](#task-id-17) | Create League available players view                                                                  | 0%           | 100%           | Jordan Herman |
| [18](#task-id-18) | Create League game and game history view                                                              | 0%           | 100%           | Jordan Herman |
| [19](#task-id-19) | Create League draft results view                                                                      | 0%           | 100%           | Jordan Herman |
| [20](#task-id-20) | Create League settings models and services                                                            | 0%           | 100%           | Jordan Herman |
| [21](#task-id-21) | Create League settings edit and view-only view                                                        | 0%           | 100%           | Jordan Herman |
| [22](#task-id-22) | Create add league page similar to league settings but for a new league                                | 0%           | 100%           | Jordan Herman |
| [23](#task-id-23) | Finalize search league with search bar (maybe filter options?)                                        | 0%           | 100%           | Jordan Herman |
| [24](#task-id-24) | Update user service to work with authentications and data pulls                                       | 0%           | 100%           | Jordan Herman |
| [25](#task-id-25) | Research firestore queries and implement small data pulls through nested ids and document/collections | 0%           | 100%           | Jordan Herman |
| [26](#task-id-26) | Create account page to manage account                                                                 | 0%           | 100%           | Jordan Herman |
| [27](#task-id-27) | Create login page                                                                                     | 0%           | 100%           | Jordan Herman |
| [28](#task-id-28) | Create register page                                                                                  | 0%           | 100%           | Jordan Herman |
| [29](#task-id-29) | Create forgot password page                                                                           | 0%           | 100%           | Jordan Herman |
| [30](#task-id-30) | Create reset passward page                                                                            | 0%           | 100%           | Jordan Herman |
| [31](#task-id-31) | Create basic conection with firebase                                                                  | 0%           | 100%           | Jordan Herman |
| [32](#task-id-32) | Create basic connection with fastAPI localy                                                           | 0%           | 100%           | Jordan Herman |
| [33](#task-id-33) | Create environment replacements for dev and prod (api links and firebase projects specificially)      | 0%           | 100%           | Jordan Herman |
| [34](#task-id-34) | Create firebase dl services and extensions for consistent data manipulation                           | 0%           | 100%           | Jordan Herman |
| [35](#task-id-35) | Create fastapi dl services and extensions for consistent data manipulation                            | 0%           | 100%           | Jordan Herman |
| [36](#task-id-36) | Host client on firebase and reserve url                                                               | 0%           | 100%           | Jordan Herman |
| [37](#task-id-37) | Develop firebase rules for firestore                                                                  | 0%           | 100%           | Jordan Herman |
| [38](#task-id-38) | Write help page for leagues                                                                           | 0%           | 100%           | Jordan Herman |
| [39](#task-id-39) | Write credit page for 3rd parties and data policies                                                   | 0%           | 100%           | Jordan Herman |
| [40](#task-id-40) | Clean up UI/UX for simplest user experience                                                           | 0%           | 100%           | Jordan Herman |
| [41](#task-id-41) | Clean up code and look for potential abstractions and duplicate code                                  | 0%           | 100%           | Jordan Herman |
| [42](#task-id-42) | Create and Host FastAPI Endpoints                                                                     | 100%         | 0%             | Juan Alvarado |
| [43](#task-id-43) | Connect Jupyter Notebook to SportsRadar API                                                           | 100%         | 0%             | Juan Alvarado |
| [44](#task-id-44) | Host Dataset for Historical Player Data                                                               | 100%         | 0%             | Juan Alvarado |
| [45](#task-id-45) | Train Predictive AI Model with Historical Data                                                        | 100%         | 0%             | Juan Alvarado |
| [46](#task-id-46) | Clean and Prepare SportsRadar data for Front-End utilization                                          | 100%         | 0%             | Juan Alvarado |

## Quick Links

[Back To Top](#project-milestone-timeline-effort-matrix) \
[Back to ReadMe](/README.md)
