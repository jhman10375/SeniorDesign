import ast
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.routes.footballDraft import router as football_draft_router
from api.routes.soccerDraft import router as soccer_draft_router
from api.routes.baseballDraft import router as baseball_draft_router
from api.routes.basketballDraft import router as basketball_draft_router
from api.routes.authentication import router as authentication_router

import requests
from datetime import datetime
import numpy as np
import pandas as pd
import json
import pickle
import os
from classes import *
from bs4 import BeautifulSoup
from functions import *
from dotenv import load_dotenv
from sklearn.preprocessing import LabelEncoder
import cbbpy.mens_scraper as s
from utils.cbbpy_utils import _get_id_from_team

fullList = playerList()

firstStrings = firstStringList(fullList)

bkbList = bkbPlayers(fullList)

bsbList = bsbPlayers(fullList)

sccList = sccPlayers(fullList)

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

@app.get("/schools/get_all", tags=["School Info"])
async def get_all_schools() -> list[school]:
   return all_schools()

@app.get("/schools/get_by_name/{team_name}", tags=["School Info"])
async def get_school_by_name(team_name) -> school | None:
   return school_by_name(team_name)

@app.get("/team/get_by_id/{team_id}", tags=["Team Info"])
async def get_team_by_id(team_id):
   return team_by_id(team_id)

@app.get("/teams/logos/{}")
async def get_team_logos() -> list[teamLogo]:

    return team_logos()

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


@app.get("/players/search/by_ids", tags=["Player Info"])
async def search_for_players_by_ids(player_ids = ['']) -> List[playerInfo]:
    print(player_ids)
    ids = ast.literal_eval(player_ids)
    players = []
    for id in ids:
        players.append(search_player(fullList, id))
    return players


@app.get("/lists/repopulate")
async def repopulate_player_lists():
    fullList.populate()
    print("Football Players done")
    firstStrings.populate()
    print("Football First Stringers done")
    bkbList.populate()
    print("Basketball Players done")
    bkbList.populate_first_string()
    print("Basketball First Stringers done")
    bsbList.populate()
    print("Baseball Teams done")
    bsbList.populate_players()
    print("Baseball Players done")
    bsbList.populate_first_string()
    print("Baseball First Stringers done")
    sccList.populate()
    print("Soccer Teams done")
    sccList.populate_players()
    print("Soccer Players done")
    sccList.populate_first_string()
    print("Soccer First Stringers done")


    if (fullList.populated and firstStrings.populated 
        and bkbList.populated and bkbList.first_string_populated
        and bsbList.populated and bsbList.players_populated
        and sccList.populated and sccList.players_populated
        and bsbList.first_string_populated
        and sccList.first_string_populated):
       return "All lists populated!"
    else:
       return "Something went wrong"


@app.get("/players/getall", tags=["Player Info"])
async def get_all_players(page = 1, page_size= 100) -> list[playerInfo]:

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

    team = player.player_team.replace("&", "%26")

    url = f"https://api.collegefootballdata.com/stats/player/season?year={season.value}&team={team}"

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
  team = team_name.replace("&", "%26")
  url = f"https://api.collegefootballdata.com/stats/season?year={season.value}&team={team}"


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


@app.get("/predict/full_info", tags=["Prediction", "Player Info"])
async def get_first_string_info_with_predictions(page = 1, page_size= 100) -> list[fbPlayerWithStats]:
    players = fb_first_strings(firstStrings, page, page_size)

    stats = []

    for player in players:
        stats.append(fb_predict_season(player.player_id, fullList))


    return [fbPlayerWithStats(
        player_id = plyr[0].player_id,
        player_name = plyr[0].player_name,
        player_position = plyr[0].player_position,
        player_jersey = plyr[0].player_jersey,
        player_height = plyr[0].player_height,
        player_weight = plyr[0].player_weight,
        player_team = plyr[0].player_team,
        player_year = plyr[0].player_year,
        team_color = plyr[0].team_color,
        team_alt_color = plyr[0].team_alt_color,
        team_logos = plyr[0].team_logos,
        stats = plyr[1] )
    
    for plyr in zip(players, stats)]


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

@app.get("/bkb/teams/{team_name}", tags=["Basketball", "Basketball - Team Info"])
async def get_basketball_schedule(team_name: str, season : Season) -> list[fbGame]:
  
  game_list = s.get_team_schedule(team_name, season.value)
  
  return_list = []


  for row in game_list.iterrows():
      game_info = s.get_game_info(row[1]["game_id"])

      final_date = bkbPlayers.to_utc(row[1])

      curr_game = fbGame(game_id=row[1]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=final_date)
      
      return_list.append(curr_game)

  
  return return_list


@app.get("/bkb/teams/{team_name}/last_game", tags=["Basketball", "Basketball - Team Info"])
async def get_last_basketball_game(team_name: str) -> fbGame:
  sched_df = s.get_team_schedule(team_name)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  sched_df = sched_df.query(f'datetime <= "{now.strftime("%Y-%m-%d")}"')

  sched_df.sort_values(by='datetime', inplace=True, ascending=False)

  sched_df.reset_index(drop=True, inplace=True)

  game_info = s.get_game_info(sched_df.iloc[0]["game_id"])

  last_game = fbGame(game_id=sched_df.iloc[0]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=sched_df.iloc[0]["datetime"])

  return last_game


@app.get("/bkb/teams/{team_name}/next_game", tags=["Basketball", "Basketball - Team Info"])
async def get_next_basketball_game(team_name: str) -> fbGame:
  sched_df = s.get_team_schedule(team_name)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  sched_df = sched_df.query(f'datetime > "{now.strftime("%Y-%m-%d")}"')

  sched_df.sort_values(by='datetime', inplace=True, ascending=True)

  sched_df.reset_index(drop=True, inplace=True)

  game_info = s.get_game_info(sched_df.iloc[0]["game_id"])

  next_game = fbGame(game_id=sched_df.iloc[0]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=sched_df.iloc[0]["datetime"])

  return next_game


@app.get("/bkb/teams/{team_name}/players", tags=["Basketball", "Basketball - Team Info"])
async def get_basketball_players(team_name : str, player_type = "None") -> list[playerInfo]:
  if not(fullList.populated):
          fullList.populate()

  team_list = fullList.getlist().copy()
  team_list.query(f'school == "{team_name}"', inplace = True)

  if team_list.empty:
    color = '#152532'
    alt_color = '#c8caca'
    logos = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
  else:   
    team_info = team_list.iloc[0]
    color = team_info["color"]
    alt_color = team_info["alt_color"]
    logos = str(team_info["logos"])

  team_id = _get_id_from_team(team_name, datetime.now().year, "mens")[0]

  url = f'https://www.espn.com/mens-college-basketball/team/roster/_/id/{team_id}/'
  headers = {'User-Agent': 'Mozilla/5.0'}
  response = requests.get(url, headers=headers)
  if response.status_code == 200:
      html_content = response.text
  else:
      print(f'Failed to retrieve the page. Status code: {response.status_code}')
  soup = BeautifulSoup(html_content, 'html.parser')
  roster_table = soup.find('table', {'class': 'Table'})
  if roster_table:
      players = []
      for row in roster_table.find_all('tr')[1:]:  # Skip the header row
          cols = row.find_all('td')
          if len(cols) >= 5:
              id_html = cols[0].find('a')
              raw_name = cols[1].text.strip()
              num_start = 0
              jers_shown = False
              for i, char in enumerate(raw_name):
                  if char.isdigit():
                      num_start = i
                      jers_shown = True
                      break
              if jers_shown:
                name = raw_name[:num_start]
                number = raw_name[num_start:]
              else:
                 name = raw_name
                 number = -1
              position = cols[2].text.strip()
              raw_height = cols[3].text.strip()
              height = (int(raw_height[:raw_height.find("'")].replace("-", "0"))*12
                          +int(raw_height[raw_height.find("'")+1:raw_height.find("'")+4].replace('"', '').replace("--", "-1").replace("-", "-1")))
              weight = cols[4].text.strip().replace(" lbs", "").replace("--", "-1")
              pl_class = cols[5].text.strip()
              match pl_class:
                  case 'FR':
                      year = 1
                  case 'SO':
                      year = 2
                  case 'JR':
                      year = 3
                  case 'SR':
                      year = 4
                  case _:
                      year = 0

              # Extract player ID from the href attribute of the link
              player_id = None
              if id_html and 'href' in id_html.attrs:
                  href = id_html['href']
                  # Extract the numeric player ID from the href (e.g., '/mens-college-basketball/player/_/id/12345/')
                  player_id = href.split('/')[-2] if 'player/_/id/' in href else None
              players.append({
                  'id': player_id,
                  'jersey': int(number),
                  'name': name,
                  'position': position,
                  'height': height,
                  'weight': int(weight),
                  'year' : year
              })
  else:
      print('Roster table not found.')

  players_df = pd.DataFrame(players)    

  if player_type != "None":
     players_df.query(f'position == "{player_type}"', inplace = True)


  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=team_info["school"],
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=color, 
                           team_alt_color=alt_color, team_logos=logos) for player in players_df.itertuples()] 


