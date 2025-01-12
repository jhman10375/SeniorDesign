class DraftResultData:
    user_id: str
    round: int
    index: int
    player_id: str
    def __init__(self, user_id, round, index, player_id):
        self.user_id = user_id
        self.round = round
        self.index = index
        self.player_id = player_id

    def GetJSONData(self):
        return {"user_id": self.user_id, "round": self.round, "index": self.index, "player_id": self.player_id}