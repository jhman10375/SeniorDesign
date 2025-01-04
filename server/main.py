from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.draft import router as draft_router

import requests
from datetime import datetime
import numpy as np
import pandas as pd
import json
import pickle
import os
import pytz
from classes import *
from functions import *
from dotenv import load_dotenv
from sklearn.preprocessing import LabelEncoder
import cbbpy.mens_scraper as s

fullList = playerList()

firstStrings = firstStringList(fullList)

load_dotenv()
token = os.getenv("CFBD_TOKEN")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

#FOOTBALL ENDPOINTS

@app.get("/teams/{team_name}", tags=["Team Info"])
async def get_schedule(team_name: str, season : Season) -> list[fbGame]:

    return team_schedule(team_name, season.value)


@app.get("/teams/{team_name}/last_game", tags=["Team Info"])
async def get_last_game(team_name: str) -> fbGame:

    schedule = team_schedule(team_name, fullList.active_season)

    sched_df = pd.DataFrame([game.__dict__ for game in schedule])

    now = datetime.now()

    sched_df['start_date'] = pd.to_datetime(sched_df['start_date'])

    sched_df['start_date'] = sched_df['start_date'].dt.strftime('%Y-%m-%d')

    sched_df = sched_df.query(f'start_date < "{now.strftime("%Y-%m-%d")}"')

    sched_df.sort_values(by='start_date', inplace=True, ascending=False)

    sched_df.reset_index(drop=True, inplace=True)

    last_game = fbGame(game_id=sched_df.iloc[0]['game_id'], 
                    home_id=sched_df.iloc[0]['home_id'], home_team=sched_df.iloc[0]['home_team'], 
                    away_team=sched_df.iloc[0]['away_team'], start_date=sched_df.iloc[0]['start_date'])

    return last_game


@app.get("/teams/{team_name}/next_game", tags=["Team Info"])
async def get_next_game(team_name: str) -> fbGame:

    schedule = team_schedule(team_name, fullList.active_season)

    sched_df = pd.DataFrame([game.__dict__ for game in schedule])

    now = datetime.now()

    sched_df['start_date'] = pd.to_datetime(sched_df['start_date'])

    sched_df['start_date'] = sched_df['start_date'].dt.strftime('%Y-%m-%d')

    sched_df = sched_df.query(f'start_date > "{now.strftime("%Y-%m-%d")}"')

    sched_df.sort_values(by='start_date', inplace=True)

    sched_df.reset_index(drop=True, inplace=True)

    next_game = fbGame(game_id=sched_df.iloc[0]['game_id'], 
                    home_id=sched_df.iloc[0]['home_id'], home_team=sched_df.iloc[0]['home_team'], 
                    away_team=sched_df.iloc[0]['away_team'], start_date=sched_df.iloc[0]['start_date'])

    return next_game


@app.get("/teams/{team_name}/players", tags=["Team Info"])
async def get_players(team_name : str, player_type = "None") -> list[playerInfo]:
    
    if not(fullList.populated):
        fullList.populate()

        all_players = fullList.getlist().copy()

        all_players.query(f'school == "{team_name}"', inplace = True)

        if player_type != "None":
            all_players.query(f'position == "{player_type}"', inplace = True)

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()] 
    
    else:
        all_players = fullList.getlist().copy()

        all_players.query(f'school == "{team_name}"', inplace = True)

        if player_type != "None":
            all_players.query(f'position == "{player_type}"', inplace = True)

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()] 
     

@app.get("/players/search/by_name/{player_name}", tags=["Player Info"])
async def search_for_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[playerInfo]:

    if not(fullList.populated):
        fullList.populate()

        all_players = fullList.getlist().copy()

        if player_team != "None":
            all_players.query(f'school == "{player_team}"', inplace = True)

        if player_type != "None":
            all_players.query(f'position == "{player_type}"', inplace = True) 
    
    else:
        all_players = fullList.getlist().copy()

        if player_team != "None":
            all_players.query(f'school == "{player_team}"', inplace = True)

        if player_type != "None":
            all_players.query(f'position == "{player_type}"', inplace = True)

    all_players["search_name"] = all_players["name"].str.lower()

    all_players = all_players[all_players["search_name"].str.contains(player_name.lower())]

    all_players = all_players.drop("search_name", axis=1)

    return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]


