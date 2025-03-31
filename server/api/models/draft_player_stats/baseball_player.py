class BaseballPlayerStats:
    user_id : str
    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_height : int
    player_team : str
    player_year : int
    team_color : str
    team_alt_color : str
    team_logos : str
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

    def __init__(self, player_id, player_name, player_position, player_jersey, player_height, player_team, player_year, 
                 team_color, team_alt_color, team_logos, win, saves, innings, earned_runs_allowed, singles, doubles, triples, 
                 homers, runs, runs_batted_in, walks, hits_by_pitch, stolen_bases, caught_stealing):
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
        self.win = win
        self.saves = saves
        self.innings = innings
        self.earned_runs_allowed = earned_runs_allowed
        self.singles = singles
        self.doubles = doubles
        self.triples = triples
        self.homers = homers
        self.runs = runs
        self.runs_batted_in = runs_batted_in
        self.walks = walks
        self.hits_by_pitch = hits_by_pitch
        self.stolen_bases = stolen_bases
        self.caught_stealing = caught_stealing

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
                "win" : self.win,
                "saves" : self.saves,
                "innings" : self.innings,
                "earned_runs_allowed" : self.earned_runs_allowed,
                "singles" : self.singles,
                "doubles" : self.doubles,
                "triples" : self.triples,
                "homers" : self.homers,
                "runs" : self.runs,
                "runs_batted_in" : self.runs_batted_in,
                "walks" : self.walks,
                "hits_by_pitch" : self.hits_by_pitch,
                "stolen_bases" : self.stolen_bases,
                "caught_stealing" : self.caught_stealing,
                }