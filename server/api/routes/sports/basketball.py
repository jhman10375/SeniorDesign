import datetime
from fastapi import APIRouter

from classes import Season, bbGame, playerList, sccPlayers, sccStats
from functions import get_scc_game_info

from datetime import datetime
import pandas as pd
from classes import *
from functions import *
from utils.cbbpy_utils import _get_id_from_team

router = APIRouter()

fullList = playerList()

bkbList = bkbPlayers(fullList)

#BASKETBALL ENDPOINTS

@router.get("/bkb/teams/{team_name}", tags=["Basketball", "Basketball - Team Info"])
async def get_basketball_schedule(team_name: str, season : Season) -> list[fbGame]:
  
  game_list = s.get_team_schedule(team_name, season.value)
  
  return_list = []


  for row in game_list.iterrows():
      game_info = s.get_game_info(row[1]["game_id"])

      final_date = bkbPlayers.to_utc(row[1])

      curr_game = fbGame(game_id=row[1]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=final_date)
      
      return_list.append(curr_game)

  
  return return_list


@router.get("/bkb/teams/{team_name}/last_game", tags=["Basketball", "Basketball - Team Info"])
async def get_last_basketball_game(team_name: str) -> fbGame:
  sched_df = s.get_team_schedule(team_name)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  sched_df = sched_df.query(f'datetime <= "{now.strftime("%Y-%m-%d")}"')

  sched_df.sort_values(by='datetime', inplace=True, ascending=False)

  sched_df.reset_index(drop=True, inplace=True)

  game_info = s.get_game_info(sched_df.iloc[0]["game_id"])

  last_game = fbGame(game_id=sched_df.iloc[0]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=sched_df.iloc[0]["datetime"])

  return last_game


@router.get("/bkb/teams/{team_name}/next_game", tags=["Basketball", "Basketball - Team Info"])
async def get_next_basketball_game(team_name: str) -> fbGame:
  sched_df = s.get_team_schedule(team_name)
  
  sched_df["datetime"] = sched_df.apply(bkbPlayers.to_utc, axis=1)

  now = datetime.now()

  sched_df = sched_df.query(f'datetime > "{now.strftime("%Y-%m-%d")}"')

  sched_df.sort_values(by='datetime', inplace=True, ascending=True)

  sched_df.reset_index(drop=True, inplace=True)

  game_info = s.get_game_info(sched_df.iloc[0]["game_id"])

  next_game = fbGame(game_id=sched_df.iloc[0]["game_id"],
                        home_id=int(game_info["home_id"].iloc[0]),
                        home_team=game_info["home_team"].iloc[0],
                        away_team=game_info["away_team"].iloc[0],
                        start_date=sched_df.iloc[0]["datetime"])

  return next_game


@router.get("/bkb/teams/{team_name}/players", tags=["Basketball", "Basketball - Team Info"])
async def get_basketball_players(team_name : str, player_type = "None") -> list[playerInfo]:
  if not(fullList.populated):
          fullList.populate()

  team_list = fullList.getlist().copy()
  team_list.query(f'school == "{team_name}"', inplace = True)

  if team_list.empty:
    color = '#152532'
    alt_color = '#c8caca'
    logos = "[https://drive.google.com/drive-viewer/AKGpihaYb1Y1nEr1OtOU6402JARAiPa-6Moru1jZuz7Br_szY168Xq1E7MkBQHN6cMihX7ULokKQfUyKQP-JYZ05J_cdQ6JL1EKAPaM=w1920-h912]"
  else:   
    team_info = team_list.iloc[0]
    color = team_info["color"]
    alt_color = team_info["alt_color"]
    logos = str(team_info["logos"])

  team_id = _get_id_from_team(team_name, datetime.now().year, "mens")[0]

  url = f'https://www.espn.com/mens-college-basketball/team/roster/_/id/{team_id}/'
  headers = {'User-Agent': 'Mozilla/5.0'}
  response = requests.get(url, headers=headers)
  if response.status_code == 200:
      html_content = response.text
  else:
      print(f'Failed to retrieve the page. Status code: {response.status_code}')
  soup = BeautifulSoup(html_content, 'html.parser')
  roster_table = soup.find('table', {'class': 'Table'})
  if roster_table:
      players = []
      for row in roster_table.find_all('tr')[1:]:  # Skip the header row
          cols = row.find_all('td')
          if len(cols) >= 5:
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
                  'year' : year
              })
  else:
      print('Roster table not found.')

  players_df = pd.DataFrame(players)    

  if player_type != "None":
     players_df.query(f'position == "{player_type}"', inplace = True)


  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=team_info["school"],
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=color, 
                           team_alt_color=alt_color, team_logos=logos) for player in players_df.itertuples()] 


