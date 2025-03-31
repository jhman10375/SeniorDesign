from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from api.managers.football_draft_manager import DraftManager
from api.models.CreateDraftData import CreateDraftData

router = APIRouter()
draft_manager = DraftManager()

# Endpoint to create a new draft
@router.post("/fb/create-draft")
async def create_draft(data: CreateDraftData):
    draft_key = draft_manager.create_draft(data)
    return {"draft_key": draft_key}


# WebSocket endpoint to handle drafts
@router.websocket("/fb/draft/{draft_key}")
async def websocket_endpoint(websocket: WebSocket, draft_key: str, username: str = None):
    # Check for valid draft key
    if draft_key not in draft_manager.draft_keys:
        await websocket.accept()  # Accept the connection first
        await websocket.send_json({"type": "error", "message": f"Invalid draft key: {draft_key}"})
        await websocket.close(code=1008, reason="Invalid draft key")  # Close with specific code
        return

    # Extract username from query parameter (if provided)
    if username is None:
        username = await draft_manager.get_anonymous_username()  # Generate anonymous username if missing

    # Connect user to draft
    connected_username = await draft_manager.connect(websocket, draft_key, username)

    # Broadcast connection event
    await draft_manager.broadcast(draft_key, {
        "type": "client_connected",
        "username": connected_username,
        "connected_users": draft_manager.draft_users[draft_key],
        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
        # "draft_order": draft_manager.get_draft_order(draft_key),
        # "pick_order": draft_manager.get_pick_order(draft_key),
        # "connected_users": list(draft_manager.client_usernames.values())
    })

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            if action == "select_player":
                athlete_id = data.get("athlete_id")
                player_id = data.get("player_id")
                if await draft_manager.select_player(draft_key, athlete_id, player_id):
                    await draft_manager.broadcast(draft_key, {
                        "type": "player_selected",
                        "player": athlete_id,
                        "selected_by": player_id,
                        "players": draft_manager.get_players(draft_key),
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "connected_users": draft_manager.draft_users[draft_key],
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Player '{player_id}' is already selected.",
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "connected_users": draft_manager.draft_users[draft_key],
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    })
            elif action == "get_draft_order":
                await draft_manager.broadcast(draft_key, {
                        "type": "get_draft_order",
                        "draft_order": draft_manager.get_draft_order(draft_key),
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "connected_users": draft_manager.draft_users[draft_key],
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    })
            elif action == "start_draft":
                draft_manager.start_draft(draft_key)
                await draft_manager.broadcast(draft_key, {
                        "type": "start_draft",
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "connected_users": draft_manager.draft_users[draft_key],
                        "draft_order": draft_manager.get_draft_order(draft_key),
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    })
            elif action == "update_draft_order":
                user_id = data.get("user_id")
                round = data.get("round")
                index = data.get("index")
                player_id = data.get("player_id")
                draft_manager.update_draft_order(draft_key, user_id, round, index, player_id)
                await draft_manager.broadcast(draft_key, {
                        "type": "draft_order_updated",
                        "draft_order": draft_manager.get_draft_order(draft_key),
                        "connected_users": draft_manager.draft_users[draft_key],
                        "draft_results": draft_manager.get_draft_results(draft_key),
                        "draft_athletes": draft_manager.get_players(draft_key),
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    })
            else:
                # Broadcast other types of updates
                await draft_manager.broadcast(
                    draft_key, {
                        "type": "update",
                        "username": connected_username,
                        "message": data,
                        "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                        "connected_users": draft_manager.draft_users[draft_key],
                        "pick_order": draft_manager.get_pick_order(draft_key),
                        # "connected_users": list(draft_manager.client_usernames.values())
                    }
                )
    except WebSocketDisconnect:
        draft_manager.disconnect(websocket, draft_key)
        await draft_manager.broadcast(
            draft_key, {
                "type": "client_disconnected",
                "username": connected_username,
                "allow_draft_entry": draft_manager.allow_draft_entry[draft_key],
                "connected_users": draft_manager.draft_users[draft_key]
                # "connected_users": list(draft_manager.client_usernames.values()),
            }
        )