@app.get("/players/search/by_id/{player_id}", tags=["Player Info"])
async def search_for_players_by_id(player_id : int) -> playerInfo:

    return search_player(fullList, player_id)


@app.get("/lists/populate")
async def populate_player_lists():
    if not(fullList.populated):
        fullList.populate()

        if not(firstStrings.populated):
            firstStrings.populate()
        
        return "Lists has been populated!"
    elif not(firstStrings.populated):
        firstStrings.populate()

        return "First Stringers have been populated!"
    else:
        return "Already populated."


@app.get("/players/getall", tags=["Player Info"])
async def get_all_players(page = 1, page_size= 100):

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    if not(fullList.populated):
        fullList.populate()

        all_players = fullList.getlist().copy()

        all_players = all_players[start:end]

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]
    
    else:
        all_players = fullList.getlist().copy()

        all_players = all_players[start:end]

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()] 


@app.get("/players/get_first_string", tags=["Player Info"])
async def get_all_first_string_players(page = 1, page_size= 100):

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    if not(firstStrings.populated):
        firstStrings.populate()

        all_players = firstStrings.getlist().copy()

        all_players = all_players[start:end]

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]
    
    else:
        all_players = firstStrings.getlist().copy()

        all_players = all_players[start:end]

        return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()] 


@app.get("/player/{player_id}/stats/full_year", tags=["Player Info"])
async def get_player_stats_for_whole_year(player_id : int, season : Season) -> playerStats:
    player = search_player(fullList, player_id)

    team = player.player_team

    url = f"https://api.collegefootballdata.com/stats/player/season?year={season.value}&team={team.replace("&", "%26")}"

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)

    response.text

    response_json = json.loads(response.text)

    stats_df = pd.json_normalize(response_json)

    stats_df["stat"] = pd.to_numeric(stats_df["stat"])

    stats_df.query(f'playerId == "{player_id}"', inplace = True)

    stats_df.drop(['team', 'conference'], axis=1, inplace=True)

    try:
        pass_TD = stats_df.query(f'category == "passing" and statType == "TD"').iloc[0]['stat']
    except IndexError:
        pass_TD = 0

    try:
        pass_yds = stats_df.query(f'category == "passing" and statType == "YDS"').iloc[0]['stat']
    except IndexError:
        pass_yds = 0

    try:
        ints = stats_df.query(f'category == "passing" and statType == "INT"').iloc[0]['stat']
    except IndexError:
        ints = 0

    try:
        fumbles = stats_df.query(f'category == "fumbles" and statType == "LOST"').iloc[0]['stat']
    except IndexError:
        fumbles = 0

    try:
        rush_yds = stats_df.query(f'category == "rushing" and statType == "YDS"').iloc[0]['stat']
    except IndexError:
        rush_yds = 0

    try:
        rush_TD = stats_df.query(f'category == "rushing" and statType == "TD"').iloc[0]['stat']
    except IndexError:
        rush_TD = 0

    try:
        rec_yds = stats_df.query(f'category == "receiving" and statType == "YDS"').iloc[0]['stat']
    except IndexError:
        rec_yds = 0

    try:
        rec_TD = stats_df.query(f'category == "receiving" and statType == "TD"').iloc[0]['stat']
    except IndexError:
        rec_TD = 0

    try:
        rec_avg = stats_df.query(f'category == "receiving" and statType == "YPR"').iloc[0]['stat']
    except IndexError:
        rec_avg = 0

    if rec_avg != 0:
        receptions = round((rec_yds / rec_avg), 0)
    else:
        receptions = 0
    
    try:
        xp = stats_df.query(f'category == "kicking" and statType == "XPM"').iloc[0]['stat']
    except IndexError:
        xp = 0

    try:
        xp_a = stats_df.query(f'category == "kicking" and statType == "XPA"').iloc[0]['stat']
    except IndexError:
        xp_a = 0

    try:
        fgs = stats_df.query(f'category == "kicking" and statType == "FGM"').iloc[0]['stat']
    except IndexError:
        fgs = 0

    try:
        fg_a = stats_df.query(f'category == "kicking" and statType == "FGA"').iloc[0]['stat']
    except IndexError:
        fg_a = 0

    if fg_a != 0:
        fg_miss = fg_a - fgs
    else:
        fg_miss = 0

    if xp_a != 0:
        xp_miss = xp_a - xp
    else:
        xp_miss = 0

    return playerStats(player_name=stats_df.iloc[0]['player'], player_ID=stats_df.iloc[0]['playerId'], 
                       pass_TD=pass_TD, pass_yds=pass_yds, interceptions=ints, fumbles_lost=fumbles, rush_yds=rush_yds, 
                       rush_TD=rush_TD, reception_yds=rec_yds, reception_TD=rec_TD, receptions=receptions,
                       extra_points=xp, field_goals=fgs, extra_points_missed=xp_miss, field_goals_missed=fg_miss,
                       player_position=player.player_position)