@app.get("/bkb/players/search/by_name/{player_name}", tags=["Basketball", "Basketball - Player Info"])
async def search_for_basketball_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[playerInfo]:
  players_df = bkbList.df
  filtered_df = players_df[players_df['name'].str.contains(player_name, case=False, na=False)]
  
  if player_type != "None":
     filtered_df = filtered_df.query(f'position == "{player_type}"')
  
  if player_team != "None":
     filtered_df = filtered_df.query(f'team == "{player_team}"')
  
  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=player.logos) for player in filtered_df.itertuples()] 


@app.get("/bkb/players/search/by_id/{player_id}", tags=["Basketball", "Basketball - Player Info"])
async def search_for_basketball_players_by_id(player_id : int) -> playerInfo:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  return playerInfo(player_id=player_details["id"], player_name=player_details["name"], 
                           player_jersey=player_details['jersey'], 
                           player_position=player_details['position'], 
                           player_team=player_details['team'],
                           player_height=player_details['height'], 
                           player_weight=player_details['weight'],
                           player_year=player_details['year'], 
                           team_color=player_details['color'], 
                           team_alt_color=player_details['alt_color'], 
                           team_logos=player_details['logos']) 


@app.get("/bkb/players/getall", tags=["Basketball", "Basketball - Player Info"])
async def get_all_basketball_players(page = 1, page_size= 100) -> list[playerInfo]:
  players_df = bkbList.df

  start = (int(page) - 1)*int(page_size)

  end =  ((int(page) - 1)*int(page_size))+int(page_size)

  filtered_df = players_df[start:end]
  
  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=player.logos) for player in filtered_df.itertuples()] 


@app.get("/bkb/players/get_first_string", tags=["Basketball", "Basketball - Player Info"]) 
async def get_all_first_string_basketball_players(page = 1, page_size= 100) -> list[playerInfo]:

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    all_players = bkbList.first_string_df.copy()

    all_players = all_players[start:end]

    return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]

@app.get("/bkb/player/{player_id}/stats/last_game", tags=["Basketball", "Basketball - Player Info"])
async def get_last_game_stats_for_basketball_player(player_id : int) -> bkbStats:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  last_game_id = get_bkb_last_game_id(player_details["team"])

  last_game_stats = s.get_game_boxscore(last_game_id)[['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to']]
  
  player_stats = last_game_stats.query(f'player_id == "{player_id}"')

  if player_stats.empty:
     return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=0,
                     two_pointers=0,
                     free_throws=0,
                     rebounds=0,
                     assists=0,
                     blocked_shots=0,
                     steals=0,
                     turnovers=0)

  else:
     player_stats = player_stats.iloc[0]
     return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=player_stats["3pm"],
                     two_pointers=player_stats["2pm"],
                     free_throws=player_stats["ftm"],
                     rebounds=player_stats["reb"],
                     assists=player_stats['ast'],
                     blocked_shots=player_stats['blk'],
                     steals=player_stats['stl'],
                     turnovers=player_stats['to'])


@app.get("/bkb/player/{player_id}/stats/full_year", tags=["Basketball", "Basketball - Player Info"])
async def get_basketball_player_season_stats(player_id : int, season : Season) -> bkbStats:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  played_games = get_bkb_played_games(player_details["team"], season.value)["game_id"].astype('int').values.tolist()

  stats_df = pd.DataFrame(columns=['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to'])
  
  for game in played_games:
    curr_game_stats = s.get_game_boxscore(game)[['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to']]
    
    curr_stats = curr_game_stats.query(f'player_id == "{player_id}"')
    
    if not(curr_stats.empty):
        stats_df.loc[len(stats_df)] = curr_stats.iloc[0]

  return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=stats_df["3pm"].sum(),
                     two_pointers=stats_df["2pm"].sum(),
                     free_throws=stats_df["ftm"].sum(),
                     rebounds=stats_df["reb"].sum(),
                     assists=stats_df['ast'].sum(),
                     blocked_shots=stats_df['blk'].sum(),
                     steals=stats_df['stl'].sum(),
                     turnovers=stats_df['to'].sum())


#BASEBALL ENDPOINTS

@app.get("/bsb/teams/{team_name}", tags=["Baseball", "Baseball - Team Info"])
async def get_baseball_schedule(team_name: str, season : Season) -> list[bbGame]:

  teams_df = bsbList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  year = season.value
  try:
      
      
          driver = webdriver.Chrome()
      
          # Open the NCAA rankings page
          driver.get(f"https://stats.ncaa.org/teams/{team_id}")

          if year != datetime.now().year: 
              year_str = str(int(year) - 1) + '-' + str(year)[-2:]
      
              wait = WebDriverWait(driver, 10)
              
              # Select "year" from the year dropdown
              year_dropdown = wait.until(EC.presence_of_element_located((By.ID, "year_list")))
              Select(year_dropdown).select_by_visible_text(year_str)

      
          # Wait for the table to load
          wait = WebDriverWait(driver, 10)
          table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='card-body']//table")))
      
          # Extract rows from the table
          rows = table.text.split('\n')

          #rows = table.find_elements(By.XPATH, ".//tbody/tr")
          games = []
        
          for index in range(1,len(rows)):
              row = rows[index]
              
              if row[0] == '@':
                  continue
              
              if row[0:4] == str(year):
                  continue
          
              date = row[:row.rfind('/')+5]
              date_list = date.split('/')
              #print(f'{date=}')
      
              year = date_list[2]
              year_format = year[-2:]
              year_format

              #print(f'{date_list=}')
              #print(f'{year=}')
              
              date_format = date[:date.rfind('/')+1]
              #print(f'{date_format=}')
              datetime_str = date_format + year_format + ' 00:00:00'
              
              game_date = datetime.strptime(datetime_str, '%m/%d/%y %H:%M:%S')

              if game_date <= datetime.now():
                      last_W = row.rfind('W')
                      last_L = row.rfind('L')
                  
                      if last_W == -1:
                          result_index = last_L
                      elif last_L == -1:
                          result_index = last_W
                      elif last_W > last_L:
                          result_index = last_W
                      else:
                          result_index = last_L
                  
                      if result_index != -1:
                          opp = row[row.find(date)+len(date):result_index].strip()
                      else:
                          opp = row[row.find(date)+len(date):].strip()
                  
                      if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                          opp = opp[opp.find(')')+1:].strip()
                  
                      if opp.find('#') != -1:
                          opp = row[row.find('#')+3:].strip()
                  
                      if (row != rows[-1]):
                          if (rows[index+1][0] == '@') or (rows[index+1][0:4] == str(year)):
                              home = False
                          elif opp.find('@') == -1:
                              home = True
                          else:
                              home = False
                              opp = opp.replace('@', '').strip()
                      else:
                          if opp.find('@') == -1:
                              home = True
                          else:
                              home = False
                              opp = opp.replace('@', '').strip()
              else:
                  if row.find('TBA') == -1:
                      opp = row[findnth(row,' ',2):].strip()
                  else:
                      opp = row[(row.find('TBA')+3):].strip()
      
      
                  if (row != rows[-1]):
                      if (rows[index+1][0] == '@'):
                          home = False
                      elif opp.find('@') == -1:
                          home = True
                      else:
                          home = False
                          opp = opp.replace('@', '').strip()
                  else:
                      if opp.find('@') == -1:
                          home = True
                      else:
                          home = False
                          opp = opp.replace('@', '').strip()

                          
              opp = opp.replace('Canceled', '').strip()
              if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                opp = opp[:opp.find('(')].strip()
              
              games.append({"date": str(game_date), "opponent": opp, "home": home})
  finally:
      # Close the browser
      driver.quit() 
      
  return_list = []

  for index in range(0,len(games)):

      game_id = str(year) + '-' + str(team_id) + '-' + str(index)

      if games[index]['home'] == True:
          home_id = team_id
          home_team = team_name
          away_team = games[index]['opponent']
      else:
          name = games[index]['opponent']
          opp_q = teams_df.query(f'name == "{name}"')

          if (opp_q.empty):
             opp_id = -1
          else:
             opp_id = opp_q.iloc[0]['id']

          home_id = opp_id
          home_team = games[index]['opponent']
          away_team = team_name
      
      curr_game = bbGame(game_id=game_id,home_id=home_id,
                        away_team=away_team,home_team=home_team,start_date=games[index]['date'])

      return_list.append(curr_game)
  
  return return_list


