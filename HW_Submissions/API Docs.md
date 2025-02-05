  FastAPI - Swagger UI

FastAPI 0.1.0 

OAS 3.1
-----------------------

[/openapi.json](/openapi.json)

### [default](#/default)

GET

[/](#/default/root__get)

Root

GET

[/teams/logos/{}](#/default/get_team_logos_teams_logos____get)

Get Team Logos

GET

[/lists/repopulate](#/default/repopulate_player_lists_lists_repopulate_get)

Repopulate Player Lists

GET

[/status](#/default/get_status_status_get)

Get Status

### [Team Info](#/Team%20Info)

GET

[/teams/{team\_name}](#/Team%20Info/get_schedule_teams__team_name__get)

Get Schedule

GET

[/team/get\_by\_id/{team\_id}](#/Team%20Info/get_team_by_id_team_get_by_id__team_id__get)

Get Team By Id

GET

[/teams/{team\_name}/last\_game](#/Team%20Info/get_last_game_teams__team_name__last_game_get)

Get Last Game

GET

[/teams/{team\_name}/next\_game](#/Team%20Info/get_next_game_teams__team_name__next_game_get)

Get Next Game

GET

[/teams/{team\_name}/players](#/Team%20Info/get_players_teams__team_name__players_get)

Get Players

### [School Info](#/School%20Info)

GET

[/schools/get\_all](#/School%20Info/get_all_schools_schools_get_all_get)

Get All Schools

### [Player Info](#/Player%20Info)

GET

[/players/search/by\_name/{player\_name}](#/Player%20Info/search_for_players_by_name_players_search_by_name__player_name__get)

Search For Players By Name

GET

[/players/search/by\_id/{player\_id}](#/Player%20Info/search_for_players_by_id_players_search_by_id__player_id__get)

Search For Players By Id

GET

[/players/search/by\_ids](#/Player%20Info/search_for_players_by_ids_players_search_by_ids_get)

Search For Players By Ids

GET

[/players/getall](#/Player%20Info/get_all_players_players_getall_get)

Get All Players

GET

[/players/get\_first\_string](#/Player%20Info/get_all_first_string_players_players_get_first_string_get)

Get All First String Players

GET

[/player/{player\_id}/stats/full\_year](#/Player%20Info/get_player_stats_for_whole_year_player__player_id__stats_full_year_get)

Get Player Stats For Whole Year

GET

[/player/{player\_id}/stats/last\_game](#/Player%20Info/get_last_game_stats_for_player_player__player_id__stats_last_game_get)

Get Last Game Stats For Player

### [D/ST](#/D/ST)

GET

[/{team\_name}/D-ST/stats/last\_game](#/D/ST/get_Defence_Special_Teams_last_game_stats__team_name__D_ST_stats_last_game_get)

Get Defence Special Teams Last Game Stats

GET

[/{team\_name}/D-ST/stats/full\_season](#/D/ST/get_Defence_Special_Teams_season_stats__team_name__D_ST_stats_full_season_get)

Get Defence Special Teams Season Stats

### [Prediction](#/Prediction)

GET

[/predict/{player\_id}/game](#/Prediction/predict_player_stats_predict__player_id__game_get)

Predict Player Stats

GET

[/predict/season/{player\_id}](#/Prediction/predict_player_season_predict_season__player_id__get)

Predict Player Season

GET

[/predict/D-ST/{team\_name}](#/Prediction/predict_Defence_Special_Teams_stats_predict_D_ST__team_name__get)

Predict Defence Special Teams Stats

GET

[/predict/season/D-ST/{team\_name}](#/Prediction/predict_Defense_Special_Teams_season_predict_season_D_ST__team_name__get)

Predict Defense Special Teams Season

### [Basketball](#/Basketball)

GET

[/bkb/teams/{team\_name}](#/Basketball/get_basketball_schedule_bkb_teams__team_name__get)

Get Basketball Schedule

GET

[/bkb/teams/{team\_name}/last\_game](#/Basketball/get_last_basketball_game_bkb_teams__team_name__last_game_get)

Get Last Basketball Game

GET

[/bkb/teams/{team\_name}/next\_game](#/Basketball/get_next_basketball_game_bkb_teams__team_name__next_game_get)

Get Next Basketball Game

GET

[/bkb/teams/{team\_name}/players](#/Basketball/get_basketball_players_bkb_teams__team_name__players_get)

Get Basketball Players

GET

[/bkb/players/search/by\_name/{player\_name}](#/Basketball/search_for_basketball_players_by_name_bkb_players_search_by_name__player_name__get)

Search For Basketball Players By Name

GET

[/bkb/players/search/by\_id/{player\_id}](#/Basketball/search_for_basketball_players_by_id_bkb_players_search_by_id__player_id__get)

Search For Basketball Players By Id

GET

[/bkb/players/getall](#/Basketball/get_all_basketball_players_bkb_players_getall_get)

Get All Basketball Players

GET

[/bkb/players/get\_first\_string](#/Basketball/get_all_first_string_basketball_players_bkb_players_get_first_string_get)

Get All First String Basketball Players

GET

[/bkb/player/{player\_id}/stats/last\_game](#/Basketball/get_last_game_stats_for_basketball_player_bkb_player__player_id__stats_last_game_get)

Get Last Game Stats For Basketball Player

GET

[/bkb/player/{player\_id}/stats/full\_year](#/Basketball/get_basketball_player_season_stats_bkb_player__player_id__stats_full_year_get)

Get Basketball Player Season Stats

### [Basketball - Team Info](#/Basketball%20-%20Team%20Info)

GET

[/bkb/teams/{team\_name}](#/Basketball%20-%20Team%20Info/get_basketball_schedule_bkb_teams__team_name__get)

Get Basketball Schedule

GET

[/bkb/teams/{team\_name}/last\_game](#/Basketball%20-%20Team%20Info/get_last_basketball_game_bkb_teams__team_name__last_game_get)

Get Last Basketball Game

GET

[/bkb/teams/{team\_name}/next\_game](#/Basketball%20-%20Team%20Info/get_next_basketball_game_bkb_teams__team_name__next_game_get)

Get Next Basketball Game

GET

[/bkb/teams/{team\_name}/players](#/Basketball%20-%20Team%20Info/get_basketball_players_bkb_teams__team_name__players_get)

Get Basketball Players

### [Basketball - Player Info](#/Basketball%20-%20Player%20Info)

GET

[/bkb/players/search/by\_name/{player\_name}](#/Basketball%20-%20Player%20Info/search_for_basketball_players_by_name_bkb_players_search_by_name__player_name__get)

Search For Basketball Players By Name

GET

[/bkb/players/search/by\_id/{player\_id}](#/Basketball%20-%20Player%20Info/search_for_basketball_players_by_id_bkb_players_search_by_id__player_id__get)

Search For Basketball Players By Id

GET

[/bkb/players/getall](#/Basketball%20-%20Player%20Info/get_all_basketball_players_bkb_players_getall_get)

Get All Basketball Players

GET

[/bkb/players/get\_first\_string](#/Basketball%20-%20Player%20Info/get_all_first_string_basketball_players_bkb_players_get_first_string_get)

Get All First String Basketball Players

GET

[/bkb/player/{player\_id}/stats/last\_game](#/Basketball%20-%20Player%20Info/get_last_game_stats_for_basketball_player_bkb_player__player_id__stats_last_game_get)

Get Last Game Stats For Basketball Player

GET

[/bkb/player/{player\_id}/stats/full\_year](#/Basketball%20-%20Player%20Info/get_basketball_player_season_stats_bkb_player__player_id__stats_full_year_get)

Get Basketball Player Season Stats

### [Baseball](#/Baseball)

GET

[/bsb/teams/{team\_name}](#/Baseball/get_baseball_schedule_bsb_teams__team_name__get)

Get Baseball Schedule

GET

[/bsb/teams/{team\_name}/last\_game](#/Baseball/get_last_baseball_game_bsb_teams__team_name__last_game_get)

Get Last Baseball Game

GET

[/bsb/teams/{team\_name}/next\_game](#/Baseball/get_next_baseball_game_bsb_teams__team_name__next_game_get)

Get Next Baseball Game

GET

[/bsb/teams/{team\_name}/players](#/Baseball/get_baseball_players_bsb_teams__team_name__players_get)

Get Baseball Players

GET

[/bsb/players/search/by\_name/{player\_name}](#/Baseball/search_for_baseball_players_by_name_bsb_players_search_by_name__player_name__get)

Search For Baseball Players By Name

GET

[/bsb/players/search/by\_id/{player\_id}](#/Baseball/search_for_baseball_players_by_id_bsb_players_search_by_id__player_id__get)

Search For Baseball Players By Id

GET

[/bsb/players/getall](#/Baseball/get_all_baseball_players_bsb_players_getall_get)

Get All Baseball Players

GET

[/bsb/player/{player\_id}/stats/last\_game](#/Baseball/get_last_game_stats_for_baseball_player_bsb_player__player_id__stats_last_game_get)

Get Last Game Stats For Baseball Player

GET

[/bsb/player/{player\_id}/stats/full\_year](#/Baseball/get_baseball_player_season_stats_bsb_player__player_id__stats_full_year_get)

Get Baseball Player Season Stats

### [Baseball - Team Info](#/Baseball%20-%20Team%20Info)

GET

[/bsb/teams/{team\_name}](#/Baseball%20-%20Team%20Info/get_baseball_schedule_bsb_teams__team_name__get)

Get Baseball Schedule

GET

[/bsb/teams/{team\_name}/last\_game](#/Baseball%20-%20Team%20Info/get_last_baseball_game_bsb_teams__team_name__last_game_get)

Get Last Baseball Game

GET

[/bsb/teams/{team\_name}/next\_game](#/Baseball%20-%20Team%20Info/get_next_baseball_game_bsb_teams__team_name__next_game_get)

Get Next Baseball Game

GET

[/bsb/teams/{team\_name}/players](#/Baseball%20-%20Team%20Info/get_baseball_players_bsb_teams__team_name__players_get)

Get Baseball Players

### [Baseball - Player Info](#/Baseball%20-%20Player%20Info)

GET

[/bsb/players/search/by\_name/{player\_name}](#/Baseball%20-%20Player%20Info/search_for_baseball_players_by_name_bsb_players_search_by_name__player_name__get)

Search For Baseball Players By Name

GET

[/bsb/players/search/by\_id/{player\_id}](#/Baseball%20-%20Player%20Info/search_for_baseball_players_by_id_bsb_players_search_by_id__player_id__get)

Search For Baseball Players By Id

GET

[/bsb/players/getall](#/Baseball%20-%20Player%20Info/get_all_baseball_players_bsb_players_getall_get)

Get All Baseball Players

GET

[/bsb/player/{player\_id}/stats/last\_game](#/Baseball%20-%20Player%20Info/get_last_game_stats_for_baseball_player_bsb_player__player_id__stats_last_game_get)

Get Last Game Stats For Baseball Player

GET

[/bsb/player/{player\_id}/stats/full\_year](#/Baseball%20-%20Player%20Info/get_baseball_player_season_stats_bsb_player__player_id__stats_full_year_get)

Get Baseball Player Season Stats

### [Soccer](#/Soccer)

GET

[/scc/teams/{team\_name}](#/Soccer/get_soccer_schedule_scc_teams__team_name__get)

Get Soccer Schedule

GET

[/scc/teams/{team\_name}/last\_game](#/Soccer/get_last_soccer_game_scc_teams__team_name__last_game_get)

Get Last Soccer Game

GET

[/scc/teams/{team\_name}/next\_game](#/Soccer/get_next_soccer_game_scc_teams__team_name__next_game_get)

Get Next Soccer Game

GET

[/scc/teams/{team\_name}/players](#/Soccer/get_soccer_players_scc_teams__team_name__players_get)

Get Soccer Players

GET

[/scc/players/search/by\_name/{player\_name}](#/Soccer/search_for_soccer_players_by_name_scc_players_search_by_name__player_name__get)

Search For Soccer Players By Name

GET

[/scc/players/search/by\_id/{player\_id}](#/Soccer/search_for_soccer_players_by_id_scc_players_search_by_id__player_id__get)

Search For Soccer Players By Id

GET

[/scc/players/getall](#/Soccer/get_all_soccer_players_scc_players_getall_get)

Get All Soccer Players

GET

[/scc/player/{player\_id}/stats/last\_game](#/Soccer/get_last_game_stats_for_soccer_player_scc_player__player_id__stats_last_game_get)

Get Last Game Stats For Soccer Player

GET

[/scc/player/{player\_id}/stats/full\_year](#/Soccer/get_soccer_player_season_stats_scc_player__player_id__stats_full_year_get)

Get Soccer Player Season Stats

### [Soccer - Team Info](#/Soccer%20-%20Team%20Info)

GET

[/scc/teams/{team\_name}](#/Soccer%20-%20Team%20Info/get_soccer_schedule_scc_teams__team_name__get)

Get Soccer Schedule

GET

[/scc/teams/{team\_name}/last\_game](#/Soccer%20-%20Team%20Info/get_last_soccer_game_scc_teams__team_name__last_game_get)

Get Last Soccer Game

GET

[/scc/teams/{team\_name}/next\_game](#/Soccer%20-%20Team%20Info/get_next_soccer_game_scc_teams__team_name__next_game_get)

Get Next Soccer Game

GET

[/scc/teams/{team\_name}/players](#/Soccer%20-%20Team%20Info/get_soccer_players_scc_teams__team_name__players_get)

Get Soccer Players

### [Soccer - Player Info](#/Soccer%20-%20Player%20Info)

GET

[/scc/players/search/by\_name/{player\_name}](#/Soccer%20-%20Player%20Info/search_for_soccer_players_by_name_scc_players_search_by_name__player_name__get)

Search For Soccer Players By Name

GET

[/scc/players/search/by\_id/{player\_id}](#/Soccer%20-%20Player%20Info/search_for_soccer_players_by_id_scc_players_search_by_id__player_id__get)

Search For Soccer Players By Id

GET

[/scc/players/getall](#/Soccer%20-%20Player%20Info/get_all_soccer_players_scc_players_getall_get)

Get All Soccer Players

GET

[/scc/player/{player\_id}/stats/last\_game](#/Soccer%20-%20Player%20Info/get_last_game_stats_for_soccer_player_scc_player__player_id__stats_last_game_get)

Get Last Game Stats For Soccer Player

GET

[/scc/player/{player\_id}/stats/full\_year](#/Soccer%20-%20Player%20Info/get_soccer_player_season_stats_scc_player__player_id__stats_full_year_get)

Get Soccer Player Season Stats

### [League Tools](#/League%20Tools)

GET

[/league-tools/generate\_schedule/](#/League%20Tools/generate_league_schedule_league_tools_generate_schedule__get)

Generate League Schedule

### [Draft](#/Draft)

POST

[/create-draft](#/Draft/create_draft_create_draft_post)

Create Draft

#### Parameters

Try it out

No parameters

#### Request body

application/json

*   Example Value
*   Schema

    
        {
    
      "user_ids": [
        "string"
      ],
      "draft_type": 0,
      "number_of_rounds": 0
    }

#### Responses

Code

Description

Links

200

Successful Response

Media type

application/json

Controls `Accept` header.

*   Example Value
*   Schema

    "string"

_No links_

422

Validation Error

Media type

application/json

*   Example Value
*   Schema

    {
      "detail": [
        {
          "loc": [
            "string",
            0
          ],
          "msg": "string",
          "type": "string"
        }
      ]
    }

_No links_

#### Schemas

CreateDraftData

Collapse all**object**

*   user\_ids
    
    Collapse all**array<string>**
    
    Items
    
    **string**
    
*   draft\_type
    
    **integer**
    
*   number\_of\_rounds
    
    **integer**
    

D\_ST\_Stats

Collapse all**object**

*   team\_name
    
    **string**
    
*   tackles
    
    **integer**
    
*   punt\_TDs
    
    **integer**
    
*   kick\_return\_TDs
    
    **integer**
    
*   int\_TDs
    
    **integer**
    
*   interceptions
    
    **integer**
    
*   fumbles\_recovered
    
    **integer**
    
*   other\_defensive\_TDs
    
    **integer**
    
*   sacks
    
    **integer**
    
*   deflected\_passes
    
    **integer**
    

HTTPValidationError

Expand all**object**

SchedMatch

Expand all**object**

SchedWeek

Expand all**object**

Season

Expand all**integer**

ValidationError

Expand all**object**

BbGame

Expand all**object**

BbPlayer

Expand all**object**

BkbStats

Expand all**object**

BsbStats

Expand all**object**

FbGame

Expand all**object**

Location

Expand all**object**

PlayerInfo

Expand all**object**

PlayerStats

Expand all**object**

PredictedStats

Expand all**object**

SccPlayer

Expand all**object**

SccStats

Expand all**object**

School

Expand all**object**

TeamLogo

Expand all**object**

const ui = SwaggerUIBundle({ url: '/openapi.json', "dom\_id": "#swagger-ui", "layout": "BaseLayout", "deepLinking": true, "showExtensions": true, "showCommonExtensions": true, oauth2RedirectUrl: window.location.origin + '/docs/oauth2-redirect', presets: \[ SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset \], })
