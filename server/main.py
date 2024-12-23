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
from dotenv import load_dotenv

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

    url = f"https://api.collegefootballdata.com/games?year=2024&seasonType=regular&team={team_name}"

    headers = {"Authorization": f"Bearer {token}"}

    games_response = requests.get(url, headers=headers)

    games_json = json.loads(games_response.text)

    games_df = pd.json_normalize(games_json)

    games_list = [fbGame(game_id=game.id, home_id=game.home_id, home_team=game.home_team, 
                         away_team=game.away_team, start_date=game.start_date) for game in games_df.itertuples()]

    return games_list


@app.get("/teams/{team_name}/players", tags=["Team Info"])
async def get_playes(team_name : str, player_type = "None") -> list[playerInfo]:
    
    url = f"https://api.collegefootballdata.com/roster?team={team_name}&year={datetime.now().year}"

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)

    roster_json = json.loads(response.text)

    roster_df = pd.json_normalize(roster_json)

    roster_df.drop(['team', 'height', 'weight', 
                    'home_city', 'home_state', 'home_country', 'home_latitude', 
                    'home_longitude', 'home_county_fips', 'recruit_ids'], axis=1, inplace=True)
    
    roster_df["name"] = roster_df["first_name"] + " " + roster_df["last_name"]

    roster_df.drop(['first_name', 'last_name'], axis=1, inplace=True)

    if player_type != "None":

        roster_df = roster_df.query(f'position == "{player_type}"')

        roster_df.reset_index(drop=True, inplace=True)
    
    values = {"jersey": -1, "position": "No Position Listed", "year": 0}
    roster_df = roster_df.fillna(values)

    return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_year=player.year) for player in roster_df.itertuples()]
    

@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })

app.include_router(draft_router, tags=["Draft"])