@app.get("/player/{player_id}/stats/last_game", tags=["Player Info"])
async def get_last_game_stats_for_player(player_id : int) -> playerStats:
  player = search_player(fullList, player_id)
  last_game = get_player_last_game(player.player_team, fullList.active_season)
  
  plyr_name = player.player_name
  plyr_id = player.player_id
  plyr_pos = player.player_position

  game_id = last_game.game_id

  url = f"https://api.collegefootballdata.com/games/players?year={fullList.active_season}&seasonType=regular&gameId={game_id}"

  headers = {"Authorization": f"Bearer {token}"}

  response = requests.get(url, headers=headers)

  teams_json = json.loads(response.text)

  teams_df = pd.json_normalize(teams_json)

  xp=0
  xp_miss=0
  fgs=0
  fg_miss=0
  fumbles=0
  pass_TD=0
  ints=0
  pass_yds=0
  rush_yds = 0
  rush_TD=0
  rec_yds=0
  rec_TD=0
  receptions = 0

  if str(teams_df.iloc[0]['teams'][1]).find(str(player_id)) != -1:
    team = teams_df.iloc[0]['teams'][1]
  else:
    team = teams_df.iloc[0]['teams'][0]

  for category in team['categories']:
    
    cat_name = category['name']
    
    if cat_name == 'kicking':
      types = category['types']
      for stat_type in types:
        type_name = stat_type['name']
        if type_name == 'XP':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                xp_stats = player['stat'].split('/')
                xp = int(xp_stats[0])
                xp_miss = int(xp_stats[1]) - int(xp_stats[0])
          else:
              xp=0
              xp_miss=0
        elif type_name == 'FG':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                fg_stats = player['stat'].split('/')
                fgs = int(fg_stats[0])
                fg_miss = int(fg_stats[1]) - int(fg_stats[0])
          else:
              fgs=0
              fg_miss=0
      
    if cat_name == 'fumbles':
      types = category['types']
      for stat_type in types:
        type_name = stat_type['name']
        if type_name == 'LOST':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                fumbles = int(player['stat'])
          else:
              fumbles=0

    if cat_name == 'passing':
      types = category['types']
      for stat_type in types:
        type_name = stat_type['name']
        if type_name == 'TD':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                pass_TD = int(player['stat'])
          else:
              pass_TD=0
        elif type_name == 'INT':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                ints = int(player['stat'])
          else:
              ints=0
        elif type_name == 'YDS':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                pass_yds = int(player['stat'])
          else:
              pass_yds=0

    if cat_name == 'rushing':
      types = category['types']
      for stat_type in types:
        type_name = stat_type['name']
        if type_name == 'TD':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                rush_TD = int(player['stat'])
          else:
              rush_TD=0
        elif type_name == 'YDS':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                rush_yds = int(player['stat'])
          else:
              rush_yds=0

    if cat_name == 'receiving':
      types = category['types']
      for stat_type in types:
        type_name = stat_type['name']
        if type_name == 'TD':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                rec_TD = int(player['stat'])
          else:
              rec_TD=0
        elif type_name == 'YDS':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                rec_yds = int(player['stat'])
          else:
              rec_yds=0
        elif type_name == 'AVG':
          players = stat_type['athletes']
          player_found = (str(players).find(str(player_id)) != -1)
          if player_found:
            for player in players:
              id = player['id']
              if int(id) == (player_id):
                rec_avg = float(player['stat'])
          else:
              rec_avg=0

      if rec_avg != 0:
        receptions = round((rec_yds / rec_avg), 0)
      else:
        receptions = 0

  return playerStats(player_name=plyr_name, player_ID=plyr_id, 
                       pass_TD=pass_TD, pass_yds=pass_yds, interceptions=ints, fumbles_lost=fumbles, rush_yds=rush_yds, 
                       rush_TD=rush_TD, reception_yds=rec_yds, reception_TD=rec_TD, receptions=receptions,
                       extra_points=xp, field_goals=fgs, extra_points_missed=xp_miss, field_goals_missed=fg_miss,
                       player_position=plyr_pos)


