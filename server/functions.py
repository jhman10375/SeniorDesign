from datetime import datetime
import pandas as pd
import json
import os
import requests
from classes import *
from dotenv import load_dotenv
import pytz
from bs4 import BeautifulSoup
from utils.cbbpy_utils import _get_id_from_team
import cbbpy.mens_scraper as s

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

def all_schools():
    url = f"https://api.collegefootballdata.com/teams/fbs"

    headers = {"Authorization": f"Bearer {token}"}

    teams_response = requests.get(url, headers=headers)

    teams_json = json.loads(teams_response.text)
    # print(teams_json)

    teams_df = pd.json_normalize(teams_json)

    teams_df = teams_df.fillna(value=0)

    teams_df['venue_id'] = teams_df['location.venue_id'].apply(lambda x: x)
    teams_df['name'] = teams_df['location.name'].apply(lambda x: x)
    teams_df['city'] = teams_df['location.city'].apply(lambda x: x)
    teams_df['state'] = teams_df['location.state'].apply(lambda x: x)
    teams_df['zip'] = teams_df['location.zip'].apply(lambda x: x)
    teams_df['country_code'] = teams_df['location.country_code'].apply(lambda x: x)
    teams_df['timezone'] = teams_df['location.timezone'].apply(lambda x: x)
    teams_df['latitude'] = teams_df['location.latitude'].apply(lambda x: x)
    teams_df['longitude'] = teams_df['location.longitude'].apply(lambda x: x)
    teams_df['elevation'] = teams_df['location.elevation'].apply(lambda x: x)
    teams_df['capacity'] = teams_df['location.capacity'].apply(lambda x: x)
    teams_df['year_constructed'] = teams_df['location.year_constructed'].apply(lambda x: x)
    teams_df['grass'] = teams_df['location.grass'].apply(lambda x: x)
    teams_df['dome'] = teams_df['location.dome'].apply(lambda x: x)

    school_data = [school(
            id=str(i.id), 
            school=str(i.school), 
            mascot=str(i.mascot), 
            abbreviation=str(i.abbreviation), 
            alt_name_1=str(i.alt_name1),
            alt_name_2=str(i.alt_name2), 
            alt_name_3=str(i.alt_name3), 
            conference=str(i.conference), 
            division=str(i.division), 
            color=str(i.color), 
            alt_color=str(i.alt_color), 
            logos=i.logos, 
            twitter=str(i.twitter), 
            location=
                location(
            venue_id=i.venue_id, 
            name=str(i.name), 
            city=str(i.city), 
            state=str(i.state), 
            zip=str(i.zip), 
            country_code=str(i.country_code), 
            timezone=str(i.timezone), 
            latitude=i.latitude, 
            longitude=i.longitude, 
            elevation=i.elevation, 
            capacity=i.capacity, 
            year_constructed=i.year_constructed, 
            grass=i.grass, 
            dome=i.dome)
            
            ) for i in teams_df.itertuples()]
    return school_data

