from pydantic import BaseModel

class fbGame(BaseModel):

    game_id : int
    home_id : int
    home_team : str
    away_team : str
    start_date : str


class playerInfo(BaseModel):

    player_id : int
    player_name : str
    player_position : str
    player_jersey : int
    player_year : int
    

