from fastapi import APIRouter


router = APIRouter()

@app.get("/user/{uid}", tags=["Authentication"])
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