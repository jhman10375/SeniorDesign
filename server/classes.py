from ctypes import Array
from typing import List
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
import numpy as np
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from fake_useragent import UserAgent

load_dotenv()
token = os.getenv("CFBD_TOKEN")

class fbGame(BaseModel):

    game_id : int
    home_id : int
    home_team : str
    away_team : str
    start_date : str


class teamLogo(BaseModel):
    id: str
    school : str
    abbreviation : str | None
    alt_name_1 : str | None
    alt_name_2 : str | None
    alt_name_3 : str | None
    city : str | None
    state : str | None
    logos : List[str] | None
    

class location(BaseModel):
    venue_id : float | None
    name : str | None
    city : str | None
    state : str | None
    zip : str | None
    country_code : str | None
    timezone : str | None
    latitude : float | None
    longitude : float | None
    elevation : float | None
    capacity : float | None
    year_constructed : float | None
    grass : bool | None
    dome : bool | None


class school(BaseModel):
    id: str
    school : str
    mascot : str | None
    abbreviation : str | None
    alt_name_1 : str | None
    alt_name_2 : str | None
    alt_name_3 : str | None
    conference : str | None
    division : str | None
    color : str | None
    alt_color : str | None
    logos : List[str] | None
    twitter : str | None
    location : location


class bbGame(BaseModel):

    game_id : str
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


class bkbPreds(BaseModel):
    player_name: str
    player_ID : int
    player_position: str
    three_pointers: float
    two_pointers : float
    free_throws : float
    rebounds : float
    assists : float
    blocked_shots : float
    steals : float
    turnovers : float


class bbPlayer(BaseModel):

    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_year : int
    player_team : str
    player_batting_hand : str
    player_throwing_hand : str
    team_color : str
    team_alt_color : str
    team_logos : str


class bsbStats(BaseModel):
    player_name : str
    player_id : int
    player_position : str
    win : bool
    saves : float
    innings : float
    earned_runs_allowed : float
    singles : float
    doubles : float
    triples : float
    homers : float
    runs : float
    runs_batted_in : float
    walks : float
    hits_by_pitch : float
    stolen_bases : float
    caught_stealing : float


class sccPlayer(BaseModel):
    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_year : int
    player_team : str
    team_color : str
    team_alt_color : str
    team_logos : str


class sccStats(BaseModel):
    player_name : str
    player_id : int
    player_position : str
    goals : int
    assists : int
    shots_on_goal : int
    shots_off_goal : int
    fouls : int
    yellow_cards : int
    red_cards : int
    clean_sheet : int
    goals_allowed : int
    saves : int


class SchedMatch(BaseModel):
  home: str
  away: str


class SchedWeek(BaseModel):
  week_num: int
  week_matches: list[SchedMatch]


class fbPlayerWithStats(BaseModel):
    
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
    stats: predictedStats


class sccPreds(BaseModel):
    player_name : str
    player_id : int
    player_position : str
    goals : float
    assists : float
    shots_on_goal : float
    shots_off_goal : float
    fouls : float
    yellow_cards : float
    red_cards : float
    clean_sheet : float
    goals_allowed : float
    saves : float


class bkbPlayerWithStats(BaseModel):
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
    stats: bkbPreds


class bsbPlayerWithStats(BaseModel):
    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_year : int
    player_team : str
    player_batting_hand : str
    player_throwing_hand : str
    team_color : str
    team_alt_color : str
    team_logos : str
    stats: bsbStats


class sccPlayerWithStats(BaseModel):
    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_year : int
    player_team : str
    team_color : str
    team_alt_color : str
    team_logos : str
    stats: sccPreds



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

            if not(box_df.empty):
            
                curr_starters = box_df[box_df['starter'] == True]["player_id"].astype('int').values.tolist()

                starters = starters + curr_starters

        
        self.first_string_df = self.df[self.df['id'].isin(starters)]
        self.first_string_df.to_csv(f"{os.getcwd()}/cache/bkb/first_string.csv")
        self.first_string_populated = True