@app.get("/bsb/teams/{team_name}/last_game", tags=["Baseball", "Baseball - Team Info"])
async def get_last_baseball_game(team_name: str) -> bbGame:

  game_list = bsb_team_schedule(team_name, datetime.now().year, bsbList)

  games_df = pd.DataFrame(game_list)

  id_list = []
  h_team_list = []
  a_team_list = []
  h_id_list  = []
  date_list = []

  for tuple in games_df[0].values.tolist():
      id = tuple[1]
      id_list.append(id)

  for tuple in games_df[1].values.tolist():
      id = tuple[1]
      h_id_list.append(id)

  for tuple in games_df[2].values.tolist():
      team = tuple[1]
      h_team_list.append(team)

  for tuple in games_df[3].values.tolist():
      team = tuple[1]
      a_team_list.append(team)

  for tuple in games_df[4].values.tolist():
      date = tuple[1]
      date_list.append(date)

  games_df[games_df.iloc[0][0][0]] = id_list
  games_df[games_df.iloc[0][1][0]] = h_id_list
  games_df[games_df.iloc[0][2][0]] = h_team_list
  games_df[games_df.iloc[0][3][0]] = a_team_list
  games_df[games_df.iloc[0][4][0]] = date_list
  games_df.drop([0,1,2,3,4], axis=1, inplace=True)

  games_df['start_date'] = pd.to_datetime(games_df['start_date'])

  games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')

  games_df = games_df.query(f'start_date < "{datetime.now().strftime("%Y-%m-%d")}"')

  if games_df.empty:
      game_list = bsb_team_schedule(team_name, datetime.now().year-1, bsbList)

      games_df = pd.DataFrame(game_list)
      
      id_list = []
      h_team_list = []
      a_team_list = []
      h_id_list  = []
      date_list = []
      
      for tuple in games_df[0].values.tolist():
          id = tuple[1]
          id_list.append(id)
      
      for tuple in games_df[1].values.tolist():
          id = tuple[1]
          h_id_list.append(id)
      
      for tuple in games_df[2].values.tolist():
          team = tuple[1]
          h_team_list.append(team)
      
      for tuple in games_df[3].values.tolist():
          team = tuple[1]
          a_team_list.append(team)
      
      for tuple in games_df[4].values.tolist():
          date = tuple[1]
          date_list.append(date)
      
      games_df[games_df.iloc[0][0][0]] = id_list
      games_df[games_df.iloc[0][1][0]] = h_id_list
      games_df[games_df.iloc[0][2][0]] = h_team_list
      games_df[games_df.iloc[0][3][0]] = a_team_list
      games_df[games_df.iloc[0][4][0]] = date_list
      games_df.drop([0,1,2,3,4], axis=1, inplace=True)
      
      games_df['start_date'] = pd.to_datetime(games_df['start_date'])
      
      games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')
      
      games_df = games_df.query(f'start_date < "{datetime.now().strftime("%Y-%m-%d")}"')

  games_df.sort_values(by='start_date', inplace=True, ascending=False)

  games_df.reset_index(drop=True, inplace=True)

  last_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return last_game


@app.get("/bsb/teams/{team_name}/next_game", tags=["Baseball", "Baseball - Team Info"])
async def get_next_baseball_game(team_name: str) -> bbGame:

  game_list = bsb_team_schedule(team_name, datetime.now().year, bsbList)

  games_df = pd.DataFrame(game_list)

  id_list = []
  h_team_list = []
  a_team_list = []
  h_id_list  = []
  date_list = []

  for tuple in games_df[0].values.tolist():
      id = tuple[1]
      id_list.append(id)

  for tuple in games_df[1].values.tolist():
      id = tuple[1]
      h_id_list.append(id)

  for tuple in games_df[2].values.tolist():
      team = tuple[1]
      h_team_list.append(team)

  for tuple in games_df[3].values.tolist():
      team = tuple[1]
      a_team_list.append(team)

  for tuple in games_df[4].values.tolist():
      date = tuple[1]
      date_list.append(date)

  games_df[games_df.iloc[0][0][0]] = id_list
  games_df[games_df.iloc[0][1][0]] = h_id_list
  games_df[games_df.iloc[0][2][0]] = h_team_list
  games_df[games_df.iloc[0][3][0]] = a_team_list
  games_df[games_df.iloc[0][4][0]] = date_list
  games_df.drop([0,1,2,3,4], axis=1, inplace=True)

  games_df['start_date'] = pd.to_datetime(games_df['start_date'])

  games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')

  games_df = games_df.query(f'start_date > "{datetime.now().strftime("%Y-%m-%d")}"')

  games_df.sort_values(by='start_date', inplace=True, ascending=True)

  games_df.reset_index(drop=True, inplace=True)

  next_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return next_game


@app.get("/bsb/teams/{team_name}/players", tags=["Baseball", "Baseball - Team Info"])
async def get_baseball_players(team_name : str, player_type = "None") -> list[bbPlayer]:
  teams_df = bsbList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  try:
      
      driver = webdriver.Chrome()
      
          # Open the NCAA roster page
      driver.get(f"https://stats.ncaa.org/teams/{team_id}/roster")

      # Wait for the table to load
      wait = WebDriverWait(driver, 10)
      table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='dataTables_scrollBody']//table")))    

      # Extract rows from the table
      rows = rows = table.text.split('\n')

      player_list = []
      
      for index in range(1,len(rows)+1):
          player_info = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[4]/a')
      
          name = player_info.text
          id = int(player_info.get_attribute("href").split("/")[-1])
      
          year_raw = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[5]').text
      
          jersey = int(table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[3]').text)
      
          pos = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[6]').text
          
          height = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[7]').text
      
          bat_hand = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[8]').text
      
          throw_hand = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16840_data_table"]/tbody/tr[{index}]/td[9]').text

          player_list.append({'id': id, 'name': name, 'year': year_raw, 
                              'jersey': jersey, 'position': pos, 
                            'height': height, 'bat': bat_hand, 'throw': throw_hand})
          
  finally:
      # Close the browser
      driver.quit() 

  team_info = bsbList.details.query(f'school == "{team_name}"')
  if team_info.empty:
      team_color = "#152532"
      team_alt = "#c8caca"
      team_logos = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
  else:
      team_info = team_info.iloc[0]
      team_color = team_info['color']
      team_alt = team_info['alt_color']
      team_logos = team_info['logos']



  return_list = []

  for player in player_list:

      match player['year']:
          case 'Fr.':
              pl_year = 1
          case 'So.':
              pl_year = 2
          case 'Jr.':
              pl_year = 3
          case 'Sr.':
              pl_year = 4
          case _:
              pl_year = 0
      if player['height'] == '-':
            height = 0
      else:
            h_comps = player['height'].split('-')
            if len(h_comps[0]) >= 1:
                if len(h_comps[1]) >= 1:
                    height = int(h_comps[0])*12 + int(h_comps[1])  
                else:
                    height = int(h_comps[0])*12
            else:
                height = 0
      
      if player_type != 'None':
         if player['position'] == player_type:
          curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = height,
                          player_year=pl_year,
                          player_team = team_name,
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = team_color,
                          team_alt_color = team_alt,
                          team_logos = str(team_logos))
          return_list.append(curr)
      else:
        curr = bbPlayer(player_id=player["id"],
                        player_name=player["name"],
                        player_position=player["position"],
                        player_jersey = player['jersey'],
                        player_height = height,
                        player_year=pl_year,
                        player_team = team_name,
                        player_batting_hand = player['bat'],
                        player_throwing_hand = player['throw'],
                        team_color = team_color,
                        team_alt_color = team_alt,
                        team_logos = str(team_logos))
                      
                      
                      
        return_list.append(curr)
     

  return return_list                  


