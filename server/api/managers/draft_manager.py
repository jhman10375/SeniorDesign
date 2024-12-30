from typing import Dict, List
from fastapi import WebSocket
import uuid
import random

from api.models.CreateDraftData import CreateDraftData
from api.models.DraftOrderData import DraftOrderData

class DraftManager:
    def __init__(self):
        self.active_drafts: Dict[str, List[WebSocket]] = {}
        self.client_usernames: Dict[str, str] = {}
        self.draft_keys: Dict[str, str] = {}
        self.draft_users: Dict[str, List[str]] = {}
        self.draft_orders: Dict[str, List[DraftOrderData]] = {}
        self.players: Dict[str, List[str]] = {}  # List of players for each draft

    def create_draft(self, data: CreateDraftData) -> str:
        """Generate a unique 6-digit numeric draft key."""
        while True:
            draft_key = "".join([str(random.randint(0, 9)) for _ in range(6)])
            if draft_key not in self.draft_keys:
                self.draft_keys[draft_key] = draft_key
                self.draft_users[draft_key] = []
                self.draft_orders[draft_key] = []
                self.players[draft_key] = [
                    {"id": "0", "name": "John Smith", "number": "55", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "1", "name": "Gene Smith", "number": "1", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                    {"id": "2", "name": "Jack Smith", "number": "2", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "3", "name": "Jeff Smith", "number": "3", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                    {"id": "4", "name": "Jacksn Smith", "number": "4", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "5", "name": "Andrew Smith", "number": "5", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                    {"id": "6", "name": "Jason Smith", "number": "6", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "7", "name": "Anthony Smith", "number": "7", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                    {"id": "8", "name": "Alex Smith", "number": "8", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "9", "name": "Andy Smith", "number": "9", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                    {"id": "10", "name": "Austin Smith", "number": "10", "player_id": None, "school": {"id": "1", "name": "The Ohio State University", "primary_color": "#ba0c2f", "secondary_color": "grey"}},
                    {"id": "11", "name": "Adam Smith", "number": "11", "player_id": None, "school": {"id": "0", "name": "University of Cincinnati", "primary_color": "red", "secondary_color": "black"}},
                ]
                self.generate_draft_order(draft_key, data)
                return draft_key
            
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
        return self.draft_orders[draft_key]
    
    def get_draft_order(self, draft_key) -> Dict[str, any]:
        """Return JSON serialized draft_order"""
        return [obj.GetJSONData() for obj in self.draft_orders[draft_key]]

    def update_draft_order(self, draft_key, user_id, round, index):
        """Remove the previous user"""
        d: DraftOrderData = DraftOrderData(user_id, round, index)
        for x in self.draft_orders[draft_key]:
            if d.index == x.index and d.round == x.round and d.user_id == x.user_id:
                self.draft_orders[draft_key].remove(x)

    def get_anonymous_username(self) -> str:
        """Generate a short, unique anonymous username."""
        return str(uuid.uuid4())[:8]

    async def connect(self, websocket: WebSocket, draft_key: str, username: str = None):
        await websocket.accept()
        if draft_key not in self.active_drafts:
            self.active_drafts[draft_key] = []
        self.active_drafts[draft_key].append(websocket)

        # If no username is provided, generate an anonymous one
        if username is None:
            username = self.get_anonymous_username()

        if draft_key in self.draft_users:
            self.draft_users[draft_key].append(username)
        self.client_usernames[id(websocket)] = username
        # Send list of players and currently connected users to the new client
        await websocket.send_json({
            "type": "players_list",
            "players": self.players[draft_key],
            "connected_users": self.draft_users[draft_key]
        })
        return username

    def disconnect(self, websocket: WebSocket, draft_key: str):
        """Disconnect a client and clean up resources."""
        self.active_drafts[draft_key].remove(websocket)
        del self.client_usernames[id(websocket)]

    async def select_player(self, draft_key: str, athlete_id: str, player_id: str):
        """Mark a player as selected by a user and notify others."""
        for player in self.players[draft_key]:
            if player["id"] == athlete_id and player["player_id"] is None:
                player["player_id"] = player_id
                return True  # Successfully selected player
        return False  # Player already selected

    async def broadcast(self, draft_key: str, message: dict):
        """Broadcast a message to all clients in a draft."""
        for connection in self.active_drafts.get(draft_key, []):
            await connection.send_json(message)