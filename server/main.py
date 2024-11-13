from fastapi import FastAPI
import requests
import numpy as np
import pandas as pd
import json

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/teams/{team_name}")
async def get_schedule(team_name):

    url = "https://api.sportradar.com/ncaafb/trial/v7/en/games/current_season/schedule.json?api_key=hOKicjx5XighZ0TJTE4aRkEiJ7N4y1zlFjQJQJMg"

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)

    schedule_json = json.loads(response.text)

    df_weeks = pd.json_normalize(schedule_json['weeks'])

    team_to_search = team_name

    df = pd.DataFrame({"hometeam":[],
                    "awayteam":[]})

    for week in df_weeks["games"]:
        df_games = pd.json_normalize(week)
        df_games= df_games.rename(columns={"home.name": "hometeam", "away.name": "awayteam"})
        df_current = df_games.query('hometeam == "' + team_to_search + '" or awayteam == "' + team_to_search + '"')
        if len(df_current) > 0:
            df = pd.concat([df, df_current[["home.id", "hometeam", "awayteam", "scheduled"]]])

    return df.to_dict('records')


@app.get("/teams/{team_id}/players")
async def get_playes(team_id, player_type = "None"):
    url = "https://api.sportradar.com/ncaafb/trial/v7/en/teams/" + team_id +"/full_roster.json?api_key=hOKicjx5XighZ0TJTE4aRkEiJ7N4y1zlFjQJQJMg"

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)

    roster_json = json.loads(response.text)

    roster = pd.json_normalize(roster_json["players"])

    roster = roster.drop(columns=['name_suffix'])

    if player_type == "None":
        return roster.to_dict('records')
    else:
        return roster.query('position == "'+ player_type + '"').to_dict('records')