@app.get("/bsb/players/search/by_name/{player_name}", tags=["Baseball", "Baseball - Player Info"])
async def search_for_baseball_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[bbPlayer]:

  all_players = bsbList.players

  all_players["search_name"] = all_players["name"].str.lower()

  all_players = all_players[all_players["search_name"].str.contains(player_name.lower())]

  all_players = all_players.drop("search_name", axis=1)

  if player_team != "None":
      all_players.query(f'team == "{player_team}"', inplace = True)

  if player_type != "None":
      all_players.query(f'position == "{player_type}"', inplace = True)

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}
  
  all_players = all_players.fillna(nan_values)

  return_list = []

  for _, player in all_players.iterrows():
      curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)

  return return_list


@app.get("/bsb/players/search/by_id/{player_id}", tags=["Baseball", "Baseball - Player Info"])
async def search_for_baseball_players_by_id(player_id : int) -> bbPlayer:
  players_df = bsbList.players
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}

  player_details = player_details.fillna(nan_values)

  return_player = bbPlayer(player_id=player_details["id"],
                        player_name=player_details["name"],
                        player_position=player_details["position"],
                        player_jersey = player_details['jersey'],
                        player_height = player_details['height'],
                        player_year=player_details['year'],
                        player_team = player_details['team'],
                        player_batting_hand = player_details['bat'],
                        player_throwing_hand = player_details['throw'],
                        team_color = player_details['color'],
                        team_alt_color = player_details['alt_color'],
                        team_logos = player_details['logos']) 
  
  return return_player


@app.get("/bsb/players/getall", tags=["Baseball", "Baseball - Player Info"])
async def get_all_baseball_players(page = 1, page_size= 100) -> list[bbPlayer]:
  players_df = bsbList.players

  start = (int(page) - 1)*int(page_size)

  end =  ((int(page) - 1)*int(page_size))+int(page_size)

  filtered_df = players_df[start:end]

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
                'position': "None Listed"}

  filtered_df = filtered_df.fillna(nan_values)

  return_list = []

  for _, player in filtered_df.iterrows():
      curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)
  
  return return_list