def school_by_name(school_name) -> school | None:
    url = f"https://api.collegefootballdata.com/teams/fbs"

    headers = {"Authorization": f"Bearer {token}"}

    teams_response = requests.get(url, headers=headers)

    teams_json = json.loads(teams_response.text)
    # print(teams_json)

    teams_df = pd.json_normalize(teams_json)

    teams_df = teams_df.fillna(value=0)

    teams_df['venue_id'] = teams_df['location.venue_id'].apply(lambda x: x)
    teams_df['name'] = teams_df['location.name'].apply(lambda x: x)
    teams_df['city'] = teams_df['location.city'].apply(lambda x: x)
    teams_df['state'] = teams_df['location.state'].apply(lambda x: x)
    teams_df['zip'] = teams_df['location.zip'].apply(lambda x: x)
    teams_df['country_code'] = teams_df['location.country_code'].apply(lambda x: x)
    teams_df['timezone'] = teams_df['location.timezone'].apply(lambda x: x)
    teams_df['latitude'] = teams_df['location.latitude'].apply(lambda x: x)
    teams_df['longitude'] = teams_df['location.longitude'].apply(lambda x: x)
    teams_df['elevation'] = teams_df['location.elevation'].apply(lambda x: x)
    teams_df['capacity'] = teams_df['location.capacity'].apply(lambda x: x)
    teams_df['year_constructed'] = teams_df['location.year_constructed'].apply(lambda x: x)
    teams_df['grass'] = teams_df['location.grass'].apply(lambda x: x)
    teams_df['dome'] = teams_df['location.dome'].apply(lambda x: x)

    teams_df.query(f'school == "{school_name}"', inplace = True)

    school_data = [school(
                id=str(i.id), 
                school=str(i.school), 
                mascot=str(i.mascot), 
                abbreviation=str(i.abbreviation), 
                alt_name_1=str(i.alt_name1),
                alt_name_2=str(i.alt_name2), 
                alt_name_3=str(i.alt_name3), 
                conference=str(i.conference), 
                division=str(i.division), 
                color=str(i.color), 
                alt_color=str(i.alt_color), 
                logos=i.logos, 
                twitter=str(i.twitter), 
                location=
                    location(
                venue_id=i.venue_id, 
                name=str(i.name), 
                city=str(i.city), 
                state=str(i.state), 
                zip=str(i.zip), 
                country_code=str(i.country_code), 
                timezone=str(i.timezone), 
                latitude=i.latitude, 
                longitude=i.longitude, 
                elevation=i.elevation, 
                capacity=i.capacity, 
                year_constructed=i.year_constructed, 
                grass=i.grass, 
                dome=i.dome)
                
                ) for i in teams_df.itertuples()]
    
    if school_data and school_data[0]:    
        return school_data[0]
    else:
        return None

def team_by_id(team_id):
    url = f"https://api.collegefootballdata.com/teams/fbs"

    headers = {"Authorization": f"Bearer {token}"}

    teams_response = requests.get(url, headers=headers)

    teams_json = json.loads(teams_response.text)
    # print(teams_json)

    teams_df = pd.json_normalize(teams_json)

    team = teams_df[teams_df['id'] == int(team_id)]
    team['venue_id'] = team['location.venue_id'].apply(lambda x: x)
    team['name'] = team['location.name'].apply(lambda x: x)
    team['city'] = team['location.city'].apply(lambda x: x)
    team['state'] = team['location.state'].apply(lambda x: x)
    team['zip'] = team['location.zip'].apply(lambda x: x)
    team['country_code'] = team['location.country_code'].apply(lambda x: x)
    team['timezone'] = team['location.timezone'].apply(lambda x: x)
    team['latitude'] = team['location.latitude'].apply(lambda x: x)
    team['longitude'] = team['location.longitude'].apply(lambda x: x)
    team['elevation'] = team['location.elevation'].apply(lambda x: x)
    team['capacity'] = team['location.capacity'].apply(lambda x: x)
    team['year_constructed'] = team['location.year_constructed'].apply(lambda x: x)
    team['grass'] = team['location.grass'].apply(lambda x: x)
    team['dome'] = team['location.dome'].apply(lambda x: x)

    if (team.empty):
        return None
    else:
        team_location = [location(
            venue_id=i.venue_id, 
            name=str(i.name), 
            city=str(i.city), 
            state=str(i.state), 
            zip=str(i.zip), 
            country_code=str(i.country_code), 
            timezone=str(i.timezone), 
            latitude=i.latitude, 
            longitude=i.longitude, 
            elevation=i.elevation, 
            capacity=i.capacity, 
            year_constructed=i.year_constructed, 
            grass=i.grass, 
            dome=i.dome
            ) for i in team.itertuples()]
        
        school_data = [school(
            id=str(i.id), 
            school=str(i.school), 
            mascot=str(i.mascot), 
            abbreviation=str(i.abbreviation), 
            alt_name_1=str(i.alt_name1),
            alt_name_2=str(i.alt_name2), 
            alt_name_3=str(i.alt_name3), 
            conference=str(i.conference), 
            division=str(i.division), 
            color=str(i.color), 
            alt_color=str(i.alt_color), 
            logos=i.logos, 
            twitter=str(i.twitter), 
            location=team_location[0]
            ) for i in team.itertuples()]
        return school_data[0]

