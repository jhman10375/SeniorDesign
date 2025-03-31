class BasketballPlayerStats:
    user_id : str
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
    three_pointers: float
    two_pointers : float
    free_throws : float
    rebounds : float
    assists : float
    blocked_shots : float
    steals : float
    turnovers : float

    def __init__(self, player_id, player_name, player_position, player_jersey, player_height, player_weight, player_team, player_year, 
                 team_color, team_alt_color, team_logos, three_pointers, two_pointers, free_throws, rebounds, assists, blocked_shots, steals, 
                 turnovers):
        self.user_id = ""
        self.player_id = player_id
        self.player_name = player_name
        self.player_position = player_position
        self.player_jersey = player_jersey
        self.player_height = player_height
        self.player_weight = player_weight
        self.player_team = player_team
        self.player_year = player_year
        self.team_color = team_color
        self.team_alt_color = team_alt_color
        self.team_logos = team_logos
        self.three_pointers = three_pointers
        self.two_pointers = two_pointers
        self.free_throws = free_throws
        self.rebounds = rebounds
        self.assists = assists
        self.blocked_shots = blocked_shots
        self.steals = steals
        self.turnovers = turnovers

    def GetJSONData(self):
        return {"user_id": self.user_id,
                "player_id" : self.player_id,
                "player_name" : self.player_name,
                "player_position" : self.player_position,
                "player_jersey" : self.player_jersey,
                "player_height" : self.player_height,
                "player_weight" : self.player_weight,
                "player_team" : self.player_team,
                "player_year" : self.player_year,
                "team_color" : self.team_color,
                "team_alt_color" : self.team_alt_color,
                "team_logos" : self.team_logos,
                "three_pointers" : self.three_pointers,
                "two_pointers" : self.two_pointers,
                "free_throws" : self.free_throws,
                "rebounds" : self.rebounds,
                "assists" : self.assists,
                "blocked_shots" : self.blocked_shots,
                "steals" : self.steals,
                "turnovers" : self.turnovers
                }