@app.get("/bsb/player/{player_id}/stats/last_game", tags=["Baseball", "Baseball - Player Info"])
async def get_last_game_stats_for_baseball_player(player_id : int) -> bsbStats:
  players_df = bsbList.players
  player_details = players_df.query(f'id == {player_id}')
  
  try:
      player_details = player_details.iloc[0]
  except IndexError:
       return bsbStats(win=0, 
                             saves=0,
                             innings=0,
                             earned_runs_allowed=0,
                             singles=0,
                             doubles=0,
                             triples=0,
                             homers=0,
                             runs=0,
                             runs_batted_in=0,
                             walks=0,
                             hits_by_pitch=0,
                             stolen_bases=0,
                             caught_stealing=0,
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")

  position = player_details['position']

  last_game = bsb_last_game(player_details['team'], bsbList)

  if last_game.home_team != player_details['team']:
      opp = last_game.home_team 
  else:
      opp = last_game.away_team

  game_year = int(last_game.start_date[:4])

  if game_year != datetime.now().year:
      print('Warning: Last game not played in the current season')

  stats = get_bsb_game_info(player_id, last_game.start_date, opp, position, player_details['name'])

  return stats


@app.get("/bsb/player/{player_id}/stats/full_year", tags=["Baseball", "Baseball - Player Info"])
async def get_baseball_player_season_stats(player_id : int, season : Season) -> bsbStats:
    players_df = bsbList.players
    player_details = players_df.query(f'id == {player_id}')
    
    try:
      player_details = player_details.iloc[0]
    except IndexError:
       return bsbStats(win=0, 
                             saves=0,
                             innings=0,
                             earned_runs_allowed=0,
                             singles=0,
                             doubles=0,
                             triples=0,
                             homers=0,
                             runs=0,
                             runs_batted_in=0,
                             walks=0,
                             hits_by_pitch=0,
                             stolen_bases=0,
                             caught_stealing=0,
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")
  

    return get_bsb_season_info(player_id,season.value,player_details['position'], player_details['name'])

@app.get("/bsb/players/get_first_string", tags=["Baseball", "Baseball - Player Info"]) 
async def get_all_first_string_baseball_players(page = 1, page_size= 100) -> list[bbPlayer]:

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    all_players = bsbList.first_string_df.copy()

    all_players = all_players[start:end]

    return [bbPlayer(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_batting_hand=str(player.bat),
                           player_throwing_hand=str(player.throw),
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]

#SOCCER ENDPOINTS


@app.get("/scc/teams/{team_name}", tags=["Soccer", "Soccer - Team Info"])
async def get_soccer_schedule(team_name: str, season : Season) -> list[bbGame]:

  teams_df = sccList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']
  

  year = season.value
  
  try:
      
      
          driver = webdriver.Chrome()
      
          # Open the NCAA rankings page
          driver.get(f"https://stats.ncaa.org/teams/{team_id}")

          if year != datetime.now().year: 
              year_str = str(int(year) - 1) + '-' + str(year)[-2:]
      
              wait = WebDriverWait(driver, 10)
              
              # Select "year" from the year dropdown
              year_dropdown = wait.until(EC.presence_of_element_located((By.ID, "year_list")))
              Select(year_dropdown).select_by_visible_text(year_str)

      
          # Wait for the table to load
          wait = WebDriverWait(driver, 10)
          table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='card-body']//table")))
      
          # Extract rows from the table
          rows = table.text.split('\n')

          #rows = table.find_elements(By.XPATH, ".//tbody/tr")
          games = []
        
          for index in range(1,len(rows)):
              row = rows[index]
              
              if row[0] == '@':
                  continue
              
              if row[0:4] == str(year):
                  continue
          
              date = row[:row.rfind('/')+5]
              date_list = date.split('/')
              #print(f'{date=}')
      
              year = date_list[2]
              year_format = year[-2:]
              year_format

              #print(f'{date_list=}')
              #print(f'{year=}')
              
              date_format = date[:date.rfind('/')+1]
              #print(f'{date_format=}')
              datetime_str = date_format + year_format + ' 00:00:00'
              
              game_date = datetime.strptime(datetime_str, '%m/%d/%y %H:%M:%S')

              if game_date <= datetime.now():
                      #print(f'{row.find('-')=}')
                      result_str = row[row.rfind('-')-2:row.rfind('-')+2]
                      #print(result_str)
                      
                      result_index = row.find(result_str)-1
                  
                      if result_index != -1:
                          opp = row[row.find(date)+len(date):result_index].strip()
                      else:
                          opp = row[row.find(date)+len(date):].strip()
                  
                      if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                          opp = opp[opp.find(')')+1:].strip()
                  
                      if opp.find('#') != -1:
                          opp = row[row.find('#')+3:].strip()
                  
                      if (row != rows[-1]):
                          if (rows[index+1][0] == '@') or (rows[index+1][0:4] == str(year)):
                              home = False
                          elif opp.find('@') == -1:
                              home = True
                          else:
                              home = False
                              opp = opp.replace('@', '').strip()
                      else:
                          if opp.find('@') == -1:
                              home = True
                          else:
                              home = False
                              opp = opp.replace('@', '').strip()
              else:
                  if row.find('TBA') == -1:
                      opp = row[findnth(row,' ',2):].strip()
                  else:
                      opp = row[(row.find('TBA')+3):].strip()
      
      
                  if (row != rows[-1]):
                      if (rows[index+1][0] == '@'):
                          home = False
                      elif opp.find('@') == -1:
                          home = True
                      else:
                          home = False
                          opp = opp.replace('@', '').strip()
                  else:
                      if opp.find('@') == -1:
                          home = True
                      else:
                          home = False
                          opp = opp.replace('@', '').strip()


              opp = opp.replace('@', '').strip()         
              opp = opp.replace('Canceled', '').strip()
              if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                opp = opp[:opp.find('(')].strip()
              
              games.append({"date": str(game_date), "opponent": opp, "home": home})
  finally:
      # Close the browser
      driver.quit() 
      #pass
      
  return_list = []

  for index in range(0,len(games)):

      game_id = str(year) + '-' + str(team_id) + '-' + str(index)

      if games[index]['home'] == True:
          home_id = team_id
          home_team = team_name
          away_team = games[index]['opponent']
      else:
          opp_q = teams_df.query(f'name == "{games[index]['opponent']}"')

          if (opp_q.empty):
             opp_id = -1
          else:
             opp_id = opp_q.iloc[0]['id']

          home_id = opp_id
          home_team = games[index]['opponent']
          away_team = team_name
      
      curr_game = bbGame(game_id=game_id,home_id=home_id,
                        away_team=away_team,home_team=home_team,start_date=games[index]['date'])

      return_list.append(curr_game)
  
  return return_list


@app.get("/scc/teams/{team_name}/last_game", tags=["Soccer", "Soccer - Team Info"])
async def get_last_soccer_game(team_name: str) -> bbGame:
   return scc_last_game(team_name, sccList)


@app.get("/scc/teams/{team_name}/next_game", tags=["Soccer", "Soccer - Team Info"])
async def get_next_soccer_game(team_name: str) -> bbGame:
  game_list = scc_team_schedule(team_name, datetime.now().year, sccList)

  games_df = pd.DataFrame(game_list)

  id_list = []
  h_team_list = []
  a_team_list = []
  h_id_list  = []
  date_list = []

  for tuple in games_df[0].values.tolist():
      id = tuple[1]
      id_list.append(id)

  for tuple in games_df[1].values.tolist():
      id = tuple[1]
      h_id_list.append(id)

  for tuple in games_df[2].values.tolist():
      team = tuple[1]
      h_team_list.append(team)

  for tuple in games_df[3].values.tolist():
      team = tuple[1]
      a_team_list.append(team)

  for tuple in games_df[4].values.tolist():
      date = tuple[1]
      date_list.append(date)

  games_df[games_df.iloc[0][0][0]] = id_list
  games_df[games_df.iloc[0][1][0]] = h_id_list
  games_df[games_df.iloc[0][2][0]] = h_team_list
  games_df[games_df.iloc[0][3][0]] = a_team_list
  games_df[games_df.iloc[0][4][0]] = date_list
  games_df.drop([0,1,2,3,4], axis=1, inplace=True)

  games_df['start_date'] = pd.to_datetime(games_df['start_date'])

  games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')

  games_df = games_df.query(f'start_date >= "{datetime.now().strftime("%Y-%m-%d")}"')

  if games_df.empty:
      return bbGame(game_id="No Next Game Found", 
                      home_id=-1, home_team="NaN", 
                      away_team="NaN", start_date="00/00/00:000000z")

  games_df.sort_values(by='start_date', inplace=True, ascending=False)

  games_df.reset_index(drop=True, inplace=True)

  next_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return next_game


@app.get("/scc/teams/{team_name}/players", tags=["Soccer", "Soccer - Team Info"])
async def get_soccer_players(team_name : str, player_type = "None") -> list[sccPlayer]:
  team_list = [team_name]

  return_list = []

  for team_name in team_list:
            
            team_id = sccList.teams.query(f'name == "{team_name}"').iloc[0]['id']
            
            team_info = fullList.__df__.query(f'school == "{team_name}"')
            if team_info.empty:
                team_color = "#152532"
                team_alt = "#c8caca"
                team_logos = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
            else:
                team_info = team_info.iloc[0]
                team_color = team_info['color']
                team_alt = team_info['alt_color']
                team_logos = team_info['logos']
            
            try:
                
                driver = webdriver.Chrome()
                
                    # Open the NCAA roster page
                driver.get(f"https://stats.ncaa.org/teams/{team_id}/roster")
            
                # Wait for the table to load
                wait = WebDriverWait(driver, 10)
                table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='dataTables_scrollBody']//table")))    
            
                # Extract rows from the table
                rows = rows = table.text.split('\n')

                player_list = []
                
                for index in range(1,len(rows)+1):
                    player_info = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16660_data_table"]/tbody/tr[{index}]/td[4]/a')
                
                    name = player_info.text
                    id = int(player_info.get_attribute("href").split("/")[-1])
                
                    year_raw = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16660_data_table"]/tbody/tr[{index}]/td[5]').text
                
                    jersey = int(table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16660_data_table"]/tbody/tr[{index}]/td[3]').text)
                
                    pos = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16660_data_table"]/tbody/tr[{index}]/td[6]').text
                    
                    height = table.find_element(By.XPATH, f'//*[@id="rosters_form_players_16660_data_table"]/tbody/tr[{index}]/td[7]').text
                
                    
            
                    player_list.append({'id': id, 'name': name, 'year': year_raw, 
                                        'jersey': jersey, 'position': pos, 
                                    'height': height,
                                    'color': team_color, 'alt_color': team_alt, 
                                    'logos': team_logos, 'team': team_name})
                    
            finally:
                # Close the browser
                driver.quit() 
                #pass

            for player in player_list:
            
                match player['year']:
                    case 'Fr.':
                        pl_year = 1
                    case 'So.':
                        pl_year = 2
                    case 'Jr.':
                        pl_year = 3
                    case 'Sr.':
                        pl_year = 4
                    case _:
                        pl_year = 0
                if player['height'] == '-':
                    height = 0
                else:
                    h_comps = player['height'].split('-')
                    if len(h_comps[0]) >= 1:
                        if len(h_comps[1]) >= 1:
                            height = int(h_comps[0])*12 + int(h_comps[1])  
                        else:
                            height = int(h_comps[0])*12
                    else:
                        height = 0
                player['height'] = height
                player['year'] = pl_year

                if player_type != 'None':
                   if player['position'] == player_type:
                      curr = sccPlayer(player_id=player["id"],
                                  player_name=player["name"],
                                  player_position=player["position"],
                                  player_jersey = player['jersey'],
                                  player_height = height,
                                  player_year=pl_year,
                                  player_team = team_name,
                                  team_color = team_color,
                                  team_alt_color = team_alt,
                                  team_logos = str(team_logos))
                      return_list.append(curr) 
                else:
                  curr = sccPlayer(player_id=player["id"],
                                player_name=player["name"],
                                player_position=player["position"],
                                player_jersey = player['jersey'],
                                player_height = height,
                                player_year=pl_year,
                                player_team = team_name,
                                team_color = team_color,
                                team_alt_color = team_alt,
                                team_logos = str(team_logos))
        
                  return_list.append(curr)

  return return_list


@app.get("/scc/players/search/by_name/{player_name}", tags=["Soccer", "Soccer - Player Info"])
async def search_for_soccer_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[sccPlayer]:
  all_players = sccList.players

  all_players["search_name"] = all_players["name"].str.lower()

  all_players = all_players[all_players["search_name"].str.contains(player_name.lower())]

  all_players = all_players.drop("search_name", axis=1)

  if player_team != "None":
      all_players.query(f'team == "{player_team}"', inplace = True)

  if player_type != "None":
      all_players.query(f'position == "{player_type}"', inplace = True)

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}
  
  all_players = all_players.fillna(nan_values)

  return_list = []

  for _, player in all_players.iterrows():
      curr = sccPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)

  return return_list


@app.get("/scc/players/search/by_id/{player_id}", tags=["Soccer", "Soccer - Player Info"])
async def search_for_soccer_players_by_id(player_id : int) -> sccPlayer:

  players_df = sccList.players
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}

  player_details = player_details.fillna(nan_values)

  return_player = sccPlayer(player_id=player_details["id"],
                        player_name=player_details["name"],
                        player_position=player_details["position"],
                        player_jersey = player_details['jersey'],
                        player_height = player_details['height'],
                        player_year=player_details['year'],
                        player_team = player_details['team'],
                        team_color = player_details['color'],
                        team_alt_color = player_details['alt_color'],
                        team_logos = player_details['logos']) 
  
  return return_player


@app.get("/scc/players/getall", tags=["Soccer", "Soccer - Player Info"])
async def get_all_soccer_players(page = 1, page_size= 100) -> list[sccPlayer]:
  players_df = sccList.players

  start = (int(page) - 1)*int(page_size)

  end =  ((int(page) - 1)*int(page_size))+int(page_size)

  filtered_df = players_df[start:end]

  nan_values = {'position': "None Listed"}

  filtered_df = filtered_df.fillna(nan_values)

  return_list = []

  for _, player in filtered_df.iterrows():
      curr = sccPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)
  
  return return_list


