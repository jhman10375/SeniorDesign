from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.draft import router as draft_router

import requests
from datetime import datetime
import numpy as np
import pandas as pd
import json
import os
from classes import *
from functions import *
from dotenv import load_dotenv

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


@app.get("/teams/{team_name}", tags=["Team Info"])
async def get_schedule(team_name: str) -> list[fbGame]:

    return team_schedule(team_name)

@app.get("/teams/{team_name}/last_game", tags=["Team Info"])
async def get_last_game(team_name: str) -> fbGame:

    schedule = team_schedule(team_name)

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

    schedule = team_schedule(team_name)

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
async def get_player_stats_for_whole_year(player_id : int) -> playerStats:
    player = search_player(fullList, player_id)

    team = player.player_team

    url = f"https://api.collegefootballdata.com/stats/player/season?year={datetime.now().year}&team={team}"

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
  last_game = get_player_last_game(player.player_team)
  
  plyr_name = player.player_name
  plyr_id = player.player_id
  plyr_pos = player.player_position

  game_id = last_game.game_id

  url = f"https://api.collegefootballdata.com/games/players?year={datetime.now().year}&seasonType=regular&gameId={game_id}"

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
async def get_D_ST_last_game_stats(team_name : str) -> D_ST_Stats:
  last_game = get_team_last_game(team_name)

  game_id = last_game.game_id

  url = f"https://api.collegefootballdata.com/games/teams?year={datetime.now().year}&seasonType=regular&gameId={game_id}"

  headers = {"Authorization": f"Bearer {token}"}

  response = requests.get(url, headers=headers)

  game_json = json.loads(response.text)

  game_df = pd.json_normalize(game_json)

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
                    kick_return_TDs=kick_TD, int_TDs=pick6, interceptions=pick6, fumbles_recovered=fumbles,
                  other_defensive_TDs=misc_def_TD, sacks=sacks, deflected_passes=pass_deflect)

@app.get("/{team_name}/D-ST/stats/full_season", tags=["D/ST"])
async def get_D_ST_season_stats(team_name : str) -> D_ST_Stats:
  url = f"https://api.collegefootballdata.com/stats/season?year={datetime.now().year}&team={team_name}"


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


  all_games = team_schedule(team_name)

  tackles = 0
  pass_deflect = 0
  all_def_TD = 0

  for game in all_games:
    game_id = game.game_id
    curr_url = f"https://api.collegefootballdata.com/games/teams?year={datetime.now().year}&seasonType=regular&gameId={game_id}"

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
                    kick_return_TDs=kick_TD, int_TDs=pick6, interceptions=pick6, fumbles_recovered=fumbles,
                  other_defensive_TDs=misc_def_TD, sacks=sacks, deflected_passes=pass_deflect)

@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })



app.include_router(draft_router, tags=["Draft"])