@app.get("/{team_name}/D-ST/stats/last_game", tags=["D/ST"])
async def get_Defence_Special_Teams_last_game_stats(team_name : str) -> D_ST_Stats:
  last_game = get_team_last_game(team_name, fullList.active_season)

  game_id = last_game.game_id

  url = f"https://api.collegefootballdata.com/games/teams?year={fullList.active_season}&seasonType=regular&gameId={game_id}"

  headers = {"Authorization": f"Bearer {token}"}

  response = requests.get(url, headers=headers)

  game_json = json.loads(response.text)

  game_df = pd.json_normalize(game_json)

  punt_TD = 0
  kick_TD = 0
  ints = 0
  pick6 = 0
  fumbles = 0
  tackles = 0
  sacks = 0
  pass_deflect = 0
  all_def_TD = 0

  if str(game_df.iloc[0]['teams'][1]['school']) == team_name:
    team = game_df.iloc[0]['teams'][1]
  else:
    team = game_df.iloc[0]['teams'][0]

  for stat in team['stats']:
    cat_name = stat['category']

    if cat_name == "puntReturnTDs":
      punt_TD = int(stat['stat'])
    elif cat_name == "kickReturnTDs":
      kick_TD = int(stat['stat'])
    elif cat_name == "passesIntercepted":
      ints = int(stat['stat'])
    elif cat_name == "interceptionTDs":
      pick6 = int(stat['stat'])
    elif cat_name == "fumblesRecovered":
      fumbles = int(stat['stat'])
    elif cat_name == "tackles":
      tackles = int(stat['stat'])
    elif cat_name == "sacks":
      sacks = int(stat['stat'])
    elif cat_name == "passesDeflected":
      pass_deflect = int(stat['stat'])
    elif cat_name == "defensiveTDs":
      all_def_TD = int(stat['stat'])


  misc_def_TD = all_def_TD - (punt_TD + kick_TD + pick6)

  return D_ST_Stats(team_name=team_name, tackles=tackles, punt_TDs=punt_TD,
                    kick_return_TDs=kick_TD, int_TDs=pick6, interceptions=ints, fumbles_recovered=fumbles,
                  other_defensive_TDs=misc_def_TD, sacks=sacks, deflected_passes=pass_deflect)


@app.get("/{team_name}/D-ST/stats/full_season", tags=["D/ST"])
async def get_Defence_Special_Teams_season_stats(team_name : str, season : Season) -> D_ST_Stats:
  url = f"https://api.collegefootballdata.com/stats/season?year={season.value}&team={team_name.replace("&", "%26")}"


  headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}


  response = requests.get(url, headers=headers)

  team_json = json.loads(response.text)

  team_df = pd.json_normalize(team_json)

  punt_TD= team_df.query(f'statName == "puntReturnTDs"').iloc[0]['statValue']
  kick_TD= team_df.query(f'statName == "kickReturnTDs"').iloc[0]['statValue']
  ints= team_df.query(f'statName == "passesIntercepted"').iloc[0]['statValue']
  pick6= team_df.query(f'statName == "interceptionTDs"').iloc[0]['statValue']
  fumbles= team_df.query(f'statName == "fumblesRecovered"').iloc[0]['statValue']
  sacks= team_df.query(f'statName == "sacks"').iloc[0]['statValue']


  all_games = team_schedule(team_name, season.value)

  tackles = 0
  pass_deflect = 0
  all_def_TD = 0

  for game in all_games:
    game_id = game.game_id
    curr_url = f"https://api.collegefootballdata.com/games/teams?year={season.value}&seasonType=regular&gameId={game_id}"

    curr_response = requests.get(curr_url, headers=headers)

    curr_json = json.loads(curr_response.text)

    curr_df = pd.json_normalize(curr_json)

    if not(curr_df.empty):
      if str(curr_df.iloc[0]['teams'][1]['school']) == team_name:
        team = curr_df.iloc[0]['teams'][1]
      else:
        team = curr_df.iloc[0]['teams'][0]

      for stat in team['stats']:
        cat_name = stat['category']

        if cat_name == "tackles":
          tackles = tackles + int(stat['stat'])
        elif cat_name == "passesDeflected":
          pass_deflect = pass_deflect + int(stat['stat'])
        elif cat_name == "defensiveTDs":
          all_def_TD = all_def_TD + int(stat['stat'])

  misc_def_TD= all_def_TD - (punt_TD + kick_TD + pick6)

  return D_ST_Stats(team_name=team_name, tackles=tackles, punt_TDs=punt_TD,
                    kick_return_TDs=kick_TD, int_TDs=pick6, interceptions=ints, fumbles_recovered=fumbles,
                  other_defensive_TDs=misc_def_TD, sacks=sacks, deflected_passes=pass_deflect)

