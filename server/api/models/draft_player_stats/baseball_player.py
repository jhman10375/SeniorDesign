class BaseballPlayerStats:
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

    def __init__(self, player_id, player_name, player_position, player_jersey, player_height, player_weight, player_team, player_year, 
                 team_color, team_alt_color, team_logos, pass_TD, pass_yds, interceptions, fumbles_lost, rush_yds, rush_TD, reception_yds, 
                 reception_TD, receptions, extra_points, extra_points_missed, field_goals, field_goals_missed):
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
        self.pass_TD = pass_TD
        self.pass_yds = pass_yds
        self.interceptions = interceptions
        self.fumbles_lost = fumbles_lost
        self.rush_yds = rush_yds
        self.rush_TD = rush_TD
        self.reception_yds = reception_yds
        self.reception_TD = reception_TD
        self.receptions = receptions
        self.extra_points = extra_points
        self.extra_points_missed = extra_points_missed
        self.field_goals = field_goals
        self.field_goals_missed = field_goals_missed

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
                "pass_TD" : self.pass_TD,
                "pass_yds" : self.pass_yds,
                "interceptions" : self.interceptions,
                "fumbles_lost" : self.fumbles_lost,
                "rush_yds" : self.rush_yds,
                "rush_TD" : self.rush_TD,
                "reception_yds" : self.reception_yds,
                "reception_TD" : self.reception_TD,
                "receptions" : self.receptions,
                "extra_points" : self.extra_points,
                "extra_points_missed" : self.extra_points_missed,
                "field_goals" : self.field_goals,
                "field_goals_missed" : self.field_goals_missed,
                }