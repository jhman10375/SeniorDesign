from typing import List
from pydantic import BaseModel


class CreateDraftData(BaseModel):
    user_ids: List[str]
    draft_type: int
    number_of_rounds: int