@app.get("/predict/{player_id}/game", tags=["Prediction"])
async def predict_player_stats(player_id : str, opponent = "next") -> predictedStats:
    
    with open('model/opponent_classifier.pkl', 'rb') as fid:
      model_opp = pickle.load(fid)

    plyr = search_player(fullList, player_id)

    le = LabelEncoder()

    schedule = team_schedule(plyr.player_team, fullList.active_season)

    sched_df = pd.DataFrame([game.__dict__ for game in schedule])

    now = datetime.now()

    sched_df['start_date'] = pd.to_datetime(sched_df['start_date'])

    sched_df['start_date'] = sched_df['start_date'].dt.strftime('%Y-%m-%d')

    played_df = next_df = sched_df.query(f'start_date <= "{now.strftime("%Y-%m-%d")}"')

    games_played = len(played_df)

    year_stats = get_season_stats_per_game(fullList, player_id, games_played, fullList.active_season)

    if opponent == "next":
      next_df = sched_df.query(f'start_date > "{now.strftime("%Y-%m-%d")}"').copy()

      next_df.sort_values(by='start_date', inplace=True)

      next_df.reset_index(drop=True, inplace=True)

      next_game = fbGame(game_id=next_df.iloc[0]['game_id'], 
                          home_id=next_df.iloc[0]['home_id'], home_team=next_df.iloc[0]['home_team'], 
                          away_team=next_df.iloc[0]['away_team'], start_date=next_df.iloc[0]['start_date'])

      if next_game.home_team == plyr.player_team:
        opponent = next_game.away_team
      else:
        opponent = next_game.home_team

    test_QB = [[plyr.player_team.replace("&", "%26"), plyr.player_weight, plyr.player_height,
                  plyr.player_year, plyr.player_position, opponent.replace("&", "%26")]]
    df_test = pd.DataFrame(test_QB, columns=['team', 'weight', 'height', 'year', 'position', 'opponent'])

    for column in df_test.columns:
        if df_test[column].dtype == object:
          le.classes_ = np.load(f'model/{column} classes.npy', allow_pickle=True)
          df_test[column] = le.transform(df_test[column])

    test_QB = df_test.values.reshape(1, -1)
    test_results = model_opp.predict(test_QB)

    test_results.tolist()

    test_dict = {}

    test_dict['pass_TD'] = (round(test_results[0][0], 1) + year_stats.pass_TD)/2
    test_dict['xp'] = (round(test_results[0][1], 1) + year_stats.extra_points)/2
    test_dict['xp_miss'] = (round(test_results[0][2], 1) + year_stats.extra_points_missed)/2
    test_dict['fgs'] = (round(test_results[0][3], 1) + year_stats.field_goals)/2
    test_dict['fg_miss'] = (round(test_results[0][4], 1) + year_stats.field_goals_missed)/2
    test_dict['fumbles'] = (round(test_results[0][5], 1) + year_stats.fumbles_lost)/2
    test_dict['ints'] = (round(test_results[0][6], 1) + year_stats.interceptions)/2
    test_dict['pass_yds'] = (round(test_results[0][7], 1) + year_stats.pass_yds)/2
    test_dict['rush_yds'] = (round(test_results[0][8], 1) + year_stats.rush_yds)/2
    test_dict['rush_TD'] = (round(test_results[0][9], 1) + year_stats.rush_TD)/2
    test_dict['rec_yds'] = (round(test_results[0][10], 1) + year_stats.reception_yds)/2
    test_dict['rec_TD'] = (round(test_results[0][11], 1) + year_stats.reception_TD)/2
    test_dict['receptions'] = (round(test_results[0][12], 1) + year_stats.receptions)/2

    if year_stats.pass_TD == 0:
      test_dict['pass_TD'] = 0
    if year_stats.extra_points == 0:
      test_dict['xp'] = 0
    if year_stats.extra_points_missed == 0:
      test_dict['xp_miss'] = 0
    if year_stats.field_goals == 0:
      test_dict['fgs'] = 0
    if year_stats.field_goals_missed == 0:
      test_dict['fg_miss'] = 0
    if year_stats.fumbles_lost == 0:
      test_dict['fumbles'] = 0
    if year_stats.interceptions == 0:
      test_dict['ints'] = 0
    if year_stats.pass_yds == 0:
      test_dict['pass_yds'] = 0
    if year_stats.rush_yds == 0:
      test_dict['rush_yds'] = 0
    if year_stats.rush_TD == 0:
      test_dict['rush_TD'] = 0
    if year_stats.reception_yds == 0:
      test_dict['rec_yds'] = 0
    if year_stats.reception_TD == 0:
      test_dict['rec_TD'] = 0
    if year_stats.receptions == 0:
      test_dict['receptions'] = 0

    for i in test_dict:
      test_dict[i] = float(round(abs(test_dict[i]), 1))
      if test_dict[i] <= 0.1:
        test_dict[i] = 0
      if i == 'receptions':
        test_dict[i] = round(test_dict[i], 0)
        if test_dict[i] == 0:
          test_dict["rec_yds"] = 0
          test_dict["rec_TD"] = 0

    return_stats = predictedStats(player_name=plyr.player_name,
                               player_ID=player_id, player_position=plyr.player_position,
                               pass_TD=test_dict["pass_TD"], pass_yds=test_dict["pass_yds"],
                               interceptions=test_dict["ints"], fumbles_lost=test_dict["fumbles"],
                               rush_yds=test_dict["rush_yds"], rush_TD=test_dict["rush_TD"],
                               reception_yds=test_dict["rec_yds"], reception_TD=test_dict["rec_TD"],
                               receptions=test_dict["receptions"], extra_points=test_dict["xp"],
                               extra_points_missed=test_dict["xp_miss"], field_goals=test_dict["fgs"],
                               field_goals_missed=test_dict["fg_miss"])
    
    return return_stats