@router.get("/bkb/players/search/by_name/{player_name}", tags=["Basketball", "Basketball - Player Info"])
async def search_for_basketball_players_by_name(player_name : str, player_type = "None", player_team = "None") -> list[playerInfo]:
  players_df = bkbList.df
  filtered_df = players_df[players_df['name'].str.contains(player_name, case=False, na=False)]
  
  if player_type != "None":
     filtered_df = filtered_df.query(f'position == "{player_type}"')
  
  if player_team != "None":
     filtered_df = filtered_df.query(f'team == "{player_team}"')
  
  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=player.logos) for player in filtered_df.itertuples()] 


@router.get("/bkb/players/search/by_id/{player_id}", tags=["Basketball", "Basketball - Player Info"])
async def search_for_basketball_players_by_id(player_id : int) -> playerInfo:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  return playerInfo(player_id=player_details["id"], player_name=player_details["name"], 
                           player_jersey=player_details['jersey'], 
                           player_position=player_details['position'], 
                           player_team=player_details['team'],
                           player_height=player_details['height'], 
                           player_weight=player_details['weight'],
                           player_year=player_details['year'], 
                           team_color=player_details['color'], 
                           team_alt_color=player_details['alt_color'], 
                           team_logos=player_details['logos']) 


@router.get("/bkb/players/getall", tags=["Basketball", "Basketball - Player Info"])
async def get_all_basketball_players(page = 1, page_size= 100) -> list[playerInfo]:
  players_df = bkbList.df

  start = (int(page) - 1)*int(page_size)

  end =  ((int(page) - 1)*int(page_size))+int(page_size)

  filtered_df = players_df[start:end]
  
  return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=player.logos) for player in filtered_df.itertuples()] 


@router.get("/bkb/players/get_first_string", tags=["Basketball", "Basketball - Player Info"]) 
async def get_all_first_string_basketball_players(page = 1, page_size= 100) -> list[playerInfo]:

    start = (int(page) - 1)*int(page_size)

    end =  ((int(page) - 1)*int(page_size))+int(page_size)

    all_players = bkbList.first_string_df.copy()

    all_players = all_players[start:end]

    return [playerInfo(player_id=player.id, player_name=player.name, player_jersey=player.jersey, 
                           player_position=player.position, player_team=player.team,
                           player_height=player.height, player_weight=player.weight,
                           player_year=player.year, team_color=player.color, 
                           team_alt_color=player.alt_color, team_logos=str(player.logos)) for player in all_players.itertuples()]

@router.get("/bkb/player/{player_id}/stats/last_game", tags=["Basketball", "Basketball - Player Info"])
async def get_last_game_stats_for_basketball_player(player_id : int) -> bkbStats:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  last_game_id = get_bkb_last_game_id(player_details["team"])

  last_game_stats = s.get_game_boxscore(last_game_id)[['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to']]
  
  player_stats = last_game_stats.query(f'player_id == "{player_id}"')

  if player_stats.empty:
     return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=0,
                     two_pointers=0,
                     free_throws=0,
                     rebounds=0,
                     assists=0,
                     blocked_shots=0,
                     steals=0,
                     turnovers=0)

  else:
     player_stats = player_stats.iloc[0]
     return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=player_stats["3pm"],
                     two_pointers=player_stats["2pm"],
                     free_throws=player_stats["ftm"],
                     rebounds=player_stats["reb"],
                     assists=player_stats['ast'],
                     blocked_shots=player_stats['blk'],
                     steals=player_stats['stl'],
                     turnovers=player_stats['to'])


@router.get("/bkb/player/{player_id}/stats/full_year", tags=["Basketball", "Basketball - Player Info"])
async def get_basketball_player_season_stats(player_id : int, season : Season) -> bkbStats:
  players_df = bkbList.df
  player_details = players_df.query(f'id == {player_id}')
  player_details = player_details.iloc[0]

  played_games = get_bkb_played_games(player_details["team"], season.value)["game_id"].astype('int').values.tolist()

  stats_df = pd.DataFrame(columns=['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to'])
  
  for game in played_games:
    curr_game_stats = s.get_game_boxscore(game)[['player_id', '3pm', '2pm',
                                'ftm', 'reb', 'ast', 'blk', 'stl', 'to']]
    
    curr_stats = curr_game_stats.query(f'player_id == "{player_id}"')
    
    if not(curr_stats.empty):
        stats_df.loc[len(stats_df)] = curr_stats.iloc[0]

  return bkbStats(player_ID=player_id,
                     player_name=player_details["name"],
                     player_position=player_details["position"],
                     three_pointers=stats_df["3pm"].sum(),
                     two_pointers=stats_df["2pm"].sum(),
                     free_throws=stats_df["ftm"].sum(),
                     rebounds=stats_df["reb"].sum(),
                     assists=stats_df['ast'].sum(),
                     blocked_shots=stats_df['blk'].sum(),
                     steals=stats_df['stl'].sum(),
                     turnovers=stats_df['to'].sum())