def team_logos():
    url = f"https://api.collegefootballdata.com/teams/fbs"

    headers = {"Authorization": f"Bearer {token}"}

    teams_response = requests.get(url, headers=headers)

    teams_json = json.loads(teams_response.text)
    # print(teams_json)

    teams_df = pd.json_normalize(teams_json)
    teams_df['city'] = teams_df['location.city'].apply(lambda x: x)
    teams_df['state'] = teams_df['location.state'].apply(lambda x: x)
    print(teams_df)
    print(teams_df.itertuples())

    teams_list = [teamLogo(id=str(team.id), school=team.school, abbreviation=team.abbreviation, alt_name_1=team.alt_name1, 
                           alt_name_2=team.alt_name2, alt_name_3=team.alt_name3, city=team.city, state=team.state, logos=team.logos) for team in teams_df.itertuples()]
    
    return teams_list

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

def get_bkb_players_by_id(team_id, team_name):
    
    url = f'https://www.espn.com/mens-college-basketball/team/roster/_/id/{team_id}/'
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        html_content = response.text
    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}, team: {team_name}')
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
                    'team' : team_name
                })
    else:
        print(f'Roster table not found, id = {team_id}')
    if found_roster:
        return pd.DataFrame(players)
    else: 
        return pd.DataFrame(columns=["id","jersey","name","position","height","weight","year","team"])

def get_bkb_last_game_id(team):
  sched_df = s.get_team_schedule(team)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  sched_df = sched_df.query(f'datetime <= "{now.strftime("%Y-%m-%d")}"')

  sched_df.sort_values(by='datetime', inplace=True, ascending=False)

  sched_df.reset_index(drop=True, inplace=True)

  return int(sched_df.iloc[0]["game_id"])

def get_bkb_played_games(team_name, year):
  sched_df = s.get_team_schedule(team_name, year)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  return sched_df.query(f'datetime <= "{now.strftime("%Y-%m-%d")}"')

def findnth(haystack, needle, n):
    parts= haystack.split(needle, n+1)
    if len(parts)<=n+1:
        return -1
    return len(haystack)-len(parts[-1])-len(needle)

def bsb_team_schedule(team_name, year, bsbList : bsbPlayers):
  teams_df = bsbList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  
  try:
      
      
          driver = webdriver.Chrome()
      
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
                      last_W = row.rfind('W')
                      last_L = row.rfind('L')
                  
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
                  
                      if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
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
                      opp = row[findnth(row,' ',2):].strip()
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
              if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                opp = opp[:opp.find('(')].strip()
              
              games.append({"date": str(game_date), "opponent": elongate_name(opp), "home": home})
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
          opp_q = teams_df.query(f'name == "{games[index]['opponent']}"')

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

def bsb_last_game(team_name, bsbList : bsbPlayers):
  
  game_list = bsb_team_schedule(team_name, datetime.now().year, bsbList)

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
      game_list = bsb_team_schedule(team_name, datetime.now().year-1, bsbList)

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
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return last_game

def get_bsb_game_info(player_id, game_date, opp, position, name):
    
    try:
            driver = webdriver.Chrome()
            
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



        
            if tables[-1].text.split('\n')[0].find("Totals") != -1:
                table = tables[-2].text.split('\n')
                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
            else:
                table = tables[-1].text.split('\n')
                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
            
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
                #print(f'{current_team == opp=}')
                #print(f'{current_date == game_date=}')
                #print(f'{current_team.find(opp)=}')
                #print(f'{current_team=}')
                #print(f'{GP=}')
    
                
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
                        else:
                            #print('nonpitcher')
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
                            
                            HBP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[15]')
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

