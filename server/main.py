from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.routes.draft import router as draft_router
from api.routes.sports.soccer import router as soccer_router
from api.routes.sports.baseball import router as baseball_router
from api.routes.sports.basketball import router as basketball_router
from api.routes.sports.football import router as football_router
from api.routes.leagueTools import router as league_tools
from api.routes.authentication import router as authentication_router

import os
from classes import *
from functions import *
from dotenv import load_dotenv

fullList = playerList()

load_dotenv()
token = os.getenv("CFBD_TOKEN")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/lists/repopulate")
async def repopulate_player_lists():
    fullList.populate()
    print("Football Players done")
    app.route(football_router).firstStrings.populate()
    print("Football First Stringers done")
    app.route(basketball_router).bkbList.populate()
    print("Basketball Players done")
    app.route(basketball_router).bkbList.populate_first_string()
    print("Basketball First Stringers done")
    app.route(baseball_router).bsbList.populate()
    print("Baseball Teams done")
    app.route(baseball_router).bsbList.populate_players()
    print("Baseball Players done")
    app.route(soccer_router).sccList.populate()
    print("Soccer Teams done")


    if (fullList.populated and app.route(football_router).firstStrings.populated 
        and app.route(basketball_router).bkbList.populated and app.route(basketball_router).bkbList.first_string_populated
        and app.route(baseball_router).bsbList.populated and app.route(baseball_router).bsbList.players_populated
        and app.route(soccer_router).sccList.populated):
       return "All lists populated!"
    else:
       return "Something went wrong"


@app.get("/status")
async def get_status():
    return({
        'status': 'connected',
        'api': f"{token}",
        'hello': 'hello'
    })



app.include_router(draft_router, tags=["Draft"])
app.include_router(authentication_router, tags=["Authentication"])
app.include_router(football_router, tags=["Football"])
app.include_router(basketball_router, tags=["Basketball"])
app.include_router(baseball_router, tags=["Baseball"])
app.include_router(soccer_router, tags=["Soccer"])
app.include_router(league_tools, tags=["League-Tools"])

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.200.36", port=8000)