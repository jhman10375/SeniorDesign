import datetime
from fastapi import APIRouter

from classes import Season, bbGame, playerList

from datetime import datetime
import pandas as pd
from classes import *
from functions import *

router = APIRouter()

fullList = playerList()

bsbList = bsbPlayers(fullList)

#BASEBALL ENDPOINTS

@router.get("/bsb/teams/{team_name}", tags=["Baseball", "Baseball - Team Info"])
async def get_baseball_schedule(team_name: str, season : Season) -> list[bbGame]:

  teams_df = bsbList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  year = season.value
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
              
              games.append({"date": str(game_date), "opponent": opp, "home": home})
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
          name = games[index]['opponent']
          opp_q = teams_df.query(f'name == "{name}"')

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


@router.get("/bsb/teams/{team_name}/last_game", tags=["Baseball", "Baseball - Team Info"])
async def get_last_baseball_game(team_name: str) -> bbGame:

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


@router.get("/bsb/teams/{team_name}/next_game", tags=["Baseball", "Baseball - Team Info"])
async def get_next_baseball_game(team_name: str) -> bbGame:

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

  games_df = games_df.query(f'start_date > "{datetime.now().strftime("%Y-%m-%d")}"')

  games_df.sort_values(by='start_date', inplace=True, ascending=True)

  games_df.reset_index(drop=True, inplace=True)

  next_game = bbGame(game_id=games_df.iloc[0]['game_id'], 
                      home_id=games_df.iloc[0]['home_id'], home_team=games_df.iloc[0]['home_team'], 
                      away_team=games_df.iloc[0]['away_team'], start_date=games_df.iloc[0]['start_date'])

  return next_game


@router.get("/bsb/teams/{team_name}/players", tags=["Baseball", "Baseball - Team Info"])
async def get_baseball_players(team_name : str, player_type = "None") -> list[bbPlayer]:
  teams_df = bsbList.teams  

  team_id = teams_df.query(f'name == "{team_name}"').iloc[0]['id']

  try:
      
      driver = webdriver.Chrome()
      
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
                            'height': height, 'bat': bat_hand, 'throw': throw_hand})
          
  finally:
      # Close the browser
      driver.quit() 

  team_info = bsbList.details.query(f'school == "{team_name}"')
  if team_info.empty:
      team_color = "#152532"
      team_alt = "#c8caca"
      team_logos = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
  else:
      team_info = team_info.iloc[0]
      team_color = team_info['color']
      team_alt = team_info['alt_color']
      team_logos = team_info['logos']



  return_list = []

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
      
      if player_type != 'None':
         if player['position'] == player_type:
          curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = height,
                          player_year=pl_year,
                          player_team = team_name,
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = team_color,
                          team_alt_color = team_alt,
                          team_logos = str(team_logos))
          return_list.append(curr)
      else:
        curr = bbPlayer(player_id=player["id"],
                        player_name=player["name"],
                        player_position=player["position"],
                        player_jersey = player['jersey'],
                        player_height = height,
                        player_year=pl_year,
                        player_team = team_name,
                        player_batting_hand = player['bat'],
                        player_throwing_hand = player['throw'],
                        team_color = team_color,
                        team_alt_color = team_alt,
                        team_logos = str(team_logos))
                      
                      
                      
        return_list.append(curr)
     

  return return_list                  


@router.get("/bsb/players/search/by_name/{player_name}", tags=["Baseball", "Baseball - Player Info"])
async def search_for_baseball_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[bbPlayer]:

  all_players = bsbList.players

  all_players["search_name"] = all_players["name"].str.lower()

  all_players = all_players[all_players["search_name"].str.contains(player_name.lower())]

  all_players = all_players.drop("search_name", axis=1)

  if player_team != "None":
      all_players.query(f'team == "{player_team}"', inplace = True)

  if player_type != "None":
      all_players.query(f'position == "{player_type}"', inplace = True)

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}
  
  all_players = all_players.fillna(nan_values)

  return_list = []

  for _, player in all_players.iterrows():
      curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)

  return return_list


@router.get("/bsb/players/search/by_id/{player_id}", tags=["Baseball", "Baseball - Player Info"])
async def search_for_baseball_players_by_id(player_id : int) -> bbPlayer:
  players_df = bsbList.players
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
              'position': "None Listed"}

  player_details = player_details.fillna(nan_values)

  return_player = bbPlayer(player_id=player_details["id"],
                        player_name=player_details["name"],
                        player_position=player_details["position"],
                        player_jersey = player_details['jersey'],
                        player_height = player_details['height'],
                        player_year=player_details['year'],
                        player_team = player_details['team'],
                        player_batting_hand = player_details['bat'],
                        player_throwing_hand = player_details['throw'],
                        team_color = player_details['color'],
                        team_alt_color = player_details['alt_color'],
                        team_logos = player_details['logos']) 
  
  return return_player


@router.get("/bsb/players/getall", tags=["Baseball", "Baseball - Player Info"])
async def get_all_baseball_players(page = 1, page_size= 100) -> list[bbPlayer]:
  players_df = bsbList.players

  start = (int(page) - 1)*int(page_size)

  end =  ((int(page) - 1)*int(page_size))+int(page_size)

  filtered_df = players_df[start:end]

  nan_values = {"throw": "None Listed", "bat": "None Listed", 
                'position': "None Listed"}

  filtered_df = filtered_df.fillna(nan_values)

  return_list = []

  for _, player in filtered_df.iterrows():
      curr = bbPlayer(player_id=player["id"],
                          player_name=player["name"],
                          player_position=player["position"],
                          player_jersey = player['jersey'],
                          player_height = player['height'],
                          player_year=player['year'],
                          player_team = player['team'],
                          player_batting_hand = player['bat'],
                          player_throwing_hand = player['throw'],
                          team_color = player['color'],
                          team_alt_color = player['alt_color'],
                          team_logos = player['logos'])
      return_list.append(curr)
  
  return return_list


@router.get("/bsb/player/{player_id}/stats/last_game", tags=["Baseball", "Baseball - Player Info"])
async def get_last_game_stats_for_baseball_player(player_id : int) -> bsbStats:
  players_df = bsbList.players
  player_details = players_df.query(f'id == {player_id}')
  
  try:
      player_details = player_details.iloc[0]
  except IndexError:
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
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")

  position = player_details['position']

  last_game = bsb_last_game(player_details['team'], bsbList)

  if last_game.home_team != player_details['team']:
      opp = last_game.home_team 
  else:
      opp = last_game.away_team

  game_year = int(last_game.start_date[:4])

  if game_year != datetime.now().year:
      print('Warning: Last game not played in the current season')

  stats = get_bsb_game_info(player_id, last_game.start_date, opp, position, player_details['name'])

  return stats


@router.get("/bsb/player/{player_id}/stats/full_year", tags=["Baseball", "Baseball - Player Info"])
async def get_baseball_player_season_stats(player_id : int, season : Season) -> bsbStats:
    players_df = bsbList.players
    player_details = players_df.query(f'id == {player_id}')
    
    try:
      player_details = player_details.iloc[0]
    except IndexError:
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
                             player_id=player_id,
                             player_name="Player ID not found",
                             player_position="NaN")
  

    return get_bsb_season_info(player_id,season.value,player_details['position'], player_details['name'])
