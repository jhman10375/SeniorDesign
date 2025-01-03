from pydantic import BaseModel
import requests
import json
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv
from enum import Enum

load_dotenv()
token = os.getenv("CFBD_TOKEN")

class fbGame(BaseModel):

    game_id : int
    home_id : int
    home_team : str
    away_team : str
    start_date : str

class Season(int, Enum):
    last_season = datetime.now().year - 1
    curr_season = datetime.now().year 
    next_season = datetime.now().year + 1


class playerInfo(BaseModel):

    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_weight : int
    player_team : str
    player_year : int
    team_color : str
    team_alt_color : str
    team_logos : str

class playerStats(BaseModel):
    player_name : str
    player_ID : int
    player_position : str
    pass_TD : int
    pass_yds : int
    interceptions : int
    fumbles_lost : int
    rush_yds : int
    rush_TD : int
    reception_yds : int
    reception_TD : int
    receptions : int
    extra_points : int
    extra_points_missed : int
    field_goals : int
    field_goals_missed : int

class predictedStats(BaseModel):
    player_name : str
    player_ID : int
    player_position : str
    pass_TD : float
    pass_yds : float
    interceptions : float
    fumbles_lost : float
    rush_yds : float
    rush_TD : float
    reception_yds : float
    reception_TD : float
    receptions : float
    extra_points : float
    extra_points_missed : float
    field_goals : float
    field_goals_missed : float


class D_ST_Stats(BaseModel):
    team_name : str
    tackles : int
    punt_TDs : int
    kick_return_TDs : int
    int_TDs : int
    interceptions : int
    fumbles_recovered : int
    other_defensive_TDs : int
    sacks : int
    deflected_passes : int
    

class playerList():

    def __init__(self):
        self.__df__ = None
        self.populated = False
        self.active_season = datetime.now().year
    
    def populate(self):
        
        
        url = f"https://api.collegefootballdata.com/roster?year={datetime.now().year}"

        headers = {'Accept': 'application/json', "Authorization": f"Bearer {token}"}

        response = requests.get(url, headers=headers)

        if response.text == "[]":
            url = f"https://api.collegefootballdata.com/roster?year={datetime.now().year - 1}"

            headers = {'Accept': 'application/json', "Authorization": f"Bearer {token}"}

            response = requests.get(url, headers=headers)
            self.active_season = self.active_season - 1

        roster_json = json.loads(response.text)

        roster_df = pd.json_normalize(roster_json)

        roster_df.drop(['home_city', 'home_state', 'home_country', 'home_latitude', 'home_longitude', 'home_county_fips', 'recruit_ids'], axis=1, inplace=True)

        roster_df["name"] = roster_df["first_name"] + " " + roster_df["last_name"]

        roster_df.drop(['first_name', 'last_name'], axis=1, inplace=True)

        values = {"jersey": -1, "position": "No Position Listed", "year": 0, "height": 0, "weight": 0}
        roster_df = roster_df.fillna(values)

        roster_df.dropna()

        roster_df.sort_values(by='name', inplace=True)

        school_url = f"https://api.collegefootballdata.com/teams"

        school_response = requests.get(school_url, headers=headers)

        response_json = json.loads(school_response.text)

        df = pd.json_normalize(response_json)

        df = df[[ "school", "color", "alt_color", "logos"]]

        school_values = {"color": "#152532", "alt_color": "#c8caca", 
                "logos": "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"}
        df = df.fillna(school_values)

        merge_df = roster_df.merge(df, left_on="team", right_on="school")

        self.__df__ = merge_df

        self.populated = True
    
    def getlist(self):
        return self.__df__


class firstStringList():

    def __init__(self, players : playerList):
        self.__df__ = None
        self.__players__ = players
        
        if self.__players__.populated == False:
            self.__players__.populate()

        self.populated = False 

    def populate(self):
        self.populated = True

        if self.__players__.populated == False:
            self.__players__.populate()

        url = f"https://api.collegefootballdata.com/stats/player/season?year={datetime.now().year}"

        headers = {"Authorization": f"Bearer {token}"}

        response = requests.get(url, headers=headers)

        if response.text == "[]":
            url = f"https://api.collegefootballdata.com/stats/player/season?year={datetime.now().year - 1}"

            headers = {"Authorization": f"Bearer {token}"}

            response = requests.get(url, headers=headers)


        response_json = json.loads(response.text)

        stats_df = pd.json_normalize(response_json)

        stats_df["stat"] = pd.to_numeric(stats_df["stat"])

        stats_df.query(f'playerId > "0"', inplace = True)

        stats_df.drop(['player', 'team', 'conference', 'category', 'statType'], axis=1, inplace=True)

        stats_df = stats_df.groupby(['playerId']).sum()

        relevant_positions = ["QB", "RB", "WR", "TE", "PK"]

        query_string = ""

        for pos in relevant_positions:
            query_string = query_string + f"position == '{pos}' or "

        query_string = query_string[:-3]

        player_df = self.__players__.getlist().copy().query(query_string, inplace=False)

        player_df = player_df.merge(stats_df, how='left', left_on="id", right_on="playerId")

        player_df = player_df.dropna()

        player_df.sort_values(by='stat', inplace=True, ascending=False)

        schools = player_df['school'].unique()

        first_stringers = pd.DataFrame(columns=player_df.columns)

        for school in schools:
            for pos in relevant_positions:
                curr = player_df.query(f'team == "{school}" and position == "{pos}"').head(1)
                first_stringers = pd.concat([first_stringers, curr])
                first_stringers.reset_index(drop=True, inplace=True)

        first_stringers.drop(['stat'], axis=1, inplace=True)

        self.__df__ = first_stringers
    
    def getlist(self):
        return self.__df__

        


