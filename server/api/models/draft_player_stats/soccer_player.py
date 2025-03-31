class SoccerPlayerStats:
    user_id : str
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

    def __init__(self, player_id, player_name, player_position, player_jersey, player_height, player_team, player_year, 
                 team_color, team_alt_color, team_logos, goals, assists, shots_on_goal, shots_off_goal, fouls, yellow_cards, red_cards, clean_sheet, 
                 goals_allowed, saves):
        self.user_id = ""
        self.player_id = player_id
        self.player_name = player_name
        self.player_position = player_position
        self.player_jersey = player_jersey
        self.player_height = player_height
        self.player_team = player_team
        self.player_year = player_year
        self.team_color = team_color
        self.team_alt_color = team_alt_color
        self.team_logos = team_logos
        self.goals = goals
        self.assists = assists
        self.shots_on_goal = shots_on_goal
        self.shots_off_goal = shots_off_goal
        self.fouls = fouls
        self.yellow_cards = yellow_cards
        self.red_cards = red_cards
        self.clean_sheet = clean_sheet
        self.goals_allowed = goals_allowed
        self.saves = saves

    def GetJSONData(self):
        return {"user_id": self.user_id,
                "player_id" : self.player_id,
                "player_name" : self.player_name,
                "player_position" : self.player_position,
                "player_jersey" : self.player_jersey,
                "player_height" : self.player_height,
                "player_team" : self.player_team,
                "player_year" : self.player_year,
                "team_color" : self.team_color,
                "team_alt_color" : self.team_alt_color,
                "team_logos" : self.team_logos,
                "goals" : self.goals,
                "assists" : self.assists,
                "shots_on_goal" : self.shots_on_goal,
                "shots_off_goal" : self.shots_off_goal,
                "fouls" : self.fouls,
                "yellow_cards" : self.yellow_cards,
                "red_cards" : self.red_cards,
                "clean_sheet" : self.clean_sheet,
                "goals_allowed" : self.goals_allowed,
                "saves" : self.saves,
                }