class bsbPlayers():
    def __init__(self, fullList : playerList):
        
        self.teams = None
        self.populated = False
        try:
            self.teams = pd.read_csv(f"{os.getcwd()}/cache/bsb/bsb_teams.csv")
            self.populated = True 
        except FileNotFoundError:
            self.populate()
        
        if not(fullList.populated):
            fullList.populate()
        
        self.details = fullList.__df__

        self.players_populated = False

        self.players = None
        
        nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}

        try:
            self.players = pd.read_csv(f"{os.getcwd()}/cache/bsb/bsb_players.csv")
            self.players = self.players.fillna(nan_values)


            self.populated = True 
        except FileNotFoundError:
            self.populate_players()
        
        self.first_string_populated = False

        self.first_string_df = None

        try:
            self.first_string_df = pd.read_csv(f"{os.getcwd()}/cache/bsb/first_string.csv")
            self.first_string_df = self.first_string_df.fillna(nan_values)

            self.first_string_populated = True 
        except FileNotFoundError:
            self.populate_first_string()



    def elongate_name(old_name : str) -> str:
        new_name = old_name
        
        if new_name[-3:] == "St.":
            new_name = "State".join(old_name.rsplit("St.", 1))
        
        new_name = new_name.replace("Mich.", "Michigan").replace("Fla.", "Florida").replace("Ga.", "Georgia")

        
        return new_name.replace("Ark.", "Arkansas").replace("Ky.", "Kentucky").replace("Ill.", "Illinois")
    
    def populate(self):
        self.populated = True

        try:
            options = Options()
            options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            ua = UserAgent()
            userAgent = ua.random
            options.add_argument(f'user-agent={userAgent}')
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            # Open the NCAA rankings page
            driver.get("https://stats.ncaa.org/rankings/national_ranking?academic_year=2024.0&division=1.0&ranking_period=108.0&sport_code=MBA&stat_seq=496.0")

            # Wait for the page to load
            wait = WebDriverWait(driver, 10)

            
            # Select "Baseball" from the sports dropdown
            sports_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "rankings_table_length")))
            Select(sports_dropdown).select_by_value("-1")
            team_num = int(Select(sports_dropdown).first_selected_option.text)

            # Wait for the table to load
            wait = WebDriverWait(driver, 10)
            table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='dataTables_scrollBody']//table")))

            # Extract rows from the table
            rows = table.find_elements(By.TAG_NAME, "tr")

            teams = []
        
            print("Team ID and Name:")
            for row_index in range(1,team_num+1):  # Skip the header row
                # Locate the link within the cell containing the team name
                link = rows[row_index].find_element(By.XPATH, f'//*[@id="rankings_table"]/tbody/tr[{row_index}]/td[2]/a')
                team_name = link.text
                team_id = link.get_attribute("href").split("/")[-1]  # Extract the ID from the URL
                teams.append({"id": team_id, "name": team_name})
                row_index = 1 + row_index

            #print(teams)
            print("Scrape Done!")
        finally:
            # Close the browser
            driver.quit()
        
        year = datetime.now().year

        for team in teams:
            team["id"] = int(team["id"])
        
            options = Options()
            options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            ua = UserAgent()
            userAgent = ua.random
            options.add_argument(f'user-agent={userAgent}')
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
            # Open the NCAA rankings page
            driver.get(f"https://stats.ncaa.org/teams/{team['id']}")

            year_str = str(int(year) - 1) + '-' + str(year)[-2:]

            wait = WebDriverWait(driver, 10)
            
            # Select "Baseball" from the sports dropdown
            year_dropdown = wait.until(EC.presence_of_element_located((By.ID, "year_list")))
            Select(year_dropdown).select_by_visible_text(year_str)
            
            wait = WebDriverWait(driver, 10)
        
            
            
            if team["name"].find('(') != -1:
                team["conference"] = team["name"][(team["name"].find('(')+1) : team["name"].find(')')]
                team["name"] = bsbPlayers.elongate_name(team["name"][:(team["name"].find('(')-1)])

            new_url = driver.current_url
            new_number = new_url.split("/")[-1]
            new_number = new_number[:(new_number.find('?'))]

            team["id"] = new_number
            
            driver.quit()  

        teams_df = pd.DataFrame(teams)

        teams_df.to_csv(f"{os.getcwd()}/cache/bsb/bsb_teams.csv")

        self.teams = teams_df

    def populate_players(self):
        
        if not(self.populated):
            self.populate()

        self.players_populated = True

        team_list = self.teams["name"].unique()
        bsb_players = pd.DataFrame(columns = ['id', 'name', 'year', 'jersey', 'position', 'height', 'bat', 'throw', 'color', 'alt_color', 'logos', 'team'])
        teams_df = self.teams  


        for team_name in team_list:
            
            team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']
            
            team_info = self.details.query(f'school == "{team_name}"')
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
                
                options = Options()
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                ua = UserAgent()
                userAgent = ua.random
                options.add_argument(f'user-agent={userAgent}')
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
                
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
                                    'height': height, 'bat': bat_hand, 'throw': throw_hand,
                                    'color': team_color, 'alt_color': team_alt, 
                                    'logos': team_logos, 'team': team_name})
                    
            finally:
                # Close the browser
                driver.quit() 

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
            
                bsb_players.loc[len(bsb_players)] = player
            

        bsb_players.to_csv(f"{os.getcwd()}/cache/bsb/bsb_players.csv")
        self.players = bsb_players

    def populate_first_string(self):
        
        if not(self.players_populated):
            self.populate_players()

        first_stringers = pd.DataFrame(columns=self.players.columns)
    
        teams = self.players["team"].unique()
        
        nan_values = {"throw": "None Listed", "bat": "None Listed", 
                    'position': "None Listed"}
        
        for team in teams:
            players = self.players.query(f'team == "{team}"')
            last_game = self.__last_game(team)
            stat_list = np.zeros(len(players))
            players = players.fillna(nan_values)
            for i in range(len(players)):
                player = players.iloc[i]
                id = player['id']
                name = player['name']
                pos = player['position']
                if last_game.home_team == team:
                    stats = self.__game_info(id, last_game.start_date, last_game.away_team,pos,name)
                else:
                    stats = self.__game_info(id, last_game.start_date, last_game.home_team,pos,name)
                stat_list[i] = (stats.saves + stats.innings + stats.earned_runs_allowed + stats.singles
                                + stats.doubles + stats.triples + stats.homers + stats.runs 
                                + stats.runs_batted_in + stats.walks + stats.hits_by_pitch 
                                + stats.stolen_bases + stats.caught_stealing)
        
            players['stats'] = stat_list
            positions = players['position'].unique()
        
            for position in positions:
                plyrs_pos = players.query(f'position == "{position}"')
                plyrs_pos.sort_values(by='stats', inplace=True, ascending=False)
                starter = plyrs_pos.iloc[0].drop(columns='stats')
                first_stringers.loc[len(first_stringers)] = starter

        self.first_string_df = True

        self.firstString = first_stringers

        print("done!")

    def __last_game(self, team_name):
        game_list = self.__schedule(team_name, datetime.now().year)

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
            game_list = self.__schedule(team_name, datetime.now().year-1)

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
                            home_id=games_df.iloc[0]['home_id'], 
                            home_team=games_df.iloc[0]['home_team'].replace('(1)', '').replace('(2)', '').strip(), 
                            away_team=games_df.iloc[0]['away_team'].replace('(1)', '').replace('(2)', '').strip(), 
                            start_date=games_df.iloc[0]['start_date'])

        return last_game

    def __schedule(self, team_name, year):
        teams_df = self.teams  

        team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

        
        try:
            
            
                options = Options()
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                ua = UserAgent()
                userAgent = ua.random
                options.add_argument(f'user-agent={userAgent}')
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            
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
                            last_W = row.rfind(' W ' )
                            last_L = row.rfind(' L ')
                        
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
                        
                            if (opp.find(')') != -1) and (type(re.search(r"\([A-Z]{2}\)", opp)) == type(None)):
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
                            opp = row[(row.find(str(datetime.now().year)) + len(str(datetime.now().year))):].strip()
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
                    opp = opp.replace('Ppd', '').strip()
                    opp = opp.replace('(1)', '').replace('(2)', '').strip()
                    
                    
                    if (opp.find(')') != -1) and (type(re.search(r"\([A-Z]{2}\)", opp)) == type(None)):
                        opp = opp[:opp.find('(')].strip()
                    
                    games.append({"date": str(game_date), "opponent": bsbPlayers.elongate_name(opp), "home": home})
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
                curr_op = games[index]['opponent']
                opp_q = teams_df.query(f'name == "{curr_op}"')

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

    def __game_info(self, player_id, game_date, opp, position, name):
        try:
                options = Options()
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                ua = UserAgent()
                userAgent = ua.random
                options.add_argument(f'user-agent={userAgent}')
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
                
                    # Open the NCAA roster page
                driver.get(f"https://stats.ncaa.org/players/{player_id}")
                
                # Wait for the table to load
                wait = WebDriverWait(driver, 10)
                tables = driver.find_elements(By.TAG_NAME, "table")

                game_date_time = datetime.strptime(game_date, '%Y-%m-%d')

                year = game_date_time.year
                #print(f'{year=}')

                if year != datetime.now().year:
                    year_table = tables[1].text

                    year_str = str(int(year) - 1) + '-' + str(year)[-2:]

                    num_rows_year_table = year_table.count('-')
                    #print(f'{num_rows_year_table=}')
                    #print(f'{year_str=}')

                    year_xml_path = '/html/body/div[2]/div/div/div/div/div/div[4]/div/div/div[2]/div/div[2]/div[2]/table/tbody'
                
                    for index in range(1,num_rows_year_table+1):
                        current_date_info = driver.find_element(By.XPATH, year_xml_path + f'/tr[{index}]/td[1]/a')
                        current_date = current_date_info.text
                    
                    
                        #print(f'{current_date=}')
                    
                        if (current_date == year_str):
                            #print('found date')
                            new_player_id = current_date_info.get_attribute("href").split("/")[-1]
                            #print(f'{new_player_id=}')
                            driver.get(f"https://stats.ncaa.org/players/{new_player_id}")
                            wait = WebDriverWait(driver, 10)
                            tables = driver.find_elements(By.TAG_NAME, "table")
                            break


                try:
                    if tables[-1].text.split('\n')[0].find("Totals") != -1:
                        table = tables[-2].text.split('\n')
                        xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                        alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                    else:
                        table = tables[-1].text.split('\n')
                        xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                        alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                except IndexError:
                    try:
                        invalid_test = driver.find_element(By.XPATH, "/html/body/pre")
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
                                player_id=-1,
                                player_name="zz-INVALID PLAYER-zz",
                                player_position="N/A")
                    except IndexError:
                        wait = WebDriverWait(driver, 10)
                        wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/header")))
                        tables = driver.find_elements(By.TAG_NAME, "table")
                        if tables[-1].text.split('\n')[0].find("Totals") != -1:
                            table = tables[-2].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                        else:
                            table = tables[-1].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                    except NoSuchElementException:
                        wait = WebDriverWait(driver, 10)
                        wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/header")))
                        tables = driver.find_elements(By.TAG_NAME, "table")
                        if tables[-1].text.split('\n')[0].find("Totals") != -1:
                            table = tables[-2].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                        else:
                            table = tables[-1].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                
                num_rows = 0
        
                for potential_row in table:
                    if potential_row.find('/' + game_date[0:4]) != -1:
                        num_rows = num_rows+1
        
                
                game_date = game_date_time.strftime('%m/%d/%Y')
            
                num_rows = num_rows+1
        
                #print(f'{player_id=}')
                #print(f'{game_date=}')
                #print(f'{position=}')
                #print(f'{opp=}')
        
                found_game = False


                #print(f'{num_rows=}')
                for index in range(1,num_rows+1):
                    try:
                        current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]')
                    except NoSuchElementException:
                        xml_path = alt_path
                        current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]')
                    current_date = current_date_info.text
        
                    current_team_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[2]')
                    current_team = current_team_info.text
        
                    GP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[4]')
                    GP = GP_info.text
        
                    current_team = current_team.replace('@', '').strip()
                    
                    if current_team.find('\n') != -1:
                        current_team = current_team[:current_team.find('\n')].strip()
                    
        
                    if current_team.find('#') == 0:
                        current_team = current_team[3:].strip()
                    
                    current_team = current_team.replace('(1)', '').replace('(2)', '')
                    current_team = bsbPlayers.elongate_name(current_team.strip())
                    #print(f'{current_team == opp=}')
                    #print(f'{current_date == game_date=}')
                    #print(f'{current_team.find(opp)=}')
                    #print(f'{current_team=}')
                    #print(f'{GP=}')
        
                    current_date = current_date.replace('(1)', '').replace('(2)', '').strip()

                    if (current_date == game_date) and (current_team == opp):
                        found_game = True
                        #print(opp)
                        win_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[3]')
                        win_text = win_info.text
                        if win_text.find('W') != -1:
                            win = True
                        else:
                            win = False
                        #print(win)
                        if GP == '1':
                            if position == 'P':
                                singles = 0
                                doubles = 0
                                triples = 0
                                homers = 0
                                runs = 0
                                runs_batted_in = 0
                                walks = 0
                                hits_by_pitch = 0 
                                stolen_bases = 0
                                caught_stealing = 0
                                try:
                                    saves_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[33]')
                                    saves = saves_info.text
                                    if saves == '':
                                        saves = '0'
                                    saves = float(saves.replace('/', ''))
                                    
                                    innings_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                                    innings = innings_info.text
                                    if innings == '':
                                        innings = '0'
                                    innings = float(innings.replace('/', ''))
                                    
                                    ERA_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                                    earned_runs_allowed = ERA_info.text
                                    if earned_runs_allowed == '':
                                        earned_runs_allowed = '0'
                                    earned_runs_allowed = float(earned_runs_allowed.replace('/', ''))
                                except NoSuchElementException:
                                    singles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                                    singles = singles_info.text
                                    if singles == '':
                                        singles = '0'
                                    singles = float(singles.replace('/', ''))
                                    
                                    doubles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                                    doubles = doubles_info.text
                                    if doubles == '':
                                        doubles = '0'
                                    doubles = float(doubles.replace('/', ''))
                                    
                                    triples_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                                    triples = triples_info.text
                                    if triples == '':
                                        triples = '0'
                                    triples = float(triples.replace('/', ''))
                                    
                                    homers_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                                    homers = homers_info.text
                                    if homers == '':
                                        homers = '0'
                                    homers = float(homers.replace('/', ''))
                                    
                                    runs_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[5]')
                                    runs = runs_info.text
                                    if runs == '':
                                        runs = '0'
                                    runs = float(runs.replace('/', ''))
                                    
                                    RBI_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[12]')
                                    runs_batted_in = RBI_info.text
                                    if runs_batted_in == '':
                                        runs_batted_in = '0'
                                    runs_batted_in = float(runs_batted_in.replace('/', ''))
                                    
                                    walks_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[13]')
                                    walks = walks_info.text
                                    if walks == '':
                                        walks = '0'
                                    walks = float(walks.replace('/', ''))
                                    
                                    HBP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[14]')
                                    hits_by_pitch = HBP_info.text
                                    if hits_by_pitch == '':
                                        hits_by_pitch = '0'
                                    hits_by_pitch = float(hits_by_pitch.replace('/', ''))
                                    
                                    stolen_bases_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[21]')
                                    stolen_bases = stolen_bases_info.text
                                    if stolen_bases == '':
                                        stolen_bases = '0'
                                    stolen_bases = float(stolen_bases.replace('/', ''))
                                    
                                    caught_stealing_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[19]')
                                    caught_stealing = caught_stealing_info.text
                                    if caught_stealing == '':
                                        caught_stealing = '0'
                                    caught_stealing = float(caught_stealing.replace('/', ''))
            
                                    
                                    saves = 0
                                    innings = 0
                                    earned_runs_allowed = 0
                            else:
                                #print('nonpitcher')
                                try:
                                    singles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                                    singles = singles_info.text
                                    if singles == '':
                                        singles = '0'
                                    singles = float(singles.replace('/', ''))
                                    
                                    doubles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                                    doubles = doubles_info.text
                                    if doubles == '':
                                        doubles = '0'
                                    doubles = float(doubles.replace('/', ''))
                                    
                                    triples_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                                    triples = triples_info.text
                                    if triples == '':
                                        triples = '0'
                                    triples = float(triples.replace('/', ''))
                                    
                                    homers_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                                    homers = homers_info.text
                                    if homers == '':
                                        homers = '0'
                                    homers = float(homers.replace('/', ''))
                                    
                                    runs_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[5]')
                                    runs = runs_info.text
                                    if runs == '':
                                        runs = '0'
                                    runs = float(runs.replace('/', ''))
                                    
                                    RBI_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[12]')
                                    runs_batted_in = RBI_info.text
                                    if runs_batted_in == '':
                                        runs_batted_in = '0'
                                    runs_batted_in = float(runs_batted_in.replace('/', ''))
                                    
                                    walks_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[13]')
                                    walks = walks_info.text
                                    if walks == '':
                                        walks = '0'
                                    walks = float(walks.replace('/', ''))
                                    
                                    HBP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[14]')
                                    hits_by_pitch = HBP_info.text
                                    if hits_by_pitch == '':
                                        hits_by_pitch = '0'
                                    hits_by_pitch = float(hits_by_pitch.replace('/', ''))
                                    
                                    stolen_bases_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[21]')
                                    stolen_bases = stolen_bases_info.text
                                    if stolen_bases == '':
                                        stolen_bases = '0'
                                    stolen_bases = float(stolen_bases.replace('/', ''))
                                    
                                    caught_stealing_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[19]')
                                    caught_stealing = caught_stealing_info.text
                                    if caught_stealing == '':
                                        caught_stealing = '0'
                                    caught_stealing = float(caught_stealing.replace('/', ''))
            
                                    
                                    saves = 0
                                    innings = 0
                                    earned_runs_allowed = 0
                                except NoSuchElementException:
                                    saves = 0
                                    innings = 0
                                    earned_runs_allowed = 0
                                    singles = 0
                                    doubles = 0
                                    triples = 0
                                    homers = 0
                                    runs = 0
                                    runs_batted_in = 0
                                    walks = 0
                                    hits_by_pitch = 0 
                                    stolen_bases = 0
                                    caught_stealing = 0 
                        else:
                            saves = 0
                            innings = 0
                            earned_runs_allowed = 0
                            singles = 0
                            doubles = 0
                            triples = 0
                            homers = 0
                            runs = 0
                            runs_batted_in = 0
                            walks = 0
                            hits_by_pitch = 0 
                            stolen_bases = 0
                            caught_stealing = 0 
                        
                        break            
                # Extract rows from the table
                #rows = table.text.split('\n')
        finally:
                # Close the browser
                driver.quit() 
                #pass
        
        if found_game:
            gameStats = bsbStats(win=win, 
                                saves=saves,
                                innings=innings,
                                earned_runs_allowed=earned_runs_allowed,
                                singles=singles,
                                doubles=doubles,
                                triples=triples,
                                homers=homers,
                                runs=runs,
                                runs_batted_in=runs_batted_in,
                                walks=walks,
                                hits_by_pitch=hits_by_pitch,
                                stolen_bases=stolen_bases,
                                caught_stealing=caught_stealing,
                                player_id=player_id,
                                player_name=name,
                                player_position=position)
        else:
            print("Warning, game not found for this year")
            gameStats = bsbStats(win=0, 
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
                                player_name=name,
                                player_position=position)
        
        return gameStats


