from fastapi import FastAPI
import requests
from datetime import datetime
import numpy as np
import pandas as pd
import json
import os
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("CFBD_TOKEN")

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/teams/{team_name}")
async def get_schedule(team_name):

    url = f"https://api.collegefootballdata.com/games?year=2024&seasonType=regular&team={team_name}"

    headers = {"Authorization": f"Bearer {token}"}

    games_response = requests.get(url, headers=headers)

    games_json = json.loads(games_response.text)

    games_df = pd.json_normalize(games_json)

    return games_df[["home_id", "home_team", "away_team", "start_date"]].to_dict()


@app.get("/teams/{team_id}/players")
async def get_playes(team_name, player_type = "None"):
    
    url = f"https://api.collegefootballdata.com/roster?team={team_name}&year={datetime.now().year}"

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)

    roster_json = json.loads(response.text)

    roster_df = pd.json_normalize(roster_json)

    roster_df.drop(['team', 'height', 'weight', 
                    'home_city', 'home_state', 'home_country', 'home_latitude', 
                    'home_longitude', 'home_county_fips', 'recruit_ids', 'year', 'jersey', 'id'], axis=1, inplace=True)
    
    roster_df["name"] = roster_df["first_name"] + " " + roster_df["last_name"]

    roster_df.drop(['first_name', 'last_name'], axis=1, inplace=True)

    if player_type != "None":

        roster_df = roster_df.query(f'position == "{player_type}"')

        roster_df.drop('position', axis=1, inplace=True)

        roster_df.reset_index(drop=True, inplace=True)

        return roster_df.to_dict()
    else:
        return roster_df.to_dict()
