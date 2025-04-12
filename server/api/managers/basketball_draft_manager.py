from typing import Dict, List
from fastapi import WebSocket
import uuid
import random

from pandas import DataFrame
import pandas as pd

from api.models.CreateDraftData import CreateDraftData
from api.models.DraftOrderData import DraftOrderData
from api.models.DraftResultData import DraftResultData
#from api.models.DraftPlayerData import DraftPlayerData
from classes import bkbPlayerWithStats, bkbPlayers, firstStringList, playerInfo, playerList
from functions import bkb_first_string_info_with_predictions
from api.models.draft_player_stats.basketball_player import BasketballPlayerStats

class DraftManager:
    def __init__(self):
        self.active_drafts: Dict[str, List[WebSocket]] = {}
        self.client_usernames: Dict[str, str] = {}
        self.draft_keys: Dict[str, str] = {}
        self.draft_users: Dict[str, List[str]] = {}
        self.draft_userIDs: Dict[str, List[str]] = {}
        self.draft_type: Dict[str, int] = {}
        self.draft_num_rounds: Dict[str, int] = {}
        self.allow_draft_entry: Dict[str, bool] = {}
        self.draft_orders: Dict[str, List[DraftOrderData]] = {}
        self.pick_orders: Dict[str, List[DraftOrderData]] = {}
        self.draft_results: Dict[str, List[DraftResultData]] = {}
        self.players: Dict[str, List[BasketballPlayerStats]] = {}

    def create_draft(self, data: CreateDraftData) -> str:
        """Generate a unique 6-digit numeric draft key."""
        while True:
            draft_key = "".join([str(random.randint(0, 9)) for _ in range(6)])
            if draft_key not in self.draft_keys:
                self.draft_keys[draft_key] = draft_key
                self.allow_draft_entry[draft_key] = False
                self.draft_users[draft_key] = []
                self.draft_orders[draft_key] = []
                self.pick_orders[draft_key] = []
                self.draft_results[draft_key] = []
                # self.players[draft_key] = [
                #     {"id": "0", "name": "John Smith", "number": "55", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "1", "name": "Gene Smith", "number": "1", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                #     {"id": "2", "name": "Jack Smith", "number": "2", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "3", "name": "Jeff Smith", "number": "3", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                #     {"id": "4", "name": "Jacksn Smith", "number": "4", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "5", "name": "Andrew Smith", "number": "5", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                #     {"id": "6", "name": "Jason Smith", "number": "6", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "7", "name": "Anthony Smith", "number": "7", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                #     {"id": "8", "name": "Alex Smith", "number": "8", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "9", "name": "Andy Smith", "number": "9", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                #     {"id": "10", "name": "Austin Smith", "number": "10", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                #     {"id": "11", "name": "Adam Smith", "number": "11", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                # ]
                self.draft_num_rounds[draft_key] = data.number_of_rounds
                self.draft_userIDs[draft_key] = data.user_ids
                self.draft_type[draft_key] = data.draft_type
                self.generate_players(draft_key)
                # self.generate_draft_order(draft_key, data)
                return draft_key
    
    def generate_players(self, draft_key):
        fullList = playerList()
        pl: bkbPlayers = bkbPlayers(fullList)
        # fsl: firstStringList = firstStringList(pl)
        fsls: list[bkbPlayerWithStats] = bkb_first_string_info_with_predictions(pl,1,9999999)
        generatedAthletes = []
        # if (fsl.populated):
        # athletes = fsl.getlist().to_dict('records')
        # athletes = pd.DataFrame(fsls).to_dict('records')
        # for athlete in athletes:
        #     # a: DraftPlayerData = DraftPlayerData(**athlete)
        #     athlete['user_id']= None
        #     generatedAthletes.append(athlete)
        #     # athletes = fsl.getlist().to_dict('records')
        #     # for athlete in athletes:
        #     #     # a: DraftPlayerData = DraftPlayerData(**athlete)
        #     #     athlete['user_id']= None
        #     #     generatedAthletes.append(athlete)

        self.players[draft_key] = list(map(lambda x: BasketballPlayerStats(
            x.player_id,
            x.player_name,
            x.player_position,
            x.player_jersey,
            x.player_height,
            x.player_weight,
            x.player_team,
            x.player_year,
            x.team_color,
            x.team_alt_color,
            x.team_logos,
            x.stats.three_pointers,
            x.stats.two_pointers,
            x.stats.free_throws,
            x.stats.rebounds,
            x.stats.assists,
            x.stats.blocked_shots,
            x.stats.steals,
            x.stats.turnovers
            ), fsls))
        # self.players[draft_key] = generatedAthletes
            # print(generatedAthletes)
            
    def generate_draft_order(self, draft_key, data: CreateDraftData) -> Dict[str, int]:
        match data.draft_type:
            case 0:
                random.shuffle(data.user_ids)
                og_list = data.user_ids.copy()
                og_list.reverse()
                for i in range(0,data.number_of_rounds):
                    reverse_order = i % 2 == 1
                    if (reverse_order):
                        for index, x in enumerate(data.user_ids):
                            d: DraftOrderData = DraftOrderData(x, i, index)
                            self.draft_orders[draft_key].append(d)
                    else:
                        for index, x in enumerate(og_list):
                            d: DraftOrderData = DraftOrderData(x, i, index)
                            self.draft_orders[draft_key].append(d)
            case 1:
                random.shuffle(data.user_ids)
                for i in range(0,data.number_of_rounds):
                    for index, x in enumerate(data.user_ids):
                        d: DraftOrderData = DraftOrderData(x, i, index)
                        self.draft_orders[draft_key].append(d)
        
        self.pick_orders[draft_key] = [d for d in self.draft_orders[draft_key] if d.round == 0]
        return self.draft_orders[draft_key]
    
    def generate_draft_order2(self, draft_key) -> Dict[str, int]:
        match self.draft_type[draft_key]:
            case 0:
                random.shuffle(self.draft_userIDs[draft_key])
                og_list = self.draft_userIDs[draft_key].copy()
                og_list.reverse()
                for i in range(0,self.draft_num_rounds[draft_key]):
                    reverse_order = i % 2 == 1
                    if (reverse_order):
                        for index, x in enumerate(self.draft_userIDs[draft_key]):
                            d: DraftOrderData = DraftOrderData(x, i, index)
                            self.draft_orders[draft_key].append(d)
                    else:
                        for index, x in enumerate(og_list):
                            d: DraftOrderData = DraftOrderData(x, i, index)
                            self.draft_orders[draft_key].append(d)
            case 1:
                random.shuffle(self.draft_userIDs[draft_key])
                for i in range(0,self.draft_num_rounds[draft_key]):
                    for index, x in enumerate(self.draft_userIDs[draft_key]):
                        d: DraftOrderData = DraftOrderData(x, i, index)
                        self.draft_orders[draft_key].append(d)
        
        self.pick_orders[draft_key] = [d for d in self.draft_orders[draft_key] if d.round == 0]
        return self.draft_orders[draft_key]

    def get_players(self, draft_key) -> Dict[str, any]:
        """Return JSON serialized pick_order"""
        return [obj.GetJSONData() for obj in self.players[draft_key]]
    
    def get_pick_order(self, draft_key) -> Dict[str, any]:
        """Return JSON serialized pick_order"""
        return [obj.GetJSONData() for obj in self.pick_orders[draft_key]]
    
    def get_draft_order(self, draft_key) -> Dict[str, any]:
        """Return JSON serialized draft_order"""
        return [obj.GetJSONData() for obj in self.draft_orders[draft_key]]
    
    def get_draft_results(self, draft_key) -> Dict[str, any]:
        """Return JSON serialized draft_result"""
        return [obj.GetJSONData() for obj in self.draft_results[draft_key]]

    def update_draft_order(self, draft_key, user_id, round, index, player_id):
        """Remove the previous user"""
        d: DraftOrderData = DraftOrderData(user_id, round, index)
        for x in self.draft_orders[draft_key]:
            if d.index == x.index and d.round == x.round and d.user_id == x.user_id:
                self.update_draft_results(draft_key, d, player_id)
                self.draft_orders[draft_key].remove(x)

    def update_draft_results(self, draft_key, draftOrderData: DraftOrderData, player_id):
        """Return draft results"""
        d: DraftResultData = DraftResultData(draftOrderData.user_id,draftOrderData.round, draftOrderData.index, player_id)
        self.draft_results[draft_key].append(d)

    def get_anonymous_username(self) -> str:
        """Generate a short, unique anonymous username."""
        return str(uuid.uuid4())[:8]
    
    def start_draft(self, draft_key: str) -> bool:
        self.allow_draft_entry[draft_key] = True
        self.generate_draft_order2(draft_key)
        return True

    async def connect(self, websocket: WebSocket, draft_key: str, username: str = None):
        await websocket.accept()
        if draft_key not in self.active_drafts:
            self.active_drafts[draft_key] = []
        self.active_drafts[draft_key].append(websocket)

        # If no username is provided, generate an anonymous one
        if username is None:
            username = self.get_anonymous_username()

        # Check for duplicate connections (refresh handler)
        if draft_key in self.draft_users and username not in self.draft_users[draft_key]:
            self.draft_users[draft_key].append(username)
            self.client_usernames[id(websocket)] = username
        elif draft_key in self.draft_users:
            keys_to_remove = [key for key, value in self.client_usernames.items() if value == username]
            for key in keys_to_remove:
                del self.client_usernames[key]
            
            self.client_usernames[id(websocket)] = username
        # Send list of players and currently connected users to the new client
        await websocket.send_json({
            "type": "players_list",
            "players": self.get_players(draft_key),
            "connected_users": self.draft_users[draft_key]
        })
        return username

    def disconnect(self, websocket: WebSocket, draft_key: str):
        """Disconnect a client and clean up resources."""
        self.active_drafts[draft_key].remove(websocket)
        del self.client_usernames[id(websocket)]

    async def select_player(self, draft_key: str, athlete_id: str, player_id: str):
        """Mark a player as selected by a user and notify others."""
        for player in self.get_players(draft_key):

            if player["player_id"] == athlete_id and player["user_id"] is None:
                player["user_id"] = player_id
                return True  # Successfully selected player
        return False  # Player already selected

    async def broadcast(self, draft_key: str, message: dict):
        """Broadcast a message to all clients in a draft."""
        for connection in self.active_drafts.get(draft_key, []):
            await connection.send_json(message)
