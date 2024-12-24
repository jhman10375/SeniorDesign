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
     

@app.get("/players/search/by_name/{name}", tags=["Player Info"])
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


@app.get("/players/search/by_id/{id}", tags=["Player Info"])
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


@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })



app.include_router(draft_router, tags=["Draft"])
