from datetime import datetime
import pandas as pd
import json
import os
import requests
from classes import *
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("CFBD_TOKEN")

def team_schedule(team, year):
    url = f"https://api.collegefootballdata.com/games?year={year}&team={team.replace("&", "%26")}"

    post_url = f"https://api.collegefootballdata.com/games?year={year}&seasonType=postseason&team={team.replace("&", "%26")}"

    headers = {"Authorization": f"Bearer {token}"}

    games_response = requests.get(url, headers=headers)

    games_json = json.loads(games_response.text)

    games_df = pd.json_normalize(games_json)

    games_list = [fbGame(game_id=game.id, home_id=game.home_id, home_team=game.home_team, 
                         away_team=game.away_team, start_date=game.start_date) for game in games_df.itertuples()]
    
    postseason_response = requests.get(post_url, headers=headers)
    
    post_json = json.loads(postseason_response.text)
    post_df = pd.json_normalize(post_json)

    post_list = [fbGame(game_id=game.id, home_id=game.home_id, home_team=game.home_team, 
                         away_team=game.away_team, start_date=game.start_date) for game in post_df.itertuples()]
    
    return games_list + post_list



def search_player(players, player_id):

    if not(players.populated):
        players.populate()

        all_players = players.getlist().copy()
    
    else:
        all_players = players.getlist().copy()


    all_players.query(f'id == "{player_id}"', inplace = True)

    results = [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.school,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]
    
    player = results[0]

    return player

def get_player_last_game(team_name, year):
    schedule = team_schedule(team_name, year)

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


def get_team_last_game(team_name, year):
    schedule = team_schedule(team_name, year)

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

def get_season_stats_per_game(fullList, player_id, games_played, year):
    player = search_player(fullList, player_id)

    team = player.player_team

    url = f"https://api.collegefootballdata.com/stats/player/season?year={year}&team={team.replace("&", "%26")}"

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

    return predictedStats(player_name=stats_df.iloc[0]['player'], 
                       player_ID=stats_df.iloc[0]['playerId'], 
                       pass_TD=round(pass_TD/games_played,1), 
                       pass_yds=round(pass_yds/games_played,1), 
                       interceptions=round(ints/games_played,1), 
                       fumbles_lost=round(fumbles/games_played,1), 
                       rush_yds=round(rush_yds/games_played,1), 
                       rush_TD=round(rush_TD/games_played,1), 
                       reception_yds=round(rec_yds/games_played,1), 
                       reception_TD=round(rec_TD/games_played,1), 
                       receptions=round(receptions/games_played,1),
                       extra_points=round(xp/games_played,1), 
                       field_goals=round(fgs/games_played,1), 
                       extra_points_missed=round(xp_miss/games_played,1), 
                       field_goals_missed=round(fg_miss/games_played,1),
                       player_position=player.player_position)
