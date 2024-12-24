from datetime import datetime
import pandas as pd
import json
import os
import requests
from classes import *
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("CFBD_TOKEN")

def team_schedule(team):
    url = f"https://api.collegefootballdata.com/games?year={datetime.now().year}&team={team}"

    post_url = f"https://api.collegefootballdata.com/games?year={datetime.now().year}&seasonType=postseason&team={team}"

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