class sccPlayers():
    def __init__(self, fullList : playerList):
        
        self.teams = None
        self.populated = False
        try:
            self.teams = pd.read_csv(f"{os.getcwd()}/cache/scc/scc_teams.csv")
            self.populated = True 
        except FileNotFoundError:
            self.populate()
        
        if not(fullList.populated):
            fullList.populate()
        
        self.details = fullList.__df__

        self.players_populated = False

        self.players = None

        nan_values = {'position': "None Listed", 'height': 0,
                      'year': 0, 'team': 'None'}

        try:
            self.players = pd.read_csv(f"{os.getcwd()}/cache/scc/scc_players.csv")
            self.players = self.players.fillna(nan_values)


            self.populated = True 
        except FileNotFoundError:
            self.populate_players()

        self.first_string_populated = False

        self.first_string_df = None

        try:
            self.first_string_df = pd.read_csv(f"{os.getcwd()}/cache/scc/first_string.csv")
            self.first_string_df = self.first_string_df.fillna(nan_values)

            
            self.first_string_populated = True 
        except FileNotFoundError:
            self.populate_first_string()

    
    def populate(self):
        self.populated = True
        try:
            options = Options()
            options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            ua = UserAgent()
            userAgent = ua.random
            options.add_argument(f'user-agent={userAgent}')
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            # Open the NCAA rankings page
            driver.get("https://stats.ncaa.org/rankings/national_ranking?academic_year=2025.0&division=1.0&ranking_period=69.0&sport_code=MSO&stat_seq=90.0")

            # Wait for the page to load
            wait = WebDriverWait(driver, 10)

            
            # Select "Baseball" from the sports dropdown
            sports_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "rankings_table_length")))
            Select(sports_dropdown).select_by_value("-1")
            team_num = int(Select(sports_dropdown).first_selected_option.text)

            # Wait for the table to load
            wait = WebDriverWait(driver, 10)
            table = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='dataTables_scrollBody']//table")))

            # Extract rows from the table
            #rows = table.find_elements(By.TAG_NAME, "tr")

            teams = []
        
            print("Team ID and Name:")
            for row_index in range(1,team_num+1):  # Skip the header row
                # Locate the link within the cell containing the team name
                link = table.find_element(By.XPATH, f'/html/body/div[2]/div/div/div/div/div/div[2]/div/div[2]/div[1]/div[5]/div[2]/table/tbody/tr[{row_index}]/td[2]/a')
                team_name = link.text
                team_id = link.get_attribute("href").split("/")[-1]  # Extract the ID from the URL
                teams.append({"id": team_id, "name": team_name})
                row_index = 1 + row_index

            #print(teams)
            print("Scrape Done!")
        finally:
            # Close the browser
            driver.quit()
            #pass
        

        for team in teams:        
            
            if team["name"].find('(') != -1:
                team["conference"] = team["name"][(team["name"].find('(')+1) : team["name"].find(')')]
                team["name"] = bsbPlayers.elongate_name(team["name"][:(team["name"].find('(')-1)])

        teams_df = pd.DataFrame(teams)

        self.teams = teams_df

        teams_df.to_csv(f"{os.getcwd()}/cache/scc/scc_teams.csv")


    def populate_players(self):
        
        if not(self.populated):
            self.populate()

        self.players_populated = True

        teams_df = self.teams
        team_list = teams_df["name"].unique()

        scc_players = pd.DataFrame(columns = ['id', 'name', 'year', 'jersey', 'position', 'height', 'color', 'alt_color', 'logos', 'team'])


        for team_name in team_list:
                    
                    team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']
                    
                    team_info = self.details.__df__.query(f'school == "{team_name}"')
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
                        
                        options = Options()
                        options.add_argument('--headless')
                        options.add_argument('--no-sandbox')
                        options.add_argument('--disable-dev-shm-usage')
                        ua = UserAgent()
                        userAgent = ua.random
                        options.add_argument(f'user-agent={userAgent}')
                        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
                        
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

                        scc_players.loc[len(scc_players)] = player
                    

        scc_players.to_csv(f"{os.getcwd()}/cache/scc/scc_players.csv")

                    
        self.players = scc_players


    def populate_first_string(self):
        
        first_stringers = pd.DataFrame(columns=self.players.columns)
    
        teams = self.players["team"].unique()
        
        nan_values = {"throw": "None Listed", "bat": "None Listed", 
                    'position': "None Listed"}
        
        for team in teams:
        #    if team in known_teams:
        #        continue
            players = self.players.query(f'team == "{team}"')
            last_game = self.__last_game(team)
            stat_list = np.zeros(len(players))
            players = players.fillna(nan_values)
            for i in range(len(players)):
                player = players.iloc[i]
                id = player['id']
                name = player['name']
                pos = player['position']
                if last_game.home_team == team:
                    stats = self.__game_info(id, last_game.start_date, last_game.away_team,pos,name, False)
                else:
                    stats = self.__game_info(id, last_game.start_date, last_game.home_team,pos,name, False)
                stat_list[i] = (stats.goals + stats.assists + stats.shots_on_goal + stats.shots_off_goal
                                + stats.fouls + stats.yellow_cards + stats.red_cards + stats.clean_sheet 
                                + stats.goals_allowed + stats.saves)
        
            players['stats'] = stat_list
            positions = players['position'].unique()
        
            for position in positions:
                plyrs_pos = players.query(f'position == "{position}"')
                plyrs_pos.sort_values(by='stats', inplace=True, ascending=False)
                starter = plyrs_pos.iloc[0].drop(columns='stats')
                first_stringers.loc[len(first_stringers)] = starter
                
        print("done!")


    def __last_game(self, team_name):
        game_list = self.__schedule(team_name, datetime.now().year)

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
            game_list = self.__schedule(team_name, datetime.now().year-1)

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
                            home_id=games_df.iloc[0]['home_id'], 
                            home_team=games_df.iloc[0]['home_team'].replace('(1)', '').replace('(2)', '').strip(), 
                            away_team=games_df.iloc[0]['away_team'].replace('(1)', '').replace('(2)', '').strip(), 
                            start_date=games_df.iloc[0]['start_date'])

        return last_game
    

    def __schedule(self, team_name, year):
        teams_df = self.teams  

        team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

        try:
            
            
                options = Options()
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-dev-shm-usage')
                ua = UserAgent()
                userAgent = ua.random
                options.add_argument(f'user-agent={userAgent}')
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            
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
                    
                    if row.rfind('/') == -1:
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
                            
                            matches = [match.start() for match in re.finditer(r' \d+-\d+', row)]
                            
                            if len(matches) > 0:
                                result_index = matches[-1] - 1
                            else:
                                result_index = -1
                        
                            if result_index != -1:
                                opp = row[row.find(date)+len(date):result_index].strip()
                            else:
                                opp = row[row.find(date)+len(date):].strip()
                        
                            if (opp.find(')') != -1) and (type(re.search(r"\([A-Z]{2}\)", opp)) == type(None)):
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
                            opp = row[(row.find(str(datetime.now().year)) + len(str(datetime.now().year))):].strip()
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
                    opp = opp.replace('Ppd', '').strip()
                    opp = opp.replace('(1)', '').replace('(2)', '').strip()
                    
                    if (opp.find(')') != -1) and (type(re.search(r"\([A-Z]{2}\)", opp)) == type(None)):
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
                curr_op = games[index]['opponent']
                opp_q = teams_df.query(f'name == "{curr_op}"')

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


    def __game_info(self, player_id, game_date, opp, position, name, resend = False):
        try:
                    options = Options()
                    options.add_argument('--headless')
                    options.add_argument('--no-sandbox')
                    options.add_argument('--disable-dev-shm-usage')
                    ua = UserAgent()
                    userAgent = ua.random
                    options.add_argument(f'user-agent={userAgent}')
                    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
                    
                        # Open the NCAA roster page
                    driver.get(f"https://stats.ncaa.org/players/{player_id}")
                    
                    # Wait for the table to load
                    wait = WebDriverWait(driver, 10)
                    tables = driver.find_elements(By.TAG_NAME, "table")

                    game_date_time = datetime.strptime(game_date, '%Y-%m-%d')

                    year = game_date_time.year
                    #print(f'{year=}')

                    if (year != datetime.now().year) and resend:
                        year_table = tables[1].text

                        year_str = str(int(year) - 1) + '-' + str(year)[-2:]

                        num_rows_year_table = year_table.count('-')
                        #print(f'{num_rows_year_table=}')
                        #print(f'{year_str=}')

                        year_xml_path = '/html/body/div[2]/div/div/div/div/div/div[4]/div/div/div[2]/div/div[2]/div[2]/table/tbody'
                    
                        for index in range(1,num_rows_year_table+1):
                            current_date_info = driver.find_element(By.XPATH, year_xml_path + f'/tr[{index}]/td[1]/a')
                            current_date = current_date_info.text
                        
                        
                            #print(f'{current_date=}')
                        
                            if (current_date == year_str):
                                #print('found date')
                                new_player_id = current_date_info.get_attribute("href").split("/")[-1]
                                #print(f'{new_player_id=}')
                                driver.get(f"https://stats.ncaa.org/players/{new_player_id}")
                                wait = WebDriverWait(driver, 10)
                                tables = driver.find_elements(By.TAG_NAME, "table")
                                break



                    try:
                        if tables[-1].text.split('\n')[0].find("Totals") != -1:
                            table = tables[-2].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                        else:
                            table = tables[-1].text.split('\n')
                            xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                            alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                    except IndexError:
                        try:
                            invalid_test = driver.find_element(By.XPATH, "/html/body/pre")
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
                                        player_id=-1,
                                        player_name="zz-INVALID PLAYER-zz",
                                        player_position="N/A")
                        except IndexError:
                            wait = WebDriverWait(driver, 10)
                            wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/header")))
                            tables = driver.find_elements(By.TAG_NAME, "table")
                            if tables[-1].text.split('\n')[0].find("Totals") != -1:
                                table = tables[-2].text.split('\n')
                                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                                alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                            else:
                                table = tables[-1].text.split('\n')
                                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                                alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                        except NoSuchElementException:
                            wait = WebDriverWait(driver, 10)
                            wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/header")))
                            tables = driver.find_elements(By.TAG_NAME, "table")
                            if tables[-1].text.split('\n')[0].find("Totals") != -1:
                                table = tables[-2].text.split('\n')
                                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
                                alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                            else:
                                table = tables[-1].text.split('\n')
                                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
                                alt_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"


                    num_rows = 0
            
                    for potential_row in table:
                        if potential_row.find('/' + game_date[0:4]) != -1:
                            num_rows = num_rows+1
            
                    
                    game_date = game_date_time.strftime('%m/%d/%Y')
                
                    num_rows = num_rows+1
            
                    #print(f'{player_id=}')
                    #print(f'{game_date=}')
                    #print(f'{position=}')
                    #print(f'{opp=}')
            
                    found_game = False


                    #print(f'{num_rows=}')
                    for index in range(1,num_rows+1):
                        try:
                            current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]')
                        except NoSuchElementException:
                            xml_path = alt_path
                            current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]')

                        current_date = current_date_info.text
            
                        current_team_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[2]')
                        current_team = current_team_info.text
            
                        GP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[4]')
                        GP = GP_info.text
            
                        current_team = current_team.replace('@', '').strip()
                        
                        if current_team.find('\n') != -1:
                            current_team = current_team[:current_team.find('\n')].strip()
                        
            
                        if current_team.find('#') == 0:
                            current_team = current_team[3:].strip()
                        
                        current_team = current_team.strip()
                        current_team = current_team.replace('(1)', '').replace('(2)', '')
                        current_team = current_team.strip()
                        #print(f'{current_team == opp=}')
                        #print(f'{current_date == game_date=}')
                        #print(f'{current_team.find(opp)=}')
                        #print(f'{current_team=}')
                        #print(f'{GP=}')
            
                        current_date = current_date.replace('(1)', '').replace('(2)', '').strip()

                        if (current_date == game_date) and (current_team == opp):
                            found_game = True
                            #print(opp)
                            
                            #print(win)
                            if GP == '1':
                                if position == 'GK':
                                    #print("GOALKEEPER")
                                    goals = 0
                                    assists = 0
                                    shots_onG = 0
                                    shots_offG = 0
                                    fouls = 0
                                    yellows = 0
                                    reds = 0
                                    
                                    try:
                                        saves_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                                        saves = saves_info.text
                                        if saves == '':
                                            saves = '0'
                                        saves = float(saves.replace('/', ''))
                                        
                                        goals_allowed_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                                        goals_allowed = goals_allowed_info.text
                                        if goals_allowed == '':
                                            goals_allowed = '0'
                                        goals_allowed = float(goals_allowed.replace('/', ''))

                                        if goals_allowed == 0:
                                            clean_sheet = 1
                                        else:
                                            clean_sheet = 0
                                    except NoSuchElementException:
                                        goals_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[5]')
                                        goals = goals_info.text
                                        if goals == '':
                                            goals = '0'
                                        goals = float(goals.replace('/', ''))
                                        
                                        assists_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[6]')
                                        assists = assists_info.text
                                        if assists == '':
                                            assists = '0'
                                        assists = float(assists.replace('/', ''))
                                        
                                        shots_onG_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                                        shots_onG = shots_onG_info.text
                                        if shots_onG == '':
                                            shots_onG = '0'
                                        shots_onG = float(shots_onG.replace('/', ''))
                                        
                                        shots_all_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                                        shots_all = shots_all_info.text
                                        if shots_all == '':
                                            shots_all = '0'
                                        shots_all = float(shots_all.replace('/', ''))

                                        shots_offG = shots_all - shots_onG
                                        
                                        fouls_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                                        fouls = fouls_info.text
                                        if fouls == '':
                                            fouls = '0'
                                        fouls = float(fouls.replace('/', ''))
                                        
                                        yellows_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                                        yellows = yellows_info.text
                                        if yellows == '':
                                            yellows = '0'
                                        yellows = float(yellows.replace('/', ''))
                                        
                                        reds_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[10]')
                                        reds = reds_info.text
                                        if reds == '':
                                            reds = '0'
                                        reds = float(reds.replace('/', ''))
                                        
                
                                        
                                        saves = 0
                                        goals_allowed = 0
                                        clean_sheet = 0
                                    
                                else:
                                    try:
                                        goals_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[5]')
                                        goals = goals_info.text
                                        if goals == '':
                                            goals = '0'
                                        goals = float(goals.replace('/', ''))
                                        
                                        assists_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[6]')
                                        assists = assists_info.text
                                        if assists == '':
                                            assists = '0'
                                        assists = float(assists.replace('/', ''))
                                        
                                        shots_onG_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                                        shots_onG = shots_onG_info.text
                                        if shots_onG == '':
                                            shots_onG = '0'
                                        shots_onG = float(shots_onG.replace('/', ''))
                                        
                                        shots_all_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                                        shots_all = shots_all_info.text
                                        if shots_all == '':
                                            shots_all = '0'
                                        shots_all = float(shots_all.replace('/', ''))

                                        shots_offG = shots_all - shots_onG
                                        
                                        fouls_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                                        fouls = fouls_info.text
                                        if fouls == '':
                                            fouls = '0'
                                        fouls = float(fouls.replace('/', ''))
                                        
                                        yellows_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                                        yellows = yellows_info.text
                                        if yellows == '':
                                            yellows = '0'
                                        yellows = float(yellows.replace('/', ''))
                                        
                                        reds_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[10]')
                                        reds = reds_info.text
                                        if reds == '':
                                            reds = '0'
                                        reds = float(reds.replace('/', ''))
                                        
                
                                        
                                        saves = 0
                                        goals_allowed = 0
                                        clean_sheet = 0
                                    except NoSuchElementException:
                                        saves = 0
                                        goals_allowed = 0
                                        clean_sheet = 0
                                        reds = 0
                                        yellows = 0
                                        fouls = 0
                                        shots_offG = 0
                                        shots_onG = 0
                                        assists = 0
                                        goals = 0
                            else:
                                saves = 0
                                goals_allowed = 0
                                clean_sheet = 0
                                reds = 0
                                yellows = 0
                                fouls = 0
                                shots_offG = 0
                                shots_onG = 0
                                assists = 0
                                goals = 0
                            
                            break            
                    # Extract rows from the table
                    #rows = table.text.split('\n')
        finally:
                    # Close the browser
                    driver.quit() 
                    #pass
            
        if found_game:
                gameStats = sccStats(goals=goals, 
                                    assists=assists,
                                    shots_on_goal=shots_onG,
                                    shots_off_goal=shots_offG,
                                    fouls=fouls,
                                    yellow_cards=yellows,
                                    red_cards=reds,
                                    clean_sheet=clean_sheet,
                                    goals_allowed=goals_allowed,
                                    saves=saves,
                                    player_id=player_id,
                                    player_name=name,
                                    player_position=position)
        else:
                if resend:
                    print("Warning, game not found for this year")
                    gameStats = sccStats(goals=0, 
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
                                        player_name=name,
                                        player_position=position)
                else:
                    return self.__game_info(player_id, game_date, opp, position, name, True)
            
        return gameStats

