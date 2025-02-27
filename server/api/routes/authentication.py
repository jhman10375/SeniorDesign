from fastapi import APIRouter

import firebase_admin
from firebase_admin import auth

cred = firebase_admin.credentials.Certificate("../../../KEYS/college-sports-plus-firebase-adminsdk-lzjbm-98cd60e9d3.json")
authentication = firebase_admin.initialize_app(cred)

router = APIRouter()

@router.get("/user/{uid}", tags=["Authentication"])
async def verify_user(uid: str):
    try:
        decoded_token = auth.verify_id_token(uid)
        u = decoded_token['uid']
        print(decoded_token)
        print(u)
        # Optionally, you can access more user information like email, etc.
        return u
    except auth.InvalidIdTokenError:
        # Handle invalid ID token
        print(auth.InvalidIdTokenError)
        return None