@app.get("/predict/season/{player_id}", tags=["Prediction"])
async def predict_player_season(player_id : str) -> predictedStats:
    with open('model/my_dumped_classifier.pkl', 'rb') as fid:
      model = pickle.load(fid)

    NUM_GAMES = 12

    plyr = search_player(fullList, player_id)

    le = LabelEncoder()

    input_list = [[plyr.player_team.replace("&", "%26"), plyr.player_weight, plyr.player_height,
              plyr.player_year, plyr.player_position]]
    
    df_input = pd.DataFrame(input_list, columns=['team', 'weight', 'height', 'year', 'position'])

    for column in df_input.columns:
        if df_input[column].dtype == object:
          le.classes_ = np.load(f'model/{column} classes.npy', allow_pickle=True)
          df_input[column] = le.transform(df_input[column])

    input_list = df_input.values.reshape(1, -1)
    test_results = model.predict(input_list)

    test_dict = {}

    test_dict['pass_TD'] = round(test_results[0][0], 1)
    test_dict['xp'] = round(test_results[0][1], 1)
    test_dict['xp_miss'] = round(test_results[0][2], 1)
    test_dict['fgs'] = round(test_results[0][3], 1)
    test_dict['fg_miss'] = round(test_results[0][4], 1)
    test_dict['fumbles'] = round(test_results[0][5], 1)
    test_dict['ints'] = round(test_results[0][6], 1)
    test_dict['pass_yds'] = round(test_results[0][7], 1)
    test_dict['rush_yds'] = round(test_results[0][8], 1)
    test_dict['rush_TD'] = round(test_results[0][9], 1)
    test_dict['rec_yds'] = round(test_results[0][10], 1)
    test_dict['rec_TD'] = round(test_results[0][11], 1)
    test_dict['receptions'] = round(test_results[0][12], 1)

    for i in test_dict:
      test_dict[i] = abs(test_dict[i])
      if test_dict[i] <= 0.1:
        test_dict[i] = 0
      if i == 'receptions':
        test_dict[i] = round(test_dict[i], 0)
        if test_dict[i] == 0:
          test_dict["rec_yds"] = 0
          test_dict["rec_TD"] = 0
      if i == "xp" or i == 'fgs':
         test_dict[i] = int(test_dict[i])



    return_stats = predictedStats(player_name=plyr.player_name,
                               player_ID=player_id, player_position=plyr.player_position,
                               pass_TD=round(test_dict["pass_TD"]*NUM_GAMES, 1), 
                               pass_yds=round(test_dict["pass_yds"]*NUM_GAMES, 1),
                               interceptions=round(test_dict["ints"]*NUM_GAMES, 1), 
                               fumbles_lost=round(test_dict["fumbles"]*NUM_GAMES, 1),
                               rush_yds=round(test_dict["rush_yds"]*NUM_GAMES, 1), 
                               rush_TD=round(test_dict["rush_TD"]*NUM_GAMES, 1),
                               reception_yds=round(test_dict["rec_yds"]*NUM_GAMES, 1), 
                               reception_TD=round(test_dict["rec_TD"]*NUM_GAMES, 1),
                               receptions=round(test_dict["receptions"]*NUM_GAMES, 1), 
                               extra_points=round(test_dict["xp"]*NUM_GAMES, 1),
                               extra_points_missed=round(test_dict["xp_miss"]*NUM_GAMES, 1), 
                               field_goals=round(test_dict["fgs"]*NUM_GAMES, 1),
                               field_goals_missed=round(test_dict["fg_miss"]*NUM_GAMES, 1))

    
    return return_stats