@app.get("/scc/player/{player_id}/stats/last_game", tags=["Soccer", "Soccer - Player Info"])
async def get_last_game_stats_for_soccer_player(player_id : int) -> sccStats:
  players_df = sccList.players
  player_details = players_df.query(f'id == {player_id}')
  
  try:
      player_details = player_details.iloc[0]
  except IndexError:
       return sccStats(goals=0, 
                             assists=0,
                             shots_on_goal=0,
                             shots_off_goal=0,
                             fouls=0,
                             yellow_cards=0,
                             red_cards=0,
                             clean_sheet=0,
                             goals_allowed=0,
                             saves=0,
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")

  position = player_details['position']

  last_game = scc_last_game(player_details['team'], sccList)

  if last_game.home_team != player_details['team']:
      opp = last_game.home_team 
  else:
      opp = last_game.away_team

  game_year = int(last_game.start_date[:4])

  if game_year != datetime.now().year:
      print('Warning: Last game not played in the current season')

  stats = get_scc_game_info(player_id, last_game.start_date, opp, position, player_details['name'], False)

  return stats


@app.get("/scc/player/{player_id}/stats/full_year", tags=["Soccer", "Soccer - Player Info"])
async def get_soccer_player_season_stats(player_id : int, season : Season) -> sccStats:
    players_df = sccList.players
    player_details = players_df.query(f'id == {player_id}')
    
    try:
      player_details = player_details.iloc[0]
    except IndexError:
       return sccStats(goals=0, 
                             assists=0,
                             shots_on_goal=0,
                             shots_off_goal=0,
                             fouls=0,
                             yellow_cards=0,
                             red_cards=0,
                             clean_sheet=0,
                             goals_allowed=0,
                             saves=0,
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")
  

    return get_scc_season_info(player_id,season.value,player_details['position'], player_details['name'])


@app.get("/scc/players/get_first_string", tags=["Soccer", "Soccer - Player Info"]) 
async def get_all_first_string_soccer_players(page = 1, page_size= 100) -> list[sccPlayer]:

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    all_players = sccList.first_string_df.copy()

    all_players = all_players[start:end]

    return [sccPlayer(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, 
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]


@app.get("/league-tools/generate_schedule/", tags=["League Tools"])
async def generate_league_schedule(num_teams = 8, num_weeks = 10) -> list[SchedWeek]:
   
   schedule = generate_schedule(int(num_teams), int(num_weeks))

   return_sched = []
   for week_number, matches in enumerate(schedule, start=1):
        #print(f"Week {week_number}:")
        match_list = []
        for curr_match in matches:
            home = curr_match[0]
            away = curr_match[1]
            if home > int(num_teams):
                home = "Bye"
            else:
                home = f"{home}"
            if away > int(num_teams):
                away = "Bye"
            else:
                away = f"{away}"    
            #print(f"  {home} vs {away}")
            match_list.append(SchedMatch(home=home, away=away))
        return_sched.append(SchedWeek(week_num=week_number, week_matches=match_list))

   return return_sched


#AI PREDICTIONS - BASKETBALL

@app.get("/predict/bkb/season/{player_id}", tags=["Prediction"])
async def predict_basketball_player_season(player_id : str) -> bkbPreds:
    with open('model/bkb/season_classifier.pkl', 'rb') as fid:
      model = pickle.load(fid)

    NUM_GAMES = 32

    plyr = bkbList.df.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()

    input_list = [[plyr['team'].replace("&", "%26"), plyr['weight'], plyr['height'],
              plyr['year'], plyr['position']]]
    
    df_input = pd.DataFrame(input_list, columns=['team', 'weight', 'height', 'year', 'position'])

    for column in df_input.columns:
        if df_input[column].dtype == object:
          le.classes_ = np.load(f'model/bkb/{column} classes.npy', allow_pickle=True)
          df_input[column] = le.transform(df_input[column])

    input_list = df_input.values.reshape(1, -1)
    test_results = model.predict(input_list)

    test_dict = {}

    test_dict['three_pointers'] = round(test_results[0][0], 1)
    test_dict['two_pointers'] = round(test_results[0][1], 1)
    test_dict['free_throws'] = round(test_results[0][2], 1)
    test_dict['rebounds'] = round(test_results[0][3], 1)
    test_dict['assists'] = round(test_results[0][4], 1)
    test_dict['blocked_shots'] = round(test_results[0][5], 1)
    test_dict['steals'] = round(test_results[0][6], 1)
    test_dict['turnovers'] = round(test_results[0][7], 1)


    return_stats = bkbPreds(player_name=plyr['name'],
                               player_ID=plyr['id'], player_position=plyr['position'],
                               three_pointers=round(test_dict["three_pointers"]*NUM_GAMES, 1), 
                               two_pointers=round(test_dict["two_pointers"]*NUM_GAMES, 1),
                               free_throws=round(test_dict["free_throws"]*NUM_GAMES, 1), 
                               rebounds=round(test_dict["rebounds"]*NUM_GAMES, 1),
                               assists=round(test_dict["assists"]*NUM_GAMES, 1), 
                               blocked_shots=round(test_dict["blocked_shots"]*NUM_GAMES, 1),
                               steals=round(test_dict["steals"]*NUM_GAMES, 1), 
                               turnovers=round(test_dict["turnovers"]*NUM_GAMES, 1))

    
    return return_stats


@app.get("/predict/bkb/{player_id}/game", tags=["Prediction"])
async def predict_basketball_player_stats(player_id : str, opponent = "next") -> bkbPreds:
    
    with open('model/bkb/opponent_classifier.pkl', 'rb') as fid:
      model_opp = pickle.load(fid)

    plyr = bkbList.df.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()

    played_df = get_bkb_played_games(plyr['team'], datetime.now().year)

    games_played = len(played_df)

    if opponent == "next":
      sched_df = s.get_team_schedule(plyr['team'])
  
      sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

      now = datetime.now()

      sched_df = sched_df.query(f'datetime > "{now.strftime("%Y-%m-%d")}"')

      sched_df.sort_values(by='datetime', inplace=True, ascending=True)

      sched_df.reset_index(drop=True, inplace=True)

      game_info = s.get_game_info(sched_df.iloc[0]["game_id"])

      next_game = fbGame(game_id=sched_df.iloc[0]["game_id"],
                            home_id=int(game_info["home_id"].iloc[0]),
                            home_team=game_info["home_team"].iloc[0],
                            away_team=game_info["away_team"].iloc[0],
                            start_date=sched_df.iloc[0]["datetime"])

      if next_game.home_team == plyr['team']:
        opponent = next_game.away_team
      else:
        opponent = next_game.home_team
    else:
       opps_df = pd.read_csv(f"{os.getcwd()}/cache/bkb/opponent_names.csv")
       opponent = opps_df.query(f'Team.str.startswith("{opponent.replace("'", "\'")}")').Team.values[0]
  
    test_QB = [[plyr['team'].replace("&", "%26"), plyr['weight'], plyr['height'],
                  plyr['year'], plyr['position'], opponent.replace("&", "%26")]]
    df_test = pd.DataFrame(test_QB, columns=['team', 'weight', 'height', 'year', 'position', 'opponent'])


    for column in df_test.columns:
        if df_test[column].dtype == object:
          le.classes_ = np.load(f'model/bkb/{column} classes.npy', allow_pickle=True)
          df_test[column] = le.transform(df_test[column])

    test_QB = df_test.values.reshape(1, -1)
    test_results = model_opp.predict(test_QB)

    test_results.tolist()

    test_dict = {}

    test_dict['three_pointers'] = round(test_results[0][0], 1)
    test_dict['two_pointers'] = round(test_results[0][1], 1)
    test_dict['free_throws'] = round(test_results[0][2], 1)
    test_dict['rebounds'] = round(test_results[0][3], 1)
    test_dict['assists'] = round(test_results[0][4], 1)
    test_dict['blocked_shots'] = round(test_results[0][5], 1)
    test_dict['steals'] = round(test_results[0][6], 1)
    test_dict['turnovers'] = round(test_results[0][7], 1)


    return_stats = bkbPreds(player_name=plyr['name'],
                               player_ID=plyr['id'], player_position=plyr['position'],
                               three_pointers=round(test_dict["three_pointers"], 1), 
                               two_pointers=round(test_dict["two_pointers"], 1),
                               free_throws=round(test_dict["free_throws"], 1), 
                               rebounds=round(test_dict["rebounds"], 1),
                               assists=round(test_dict["assists"], 1), 
                               blocked_shots=round(test_dict["blocked_shots"], 1),
                               steals=round(test_dict["steals"], 1), 
                               turnovers=round(test_dict["turnovers"], 1))
    
    return return_stats


#AI PREDICTIONS - BASEBALL

@app.get("/predict/bsb/season/{player_id}", tags=["Prediction"])
async def predict_baseball_player_season(player_id : str) -> bsbStats:
    with open('model/bsb/season_classifier.pkl', 'rb') as fid:
      model = pickle.load(fid)

    NUM_GAMES = 56

    plyr = bsbList.players.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()

    input_list = [[plyr['team'].replace("&", "%26"), plyr['bat'], plyr['throw'], plyr['height'],
              plyr['year'], plyr['position']]]
    
    df_input = pd.DataFrame(input_list, columns=['team', 'bat_hand', 'throw_hand', 'height', 'year', 'position'])

    for column in df_input.columns:
        if df_input[column].dtype == object:
          le.classes_ = np.load(f'model/bsb/{column} classes.npy', allow_pickle=True)
          df_input[column] = le.transform(df_input[column])

    input_list = df_input.values.reshape(1, -1)
    test_results = model.predict(input_list)

    test_dict = {}

    test_dict['saves'] = max(round(test_results[0][0], 1), 0)
    test_dict['innings'] = max(round(test_results[0][1], 1), 0)
    test_dict['earned_runs_allowed'] = max(round(test_results[0][2], 1), 0)
    test_dict['singles'] = max(round(test_results[0][3], 1), 0)
    test_dict['doubles'] = max(round(test_results[0][4], 1), 0)
    test_dict['triples'] = max(round(test_results[0][5], 1), 0)
    test_dict['home_runs'] = max(round(test_results[0][6], 1), 0)
    test_dict['runs'] = max(round(test_results[0][7], 1), 0)
    test_dict['win'] = max(round(test_results[0][8], 1), 0)
    test_dict['runs_batted_in'] = max(round(test_results[0][9], 1), 0)
    test_dict['walks'] = max(round(test_results[0][10], 1), 0)
    test_dict['hits_by_pitch'] = max(round(test_results[0][11], 1), 0)
    test_dict['stolen_bases'] = max(round(test_results[0][12], 1), 0)
    test_dict['caught_stealing'] = max(round(test_results[0][13], 1), 0)

    if plyr['position'] != 'P':
      test_dict['saves'] = 0
      test_dict['innings'] = 0
      test_dict['earned_runs_allowed'] = 0

    if test_dict['win'] > 0.5:
       test_dict['win'] = 1
    else:
       test_dict['win'] = 0


    return_stats = bsbStats(player_name=plyr['name'],
                               player_id=plyr['id'], player_position=plyr['position'],
                               saves=round(test_dict["saves"]*NUM_GAMES, 1), 
                               innings=round(test_dict["innings"]*NUM_GAMES, 1),
                               earned_runs_allowed=round(test_dict["earned_runs_allowed"]*NUM_GAMES, 1), 
                               singles=round(test_dict["singles"]*NUM_GAMES, 1),
                               doubles=round(test_dict["doubles"]*NUM_GAMES, 1), 
                               triples=round(test_dict["triples"]*NUM_GAMES, 1), 
                               homers=round(test_dict["home_runs"]*NUM_GAMES, 1), 
                               win=bool(test_dict['win']),
                               runs=round(test_dict["runs"]*NUM_GAMES, 1),
                               runs_batted_in=round(test_dict["runs_batted_in"]*NUM_GAMES, 1), 
                               walks=round(test_dict["walks"]*NUM_GAMES, 1), 
                               hits_by_pitch=round(test_dict["hits_by_pitch"]*NUM_GAMES, 1), 
                               stolen_bases=round(test_dict["stolen_bases"]*NUM_GAMES, 1), 
                               caught_stealing=round(test_dict["caught_stealing"]*NUM_GAMES, 1))

    
    return return_stats


@app.get("/predict/bsb/{player_id}/game", tags=["Prediction"])
async def predict_baseball_player_stats(player_id : str, opponent = "next") -> bsbStats:
    
    with open('model/bsb/opponent_classifier.pkl', 'rb') as fid:
      model_opp = pickle.load(fid)

    plyr = bsbList.players.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()  

    if opponent == "next":
      game_list = bsb_team_schedule(plyr['team'], datetime.now().year, bsbList)

      games_df = pd.DataFrame(game_list)

      id_list = []
      h_team_list = []
      a_team_list = []
      h_id_list  = []
      date_list = []

      for tuple in games_df[0].values.tolist():
          id = tuple[1]
          id_list.append(id)

      for tuple in games_df[1].values.tolist():
          id = tuple[1]
          h_id_list.append(id)

      for tuple in games_df[2].values.tolist():
          team = tuple[1]
          h_team_list.append(team)

      for tuple in games_df[3].values.tolist():
          team = tuple[1]
          a_team_list.append(team)

      for tuple in games_df[4].values.tolist():
          date = tuple[1]
          date_list.append(date)

      games_df[games_df.iloc[0][0][0]] = id_list
      games_df[games_df.iloc[0][1][0]] = h_id_list
      games_df[games_df.iloc[0][2][0]] = h_team_list
      games_df[games_df.iloc[0][3][0]] = a_team_list
      games_df[games_df.iloc[0][4][0]] = date_list
      games_df.drop([0,1,2,3,4], axis=1, inplace=True)

      games_df['start_date'] = pd.to_datetime(games_df['start_date'])

      games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')

      games_df = games_df.query(f'start_date > "{datetime.now().strftime("%Y-%m-%d")}"')

      games_df.sort_values(by='start_date', inplace=True, ascending=True)

      games_df.reset_index(drop=True, inplace=True)

      next_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                          home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                          away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

      if next_game.home_team == plyr['team']:
        opponent = next_game.away_team
      else:
        opponent = next_game.home_team
  
    input_list = [[plyr['team'].replace("&", "%26"), plyr['bat'], plyr['throw'], plyr['height'],
              plyr['year'], plyr['position'], opponent]]
    df_test = pd.DataFrame(input_list, columns=['team', 'bat_hand', 'throw_hand', 'height', 'year', 'position', 'opponent'])

    for column in df_test.columns:
        if df_test[column].dtype == object:
          le.classes_ = np.load(f'model/bsb/{column} classes.npy', allow_pickle=True)
          df_test[column] = le.transform(df_test[column])

    input_list = df_test.values.reshape(1, -1)
    test_results = model_opp.predict(input_list)

    test_results.tolist()

    test_dict = {}

    test_dict['saves'] = max(round(test_results[0][0], 1), 0)
    test_dict['innings'] = max(round(test_results[0][1], 1), 0)
    test_dict['earned_runs_allowed'] = max(round(test_results[0][2], 1), 0)
    test_dict['singles'] = max(round(test_results[0][3], 1), 0)
    test_dict['doubles'] = max(round(test_results[0][4], 1), 0)
    test_dict['triples'] = max(round(test_results[0][5], 1), 0)
    test_dict['home_runs'] = max(round(test_results[0][6], 1), 0)
    test_dict['runs'] = max(round(test_results[0][7], 1), 0)
    test_dict['win'] = max(round(test_results[0][8], 1), 0)
    test_dict['runs_batted_in'] = max(round(test_results[0][9], 1), 0)
    test_dict['walks'] = max(round(test_results[0][10], 1), 0)
    test_dict['hits_by_pitch'] = max(round(test_results[0][11], 1), 0)
    test_dict['stolen_bases'] = max(round(test_results[0][12], 1), 0)
    test_dict['caught_stealing'] = max(round(test_results[0][13], 1), 0)



    if plyr['position'] != 'P':
      test_dict['saves'] = 0
      test_dict['innings'] = 0
      test_dict['earned_runs_allowed'] = 0


    return_stats = bsbStats(player_name=plyr['name'],
                               player_id=plyr['id'], player_position=plyr['position'],
                               saves=round(test_dict["saves"], 1), 
                               innings=round(test_dict["innings"], 1),
                               earned_runs_allowed=round(test_dict["earned_runs_allowed"], 1), 
                               singles=round(test_dict["singles"], 1),
                               doubles=round(test_dict["doubles"], 1), 
                               triples=round(test_dict["triples"], 1), 
                               homers=round(test_dict["home_runs"], 1), 
                               win=bool(test_dict['win']),
                               runs=round(test_dict["runs"], 1),
                               runs_batted_in=round(test_dict["runs_batted_in"], 1), 
                               walks=round(test_dict["walks"], 1), 
                               hits_by_pitch=round(test_dict["hits_by_pitch"], 1), 
                               stolen_bases=round(test_dict["stolen_bases"], 1), 
                               caught_stealing=round(test_dict["caught_stealing"], 1))
    
    return return_stats

#AI PREDICTIONS - SOCCER

@app.get("/predict/scc/season/{player_id}", tags=["Prediction"])
async def predict_soccer_player_season(player_id : str) -> sccPreds:
    with open('model/scc/season_classifier.pkl', 'rb') as fid:
      model = pickle.load(fid)

    NUM_GAMES = 18

    plyr = sccList.players.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()

    input_list = [[plyr['team'].replace("&", "%26"), plyr['height'], plyr['year'], plyr['position']]]
    
    df_input = pd.DataFrame(input_list, columns=['team', 'height', 'year', 'position'])

    for column in df_input.columns:
        if df_input[column].dtype == object:
          le.classes_ = np.load(f'model/scc/{column} classes.npy', allow_pickle=True)
          df_input[column] = le.transform(df_input[column])

    input_list = df_input.values.reshape(1, -1)
    test_results = model.predict(input_list)

    test_dict = {}

    test_dict['goals'] = max(round(test_results[0][0], 1), 0)
    test_dict['assists'] = max(round(test_results[0][1], 1), 0)
    test_dict['shots_on_goal'] = max(round(test_results[0][2], 1), 0)
    test_dict['shots_off_goal'] = max(round(test_results[0][3], 1), 0)
    test_dict['fouls'] = max(round(test_results[0][4], 1), 0)
    test_dict['yellow_cards'] = max(round(test_results[0][5], 1), 0)
    test_dict['red_cards'] = max(round(test_results[0][6], 1), 0)
    test_dict['clean_sheet'] = max(round(test_results[0][7], 1), 0)
    test_dict['goals_allowed'] = max(round(test_results[0][8], 1), 0)
    test_dict['saves'] = max(round(test_results[0][9], 1), 0)

    if plyr['position'] != 'GK':
      test_dict['saves'] = 0
      test_dict['goals_allowed'] = 0
      test_dict['clean_sheet'] = 0


    return_stats = sccPreds(player_name=plyr['name'],
                               player_id=plyr['id'], player_position=plyr['position'],
                               goals=round(test_dict["goals"]*NUM_GAMES, 1), 
                               assists=round(test_dict["assists"]*NUM_GAMES, 1),
                               shots_on_goal=round(test_dict["shots_on_goal"]*NUM_GAMES, 1), 
                               shots_off_goal=round(test_dict["shots_off_goal"]*NUM_GAMES, 1),
                               fouls=round(test_dict["fouls"]*NUM_GAMES, 1), 
                               yellow_cards=round(test_dict["yellow_cards"]*NUM_GAMES, 1), 
                               red_cards=round(test_dict["red_cards"]*NUM_GAMES, 1), 
                               clean_sheet=round(test_dict["clean_sheet"]*NUM_GAMES, 1),
                               goals_allowed=round(test_dict["goals_allowed"]*NUM_GAMES, 1), 
                               saves=round(test_dict["saves"]*NUM_GAMES, 1))

    
    return return_stats


@app.get("/predict/scc/{player_id}/game", tags=["Prediction"])
async def predict_soccer_player_stats(player_id : str, opponent = "next") -> sccPreds:
    
    with open('model/scc/opponent_classifier.pkl', 'rb') as fid:
      model_opp = pickle.load(fid)

    plyr = sccList.players.copy().query(f'id == {player_id}').reset_index().iloc[0]

    le = LabelEncoder()  

    if opponent == "next":
      game_list = scc_team_schedule(plyr['team'], datetime.now().year, sccList)

      games_df = pd.DataFrame(game_list)

      id_list = []
      h_team_list = []
      a_team_list = []
      h_id_list  = []
      date_list = []

      for tuple in games_df[0].values.tolist():
          id = tuple[1]
          id_list.append(id)

      for tuple in games_df[1].values.tolist():
          id = tuple[1]
          h_id_list.append(id)

      for tuple in games_df[2].values.tolist():
          team = tuple[1]
          h_team_list.append(team)

      for tuple in games_df[3].values.tolist():
          team = tuple[1]
          a_team_list.append(team)

      for tuple in games_df[4].values.tolist():
          date = tuple[1]
          date_list.append(date)

      games_df[games_df.iloc[0][0][0]] = id_list
      games_df[games_df.iloc[0][1][0]] = h_id_list
      games_df[games_df.iloc[0][2][0]] = h_team_list
      games_df[games_df.iloc[0][3][0]] = a_team_list
      games_df[games_df.iloc[0][4][0]] = date_list
      games_df.drop([0,1,2,3,4], axis=1, inplace=True)

      games_df['start_date'] = pd.to_datetime(games_df['start_date'])

      games_df['start_date'] = games_df['start_date'].dt.strftime('%Y-%m-%d')

      games_df = games_df.query(f'start_date >= "{datetime.now().strftime("%Y-%m-%d")}"')

      if games_df.empty:
          return bbGame(game_id="No Next Game Found", 
                          home_id=-1, home_team="NaN", 
                          away_team="NaN", start_date="00/00/00:000000z")

      games_df.sort_values(by='start_date', inplace=True, ascending=False)

      games_df.reset_index(drop=True, inplace=True)

      next_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                          home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                          away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

      if next_game.home_team == plyr['team']:
        opponent = next_game.away_team
      else:
        opponent = next_game.home_team
  
    input_list = [[plyr['team'].replace("&", "%26"), plyr['height'],
              plyr['year'], plyr['position'], opponent]]
    df_test = pd.DataFrame(input_list, columns=['team', 'height', 'year', 'position', 'opponent'])

    for column in df_test.columns:
        if df_test[column].dtype == object:
          le.classes_ = np.load(f'model/scc/{column} classes.npy', allow_pickle=True)
          df_test[column] = le.transform(df_test[column])

    input_list = df_test.values.reshape(1, -1)
    test_results = model_opp.predict(input_list)

    test_results.tolist()

    test_dict = {}

    test_dict['goals'] = max(round(test_results[0][0], 1), 0)
    test_dict['assists'] = max(round(test_results[0][1], 1), 0)
    test_dict['shots_on_goal'] = max(round(test_results[0][2], 1), 0)
    test_dict['shots_off_goal'] = max(round(test_results[0][3], 1), 0)
    test_dict['fouls'] = max(round(test_results[0][4], 1), 0)
    test_dict['yellow_cards'] = max(round(test_results[0][5], 1), 0)
    test_dict['red_cards'] = max(round(test_results[0][6], 1), 0)
    test_dict['clean_sheet'] = max(round(test_results[0][7], 1), 0)
    test_dict['goals_allowed'] = max(round(test_results[0][8], 1), 0)
    test_dict['saves'] = max(round(test_results[0][9], 1), 0)

    if plyr['position'] != 'GK':
      test_dict['saves'] = 0
      test_dict['goals_allowed'] = 0
      test_dict['clean_sheet'] = 0


    return_stats = sccPreds(player_name=plyr['name'],
                               player_id=plyr['id'], player_position=plyr['position'],
                               goals=round(test_dict["goals"], 1), 
                               assists=round(test_dict["assists"], 1),
                               shots_on_goal=round(test_dict["shots_on_goal"], 1), 
                               shots_off_goal=round(test_dict["shots_off_goal"], 1),
                               fouls=round(test_dict["fouls"], 1), 
                               yellow_cards=round(test_dict["yellow_cards"], 1), 
                               red_cards=round(test_dict["red_cards"], 1), 
                               clean_sheet=round(test_dict["clean_sheet"], 1),
                               goals_allowed=round(test_dict["goals_allowed"], 1), 
                               saves=round(test_dict["saves"], 1))
    
    return return_stats

#DRAFT ENDPOINTS
@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })



app.include_router(football_draft_router, tags=["Football Draft"])
app.include_router(basketball_draft_router, tags=["Basketball Draft"])
app.include_router(baseball_draft_router, tags=["Baseball Draft"])
app.include_router(soccer_draft_router, tags=["Soccer Draft"])
app.include_router(authentication_router, tags=["Authentication"])

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.200.36", port=8000)