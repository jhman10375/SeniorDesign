
from fastapi import APIRouter

from classes import SchedMatch, SchedWeek
from functions import generate_schedule


router = APIRouter()


@router.get("/league-tools/generate_schedule/", tags=["League Tools"])
async def generate_league_schedule(num_teams = 8, num_weeks = 10) -> list[SchedWeek]:
   
   schedule = generate_schedule(int(num_teams), int(num_weeks))

   return_sched = []
   for week_number, matches in enumerate(schedule, start=1):
        #print(f"Week {week_number}:")
        match_list = []
        for curr_match in matches:
            home = curr_match[0]
            away = curr_match[1]
            if home > int(num_teams):
                home = "Bye"
            else:
                home = f"{home}"
            if away > int(num_teams):
                away = "Bye"
            else:
                away = f"{away}"    
            #print(f"  {home} vs {away}")
            match_list.append(SchedMatch(home=home, away=away))
        return_sched.append(SchedWeek(week_num=week_number, week_matches=match_list))

   return return_sched