@app.get("/predict/D-ST/{team_name}", tags=["Prediction"])
async def predict_Defence_Special_Teams_stats(team_name : str, opponent = "next") -> D_ST_Stats:
  
  with open('model/defensive_model.pkl', 'rb') as fid:
      defensive_model = pickle.load(fid)

  le = LabelEncoder()

  if opponent == "next":
    schedule = team_schedule(team_name, fullList.active_season)

    sched_df = pd.DataFrame([game.__dict__ for game in schedule])

    now = datetime.now()

    sched_df['start_date'] = pd.to_datetime(sched_df['start_date'])

    sched_df['start_date'] = sched_df['start_date'].dt.strftime('%Y-%m-%d')

    sched_df = sched_df.query(f'start_date > "{now.strftime("%Y-%m-%d")}"')

    sched_df.sort_values(by='start_date', inplace=True)

    sched_df.reset_index(drop=True, inplace=True)

    next_game = fbGame(game_id=sched_df.iloc[0]['game_id'], 
                    home_id=sched_df.iloc[0]['home_id'], home_team=sched_df.iloc[0]['home_team'], 
                    away_team=sched_df.iloc[0]['away_team'], start_date=sched_df.iloc[0]['start_date'])     
    
    if next_game.home_team == team_name:
       opponent = next_game.away_team
    else:
       opponent = next_game.home_team
  
  defense = [[team_name.replace("&", "%26"), opponent.replace("&", "%26")]]
  df_def = pd.DataFrame(defense, columns=['team', 'opponent'])

  for column in df_def.columns:
      if df_def[column].dtype == object:
        le.classes_ = np.load(f'model/{column} classes.npy', allow_pickle=True)
        df_def[column] = le.transform(df_def[column])

  test_DST = df_def.values.tolist()
  test_DST = test_DST[0]
  test_DST
  
  defense = df_def.values.reshape(1, -1)
  test_results = defensive_model.predict(defense)

  test_dict = {}



  test_dict['tackles'] = abs(round(test_results[0][0], 0))
  test_dict['punt_TDs'] = abs(round(test_results[0][1], 0))
  test_dict['kick_return_TDs'] = abs(round(test_results[0][2], 0))
  test_dict['int_TDs'] = abs(round(test_results[0][3], 0))
  test_dict['interceptions'] = abs(round(test_results[0][4], 0))
  test_dict['fumbles_recovered'] = abs(round(test_results[0][5], 0))
  test_dict['other_defensive_TDs'] = abs(round(test_results[0][6], 0))
  test_dict['sacks'] = abs(round(test_results[0][7], 0))
  test_dict['deflected_passes'] = abs(round(test_results[0][8], 0))
  
  return D_ST_Stats(team_name=team_name, tackles=test_dict['tackles'], 
                     punt_TDs=test_dict['punt_TDs'], 
                     kick_return_TDs=test_dict['kick_return_TDs'], 
                     int_TDs=test_dict['int_TDs'], 
                     interceptions=test_dict['interceptions'], 
                     fumbles_recovered=test_dict['fumbles_recovered'], 
                     other_defensive_TDs=test_dict['other_defensive_TDs'], 
                     sacks=test_dict['sacks'], 
                     deflected_passes=test_dict['deflected_passes'])


