class DraftOrderData:
    user_id: str
    round: int
    index: int
    def __init__(self, user_id, round, index):
        self.user_id = user_id
        self.round = round
        self.index = index

    def GetJSONData(self):
        return {"user_id": self.user_id, "round": self.round, "index": self.index}