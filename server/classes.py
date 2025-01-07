from pydantic import BaseModel
import requests
import json
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv
from enum import Enum
from bs4 import BeautifulSoup
from utils.cbbpy_utils import _get_id_from_team, _get_team_map
import cbbpy.mens_scraper as s
import pytz


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
    

class bkbStats(BaseModel):
    player_name: str
    player_ID : int
    player_position: str
    three_pointers: int
    two_pointers : int
    free_throws : int
    rebounds : int
    assists : int
    blocked_shots : int
    steals : int
    turnovers : int

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

        try:
            self.__df__ = pd.read_csv(f"{os.getcwd()}/cache/fb/first_string.csv")
            self.populated = True 
        except FileNotFoundError:
            self.populate()

        

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

        first_stringers.to_csv(f"{os.getcwd()}/cache/fb/first_string.csv")

        self.__df__ = first_stringers
    
    def getlist(self):
        return self.__df__


class bkbPlayers():
    def __init__(self, fullList : playerList):
        self.df = None
        self.populated = False
        try:
            self.df = pd.read_csv(f"{os.getcwd()}/cache/bkb/bkb_players.csv")
            self.populated = True 
        except FileNotFoundError:
            self.populate()

        self.populated = False

        if not(fullList.populated):
            fullList.populate()
        self.details = fullList.__df__[['team', 'color', 'alt_color', 'logos']].drop_duplicates(subset=['team'])

        self.first_string_populated = False
        self.first_string_df = None

        try:
            self.first_string_df = pd.read_csv(f"{os.getcwd()}/cache/bkb/first_string.csv")
            self.first_string_populated = True 
        except FileNotFoundError:
            self.populate_first_string()        


    def populate(self):
        team_info = _get_team_map("mens")[['id', 'location']].drop_duplicates()

        team_list = list(team_info.itertuples(index=False, name=None))

        players_df = pd.DataFrame(columns=["id","jersey","name","position","height","weight","year", "team"])

        for TEAM_id, TEAM_name in team_list:
            
            url = f'https://www.espn.com/mens-college-basketball/team/roster/_/id/{TEAM_id}/'
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                html_content = response.text
            else:
                print(f'Failed to retrieve the page. Status code: {response.status_code}, team: {TEAM_name}')
            soup = BeautifulSoup(html_content, 'html.parser')
            roster_table = soup.find('table', {'class': 'Table'})
            found_roster = False
            if roster_table:
                found_roster = True
                players = []
                for row in roster_table.find_all('tr')[1:]:  # Skip the header row
                    cols = row.find_all('td')
                    if len(cols) >= 4:
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
                            'year' : year,
                            'team' : TEAM_name
                        })
            else:
                print(f'Roster table not found, id = {TEAM_id}')
            if found_roster:
                curr =  pd.DataFrame(players)
            else: 
                curr =  pd.DataFrame(columns=["id","jersey","name","position","height","weight","year","team"])
            
            players_df = pd.concat([players_df, curr])
            players_df.reset_index(drop=True, inplace=True)

        players_df.drop_duplicates(inplace=True)

        columns = list(self.details.columns) + list(players_df.columns)
        columns = columns[0:-1]

        details_df = pd.DataFrame(columns=columns)

        for _, row in players_df.iterrows():
            curr_deets = self.details.query(f'team == "{row["team"]}"')
            if curr_deets.empty:
                curr_col = '#152532'
                curr_alt = '#c8caca'
                curr_log = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
            else:   
                curr_col = curr_deets["color"].iloc[0]
                curr_alt = curr_deets["alt_color"].iloc[0]
                curr_log = curr_deets["logos"].iloc[0]
            curr = {"team": row["team"],
                    "color" : curr_col,
                    "alt_color": curr_alt,
                    "logos": curr_log,
                    "id" : row["id"],
                    "jersey" : row["jersey"],
                    "name" : row["name"],
                    "position" : row["position"],
                    "height" : row["height"],
                    "weight" : row["weight"],
                    "year" : row["year"]
                }
            details_df.loc[len(details_df)] = curr
        
        details_df.to_csv(f"{os.getcwd()}/cache/bkb/bkb_players.csv")

        self.df = details_df
        self.populated = True


    def to_utc(row):

        pst = pytz.timezone('US/Pacific')
        combined_str = f"{row['game_day']} {row['game_time']}"
        if combined_str.find("PST") != -1:
            naive_datetime = datetime.strptime(combined_str, '%B %d, %Y %I:%M %p PST')
        else:
            naive_datetime = datetime.strptime(combined_str, '%B %d, %Y %I:%M %p PDT')
        pst_datetime = pst.localize(naive_datetime)
        utc_datetime = pst_datetime.astimezone(pytz.utc)
        return utc_datetime.strftime('%Y-%m-%dT%H:%M:%S.000Z')


    def populate_first_string(self):
        if not(self.populated):
            self.populate()

        team_list = self.df["team"].unique()

        last_game_list = []

        for team in team_list:
            sched_df = s.get_team_schedule(team)
        
            sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

            now = datetime.now()

            sched_df = sched_df.query(f'datetime <= "{now.strftime("%Y-%m-%d")}"')

            sched_df.sort_values(by='datetime', inplace=True, ascending=False)

            sched_df.reset_index(drop=True, inplace=True)
 
            last_game_list.append(sched_df.iloc[0]["game_id"])

        starters = []

        for game in last_game_list:
            box_df = s.get_game_boxscore(game)
            
            curr_starters = box_df[box_df['starter'] == True]["player_id"].astype('int').values.tolist()

            starters = starters + curr_starters

        
        self.first_string_df = self.df[self.df['id'].isin(starters)]
        self.first_string_df.to_csv(f"{os.getcwd()}/cache/bkb/first_string.csv")
        self.first_string_populated = True