@app.get("/predict/season/D-ST/{team_name}", tags=["Prediction"])
async def predict_Defense_Special_Teams_season(team_name : str) -> D_ST_Stats:
  
  NUM_GAMES = 12

  with open('model/def_season_model.pkl', 'rb') as fid:
      defensive_model = pickle.load(fid)

  le = LabelEncoder()
  
  defense = [[team_name.replace("&", "%26")]]
  df_def = pd.DataFrame(defense, columns=['team'])

  for column in df_def.columns:
      if df_def[column].dtype == object:
        le.classes_ = np.load(f'model/{column} classes.npy', allow_pickle=True)
        df_def[column] = le.transform(df_def[column])

  test_DST = df_def.values.tolist()
  test_DST = test_DST[0]
  test_DST
  
  defense = df_def.values.reshape(1, -1)
  test_results = defensive_model.predict(defense)

  test_dict = {}

  test_dict['tackles'] = (round(test_results[0][0], 1))
  test_dict['punt_TDs'] = (round(test_results[0][1], 1))
  test_dict['kick_return_TDs'] = (round(test_results[0][2], 1))
  test_dict['int_TDs'] = (round(test_results[0][3], 1))
  test_dict['interceptions'] = (round(test_results[0][4], 1))
  test_dict['fumbles_recovered'] = (round(test_results[0][5], 1))
  test_dict['other_defensive_TDs'] = (round(test_results[0][6], 1))
  test_dict['sacks'] = (round(test_results[0][7], 1))
  test_dict['deflected_passes'] = (round(test_results[0][8], 1))

  for i in test_dict:
    if test_dict[i] <= 0.1:
      test_dict[i] = 0

  for i in test_dict:
    test_dict[i] = test_dict[i] * NUM_GAMES
    test_dict[i] = round(test_dict[i], 0)

  return D_ST_Stats(team_name=team_name, tackles=test_dict['tackles'], 
                     punt_TDs=test_dict['punt_TDs'], 
                     kick_return_TDs=test_dict['kick_return_TDs'], 
                     int_TDs=test_dict['int_TDs'], 
                     interceptions=test_dict['interceptions'], 
                     fumbles_recovered=test_dict['fumbles_recovered'], 
                     other_defensive_TDs=test_dict['other_defensive_TDs'], 
                     sacks=test_dict['sacks'], 
                     deflected_passes=test_dict['deflected_passes'])

#BASKETBALL ENDPOINTS

@app.get("/bb/teams/{team_name}", tags=["Basketball", "Team Info"])
async def get_schedule(team_name: str, season : Season) -> list[fbGame]:
  
  game_list = s.get_team_schedule(team_name, season.value)
  
  return_list = []
  pst = pytz.timezone('US/Pacific')


  for row in game_list.iterrows():
      game_info = s.get_game_info(row[1]["game_id"])

      combined_str = f"{row[1]['game_day']} {row[1]['game_time']}"
      naive_datetime = datetime.strptime(combined_str, '%B %d, %Y %I:%M %p PST')
      pst_datetime = pst.localize(naive_datetime)
      utc_datetime = pst_datetime.astimezone(pytz.utc)
      final_date = utc_datetime.strftime('%Y-%m-%dT%H:%M:%S.000Z')

      curr_game = fbGame(game_id=row[1]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=final_date)
      
      return_list.append(curr_game)

  
  return return_list


#DRAFT ENDPOINTS
@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })



app.include_router(draft_router, tags=["Draft"])