def get_bsb_season_info(player_id, year, position, name):
    try:
            driver = webdriver.Chrome()
            
                # Open the NCAA roster page
            driver.get(f"https://stats.ncaa.org/players/{player_id}")
    
            # Wait for the table to load
            wait = WebDriverWait(driver, 10)
            tables = driver.find_elements(By.TAG_NAME, "table")
            table = tables[1].text

            year_str = str(int(year) - 1) + '-' + str(year)[-2:]

            num_rows = table.count('-')
            #print(f'{num_rows=}')
            #print(f'{year_str=}')

            found_stats = False

            xml_path = '/html/body/div[2]/div/div/div/div/div/div[4]/div/div/div[2]/div/div[2]/div[2]/table/tbody'
            
            for index in range(1,num_rows+1):
                current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]/a')
                current_date = current_date_info.text
                
                
                #print(f'{current_date=}')
                
                if (current_date == year_str):
                    #print('found date')
                    found_stats = True
                

                    if position == 'P':
                            new_player_id = current_date_info.get_attribute("href").split("/")[-1]
                            #print(f'{new_player_id=}')
                            driver.get(f"https://stats.ncaa.org/players/{new_player_id}")
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
                            
                            saves_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[32]')
                            saves = saves_info.text
                            if saves == '':
                                saves = '0'
                            saves = float(saves.replace('/', ''))
                            
                            innings_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[6]')
                            innings = innings_info.text
                            if innings == '':
                                innings = '0'
                            innings = float(innings.replace('/', ''))
                            
                            ERA_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[10]')
                            earned_runs_allowed = ERA_info.text
                            if earned_runs_allowed == '':
                                earned_runs_allowed = '0'
                            earned_runs_allowed = float(earned_runs_allowed.replace('/', ''))
                    else:
                            #print('nonpitcher')
                            singles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                            singles = singles_info.text
                            if singles == '':
                                singles = '0'
                            singles = float(singles.replace('/', ''))
                            
                            doubles_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[10]')
                            doubles = doubles_info.text
                            if doubles == '':
                                doubles = '0'
                            doubles = float(doubles.replace('/', ''))
                            
                            triples_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[11]')
                            triples = triples_info.text
                            if triples == '':
                                triples = '0'
                            triples = float(triples.replace('/', ''))
                            
                            homers_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[13]')
                            homers = homers_info.text
                            if homers == '':
                                homers = '0'
                            homers = float(homers.replace('/', ''))
                            
                            runs_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                            runs = runs_info.text
                            if runs == '':
                                runs = '0'
                            runs = float(runs.replace('/', ''))
                            
                            RBI_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[14]')
                            runs_batted_in = RBI_info.text
                            if runs_batted_in == '':
                                runs_batted_in = '0'
                            runs_batted_in = float(runs_batted_in.replace('/', ''))
                            
                            walks_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[15]')
                            walks = walks_info.text
                            if walks == '':
                                walks = '0'
                            walks = float(walks.replace('/', ''))
                            
                            HBP_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[16]')
                            hits_by_pitch = HBP_info.text
                            if hits_by_pitch == '':
                                hits_by_pitch = '0'
                            hits_by_pitch = float(hits_by_pitch.replace('/', ''))
                            
                            stolen_bases_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[23]')
                            stolen_bases = stolen_bases_info.text
                            if stolen_bases == '':
                                stolen_bases = '0'
                            stolen_bases = float(stolen_bases.replace('/', ''))
                            
                            caught_stealing_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[21]')
                            caught_stealing = caught_stealing_info.text
                            if caught_stealing == '':
                                caught_stealing = '0'
                            caught_stealing = float(caught_stealing.replace('/', ''))
    
                            
                            saves = 0
                            innings = 0
                            earned_runs_allowed = 0
                            
            
            # Extract rows from the table
            #rows = table.text.split('\n')
    finally:
            # Close the browser
            driver.quit() 
            #pass
    
    if found_stats:
        gameStats = bsbStats(win=1, 
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
        print(f"Warning: stats not found for ID {player_id} for {year}")
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

def scc_team_schedule(team_name, year, sccList : sccPlayers):
  teams_df = sccList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  try:
      
      
          driver = webdriver.Chrome()
      
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
                      #print(f'{row.find('-')=}')
                      result_str = row[row.rfind('-')-2:row.rfind('-')+2]
                      #print(result_str)
                      
                      result_index = row.find(result_str)-1
                  
                      if result_index != -1:
                          opp = row[row.find(date)+len(date):result_index].strip()
                      else:
                          opp = row[row.find(date)+len(date):].strip()
                  
                      if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
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
                      opp = row[findnth(row,' ',2):].strip()
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
              if (opp.find(')') != -1) and (opp.find('(OH)') == -1):
                opp = opp[:opp.find('(')].strip()
              
              games.append({"date": str(game_date), "opponent": elongate_name(opp), "home": home})
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
          opp_q = teams_df.query(f'name == "{games[index]['opponent']}"')

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

def scc_last_game(team_name, sccList : sccPlayers):
  game_list = scc_team_schedule(team_name, datetime.now().year, sccList)

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
      game_list = scc_team_schedule(team_name, datetime.now().year-1, sccList)

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
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return last_game

def elongate_name(old_name : str) -> str:
    new_name = old_name
    
    if new_name[-3:] == "St.":
        new_name = "State".join(old_name.rsplit("St.", 1))
    
    new_name = new_name.replace("Mich.", "Michigan").replace("Fla.", "Florida").replace("Ga.", "Georgia")

    
    return new_name.replace("Ark.", "Arkansas").replace("Ky.", "Kentucky").replace("Ill.", "Illinois")

def get_scc_game_info(player_id, game_date, opp, position, name, resend):
    
    try:
            driver = webdriver.Chrome()
            
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



        
            if tables[-1].text.split('\n')[0].find("Totals") != -1:
                table = tables[-2].text.split('\n')
                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/div/div[2]/div[2]/table/tbody"
            else:
                table = tables[-1].text.split('\n')
                xml_path = "/html/body/div[2]/div/div/div/div/div/div[5]/div/div/div/div[2]/table/tbody"
            
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
                #print(f'{current_team == opp=}')
                #print(f'{current_date == game_date=}')
                #print(f'{current_team.find(opp)=}')
                #print(f'{current_team=}')
                #print(f'{GP=}')
    
                
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
                            
                            
                        else:
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
            return get_scc_game_info(player_id, game_date, opp, position, name, True)
    
    return gameStats

def get_scc_season_info(player_id, year, position, name):
    try:
            driver = webdriver.Chrome()
            
                # Open the NCAA roster page
            driver.get(f"https://stats.ncaa.org/players/{player_id}")
    
            # Wait for the table to load
            wait = WebDriverWait(driver, 10)
            tables = driver.find_elements(By.TAG_NAME, "table")
            table = tables[1].text

            year_str = str(int(year) - 1) + '-' + str(year)[-2:]

            num_rows = table.count('-')
            #print(f'{num_rows=}')
            #print(f'{year_str=}')

            found_stats = False

            xml_path = '/html/body/div[2]/div/div/div/div/div/div[4]/div/div/div[2]/div/div[2]/div[2]/table/tbody'
            
            for index in range(1,num_rows+1):
                current_date_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[1]/a')
                current_date = current_date_info.text
                
                
                #print(f'{current_date=}')
                
                if (current_date == year_str):
                    #print('found date')
                    found_stats = True
                

                    if position == 'GK':
                            #new_player_id = current_date_info.get_attribute("href").split("/")[-1]
                            #print(f'{new_player_id=}')
                            #driver.get(f"https://stats.ncaa.org/players/{new_player_id}")
                            
                            goals = 0
                            assists = 0
                            shots_onG = 0
                            shots_offG = 0
                            fouls = 0
                            yellows = 0
                            reds = 0
                            
                            
                            saves_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                            saves = saves_info.text
                            if saves == '':
                                saves = '0'
                            saves = float(saves.replace('/', ''))
                            
                            goals_allowed_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                            goals_allowed = goals_allowed_info.text
                            if goals_allowed == '':
                                goals_allowed = '0'
                            goals_allowed = float(goals_allowed.replace('/', ''))

                            if goals_allowed == 0:
                                clean_sheet = 1
                            else:
                                clean_sheet = 0
                    else:
                            #print('nonpitcher')
                            goals_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[4]')
                            goals = goals_info.text
                            if goals == '':
                                goals = '0'
                            goals = float(goals.replace('/', ''))
                            
                            assists_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[5]')
                            assists = assists_info.text
                            if assists == '':
                                assists = '0'
                            assists = float(assists.replace('/', ''))
                            
                            shots_onG_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[7]')
                            shots_onG = shots_onG_info.text
                            if shots_onG == '':
                                shots_onG = '0'
                            shots_onG = float(shots_onG.replace('/', ''))
                            
                            shots_all_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[6]')
                            shots_all = shots_all_info.text
                            if shots_all == '':
                                shots_all = '0'
                            shots_all = float(shots_all.replace('/', ''))

                            shots_offG = shots_all - shots_onG
                            
                            fouls_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[8]')
                            fouls = fouls_info.text
                            if fouls == '':
                                fouls = '0'
                            fouls = float(fouls.replace('/', ''))
                            
                            yellows_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[10]')
                            yellows = yellows_info.text
                            if yellows == '':
                                yellows = '0'
                            yellows = float(yellows.replace('/', ''))
                            
                            reds_info = driver.find_element(By.XPATH, xml_path + f'/tr[{index}]/td[9]')
                            reds = reds_info.text
                            if reds == '':
                                reds = '0'
                            reds = float(reds.replace('/', ''))
                            
    
                            
                            saves = 0
                            goals_allowed = 0
                            clean_sheet = 0
                            
            
            # Extract rows from the table
            #rows = table.text.split('\n')
    finally:
            # Close the browser
            driver.quit() 
            #pass
    
    if found_stats:
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
        print(f"Warning: stats not found for ID {player_id} for {year}")
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
        
    
    return gameStats

def generate_schedule(num_teams : int, num_weeks : int):
    
    if num_teams % 2 != 0:
        num_teams += 1  # Add a "bye" team

    teams = list(range(1, num_teams + 1))  # Numbered teams (bye included if needed)
    num_rounds = num_teams - 1  # Each team plays every other team once

    # Step 1: Create an initial round-robin schedule
    base_schedule = []
    for _ in range(num_rounds):
        week_matches = []
        for i in range(num_teams // 2):
            home, away = teams[i], teams[-(i + 1)]
            if (num_teams % 2 != 0) and (home == num_teams or away == num_teams):
                continue  # Ignore "bye" matches
            week_matches.append((home, away))
        base_schedule.append(week_matches)

        # Rotate teams, keeping the first team fixed
        teams = [teams[0]] + teams[-1:] + teams[1:-1]

    # Step 2: Ensure required weeks and avoid consecutive rematches
    schedule = []
    used_matchups = set()

    while len(schedule) < num_weeks:
        
        available_matches = [match for match in base_schedule if not set(match).intersection(used_matchups)]

        if not available_matches:  # If all are used, reshuffle to avoid consecutive repeats
            available_matches = base_schedule[:]
            used_matchups.clear()

        chosen_week = available_matches.pop(0)
        for match in chosen_week:
            used_matchups.add(match)
        schedule.append(chosen_week)

    return schedule[:num_weeks]  # Trim to exact num_weeks

