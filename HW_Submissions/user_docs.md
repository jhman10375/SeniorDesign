# User Docs

This file contains the user docs for CS+. (client user docs are also available on the client)

## Table of Contents

| Section                            | Title                |
| ---------------------------------- | -------------------- |
| [1](#1-introduction)               | Introduction         |
| [2](#2-login)                      | Login                |
| [2.1](#21-user-login)              | User Login           |
| [2.2](#22-user-registration)       | User Registration    |
| [2.3](#23-user-forgot-password)    | User Forgot Password |
| [2.4](#24-user-reset-password)     | User Reset Password  |
| [3](#3-home-page)                  | Home Page            |
| [3.1](#31-leagues)                 | Leagues              |
| [3.2](#32-create-league)           | Create League        |
| [3.3](#33-search-league)           | Search League        |
| [4](#4-account)                    | Account              |
| [5](#5-league)                     | League               |
| [5.1](#51-league-rankings)         | League Rankings      |
| [5.2](#52-league-draft)            | League Draft         |
| [5.2.1](#521-draft-login)          | Draft Login          |
| [5.2.2](#522-draft-waitingroom)    | Draft Waitingroom    |
| [5.2.3](#523-draft-home)           | Draft Home           |
| [5.2.4](#524-draft-reservation)    | Draft Reservation    |
| [5.2.5](#525-draft-team-view)      | Draft Team View      |
| [5.2.6](#526-draft-league-view)    | Draft League View    |
| [5.3](#53-league-draft-review)     | League Draft Review  |
| [5.4](#54-league-players)          | League Players       |
| [5.4.1](#541-player-view)          | Player View          |
| [5.5](#55-league-team)             | League Team          |
| [5.5.1](#551-league-team-settings) | League Team Settings |
| [5.6](#56-league-current-game)     | League Current Game  |
| [5.7](#57-league-history)          | League History       |
| [5.8](#58-league-settings)         | League Settings      |
| [Quick Links](#quick-links)        | Quick Links          |

### 1 Introduction

College Sports + (CSP) is an application designed to provide users a platform to play a fantasy sports game using real NCAA data and predictions from a custom curated AI model to provide predictions for how well athletes will perform.
This document provides information on how to use CSP.

[Back to Table of Contents](#table-of-contents)

### 2 Login

Login information is included in the following pages:
[Login](#21-user-login)
[Registration](#22-user-registration)
[Forgot Password](#23-user-forgot-password)
[Reset Password](#24-user-reset-password)

[Back to Table of Contents](#table-of-contents)

### 2.1 User Login

All users are required to login to access CSP. New users need to register an account on the [Registration Page](#22-user-registration).

For login, a user needs to provide a username and password. The username is the email address the user used during registration.

A user can change their email in the [Account Page](#4-account).

[Back to Table of Contents](#table-of-contents)

### 2.2 User Registration

All new users are required to register an account.

To register an account a user needs to provide their preferred name, email address and a valid password. A user is expected to confirm their password by reentering their password.

A valid password is:
At least 8 characters long
Contains at least 1 uppercase character
Contains at least 1 lowercase character
Contains at least 1 symbol !,@,#,$,%,^,&,\*,(,),,,.,/,<,>,?
Contains at least 1 number 1,2,3,4,5,6,7,8,9,0

\*Special note, all user information is stored within Firebase Authentication and Firebase Firestore Databases. All passwords are solely kept private to Firebase Authentication and are only visible to the user. CSP and any person associated does not have access or the ability to view/edit/change a user's password. Please see 3rd party services, terms, and conditions for details.

[Back to Table of Contents](#table-of-contents)

### 2.3 User Forgot Password

A user can request a password reset to be sent to their account email if they have forgotten their password.

Once a user requests a password reset, the user will receive an email from noreply@college-sports-plus.firebaseapp.com with more details on how to reset a password.

[Back to Table of Contents](#table-of-contents)

### 2.4 User Reset Password

If a user is resetting a password, they will be asked to enter and confirm a new password.

A valid password is:
At least 8 characters long
Contains at least 1 uppercase character
Contains at least 1 lowercase character
Contains at least 1 symbol !,@,#,$,%,^,&,\*,(,),,,.,/,<,>,?
Contains at least 1 number 1,2,3,4,5,6,7,8,9,0

\*Special note, all user information is stored within Firebase Authentication and Firebase Firestore Databases. All passwords are solely kept private to Firebase Authentication and are only visible to the user. CSP and any person associated does not have access or the ability to view/edit/change a user's password. Please see 3rd party services, terms, and conditions for details.

[Back to Table of Contents](#table-of-contents)

### 3 Home Page

In the top right, a user will see their initials which when clicked will provide a menu where a user can go to the [Account Page](#4-account) or sign out of CSP.

Home page information is included in the following pages:
[Leagues](#31-leagues)
[Create League](#32-create-league)
[League Search](#33-search-league)

[Back to Table of Contents](#table-of-contents)

### 3.1 Leagues

A user will see a list of all leagues the user is associated with. A user can access a league by selecting a league.

More details on leagues can be found on the [League Page](#5-league)

[Back to Table of Contents](#table-of-contents)

### 3.2 Create League

On this page, a user will create a team by selecting a NCAA team and a custom team name. This team information can be changed after the league is created from [League Team Settings](#551-league-team-settings).

After the user has created a team, the user will complete the create league wizard based on the type of league being created. Leagues commonly have general settings like league name, position settings like max number of quarterbacks per team roster, and draft settings like draft start date & time. Once a league is created, the league creator will become the league manager and will be able to edit league settings on the [League Settings Page](#58-league-settings).

[Back to Table of Contents](#table-of-contents)

### 3.3 Search League

The league search page has a search bar where a user can search for leagues.

Once a league is found, a user can select the league and join the league.

\*A user can only join a league they are not currently a part of
**A user can only join a league that is not at capacity \***Some leagues are private in which case a user must provide the league passcode correctly to join

[Back to Table of Contents](#table-of-contents)

### 4 Account

On this page, a user will view and edit their account details as well as view a list of leagues the user is a part of.

[Back to Table of Contents](#table-of-contents)

### 5 League

Once a league’s season has begun additional information is available on the league page including high scoring league participants and high scoring players of the week.

League information is included in the following pages:
[Rankings](#51-league-rankings)
[Draft](#52-league-draft)
[Draft Review](#53-league-draft-review)
[Players](#54-league-players)
[Team](#55-league-team)
[Schedule](#56-league-schedule)
[History](#57-league-history)
[Settings](#58-league-settings)

[Back to Table of Contents](#table-of-contents)

### 5.1 League Rankings

This page provides current rankings and playoff seeding projections for all league participants.

Participants can also view a table including total points scored, points scored against the participant, and points behind the leader.

Depending on the size of the league, a user will see all participants split between conferences.

Conference breakdown by number of participants:
2-7 participants - 1 conference
8-12 participants - 2 conferences
13-32 participants - 4 conferences

\*The league manager specifies conference names in the [League Settings Page](#58-league-settings) and the [League Creation Page](#32-create-league), but player allocation is at random.

[Back to Table of Contents](#table-of-contents)

### 5.2 League Draft

League Draft information is included in the following pages:
[Login](#521-draft-login)
[Waiting Room](#522-draft-waitingroom)
[Home](#523-draft-home)
[Reservation](#524-draft-reservation)
[Team View](#525-draft-team-view)
[League View](#526-draft-league-view)

[Back to Table of Contents](#table-of-contents)

### 5.2.1 Draft Login

If a user is the league manager, the user will see an option to create a draft. For the league to be able to draft, the league manager must create a draft and share the provided 6-digit pin to all league participants.

The league manager will also see a share option which copies the 6-digit code to the user’s clipboard and allows them to easily share the 6-digit code with the league.

All users including the league manager are required to enter a valid 6-digit code to enter the draft waiting room.

[Back to Table of Contents](#table-of-contents)

### 5.2.2 Draft Waitingroom

If the current user is the league manager, they will see an option to start the draft. Once selected all league participants in the waiting room will join the draft and selections will begin.

All users in the waiting room will see a list of league participants also in the waiting room.

If a user arrives late to the draft, they are required to enter the waiting room and will be automatically entered into the draft at the end of the current league participants draft selection.

[Back to Table of Contents](#table-of-contents)

### 5.2.3 Draft Home

On this page a user will see the draft pick order queue where a timer displays the amount of time left for the current selection to be made and a scrolling queue shows the upcoming selectors and the draft round. A user can view the draft order by selecting the draft order button where the user will see the selection order.

On this page the user will see a table of all available players where the header has general and position filters and there are sorting options for each column. By clicking on a player row, a pop-up providing player information and statistics will appear.

On this page, a user will be able to pick a player to be added to the user’s team or add the player to the user’s reservation list. If a player is added to the reservation list, the user can checkout the [Draft Reservation View](#524-draft-reservation). If the player is added to the user’s team, the user can checkout the [Team View](#525-draft-team-view) or [League View](#526-draft-league-view).

\*If a player is selected by another league participant (or the user), the player will be removed from all queues and will no longer be selectable.

[Back to Table of Contents](#table-of-contents)

### 5.2.4 Draft Reservation

On this page a user will see the draft pick order queue where a timer displays the amount of time left for the current selection to be made and a scrolling queue shows the upcoming selectors and the draft round. A user can view the draft order by selecting the draft order button where the user will see the selection order.

On this page the user will see a table of the user’s reserved players where the header has general and position filters and there are sorting options for each column. By clicking on a player row, a pop-up providing player information and statistics will appear.

On this page, a user will be able to pick a player to be added to the user’s team or remove the player from the user’s reservation list. If the player is added to the user’s team, the user can checkout the [Team View](#525-draft-team-view) or [League View](#526-draft-league-view).

\*If a player is selected by another league participant (or the user), the player will be removed from all queues and will no longer be selectable.

[Back to Table of Contents](#table-of-contents)

### 5.2.5 Draft Team View

On this page a user will see the draft pick order queue where a timer displays the amount of time left for the current selection to be made and a scrolling queue shows the upcoming selectors and the draft round. A user can view the draft order by selecting the draft order button where the user will see the selection order.

On this page the user will see a table of players that have been selected by the user. By clicking on a player row, a pop-up providing player information and statistics will appear.

[Back to Table of Contents](#table-of-contents)

### 5.2.6 Draft League View

On this page a user will see the draft pick order queue where a timer displays the amount of time left for the current selection to be made and a scrolling queue shows the upcoming selectors and the draft round. A user can view the draft order by selecting the draft order button where the user will see the selection order.

On this page the user will see a table of users and players that have been selected. By clicking on a player’s tile, a pop-up providing player information and statistics will appear.

[Back to Table of Contents](#table-of-contents)

### 5.3 League Draft Review

On this page the user will see a table of users and players that have been selected. By clicking on a player’s tile, a pop-up providing player information and statistics will appear.

[Back to Table of Contents](#table-of-contents)

### 5.4 League Players

On this page the user will be able to search all players.

Players are shown in a table where the header has general and position filters and there are sorting options for each column.

A user can select a player clicking on the players name where the user will be redirected to the [Player View](#541-player-view)

[Back to Table of Contents](#table-of-contents)

### 5.4.1 Player View

On this page a user will see information about a player including:
General information
Player stats for the current season
Player historical stats

If a user is viewing this page after the draft has occurred, players will have the option to add a player from the transfer portal if they are currently not on a team. If a player is on a team, they will have a transfer request option where the user who manages the player will accept or reject the transfer request.

[Back to Table of Contents](#table-of-contents)

### 5.5 League Team

On this page, a user will see general team information and a settings option. Selecting the settings option will take a user to the [Team Settings Page](#551-league-team-settings).

The user will see the roster of the user’s team for the next game where the user can make roster changes by moving players between the bench and either first or second string or send the player to the transfer portal and release the player from the user’s team.

A user can select a player clicking on the players name where the user will be redirected to the [Player View](#541-player-view)

[Back to Table of Contents](#table-of-contents)

### 5.5.1 League Team Settings

On this page, a user can change the currently selected team and the team name.

[Back to Table of Contents](#table-of-contents)

### 5.6 League Current Game

On this page, the user will see a scoreboard at the top of the screen including information for the two teams playing in the game, a left arrow and a right arrow. By selecting the left or right arrow, a user will see different games being played for the week.

\*The current user’s game will always be shown first.

[Back to Table of Contents](#table-of-contents)

### 5.7 League History

This page shows the schedule for the season including the week number,the current user’s game, and results if applicable.

By selecting a game, the user will be directed to the [Current Game Page](#56-league-current-game) and show information for the game selected and any other games from that week will be accessible using the left and right arrows.

[Back to Table of Contents](#table-of-contents)

### 5.8 League Settings

On this page all league participants will be able to view the settings for the league established by the league manager.

If the user is a league manager, the user will have an edit option where the user will be able to edit settings for the league.
In the edit league settings mode, some settings will be disabled from changes being made including league name and will be identifiable as slightly greyed out and not selectable/editable.

[Back to Table of Contents](#table-of-contents)

## Quick Links

[Back To Top](#user-docs) \
[Back to ReadMe](/README.md)
